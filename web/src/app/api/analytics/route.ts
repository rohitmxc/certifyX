import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 1. Get total credentials issued
    const totalIssued = await prisma.certificate.count();

    // 2. Mock active issuers since we aren't tracking issuers in DB yet (only wallet addresses)
    const activeIssuers = 3; 

    // 3. Get issuance volume over the last 7 days
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const recentCerts = await prisma.certificate.findMany({
      where: {
        issuedAt: {
          gte: sevenDaysAgo,
        },
      },
      select: {
        issuedAt: true,
      },
    });

    // Initialize an array with the last 7 days
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const volumeData = [];
    
    // Create an object to hold the counts for the last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      volumeData.push({
        date: days[d.getDay()],
        credentials: 0,
        fullDate: d.toDateString() // for matching
      });
    }

    // Group by day
    recentCerts.forEach((cert) => {
      const certDateString = new Date(cert.issuedAt).toDateString();
      const match = volumeData.find(d => d.fullDate === certDateString);
      if (match) {
        match.credentials++;
      }
    });

    return NextResponse.json({
      totalIssued,
      activeIssuers,
      volumeData: volumeData.map(d => ({ date: d.date, credentials: d.credentials }))
    });

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
