
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreatePaywallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreatePaywall: (paywall: any) => void;
}

export const CreatePaywallDialog = ({ open, onOpenChange, onCreatePaywall }: CreatePaywallDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [content, setContent] = useState("");
  const [isCreated, setIsCreated] = useState(false);
  const [paywallUrl, setPaywallUrl] = useState("");
  const { toast } = useToast();

  const handleCreate = () => {
    if (!title || !price || !content) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newPaywall = {
      title,
      description,
      price,
      currency: "SUI",
      content,
      created: new Date().toISOString().split('T')[0],
      earnings: "0.00",
      views: 0,
      conversions: 0
    };

    const url = `${window.location.origin}/paywall/${btoa(title.replace(/\s+/g, '-').toLowerCase())}`;
    setPaywallUrl(url);
    setIsCreated(true);
    onCreatePaywall(newPaywall);
    
    toast({
      title: "Paywall created!",
      description: "Your paywall link is ready to share",
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(paywallUrl);
    toast({
      title: "Copied!",
      description: "Paywall URL copied to clipboard",
    });
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setContent("");
    setIsCreated(false);
    setPaywallUrl("");
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        {!isCreated ? (
          <>
            <DialogHeader>
              <DialogTitle style={{ color: '#333333' }}>Create New Paywall</DialogTitle>
              <DialogDescription style={{ color: '#666666' }}>
                Set up a new paywall for your content. Users will pay in SUI to unlock it.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title" style={{ color: '#333333' }}>Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Premium Tutorial Series"
                  className="border-gray-300 focus:border-blue-500"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description" style={{ color: '#333333' }}>Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of what users will get..."
                  rows={3}
                  className="border-gray-300 focus:border-blue-500"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="price" style={{ color: '#333333' }}>Price (SUI) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="5.0"
                  className="border-gray-300 focus:border-blue-500"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="content" style={{ color: '#333333' }}>Protected Content *</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="This is the content that will be unlocked after payment..."
                  rows={4}
                  className="border-gray-300 focus:border-blue-500"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={handleClose} className="border-gray-300 hover:bg-gray-50">
                Cancel
              </Button>
              <Button 
                onClick={handleCreate}
                className="text-white border-0"
                style={{ backgroundColor: '#2962FF' }}
              >
                Create Paywall
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle style={{ color: '#333333' }}>Paywall Created Successfully!</DialogTitle>
              <DialogDescription style={{ color: '#666666' }}>
                Your paywall is ready. Share this link with your audience.
              </DialogDescription>
            </DialogHeader>
            
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg" style={{ color: '#333333' }}>{title}</CardTitle>
                <CardDescription style={{ color: '#666666' }}>Price: {price} SUI</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 p-3 rounded-lg" style={{ backgroundColor: '#F9FAFB' }}>
                  <code className="flex-1 text-sm font-mono break-all" style={{ color: '#333333' }}>{paywallUrl}</code>
                  <Button size="sm" variant="outline" onClick={copyToClipboard} className="border-gray-300">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => window.open(paywallUrl, '_blank')}
                    className="text-white border-0"
                    style={{ backgroundColor: '#2962FF' }}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <DialogFooter>
              <Button 
                onClick={handleClose}
                className="text-white border-0"
                style={{ backgroundColor: '#2962FF' }}
              >
                Done
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
