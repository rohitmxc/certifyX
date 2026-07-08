import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { batchName, templateId, organizationId, records } = body;

    if (!batchName || !records || !Array.isArray(records)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Default Org for demo if no auth
    let targetOrgId = organizationId;
    if (!targetOrgId) {
      const defaultOrg = await prisma.organization.findFirst();
      if (!defaultOrg) return NextResponse.json({ error: "No organization found" }, { status: 400 });
      targetOrgId = defaultOrg.id;
    }

    // Create the Batch
    const batch = await prisma.certificateBatch.create({
      data: {
        name: batchName,
        organizationId: targetOrgId,
        templateId: templateId || undefined, // Note: templateId is required by schema, but we might fake it if none exists
      }
    });

    // Create Certificates in bulk, hashing their dynamic data
    const certificatesToCreate = records.map((record: any) => {
      // Create a deterministic hash for this student's data (simulating Soroban payload)
      const dataString = JSON.stringify(record);
      const hash = crypto.createHash("sha256").update(dataString).digest("hex");
      
      return {
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
