import { Card } from "@/components/ui/card";

interface User {
  id: string;
  name: string;
  earnedTime: number;
  allowedCategories: number[];
}

interface UserDashboardProps {
  users: User[];
  onSelectUser: (user: User) => void;
  selectedUser: User | null;
}

const UserDashboard = ({ users, onSelectUser, selectedUser }: UserDashboardProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">User Dashboard</h2>
      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className={`p-4 rounded-lg flex justify-between items-center cursor-pointer transition-colors ${
              selectedUser?.id === user.id
                ? "bg-primary/10 border-2 border-primary"
                : "bg-secondary/5 hover:bg-secondary/10"
            }`}
            onClick={() => onSelectUser(user)}
          >
            <div>
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-sm text-muted-foreground">
                Available Categories:{" "}
                {user.allowedCategories.sort((a, b) => a - b).join(", ")} minutes
              </p>
            </div>
            <div className="text-2xl font-bold text-primary">
              {user.earnedTime}
              <span className="text-sm ml-1">min</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default UserDashboard;