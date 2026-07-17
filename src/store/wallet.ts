import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StellarWalletsKit } from '@creit.tech/stellar-wallets-kit/sdk';
import { defaultModules } from '@creit.tech/stellar-wallets-kit/modules/utils';
import { Networks } from '@creit.tech/stellar-wallets-kit';

export interface WalletState {
  address: string | null;
  network: string;
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  setNetwork: (network: string) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      address: null,
      network: 'TESTNET',
      isConnecting: false,
      error: null,

      connect: async () => {
        set({ isConnecting: true, error: null });
        try {
          try {
            StellarWalletsKit.init({ modules: defaultModules() });
          } catch (e) {
            // Already initialized
          }
          const { address } = await StellarWalletsKit.authModal();
          set({ address, error: null });
          localStorage.setItem('certifyx_wallet', address);
        } catch (error: any) {
          console.error("Wallet connection failed:", error);
          set({ error: error.message || "Failed to connect wallet" });
        } finally {
          set({ isConnecting: false });
        }
      },

      disconnect: () => {
        set({ address: null, error: null });
        localStorage.removeItem('certifyx_wallet');
        StellarWalletsKit.disconnect().catch(console.error);
      },

      setNetwork: (network: string) => {
        set({ network });
      },

      setError: (error: string | null) => set({ error }),
      clearError: () => set({ error: null })
    }),
    {
      name: 'wallet-storage',
      partialize: (state) => ({ network: state.network, address: state.address }),
    }
  )
);
