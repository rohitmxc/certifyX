import React from "react";
import { CertificateTemplate } from "@/components/CertificateTemplate";
import { CheckCircle, Shield, XCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function CredentialVerificationPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  
  // Fetch from Prisma Database
  const certificate = await prisma.certificate.findUnique({
    where: { id },
    include: {
      batch: {
        include: {
          organization: true,
          template: true
        }
      }
    }
  });

  if (!certificate) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-200 text-center max-w-md">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Credential Not Found</h1>
          <p className="text-neutral-500 mb-6">This credential ID does not exist in our registry. It may be invalid or has been revoked.</p>
          <Link href="/" className="text-blue-600 hover:underline">Return Home</Link>
        </div>
      </div>
    );
  }

  const dynamicData = JSON.parse(certificate.dynamicData);
  const studentName = dynamicData.name || dynamicData.studentName || "Student";
  const eventName = certificate.batch.name;
  const issuerName = certificate.batch.organization.name;
  const issueDate = certificate.issuedAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="antialiased flex flex-col min-h-screen bg-background text-on-background bg-grid-pattern">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-background/90 backdrop-blur-md border-b border-primary">
        <div className="flex justify-between items-center px-4 h-16 w-full max-w-[1280px] mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <span className="font-dot text-[24px] text-primary tracking-tight uppercase">CERTIFYX</span>
          </Link>
          <div className="bg-green-500 text-white font-dot text-[12px] px-3 py-1 uppercase">
            VERIFIED CREDENTIAL
          </div>
        </div>
      </header>

      {/* Main Canvas */}
      <main className="flex-grow pt-[120px] pb-[100px] px-4 max-w-[800px] mx-auto w-full flex flex-col gap-8">
        
        {/* Preview Certificate Section */}
        <section className="pb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px bg-primary flex-grow"></div>
            <h2 className="font-dot text-[24px] text-center text-primary uppercase">BLOCKCHAIN RECORD</h2>
            <div className="h-px bg-primary flex-grow"></div>
          </div>

          <div className="bg-pure-white rounded-none technical-border p-6 relative overflow-hidden group">
            <div className="flex justify-between items-start mb-6 relative z-10 border-b border-primary pb-4">
              <div>
                <span className="font-mono-label text-[12px] text-outline tracking-wider mb-1 block uppercase">Credential No</span>
                <span className="font-mono-label text-[14px] text-primary font-bold text-lg">{id}</span>
              </div>
              <div className="bg-surface-bright text-primary border border-primary px-3 py-1 rounded-none flex items-center gap-2">
                <div className="w-2 h-2 rounded-none bg-signal-red animate-pulse"></div>
                <span className="font-mono-label text-[12px] font-bold uppercase">Active / Verified</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-10 pt-4">
              <div className="border border-outline-variant p-3">
                <span className="font-mono-label text-[12px] text-outline tracking-wider block mb-1 uppercase">Recipient</span>
                <span className="font-hanken text-[16px] text-primary font-semibold uppercase">{studentName}</span>
              </div>
              <div className="border border-outline-variant p-3">
                <span className="font-mono-label text-[12px] text-outline tracking-wider block mb-1 uppercase">Issuer</span>
                <span className="font-hanken text-[16px] text-primary font-semibold flex items-center gap-1 uppercase">
                  {issuerName}
                  <CheckCircle className="w-4 h-4 text-primary" />
                </span>
              </div>
              <div className="border border-outline-variant p-3 col-span-2">
                <span className="font-mono-label text-[12px] text-outline tracking-wider block mb-1 uppercase">Issue Date / Event</span>
                <span className="font-hanken text-[16px] text-primary uppercase">{issueDate} &mdash; {eventName}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-primary flex justify-between items-center relative z-10 bg-surface-bright p-3 border border-outline-variant">
              <div className="flex items-center gap-2 text-primary overflow-hidden">
                <span className="font-mono-label text-[12px] text-outline">HASH:</span>
                <span className="font-mono-label text-[12px] truncate w-64">{certificate.dataHash}</span>
              </div>
              <button className="text-primary font-mono-label text-[12px] hover:underline uppercase font-bold border-b border-primary">View Explorer</button>
            </div>
          </div>
        </section>

        {/* Render the Certificate Template Visually below */}
        <section className="mt-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px bg-primary flex-grow"></div>
            <h2 className="font-dot text-[24px] text-center text-primary uppercase">ORIGINAL DOCUMENT</h2>
            <div className="h-px bg-primary flex-grow"></div>
          </div>
          <div className="w-full transform scale-[0.6] md:scale-[0.8] origin-top flex justify-center pointer-events-none opacity-80 hover:opacity-100 transition-opacity">
            <CertificateTemplate 
              data={{
                name: studentName,
                eventName: eventName,
                issuerName: issuerName,
                date: issueDate
              }}
              credentialId={id}
            />
          </div>
        </section>

      </main>
    </div>
  );
}
