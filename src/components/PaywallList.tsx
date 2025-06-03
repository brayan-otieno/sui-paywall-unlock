
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
  price: string;
  currency: string;
  created: string;
  earnings: string;
  views: number;
  conversions: number;
}

interface PaywallListProps {
  paywalls: Paywall[];
}

export const PaywallList = ({ paywalls }: PaywallListProps) => {
  const { toast } = useToast();

  const copyLink = (title: string) => {
    const url = `${window.location.origin}/paywall/${btoa(title.replace(/\s+/g, '-').toLowerCase())}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "Paywall URL copied to clipboard",
    });
  };

  const openPaywall = (title: string) => {
    const url = `${window.location.origin}/paywall/${btoa(title.replace(/\s+/g, '-').toLowerCase())}`;
    window.open(url, '_blank');
  };

  if (paywalls.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <TrendingUp className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No paywalls yet</h3>
        <p className="text-gray-500">Create your first paywall to start earning SUI</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {paywalls.map((paywall) => (
        <Card key={paywall.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg">{paywall.title}</CardTitle>
                <CardDescription>Created {paywall.created}</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">
                  {paywall.price} {paywall.currency}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => copyLink(paywall.title)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Link
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openPaywall(paywall.title)}>
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
                <div className="text-2xl font-bold text-green-600">
                  {paywall.earnings} SUI
                </div>
                <div className="text-sm text-gray-500">Earnings</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600 flex items-center justify-center">
                  <Eye className="h-5 w-5 mr-1" />
                  {paywall.views}
                </div>
                <div className="text-sm text-gray-500">Views</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {paywall.views > 0 ? ((paywall.conversions / paywall.views) * 100).toFixed(1) : 0}%
                </div>
                <div className="text-sm text-gray-500">Conversion</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
