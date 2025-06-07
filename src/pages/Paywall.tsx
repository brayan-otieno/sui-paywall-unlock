
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, Lock, Unlock, CheckCircle, XCircle } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { usePayment } from "@/contexts/PaymentContext";
import { useToast } from "@/hooks/use-toast";

type PaywallData = {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  content: string;
  creatorEmail: string;
};

const Paywall = () => {
  const { id } = useParams<{ id: string }>();
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

  const handlePayment = async () => {
    if (!isConnected || !walletAddress || !paywall) return;

    setIsProcessing(true);
    try {
      const payment = await processPayment(paywall.id, paywall.price, walletAddress);
      
      if (payment.status === 'success') {
        setHasAccess(true);
        toast({
          title: "Payment Successful!",
          description: "You now have access to this content.",
        });
      } else {
        toast({
          title: "Payment Failed",
          description: "Please try again.",
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

  if (!paywall) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg">Loading paywall...</div>
        </div>
      </div>
    );
  }

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
                <CardDescription className="text-muted-foreground text-base">
                  {paywall.description}
                </CardDescription>
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
                      disabled={isProcessing}
                      size="lg"
                      className="bg-[#4CAF50] hover:bg-[#4CAF50]/90"
                    >
                      {isProcessing ? (
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
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Paywall;
