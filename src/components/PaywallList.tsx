<<<<<<< HEAD

=======
>>>>>>> 139731a (Initial backend implementation and simple authentication)
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, ExternalLink, MoreHorizontal, Eye, TrendingUp } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface Paywall {
  id: string;
  title: string;
<<<<<<< HEAD
  price: string;
  currency: string;
  created: string;
  earnings: string;
  views: number;
  conversions: number;
=======
  description?: string;
  price: number;
  currency: string;
  created_at: string;
  total_earnings: number;
  total_views: number;
  total_conversions: number;
>>>>>>> 139731a (Initial backend implementation and simple authentication)
}

interface PaywallListProps {
  paywalls: Paywall[];
}

export const PaywallList = ({ paywalls }: PaywallListProps) => {
  const { toast } = useToast();

  const copyLink = (id: string) => {
    const url = `${window.location.origin}/paywall/${id}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "Paywall URL copied to clipboard",
    });
  };

  const openPaywall = (id: string) => {
    const url = `${window.location.origin}/paywall/${id}`;
    window.open(url, '_blank');
  };

<<<<<<< HEAD
=======
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

>>>>>>> 139731a (Initial backend implementation and simple authentication)
  if (paywalls.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-4 text-muted-foreground">
          <TrendingUp className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium mb-2 text-foreground">No paywalls yet</h3>
        <p className="text-muted-foreground">Create your first paywall to start earning SUI</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {paywalls.map((paywall) => (
        <Card key={paywall.id} className="hover:shadow-lg transition-shadow bg-card border-border">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg text-foreground">{paywall.title}</CardTitle>
<<<<<<< HEAD
                <CardDescription className="text-muted-foreground">Created {paywall.created}</CardDescription>
=======
                {paywall.description && (
                  <CardDescription className="text-muted-foreground mt-1">
                    {paywall.description}
                  </CardDescription>
                )}
                <CardDescription className="text-muted-foreground mt-2">
                  Created {formatDate(paywall.created_at)}
                </CardDescription>
>>>>>>> 139731a (Initial backend implementation and simple authentication)
              </div>
              <div className="flex items-center space-x-2">
                <Badge 
                  variant="secondary" 
                  className="text-white border-0 bg-[#2962FF]"
                >
                  {paywall.price} {paywall.currency}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="hover:bg-accent text-muted-foreground"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-card border-border">
                    <DropdownMenuItem 
                      onClick={() => copyLink(paywall.id)} 
                      className="hover:bg-accent text-foreground"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Link
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => openPaywall(paywall.id)} 
                      className="hover:bg-accent text-foreground"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open Paywall
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-[#2962FF]">
<<<<<<< HEAD
                  {paywall.earnings} SUI
=======
                  {typeof paywall.total_earnings === 'number' ? paywall.total_earnings.toFixed(4) : '0.0000'} SUI
>>>>>>> 139731a (Initial backend implementation and simple authentication)
                </div>
                <div className="text-sm text-muted-foreground">Earnings</div>
              </div>
              <div>
                <div className="text-2xl font-bold flex items-center justify-center text-[#6A1B9A]">
                  <Eye className="h-5 w-5 mr-1" />
<<<<<<< HEAD
                  {paywall.views}
=======
                  {paywall.total_views}
>>>>>>> 139731a (Initial backend implementation and simple authentication)
                </div>
                <div className="text-sm text-muted-foreground">Views</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#4CAF50]">
<<<<<<< HEAD
                  {paywall.views > 0 ? ((paywall.conversions / paywall.views) * 100).toFixed(1) : 0}%
=======
                  {paywall.total_views > 0 && typeof paywall.total_conversions === 'number' && typeof paywall.total_views === 'number' ? ((paywall.total_conversions / paywall.total_views) * 100).toFixed(1) : '0'}%
>>>>>>> 139731a (Initial backend implementation and simple authentication)
                </div>
                <div className="text-sm text-muted-foreground">Conversion</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
<<<<<<< HEAD
};
=======
};
>>>>>>> 139731a (Initial backend implementation and simple authentication)
