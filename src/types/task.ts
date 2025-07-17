export type TaskPriority = 'high' | 'medium' | 'low' | 'null';

export interface Task {
  id: string;
  title: string;
  priority: TaskPriority;
  dueDate: Date | null;
  category: string;
}