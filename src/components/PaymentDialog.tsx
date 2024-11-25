import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

interface PaymentDialogProps {
  userId: string;
  onPaymentSuccess: (userId: string) => void;
}

export function PaymentDialog({ userId, onPaymentSuccess }: PaymentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load Stripe script
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/buy-button.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSuccess = () => {
    onPaymentSuccess(userId);
    setIsOpen(false);
    toast({
      title: "Payment Successful",
      description: "You can now add unlimited users and custom tasks!",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90">
          Upgrade to Premium
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Upgrade to Premium
          </DialogTitle>
          <DialogDescription className="space-y-2">
            <p>Get access to premium features:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Create unlimited custom tasks</li>
              <li>Add unlimited users to your account</li>
              <li>Free accounts are limited to 1 user</li>
              <li>Premium features apply to all users in your account</li>
            </ul>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <stripe-buy-button
            buy-button-id="buy_btn_1QOwQZKl1HhOH6dTGrvffCLX"
            publishable-key="pk_test_lnic36gxPInNLXjUXX3GdGFs00XQhQetMe"
            onSuccess={handleSuccess}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}