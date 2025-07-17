"use client";

import { TaskManager } from "@/components/task-manager/TaskManager";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { useEffect, useState } from "react";

const Index = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p>Loading application...</p>
      </div>
    );
  }

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