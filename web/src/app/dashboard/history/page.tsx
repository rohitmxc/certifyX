import React from 'react';
import { PrismaClient } from '@prisma/client';
import { ArrowRight, CheckCircle, ExternalLink, Search } from 'lucide-react';
import Link from 'next/link';

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
    <div className="p-8 bg-surface-bright min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-8 border-b-2 border-pure-black pb-4">
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
          <div className="bg-pure-white border-2 border-pure-black border-b-8 border-r-8 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-bright border-b-2 border-pure-black">
                  <th className="font-dot text-[10px] uppercase text-on-surface-variant tracking-wider p-4 border-r border-outline-variant">Credential ID</th>
                  <th className="font-dot text-[10px] uppercase text-on-surface-variant tracking-wider p-4 border-r border-outline-variant">Candidate</th>
                  <th className="font-dot text-[10px] uppercase text-on-surface-variant tracking-wider p-4 border-r border-outline-variant">Event / Course</th>
                  <th className="font-dot text-[10px] uppercase text-on-surface-variant tracking-wider p-4 border-r border-outline-variant">Date Issued</th>
                  <th className="font-dot text-[10px] uppercase text-on-surface-variant tracking-wider p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {certificates.map((cert, i) => {
                  let dynamicInfo = { name: "Unknown", eventName: "Unknown", type: "Unknown" };
                  try {
                    dynamicInfo = JSON.parse(cert.dynamicData);
                  } catch (e) {}

                  return (
                    <tr key={cert.id} className={`border-b border-outline-variant hover:bg-surface-bright transition-colors ${i === certificates.length - 1 ? 'border-b-0' : ''}`}>
                      <td className="p-4 border-r border-outline-variant">
                        <span className="font-mono text-[12px] text-pure-black bg-surface-variant px-2 py-1">{cert.id}</span>
                      </td>
                      <td className="p-4 border-r border-outline-variant">
                        <div className="font-bold text-[14px] text-pure-black mb-1">{dynamicInfo.name}</div>
                        <div className="font-mono-label text-[10px] text-on-surface-variant">{cert.recipientEmail}</div>
                      </td>
                      <td className="p-4 border-r border-outline-variant">
                        <div className="text-[13px] text-pure-black">{dynamicInfo.eventName}</div>
                        <div className="font-mono-label text-[10px] text-on-surface-variant mt-1 uppercase">{dynamicInfo.type}</div>
                      </td>
                      <td className="p-4 border-r border-outline-variant">
                        <div className="font-mono text-[12px] text-pure-black">
                          {new Date(cert.issuedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <a 
                            href={`https://stellar.expert/explorer/testnet/tx/${cert.dataHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#16a34a] flex items-center gap-1 font-dot text-[10px] uppercase hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" /> Verify
                          </a>
                          <span className="text-outline-variant">|</span>
                          <button className="text-primary flex items-center gap-1 font-dot text-[10px] uppercase hover:underline">
                            View PDF
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
