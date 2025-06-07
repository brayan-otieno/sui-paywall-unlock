
import React, { createContext, useContext, useState, useEffect } from 'react';

type WalletContextType = {
  isConnected: boolean;
  walletAddress: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  balance: number;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    // Check if wallet was previously connected
    const savedAddress = localStorage.getItem("walletAddress");
    if (savedAddress) {
      setIsConnected(true);
      setWalletAddress(savedAddress);
      setBalance(Math.random() * 100); // Mock balance
    }
  }, []);

  const connectWallet = async () => {
    try {
      // Simulate SUI wallet connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock wallet address generation
      const mockAddress = `0x${Math.random().toString(16).substr(2, 40)}`;
      
      setIsConnected(true);
      setWalletAddress(mockAddress);
      setBalance(Math.random() * 100);
      
      localStorage.setItem("walletAddress", mockAddress);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress(null);
    setBalance(0);
    localStorage.removeItem("walletAddress");
  };

  return (
    <WalletContext.Provider value={{
      isConnected,
      walletAddress,
      connectWallet,
      disconnectWallet,
      balance
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
