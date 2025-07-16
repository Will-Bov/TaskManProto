"use client";

import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Trash2, Edit } from "lucide-react";

interface TaskItemProps {
  task: {
    id: string;
    title: string;
    priority: "high" | "medium" | "low" | "null";
    dueDate: Date | null;
    category: string;
  };
  onDelete: (id: string) => void;
  onEdit: (task: any) => void;
}

export function TaskItem({ task, onDelete, onEdit }: TaskItemProps) {
  const getPriorityColor = () => {
    switch (task.priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="border rounded-lg p-4 mb-2">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-lg">{task.title}</h3>
          <p className="text-sm text-gray-600">{task.category}</p>
          {task.dueDate && (
            <p className="text-sm">
              Due: {format(task.dueDate, "MMM dd, yyyy")}
            </p>
          )}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(task)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(task.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="mt-2">
        <span
          className={`text-xs px-2 py-1 rounded-full ${getPriorityColor()}`}
        >
          {task.priority === "null" ? "No priority" : task.priority}
        </span>
      </div>
    </div>
  );
}