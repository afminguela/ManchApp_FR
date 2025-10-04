# 🗄️ Configuración de Supabase para ManchApp

## 📋 Paso a paso para conectar con Supabase

### 1. Configurar tu proyecto Supabase

1. **Ve a [Supabase Dashboard](https://supabase.com/dashboard)**
2. **Crea un nuevo proyecto** o selecciona uno existente
3. **Ve a Settings > API**
4. **Copia tus credenciales:**
   - Project URL
   - anon/public key

### 2. Configurar las variables de entorno

1. **Abre el archivo `.env`** en la raíz del proyecto
2. **Reemplaza los valores** con tus credenciales de Supabase:

```env
REACT_APP_SUPABASE_URL=https://tu-proyecto-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=tu-clave-anonima-aqui
```

### 3. Crear la base de datos

1. **Ve a SQL Editor** en tu dashboard de Supabase
2. **Ejecuta el contenido** del archivo `database_setup.sql`
3. **Verifica** que la tabla `solutions` se haya creado correctamente

### 4. Configurar autenticación (opcional)

Si quieres usar autenticación real de Supabase en lugar del login hardcodeado:

1. **Ve a Authentication > Settings** en Supabase
2. **Configura providers** (email, Google, etc.)
3. **Actualiza el código** para usar `supabase.auth.signInWithPassword()`

### 5. Políticas de seguridad (RLS)

El archivo SQL incluye políticas básicas de Row Level Security:

- ✅ Solo usuarios autenticados pueden acceder a las soluciones
- ✅ Todas las operaciones CRUD están permitidas para usuarios autenticados

**Para personalizar:**

1. Ve a **Authentication > Policies** en Supabase
2. Modifica las políticas según tus necesidades

## 🚀 Probar la conexión

1. **Inicia la aplicación:** `npm start`
2. **Haz clic en el botón de encendido** de la lavadora
3. **Deberías ver:** "Conectado a Supabase" si todo está bien configurado
4. **Inicia sesión** con las credenciales configuradas
5. **Las soluciones** se cargarán automáticamente desde Supabase

## 🔧 Funcionalidades implementadas

### ✅ Conexión a base de datos

- Verificación real de conexión con Supabase
- Manejo de errores de conexión
- Feedback visual del estado de conexión

### ✅ CRUD de Soluciones

- **Crear:** Nuevas soluciones se guardan en Supabase
- **Leer:** Soluciones se cargan automáticamente al autenticarse
- **Actualizar:** Editar soluciones existentes
- **Eliminar:** Borrar soluciones con confirmación

### ✅ Validación y seguridad

- Row Level Security habilitado
- Validación de tipos en la base de datos
- Manejo de errores con mensajes informativos

## 🎯 Próximos pasos sugeridos

1. **Autenticación real:** Implementar login con Supabase Auth
2. **Usuarios múltiples:** Asociar soluciones a usuarios específicos
3. **Imágenes:** Agregar soporte para subir imágenes de las manchas
4. **Categorías:** Añadir categorización de soluciones
5. **Búsqueda:** Implementar filtros y búsqueda de soluciones

## 🐛 Resolución de problemas

### Error: "Faltan las variables de entorno"

- Verifica que el archivo `.env` esté en la raíz del proyecto
- Reinicia el servidor de desarrollo (`npm start`)

### Error: "Cannot reach database"

- Verifica las credenciales en `.env`
- Asegúrate de que el proyecto Supabase esté activo
- Revisa que la tabla `solutions` exista

### Error: "Row Level Security"

- Ejecuta las políticas del archivo `database_setup.sql`
- Verifica que RLS esté configurado correctamente

## 📚 Recursos útiles

- [Documentación de Supabase](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
