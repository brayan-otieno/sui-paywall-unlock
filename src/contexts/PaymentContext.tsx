<<<<<<< HEAD

import React, { createContext, useContext, useState } from 'react';

type PaymentStatus = 'pending' | 'success' | 'failed';
=======
import React, { createContext, useContext, useState } from 'react';
import { apiClient } from '@/lib/api';
import { DepositModal, CryptoProvider } from 'swypt-checkout';
import 'swypt-checkout/dist/styles.css';

type PaymentStatus = 'pending' | 'completed' | 'failed' | 'cancelled';
>>>>>>> 139731a (Initial backend implementation and simple authentication)

type Payment = {
  id: string;
  paywallId: string;
<<<<<<< HEAD
  userAddress: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  timestamp: string;
=======
  amount: number;
  currency: string;
  status: PaymentStatus;
  created_at: string;
  paywall_title: string;
>>>>>>> 139731a (Initial backend implementation and simple authentication)
};

type PaymentContextType = {
  payments: Payment[];
<<<<<<< HEAD
  processPayment: (paywallId: string, amount: number, userAddress: string) => Promise<Payment>;
  verifyPayment: (paywallId: string, userAddress: string) => boolean;
  getPaymentHistory: (userAddress: string) => Payment[];
=======
  processPayment: (paywallId: string, walletAddress: string) => Promise<{ success: boolean; error?: string }>;
  verifyPayment: (paywallId: string) => Promise<boolean>;
  getPaymentHistory: () => Promise<Payment[]>;
  loading: boolean;
>>>>>>> 139731a (Initial backend implementation and simple authentication)
};

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider = ({ children }: { children: React.ReactNode }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
<<<<<<< HEAD

  const processPayment = async (paywallId: string, amount: number, userAddress: string): Promise<Payment> => {
    // Simulate Swypt payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const payment: Payment = {
      id: Date.now().toString(),
      paywallId,
      userAddress,
      amount,
      currency: 'SUI',
      status: Math.random() > 0.1 ? 'success' : 'failed', // 90% success rate
      timestamp: new Date().toISOString()
    };

    setPayments(prev => [...prev, payment]);
    
    // Store in localStorage for persistence
    const storedPayments = JSON.parse(localStorage.getItem('payments') || '[]');
    localStorage.setItem('payments', JSON.stringify([...storedPayments, payment]));
    
    return payment;
  };

  const verifyPayment = (paywallId: string, userAddress: string): boolean => {
    const allPayments = JSON.parse(localStorage.getItem('payments') || '[]');
    return allPayments.some((payment: Payment) => 
      payment.paywallId === paywallId && 
      payment.userAddress === userAddress && 
      payment.status === 'success'
    );
  };

  const getPaymentHistory = (userAddress: string): Payment[] => {
    const allPayments = JSON.parse(localStorage.getItem('payments') || '[]');
    return allPayments.filter((payment: Payment) => payment.userAddress === userAddress);
=======
  const [loading, setLoading] = useState(false);
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [depositConfig, setDepositConfig] = useState<any>(null);
  const [resolvePayment, setResolvePayment] = useState<any>(null);

  const processPayment = async (paywallId: string, walletAddress: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      const sessionResponse = await apiClient.createPaymentSession(paywallId, walletAddress);
      setDepositConfig({
        ...sessionResponse.swyptSession,
        onClose: () => setDepositModalOpen(false),
      });
      setDepositModalOpen(true);
      return await new Promise((resolve) => setResolvePayment(() => resolve));
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment processing failed',
      };
    }
  };

  const verifyPayment = async (paywallId: string): Promise<boolean> => {
    try {
      const response = await apiClient.getPaywall(paywallId);
      return response.paywall.has_access;
    } catch (error) {
      console.error('Payment verification error:', error);
      return false;
    }
  };

  const getPaymentHistory = async (): Promise<Payment[]> => {
    try {
      const response = await apiClient.getPaymentHistory();
      // Map backend paywall_id to paywallId for Payment type
      const mappedPayments = response.payments.map((p: any) => ({
        ...p,
        paywallId: p.paywall_id,
      }));
      setPayments(mappedPayments);
      return mappedPayments;
    } catch (error) {
      console.error('Get payment history error:', error);
      return [];
    }
>>>>>>> 139731a (Initial backend implementation and simple authentication)
  };

  return (
    <PaymentContext.Provider value={{
      payments,
      processPayment,
      verifyPayment,
<<<<<<< HEAD
      getPaymentHistory
    }}>
      {children}
=======
      getPaymentHistory,
      loading
    }}>
      <CryptoProvider>
        {children}
        {depositConfig && (
          <DepositModal
            isOpen={depositModalOpen}
            onClose={() => {
              setDepositModalOpen(false);
              if (resolvePayment) resolvePayment({ success: false, error: 'User closed modal' });
            }}
            headerBackgroundColor="linear-gradient(to right, #044639, #FF4040)"
            businessName={depositConfig.businessName || 'Your Business'}
            merchantName={depositConfig.merchantName || 'Your Merchant'}
            merchantAddress={depositConfig.merchantAddress}
            amount={depositConfig.amount}
            // ...add other props as needed from depositConfig
          />
        )}
      </CryptoProvider>
>>>>>>> 139731a (Initial backend implementation and simple authentication)
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
<<<<<<< HEAD
};
=======
};
>>>>>>> 139731a (Initial backend implementation and simple authentication)
