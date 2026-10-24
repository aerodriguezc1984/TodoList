import { Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonContent,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonButton,
  IonButtons,
  IonIcon,
  IonFab,
  IonFabButton,
  ModalController,
  AlertController,
  ToastController
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  add,
  searchOutline,
  funnelOutline,
  calendarOutline,
  checkmarkCircle,
  ellipseOutline,
  trashOutline,
  createOutline,
  eyeOutline,
  sparklesOutline,
  checkboxOutline,
  squareOutline,
  chevronForwardOutline,
  swapVerticalOutline,
  refreshOutline,
  shieldCheckmarkOutline,
  briefcaseOutline,
  personOutline,
  bookOutline,
  fitnessOutline,
  homeOutline,
  walletOutline,
  flagOutline,
  listOutline,
  checkmarkDoneOutline,
  timeOutline,
  alertCircleOutline,
  logOutOutline
} from 'ionicons/icons';
import { Router } from '@angular/router';
import { Task, TaskCategory, TaskPriority, TaskSortOption, TaskStatusFilter } from '../models/task.model';
import { TaskService } from '../services/task.service';
import { AuthService } from '../services/auth.service';
import { TaskModalComponent } from '../components/task-modal/task-modal.component';
import { TaskDetailModalComponent } from '../components/task-detail-modal/task-detail-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonContent,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonButton,
    IonButtons,
    IonIcon,
    IonFab,
    IonFabButton
  ]
})
export class HomePage {
  readonly taskService = inject(TaskService);
  readonly authService = inject(AuthService);
  private router = inject(Router);
  private modalCtrl = inject(ModalController);
  private alertCtrl = inject(AlertController);
  private toastCtrl = inject(ToastController);

  // Filtros reactivos con Signals
  searchQuery = signal<string>('');
  statusFilter = signal<TaskStatusFilter>('all');
  categoryFilter = signal<string>('all');
  sortOption = signal<TaskSortOption>('priority');

  readonly categories: { id: string; name: string; icon: string; color: string }[] = [
    { id: 'all', name: 'Todas', icon: 'list-outline', color: '#6366f1' },
    { id: 'Trabajo', name: 'Trabajo', icon: 'briefcase-outline', color: '#6366f1' },
    { id: 'Personal', name: 'Personal', icon: 'person-outline', color: '#ec4899' },
    { id: 'Estudio', name: 'Estudio', icon: 'book-outline', color: '#38bdf8' },
    { id: 'Salud', name: 'Salud', icon: 'fitness-outline', color: '#10b981' },
    { id: 'Hogar', name: 'Hogar', icon: 'home-outline', color: '#f59e0b' },
    { id: 'Finanzas', name: 'Finanzas', icon: 'wallet-outline', color: '#8b5cf6' }
  ];

  // Lista filtrada y ordenada automáticamente
  filteredTasks = computed(() => {
    let list = this.taskService.tasks();
    const query = this.searchQuery().trim().toLowerCase();
    const status = this.statusFilter();
    const category = this.categoryFilter();
    const sort = this.sortOption();

    // 1. Filtrar por término de búsqueda (título y descripción)
    if (query) {
      list = list.filter(task =>
        task.title.toLowerCase().includes(query) ||
        (task.description && task.description.toLowerCase().includes(query))
      );
    }

    // 2. Filtrar por estado (todas, pendientes, completadas)
    if (status === 'pending') {
      list = list.filter(task => !task.completed);
    } else if (status === 'completed') {
      list = list.filter(task => task.completed);
    }

    // 3. Filtrar por categoría
    if (category !== 'all') {
      list = list.filter(task => task.category === category);
    }

    // 4. Ordenamiento
    const priorityWeight: Record<TaskPriority, number> = {
      alta: 3,
      media: 2,
      baja: 1
    };

    return [...list].sort((a, b) => {
      // Las tareas completadas van al final en la mayoría de vistas
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      switch (sort) {
        case 'priority': {
          const diff = priorityWeight[b.priority] - priorityWeight[a.priority];
          if (diff !== 0) return diff;
          // Si tienen la misma prioridad, ordenar por fecha límite
          if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        case 'dateAsc': {
          if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
          if (a.dueDate) return -1;
          if (b.dueDate) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        case 'dateDesc': {
          if (a.dueDate && b.dueDate) return b.dueDate.localeCompare(a.dueDate);
          if (a.dueDate) return 1;
          if (b.dueDate) return -1;
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  });

  constructor() {
    addIcons({
      add,
      searchOutline,
      funnelOutline,
      calendarOutline,
      checkmarkCircle,
      ellipseOutline,
      trashOutline,
      createOutline,
      eyeOutline,
      sparklesOutline,
      checkboxOutline,
      squareOutline,
      chevronForwardOutline,
      swapVerticalOutline,
      refreshOutline,
      shieldCheckmarkOutline,
      briefcaseOutline,
      personOutline,
      bookOutline,
      fitnessOutline,
      homeOutline,
      walletOutline,
      flagOutline,
      listOutline,
      checkmarkDoneOutline,
      timeOutline,
      alertCircleOutline,
      logOutOutline
    });
  }

  getUserInitials(): string {
    const user = this.authService.currentUser();
    if (!user || !user.name) return 'U';
    const parts = user.name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  }

  async confirmLogout() {
    const user = this.authService.currentUser();
    const alert = await this.alertCtrl.create({
      header: 'Cerrar Sesión',
      message: `¿Estás seguro de que deseas salir de la cuenta de <strong>${user?.name || 'tu usuario'}</strong>?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Salir',
          role: 'destructive',
          handler: () => {
            this.authService.logout();
            this.showToast('Sesión finalizada. ¡Hasta pronto!', 'medium');
            this.router.navigate(['/login'], { replaceUrl: true });
          }
        }
      ]
    });

    await alert.present();
  }

  // --- CRUD: CREAR (AGREGAR) ---
  async openAddTaskModal() {
    const modal = await this.modalCtrl.create({
      component: TaskModalComponent,
      componentProps: {
        mode: 'create'
      },
      breakpoints: [0, 0.75, 1],
      initialBreakpoint: 0.95
    });

    await modal.present();
    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm' && data) {
      this.taskService.addTask({
        title: data.title,
        description: data.description,
        category: data.category,
        priority: data.priority,
        dueDate: data.dueDate
      });
      await this.showToast('Tarea creada exitosamente', 'success');
    }
  }

  // --- CRUD: MODIFICAR (EDITAR) ---
  async openEditTaskModal(task: Task, event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    const modal = await this.modalCtrl.create({
      component: TaskModalComponent,
      componentProps: {
        mode: 'edit',
        task: { ...task }
      },
      breakpoints: [0, 0.75, 1],
      initialBreakpoint: 0.95
    });

    await modal.present();
    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm' && data) {
      this.taskService.updateTask(data);
      await this.showToast('Tarea actualizada correctamente', 'primary');
    }
  }

  // --- CRUD: LEER (VER DETALLE) ---
  async openTaskDetail(task: Task) {
    const modal = await this.modalCtrl.create({
      component: TaskDetailModalComponent,
      componentProps: {
        task
      },
      breakpoints: [0, 0.7, 0.95],
      initialBreakpoint: 0.75
    });

    await modal.present();
    const { data, role } = await modal.onWillDismiss();

    if (role === 'action' && data) {
      if (data.action === 'toggle') {
        this.taskService.toggleComplete(data.taskId);
        await this.showToast('Estado de tarea actualizado', 'success');
      } else if (data.action === 'edit') {
        await this.openEditTaskModal(data.task);
      } else if (data.action === 'delete') {
        const found = this.taskService.getTaskById(data.taskId);
        if (found) {
          await this.confirmDeleteTask(found);
        }
      }
    }
  }

  // --- CRUD: QUITAR (ELIMINAR) ---
  async confirmDeleteTask(task: Task, event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    const alert = await this.alertCtrl.create({
      header: '¿Eliminar tarea?',
      message: `¿Estás seguro de que deseas eliminar "<strong>${task.title}</strong>"? Esta acción no se puede deshacer.`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alert-btn-cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          cssClass: 'alert-btn-danger',
          handler: () => {
            this.taskService.deleteTask(task.id);
            this.showToast('Tarea eliminada', 'warning');
          }
        }
      ]
    });

    await alert.present();
  }

  // Toggle rápido de completada/pendiente
  toggleTask(task: Task, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.taskService.toggleComplete(task.id);
    const msg = !task.completed ? '¡Tarea completada! 🎉' : 'Tarea marcada como pendiente';
    this.showToast(msg, !task.completed ? 'success' : 'medium');
  }

  // Limpiar todas las completadas
  async confirmClearCompleted() {
    const completedCount = this.taskService.completedCount();
    if (completedCount === 0) {
      await this.showToast('No hay tareas completadas para limpiar', 'medium');
      return;
    }

    const alert = await this.alertCtrl.create({
      header: 'Limpiar tareas completadas',
      message: `Se eliminarán permanentemente <strong>${completedCount}</strong> tareas finalizadas. ¿Continuar?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Limpiar',
          role: 'destructive',
          handler: () => {
            this.taskService.clearCompleted();
            this.showToast(`${completedCount} tareas eliminadas`, 'warning');
          }
        }
      ]
    });

    await alert.present();
  }

  // Reiniciar datos de ejemplo
  async resetDemoData() {
    const alert = await this.alertCtrl.create({
      header: 'Restablecer lista',
      message: '¿Deseas recargar las tareas de ejemplo iniciales?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Restablecer',
          handler: () => {
            this.taskService.resetToDefaults();
            this.showToast('Lista restaurada a valores iniciales', 'primary');
          }
        }
      ]
    });

    await alert.present();
  }

  // Cambiar ordenamiento cíclico
  cycleSort() {
    const current = this.sortOption();
    const cycle: Record<TaskSortOption, TaskSortOption> = {
      priority: 'dateAsc',
      dateAsc: 'dateDesc',
      dateDesc: 'alphabetical',
      alphabetical: 'priority'
    };
    this.sortOption.set(cycle[current]);
    this.showToast(`Orden: ${this.getSortLabel()}`, 'secondary');
  }

  getSortLabel(): string {
    switch (this.sortOption()) {
      case 'priority': return 'Por Prioridad';
      case 'dateAsc': return 'Fecha (Próxima)';
      case 'dateDesc': return 'Fecha (Lejana)';
      case 'alphabetical': return 'Alfabético';
    }
  }

  // Helpers de presentación
  formatDate(dateString?: string): string {
    if (!dateString) return '';
    try {
      const parts = dateString.split('-');
      if (parts.length === 3) {
        const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
      }
      return dateString;
    } catch {
      return dateString;
    }
  }

  isOverdue(dateString?: string, completed?: boolean): boolean {
    if (!dateString || completed) return false;
    const today = new Date().toISOString().split('T')[0];
    return dateString < today;
  }

  isToday(dateString?: string): boolean {
    if (!dateString) return false;
    const today = new Date().toISOString().split('T')[0];
    return dateString === today;
  }

  getCategoryColor(category: string): string {
    const found = this.categories.find(c => c.name === category);
    return found ? found.color : '#6366f1';
  }

  getPriorityColor(priority: TaskPriority): string {
    switch (priority) {
      case 'alta': return '#f43f5e';
      case 'media': return '#f59e0b';
      case 'baja': return '#10b981';
    }
  }

  private async showToast(message: string, color: 'success' | 'warning' | 'primary' | 'secondary' | 'medium' = 'primary') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom',
      color,
      cssClass: 'custom-toast'
    });
    await toast.present();
  }
}
