import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonInput,
  IonTextarea,
  IonIcon,
  IonNote,
  ModalController
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  closeOutline,
  saveOutline,
  briefcaseOutline,
  personOutline,
  bookOutline,
  fitnessOutline,
  homeOutline,
  walletOutline,
  flagOutline,
  calendarOutline,
  pricetagOutline,
  documentTextOutline
} from 'ionicons/icons';
import { Task, TaskCategory, TaskPriority } from '../../models/task.model';

@Component({
  selector: 'app-task-modal',
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonInput,
    IonTextarea,
    IonIcon,
    IonNote
  ]
})
export class TaskModalComponent implements OnInit {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() task?: Task;

  taskForm!: FormGroup;

  readonly categories: { name: TaskCategory; icon: string; color: string }[] = [
    { name: 'Trabajo', icon: 'briefcase-outline', color: '#6366f1' },
    { name: 'Personal', icon: 'person-outline', color: '#ec4899' },
    { name: 'Estudio', icon: 'book-outline', color: '#38bdf8' },
    { name: 'Salud', icon: 'fitness-outline', color: '#10b981' },
    { name: 'Hogar', icon: 'home-outline', color: '#f59e0b' },
    { name: 'Finanzas', icon: 'wallet-outline', color: '#8b5cf6' }
  ];

  readonly priorities: { value: TaskPriority; label: string; color: string; desc: string }[] = [
    { value: 'baja', label: 'Baja', color: '#10b981', desc: 'Sin apuro' },
    { value: 'media', label: 'Media', color: '#f59e0b', desc: 'Importante' },
    { value: 'alta', label: 'Alta', color: '#f43f5e', desc: 'Urgente' }
  ];

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController
  ) {
    addIcons({
      closeOutline,
      saveOutline,
      briefcaseOutline,
      personOutline,
      bookOutline,
      fitnessOutline,
      homeOutline,
      walletOutline,
      flagOutline,
      calendarOutline,
      pricetagOutline,
      documentTextOutline
    });
  }

  ngOnInit() {
    this.taskForm = this.fb.group({
      title: [this.task?.title || '', [Validators.required, Validators.minLength(3)]],
      description: [this.task?.description || ''],
      category: [this.task?.category || 'Trabajo', [Validators.required]],
      priority: [this.task?.priority || 'media', [Validators.required]],
      dueDate: [this.task?.dueDate || this.getDefaultDueDate()]
    });
  }

  private getDefaultDueDate(): string {
    const tomorrow = new Date(Date.now() + 86400000);
    return tomorrow.toISOString().split('T')[0];
  }

  selectCategory(category: TaskCategory) {
    this.taskForm.patchValue({ category });
  }

  selectPriority(priority: TaskPriority) {
    this.taskForm.patchValue({ priority });
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  save() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const formValues = this.taskForm.value;
    if (this.mode === 'edit' && this.task) {
      const updatedTask: Task = {
        ...this.task,
        title: formValues.title,
        description: formValues.description,
        category: formValues.category,
        priority: formValues.priority,
        dueDate: formValues.dueDate || undefined
      };
      return this.modalCtrl.dismiss(updatedTask, 'confirm');
    } else {
      return this.modalCtrl.dismiss(formValues, 'confirm');
    }
  }
}
