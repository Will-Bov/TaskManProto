"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { TaskForm } from "./TaskForm";
import { TaskItem } from "./TaskItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function TaskManager() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [filter, setFilter] = useState("");

  const handleAddTask = (task: any) => {
    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...task, id: editingTask.id } : t));
      setEditingTask(null);
    } else {
      setTasks([...tasks, { ...task, id: uuidv4() }]);
    }
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
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
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Task Manager</h1>
        <p className="text-sm text-muted-foreground">
          Organize and track your tasks efficiently
        </p>
      </div>

      {/* Task Form Card */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-semibold">
          {editingTask ? "Edit Task" : "Add New Task"}
        </h2>
        <TaskForm 
          onSubmit={handleAddTask} 
          initialTask={editingTask}
        />
      </Card>

      {/* Filter Section */}
      <Card className="p-4">
        <div className="space-y-2">
          <Label htmlFor="filter">Search Tasks</Label>
          <div className="flex gap-2">
            <Input
              id="filter"
              placeholder="Filter by title or category..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            {filter && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setFilter("")}
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Tasks List */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Your Tasks</h2>
            <span className="text-sm text-muted-foreground">
              {filteredTasks.length} {filteredTasks.length === 1 ? "task" : "tasks"}
            </span>
          </div>
          
          <Separator />

          {filteredTasks.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">
                {filter ? "No matching tasks found" : "No tasks added yet"}
              </p>
              {filter && (
                <Button 
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                  onClick={() => setFilter("")}
                >
                  Clear filter
                </Button>
              )}
            </div>
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
      </Card>
    </div>
  );
}