export type TaskPriority = 'alta' | 'media' | 'baja';

export type TaskCategory = 'Trabajo' | 'Personal' | 'Estudio' | 'Salud' | 'Hogar' | 'Finanzas';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  dueDate?: string; // Formato YYYY-MM-DD
  completed: boolean;
  createdAt: string; // ISO String
  completedAt?: string; // ISO String
}

export type TaskStatusFilter = 'all' | 'pending' | 'completed';
export type TaskSortOption = 'dateDesc' | 'dateAsc' | 'priority' | 'alphabetical';
