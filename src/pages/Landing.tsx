import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#044639] to-[#FF4040] p-4">
      <Card className="max-w-xl w-full shadow-xl bg-white/90">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center text-[#044639]">Welcome to SUI Paywall</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <p className="text-lg text-center text-gray-700">
            Effortlessly monetize your content with secure, crypto-powered paywalls. Accept payments, track revenue, and manage your digital business—all in one place.
          </p>
          <div className="flex gap-4">
            <Button className="bg-[#044639] text-white px-8 py-2 text-lg" onClick={() => navigate("/login")}>Get Started</Button>
            <Button variant="outline" className="px-8 py-2 text-lg" onClick={() => navigate("/paywall/demo")}>View Demo</Button>
          </div>
        </CardContent>
      </Card>
      <footer className="mt-8 text-white/80 text-sm">&copy; {new Date().getFullYear()} SUI Paywall. All rights reserved.</footer>
    </div>
  );
};

export default LandingPage;
