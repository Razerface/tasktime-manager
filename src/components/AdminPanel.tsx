import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";

interface User {
  id: string;
  name: string;
  earnedTime: number;
  allowedCategories: number[];
}

interface AdminPanelProps {
  users: User[];
  setUsers: (users: User[]) => void;
  onLogout: () => void;
  onPinChange: (newPin: string) => void;
}

const AdminPanel = ({ users, setUsers, onLogout, onPinChange }: AdminPanelProps) => {
  const [newUserName, setNewUserName] = useState("");
  const [newPin, setNewPin] = useState("");
  const { toast } = useToast();

  const addUser = () => {
    if (newUserName.trim()) {
      const newUser: User = {
        id: Date.now().toString(),
        name: newUserName,
        earnedTime: 0,
        allowedCategories: [5, 10, 15, 30],
      };
      setUsers([...users, newUser]);
      setNewUserName("");
      toast({
        title: "User Added",
        description: `${newUserName} has been added successfully`,
      });
    }
  };

  const handlePinChange = () => {
    if (newPin.trim()) {
      onPinChange(newPin);
      setNewPin("");
    }
  };

  const resetTime = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, earnedTime: 0 } : user
      )
    );
    toast({
      title: "Time Reset",
      description: "User's time has been reset to 0",
    });
  };

  const toggleCategory = (userId: string, category: number) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? {
              ...user,
              allowedCategories: user.allowedCategories.includes(category)
                ? user.allowedCategories.filter((c) => c !== category)
                : [...user.allowedCategories, category],
            }
          : user
      )
    );
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
          <Button 
            variant="outline" 
            onClick={onLogout}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        <div className="flex gap-2 mb-6">
          <Input
            placeholder="New User Name"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
          />
          <Button onClick={addUser}>Add User</Button>
        </div>

        <div className="flex gap-2 mb-6">
          <Input
            type="password"
            placeholder="New Admin PIN"
            value={newPin}
            onChange={(e) => setNewPin(e.target.value)}
          />
          <Button onClick={handlePinChange}>Change PIN</Button>
        </div>

        <div className="space-y-4">
          {users.map((user) => (
            <Card key={user.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Earned Time: {user.earnedTime} minutes
                  </p>
                </div>
                <div className="flex gap-2">
                  {[5, 10, 15, 30].map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${user.id}-${category}`}
                        checked={user.allowedCategories.includes(category)}
                        onCheckedChange={() => toggleCategory(user.id, category)}
                      />
                      <label
                        htmlFor={`${user.id}-${category}`}
                        className="text-sm"
                      >
                        {category}m
                      </label>
                    </div>
                  ))}
                  <Button
                    variant="destructive"
                    onClick={() => resetTime(user.id)}
                  >
                    Reset Time
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AdminPanel;