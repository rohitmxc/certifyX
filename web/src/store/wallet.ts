import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
          const { isConnected, requestAccess, isAllowed, setAllowed } = await import('@stellar/freighter-api');
          
          if (!(await isConnected())) {
            throw new Error("Freighter is not installed or connected.");
          }
          
          let allowed = await isAllowed();
          if (!allowed) {
            await setAllowed();
            allowed = await isAllowed();
            if (!allowed) throw new Error("Permission to connect was denied.");
          }
          
          const response = await requestAccess();
          if (response.error) throw new Error(response.error as string);
          const address = response.address;
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
