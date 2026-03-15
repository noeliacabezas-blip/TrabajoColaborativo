# Formación Global Online - UD6

Aplicación full-stack desarrollada con **Node.js + Express + MongoDB (Mongoose)**, siguiendo arquitectura **MVC**, API REST, AJAX y sesiones con cookie.

## Requisitos

- Node.js 20+
- Cuenta de MongoDB Atlas o MongoDB local
- Archivo `.env`

## Variables de entorno

Crea un archivo `.env` en la raíz con este contenido:

```env
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/nombre_bd?retryWrites=true&w=majority
CLAVE=clave_super_secreta
TIMEOUT_SESION=3600000
PORT=3000
```

## Instalación

```bash
npm install
```

## Carga inicial de datos

```bash
node admin/carga_datos.js
node admin/carga_usuarios.js
```

Para borrar la base de datos:

```bash
node admin/reset_database.js
```

## Ejecución

```bash
node app.js
```

Servidor disponible en:

- `http://localhost:3000`

## Usuarios de prueba

Tras ejecutar `node admin/carga_usuarios.js` se crea este usuario administrador:

- Email: `admin@formacionglobalonline.es`
- Contraseña: `Temporal123`

## Funcionalidades incluidas

- Portada con bloques dinámicos cargados desde servidor
- Listado de cursos con filtros y búsqueda AJAX
- Detalle de curso con profesor, comentarios y formulario para usuarios autenticados
- Tabla de profesorado desde base de datos
- Panel de administración para crear, editar y eliminar cursos
- Registro, login, logout y comprobación de estado de sesión
- Validación básica y sanitización de comentarios
- Manejo centralizado de errores para vistas y API

## Endpoints principales

### Autenticación

- `POST /api/usuario/registro`
- `POST /api/usuario/login`
- `GET /api/usuario/logout`
- `GET /api/usuario/estado`

### Cursos

- `GET /api/cursos`
- `GET /api/cursos/:id`
- `GET /api/cursos/home/resumen`
- `POST /api/cursos` *(admin)*
- `PUT /api/cursos/:id` *(admin)*
- `DELETE /api/cursos/:id` *(admin)*

### Profesores

- `GET /api/profesores`

### Comentarios

- `GET /api/comentarios/curso/:cursoId`
- `POST /api/comentarios` *(usuario autenticado)*

## Estructura

```text
controladores/
middleware/
modelos/
public/
rutas/
vistas/
admin/
app.js
```
