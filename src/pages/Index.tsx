
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
    <div className="min-h-screen" style={{ background: '#F9FAFB' }}>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Wallet className="h-8 w-8" style={{ color: '#2962FF' }} />
                <h1 className="text-2xl font-bold" style={{ color: '#333333' }}>SUI Paywall</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-gray-300 hover:bg-gray-50"
                style={{ color: '#666666' }}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button 
                onClick={() => setIsCreateDialogOpen(true)} 
                className="text-white border-0"
                style={{ backgroundColor: '#2962FF' }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Paywall
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2" style={{ color: '#333333' }}>Creator Dashboard</h2>
          <p style={{ color: '#666666' }}>Manage your paywalls and track your SUI earnings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: '#666666' }}>Total Earnings</CardTitle>
              <BarChart3 className="h-4 w-4" style={{ color: '#2962FF' }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: '#2962FF' }}>{totalEarnings.toFixed(2)} SUI</div>
              <p className="text-xs" style={{ color: '#666666' }}>
                ≈ ${(totalEarnings * 0.85).toFixed(2)} USD
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: '#666666' }}>Total Views</CardTitle>
              <Link className="h-4 w-4" style={{ color: '#6A1B9A' }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: '#6A1B9A' }}>{totalViews}</div>
              <p className="text-xs" style={{ color: '#666666' }}>
                Across all paywalls
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: '#666666' }}>Conversion Rate</CardTitle>
              <BarChart3 className="h-4 w-4" style={{ color: '#4CAF50' }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: '#4CAF50' }}>
                {totalViews > 0 ? ((totalConversions / totalViews) * 100).toFixed(1) : 0}%
              </div>
              <p className="text-xs" style={{ color: '#666666' }}>
                {totalConversions} conversions
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="paywalls" className="space-y-6">
          <TabsList className="bg-gray-100">
            <TabsTrigger 
              value="paywalls" 
              className="data-[state=active]:text-white"
              style={{ 
                backgroundColor: 'transparent',
                color: '#666666',
                '&[data-state=active]': { backgroundColor: '#2962FF' }
              }}
            >My Paywalls</TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="data-[state=active]:text-white"
              style={{ 
                backgroundColor: 'transparent',
                color: '#666666',
                '&[data-state=active]': { backgroundColor: '#2962FF' }
              }}
            >Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="paywalls">
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle style={{ color: '#333333' }}>Your Paywalls</CardTitle>
                <CardDescription style={{ color: '#666666' }}>
                  Manage your content paywalls and track performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PaywallList paywalls={paywalls} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle style={{ color: '#333333' }}>Revenue Analytics</CardTitle>
                <CardDescription style={{ color: '#666666' }}>
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
