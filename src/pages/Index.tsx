"use client";

import { TaskManager } from "@/components/task-manager/TaskManager";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">
        <TaskManager />
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;