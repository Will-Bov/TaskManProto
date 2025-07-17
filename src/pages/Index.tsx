"use client";

import { TaskManager } from "@/components/task-manager/TaskManager";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    console.log("App mounted, base URL:", import.meta.env.BASE_URL);
  }, []);

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