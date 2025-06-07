
import React, { createContext, useContext, useState } from 'react';

type PaymentStatus = 'pending' | 'success' | 'failed';

type Payment = {
  id: string;
  paywallId: string;
  userAddress: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  timestamp: string;
};

type PaymentContextType = {
  payments: Payment[];
  processPayment: (paywallId: string, amount: number, userAddress: string) => Promise<Payment>;
  verifyPayment: (paywallId: string, userAddress: string) => boolean;
  getPaymentHistory: (userAddress: string) => Payment[];
};

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider = ({ children }: { children: React.ReactNode }) => {
  const [payments, setPayments] = useState<Payment[]>([]);

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
  };

  return (
    <PaymentContext.Provider value={{
      payments,
      processPayment,
      verifyPayment,
      getPaymentHistory
    }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};
