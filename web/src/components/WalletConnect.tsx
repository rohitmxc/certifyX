"use client";

import { useWalletStore } from '@/store/wallet';
import { Wallet, LogOut, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function WalletConnect() {
  const { address, isConnecting, error, connect, disconnect, network, setNetwork } = useWalletStore();

  if (address) {
    const displayAddress = `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;

    return (
      <div className="flex items-center gap-4">
        {/* Network Switcher */}
        <select 
          className="bg-transparent border border-outline px-2 py-1 font-mono-label text-[10px] uppercase text-pure-black outline-none"
          value={network}
          onChange={(e) => setNetwork(e.target.value)}
        >
          <option value="TESTNET">Testnet</option>
          <option value="PUBLIC">Mainnet</option>
          <option value="FUTURENET">Futurenet</option>
          <option value="STANDALONE">Local</option>
        </select>
        
        {/* Wallet Address & Disconnect */}
        <div className="flex items-center gap-3 bg-surface-bright px-3 py-1.5 border-2 border-pure-black shadow-[2px_2px_0_0_#0F0E0E]">
          <div className="w-2 h-2 rounded-full bg-[#1E28EB] animate-pulse"></div>
          <span className="font-mono text-sm font-semibold tracking-tight text-pure-black">
            {displayAddress}
          </span>
          <button 
            onClick={disconnect}
            className="ml-2 p-1 hover:bg-surface-variant transition-colors group"
            title="Disconnect Wallet"
          >
            <LogOut className="w-4 h-4 text-on-surface-variant group-hover:text-signal-red" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {error && (
        <div className="flex items-center gap-1 text-signal-red font-mono-label text-[10px] uppercase">
          <AlertCircle className="w-3 h-3" />
          <span>{error}</span>
        </div>
      )}
      <Button 
        onClick={connect} 
        disabled={isConnecting}
        className="bg-primary hover:bg-[#1520C0] text-pure-white rounded-none border border-transparent flex items-center gap-2 font-dot uppercase tracking-wider h-10 px-6 shadow-[2px_2px_0_0_#0F0E0E]"
      >
        {isConnecting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Wallet className="w-4 h-4" />
        )}
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </Button>
    </div>
  );
}
