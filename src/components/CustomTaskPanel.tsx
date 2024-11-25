import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface CustomTaskPanelProps {
  userId: string;
}

const CustomTaskPanel = ({ userId }: CustomTaskPanelProps) => {
  const [description, setDescription] = useState("");
  const [timeCategory, setTimeCategory] = useState("");
  const { toast } = useToast();

  const handleAddTask = () => {
    const tasks = JSON.parse(localStorage.getItem('timemanager-tasks') || '{}');
    const userTasks = tasks[userId] || {};
    const category = parseInt(timeCategory);
    
    const newTask = {
      id: Math.random().toString(),
      description,
      completed: false,
    };

    userTasks[category] = [...(userTasks[category] || []), newTask];
    tasks[userId] = userTasks;
    
    localStorage.setItem('timemanager-tasks', JSON.stringify(tasks));
    
    setDescription("");
    setTimeCategory("");
    
    toast({
      title: "Task Added",
      description: "Your custom task has been added successfully!",
    });
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-accent to-accent/80">
      <h2 className="text-2xl font-bold mb-4 text-white">Create Custom Task</h2>
      <div className="space-y-4">
        <Input
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-white/90"
        />
        <Select value={timeCategory} onValueChange={setTimeCategory}>
          <SelectTrigger className="bg-white/90">
            <SelectValue placeholder="Select Time Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 Minutes</SelectItem>
            <SelectItem value="10">10 Minutes</SelectItem>
            <SelectItem value="15">15 Minutes</SelectItem>
            <SelectItem value="30">30 Minutes</SelectItem>
          </SelectContent>
        </Select>
        <Button 
          onClick={handleAddTask}
          disabled={!description || !timeCategory}
          className="w-full bg-white text-accent hover:bg-white/90"
        >
          Add Custom Task
        </Button>
      </div>
    </Card>
  );
};

export default CustomTaskPanel;