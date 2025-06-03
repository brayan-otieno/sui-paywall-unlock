
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
        <div className="text-slate-500 mb-4">
          <TrendingUp className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">No paywalls yet</h3>
        <p className="text-slate-400">Create your first paywall to start earning SUI</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {paywalls.map((paywall) => (
        <Card key={paywall.id} className="hover:shadow-lg transition-shadow bg-slate-700/30 border-slate-600/50 hover:border-cyan-500/30">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg text-white">{paywall.title}</CardTitle>
                <CardDescription className="text-slate-400">Created {paywall.created}</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                  {paywall.price} {paywall.currency}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-600/50">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                    <DropdownMenuItem onClick={() => copyLink(paywall.title)} className="text-slate-300 hover:bg-slate-700 hover:text-white">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Link
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openPaywall(paywall.title)} className="text-slate-300 hover:bg-slate-700 hover:text-white">
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
                <div className="text-2xl font-bold text-cyan-400">
                  {paywall.earnings} SUI
                </div>
                <div className="text-sm text-slate-400">Earnings</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400 flex items-center justify-center">
                  <Eye className="h-5 w-5 mr-1" />
                  {paywall.views}
                </div>
                <div className="text-sm text-slate-400">Views</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-400">
                  {paywall.views > 0 ? ((paywall.conversions / paywall.views) * 100).toFixed(1) : 0}%
                </div>
                <div className="text-sm text-slate-400">Conversion</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
