"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { TaskForm } from "./TaskForm";
import { TaskItem } from "./TaskItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { showSuccess, showError } from "@/utils/toast";
import { Task, TaskPriority } from "@/types/task";

const LOCAL_STORAGE_KEY = "taskManagerTasks_v1";

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks) as Task[];
        const tasksWithDates = parsedTasks.map(task => ({
          ...task,
          dueDate: task.dueDate ? new Date(task.dueDate) : null
        }));
        setTasks(tasksWithDates);
      }
    } catch (error) {
      console.error("Failed to load tasks:", error);
      showError("Failed to load saved tasks");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
      } catch (error) {
        console.error("Failed to save tasks:", error);
        showError("Failed to save tasks");
      }
    }
  }, [tasks, isLoading]);

  const handleAddTask = (task: Omit<Task, 'id'>) => {
    try {
      if (editingTask) {
        setTasks(tasks.map(t => t.id === editingTask.id ? { ...task, id: editingTask.id } : t));
        setEditingTask(null);
        showSuccess("Task updated successfully!");
      } else {
        setTasks([...tasks, { ...task, id: uuidv4() }]);
        showSuccess("Task added successfully!");
      }
    } catch (error) {
      console.error("Task operation failed:", error);
      showError("Failed to save task");
    }
  };

  const handleDeleteTask = (id: string) => {
    try {
      setTasks(tasks.filter(task => task.id !== id));
      showSuccess("Task deleted successfully!");
    } catch (error) {
      console.error("Delete failed:", error);
      showError("Failed to delete task");
    }
  };

  const handleClearAllTasks = () => {
    if (tasks.length === 0) {
      showError("No tasks to clear!");
      return;
    }
    
    if (confirm("Are you sure you want to delete all tasks? This cannot be undone.")) {
      try {
        setTasks([]);
        showSuccess("All tasks cleared successfully!");
      } catch (error) {
        console.error("Clear all failed:", error);
        showError("Failed to clear tasks");
      }
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(filter.toLowerCase()) ||
    task.category.toLowerCase().includes(filter.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center">
        <p>Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Task Manager</h1>
        <div className="text-sm text-gray-500">
          {filteredTasks.length} {filteredTasks.length === 1 ? "task" : "tasks"}
        </div>
      </div>
      
      <Card className="p-6 space-y-4">
        <TaskForm 
          onSubmit={handleAddTask} 
          initialTask={editingTask}
        />
      </Card>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 space-y-2">
          <Label htmlFor="filter">Filter tasks</Label>
          <Input
            id="filter"
            placeholder="Search tasks..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button 
            variant="destructive" 
            onClick={handleClearAllTasks}
            disabled={tasks.length === 0}
          >
            Clear All Tasks
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-medium text-lg">Your Tasks</h2>
        {filteredTasks.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500 mb-4">No tasks found</p>
            {tasks.length > 0 ? (
              <p className="text-sm text-gray-400">Try adjusting your search filter</p>
            ) : (
              <p className="text-sm text-gray-400">Add your first task using the form above</p>
            )}
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onDelete={handleDeleteTask}
                onEdit={handleEditTask}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}