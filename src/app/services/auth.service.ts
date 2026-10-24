import { Injectable, signal, computed } from '@angular/core';
import { User, AuthSession } from '../models/user.model';

const USERS_STORAGE_KEY = 'taskflow_users_v2';
const SESSION_STORAGE_KEY = 'taskflow_session_v2';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Usuarios por defecto (semilla inicial)
  private readonly defaultUsers: User[] = [
    {
      id: 'user-andres',
      name: 'Andrés Rodríguez',
      email: 'andres.rodriguez.carrasco@estudiante.ipss.cl',
      password: 'password123',
      createdAt: '2026-10-20T10:00:00.000Z'
    },
    {
      id: 'user-demo',
      name: 'Usuario Demo',
      email: 'demo@taskflow.com',
      password: 'demo123',
      createdAt: '2026-10-24T12:00:00.000Z'
    }
  ];

  // Signal reactivo para el usuario activo
  private currentUserSignal = signal<Omit<User, 'password'> | null>(this.loadSession());

  // Señales públicas
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.currentUserSignal());

  constructor() {
    this.initUsersStorage();
  }

  /**
   * Inicializa la lista de usuarios en localStorage si no existe
   */
  private initUsersStorage(): void {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(this.defaultUsers));
      }
    } catch (e) {
      console.error('Error al inicializar almacenamiento de usuarios:', e);
    }
  }

  /**
   * Carga la sesión guardada desde LocalStorage
   */
  private loadSession(): Omit<User, 'password'> | null {
    try {
      const sessionData = localStorage.getItem(SESSION_STORAGE_KEY);
      if (sessionData) {
        const session: AuthSession = JSON.parse(sessionData);
        if (session && session.user && session.user.id) {
          return session.user;
        }
      }
    } catch (e) {
      console.error('Error al recuperar sesión activa:', e);
    }
    return null;
  }

  /**
   * Obtiene la lista completa de usuarios registrados
   */
  private getUsers(): User[] {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      if (stored) {
        const users = JSON.parse(stored);
        if (Array.isArray(users)) {
          return users;
        }
      }
    } catch (e) {
      console.error('Error al leer usuarios:', e);
    }
    return [...this.defaultUsers];
  }

  /**
   * Guarda los usuarios en localStorage
   */
  private saveUsers(users: User[]): void {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Error al guardar usuarios:', e);
    }
  }

  /**
   * Guarda la sesión actual en localStorage
   */
  private saveSession(user: Omit<User, 'password'>): void {
    try {
      const session: AuthSession = {
        user,
        token: 'token-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9),
        loginAt: new Date().toISOString()
      };
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      this.currentUserSignal.set(user);
    } catch (e) {
      console.error('Error al guardar sesión:', e);
    }
  }

  /**
   * Iniciar sesión con email y contraseña
   */
  async login(email: string, password: string): Promise<{ success: boolean; message?: string }> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      return { success: false, message: 'Por favor, ingresa correo y contraseña.' };
    }

    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return { success: false, message: 'No existe una cuenta registrada con este correo.' };
    }

    if (user.password !== cleanPassword) {
      return { success: false, message: 'La contraseña ingresada es incorrecta.' };
    }

    // Login correcto: no guardamos el hash/pass en la sesión activa
    const { password: _, ...userWithoutPassword } = user;
    this.saveSession(userWithoutPassword);

    return { success: true };
  }

  /**
   * Registrar un nuevo usuario
   */
  async register(name: string, email: string, password: string): Promise<{ success: boolean; message?: string }> {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanName || !cleanEmail || !cleanPassword) {
      return { success: false, message: 'Todos los campos son obligatorios.' };
    }

    if (cleanName.length < 2) {
      return { success: false, message: 'El nombre debe tener al menos 2 caracteres.' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return { success: false, message: 'Ingresa un correo electrónico válido.' };
    }

    if (cleanPassword.length < 6) {
      return { success: false, message: 'La contraseña debe tener al menos 6 caracteres.' };
    }

    const users = this.getUsers();
    const exists = users.some(u => u.email.toLowerCase() === cleanEmail);

    if (exists) {
      return { success: false, message: 'Ya existe una cuenta con este correo electrónico.' };
    }

    const newUser: User = {
      id: 'user-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      name: cleanName,
      email: cleanEmail,
      password: cleanPassword,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    this.saveUsers(users);

    // Auto-login tras registro exitoso
    const { password: _, ...userWithoutPassword } = newUser;
    this.saveSession(userWithoutPassword);

    return { success: true };
  }

  /**
   * Acceso rápido modo Demo para evaluaciones y pruebas
   */
  async quickDemoLogin(type: 'andres' | 'demo' = 'andres'): Promise<{ success: boolean; message?: string }> {
    const users = this.getUsers();
    const targetEmail = type === 'andres' 
      ? 'andres.rodriguez.carrasco@estudiante.ipss.cl' 
      : 'demo@taskflow.com';

    let user = users.find(u => u.email.toLowerCase() === targetEmail.toLowerCase());
    if (!user) {
      // Si por alguna razón fue borrado, restaurar semilla
      this.initUsersStorage();
      user = this.defaultUsers.find(u => u.email.toLowerCase() === targetEmail.toLowerCase());
    }

    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      this.saveSession(userWithoutPassword);
      return { success: true };
    }

    return { success: false, message: 'No se pudo iniciar el usuario demo.' };
  }

  /**
   * Cerrar sesión activa
   */
  logout(): void {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      this.currentUserSignal.set(null);
    } catch (e) {
      console.error('Error al cerrar sesión:', e);
    }
  }
}
