# TaskFlow Pro — Aplicación TodoList (Evaluación 1 Desarrollo Móvil)

Aplicación móvil híbrida y responsiva de gestión de tareas y productividad personal desarrollada con **Ionic Framework**, **Angular Standalone Components** y **Capacitor**. Diseñada para ofrecer una experiencia de usuario moderna, fluida y con persistencia de datos local.

---

## Despliegue en Vivo (GitHub Pages)

La aplicación se encuentra compilada y publicada en producción mediante GitHub Actions en el siguiente enlace:

**[https://aerodriguezc1984.github.io/TodoList/](https://aerodriguezc1984.github.io/TodoList/)**

---

## Información del Estudiante y Proyecto

- **Estudiante:** Andrés Rodríguez Carrasco
- **Correo Institucional:** andres.rodriguez.carrasco@estudiante.ipss.cl
- **Institución:** Instituto Profesional San Sebastián (IPSS)
- **Asignatura:** Desarrollo Mobile (Evaluación 1)
- **Repositorio GitHub:** [https://github.com/aerodriguezc1984/TodoList](https://github.com/aerodriguezc1984/TodoList)

---

## Tecnologías Utilizadas

- **[Ionic Framework (v9)](https://ionicframework.com/):** Componentes visuales UI móviles adaptables (iOS y Material Design).
- **[Angular (v22)](https://angular.dev/):**
  - **Standalone Components:** Arquitectura modular y moderna sin `NgModule`.
  - **Angular Signals & Computed:** Reactividad de alto rendimiento para el estado y cálculo de estadísticas.
  - **Angular Router:** Enrutamiento SPA optimizado.
- **[Capacitor (v8)](https://capacitorjs.com/):** Runtime nativo multiplataforma (Web, Android e iOS) con plugins nativos:
  - `@capacitor/haptics`: Respuestas táctiles y hápticas.
  - `@capacitor/keyboard`: Control inteligente del teclado móvil.
  - `@capacitor/status-bar`: Personalización de la barra de estado.
  - `@capacitor/app`: Ciclo de vida de la aplicación.
- **TypeScript:** Tipado estático y robusto para modelos, servicios y componentes.
- **SCSS / CSS Moderno:** Diseño responsivo, paleta oscura de alto contraste, efectos visuales y micro-animaciones.
- **Ionicons (v8):** Librería de iconos vectoriales optimizados.
- **LocalStorage API:** Persistencia de datos en el almacenamiento local del dispositivo o navegador.
- **GitHub Actions:** Flujo de integración continua y despliegue automático (CI/CD) para GitHub Pages.

---

## Características y Funcionalidades de la Aplicación

1. **Autenticación y Seguridad (Login y Registro):**
   - **Inicio de Sesión:** Validación de credenciales con opción para visualizar u ocultar la contraseña y mensajes de error descriptivos.
   - **Registro de Nuevos Usuarios:** Formulario con validación de nombre, formato de correo, longitud de contraseña (mínimo 6 caracteres) y confirmación de contraseña coincidente.
   - **Protección de Rutas (`authGuard` y `guestGuard`):** Control de acceso que impide ingresar a la app sin autenticación y redirige a los usuarios ya autenticados.
   - **Acceso Rápido Demo:** Botones de acceso de un clic diseñados para facilitar la revisión del evaluador o profesor.
   - **Cierre de Sesión:** Botón de avatar en la barra superior con confirmación interactiva.
   - **Credenciales de prueba preconfiguradas:**
     - *Estudiante:* `andres.rodriguez.carrasco@estudiante.ipss.cl` | Contraseña: `password123`
     - *Usuario Demo:* `demo@taskflow.com` | Contraseña: `demo123`

2. **Gestión Completa de Tareas (CRUD):**
   - **Crear:** Registro de nuevas tareas con título, descripción opcional, categoría, prioridad y fecha límite.
   - **Leer y Detallar:** Vista rápida en lista y modal dedicado de detalles con marcas de tiempo.
   - **Editar:** Modificación en tiempo real de tareas existentes mediante formulario modal interactivo.
   - **Eliminar:** Eliminación individual de tareas o limpieza masiva de completadas.
   - **Completar:** Control rápido para alternar entre pendiente y completada.

3. **Categorización y Prioridades:**
   - Categorías predefinidas: *Trabajo*, *Personal*, *Estudio*, *Salud*, *Hogar* y *Finanzas*.
   - Niveles de prioridad (*Alta*, *Media*, *Baja*) identificados visualmente con etiquetas y colores de acento.

4. **Dashboard de Resumen y Métricas:**
   - Barra de progreso dinámica que calcula el porcentaje completado en tiempo real mediante señales computadas (`computed signals`).
   - Indicadores métricos interactivos: total de tareas, pendientes y completadas (actúan como filtros rápidos).

5. **Búsqueda y Filtros Avanzados:**
   - Buscador en tiempo real por texto (coincidencia en título y descripción).
   - Filtro por estado: *Todas*, *Pendientes* y *Completadas*.
   - Filtro por botones de categoría.
   - Selector de ordenamiento: por fecha más reciente o antigua, prioridad o alfabético.

6. **Persistencia Local Aislada por Usuario:**
   - Guardado automático en `LocalStorage` segmentado por cuenta activa (`taskflow_tasks_{userId}` y `taskflow_users_v2`).
   - Botón de reinicio en la barra superior para recargar datos de prueba cuando sea necesario.

---

## Instrucciones para Levantar y Ejecutar el Proyecto

### Prerrequisitos
- **Node.js** (versión 20 o superior recomendada).
- **npm** (incluido con Node.js).
- *(Opcional)* **Android Studio** si deseas compilar y ejecutar en emulador o dispositivo Android.

### 1. Clonar el Repositorio
```bash
git clone https://github.com/aerodriguezc1984/TodoList.git
cd TodoList
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Ejecutar en Modo Desarrollo (Navegador)
Inicia el servidor local de desarrollo:
```bash
npm start
```
O con el CLI de Ionic:
```bash
npx @ionic/cli serve
```

Abre tu navegador en:
```text
http://localhost:4200
```
> **Nota:** Presiona `F12` y activa la vista de emulación de dispositivos móviles (`Ctrl + Shift + M`) para visualizar la interfaz con aspecto de teléfono móvil.

---

### 4. Compilar para Producción
Para generar los archivos estáticos optimizados en la carpeta `www/`:
```bash
npm run build
```

---

### 5. Ejecutar en Android (Capacitor)

Si deseas probar la aplicación en un entorno nativo Android:

1. **Compilar la app web:**
   ```bash
   npm run build
   ```
2. **Agregar la plataforma Android (solo la primera vez):**
   ```bash
   npx cap add android
   ```
3. **Sincronizar cambios:**
   ```bash
   npx cap sync
   ```
4. **Abrir en Android Studio:**
   ```bash
   npx cap open android
   ```
   *(Desde Android Studio podrás presionar el botón "Run" para probar en un emulador o tu smartphone con depuración USB).*

---

## Estructura del Proyecto

```text
evaluacion1_DesarrolloMobile/
├── .github/
│   └── workflows/
│       └── deploy.yml            # Pipeline de CI/CD para GitHub Pages
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── task-modal/       # Modal para crear y editar tareas
│   │   │   └── task-detail-modal/# Modal para vista detallada de la tarea
│   │   ├── guards/
│   │   │   └── auth.guard.ts     # Guardas de protección authGuard y guestGuard
│   │   ├── home/                 # Página principal, buscador y listado
│   │   ├── models/
│   │   │   ├── task.model.ts     # Interfaces TypeScript (Task, Priority, Category)
│   │   │   └── user.model.ts     # Interfaces TypeScript (User, AuthSession)
│   │   ├── pages/
│   │   │   ├── login/            # Página de inicio de sesión
│   │   │   └── register/         # Página de registro de usuarios
│   │   ├── services/
│   │   │   ├── auth.service.ts   # Servicio de autenticación y sesiones
│   │   │   └── task.service.ts   # Estado reactivo con Signals y LocalStorage
│   │   ├── app.component.ts      # Componente raíz Standalone
│   │   └── app.routes.ts         # Definición de rutas protegidas
│   ├── global.scss               # Estilos globales y tokens
│   └── index.html                # Plantilla HTML base
├── angular.json                  # Configuración de compilación Angular
├── capacitor.config.ts           # Configuración de Capacitor nativo
├── package.json                  # Scripts y dependencias del proyecto
└── README.md                     # Documentación del proyecto
```
