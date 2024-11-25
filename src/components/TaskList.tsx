import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import TaskCategory from "./TaskCategory";

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

interface Task {
  id: string;
  description: string;
  completed: boolean;
}

const generateTasks = (category: number) => {
  const tasks = {
    5: [
      // Existing tasks
      "Clean your desk",
      "Make your bed",
      "Put away toys",
      "Water the plants",
      "Sort your books",
      // Spring tasks
      "Plant flower seeds",
      "Clean window screens",
      "Put away winter clothes",
      "Dust ceiling fans",
      "Organize spring supplies",
      // Summer tasks
      "Water garden",
      "Clean pool toys",
      "Organize summer gear",
      "Clean beach supplies",
      "Sort summer clothes",
      // Fall tasks
      "Rake leaves",
      "Sort school supplies",
      "Clean rain boots",
      "Organize fall decorations",
      "Put away summer items",
      // Winter tasks
      "Organize winter clothes",
      "Sort holiday decorations",
      "Clean snow boots",
      "Organize winter gear",
      "Put away fall items",
    ],
    10: [
      // Existing tasks
      "Complete a homework assignment",
      "Practice an instrument",
      "Help with laundry",
      "Organize your closet",
      "Read a chapter",
      // Spring tasks
      "Plant vegetable garden",
      "Spring cleaning tasks",
      "Organize garage",
      "Clean patio furniture",
      "Wash windows",
      // Summer tasks
      "Set up pool area",
      "Clean outdoor toys",
      "Organize summer sports gear",
      "Clean outdoor furniture",
      "Maintain garden",
      // Fall tasks
      "Clean gutters",
      "Organize school materials",
      "Clean outdoor equipment",
      "Store summer furniture",
      "Sort fall clothes",
      // Winter tasks
      "Shovel snow",
      "Clean winter equipment",
      "Organize holiday items",
      "Sort winter gear",
      "Indoor organization",
    ],
    15: [
      // Existing tasks
      "Clean your room thoroughly",
      "Help prepare dinner",
      "Practice sports skills",
      "Complete a craft project",
      "Study for a test",
      // Spring tasks
      "Deep clean bedroom",
      "Garden maintenance",
      "Clean outdoor spaces",
      "Organize storage areas",
      "Spring home projects",
      // Summer tasks
      "Clean pool area",
      "Organize summer activities",
      "Help with yard work",
      "Clean outdoor storage",
      "Summer home projects",
      // Fall tasks
      "Fall yard cleanup",
      "Organize school workspace",
      "Clean garage",
      "Store outdoor items",
      "Fall home projects",
      // Winter tasks
      "Winter preparation tasks",
      "Indoor cleaning projects",
      "Organize holiday storage",
      "Clean winter equipment",
      "Winter home projects",
    ],
    30: [
      // Existing tasks
      "Deep clean the bathroom",
      "Help with yard work",
      "Complete a major assignment",
      "Help organize garage",
      "Paint or draw a picture",
      // Spring tasks
      "Major spring cleaning",
      "Garden planning and setup",
      "Clean and organize basement",
      "Paint room",
      "Spring renovation help",
      // Summer tasks
      "Major outdoor projects",
      "Pool maintenance",
      "Summer home improvement",
      "Clean and organize attic",
      "Summer renovation help",
      // Fall tasks
      "Major fall cleanup",
      "Winterize outdoor spaces",
      "Fall home improvement",
      "Clean and organize garage",
      "Fall renovation help",
      // Winter tasks
      "Major indoor organization",
      "Winter home projects",
      "Holiday decoration setup",
      "Deep clean entire room",
      "Winter renovation help",
    ],
  }[category] || [];

  return tasks.map((task) => ({
    id: Math.random().toString(),
    description: task,
    completed: false,
  }));
};

const TaskList = ({ currentUser, onTaskComplete }: TaskListProps) => {
  const [userTasks, setUserTasks] = useState<{ [key: string]: { [key: number]: Task[] } }>(() => {
    const savedTasks = localStorage.getItem('timemanager-tasks');
    return savedTasks ? JSON.parse(savedTasks) : {};
  });

  useEffect(() => {
    localStorage.setItem('timemanager-tasks', JSON.stringify(userTasks));
  }, [userTasks]);

  const initializeUserTasks = (userId: string) => {
    if (!userTasks[userId]) {
      setUserTasks(prev => ({
        ...prev,
        [userId]: {
          5: generateTasks(5),
          10: generateTasks(10),
          15: generateTasks(15),
          30: generateTasks(30),
        }
      }));
    }
  };

  useEffect(() => {
    if (currentUser) {
      initializeUserTasks(currentUser.id);
    }
  }, [currentUser]);

  const handleTaskComplete = (category: number, taskId: string) => {
    if (!currentUser) return;
    
    setUserTasks(prev => ({
      ...prev,
      [currentUser.id]: {
        ...prev[currentUser.id],
        [category]: prev[currentUser.id][category].map((task) =>
          task.id === taskId ? { ...task, completed: true } : task
        ),
      },
    }));
    onTaskComplete(category);
  };

  if (!currentUser || !userTasks[currentUser.id]) {
    return null;
  }

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Tasks for {currentUser.name}
      </h2>
      <div className="space-y-4">
        {[5, 10, 15, 30]
          .filter((category) => currentUser.allowedCategories.includes(category))
          .map((category) => (
            <TaskCategory
              key={category}
              category={category}
              tasks={userTasks[currentUser.id][category]}
              onComplete={handleTaskComplete}
            />
          ))}
      </div>
    </Card>
  );
};

export default TaskList;
