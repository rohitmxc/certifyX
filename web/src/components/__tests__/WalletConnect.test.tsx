import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import WalletConnect from '@/components/WalletConnect';
import { useWalletStore } from '@/store/wallet';

// Mock the zustand store
vi.mock('@/store/wallet', () => ({
  useWalletStore: vi.fn(),
}));

describe('WalletConnect Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders connect button when no address is present', () => {
    // @ts-ignore
    useWalletStore.mockReturnValue({
      address: null,
      isConnecting: false,
      error: null,
      connect: vi.fn(),
    });

    render(<WalletConnect />);
    expect(screen.getByText(/Connect Wallet/i)).toBeInTheDocument();
  });

  it('shows loading state during connection', () => {
    // @ts-ignore
    useWalletStore.mockReturnValue({
      address: null,
      isConnecting: true,
      error: null,
      connect: vi.fn(),
    });

    render(<WalletConnect />);
    expect(screen.getByText(/Connecting.../i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders network switcher and wallet address when connected', () => {
    // @ts-ignore
    useWalletStore.mockReturnValue({
      address: 'GABCDEFGHIJKLMN1234567890',
      isConnecting: false,
      error: null,
      network: 'TESTNET',
      disconnect: vi.fn(),
      setNetwork: vi.fn(),
    });

    render(<WalletConnect />);
    
    // Check truncated address
    expect(screen.getByText(/GABC...7890/i)).toBeInTheDocument();
    
    // Check network switcher
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByDisplayValue(/Testnet/i)).toBeInTheDocument();
  });

  it('calls connect function on click', () => {
    const connectMock = vi.fn();
    // @ts-ignore
    useWalletStore.mockReturnValue({
      address: null,
      isConnecting: false,
      error: null,
      connect: connectMock,
    });

    render(<WalletConnect />);
    fireEvent.click(screen.getByText(/Connect Wallet/i));
    
    expect(connectMock).toHaveBeenCalledTimes(1);
  });
});
