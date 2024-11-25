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
import { useNavigate } from "react-router-dom";
import { Bird, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

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
  const navigate = useNavigate();
  const { signOut } = useAuth();

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

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "Error logging out",
        description: "There was a problem logging out",
        variant: "destructive",
      });
    }
  };

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
            <div className="flex items-center gap-2">
              <Bird className="h-8 w-8 text-white" />
              <h1 className="text-4xl font-bold text-white">TimeNest</h1>
            </div>
            <div className="flex items-center gap-4">
              {!isAdmin && (
                <>
                  <PaymentDialog 
                    userId={currentUser?.id || ''}
                    onPaymentSuccess={handlePaymentSuccess}
                  />
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
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="bg-white/10 text-white hover:bg-white/20 flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </>
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