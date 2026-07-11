import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const certificates = await prisma.certificate.findMany({
      take: 10,
      orderBy: { issuedAt: 'desc' },
      select: { dataHash: true, id: true }
    });

    const hashes = certificates.map(c => {
      // Prioritize the actual blockchain hash, or fallback to the credential ID
      const val = c.dataHash || c.id;
      // Format it nicely like "7F3A...9B21"
      if (val.length > 12) {
        return `${val.substring(0, 4).toUpperCase()}...${val.substring(val.length - 4).toUpperCase()}`;
      }
      return val.toUpperCase();
    });

    return NextResponse.json({ hashes });
  } catch (error) {
    console.error("Failed to fetch recent hashes:", error);
    return NextResponse.json({ hashes: [] }, { status: 500 });
  }
}
