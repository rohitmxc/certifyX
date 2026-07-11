import React from "react";
import Link from "next/link";
import { Shield, LayoutTemplate, FileText, Settings, ArrowLeft, History, Activity, BarChart } from "lucide-react";
import { DotMatrixLogo } from "@/components/DotMatrixLogo";
import { MobileSidebar } from "@/components/MobileSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-on-background bg-grid-pattern flex flex-col md:flex-row">
      <MobileSidebar />
      {/* Sidebar Navigation */}
      <div className="w-64 bg-pure-white border-r border-primary flex-col hidden md:flex h-screen sticky top-0">
        <Link href="/" className="p-6 border-b border-primary flex items-center gap-2 font-bold tracking-tight text-primary hover:bg-surface-bright transition-colors">
          <Shield className="w-6 h-6 text-primary" />
          <DotMatrixLogo text="CERTIFYX" dotSize={2} gap={0.8} color="#000000" />
        </Link>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link 
            href="/dashboard/issue" 
            className="flex items-center gap-3 px-3 py-3 font-dot text-[14px] uppercase border border-transparent hover:border-primary hover:bg-surface-bright text-primary transition-colors"
          >
            <FileText className="w-5 h-5" />
            Issue Credentials
          </Link>
          <Link 
            href="/dashboard/templates/new" 
            className="flex items-center gap-3 px-3 py-3 font-dot text-[14px] uppercase border border-transparent hover:border-primary hover:bg-surface-bright text-primary transition-colors"
          >
            <LayoutTemplate className="w-5 h-5" />
            Template Builder
          </Link>
          <Link 
            href="/dashboard/history" 
            className="flex items-center gap-3 px-3 py-3 font-dot text-[14px] uppercase border border-transparent hover:border-primary hover:bg-surface-bright text-primary transition-colors"
          >
            <History className="w-5 h-5" />
            Issued Credentials
          </Link>
          <Link 
            href="/dashboard/activity" 
            className="flex items-center gap-3 px-3 py-3 font-dot text-[14px] uppercase border border-transparent hover:border-primary hover:bg-surface-bright text-primary transition-colors"
          >
            <Activity className="w-5 h-5" />
            Activity Feed
          </Link>
          <Link 
            href="/dashboard/analytics" 
            className="flex items-center gap-3 px-3 py-3 font-dot text-[14px] uppercase border border-transparent hover:border-primary hover:bg-surface-bright text-primary transition-colors"
          >
            <BarChart className="w-5 h-5" />
            Analytics
          </Link>
          <Link 
            href="/dashboard/settings" 
            className="flex items-center gap-3 px-3 py-3 font-dot text-[14px] uppercase border border-transparent hover:border-primary hover:bg-surface-bright text-outline transition-colors"
          >
            <Settings className="w-5 h-5" />
            Org Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-primary">
          <Link 
            href="/" 
            className="flex items-center justify-center gap-2 px-3 py-3 font-dot text-[14px] uppercase text-pure-white bg-primary hover:bg-inverse-surface transition-colors w-full"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto pt-[65px] md:pt-0">
        {children}
      </div>
    </div>
  );
}
