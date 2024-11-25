import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface User {
  id: string;
  name: string;
  earnedTime: number;
  allowedCategories: number[];
}

interface TaskListProps {
  currentUser: User | null;
  onTaskComplete: (time: number) => void;
}

const generateTasks = (category: number) => {
  const tasks = {
    5: [
      "Clean your desk",
      "Make your bed",
      "Put away toys",
      "Water the plants",
      "Sort your books",
      // ... more tasks
    ],
    10: [
      "Complete a homework assignment",
      "Practice an instrument",
      "Help with laundry",
      "Organize your closet",
      "Read a chapter",
      // ... more tasks
    ],
    15: [
      "Clean your room thoroughly",
      "Help prepare dinner",
      "Practice sports skills",
      "Complete a craft project",
      "Study for a test",
      // ... more tasks
    ],
    30: [
      "Deep clean the bathroom",
      "Help with yard work",
      "Complete a major assignment",
      "Help organize garage",
      "Paint or draw a picture",
      // ... more tasks
    ],
  }[category] || [];

  return tasks.map((task) => ({
    id: Math.random().toString(),
    description: task,
    completed: false,
  }));
};

const TaskList = ({ currentUser, onTaskComplete }: TaskListProps) => {
  const [tasks, setTasks] = useState<{ [key: number]: any[] }>({
    5: generateTasks(5),
    10: generateTasks(10),
    15: generateTasks(15),
    30: generateTasks(30),
  });

  const handleTaskComplete = (category: number, taskId: string) => {
    setTasks((prev) => ({
      ...prev,
      [category]: prev[category].map((task) =>
        task.id === taskId ? { ...task, completed: true } : task
      ),
    }));
    onTaskComplete(category);
  };

  if (!currentUser) {
    return null;
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Tasks for {currentUser.name}</h2>
      <div className="space-y-6">
        {[5, 10, 15, 30].map((category) => (
          <div key={category}>
            <h3 className="text-xl font-semibold mb-2">
              {category} Minute Tasks
            </h3>
            <div className="space-y-2">
              {tasks[category].map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-2 rounded-lg ${
                    task.completed
                      ? "bg-gray-100 text-gray-500 line-through"
                      : "bg-secondary/5"
                  }`}
                >
                  <span>{task.description}</span>
                  {!task.completed && (
                    <Button
                      onClick={() => handleTaskComplete(category, task.id)}
                      className="hover:animate-task-complete"
                    >
                      Complete
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TaskList;