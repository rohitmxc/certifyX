import React from 'react';
import { PrismaClient } from '@prisma/client';
import { ArrowRight, CheckCircle, ExternalLink, Search } from 'lucide-react';
import Link from 'next/link';
import { HistoryTableClient } from './HistoryTableClient';

// Use standard Prisma instance
const prisma = new PrismaClient();

// Disable static caching for this dashboard route
export const dynamic = 'force-dynamic';

export default async function HistoryPage() {
  // Fetch all certificates, ordering by latest
  const certificates = await prisma.certificate.findMany({
    orderBy: { issuedAt: 'desc' },
  });

  return (
    <div className="p-4 md:p-8 bg-surface-bright min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8 border-b-2 border-pure-black pb-4">
          <div>
            <h1 className="font-playfair text-[48px] leading-none text-pure-black font-bold tracking-tight mb-2">Issued Credentials</h1>
            <p className="font-mono-label text-[12px] uppercase text-on-surface-variant tracking-wider">
              Manage and verify your blockchain credential history
            </p>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
              <input 
                type="text" 
                placeholder="SEARCH CREDENTIALS..." 
                className="pl-9 pr-4 py-2 border-2 border-pure-black bg-pure-white font-dot text-[12px] uppercase outline-none focus:bg-surface-bright transition-colors w-64"
              />
            </div>
          </div>
        </div>

        {certificates.length === 0 ? (
          <div className="border-2 border-dashed border-outline-variant p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-surface-variant flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-outline" />
            </div>
            <h3 className="font-dot text-[16px] uppercase text-pure-black mb-2">No Credentials Issued Yet</h3>
            <p className="font-mono-label text-[12px] text-on-surface-variant mb-6 max-w-md">
              You haven't issued any certificates on the blockchain. Head over to the issuance page to get started.
            </p>
            <Link 
              href="/dashboard/issue"
              className="bg-primary text-pure-white px-6 py-3 font-dot text-[12px] uppercase hover:bg-inverse-surface transition-colors inline-flex items-center gap-2"
            >
              Issue Credentials <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <HistoryTableClient certificates={certificates.map(c => ({
            id: c.id,
            recipientEmail: c.recipientEmail,
            dynamicData: c.dynamicData,
            issuedAt: c.issuedAt,
            dataHash: c.dataHash
          }))} />
        )}
      </div>
    </div>
  );
}
