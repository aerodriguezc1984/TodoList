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
  mailOutline,
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline,
  arrowForwardOutline,
  sparklesOutline,
  flashOutline,
  shieldCheckmarkOutline,
  checkmarkDoneOutline,
  personOutline
} from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonIcon,
    IonSpinner
  ]
})
export class LoginPage {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastCtrl = inject(ToastController);
  private loadingCtrl = inject(LoadingController);

  email = signal<string>('andres.rodriguez.carrasco@estudiante.ipss.cl');
  password = signal<string>('password123');
  showPassword = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');

  constructor() {
    addIcons({
      mailOutline,
      lockClosedOutline,
      eyeOutline,
      eyeOffOutline,
      arrowForwardOutline,
      sparklesOutline,
      flashOutline,
      shieldCheckmarkOutline,
      checkmarkDoneOutline,
      personOutline
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(prev => !prev);
  }

  async onLogin(): Promise<void> {
    this.errorMessage.set('');

    const emailVal = this.email().trim();
    const passwordVal = this.password().trim();

    if (!emailVal || !passwordVal) {
      this.errorMessage.set('Por favor, ingresa tu correo y contraseña.');
      return;
    }

    this.isLoading.set(true);
    const loading = await this.loadingCtrl.create({
      message: 'Verificando credenciales...',
      spinner: 'crescent',
      duration: 3000
    });
    await loading.present();

    try {
      const res = await this.authService.login(emailVal, passwordVal);
      await loading.dismiss();

      if (res.success) {
        await this.showToast('¡Bienvenido a TaskFlow Pro! ✨', 'success');
        this.router.navigate(['/home'], { replaceUrl: true });
      } else {
        this.errorMessage.set(res.message || 'Error al iniciar sesión.');
        await this.showToast(res.message || 'Credenciales inválidas', 'danger');
      }
    } catch (e) {
      await loading.dismiss();
      this.errorMessage.set('Ocurrió un error inesperado.');
    } finally {
      this.isLoading.set(false);
    }
  }

  async onQuickDemo(type: 'andres' | 'demo'): Promise<void> {
    this.errorMessage.set('');
    this.isLoading.set(true);

    const loading = await this.loadingCtrl.create({
      message: 'Iniciando sesión demo...',
      spinner: 'bubbles',
      duration: 2000
    });
    await loading.present();

    try {
      const res = await this.authService.quickDemoLogin(type);
      await loading.dismiss();

      if (res.success) {
        await this.showToast('Acceso Demo concedido con éxito 🚀', 'success');
        this.router.navigate(['/home'], { replaceUrl: true });
      } else {
        await this.showToast('No se pudo acceder como demo', 'danger');
      }
    } catch {
      await loading.dismiss();
    } finally {
      this.isLoading.set(false);
    }
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  private async showToast(message: string, color: 'success' | 'danger' | 'primary' | 'warning' = 'primary') {
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
