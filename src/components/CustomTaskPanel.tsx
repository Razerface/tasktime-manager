import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Trash2 } from "lucide-react";

interface CustomTaskPanelProps {
  userId: string;
}

const CustomTaskPanel = ({ userId }: CustomTaskPanelProps) => {
  const [description, setDescription] = useState("");
  const [timeCategory, setTimeCategory] = useState("");
  const [tasks, setTasks] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const savedTasks = localStorage.getItem('timemanager-tasks');
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks);
      setTasks(parsedTasks[userId] || {});
    }
  }, [userId]);

  const handleAddTask = () => {
    if (!description.trim() || !timeCategory) return;

    const allTasks = JSON.parse(localStorage.getItem('timemanager-tasks') || '{}');
    const userTasks = allTasks[userId] || {};
    const category = parseInt(timeCategory);
    
    const newTask = {
      id: Math.random().toString(),
      description: description.trim(),
      completed: false,
      isCustom: true
    };

    userTasks[category] = [...(userTasks[category] || []), newTask];
    allTasks[userId] = userTasks;
    
    localStorage.setItem('timemanager-tasks', JSON.stringify(allTasks));
    setTasks(userTasks);
    setDescription("");
    setTimeCategory("");
    
    toast({
      title: "Task Added",
      description: "Your custom task has been added successfully!",
    });
  };

  const handleDeleteTask = (category: number, taskId: string) => {
    const allTasks = JSON.parse(localStorage.getItem('timemanager-tasks') || '{}');
    const userTasks = allTasks[userId] || {};
    
    userTasks[category] = userTasks[category].filter((task: any) => task.id !== taskId);
    allTasks[userId] = userTasks;
    
    localStorage.setItem('timemanager-tasks', JSON.stringify(allTasks));
    setTasks(userTasks);
    
    toast({
      title: "Task Deleted",
      description: "Your custom task has been removed successfully!",
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

        <div className="mt-6 space-y-2">
          <h3 className="text-lg font-semibold text-white">Your Custom Tasks</h3>
          {Object.entries(tasks).map(([category, categoryTasks]: [string, any[]]) => (
            <div key={category}>
              {categoryTasks.filter((task: any) => task.isCustom).map((task: any) => (
                <div key={task.id} className="flex items-center justify-between bg-white/90 p-2 rounded-md mb-2">
                  <span>{task.description} ({category}m)</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteTask(parseInt(category), task.id)}
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default CustomTaskPanel;