"use client";

import React, { useState } from 'react';
import { ExternalLink, Loader2, Download } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import { ReactPdfCertificate } from '@/components/ReactPdfCertificate';
import QRCode from 'qrcode';

interface Certificate {
  id: string;
  recipientEmail: string;
  dynamicData: string;
  issuedAt: Date;
  dataHash: string;
}

export function HistoryTableClient({ certificates }: { certificates: Certificate[] }) {
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const handleDownloadPDF = async (cert: Certificate) => {
    setGeneratingId(cert.id);
    try {
      let dynamicInfo = { 
        name: "Unknown", 
        eventName: "Unknown", 
        type: "Unknown",
        eventDetails: "",
        date: "",
        issuerName: "",
        signature1Name: "",
        signature1Title: "",
        signature2Name: "",
        signature2Title: ""
      };
      
      try {
        dynamicInfo = { ...dynamicInfo, ...JSON.parse(cert.dynamicData) };
      } catch (e) {}

      const qrValue = cert.dataHash 
        ? `https://stellar.expert/explorer/testnet/tx/${cert.dataHash}`
        : `https://stellar.expert/explorer/testnet`;
        
      const qrDataUrl = await QRCode.toDataURL(qrValue, { width: 400, margin: 1 });
      
      const verificationTime = new Date(cert.issuedAt).toLocaleString('en-US', { 
        month: 'short', day: 'numeric', year: 'numeric', 
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false 
      });

      const blob = await pdf(
        <ReactPdfCertificate 
          credentialId={cert.id}
          transactionHash={cert.dataHash}
          verificationTime={verificationTime}
          qrDataUrl={qrDataUrl}
          data={{
            title: "CERTIFICATE",
            subtitle: "OF PARTICIPATION",
            presentedTo: "PROUDLY PRESENTED TO",
            name: dynamicInfo.name,
            description: "for successfully participating in",
            eventName: dynamicInfo.eventName,
            eventDetails: dynamicInfo.eventDetails,
            date: dynamicInfo.date,
            issuerName: dynamicInfo.issuerName,
            signature1Name: dynamicInfo.signature1Name,
            signature1Title: dynamicInfo.signature1Title,
            signature2Name: dynamicInfo.signature2Name,
            signature2Title: dynamicInfo.signature2Title
          }}
        />
      ).toBlob();
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${cert.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to generate PDF", err);
    } finally {
      setGeneratingId(null);
    }
  };

  return (
    <div className="bg-pure-white border-2 border-pure-black border-b-8 border-r-8 shadow-sm overflow-x-auto">
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
              dynamicInfo = { ...dynamicInfo, ...JSON.parse(cert.dynamicData) };
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
                    <button 
                      onClick={() => handleDownloadPDF(cert)}
                      disabled={generatingId === cert.id}
                      className="text-primary flex items-center gap-1 font-dot text-[10px] uppercase hover:underline disabled:opacity-50"
                    >
                      {generatingId === cert.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
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
  );
}
