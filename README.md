# 🧺 ManchApp - Gestor Inteligente de Soluciones de Limpieza

<div align="center">

![ManchApp Hero](Manchapp_FR/public/washing-machine-hero.jpg)

**Una aplicación web interactiva para gestionar y descubrir soluciones efectivas para eliminar manchas y limpiar diferentes materiales. Parte de Adulting101**

[![React](https://img.shields.io/badge/React-19.1.1-61dafb?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.7-646cff?logo=vite)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Confluence](https://img.shields.io/badge/Documentation-Confluence-blue.svg)](https://afminguela.atlassian.net/wiki/x/kIDCBQ)
[![Jira](https://img.shields.io/badge/Backlog-Jira-blue.svg)](https://afminguela.atlassian.net/jira/software/projects/MAC/summary?atlOrigin=eyJpIjoiNTI3NGJjY2JhNmJlNDI2MGI4MzI2NTUyNjIyMWRjOTMiLCJwIjoiaiJ9)

[https://manchapp.vercel.app](ManchApp)

[Demo]([App desplegada](https://manchapp.vercel.app/)) · [Documentación](#características) · [Instalación](#instalación) · [Contribuir](#contribución)

</div>

---

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Características](#características)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Arquitectura](#arquitectura)
- [Base de Datos](#base-de-datos)
- [Scripts Disponibles](#scripts-disponibles)
- [Accesibilidad](#accesibilidad)
- [Contribución](#contribución)
- [Licencia](#licencia)

---

## 🎯 Descripción

**ManchApp** es una aplicación web moderna diseñada para ayudar a usuarios a encontrar y gestionar soluciones de limpieza personalizadas. Con una interfaz temática de lavadora y una base de datos robusta en Supabase, permite:

- 🔍 **Búsqueda inteligente** por tipo de material y sustancia/mancha
- 📝 **CRUD completo** de soluciones de limpieza
- 🔧 **Gestión de ingredientes, utensilios y precauciones**
- 🎨 **Filtros avanzados** por dificultad, tiempo, efectividad y más
- 🌙 **Dark mode** automático con contraste WCAG AAA
- ♿ **Totalmente accesible** con soporte para lectores de pantalla

---

## ✨ Características

### 🔐 Autenticación

- Sistema de login integrado con Supabase Auth
- Gestión de sesiones persistente
- Protección de rutas y datos

### 🔍 Búsqueda y Filtrado Avanzado

- **Búsqueda específica**: Por material (algodón, poliéster, cuero...) y sustancia (café, sangre, vino...)
- **Filtros múltiples**:
  - Dificultad (baja, media, alta)
  - Tiempo máximo de aplicación
  - Categoría de solución
  - Efectividad mínima (1-5 estrellas)
  - Ingredientes necesarios
  - Utensilios requeridos
- **Filtros persistentes**: Se mantienen activos hasta que se limpien explícitamente
- **Filtrado en tiempo real**: Sin necesidad de botón "Aplicar"

### 📝 CRUD de Soluciones

- **Crear**: Formularios completos con validación
  - Título, instrucciones, consejos
  - Tiempo estimado y dificultad
  - Categoría y efectividad
  - Selección de material y sustancia
  - Gestión de ingredientes, utensilios y precauciones
- **Leer**: Visualización de todas las soluciones con lazy loading (6 por página)
- **Actualizar**: Edición con pre-población automática de datos
- **Eliminar**: Con modal de confirmación para evitar borrados accidentales

### 🎨 Experiencia de Usuario (UX)

- **Estados de carga**: LoadingOverlay durante operaciones asíncronas
- **Manejo de errores**: Mensajes informativos y recuperación elegante
- **Validación de formularios**: En tiempo real con mensajes específicos
- **Responsive design**: Optimizado para móviles, tablets y escritorio
- **Dark mode**: Detección automática del tema del sistema
- **Animaciones suaves**: Transiciones CSS optimizadas

### ♿ Accesibilidad (A11y)

- **WCAG AAA**: Contraste de color 7:1 en todos los elementos
- **ARIA labels**: Roles y etiquetas semánticas completas
- **Navegación por teclado**: Totalmente funcional
- **Skip links**: Saltos rápidos a contenido principal
- **Screen reader friendly**: Optimizado para lectores de pantalla
- **Reduce motion**: Respeta preferencias de movimiento reducido

---

## 🛠️ Tecnologías

### Frontend

- **React 19.1.1** - Biblioteca de UI con Hooks
- **Vite 7.1.7** - Build tool ultrarrápido
- **CSS3** - Estilos modernos con Custom Properties
- **ESLint** - Linter configurado con reglas de React

### Backend & Base de Datos

- **Supabase** - Backend as a Service
  - PostgreSQL como base de datos
  - Row Level Security (RLS)
  - Autenticación integrada
  - API REST generada automáticamente

### Arquitectura

- **Componentes funcionales** con React Hooks
- **Separación de capas**: Presentación, lógica y datos
- **Servicios encapsulados** (`supabaseClient.js`)
- **Estado local** con useState/useEffect

---

## 📦 Instalación

### Prerrequisitos

- **Node.js** 18.x o superior
- **npm** 9.x o superior
- Cuenta en [Supabase](https://supabase.com/) (gratuita)

### Paso 1: Clonar el repositorio

```bash
git clone https://github.com/afminguela/Manchapp_fr.git
cd Manchapp_fr/Manchapp_FR
```

### Paso 2: Instalar dependencias

```bash
npm install
```

### Paso 3: Configurar variables de entorno

1. Crea un archivo `.env` en la raíz del proyecto:

```bash
touch .env
```

2. Añade tus credenciales de Supabase:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-publica-anonima
```

> 💡 **Obtener credenciales**: Ve a tu [Dashboard de Supabase](https://supabase.com/dashboard) → Settings → API

### Paso 4: Configurar base de datos

Ver la sección [Base de Datos](#base-de-datos) para instrucciones detalladas de setup del schema.

### Paso 5: Iniciar servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

---

## ⚙️ Configuración

### Variables de Entorno

| Variable                 | Descripción                          | Requerida |
| ------------------------ | ------------------------------------ | --------- |
| `VITE_SUPABASE_URL`      | URL de tu proyecto Supabase          | ✅ Sí     |
| `VITE_SUPABASE_ANON_KEY` | Clave pública (anon key) de Supabase | ✅ Sí     |

### Configuración de Supabase

1. **Crear proyecto** en [Supabase Dashboard](https://supabase.com/dashboard)
2. **Ejecutar schema SQL** (ver `SUPABASE_SETUP.md`)
3. **Configurar Row Level Security** (RLS):
   - Políticas básicas incluidas en el schema
   - Solo usuarios autenticados pueden acceder a datos
4. **Habilitar Email Auth** en Authentication → Providers

---

## 🚀 Uso

### 1. Inicio y Conexión

1. **Encender la lavadora**: Click en el botón de power
2. **Verificar conexión**: Se comprueba automáticamente la conexión con Supabase
3. **Iniciar sesión**: Usar credenciales de Supabase Auth

### 2. Búsqueda de Soluciones

1. **Seleccionar material**: Ej. "Algodón", "Cuero", "Poliéster"
2. **Seleccionar sustancia**: Ej. "Café", "Sangre", "Vino"
3. **Buscar**: Ver resultados específicos para esa combinación

### 3. Gestión de Soluciones

#### Crear nueva solución

1. Click en "Nueva Solución"
2. Rellenar formulario:
   - Título descriptivo
   - Instrucciones paso a paso
   - Material y sustancia
   - Dificultad (baja/media/alta)
   - Tiempo estimado (minutos)
   - Categoría (1-5)
   - Efectividad (1-5 estrellas)
   - Consejos opcionales
   - Ingredientes necesarios
   - Utensilios requeridos
   - Precauciones importantes
3. "Guardar"

#### Editar solución

1. Click en "Editar" en cualquier card
2. Formulario se pre-rellena con datos existentes
3. Modificar campos necesarios
4. "Guardar" 

#### Eliminar solución

1. Click en "Eliminar"
2. Confirmar en modal de seguridad 
- Advertencia: por la lógica de negocio, eliminar una solución no elimina ingredientes, utensilios o precauciones asociados. 

### 4. Filtros Avanzados

1. **Abrir panel**: Click en "Filtros"
2. **Aplicar filtros**: Se actualizan automáticamente
3. **Ver resumen**: Badge con número de filtros activos
4. **Limpiar**: Botón "Limpiar filtros" para resetear

---

## 🏗️ Arquitectura

### Estructura de Carpetas

```
Manchapp_FR/
├── public/                    # Archivos estáticos
│   ├── washing-machine-*.jpg  # Imágenes
│   └── vite.svg
├── src/
│   ├── components/            # Componentes React
│   │   ├── auth/              # Autenticación
│   │   │   ├── LoginForm.jsx
│   │   │   └── LoginSection.jsx
│   │   ├── layout/            # Componentes de layout
│   │   │   └── ConnectionStatus.jsx
│   │   ├── solutions/         # CRUD de soluciones
│   │   │   ├── DifficultyBadge.jsx
│   │   │   ├── FilterPanel.jsx
│   │   │   ├── SearchForm.jsx
│   │   │   ├── SolutionForm.jsx
│   │   │   ├── SolutionItem.jsx
│   │   │   ├── SolutionsActions.jsx
│   │   │   ├── SolutionsList.jsx
│   │   │   └── SolutionsSection.jsx
│   │   ├── ui/                # Componentes reutilizables
│   │   │   ├── Button.jsx
│   │   │   ├── ConfirmModal.jsx
│   │   │   ├── FormField.jsx
│   │   │   ├── LoadingOverlay.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── SkipLink.jsx
│   │   └── washing-machine/   # UI temática
│   │       ├── ControlPanel.jsx
│   │       ├── Drum.jsx
│   │       ├── IndicatorLights.jsx
│   │       ├── LCDScreen.jsx
│   │       ├── PowerButton.jsx
│   │       └── WashingDoor.jsx
│   ├── App.jsx                # Componente principal
│   ├── main.jsx               # Punto de entrada
│   ├── supabaseClient.js      # Cliente y servicios de Supabase
│   ├── App.css                # Estilos de App
│   └── index.css              # Estilos globales
├── check-schema-simple.js     # Script de debug de schema
├── debug-ids.js               # Script de debug de IDs
├── eslint.config.js           # Configuración ESLint
├── vite.config.js             # Configuración Vite
├── package.json               # Dependencias
├── README.md                  # Este archivo
├── SUPABASE_SETUP.md          # Guía de setup de BD
└── EVALUACION_RUBRICA.md      # Evaluación del proyecto

```

### Flujo de Datos

```
Usuario → Componente React → supabaseService → Supabase API → PostgreSQL
                    ↓
              useState/useEffect
                    ↓
            Re-render con nuevos datos
```

### Patrones de Diseño

- **Container/Presentational**: Separación de lógica y presentación
- **Composition over Inheritance**: Componentes reutilizables
- **Custom Hooks**: Lógica compartida (ej. useEffect para fetch)
- **Service Layer**: `supabaseService` encapsula lógica de BD

---

## 💾 Base de Datos

### Schema Principal

```sql
-- Tablas principales
soluciones_limpieza          # Soluciones de limpieza
materiales                   # Tipos de materiales (algodón, cuero...)
sustancias                   # Manchas/sustancias (café, vino...)
ingredientes                 # Ingredientes de limpieza
utensilios                   # Herramientas necesarias
precauciones                 # Advertencias de seguridad
categorias                   # Categorías de soluciones

-- Tablas junction (many-to-many)
soluciones_limpieza_ingredientes
soluciones_limpieza_utensilios
solucion_precauciones
soluciones_limpieza_materiales
```

### Relaciones

- **Solución → Material**: Many-to-Many (una solución puede servir para varios materiales)
- **Solución → Sustancia**: Many-to-One (una solución para una mancha específica)
- **Solución → Ingredientes**: Many-to-Many (múltiples ingredientes por solución)
- **Solución → Utensilios**: Many-to-Many (múltiples herramientas)
- **Solución → Precauciones**: Many-to-Many (múltiples advertencias)

![Schema BD](/supabase-schema-qnpubedkzzpdajasjsuc%20(1).png) 



---

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo en localhost:5173

# Producción
npm run build        # Build optimizado para producción en /dist
npm run preview      # Preview del build de producción

# Calidad de código
npm run lint         # Ejecuta ESLint para encontrar errores


```

---

## ♿ Accesibilidad

ManchApp cumple con los estándares **WCAG 2.1 AAA**, incluyendo:

### Contraste de Color

- **Ratio 7:1** en todos los elementos de texto
- Modo claro y oscuro con paletas accesibles
- Colores semánticos para estados (error, éxito, advertencia)

### Navegación por Teclado

- **Tab**: Navegación secuencial
- **Enter/Space**: Activación de botones
- **Escape**: Cerrar modales
- **Focus visible**: Indicadores claros de foco

### Lectores de Pantalla

- Todas las imágenes con `alt` descriptivo
- Botones con `aria-label` informativos
- Landmarks semánticos (`main`, `nav`, `aside`)
- Live regions para actualizaciones dinámicas
- Skip links para saltar navegación

### Preferencias del Usuario

- Respeta `prefers-color-scheme` (dark mode)
- Respeta `prefers-reduced-motion` (animaciones)
- Tamaños de fuente relativos (rem/em)
- Targets táctiles de mínimo 44x44px

---

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Para contribuir:

1. **Fork** el repositorio
2. **Crea una rama** para tu feature: `git checkout -b feature/AmazingFeature`
3. **Commit** tus cambios: `git commit -m 'Add some AmazingFeature'`
4. **Push** a la rama: `git push origin feature/AmazingFeature`
5. **Abre un Pull Request**

### Guidelines

- Seguir las convenciones de código existentes
- Añadir comentarios en código complejo
- Actualizar README si es necesario
- Asegurar que el linter pase (`npm run lint`)

---





## 👥 Autores

- **Ana Fernández Minguela** - [@afminguela](https://github.com/afminguela)
- **Claude sonnet 4.1** corrección de errores y limpiado de codigo muerto
- **Lovable** asistencia al diseño


---

## 🙏 Agradecimientos

- [Supabase](https://supabase.com/) por el excelente BaaS
- [Vite](https://vitejs.dev/) por la velocidad de desarrollo
- [React](https://reactjs.org/) por la potencia de los componentes
- IronHack por el bootcamp de desarrollo web
- Youtube contenido adicional
- Spotify BSO
- señorMarido por llevarse las fieras a pasear
- BCNENG por los consejos de comunidad
- Aïda por "menos CSS mas JSX"

---

## 📞 Contacto

¿Preguntas o sugerencias? Abre un [issue](https://github.com/afminguela/Manchapp_fr/issues) o contacta directamente.

---

<div align="center">

**[⬆ Volver arriba](#-manchapp---gestor-inteligente-de-soluciones-de-limpieza)**

Hecho con ❤️ y ☕ por Ana Fernández Minguela con el soporte y paciencia de señorMarido.

</div>
