import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ThemeProvider } from "next-themes";
import AdminPanel from "@/components/AdminPanel";
import TaskList from "@/components/TaskList";
import UserDashboard from "@/components/UserDashboard";
import CustomTaskPanel from "@/components/CustomTaskPanel";
import { PaymentDialog } from "@/components/PaymentDialog";

interface User {
  id: string;
  name: string;
  earnedTime: number;
  allowedCategories: number[];
  isPremium?: boolean;
  maxDailyTime?: number;
}

const Index = () => {
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem('timemanager-users');
    return savedUsers ? JSON.parse(savedUsers) : [];
  });
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pinAttempt, setPinAttempt] = useState("");
  const { toast } = useToast();

  const [adminPin, setAdminPin] = useState(() => {
    const savedPin = localStorage.getItem('timemanager-pin');
    return savedPin || "1234";
  });

  useEffect(() => {
    localStorage.setItem('timemanager-users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('timemanager-pin', adminPin);
  }, [adminPin]);

  const handlePinSubmit = () => {
    if (pinAttempt === adminPin) {
      setIsAdmin(true);
      toast({
        title: "Admin Access Granted",
        description: "You now have admin privileges",
      });
    } else {
      toast({
        title: "Invalid PIN",
        description: "Please try again",
        variant: "destructive",
      });
    }
    setPinAttempt("");
  };

  const handlePinChange = (newPin: string) => {
    setAdminPin(newPin);
    toast({
      title: "PIN Updated",
      description: "The admin PIN has been changed successfully",
    });
  };

  const handlePaymentSuccess = (userId: string) => {
    const updatedUsers = users.map(user => 
      user.id === userId 
        ? { ...user, isPremium: true }
        : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('timemanager-users', JSON.stringify(updatedUsers));
    toast({
      title: "Premium Activated",
      description: "Premium features have been unlocked!",
    });
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/5 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <header className="flex justify-between items-center bg-gradient-to-r from-primary to-secondary p-4 rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold text-white">TimeNest</h1>
            <div className="flex items-center gap-4">
              {currentUser && !currentUser.isPremium && (
                <PaymentDialog 
                  userId={currentUser.id}
                  onPaymentSuccess={handlePaymentSuccess}
                />
              )}
              {!isAdmin && (
                <div className="flex gap-2">
                  <Input
                    type="password"
                    placeholder="Enter Admin PIN"
                    value={pinAttempt}
                    onChange={(e) => setPinAttempt(e.target.value)}
                    className="w-32 bg-white/20 text-white placeholder:text-white/70"
                  />
                  <Button 
                    onClick={handlePinSubmit}
                    className="bg-white text-primary hover:bg-white/90"
                  >
                    Login
                  </Button>
                </div>
              )}
            </div>
          </header>

          {isAdmin ? (
            <AdminPanel
              users={users}
              setUsers={setUsers}
              onLogout={() => setIsAdmin(false)}
              onPinChange={handlePinChange}
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              <UserDashboard 
                users={users} 
                onSelectUser={setCurrentUser}
                selectedUser={currentUser}
              />
              <div className="space-y-6">
                <TaskList
                  currentUser={currentUser}
                  onTaskComplete={(time) => {
                    if (currentUser) {
                      const updatedUsers = users.map((user) =>
                        user.id === currentUser.id
                          ? { ...user, earnedTime: user.earnedTime + time }
                          : user
                      );
                      setUsers(updatedUsers);
                      localStorage.setItem('timemanager-users', JSON.stringify(updatedUsers));
                      toast({
                        title: "Task Completed!",
                        description: `You earned ${time} minutes!`,
                      });
                    }
                  }}
                />
                {currentUser?.isPremium && (
                  <CustomTaskPanel userId={currentUser.id} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;
