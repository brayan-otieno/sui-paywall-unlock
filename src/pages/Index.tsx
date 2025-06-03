
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Link, BarChart3, Settings, Wallet } from "lucide-react";
import { CreatePaywallDialog } from "@/components/CreatePaywallDialog";
import { PaywallList } from "@/components/PaywallList";
import { RevenueChart } from "@/components/RevenueChart";

const Index = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [paywalls, setPaywalls] = useState([
    {
      id: "1",
      title: "Premium Tutorial Series",
      price: "5.0",
      currency: "SUI",
      created: "2024-01-15",
      earnings: "125.50",
      views: 245,
      conversions: 25
    },
    {
      id: "2", 
      title: "Exclusive Research Report",
      price: "10.0",
      currency: "SUI", 
      created: "2024-01-10",
      earnings: "340.00",
      views: 189,
      conversions: 34
    }
  ]);

  const totalEarnings = paywalls.reduce((sum, p) => sum + parseFloat(p.earnings), 0);
  const totalViews = paywalls.reduce((sum, p) => sum + p.views, 0);
  const totalConversions = paywalls.reduce((sum, p) => sum + p.conversions, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900">
      <header className="bg-slate-800/90 backdrop-blur-sm shadow-lg border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Wallet className="h-8 w-8 text-cyan-400" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">SUI Paywall</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-0">
                <Plus className="h-4 w-4 mr-2" />
                Create Paywall
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Creator Dashboard</h2>
          <p className="text-slate-300">Manage your paywalls and track your SUI earnings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Total Earnings</CardTitle>
              <BarChart3 className="h-4 w-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-400">{totalEarnings.toFixed(2)} SUI</div>
              <p className="text-xs text-slate-400">
                ≈ ${(totalEarnings * 0.85).toFixed(2)} USD
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Total Views</CardTitle>
              <Link className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{totalViews}</div>
              <p className="text-xs text-slate-400">
                Across all paywalls
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Conversion Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-400">
                {totalViews > 0 ? ((totalConversions / totalViews) * 100).toFixed(1) : 0}%
              </div>
              <p className="text-xs text-slate-400">
                {totalConversions} conversions
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="paywalls" className="space-y-6">
          <TabsList className="bg-slate-800/50 border-slate-700/50">
            <TabsTrigger value="paywalls" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-slate-300">My Paywalls</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-slate-300">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="paywalls">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Your Paywalls</CardTitle>
                <CardDescription className="text-slate-400">
                  Manage your content paywalls and track performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PaywallList paywalls={paywalls} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Revenue Analytics</CardTitle>
                <CardDescription className="text-slate-400">
                  Track your earnings over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RevenueChart />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <CreatePaywallDialog 
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreatePaywall={(newPaywall) => {
          setPaywalls([...paywalls, { ...newPaywall, id: Date.now().toString() }]);
          setIsCreateDialogOpen(false);
        }}
      />
    </div>
  );
};

export default Index;
