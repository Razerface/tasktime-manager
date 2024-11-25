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

interface PaymentDialogProps {
  userId: string;
  onPaymentSuccess: (userId: string) => void;
}

export function PaymentDialog({ userId, onPaymentSuccess }: PaymentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    onPaymentSuccess(userId);
    setIsOpen(false);
    toast({
      title: "Payment Successful",
      description: "You can now add custom tasks to your lists!",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Upgrade to Premium</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upgrade to Premium</DialogTitle>
          <DialogDescription>
            Get access to unlimited custom tasks and more features!
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="text-lg font-semibold">Price: $9.99/month</p>
          </div>
          <Button onClick={handlePayment}>Process Payment</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}