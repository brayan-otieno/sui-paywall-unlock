<<<<<<< HEAD

=======
>>>>>>> 139731a (Initial backend implementation and simple authentication)
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
<<<<<<< HEAD
import { AuthProvider } from "@/contexts/AuthContext";
=======
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
>>>>>>> 139731a (Initial backend implementation and simple authentication)
import { WalletProvider } from "@/contexts/WalletContext";
import { PaymentProvider } from "@/contexts/PaymentContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Paywall from "./pages/Paywall";
import NotFound from "./pages/NotFound";
<<<<<<< HEAD

const queryClient = new QueryClient();

=======
import LandingPage from "./pages/Landing";

const queryClient = new QueryClient();

const AppContent = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2962FF] mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/paywall/:id" element={<Paywall />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Index />
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

>>>>>>> 139731a (Initial backend implementation and simple authentication)
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <WalletProvider>
        <PaymentProvider>
          <AuthProvider>
            <BrowserRouter>
<<<<<<< HEAD
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/paywall/:id" element={<Paywall />} />
                <Route path="/" element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
=======
              <AppContent />
>>>>>>> 139731a (Initial backend implementation and simple authentication)
            </BrowserRouter>
          </AuthProvider>
        </PaymentProvider>
      </WalletProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> 139731a (Initial backend implementation and simple authentication)
