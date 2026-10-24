import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonIcon,
  IonSpinner,
  ToastController,
  LoadingController
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  personOutline,
  mailOutline,
  lockClosedOutline,
  shieldCheckmarkOutline,
  eyeOutline,
  eyeOffOutline,
  arrowBackOutline,
  checkmarkDoneOutline,
  sparklesOutline,
  arrowForwardOutline
} from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonIcon,
    IonSpinner
  ]
})
export class RegisterPage {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastCtrl = inject(ToastController);
  private loadingCtrl = inject(LoadingController);

  name = signal<string>('');
  email = signal<string>('');
  password = signal<string>('');
  confirmPassword = signal<string>('');
  showPassword = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');

  constructor() {
    addIcons({
      personOutline,
      mailOutline,
      lockClosedOutline,
      shieldCheckmarkOutline,
      eyeOutline,
      eyeOffOutline,
      arrowBackOutline,
      checkmarkDoneOutline,
      sparklesOutline,
      arrowForwardOutline
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(prev => !prev);
  }

  async onRegister(): Promise<void> {
    this.errorMessage.set('');

    const nameVal = this.name().trim();
    const emailVal = this.email().trim();
    const passwordVal = this.password().trim();
    const confirmVal = this.confirmPassword().trim();

    if (!nameVal || !emailVal || !passwordVal || !confirmVal) {
      this.errorMessage.set('Todos los campos son requeridos.');
      return;
    }

    if (nameVal.length < 2) {
      this.errorMessage.set('El nombre debe tener al menos 2 caracteres.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailVal)) {
      this.errorMessage.set('Por favor, ingresa un correo electrónico válido.');
      return;
    }

    if (passwordVal.length < 6) {
      this.errorMessage.set('La contraseña debe tener un mínimo de 6 caracteres.');
      return;
    }

    if (passwordVal !== confirmVal) {
      this.errorMessage.set('Las contraseñas no coinciden.');
      return;
    }

    this.isLoading.set(true);
    const loading = await this.loadingCtrl.create({
      message: 'Creando tu cuenta...',
      spinner: 'crescent',
      duration: 3000
    });
    await loading.present();

    try {
      const res = await this.authService.register(nameVal, emailVal, passwordVal);
      await loading.dismiss();

      if (res.success) {
        await this.showToast(`¡Cuenta creada con éxito! Bienvenido, ${nameVal} 🎉`, 'success');
        this.router.navigate(['/home'], { replaceUrl: true });
      } else {
        this.errorMessage.set(res.message || 'Error al registrar usuario.');
        await this.showToast(res.message || 'Error en el registro', 'danger');
      }
    } catch (e) {
      await loading.dismiss();
      this.errorMessage.set('Ocurrió un error inesperado.');
    } finally {
      this.isLoading.set(false);
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  private async showToast(message: string, color: 'success' | 'danger' | 'primary' = 'primary') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      position: 'bottom',
      color,
      cssClass: 'custom-toast'
    });
    await toast.present();
  }
}
