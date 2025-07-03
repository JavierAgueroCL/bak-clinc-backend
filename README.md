# BAK Clinic Backend

Backend API para la clínica BAK desarrollado con Node.js, Express, Knex y PostgreSQL.

## Características

- Sistema de autenticación JWT
- Gestión de usuarios con roles (admin, doctor, patient)
- Recuperación de contraseña
- Verificación de email
- Migraciones de base de datos con Knex
- Middleware de autorización por roles
- Arquitectura MVC con controladores y validadores
- Validación robusta de entrada de datos
- Containerización con Docker
- Colección de Postman para pruebas de API

## Instalación

### Opción 1: Docker (Recomendado)

1. Clonar el repositorio
2. Iniciar los servicios con Docker:
   ```bash
   docker-compose up -d
   ```
3. Ejecutar migraciones:
   ```bash
   docker-compose exec -T app npx knex migrate:latest
   ```

Esto iniciará:
- PostgreSQL en el puerto 5432
- API Express en el puerto 3000

### Opción 2: Instalación Local

1. Clonar el repositorio
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Configurar variables de entorno:
   - Copiar `.env.example` a `.env` (o usar el archivo `.env` incluido)
   - Modificar las variables según tu configuración
4. Asegurar que PostgreSQL esté corriendo
5. Ejecutar migraciones:
   ```bash
   npx knex migrate:latest
   ```
6. Iniciar el servidor:
   ```bash
   npm start
   ```

## Variables de Entorno

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bak_clinic_dev
DB_USER=postgres
DB_PASSWORD=password

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

## Estructura del Proyecto

```
bak-clinic-backend/
├── config/
│   └── database.js          # Configuración de base de datos
├── controllers/
│   └── authController.js    # Controladores de autenticación
├── middleware/
│   └── auth.js              # Middleware de autenticación
├── migrations/
│   └── 20250703000001_create_users_table.js
├── models/
│   └── User.js              # Modelo de usuario
├── routes/
│   └── auth.js              # Definición de rutas
├── services/
│   └── authService.js       # Lógica de negocio
├── validators/
│   └── authValidator.js     # Validación de entrada
├── seeds/                   # Semillas de datos
├── .env                     # Variables de entorno
├── app.js                   # Aplicación principal
├── knexfile.js              # Configuración de Knex
├── docker-compose.yml       # Orquestación de contenedores
├── Dockerfile               # Imagen de la aplicación
├── postman_collection.json  # Colección de Postman
└── package.json
```

## API Endpoints

### Autenticación

#### Registro de Usuario
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123",
  "first_name": "Juan",
  "last_name": "Pérez",
  "phone": "555-1234",
  "role": "patient"
}
```

#### Inicio de Sesión
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

#### Solicitar Recuperación de Contraseña
```
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "usuario@ejemplo.com"
}
```

#### Restablecer Contraseña
```
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "token-de-recuperacion",
  "newPassword": "nueva-contraseña123"
}
```

#### Verificar Email
```
POST /api/auth/verify-email
Content-Type: application/json

{
  "token": "token-de-verificacion"
}
```

#### Obtener Perfil de Usuario
```
GET /api/auth/profile
Authorization: Bearer <jwt-token>
```

### Gestión de Usuarios (CRUD)

#### Obtener Todos los Usuarios
```
GET /api/users?page=1&limit=10&role=patient&is_active=true&search=john
Authorization: Bearer <jwt-token>
```
**Permisos**: Admin, Doctor

#### Obtener Usuario por ID
```
GET /api/users/{id}
Authorization: Bearer <jwt-token>
```
**Permisos**: Admin, Doctor

#### Crear Usuario
```
POST /api/users
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "password123",
  "first_name": "Nuevo",
  "last_name": "Usuario",
  "phone": "555-0123",
  "role": "patient"
}
```
**Permisos**: Admin únicamente

#### Actualizar Usuario
```
PUT /api/users/{id}
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "first_name": "Nombre Actualizado",
  "last_name": "Apellido Actualizado",
  "phone": "555-9999",
  "role": "doctor",
  "is_active": true
}
```
**Permisos**: Admin únicamente

#### Eliminar Usuario (Permanente)
```
DELETE /api/users/{id}
Authorization: Bearer <jwt-token>
```
**Permisos**: Admin únicamente

#### Desactivar Usuario (Soft Delete)
```
PATCH /api/users/{id}/deactivate
Authorization: Bearer <jwt-token>
```
**Permisos**: Admin únicamente

#### Activar Usuario
```
PATCH /api/users/{id}/activate
Authorization: Bearer <jwt-token>
```
**Permisos**: Admin únicamente

#### Cambiar Contraseña de Usuario
```
PATCH /api/users/{id}/password
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "newPassword": "newpassword123"
}
```
**Permisos**: Admin únicamente

#### Parámetros de Consulta (Query Parameters)
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10, max: 100)
- `role`: Filtrar por rol (admin, doctor, patient)
- `is_active`: Filtrar por estado (true, false)
- `search`: Buscar en nombre, apellido o email

#### Respuesta de Lista de Usuarios
```json
{
  "users": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Modelo de Usuario

La tabla `users` incluye los siguientes campos:

- `id` - ID único del usuario
- `email` - Email único del usuario
- `password` - Contraseña hasheada
- `first_name` - Nombre del usuario
- `last_name` - Apellido del usuario
- `phone` - Teléfono (opcional)
- `role` - Rol del usuario (admin, doctor, patient)
- `is_active` - Estado del usuario
- `email_verified` - Estado de verificación del email
- `reset_password_token` - Token para recuperación de contraseña
- `reset_password_expires` - Expiración del token de recuperación
- `email_verification_token` - Token de verificación de email
- `email_verification_expires` - Expiración del token de verificación
- `last_login` - Último inicio de sesión
- `created_at` - Fecha de creación
- `updated_at` - Fecha de última actualización

## Roles de Usuario

- **patient**: Usuario paciente (rol por defecto)
- **doctor**: Usuario médico
- **admin**: Usuario administrador

## Middleware de Autenticación

### `authenticateToken`
Verifica que el token JWT sea válido y establece `req.user` con la información del usuario.

### `authorize(...roles)`
Verifica que el usuario autenticado tenga uno de los roles especificados.

Ejemplo de uso:
```javascript
app.get('/api/admin/users', authenticateToken, authorize('admin'), (req, res) => {
  // Solo accesible para usuarios con rol 'admin'
});
```

## Comandos Útiles

### Comandos de Docker

```bash
# Iniciar servicios
docker-compose up -d

# Detener servicios
docker-compose down

# Ver logs de la aplicación
docker-compose logs -f app

# Ver logs de PostgreSQL
docker-compose logs -f postgres

# Ejecutar comandos en el contenedor
docker-compose exec -T app <comando>

# Reconstruir contenedores
docker-compose up --build
```

### Comandos de Base de Datos

```bash
# Ejecutar migraciones (Docker)
docker-compose exec -T app npx knex migrate:latest

# Ejecutar migraciones (Local)
npx knex migrate:latest

# Rollback última migración
npx knex migrate:rollback

# Estado de migraciones
npx knex migrate:status

# Crear nueva migración
npx knex migrate:make nombre_de_la_migracion

# Ejecutar seeds
npx knex seed:run

# Crear nuevo seed
npx knex seed:make nombre_del_seed
```

## Seguridad

- Las contraseñas se hashean con bcrypt
- Los tokens JWT tienen expiración configurable
- Los tokens de recuperación y verificación tienen expiración de 1 hora y 24 horas respectivamente
- Validación de entrada en todos los endpoints
- Middleware de autorización por roles

## Desarrollo

### Con Docker (Recomendado)

1. Clonar el repositorio
2. Ejecutar `docker-compose up -d`
3. Ejecutar migraciones: `docker-compose exec -T app npx knex migrate:latest`
4. La API estará disponible en `http://localhost:3000`

### Desarrollo Local

1. Asegurate de tener PostgreSQL instalado y corriendo
2. Crear la base de datos especificada en `DB_NAME`
3. Configurar las variables de entorno
4. Ejecutar migraciones
5. Iniciar el servidor en modo desarrollo

## Pruebas de API

### Postman

1. Importar el archivo `postman_collection.json` en Postman
2. La colección incluye:
   - Todos los endpoints de autenticación
   - Variables de entorno configuradas
   - Scripts automáticos para guardar tokens
   - Casos de prueba para diferentes escenarios
   - **Nuevas pruebas de validación**:
     - Formato de email inválido
     - Contraseña muy corta
     - Campos requeridos faltantes
     - Valores de rol inválidos
     - Campos con cadenas vacías
   - **Gestión completa de usuarios (CRUD)**:
     - Listar usuarios con paginación y filtros
     - Crear, actualizar y eliminar usuarios
     - Activar/desactivar usuarios
     - Cambiar contraseñas de usuarios
     - Control de permisos por rol

### curl

```bash
# Verificar que la API está funcionando
curl http://localhost:3000/

# Registrar usuario
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","first_name":"Test","last_name":"User"}'

# Iniciar sesión
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Obtener perfil (requiere token)
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer <jwt-token>"

# Probar validación de email inválido
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid-email","password":"123","first_name":"","last_name":"User"}'

# Obtener lista de usuarios (requiere token de admin/doctor)
curl -X GET http://localhost:3000/api/users?page=1&limit=5 \
  -H "Authorization: Bearer <jwt-token>"

# Crear nuevo usuario (requiere token de admin)
curl -X POST http://localhost:3000/api/users \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@example.com","password":"password123","first_name":"New","last_name":"User","role":"doctor"}'

# Actualizar usuario (requiere token de admin)
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{"first_name":"Updated","role":"doctor"}'
```

## Validación de Datos

El sistema incluye validación robusta en todas las entradas:

### Validaciones de Registro
- **Email**: Formato válido requerido (`user@domain.com`)
- **Password**: Mínimo 6 caracteres
- **First/Last Name**: Mínimo 2 caracteres, no vacíos
- **Role**: Solo acepta `admin`, `doctor`, `patient`
- **Sanitización**: Emails a minúsculas, trim en todos los campos

### Respuestas de Validación
```json
{
  "errors": [
    "Email debe tener un formato válido",
    "Password debe tener al menos 6 caracteres",
    "First name es requerido y debe ser una cadena válida"
  ]
}
```

## Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -am 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Crear un Pull Request

## Licencia

ISC