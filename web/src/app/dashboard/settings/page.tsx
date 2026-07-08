import React from 'react';
import { Settings as SettingsIcon, Save } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="p-8 bg-surface-bright min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-end mb-8 border-b-2 border-pure-black pb-4">
          <div>
            <h1 className="font-playfair text-[48px] leading-none text-pure-black font-bold tracking-tight mb-2">Org Settings</h1>
            <p className="font-mono-label text-[12px] uppercase text-on-surface-variant tracking-wider">
              Manage your issuer identity and organization details
            </p>
          </div>
        </div>

        <div className="bg-pure-white border-2 border-pure-black border-b-8 border-r-8 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6 border-b border-outline-variant pb-4">
            <SettingsIcon className="w-6 h-6 text-primary" />
            <h2 className="font-dot text-[18px] uppercase tracking-wider text-pure-black">Organization Profile</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block font-mono-label text-[10px] uppercase text-outline mb-1">Organization Name</label>
              <input 
                type="text" 
                defaultValue="Stellar Developers Community"
                className="w-full px-3 py-2 bg-surface-bright border border-outline-variant focus:border-primary focus:outline-none font-hanken text-pure-black text-sm transition-colors"
              />
            </div>
            
            <div>
              <label className="block font-mono-label text-[10px] uppercase text-outline mb-1">Default Issuer Name</label>
              <input 
                type="text" 
                defaultValue="Rohit Verma"
                className="w-full px-3 py-2 bg-surface-bright border border-outline-variant focus:border-primary focus:outline-none font-hanken text-pure-black text-sm transition-colors"
              />
            </div>

            <div>
              <label className="block font-mono-label text-[10px] uppercase text-outline mb-1">Contact Email</label>
              <input 
                type="email" 
                defaultValue="admin@stellardevs.org"
                className="w-full px-3 py-2 bg-surface-bright border border-outline-variant focus:border-primary focus:outline-none font-hanken text-pure-black text-sm transition-colors"
              />
            </div>

            <button className="bg-primary text-pure-white px-6 py-3 font-dot text-[12px] uppercase hover:bg-inverse-surface transition-colors flex items-center gap-2 mt-4">
              <Save className="w-4 h-4" /> Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
