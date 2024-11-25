import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import AdminPanel from "@/components/AdminPanel";
import TaskList from "@/components/TaskList";
import UserDashboard from "@/components/UserDashboard";

const ADMIN_PIN = "1234"; // In a real app, this should be stored securely

interface User {
  id: string;
  name: string;
  earnedTime: number;
  allowedCategories: number[];
}

const Index = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pinAttempt, setPinAttempt] = useState("");
  const { toast } = useToast();

  const handlePinSubmit = () => {
    if (pinAttempt === ADMIN_PIN) {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/5 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-primary">TimeManager</h1>
          {!isAdmin && (
            <div className="flex gap-2">
              <Input
                type="password"
                placeholder="Enter Admin PIN"
                value={pinAttempt}
                onChange={(e) => setPinAttempt(e.target.value)}
                className="w-32"
              />
              <Button onClick={handlePinSubmit}>Login</Button>
            </div>
          )}
        </header>

        {isAdmin ? (
          <AdminPanel
            users={users}
            setUsers={setUsers}
            onLogout={() => setIsAdmin(false)}
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <UserDashboard users={users} />
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
                  toast({
                    title: "Task Completed!",
                    description: `You earned ${time} minutes!`,
                  });
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;