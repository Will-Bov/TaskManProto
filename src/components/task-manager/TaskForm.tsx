"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
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
  const [category, setCategory] = useState(initialTask?.category || defaultCategories[0]);
  const [newCategory, setNewCategory] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      priority,
      dueDate,
      category: newCategory && !defaultCategories.includes(newCategory) ? newCategory : category
    });
    setTitle("");
    setPriority("null");
    setDueDate(null);
    setCategory(defaultCategories[0]);
    setNewCategory("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Task Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <Label>Priority</Label>
        <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="null">None</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Due Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dueDate || undefined}
              onSelect={setDueDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Label>Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {defaultCategories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="new-category">Or add new category</Label>
        <Input
          id="new-category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Enter new category"
        />
      </div>

      <Button type="submit" className="w-full">
        {initialTask ? "Update Task" : "Add Task"}
      </Button>
    </form>
  );
}