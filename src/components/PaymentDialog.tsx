import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

interface PaymentDialogProps {
  userId: string;
  onPaymentSuccess: (userId: string) => void;
}

export function PaymentDialog({ userId, onPaymentSuccess }: PaymentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    setIsLoading(true);
    
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      // This would typically call your backend to create a Stripe session
      // For now, we'll simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onPaymentSuccess(userId);
      setIsOpen(false);
      toast({
        title: "Payment Successful",
        description: "You can now add unlimited users and custom tasks!",
      });
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="text-lg font-semibold">Price: $9.99/month</p>
          </div>
          <Button 
            onClick={handlePayment} 
            disabled={isLoading}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          >
            {isLoading ? "Processing..." : "Process Payment"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}