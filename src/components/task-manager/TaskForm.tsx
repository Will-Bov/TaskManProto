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
        <Select 
          value={category} 
          onValueChange={setCategory}
          open={isAddingCategory ? false : undefined}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat} className="group">
                <div className="flex justify-between items-center w-full">
                  <span className="flex-1">{cat}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 ml-2 opacity-0 group-hover:opacity-100"
                    onClick={(e) => handleDeleteCategory(cat, e)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </SelectItem>
            ))}
            <div className="relative">
              <div className="flex items-center px-2 py-1.5 text-sm">
                <button
                  type="button"
                  className="w-full flex items-center gap-2"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsAddingCategory(true);
                  }}
                >
                  <Plus className="h-4 w-4" />
                  Add new category
                </button>
              </div>
            </div>
          </SelectContent>
        </Select>

        {isAddingCategory && (
          <div className="mt-2 flex gap-2">
            <Input
              autoFocus
              value={newCategoryInput}
              onChange={(e) => setNewCategoryInput(e.target.value)}
              placeholder="Enter new category"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCategory();
                }
              }}
            />
            <Button 
              type="button" 
              variant="outline"
              onClick={handleAddCategory}
            >
              Add
            </Button>
          </div>
        )}
      </div>

      <Button type="submit" className="w-full">
        {initialTask ? "Update Task" : "Add Task"}
      </Button>
    </form>
  );
}