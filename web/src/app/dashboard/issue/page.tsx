"use client";

import React, { useState } from "react";
import { CertificateTemplate } from "@/components/CertificateTemplate";
import { ArrowRight, Loader2, UploadCloud, Users, FileText, CheckCircle, Plus, X, Type, ExternalLink } from "lucide-react";
import html2canvas from "html2canvas";
import Papa from "papaparse";
import { jsPDF } from "jspdf";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import * as StellarSdk from "@stellar/stellar-sdk";
import QRCode from "qrcode";
import { pdf } from "@react-pdf/renderer";
import { ReactPdfCertificate } from "@/components/ReactPdfCertificate";

interface StudentRecord {
  name: string;
  email: string;
  [key: string]: string; // for other dynamic fields
}

export default function IssuePage() {
  const [csvData, setCsvData] = useState<StudentRecord[]>([]);
  const [eventName, setEventName] = useState("Stellar Journey 2026");
  const [issuerName, setIssuerName] = useState("Stellar Community");
  const [txStatus, setTxStatus] = useState<'idle' | 'pending' | 'processing' | 'confirmed' | 'failed'>('idle');
  const [txError, setTxError] = useState<string | null>(null);
  const [issueComplete, setIssueComplete] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  // Manual Issuance State
  const [issueMode, setIssueMode] = useState<'batch' | 'manual'>('batch');
  const [manualName, setManualName] = useState("");
  const [manualEmail, setManualEmail] = useState("");
  const [customFields, setCustomFields] = useState<{key: string, value: string}[]>([]);
  
  // Explicit standard template fields for manual entry
  const [manualDate, setManualDate] = useState("May 18, 2025");
  const [manualDuration, setManualDuration] = useState("6 Hours");
  const [manualMode, setManualMode] = useState("Online");
  const [manualEventDetails, setManualEventDetails] = useState("An insightful session covering the fundamentals of Blockchain, Smart Contracts, and Web3 Development.");
  const [manualSig1Name, setManualSig1Name] = useState("Rohit Verma");
  const [manualSig1Title, setManualSig1Title] = useState("COMMUNITY LEAD");
  const [manualSig2Name, setManualSig2Name] = useState("Sneha Iyer");
  const [manualSig2Title, setManualSig2Title] = useState("EVENT COORDINATOR");
  const [manualIssueComplete, setManualIssueComplete] = useState(false);
  const [generatedCredentialId, setGeneratedCredentialId] = useState<string | null>(null);
  const [blockchainTxHash, setBlockchainTxHash] = useState<string | null>(null);
  const [verificationTime, setVerificationTime] = useState<string | undefined>(undefined);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleManualIssue = async () => {
    if (!manualName) return alert("Name is required");

    setTxStatus('pending');
    setTxError(null);
    
    try {
      const { buildIssueCredentialTx, submitContractTx } = await import("@/service/contract");
      
      const newId = "CX-" + new Date().getFullYear() + "-" + Math.random().toString(36).substring(2, 8).toUpperCase();
      
      // Hash the combined info
      const combinedInfo = `${manualName} | ${eventName} | ${manualDate}`;
      const dataHash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(combinedInfo) as any)))
        .map(b => b.toString(16).padStart(2, '0')).join('');
      
      const issueDate = Math.floor(Date.now() / 1000);

      // Build & Sign (Pending phase)
      const signedTx = await buildIssueCredentialTx(newId, dataHash, issueDate);

      // Submit & Poll (Processing phase)
      setTxStatus('processing');
      const response = await submitContractTx(signedTx);
      
      // Save to Database
      try {
        await fetch('/api/certificates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            credentialId: newId,
            email: manualEmail,
            name: manualName,
            eventName: eventName,
            date: manualDate,
            transactionHash: response.txHash
          })
        });
      } catch (dbErr) {
        console.error("DB Save Error:", dbErr);
      }

      setGeneratedCredentialId(newId);
      setBlockchainTxHash(response.txHash);
      
      // format verification time nicely
      const now = new Date();
      setVerificationTime(now.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
      
      setTxStatus('confirmed');
      setManualIssueComplete(true);
    } catch (error: any) {
      console.error(error);
      setTxError(error.message || "Failed to issue credential");
      setTxStatus('failed');
    }
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPdf(true);
    try {
      // Use the actual Stellar Expert explorer to cryptographically verify the transaction!
      const qrValue = blockchainTxHash 
        ? `https://stellar.expert/explorer/testnet/tx/${blockchainTxHash}`
        : `https://stellar.expert/explorer/testnet`;
        
      const qrDataUrl = await QRCode.toDataURL(qrValue, { width: 400, margin: 1 });
      
      const blob = await pdf(
        <ReactPdfCertificate 
          credentialId={generatedCredentialId || "CX-2025"}
          transactionHash={blockchainTxHash || undefined}
          verificationTime={verificationTime}
          qrDataUrl={qrDataUrl}
          data={{
            title: "CERTIFICATE",
            subtitle: "OF PARTICIPATION",
            presentedTo: "PROUDLY PRESENTED TO",
            name: manualName || "[Candidate Name]",
            description: "for successfully participating in",
            eventName: eventName,
            eventDetails: manualEventDetails,
            date: manualDate,
            issuerName: issuerName,
            signature1Name: manualSig1Name,
            signature1Title: manualSig1Title,
            signature2Name: manualSig2Name,
            signature2Title: manualSig2Title
          }}
        />
      ).toBlob();
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${manualName.trim() ? manualName.replace(/\s+/g, "_") : "Candidate"}_Certificate.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF Generation failed:", err);
      alert("Failed to generate PDF vector file.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleSendEmail = async () => {
    if (!manualEmail) {
      alert("Please provide a Candidate Email to send the certificate.");
      return;
    }

    const btn = document.getElementById("send-email-btn");
    if (btn) btn.innerText = "SENDING...";
    
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: manualEmail,
          studentName: manualName || "Candidate",
          credentialId: generatedCredentialId || "CX-2025",
          eventName: eventName
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        alert(data.message || `Certificate successfully emailed to ${manualEmail}!`);
      } else {
        alert(`Failed to send email: ${data.error}`);
      }
    } catch (error) {
      console.error("Email fetch failed", error);
      alert("Network error: Failed to send email.");
    } finally {
      if (btn) btn.innerText = "SEND EMAIL";
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsedData = results.data as any[];
          const normalized = parsedData.map(row => {
            const normalizedRow: any = {};
            for (const key in row) {
              const lowerKey = key.toLowerCase().trim();
              if (lowerKey === 'name' || lowerKey === 'student name') normalizedRow.name = row[key];
              else if (lowerKey === 'email' || lowerKey === 'student email') normalizedRow.email = row[key];
              else normalizedRow[key] = row[key];
            }
            if (!normalizedRow.name) normalizedRow.name = Object.values(row)[0] || 'Unknown';
            if (!normalizedRow.email) normalizedRow.email = Object.values(row)[1] || 'Unknown';
            return normalizedRow as StudentRecord;
          });
          setCsvData([...csvData, ...normalized]);
          setPreviewIndex(0);
          setIssueComplete(false);
        }
      });
    }
  };

  const handleBatchIssue = async () => {
    if (csvData.length === 0) return;
    setTxStatus('pending');
    
    try {
      const res = await fetch('/api/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batchName: eventName,
          records: csvData,
          templateId: "demo-template-id" 
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate batch");
      
      console.log("Hashes to sign on-chain:", data.hashes);
      
      setTimeout(() => {
        setIssueComplete(true);
        setTxStatus('idle');
      }, 1500);

    } catch (error) {
      console.error(error);
      alert("Issuance failed: " + (error as Error).message);
      setTxStatus('idle');
    }
  };

  return (
    <div className="p-8 flex flex-col xl:flex-row gap-8 min-h-screen bg-surface-bright">
      
      {/* Left Column: Form & Batch Controls */}
      <div className="w-full xl:w-[450px] bg-pure-white p-8 rounded-none technical-border h-fit relative shrink-0">
        <div className="absolute top-0 right-0 w-8 h-8 border-l border-b border-primary bg-surface flex items-center justify-center">
          <span className="font-mono-label text-[10px] text-primary">01</span>
        </div>
        
        <h1 className="text-[32px] font-dot text-primary mb-6 uppercase">ISSUE CREDENTIALS</h1>
        
        {issueComplete ? (
          <div className="bg-pure-white border border-primary p-8 rounded-none text-center">
            <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="font-dot text-[24px] uppercase text-primary mb-2">SUCCESSFULLY ISSUED</h3>
            <p className="font-hanken text-[16px] text-on-surface-variant mb-6">
              {csvData.length} credentials registered on the Stellar Soroban network.
            </p>
            <button 
              onClick={() => { setIssueComplete(false); setCsvData([]); setIssueMode('batch'); }}
              className="w-full bg-primary text-pure-white font-dot text-[16px] uppercase py-3 rounded-none hover:bg-inverse-surface transition-colors active:scale-95 duration-200"
            >
              START NEW BATCH
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Template Selection / Config */}
            <div className="space-y-4 pb-6 border-b border-primary">
              <div>
                <label className="block font-mono-label text-[12px] uppercase text-outline mb-1">EVENT / BATCH NAME</label>
                <input 
                  type="text" 
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-bright rounded-none border border-primary focus:outline-none focus:ring-1 focus:ring-primary font-hanken text-primary transition-colors"
                />
              </div>

              <div>
                <label className="block font-mono-label text-[12px] uppercase text-outline mb-2 mt-4">SELECT TEMPLATE</label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-primary bg-surface-bright rounded-none p-3 cursor-pointer">
                    <div className="w-full h-20 bg-pure-white border border-primary rounded-none mb-2 flex items-center justify-center font-dot text-[12px] text-primary">
                      STANDARD
                    </div>
                    <p className="font-mono-label text-[12px] uppercase text-primary text-center">STELLAR DEFAULT</p>
                  </div>
                  
                  <a href="/dashboard/templates/new" className="border border-outline-variant hover:border-primary hover:bg-surface-bright rounded-none p-3 cursor-pointer flex flex-col items-center justify-center transition-colors">
                    <div className="w-8 h-8 bg-pure-white border border-primary rounded-none flex items-center justify-center text-primary mb-2">
                      <Plus className="w-4 h-4" />
                    </div>
                    <p className="font-mono-label text-[12px] uppercase text-primary text-center">CUSTOM TEMPLATE</p>
                  </a>
                </div>
              </div>
            </div>

            {/* Mode Toggle */}
            <div className="flex border border-primary rounded-none p-1 bg-surface-bright">
              <button 
                onClick={() => setIssueMode('batch')}
                className={`flex-1 font-mono-label text-[10px] uppercase py-2 transition-colors ${issueMode === 'batch' ? 'bg-primary text-pure-white' : 'text-primary hover:bg-surface-container'}`}
              >
                BATCH (CSV)
              </button>
              <button 
                onClick={() => setIssueMode('manual')}
                className={`flex-1 font-mono-label text-[10px] uppercase py-2 transition-colors ${issueMode === 'manual' ? 'bg-primary text-pure-white' : 'text-primary hover:bg-surface-container'}`}
              >
                MANUAL ENTRY
              </button>
            </div>

            {/* Input Area */}
            {issueMode === 'batch' ? (
              <div className="border border-outline-variant bg-pure-white rounded-none p-8 text-center hover:bg-surface-bright hover:border-primary transition-colors cursor-pointer relative">
                <input 
                  type="file" 
                  accept=".csv" 
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <UploadCloud className="w-10 h-10 text-primary mx-auto mb-3" />
                <h3 className="font-dot text-[16px] uppercase text-primary mb-1">UPLOAD CSV FILE</h3>
                <p className="font-mono-label text-[10px] uppercase text-outline">REQUIRES NAME & EMAIL COLUMNS</p>
              </div>
            ) : (
              <div className="border border-primary bg-surface-bright p-4 space-y-4">
                <div className="max-h-[500px] overflow-y-auto pr-2 space-y-4">
                  <div>
                    <label className="block font-mono-label text-[10px] uppercase text-outline mb-1">CANDIDATE NAME</label>
                    <input 
                      type="text" 
                      value={manualName}
                      onChange={(e) => setManualName(e.target.value)}
                      className="w-full px-3 py-2 bg-pure-white rounded-none border border-primary focus:outline-none font-hanken text-primary text-sm"
                      placeholder="e.g. Jane Doe"
                    />
                  </div>
                  <div>
                    <label className="block font-mono-label text-[10px] uppercase text-outline mb-1">CANDIDATE EMAIL</label>
                    <input 
                      type="email" 
                      value={manualEmail}
                      onChange={(e) => setManualEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-pure-white rounded-none border border-primary focus:outline-none font-hanken text-primary text-sm"
                      placeholder="e.g. jane@example.com"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-mono-label text-[10px] uppercase text-outline mb-1">DATE OF ISSUE</label>
                      <input 
                        type="text" 
                        value={manualDate}
                        onChange={(e) => setManualDate(e.target.value)}
                        className="w-full px-3 py-2 bg-pure-white rounded-none border border-primary focus:outline-none font-hanken text-primary text-sm"
                      />
                    </div>
                    <div>
                      <label className="block font-mono-label text-[10px] uppercase text-outline mb-1">DURATION</label>
                      <input 
                        type="text" 
                        value={manualDuration}
                        onChange={(e) => setManualDuration(e.target.value)}
                        className="w-full px-3 py-2 bg-pure-white rounded-none border border-primary focus:outline-none font-hanken text-primary text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono-label text-[10px] uppercase text-outline mb-1">MODE (e.g. Online)</label>
                    <input 
                      type="text" 
                      value={manualMode}
                      onChange={(e) => setManualMode(e.target.value)}
                      className="w-full px-3 py-2 bg-pure-white rounded-none border border-primary focus:outline-none font-hanken text-primary text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-mono-label text-[10px] uppercase text-outline mb-1">EVENT DETAILS / DESCRIPTION</label>
                    <textarea 
                      value={manualEventDetails}
                      onChange={(e) => setManualEventDetails(e.target.value)}
                      className="w-full px-3 py-2 bg-pure-white rounded-none border border-primary focus:outline-none font-hanken text-primary text-sm min-h-[60px]"
                    />
                  </div>

                  <div className="pt-2 border-t border-outline-variant grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-mono-label text-[10px] uppercase text-outline mb-1">SIGNATURE 1 NAME</label>
                      <input 
                        type="text" 
                        value={manualSig1Name}
                        onChange={(e) => setManualSig1Name(e.target.value)}
                        className="w-full px-3 py-2 bg-pure-white rounded-none border border-primary focus:outline-none font-hanken text-primary text-sm"
                      />
                      <label className="block font-mono-label text-[10px] uppercase text-outline mt-2 mb-1">SIGNATURE 1 TITLE</label>
                      <input 
                        type="text" 
                        value={manualSig1Title}
                        onChange={(e) => setManualSig1Title(e.target.value)}
                        className="w-full px-3 py-2 bg-pure-white rounded-none border border-primary focus:outline-none font-hanken text-primary text-sm"
                      />
                    </div>
                    <div>
                      <label className="block font-mono-label text-[10px] uppercase text-outline mb-1">SIGNATURE 2 NAME</label>
                      <input 
                        type="text" 
                        value={manualSig2Name}
                        onChange={(e) => setManualSig2Name(e.target.value)}
                        className="w-full px-3 py-2 bg-pure-white rounded-none border border-primary focus:outline-none font-hanken text-primary text-sm"
                      />
                      <label className="block font-mono-label text-[10px] uppercase text-outline mt-2 mb-1">SIGNATURE 2 TITLE</label>
                      <input 
                        type="text" 
                        value={manualSig2Title}
                        onChange={(e) => setManualSig2Title(e.target.value)}
                        className="w-full px-3 py-2 bg-pure-white rounded-none border border-primary focus:outline-none font-hanken text-primary text-sm"
                      />
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setCustomFields([...customFields, {key: '', value: ''}])}
                    className="w-full border border-dashed border-primary py-1.5 font-mono-label text-[10px] uppercase text-primary hover:bg-pure-white transition-colors flex items-center justify-center gap-1 mt-2"
                  >
                    <Plus className="w-3 h-3" /> ADD FIELD
                  </button>
                </div>

                {manualIssueComplete ? (
                  <div className="pt-4 border-t border-primary">
                    <div className="flex items-center gap-2 text-green-600 mb-4 justify-center font-dot uppercase">
                      <CheckCircle className="w-5 h-5" /> ISSUED SUCCESSFULLY
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={handleDownloadPDF}
                        disabled={isGeneratingPdf}
                        className="flex-1 bg-pure-black text-pure-white font-dot text-[12px] uppercase py-3 hover:bg-pure-black/90 transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
                      >
                        <FileText className="w-4 h-4" /> {isGeneratingPdf ? "GENERATING..." : "SAVE PDF"}
                      </button>
                      <button 
                        id="send-email-btn"
                        onClick={handleSendEmail}
                        className="flex-1 bg-pure-white border border-primary text-primary font-dot text-[12px] uppercase py-3 hover:bg-surface-bright transition-colors flex justify-center items-center gap-2"
                      >
                        SEND EMAIL
                      </button>
                    </div>
                    
                    {blockchainTxHash && (
                      <a 
                        href={`https://stellar.expert/explorer/testnet/tx/${blockchainTxHash}`}
                        target="_blank" rel="noopener noreferrer"
                        className="w-full flex justify-center items-center gap-2 border border-[#16a34a] text-[#16a34a] font-dot text-[12px] uppercase py-3 mt-2 hover:bg-[#16a34a]/10 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" /> VERIFY ON BLOCKCHAIN
                      </a>
                    )}
                    <button 
                      onClick={() => {
                        setManualIssueComplete(false);
                        setManualName("");
                        setManualEmail("");
                      }}
                      className="w-full text-primary font-mono-label text-[10px] uppercase mt-4 hover:underline"
                    >
                      Issue Another Credential
                    </button>
                  </div>
                ) : (
                  <>
                    {txStatus !== 'idle' && (
                      <div className="mb-4 space-y-2 text-sm font-mono p-4 border border-outline-variant bg-surface-container-lowest">
                        {txStatus === 'pending' && <p className="text-primary animate-pulse">Wallet signature pending...</p>}
                        {txStatus === 'processing' && <p className="text-[#9333EA] animate-pulse">Processing on Soroban RPC...</p>}
                        {txStatus === 'failed' && (
                          <div className="text-signal-red">
                            <p>✖ Failed: {txError}</p>
                            <button onClick={() => setTxStatus('idle')} className="mt-2 text-xs border border-signal-red px-2 py-1 hover:bg-signal-red hover:text-white transition-colors">Try Again</button>
                          </div>
                        )}
                      </div>
                    )}
                    <button 
                      onClick={handleManualIssue}
                      disabled={txStatus === 'pending' || txStatus === 'processing' || !manualName}
                      className="w-full bg-primary text-pure-white font-dot text-[14px] uppercase py-3 mt-4 hover:bg-inverse-surface transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
                    >
                      {(txStatus === 'pending' || txStatus === 'processing') ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> {txStatus === 'pending' ? 'SIGNING...' : 'PROCESSING...'}</>
                      ) : (
                        <>ISSUE CREDENTIAL ON SOROBAN</>
                      )}
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Loaded Data List */}
            {csvData.length > 0 && (
              <div className="bg-pure-white border border-primary rounded-none p-4 mt-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-surface-bright text-primary border border-primary p-2 rounded-none">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-dot text-[14px] uppercase text-primary">CANDIDATES LOADED</h3>
                      <p className="font-mono-label text-[10px] uppercase text-primary">{csvData.length} RECORDS READY</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => { setCsvData([]); setPreviewIndex(0); }}
                    className="font-mono-label text-[10px] uppercase text-primary hover:text-signal-red font-bold border-b border-primary hover:border-signal-red transition-colors"
                  >
                    CLEAR
                  </button>
                </div>
                
                <div className="max-h-32 overflow-y-auto space-y-1 pr-2">
                  {csvData.slice(0, 50).map((record, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => {
                         setPreviewIndex(idx);
                         setIssueMode('batch'); // switch to batch mode to view the selected record
                      }}
                      className={`flex justify-between items-center p-2 border cursor-pointer transition-colors ${
                        previewIndex === idx && issueMode === 'batch'
                          ? "bg-primary text-pure-white border-primary" 
                          : "bg-surface-bright text-primary border-transparent hover:border-outline-variant"
                      }`}
                    >
                      <span className="font-hanken font-semibold text-[12px] truncate max-w-[150px]">{record.name}</span>
                      <span className={`font-mono-label text-[8px] truncate ml-2 ${previewIndex === idx && issueMode === 'batch' ? 'text-surface-dim' : 'text-outline'}`}>{record.email}</span>
                    </div>
                  ))}
                  {csvData.length > 50 && (
                    <div className="text-center font-mono-label text-[10px] uppercase text-primary py-2 font-bold">
                      + {csvData.length - 50} MORE RECORDS
                    </div>
                  )}
                </div>
              </div>
            )}

            {issueMode === 'batch' && (
              <button 
                onClick={handleBatchIssue}
                disabled={(txStatus !== 'idle') || csvData.length === 0}
                className="w-full mt-6 bg-primary text-pure-white font-dot text-[16px] uppercase py-4 rounded-none hover:bg-inverse-surface transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 duration-200"
              >
                {(txStatus !== 'idle') ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    ISSUING {csvData.length} CREDENTIALS
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    ISSUE {csvData.length > 0 ? csvData.length : ""} ON SOROBAN
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Right Column: Live Preview */}
      <div className="flex-1 bg-pure-white rounded-none flex flex-col items-center justify-start overflow-hidden border border-outline-variant relative min-h-[600px] cursor-grab active:cursor-grabbing">
        <TransformWrapper
          initialScale={0.65}
          minScale={0.2}
          maxScale={2}
          centerOnInit={true}
          wheel={{ step: 0.03 }}
          pinch={{ step: 2 }}
        >
          {({ zoomIn, zoomOut, resetTransform, instance }) => (
            <>
              {/* Global Zoom Controls overlay */}
              <div className="absolute top-6 right-6 z-20 flex gap-1 shadow-[2px_2px_0px_#000000] pointer-events-auto">
                <button onClick={() => zoomOut()} className="bg-pure-white px-2 py-1 border border-primary text-primary hover:bg-surface-bright font-bold">-</button>
                <div className="bg-pure-white px-3 py-1 border border-primary text-primary font-mono-label flex items-center justify-center min-w-[60px] text-[10px]">
                  {Math.round((instance?.state?.scale || 0.65) * 100)}%
                </div>
                <button onClick={() => zoomIn()} className="bg-pure-white px-2 py-1 border border-primary text-primary hover:bg-surface-bright font-bold">+</button>
              </div>

              {issueMode === 'manual' ? (
                <>
                  <div className="absolute top-6 left-6 z-10 pointer-events-none">
                    <span className="bg-surface-bright px-4 py-2 rounded-none font-mono-label text-[12px] uppercase border border-primary text-primary flex items-center gap-2 shadow-[2px_2px_0px_#000000] pointer-events-auto">
                      <Type className="w-3 h-3" /> LIVE MANUAL PREVIEW
                    </span>
                  </div>
                  <TransformComponent wrapperClass="w-full h-full min-h-[600px]">
                    <div id="certificate-node" className="w-[1000px] h-[700px] shrink-0 relative mt-8">
                      <CertificateTemplate 
                        data={{
                          name: manualName || "[Candidate Name]",
                          date: manualDate,
                          duration: manualDuration,
                          mode: manualMode,
                          description: "for successfully participating in",
                          eventName: eventName || "[Event Name]",
                          eventDetails: manualEventDetails,
                          signature1Name: manualSig1Name,
                          signature1Title: manualSig1Title,
                          signature2Name: manualSig2Name,
                          signature2Title: manualSig2Title,
                          ...customFields.reduce((acc, field) => {
                             if (field.key.trim()) acc[field.key.trim()] = field.value || `[${field.key}]`;
                             return acc;
                          }, {} as Record<string, string>)
                        }}
                        credentialId={manualIssueComplete ? (generatedCredentialId || "PREVIEW-ONLY") : "PREVIEW-ONLY"}
                        transactionHash={manualIssueComplete ? (blockchainTxHash || undefined) : undefined}
                        verificationTime={manualIssueComplete ? verificationTime : undefined}
                      />
                    </div>
                  </TransformComponent>
                </>
              ) : csvData.length > 0 ? (
                <>
                  <div className="absolute top-6 left-6 right-32 flex justify-between items-center z-10 pointer-events-none">
                    <span className="bg-pure-white px-4 py-2 rounded-none font-mono-label text-[12px] uppercase border border-primary text-primary shadow-[2px_2px_0px_#000000] pointer-events-auto">
                      PREVIEW {previewIndex + 1} OF {csvData.length}
                    </span>
                    <div className="flex gap-2 pointer-events-auto">
                      <button 
                        onClick={() => setPreviewIndex(Math.max(0, previewIndex - 1))}
                        disabled={previewIndex === 0}
                        className="bg-pure-white px-3 py-2 rounded-none border border-primary text-primary font-dot text-[12px] hover:bg-surface-bright disabled:opacity-50 shadow-[2px_2px_0px_#000000]"
                      >
                        PREV
                      </button>
                      <button 
                        onClick={() => setPreviewIndex(Math.min(csvData.length - 1, previewIndex + 1))}
                        disabled={previewIndex === csvData.length - 1}
                        className="bg-pure-white px-3 py-2 rounded-none border border-primary text-primary font-dot text-[12px] hover:bg-surface-bright disabled:opacity-50 shadow-[2px_2px_0px_#000000]"
                      >
                        NEXT
                      </button>
                    </div>
                  </div>
                  
                  <TransformComponent wrapperClass="w-full h-full min-h-[600px]">
                    <div id="certificate-node" className="w-[1000px] h-[700px] shrink-0 relative mt-8">
                      <CertificateTemplate 
                        data={{
                          ...csvData[previewIndex],
                          title: "CERTIFICATE",
                          subtitle: "OF PARTICIPATION",
                          description: eventName ? `for successfully participating in` : "",
                          eventName: eventName,
                          issuerName: issuerName,
                        }}
                        credentialId={"CX-PREV-" + Math.random().toString(36).substring(2, 8).toUpperCase()}
                      />
                    </div>
                  </TransformComponent>
                </>
              ) : (
                <>
                  <div className="absolute top-6 left-6 z-10 pointer-events-none">
                    <span className="bg-surface-bright px-4 py-2 rounded-none font-mono-label text-[12px] uppercase border border-outline-variant text-outline flex items-center gap-2 pointer-events-auto">
                      <Type className="w-3 h-3" /> TEMPLATE PREVIEW
                    </span>
                  </div>
                  <TransformComponent wrapperClass="w-full h-full min-h-[600px]">
                    <div className="w-[1000px] h-[700px] shrink-0 relative mt-8">
                      <CertificateTemplate 
                        data={{
                          name: "[Candidate Name]",
                          eventName: eventName,
                          issuerName: issuerName,
                        }}
                        credentialId="PREVIEW-ONLY"
                      />
                    </div>
                  </TransformComponent>
                </>
              )}
            </>
          )}
        </TransformWrapper>
      </div>
      
    </div>
  );
}
