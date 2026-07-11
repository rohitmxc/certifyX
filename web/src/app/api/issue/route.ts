import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { batchName, templateId, organizationId, records, globalFields } = body;

    if (!batchName || !records || !Array.isArray(records)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Default Org for demo if no auth
    let targetOrgId = organizationId;
    if (!targetOrgId) {
      let defaultOrg = await prisma.organization.findFirst();
      if (!defaultOrg) {
        defaultOrg = await prisma.organization.create({
          data: {
            name: "Stellar Community",
            wallet: "G_DEMO_WALLET"
          }
        });
      }
      targetOrgId = defaultOrg.id;
    }

    let targetTemplateId = templateId;
    let templateExists = false;

    if (targetTemplateId) {
      const existingTemplate = await prisma.template.findUnique({ where: { id: targetTemplateId } });
      if (existingTemplate) {
        templateExists = true;
      }
    }

    if (!templateExists) {
      let defaultTemplate = await prisma.template.findFirst({ where: { organizationId: targetOrgId } });
      if (!defaultTemplate) {
        defaultTemplate = await prisma.template.create({
          data: {
            organizationId: targetOrgId,
            name: 'Default Template',
            designJson: '{}',
            customFields: '[]'
          }
        });
      }
      targetTemplateId = defaultTemplate.id;
    }

    // Create the Batch
    const batch = await prisma.certificateBatch.create({
      data: {
        name: batchName,
        organizationId: targetOrgId,
        templateId: targetTemplateId,
      }
    });

    // Create Certificates in bulk, hashing their dynamic data
    const certificatesToCreate = records.map((record: any) => {
      // Merge CSV record with global fields from the UI
      const mergedData = { ...globalFields, ...record };
      
      // Create a deterministic hash for this student's data (simulating Soroban payload)
      const dataString = JSON.stringify(mergedData);
      const hash = crypto.createHash("sha256").update(dataString).digest("hex");
      
      const niceId = `CX-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      return {
        id: niceId,
        batchId: batch.id,
        recipientEmail: record.email || record.studentEmail || "unknown@example.com",
        dynamicData: dataString,
        dataHash: hash,
        status: "Active"
      };
    });

    await prisma.certificate.createMany({
      data: certificatesToCreate
    });

    const createdCertificates = await prisma.certificate.findMany({
      where: { batchId: batch.id }
    });

    return NextResponse.json({
      success: true,
      batchId: batch.id,
      hashes: createdCertificates.map((c: any) => c.dataHash),
      count: createdCertificates.length
    }, { status: 201 });

  } catch (error) {
    console.error("Failed to process batch issuance:", error);
    return NextResponse.json({ error: "Failed to process batch issuance" }, { status: 500 });
  }
}
