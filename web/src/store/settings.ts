import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  organizationName: string;
  defaultIssuerName: string;
  contactEmail: string;
  setSettings: (settings: Partial<SettingsState>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      organizationName: "Stellar Developers Community",
      defaultIssuerName: "Rohit Verma",
      contactEmail: "admin@stellardevs.org",
      setSettings: (settings) => set((state) => ({ ...state, ...settings })),
    }),
    {
      name: 'certifyx-settings', // name of the item in the storage (must be unique)
    }
  )
);
