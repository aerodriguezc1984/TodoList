import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonIcon,
  ModalController
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  closeOutline,
  createOutline,
  trashOutline,
  checkmarkCircle,
  ellipseOutline,
  calendarOutline,
  pricetagOutline,
  flagOutline,
  timeOutline,
  informationCircleOutline
} from 'ionicons/icons';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-detail-modal',
  templateUrl: './task-detail-modal.component.html',
  styleUrls: ['./task-detail-modal.component.scss'],
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonIcon
  ]
})
export class TaskDetailModalComponent {
  @Input() task!: Task;

  constructor(private modalCtrl: ModalController) {
    addIcons({
      closeOutline,
      createOutline,
      trashOutline,
      checkmarkCircle,
      ellipseOutline,
      calendarOutline,
      pricetagOutline,
      flagOutline,
      timeOutline,
      informationCircleOutline
    });
  }

  close() {
    return this.modalCtrl.dismiss(null, 'close');
  }

  toggleComplete() {
    return this.modalCtrl.dismiss({ action: 'toggle', taskId: this.task.id }, 'action');
  }

  editTask() {
    return this.modalCtrl.dismiss({ action: 'edit', task: this.task }, 'action');
  }

  deleteTask() {
    return this.modalCtrl.dismiss({ action: 'delete', taskId: this.task.id }, 'action');
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'Sin fecha límite';
    try {
      const date = new Date(dateString + 'T00:00:00');
      return date.toLocaleDateString('es-ES', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  }

  formatDateTime(isoString: string): string {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('es-ES', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'alta': return '#f43f5e';
      case 'media': return '#f59e0b';
      case 'baja': return '#10b981';
      default: return '#94a3b8';
    }
  }

  getCategoryColor(category: string): string {
    switch (category) {
      case 'Trabajo': return '#6366f1';
      case 'Personal': return '#ec4899';
      case 'Estudio': return '#38bdf8';
      case 'Salud': return '#10b981';
      case 'Hogar': return '#f59e0b';
      case 'Finanzas': return '#8b5cf6';
      default: return '#94a3b8';
    }
  }
}
