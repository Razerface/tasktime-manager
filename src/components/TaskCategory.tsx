import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface Task {
  id: string;
  description: string;
  completed: boolean;
}

interface TaskCategoryProps {
  category: number;
  tasks: Task[];
  onComplete: (category: number, taskId: string) => void;
}

const getCategoryColor = (category: number) => {
  const colors = {
    5: "from-[#FF6B6B] to-[#FF8E8E]",
    10: "from-[#4ECDC4] to-[#45B7AF]",
    15: "from-[#96C93D] to-[#7EAB2E]",
    30: "from-[#A78BFA] to-[#8B5CF6]"
  };
  return colors[category as keyof typeof colors] || colors[5];
};

const TaskCategory = ({ category, tasks, onComplete }: TaskCategoryProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const gradientColor = getCategoryColor(category);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="w-full">
        <div className={`flex items-center justify-between p-4 rounded-lg bg-gradient-to-r ${gradientColor} text-white`}>
          <h3 className="text-xl font-semibold">{category} Minute Tasks</h3>
          <ChevronDown className={`w-6 h-6 transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 mt-2">
        {tasks.map((task) => (
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
                onClick={() => onComplete(category, task.id)}
                className={`bg-gradient-to-r ${gradientColor} text-white hover:opacity-90 animate-task-complete`}
              >
                Complete
              </Button>
            )}
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default TaskCategory;