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

const LOCAL_STORAGE_KEY = "taskManagerTasks";

export function TaskManager() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [filter, setFilter] = useState("");

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        const tasksWithDates = parsedTasks.map((task: any) => ({
          ...task,
          dueDate: task.dueDate ? new Date(task.dueDate) : null
        }));
        setTasks(tasksWithDates);
      } catch (error) {
        console.error("Failed to parse saved tasks", error);
      }
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (task: any) => {
    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...task, id: editingTask.id } : t));
      setEditingTask(null);
      showSuccess("Task updated successfully!");
    } else {
      setTasks([...tasks, { ...task, id: uuidv4() }]);
      showSuccess("Task added successfully!");
    }
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    showSuccess("Task deleted successfully!");
  };

  const handleClearAllTasks = () => {
    if (tasks.length === 0) {
      showError("No tasks to clear!");
      return;
    }
    
    if (confirm("Are you sure you want to delete all tasks?")) {
      setTasks([]);
      showSuccess("All tasks cleared successfully!");
    }
  };

  const handleEditTask = (task: any) => {
    setEditingTask(task);
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(filter.toLowerCase()) ||
    task.category.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Task Manager</h1>
        <div className="text-sm text-gray-500">
          {filteredTasks.length} {filteredTasks.length === 1 ? "task" : "tasks"}
        </div>
      </div>
      
      {/* Task Form Card */}
      <Card className="p-6 space-y-4">
        <TaskForm 
          onSubmit={handleAddTask} 
          initialTask={editingTask}
        />
      </Card>

      {/* Filter and Actions */}
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

      {/* Tasks List */}
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