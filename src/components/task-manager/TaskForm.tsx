"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";

const defaultCategories = [
  "Maths",
  "HPE",
  "English",
  "Science",
  "Computing",
  "History",
  "Food Tech"
];

interface TaskFormProps {
  onSubmit: (task: {
    title: string;
    priority: "high" | "medium" | "low" | "null";
    dueDate: Date | null;
    category: string;
  }) => void;
  initialTask?: {
    title: string;
    priority: "high" | "medium" | "low" | "null";
    dueDate: Date | null;
    category: string;
  };
}

export function TaskForm({ onSubmit, initialTask }: TaskFormProps) {
  const [title, setTitle] = useState(initialTask?.title || "");
  const [priority, setPriority] = useState<"high" | "medium" | "low" | "null">(
    initialTask?.priority || "null"
  );
  const [dueDate, setDueDate] = useState<Date | null>(initialTask?.dueDate || null);
  const [categories, setCategories] = useState(defaultCategories);
  const [category, setCategory] = useState(initialTask?.category || categories[0]);
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const handleAddCategory = () => {
    if (newCategoryInput.trim() && !categories.includes(newCategoryInput)) {
      setCategories([...categories, newCategoryInput]);
      setCategory(newCategoryInput);
      setNewCategoryInput("");
    }
    setIsAddingCategory(false);
  };

  const handleDeleteCategory = (catToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newCategories = categories.filter(cat => cat !== catToDelete);
    setCategories(newCategories);
    if (category === catToDelete) {
      setCategory(newCategories[0] || "");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      priority,
      dueDate,
      category
    });
    if (!initialTask) {
      setTitle("");
      setPriority("null");
      setDueDate(null);
      setCategory(categories[0] || "");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ... rest of the component remains the same ... */}
    </form>
  );
}