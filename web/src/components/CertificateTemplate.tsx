import React from 'react';
import { Calendar, Clock, MapPin, Users, ShieldCheck, Link as LinkIcon, Layers, Network } from 'lucide-react';
import QRCode from "react-qr-code";

interface CertificateTemplateProps {
  data?: Record<string, string>;
  credentialId: string;
  transactionHash?: string;
  verificationTime?: string;
}

export const CertificateTemplate: React.FC<CertificateTemplateProps> = ({
  data,
  credentialId,
  transactionHash,
  verificationTime,
}) => {
  const safeData = data || {};
  
  // Extract variables with fallbacks
  const title = safeData.title || "CERTIFICATE";
  const subtitle = safeData.subtitle || "OF PARTICIPATION";
  const presentedToText = safeData.presentedTo || "PROUDLY PRESENTED TO";
  const studentName = safeData.name || "[Candidate Name]";
  const description = safeData.description || "for successfully participating in";
  const eventName = safeData.eventName || "Blockchain & Web3 Workshop";
  const eventDetails = safeData.eventDetails || "An insightful session covering the fundamentals of Blockchain, Smart Contracts, and Web3 Development.";
  const dateStr = safeData.date || "May 18, 2025";
  const organizer = safeData.issuerName || "Stellar Developers Community";
  
  // Signatures should ideally be people's names, not the organizer
  const sig1Name = safeData.signature1Name || "Rohit Verma";
  const sig1Title = safeData.signature1Title || "COMMUNITY LEAD";
  
  const sig2Name = safeData.signature2Name || "Sneha Iyer";
  const sig2Title = safeData.signature2Title || "EVENT COORDINATOR";

  return (
    <div 
      id="certificate-node"
      style={{ backgroundColor: "#ffffff", boxShadow: '0 0 20px rgba(0,0,0,0.1)' }} 
      className="w-[1000px] h-[700px] relative overflow-hidden flex flex-col font-sans text-[#0B2046]"
    >
      {/* Outer Golden Border */}
      <div className="absolute inset-4 border-[1px] border-[#D4AF37] z-10 pointer-events-none"></div>
      <div className="absolute inset-[18px] border-[2px] border-[#D4AF37] z-10 pointer-events-none"></div>

      {/* Decorative Corners */}
      {/* Top Left */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-[#0B2046] rounded-br-[100%] z-0 opacity-10"></div>
      <div style={{ borderRightColor: "transparent", borderBottomColor: "transparent" }} className="absolute top-0 left-0 w-0 h-0 border-t-[80px] border-l-[80px] border-t-[#0B2046] border-l-[#0B2046] border-r-[80px] border-b-[80px] z-0"></div>
      
      {/* Top Right */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#0B2046] via-[#1A3673] to-transparent z-0 opacity-80" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}></div>
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#D4AF37] to-transparent z-0 opacity-40" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}></div>
      
      {/* Bottom Left */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#0B2046] via-[#1A3673] to-transparent z-0 opacity-80" style={{ clipPath: 'polygon(0 100%, 0 0, 100% 100%)' }}></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#D4AF37] to-transparent z-0 opacity-40" style={{ clipPath: 'polygon(0 100%, 0 0, 100% 100%)' }}></div>

      {/* Header Bar */}
      <div className="absolute top-[40px] left-[48px] right-[48px] z-20 flex justify-between items-start">
        {/* Left Logo */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 relative flex items-center justify-center">
            <ShieldCheck className="w-10 h-10 text-[#0B2046] absolute" strokeWidth={1.5} />
            <div className="w-3 h-3 bg-[#D4AF37] rounded-sm relative top-[-4px]"></div>
          </div>
          <div>
            <div className="font-bold text-[28px] tracking-tight text-[#0B2046] leading-none">CertifyX</div>
            <div style={{ color: "#6b7280" }} className="text-[11px] font-medium tracking-wide">Issue. Verify. Trust.</div>
          </div>
        </div>

        {/* Right Badge */}
        <div style={{ backgroundColor: "rgba(255, 255, 255, 0.9)", borderColor: "#e5e7eb" }} className="flex items-center gap-4 backdrop-blur-sm border py-2 px-4 rounded-xl shadow-sm">
          <div style={{ borderColor: "#e5e7eb" }} className="text-right border-r pr-4">
            <div style={{ color: "#6b7280" }} className="text-[10px] font-bold tracking-wider mb-0.5">CERTIFICATE ID</div>
            <div className="text-[12px] font-mono text-[#0B2046] font-semibold">{credentialId || "CX-2025-05-18-7F3A9B21"}</div>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="w-8 h-8 text-[#0B2046]" strokeWidth={1.5} />
            <div style={{ color: "#6b7280" }} className="text-[9px] font-bold leading-tight">
              VERIFIED ON<br/>
              <span className="text-[#0B2046] text-[11px]">STELLAR<br/>BLOCKCHAIN</span>
            </div>
          </div>
        </div>
      </div>

      {/* Left Sidebar */}
      <div className="absolute top-[200px] left-[48px] w-[200px] z-20 flex flex-col gap-6">
        <div className="flex items-start gap-4 p-3 rounded-lg transition-colors">
          <Calendar className="w-6 h-6 text-[#0B2046] shrink-0" strokeWidth={1.5} />
          <div>
            <div className="text-[10px] text-[#0B2046] font-bold tracking-wider mb-1 uppercase">DATE OF ISSUE</div>
            <div style={{ color: "#374151" }} className="text-[13px] font-medium">{dateStr}</div>
          </div>
        </div>
        
        <div className="flex items-start gap-4 p-3 rounded-lg transition-colors">
          <Clock className="w-6 h-6 text-[#0B2046] shrink-0" strokeWidth={1.5} />
          <div>
            <div className="text-[10px] text-[#0B2046] font-bold tracking-wider mb-1 uppercase">DURATION</div>
            <div style={{ color: "#374151" }} className="text-[13px] font-medium">6 Hours</div>
          </div>
        </div>

        <div className="flex items-start gap-4 p-3 rounded-lg transition-colors">
          <MapPin className="w-6 h-6 text-[#0B2046] shrink-0" strokeWidth={1.5} />
          <div>
            <div className="text-[10px] text-[#0B2046] font-bold tracking-wider mb-1 uppercase">MODE</div>
            <div style={{ color: "#374151" }} className="text-[13px] font-medium">Online</div>
          </div>
        </div>

        <div className="flex items-start gap-4 p-3 rounded-lg transition-colors">
          <Users className="w-6 h-6 text-[#0B2046] shrink-0" strokeWidth={1.5} />
          <div>
            <div className="text-[10px] text-[#0B2046] font-bold tracking-wider mb-1 uppercase">EVENT ORGANIZED BY</div>
            <div style={{ color: "#374151" }} className="text-[13px] font-medium leading-tight">{organizer}</div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="absolute top-[180px] right-[48px] w-[200px] z-20">
        <div style={{ borderColor: "#e5e7eb", backgroundColor: "rgba(249, 250, 251, 0.8)" }} className="border rounded-xl p-5 flex flex-col items-center w-full shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck style={{ color: "#16a34a" }} className="w-6 h-6" strokeWidth={2} />
            <div style={{ color: "#16a34a" }} className="font-bold text-[18px] tracking-wide">VERIFIED</div>
          </div>

          <div className="text-[10px] font-bold text-[#0B2046] uppercase tracking-wider mb-1 text-center">SCAN TO VERIFY</div>
          <div style={{ color: "#6b7280" }} className="text-[11px] mb-4 text-center leading-tight">
            {transactionHash ? "Scan to view blockchain record" : "Scan this QR code or visit"}
            <br/>
            <a 
              href={transactionHash ? `https://stellar.expert/explorer/testnet/tx/${transactionHash}` : `https://verify.certifyx.com/verify?id=${credentialId}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ color: "#2563eb" }} 
              className={transactionHash ? "hover:underline" : ""}
            >
              {transactionHash ? "stellar.expert" : "verify.certifyx.com"}
            </a>
          </div>

          <div style={{ backgroundColor: "#ffffff", borderColor: "#e5e7eb" }} className="w-32 h-32 border p-2 mb-4 rounded-lg shadow-sm flex items-center justify-center relative">
            <QRCode 
              value={transactionHash ? `https://stellar.expert/explorer/testnet/tx/${transactionHash}` : `https://verify.certifyx.com/verify?id=${credentialId}`}
              size={110}
              fgColor="#0B2046"
              level="H"
            />
            {/* QR Center Logo */}
            <div style={{ backgroundColor: "#ffffff", borderColor: "#e5e7eb" }} className="w-8 h-8 absolute flex items-center justify-center rounded-md border shadow-sm">
              <ShieldCheck className="w-5 h-5 text-[#0B2046]" />
            </div>
          </div>

          <div className="text-[9px] font-bold text-[#0B2046] uppercase tracking-wider mb-2 text-center">OR ENTER CREDENTIAL ID</div>
          <div style={{ borderColor: "#d1d5db", color: "#374151", backgroundColor: "#ffffff" }} className="w-full border py-1.5 px-2 text-center text-[10px] rounded-md tracking-widest font-mono truncate">
            {credentialId || "CX-2025"}
          </div>
        </div>
      </div>

      {/* Center Content */}
      <div className="absolute top-[95px] left-[260px] right-[260px] flex flex-col items-center text-center z-20">
        <h1 className="font-playfair text-[48px] text-[#0B2046] leading-none mb-1 font-bold tracking-tight w-full truncate">
          {title}
        </h1>
        <div className="flex items-center gap-4 mb-3 w-full justify-center">
          <div className="h-[1px] w-16 bg-[#D4AF37]"></div>
          <div className="w-2 h-2 rounded-full bg-[#D4AF37]"></div>
          <h2 className="text-[14px] text-[#D4AF37] font-semibold uppercase tracking-[0.2em] px-2 truncate max-w-[300px]">
            {subtitle}
          </h2>
          <div className="w-2 h-2 rounded-full bg-[#D4AF37]"></div>
          <div className="h-[1px] w-16 bg-[#D4AF37]"></div>
        </div>

        {/* Ribbon */}
        <div className="relative mb-3 flex justify-center items-center">
          <div style={{ borderTopColor: "transparent", borderBottomColor: "transparent" }} className="absolute -left-2 top-2 border-t-[8px] border-r-[8px] border-r-[#0B2046] border-b-[8px] brightness-50"></div>
          <div style={{ borderTopColor: "transparent", borderBottomColor: "transparent" }} className="absolute -right-2 top-2 border-t-[8px] border-l-[8px] border-l-[#0B2046] border-b-[8px] brightness-50"></div>
          <div className="bg-[#0B2046] text-white px-5 py-1 text-[10px] font-bold tracking-[0.15em] relative z-10 shadow-md">
            {presentedToText}
          </div>
        </div>

        <div className="font-great-vibes text-[56px] text-[#0B2046] mb-1 mt-1 relative z-10 w-full px-4" style={{ lineHeight: '1.1' }}>
          {studentName}
        </div>

        <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mb-2 relative">
          <div style={{ backgroundColor: "#ffffff" }} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 border border-[#D4AF37] rotate-45"></div>
        </div>

        <div style={{ color: "#374151" }} className="text-[12px] mb-1 px-4 truncate w-full">
          {description}
        </div>
        <div className="text-[18px] font-bold text-[#0B2046] mb-1 px-4 truncate w-full">
          {eventName}
        </div>
        <div style={{ color: "#6b7280" }} className="text-[11px] max-w-[380px] leading-relaxed line-clamp-2">
          {eventDetails}
        </div>
      </div>

      {/* Signatures & Seal Box */}
      <div className="absolute bottom-[80px] left-[260px] right-[260px] flex justify-between items-end z-20">
        {/* Signature 1 */}
        <div className="flex flex-col items-center w-48">
          <div className="font-great-vibes text-[32px] text-[#0B2046] mb-1 w-full text-center leading-none pb-1">
            {sig1Name}
          </div>
          <div style={{ borderColor: "#9ca3af" }} className="w-full border-t pt-2 text-center">
            <div className="text-[10px] font-bold text-[#0B2046] uppercase truncate">{sig1Name}</div>
            <div style={{ color: "#6b7280" }} className="text-[8px] font-bold uppercase truncate">{sig1Title}</div>
          </div>
        </div>

        {/* Gold Seal */}
        <div className="flex flex-col items-center justify-center relative z-30 mb-0">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#D4AF37] via-[#FFF2CD] to-[#AA7B12] p-1 shadow-lg relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-[1px] border-dashed border-[#AA7B12] m-1"></div>
            <div className="w-full h-full rounded-full bg-[#0B2046] flex flex-col items-center justify-center p-1 text-center border-2 border-[#D4AF37]">
              <div className="text-[6px] text-[#D4AF37] font-bold tracking-wider mb-0.5">CERTIFIED &</div>
              <ShieldCheck className="w-6 h-6 text-[#D4AF37] mb-0.5" strokeWidth={1.5} />
              <div className="text-[6px] text-[#D4AF37] font-bold tracking-wider leading-tight">BLOCKCHAIN<br/>VERIFIED</div>
            </div>
          </div>
        </div>

        {/* Signature 2 */}
        <div className="flex flex-col items-center w-48">
          <div className="font-great-vibes text-[32px] text-[#0B2046] mb-1 w-full text-center leading-none pb-1">
            {sig2Name}
          </div>
          <div style={{ borderColor: "#9ca3af" }} className="w-full border-t pt-2 text-center">
            <div className="text-[10px] font-bold text-[#0B2046] uppercase truncate">{sig2Name}</div>
            <div style={{ color: "#6b7280" }} className="text-[8px] font-bold uppercase truncate">{sig2Title}</div>
          </div>
        </div>
      </div>

      {/* Bottom Blockchain Meta Bar */}
      <div style={{ borderColor: "#e5e7eb" }} className="absolute bottom-[24px] left-[48px] right-[48px] border-t pt-3 flex justify-between items-center z-20">
        <div className="flex items-center gap-2 flex-1">
          <LinkIcon className="w-4 h-4 text-[#0B2046] shrink-0" strokeWidth={1.5} />
          <div className="overflow-hidden w-full pr-4">
            <div className="text-[8px] font-bold text-[#0B2046] uppercase tracking-wider mb-0.5">BLOCKCHAIN TRANSACTION</div>
            <div style={{ color: "#4b5563" }} className="text-[9px] font-mono">
              {transactionHash 
                ? `${transactionHash.substring(0, 20)}...${transactionHash.substring(transactionHash.length - 20)}` 
                : "PENDING ON-CHAIN CONFIRMATION..."}
            </div>
          </div>
        </div>

        <div style={{ borderColor: "#e5e7eb" }} className="flex items-center gap-2 px-4 border-l">
          <Clock className="w-4 h-4 text-[#0B2046] shrink-0" strokeWidth={1.5} />
          <div>
            <div className="text-[8px] font-bold text-[#0B2046] uppercase tracking-wider mb-0.5">DATE OF ISSUE</div>
            <div style={{ color: "#4b5563" }} className="text-[9px] font-mono">{verificationTime || dateStr}</div>
          </div>
        </div>

        <div style={{ borderColor: "#e5e7eb" }} className="flex items-center gap-2 pl-4 border-l">
          <Layers className="w-4 h-4 text-[#0B2046] shrink-0" strokeWidth={1.5} />
          <div>
            <div className="text-[8px] font-bold text-[#0B2046] uppercase tracking-wider mb-0.5">NETWORK</div>
            <div style={{ color: "#4b5563" }} className="text-[9px] font-mono">Stellar Testnet</div>
          </div>
        </div>
      </div>
      
      <div style={{ color: "#9ca3af" }} className="absolute bottom-1 w-full text-center text-[8px] z-20">
        This certificate is secured on the Stellar blockchain and cannot be altered or tampered with.
      </div>
    </div>
  );
};
