
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Link, BarChart3, Settings, Wallet, Moon, Sun } from "lucide-react";
import { CreatePaywallDialog } from "@/components/CreatePaywallDialog";
import { PaywallList } from "@/components/PaywallList";
import { RevenueChart } from "@/components/RevenueChart";
import { ThemeProvider, useTheme } from "@/components/ThemeProvider";

const DashboardContent = () => {
  const { theme, toggleTheme } = useTheme();
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
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Wallet className="h-8 w-8 text-[#2962FF]" />
                <h1 className="text-2xl font-bold text-foreground">SUI Paywall</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleTheme}
                className="text-muted-foreground hover:text-foreground"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-muted-foreground hover:text-foreground"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button 
                onClick={() => setIsCreateDialogOpen(true)} 
                className="text-white border-0 bg-[#2962FF] hover:bg-[#2962FF]/90"
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
          <h2 className="text-3xl font-bold mb-2 text-foreground">Creator Dashboard</h2>
          <p className="text-muted-foreground">Manage your paywalls and track your SUI earnings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
              <BarChart3 className="h-4 w-4 text-[#2962FF]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#2962FF]">{totalEarnings.toFixed(2)} SUI</div>
              <p className="text-xs text-muted-foreground">
                ≈ ${(totalEarnings * 0.85).toFixed(2)} USD
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Views</CardTitle>
              <Link className="h-4 w-4 text-[#6A1B9A]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#6A1B9A]">{totalViews}</div>
              <p className="text-xs text-muted-foreground">
                Across all paywalls
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-[#4CAF50]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#4CAF50]">
                {totalViews > 0 ? ((totalConversions / totalViews) * 100).toFixed(1) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                {totalConversions} conversions
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="paywalls" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger 
              value="paywalls" 
              className="text-muted-foreground data-[state=active]:bg-[#2962FF] data-[state=active]:text-white"
            >My Paywalls</TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="text-muted-foreground data-[state=active]:bg-[#2962FF] data-[state=active]:text-white"
            >Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="paywalls">
            <Card className="bg-card border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-foreground">Your Paywalls</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Manage your content paywalls and track performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PaywallList paywalls={paywalls} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="bg-card border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-foreground">Revenue Analytics</CardTitle>
                <CardDescription className="text-muted-foreground">
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

const Index = () => {
  return (
    <ThemeProvider>
      <DashboardContent />
    </ThemeProvider>
  );
};

export default Index;
