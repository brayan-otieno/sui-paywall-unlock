<<<<<<< HEAD

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, Lock, Unlock, CheckCircle, XCircle } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { usePayment } from "@/contexts/PaymentContext";
import { useToast } from "@/hooks/use-toast";
=======
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, Lock, Unlock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { usePayment } from "@/contexts/PaymentContext";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
>>>>>>> 139731a (Initial backend implementation and simple authentication)

type PaywallData = {
  id: string;
  title: string;
<<<<<<< HEAD
  description: string;
  price: number;
  currency: string;
  content: string;
  creatorEmail: string;
=======
  description?: string;
  price: number;
  currency: string;
  content?: string;
  creator_email: string;
  has_access: boolean;
  created_at: string;
>>>>>>> 139731a (Initial backend implementation and simple authentication)
};

const Paywall = () => {
  const { id } = useParams<{ id: string }>();
<<<<<<< HEAD
  const { isConnected, walletAddress, connectWallet } = useWallet();
  const { processPayment, verifyPayment } = usePayment();
  const { toast } = useToast();
  const [paywall, setPaywall] = useState<PaywallData | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Mock paywall data - in real app, fetch from API
    const mockPaywall: PaywallData = {
      id: id || "1",
      title: "Premium Tutorial Series",
      description: "Unlock access to our comprehensive blockchain development tutorial series. Learn SUI development from scratch with hands-on examples.",
      price: 5.0,
      currency: "SUI",
      content: "🎉 Welcome to the Premium Tutorial Series!\n\n📚 What you'll learn:\n- SUI blockchain fundamentals\n- Smart contract development\n- DApp creation\n- Advanced patterns\n\n💡 This exclusive content includes:\n✅ 10+ video tutorials\n✅ Source code examples\n✅ Live coding sessions\n✅ Q&A support\n\nThank you for your purchase! Enjoy learning! 🚀",
      creatorEmail: "creator@example.com"
    };
    
    setPaywall(mockPaywall);

    // Check if user already has access
    if (walletAddress && id) {
      const hasPayment = verifyPayment(id, walletAddress);
      setHasAccess(hasPayment);
    }
  }, [id, walletAddress, verifyPayment]);
=======
  const [searchParams] = useSearchParams();
  const { isConnected, walletAddress, connectWallet } = useWallet();
  const { processPayment, verifyPayment, loading: paymentLoading } = usePayment();
  const { toast } = useToast();
  const [paywall, setPaywall] = useState<PaywallData | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (id) {
      loadPaywall();
    }
  }, [id]);

  useEffect(() => {
    // Check for payment status in URL params
    const paymentStatus = searchParams.get('payment');
    if (paymentStatus === 'success') {
      toast({
        title: "Payment Successful!",
        description: "You now have access to this content.",
      });
      // Reload paywall to get updated access status
      if (id) {
        loadPaywall();
      }
    } else if (paymentStatus === 'cancelled') {
      toast({
        title: "Payment Cancelled",
        description: "Your payment was cancelled.",
        variant: "destructive",
      });
    }
  }, [searchParams, id, toast]);

  const loadPaywall = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const response = await apiClient.getPaywall(id);
      setPaywall(response.paywall);
      setHasAccess(response.paywall.has_access);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load paywall",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
>>>>>>> 139731a (Initial backend implementation and simple authentication)

  const handlePayment = async () => {
    if (!isConnected || !walletAddress || !paywall) return;

    setIsProcessing(true);
    try {
<<<<<<< HEAD
      const payment = await processPayment(paywall.id, paywall.price, walletAddress);
      
      if (payment.status === 'success') {
        setHasAccess(true);
=======
      const result = await processPayment(paywall.id, walletAddress);
      
      if (result.success) {
        setHasAccess(true);
        await loadPaywall(); // Reload to get content
>>>>>>> 139731a (Initial backend implementation and simple authentication)
        toast({
          title: "Payment Successful!",
          description: "You now have access to this content.",
        });
      } else {
        toast({
          title: "Payment Failed",
<<<<<<< HEAD
          description: "Please try again.",
=======
          description: result.error || "Please try again.",
>>>>>>> 139731a (Initial backend implementation and simple authentication)
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Payment processing failed.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

<<<<<<< HEAD
  if (!paywall) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
=======
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2962FF] mx-auto mb-4"></div>
>>>>>>> 139731a (Initial backend implementation and simple authentication)
          <div className="text-lg">Loading paywall...</div>
        </div>
      </div>
    );
  }

<<<<<<< HEAD
=======
  if (!paywall) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="bg-card border-border shadow-lg max-w-md w-full mx-4">
          <CardContent className="text-center py-8">
            <XCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
            <h2 className="text-xl font-semibold mb-2">Paywall Not Found</h2>
            <p className="text-muted-foreground">The requested paywall could not be found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

>>>>>>> 139731a (Initial backend implementation and simple authentication)
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Wallet className="h-8 w-8 text-[#2962FF]" />
              <h1 className="text-2xl font-bold text-foreground">SUI Paywall</h1>
            </div>
            {!isConnected ? (
              <Button onClick={connectWallet} className="bg-[#2962FF] hover:bg-[#2962FF]/90">
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </Button>
            ) : (
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-[#4CAF50] border-[#4CAF50]">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-card border-border shadow-lg">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl text-foreground mb-2">{paywall.title}</CardTitle>
<<<<<<< HEAD
                <CardDescription className="text-muted-foreground text-base">
                  {paywall.description}
                </CardDescription>
=======
                {paywall.description && (
                  <CardDescription className="text-muted-foreground text-base">
                    {paywall.description}
                  </CardDescription>
                )}
                <div className="mt-4 text-sm text-muted-foreground">
                  Created by {paywall.creator_email}
                </div>
>>>>>>> 139731a (Initial backend implementation and simple authentication)
              </div>
              <Badge className="bg-[#2962FF] text-white text-lg px-3 py-1">
                {paywall.price} {paywall.currency}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            {hasAccess ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-[#4CAF50]">
                  <Unlock className="h-5 w-5" />
                  <span className="font-medium">Content Unlocked!</span>
                </div>
                <div className="bg-muted p-6 rounded-lg">
                  <pre className="whitespace-pre-wrap text-foreground">{paywall.content}</pre>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Lock className="h-5 w-5" />
                  <span>This content is locked. Pay to unlock access.</span>
                </div>
                
                <div className="bg-muted p-6 rounded-lg text-center">
                  <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Premium content is hidden until payment is completed.
                  </p>
                </div>

                <div className="flex justify-center">
                  {!isConnected ? (
                    <Button onClick={connectWallet} size="lg" className="bg-[#2962FF] hover:bg-[#2962FF]/90">
                      <Wallet className="h-4 w-4 mr-2" />
                      Connect Wallet to Pay
                    </Button>
                  ) : (
                    <Button 
                      onClick={handlePayment} 
<<<<<<< HEAD
                      disabled={isProcessing}
                      size="lg"
                      className="bg-[#4CAF50] hover:bg-[#4CAF50]/90"
                    >
                      {isProcessing ? (
=======
                      disabled={isProcessing || paymentLoading}
                      size="lg"
                      className="bg-[#4CAF50] hover:bg-[#4CAF50]/90"
                    >
                      {isProcessing || paymentLoading ? (
>>>>>>> 139731a (Initial backend implementation and simple authentication)
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Pay {paywall.price} {paywall.currency}
                        </>
                      )}
                    </Button>
                  )}
                </div>
<<<<<<< HEAD
=======

                {isConnected && (
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                      <AlertCircle className="h-4 w-4" />
                      <span>Secure payment powered by Swypt</span>
                    </div>
                  </div>
                )}
>>>>>>> 139731a (Initial backend implementation and simple authentication)
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

<<<<<<< HEAD
export default Paywall;
=======
export default Paywall;
>>>>>>> 139731a (Initial backend implementation and simple authentication)
