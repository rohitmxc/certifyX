"use client";

import { useState, useEffect } from 'react';
import { useWalletStore } from '@/store/wallet';
import { Wallet, LogOut, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Horizon } from '@stellar/stellar-sdk';

export default function WalletConnect() {
  const { address, isConnecting, error, connect, disconnect, network, setNetwork } = useWalletStore();
  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    if (address) {
      const fetchBalance = async () => {
        try {
          // Use Testnet horizon for simplicity, or select based on network
          const horizonUrl = network === 'PUBLIC' ? 'https://horizon.stellar.org' : 'https://horizon-testnet.stellar.org';
          const server = new Horizon.Server(horizonUrl);
          const account = await server.loadAccount(address);
          const nativeBalance = account.balances.find(b => b.asset_type === 'native');
          if (nativeBalance) {
            setBalance(parseFloat(nativeBalance.balance).toFixed(2));
          }
        } catch (e) {
          console.error("Could not fetch balance", e);
        }
      };
      fetchBalance();
      const interval = setInterval(fetchBalance, 10000);
      return () => clearInterval(interval);
    } else {
      setBalance(null);
    }
  }, [address, network]);

  if (address) {
    const displayAddress = `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;

    return (
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Network Switcher */}
        <select 
          className="hidden sm:block bg-transparent border border-outline px-2 py-1 font-mono-label text-[10px] uppercase text-pure-black outline-none"
          value={network}
          onChange={(e) => setNetwork(e.target.value)}
        >
          <option value="TESTNET">Testnet</option>
          <option value="PUBLIC">Mainnet</option>
          <option value="FUTURENET">Futurenet</option>
          <option value="STANDALONE">Local</option>
        </select>
        
        {/* Wallet Address & Disconnect */}
        <div className="flex items-center gap-1 sm:gap-3 bg-surface-bright px-2 py-1 sm:px-3 sm:py-1.5 border-2 border-pure-black shadow-[2px_2px_0_0_#0F0E0E]">
          <div className="hidden sm:block w-2 h-2 rounded-full bg-[#1E28EB] animate-pulse"></div>
          {balance && (
            <span className="font-mono text-[10px] sm:text-[12px] font-bold tracking-tight text-primary mr-1 whitespace-nowrap">
              <span className="sm:hidden">{Math.floor(parseFloat(balance))} XLM</span>
              <span className="hidden sm:inline">{balance} XLM</span>
            </span>
          )}
          <span className="font-mono text-[10px] sm:text-sm font-semibold tracking-tight text-pure-black whitespace-nowrap shrink-0">
            <span className="sm:hidden">{address.substring(0, 4)}...</span>
            <span className="hidden sm:inline">{displayAddress}</span>
          </span>
          <button 
            onClick={disconnect}
            className="ml-1 sm:ml-2 p-1 hover:bg-surface-variant transition-colors group"
            title="Disconnect Wallet"
          >
            <LogOut className="w-3 h-3 sm:w-4 sm:h-4 text-on-surface-variant group-hover:text-signal-red" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {error && (
        <div className="hidden sm:flex items-center gap-1 text-signal-red font-mono-label text-[10px] uppercase">
          <AlertCircle className="w-3 h-3" />
          <span>{error}</span>
        </div>
      )}
      <Button 
        onClick={connect} 
        disabled={isConnecting}
        className="bg-primary hover:bg-[#1520C0] text-pure-white rounded-none border border-transparent flex items-center gap-1 sm:gap-2 font-dot uppercase tracking-wider h-8 sm:h-10 px-3 sm:px-6 text-[10px] sm:text-[14px] shadow-[2px_2px_0_0_#0F0E0E]"
      >
        {isConnecting ? (
          <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
        ) : (
          <Wallet className="w-3 h-3 sm:w-4 sm:h-4" />
        )}
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </Button>
    </div>
  );
}
