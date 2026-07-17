"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, LayoutTemplate, FileText, Settings, ArrowLeft, History, Activity, BarChart, Menu, X } from "lucide-react";
import { DotMatrixLogo } from "@/components/DotMatrixLogo";

export function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  // Close menu when route changes
  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/dashboard/issue", icon: FileText, label: "Issue Credentials" },
    { href: "/dashboard/templates/new", icon: LayoutTemplate, label: "Template Builder" },
    { href: "/dashboard/history", icon: History, label: "Issued Credentials" },
    { href: "/dashboard/activity", icon: Activity, label: "Activity Feed" },
    { href: "/dashboard/analytics", icon: BarChart, label: "Analytics" },
    { href: "/dashboard/settings", icon: Settings, label: "Org Settings" },
  ];

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between bg-pure-white border-b border-primary p-4 z-40 fixed top-0 w-full">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-primary">
          <Shield className="w-5 h-5 text-primary" />
          <DotMatrixLogo text="CERTIFYX" dotSize={2} gap={0.8} color="#000000" />
        </Link>
        <button onClick={toggleMenu} className="p-1 text-primary focus:outline-none">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-pure-black/50 z-40 md:hidden"
          onClick={toggleMenu}
        />
      )}

      {/* Slide-out Drawer */}
      <div className={`fixed top-[65px] right-0 bottom-0 w-64 bg-pure-white border-l border-primary z-50 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-3 font-dot text-[14px] uppercase border transition-colors ${
                  isActive 
                    ? 'border-primary bg-surface-bright text-primary' 
                    : 'border-transparent hover:border-primary hover:bg-surface-bright text-on-surface-variant hover:text-primary'
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-primary mt-auto">
          <Link 
            href="/" 
            className="flex items-center justify-center gap-2 px-3 py-3 font-dot text-[14px] uppercase text-pure-white bg-primary hover:bg-inverse-surface transition-colors w-full"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </>
  );
}
