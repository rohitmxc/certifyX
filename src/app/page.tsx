"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, QrCode, CloudLightning, Scan, Box, Cpu, FileText, Shield, Menu, X } from "lucide-react";
import WalletConnect from "@/components/WalletConnect";
import { DotMatrixLogo } from "@/components/DotMatrixLogo";
import { GlitchHash } from "@/components/GlitchHash";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [recentHashes, setRecentHashes] = useState<string[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuth = () => setIsConnected(!!localStorage.getItem("certifyx_wallet"));
    checkAuth();
    const interval = setInterval(checkAuth, 1000);
    
    // Fetch real recent hashes
    fetch('/api/recent-hashes')
      .then(res => res.json())
      .then(data => {
        if (data.hashes && data.hashes.length > 0) {
          setRecentHashes(data.hashes);
        } else {
          // Fallback if db is empty
          setRecentHashes(["7F3A...9B21", "E4C2...11A9", "8B9F...33D4"]);
        }
      })
      .catch(console.error);
      
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-background text-on-background font-body-lg antialiased overflow-x-hidden selection:bg-signal-red selection:text-white bg-grid-pattern min-h-screen">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          width: max-content;
          animation: marquee 30s linear infinite;
        }
      `}} />
      
      {/* ─── NAVBAR ─── */}
      <header className="fixed top-0 w-full z-50 bg-background/90 backdrop-blur-md border-b border-outline-variant/30 transition-all duration-300">
        <div className="max-w-[1280px] mx-auto px-margin h-16 flex justify-between items-center px-4 md:px-8">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity shrink-0">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            <DotMatrixLogo text="CERTIFYX" dotSize={2} gap={0.8} color="#000000" />
            <span className="font-dot text-[10px] sm:text-[12px] text-outline uppercase border border-outline-variant px-1 rounded-none">BETA</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {!isConnected && (
              <>
                <Link className="text-on-surface-variant font-dot text-[16px] hover:text-pure-black transition-colors uppercase" href="#features">Features</Link>
                <Link className="text-on-surface-variant font-dot text-[16px] hover:text-pure-black transition-colors uppercase" href="#how-it-works">How it works</Link>
              </>
            )}
            {isConnected && (
              <>
                <Link className="text-primary font-dot text-[16px] uppercase hover:text-pure-black transition-colors" href="/dashboard/issue">Dashboard</Link>
                <Link className="text-on-surface-variant font-dot text-[16px] hover:text-pure-black transition-colors uppercase" href="/dashboard/history">History</Link>
                <Link className="text-on-surface-variant font-dot text-[16px] hover:text-pure-black transition-colors uppercase" href="/dashboard/settings">Settings</Link>
              </>
            )}
          </nav>
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <WalletConnect />
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-primary focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-pure-white border-b border-outline-variant/30 shadow-lg p-6 flex flex-col gap-6">
            <nav className="flex flex-col gap-4">
              {!isConnected && (
                <>
                  <Link onClick={() => setIsMobileMenuOpen(false)} className="text-on-surface-variant font-dot text-[18px] hover:text-pure-black transition-colors uppercase" href="#features">Features</Link>
                  <Link onClick={() => setIsMobileMenuOpen(false)} className="text-on-surface-variant font-dot text-[18px] hover:text-pure-black transition-colors uppercase" href="#how-it-works">How it works</Link>
                </>
              )}
              {isConnected && (
                <>
                  <Link onClick={() => setIsMobileMenuOpen(false)} className="text-primary font-dot text-[18px] uppercase hover:text-pure-black transition-colors" href="/dashboard/issue">Dashboard</Link>
                  <Link onClick={() => setIsMobileMenuOpen(false)} className="text-on-surface-variant font-dot text-[18px] uppercase hover:text-pure-black transition-colors" href="/dashboard/history">History</Link>
                  <Link onClick={() => setIsMobileMenuOpen(false)} className="text-on-surface-variant font-dot text-[18px] uppercase hover:text-pure-black transition-colors" href="/dashboard/settings">Settings</Link>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      <main className="pt-32 pb-32 relative">
        
        {/* ─── HERO SECTION ─── */}
        <section className="max-w-[1280px] mx-auto px-4 md:px-8 text-center mt-12 md:mt-24">
          <div className="inline-flex items-center justify-center px-3 py-1 rounded-none bg-surface-container-high text-pure-black font-dot text-[14px] uppercase mb-8 border border-outline-variant">
            Used by 5,000+ communities worldwide
          </div>
          
          <h1 className="font-dot text-[48px] md:text-[80px] text-pure-black max-w-4xl mx-auto mb-6 leading-[1.1] uppercase tracking-tight">
            Issue credentials <br className="hidden md:block"/> instantly
          </h1>
          
          <p className="font-hanken text-[18px] text-on-surface-variant max-w-2xl mx-auto mb-12">
            Send tamper-proof digital certificates in seconds. Your students own them forever. Verified instantly on the Stellar blockchain, with no monthly fee.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard/issue" className="bg-pure-black hover:bg-inverse-surface text-pure-white font-dot text-[16px] uppercase px-8 py-4 rounded-none transition-all duration-200 active:scale-95 flex items-center gap-2 w-full sm:w-auto justify-center">
              {isConnected ? "Go to Dashboard" : "Issue Credentials"}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-8 mt-16 text-pure-black font-dot text-[14px] uppercase tracking-wider">
            <div className="flex items-center gap-2 border border-outline-variant px-4 py-2 bg-surface-container-lowest rounded-none">
              <ShieldCheck className="w-4 h-4" />
              Blockchain Verified 100%
            </div>
            <div className="flex items-center gap-2 border border-outline-variant px-4 py-2 bg-surface-container-lowest rounded-none">
              <CloudLightning className="w-4 h-4" />
              Zero Storage Costs
            </div>
            <div className="flex items-center gap-2 border border-outline-variant px-4 py-2 bg-surface-container-lowest rounded-none">
              <Scan className="w-4 h-4" />
              Instant QR Scan
            </div>
          </div>
          
          <div className="mt-20 w-full max-w-[100vw] overflow-hidden border-y border-outline-variant py-4 bg-surface-bright relative -mx-4 md:-mx-8 lg:mx-0 lg:w-auto">
            <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-surface-bright to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-surface-bright to-transparent z-10 pointer-events-none"></div>
            
            <div className="animate-marquee hover:[animation-play-state:paused]">
              <div className="flex gap-16 px-8">
                {/* Render the list twice for seamless looping */}
                {[...recentHashes, ...recentHashes, ...recentHashes].map((hash, i) => (
                  <div key={i} className="flex items-center gap-2 font-mono text-[13px] text-on-surface-variant cursor-default">
                    <span className="text-pure-black font-bold text-[18px] leading-none mb-1">●</span> 
                    <span className="font-dot uppercase text-pure-black tracking-widest">ISSUED:</span> 
                    <GlitchHash hash={hash} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── FEATURES SECTION ─── */}
        <section id="features" className="max-w-[1280px] mx-auto px-4 md:px-8 mt-32">
          <div className="text-center mb-16">
            <h2 className="font-dot text-[32px] md:text-[48px] text-pure-black uppercase">SYSTEM CAPABILITIES</h2>
            <div className="h-1 w-24 bg-pure-black mx-auto mt-4"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-surface-container-lowest border border-outline-variant p-8 rounded-none flex flex-col items-start hover:border-pure-black transition-colors">
              <div className="p-3 bg-surface-container border border-outline-variant mb-6">
                <Box className="w-8 h-8 text-pure-black" />
              </div>
              <h3 className="font-dot text-[20px] text-pure-black uppercase mb-3">BATCH ISSUANCE</h3>
              <p className="font-hanken text-on-surface-variant leading-relaxed">
                Upload CSV files to instantly issue hundreds of credentials at once. Our system automatically processes names, emails, and generates individual on-chain hashes.
              </p>
            </div>
            
            <div className="bg-surface-container-lowest border border-outline-variant p-8 rounded-none flex flex-col items-start hover:border-pure-black transition-colors">
              <div className="p-3 bg-surface-container border border-outline-variant mb-6">
                <FileText className="w-8 h-8 text-pure-black" />
              </div>
              <h3 className="font-dot text-[20px] text-pure-black uppercase mb-3">CUSTOM TEMPLATES</h3>
              <p className="font-hanken text-on-surface-variant leading-relaxed">
                Use our visual drag-and-drop builder to design beautiful certificates that match your brand. Save templates for recurring programs and events.
              </p>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant p-8 rounded-none flex flex-col items-start hover:border-pure-black transition-colors">
              <div className="p-3 bg-surface-container border border-outline-variant mb-6">
                <Cpu className="w-8 h-8 text-pure-black" />
              </div>
              <h3 className="font-dot text-[20px] text-pure-black uppercase mb-3">SOROBAN SMART CONTRACTS</h3>
              <p className="font-hanken text-on-surface-variant leading-relaxed">
                Every credential is cryptographically anchored to the Stellar network using Soroban. Verification is mathematically proven and immutable.
              </p>
            </div>
          </div>
        </section>


      </main>

      {/* ─── FOOTER ─── */}
      <footer className="border-t-[2px] border-pure-black bg-surface-container-lowest pt-16 pb-8">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <span className="font-dot text-[32px] text-pure-black tracking-tight uppercase">CertifyX</span>
              </div>
              <p className="font-hanken text-on-surface-variant max-w-sm mb-6">
                The next-generation platform for issuing, managing, and verifying cryptographic credentials on the Stellar blockchain.
              </p>
              <div className="flex gap-4">
                {/* Social placeholders */}
                <div className="w-10 h-10 border border-outline-variant flex items-center justify-center hover:border-pure-black cursor-pointer transition-colors">
                  <span className="font-dot text-[16px]">X</span>
                </div>
                <div className="w-10 h-10 border border-outline-variant flex items-center justify-center hover:border-pure-black cursor-pointer transition-colors">
                  <span className="font-dot text-[16px]">G</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-dot text-[16px] text-pure-black uppercase mb-6">PLATFORM</h4>
              <ul className="space-y-4 font-hanken text-on-surface-variant">
                <li><Link href="#features" className="hover:text-pure-black transition-colors">Features</Link></li>
                <li><Link href="#how-it-works" className="hover:text-pure-black transition-colors">How it Works</Link></li>
                <li><Link href="/dashboard/issue" className="hover:text-pure-black transition-colors">Issue Credentials</Link></li>
                <li><Link href="/dashboard/templates/new" className="hover:text-pure-black transition-colors">Template Builder</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-dot text-[16px] text-pure-black uppercase mb-6">RESOURCES</h4>
              <ul className="space-y-4 font-hanken text-on-surface-variant">
                <li><Link href="#" className="hover:text-pure-black transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-pure-black transition-colors">Stellar Network</Link></li>
                <li><Link href="#" className="hover:text-pure-black transition-colors">API Reference</Link></li>
                <li><Link href="#" className="hover:text-pure-black transition-colors">Support</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-outline-variant pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="font-dot text-[12px] text-outline uppercase">© 2026 CERTIFYX TECHNOLOGIES</div>
            <div className="flex gap-6">
              <Link className="font-dot text-[12px] text-outline hover:text-pure-black uppercase transition-colors" href="#">Terms of Service</Link>
              <Link className="font-dot text-[12px] text-outline hover:text-pure-black uppercase transition-colors" href="#">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
