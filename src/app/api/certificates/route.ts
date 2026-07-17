import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { credentialId, email, name, eventName, date, transactionHash } = body;

    if (!credentialId || !transactionHash) {
      return NextResponse.json({ error: 'Missing required credential data' }, { status: 400 });
    }

    // MVP: Find or create a default organization and template
    let org = await prisma.organization.findFirst();
    if (!org) {
      org = await prisma.organization.create({
        data: { name: 'Default Organization' }
      });
    }

    let template = await prisma.template.findFirst({ where: { organizationId: org.id } });
    if (!template) {
      template = await prisma.template.create({
        data: {
          organizationId: org.id,
          name: 'Default Template',
          designJson: '{}',
          customFields: '[]'
        }
      });
    }

    // Find or create a 'Manual Issuances' batch for this organization
    let batch = await prisma.certificateBatch.findFirst({
      where: { organizationId: org.id, name: 'Manual Issuances' }
    });

    if (!batch) {
      batch = await prisma.certificateBatch.create({
        data: {
          organizationId: org.id,
          templateId: template.id,
          name: 'Manual Issuances',
        }
      });
    }

    // Store the certificate record
    const certificate = await prisma.certificate.create({
      data: {
        id: credentialId,
        batchId: batch.id,
        recipientEmail: email || 'No email provided',
        dynamicData: JSON.stringify({ name, eventName, date, type: 'Manual' }),
        dataHash: transactionHash, // Re-using dataHash field to store tx hash for the MVP
        status: 'Active',
      }
    });

    return NextResponse.json({ success: true, certificate });
  } catch (error) {
    console.error('Failed to save certificate:', error);
    return NextResponse.json({ error: 'Internal server error while saving certificate' }, { status: 500 });
  }
}
