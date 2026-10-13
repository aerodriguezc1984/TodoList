import { Injectable, signal, computed } from '@angular/core';
import { Task, TaskCategory, TaskPriority } from '../models/task.model';

const STORAGE_KEY = 'taskflow_app_tasks_v1';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly defaultTasks: Task[] = [
    {
      id: 'task-1',
      title: 'Diseñar arquitectura de la aplicación Ionic',
      description: 'Definir componentes Standalone, servicios con Signals y paleta oscura de alto contraste.',
      category: 'Trabajo',
      priority: 'alta',
      dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      completed: true,
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      completedAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'task-2',
      title: 'Estudiar conceptos de Angular Signals',
      description: 'Revisar computed, effect y nuevas directivas para rendimiento óptimo.',
      category: 'Estudio',
      priority: 'media',
      dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
      completed: false,
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'task-3',
      title: 'Comprar insumos y café para la semana',
      description: 'Pasar por el supermercado antes de las 19:00 hrs.',
      category: 'Hogar',
      priority: 'baja',
      dueDate: new Date().toISOString().split('T')[0],
      completed: false,
      createdAt: new Date(Date.now() - 43200000).toISOString()
    },
    {
      id: 'task-4',
      title: 'Sesión de entrenamiento y cardio 45m',
      description: 'Completar rutina de pesas y estiramiento para mejorar energía diaria.',
      category: 'Salud',
      priority: 'media',
      dueDate: new Date(Date.now() + 259200000).toISOString().split('T')[0],
      completed: false,
      createdAt: new Date(Date.now() - 20000000).toISOString()
    },
    {
      id: 'task-5',
      title: 'Revisar presupuesto mensual y ahorros',
      description: 'Actualizar planilla de gastos fijos y proyectar metas del trimestre.',
      category: 'Finanzas',
      priority: 'alta',
      dueDate: new Date(Date.now() + 345600000).toISOString().split('T')[0],
      completed: false,
      createdAt: new Date(Date.now() - 10000000).toISOString()
    }
  ];

  // Signal principal que almacena la lista de tareas
  private tasksSignal = signal<Task[]>(this.loadFromStorage());

  // Señales públicas y computadas
  readonly tasks = this.tasksSignal.asReadonly();

  readonly totalCount = computed(() => this.tasksSignal().length);
  readonly completedCount = computed(() => this.tasksSignal().filter(t => t.completed).length);
  readonly pendingCount = computed(() => this.tasksSignal().filter(t => !t.completed).length);
  readonly highPriorityCount = computed(() => this.tasksSignal().filter(t => t.priority === 'alta' && !t.completed).length);

  readonly completionPercentage = computed(() => {
    const total = this.totalCount();
    if (total === 0) return 0;
    return Math.round((this.completedCount() / total) * 100);
  });

  constructor() {}

  private loadFromStorage(): Task[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error al cargar tareas de LocalStorage:', e);
    }
    // Si no hay tareas guardadas, guardar y retornar las por defecto
    this.saveToStorage(this.defaultTasks);
    return this.defaultTasks;
  }

  private saveToStorage(tasks: Task[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Error al guardar tareas en LocalStorage:', e);
    }
  }

  getTaskById(id: string): Task | undefined {
    return this.tasksSignal().find(t => t.id === id);
  }

  addTask(data: {
    title: string;
    description?: string;
    category: TaskCategory;
    priority: TaskPriority;
    dueDate?: string;
  }): Task {
    const newTask: Task = {
      id: 'task-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      title: data.title.trim(),
      description: (data.description || '').trim(),
      category: data.category,
      priority: data.priority,
      dueDate: data.dueDate,
      completed: false,
      createdAt: new Date().toISOString()
    };

    const updated = [newTask, ...this.tasksSignal()];
    this.tasksSignal.set(updated);
    this.saveToStorage(updated);
    return newTask;
  }

  updateTask(updatedTask: Task): void {
    const current = this.tasksSignal();
    const index = current.findIndex(t => t.id === updatedTask.id);
    if (index !== -1) {
      const updatedList = [...current];
      updatedList[index] = {
        ...updatedTask,
        title: updatedTask.title.trim(),
        description: (updatedTask.description || '').trim()
      };
      this.tasksSignal.set(updatedList);
      this.saveToStorage(updatedList);
    }
  }

  toggleComplete(id: string): void {
    const current = this.tasksSignal();
    const updated = current.map(task => {
      if (task.id === id) {
        const nextCompleted = !task.completed;
        return {
          ...task,
          completed: nextCompleted,
          completedAt: nextCompleted ? new Date().toISOString() : undefined
        };
      }
      return task;
    });
    this.tasksSignal.set(updated);
    this.saveToStorage(updated);
  }

  deleteTask(id: string): void {
    const current = this.tasksSignal();
    const updated = current.filter(t => t.id !== id);
    this.tasksSignal.set(updated);
    this.saveToStorage(updated);
  }

  clearCompleted(): void {
    const current = this.tasksSignal();
    const updated = current.filter(t => !t.completed);
    this.tasksSignal.set(updated);
    this.saveToStorage(updated);
  }

  resetToDefaults(): void {
    this.tasksSignal.set(this.defaultTasks);
    this.saveToStorage(this.defaultTasks);
  }
}
