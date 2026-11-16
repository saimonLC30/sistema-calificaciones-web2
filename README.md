# Sistema de Gestión de Calificaciones — Frontend + Backend

Aplicación web completa para gestionar las notas de una institución, con tres roles:

- **Admin:** da de alta usuarios, crea materias, asigna docentes e inscribe alumnos.
- **Docente:** crea evaluaciones y carga, publica, corrige y anula las notas de sus materias.
- **Alumno:** ve sus notas publicadas y su promedio por materia.

| Carpeta     | Qué es                                                                 | Tecnologías                                              |
|-------------|------------------------------------------------------------------------|----------------------------------------------------------|
| `frontend/` | La interfaz (Programación Web 2)                                       | React + Vite, React Router, React Bootstrap, Context     |
| `backend/`  | La API REST (Programación II). Ver su [README](backend/README.md)       | Node.js, Express, MongoDB, JWT                           |

## Cómo correrlo

Requisitos: Node.js 18 o superior y MongoDB corriendo.

**1. Backend** (en una terminal):

```bash
cd backend
npm install
copy .env.example .env   # en Mac/Linux: cp .env.example .env
npm run seed             # carga datos de prueba (borra la base)
npm run dev              # API en http://localhost:3000
```

**2. Frontend** (en otra terminal):

```bash
cd frontend
npm install
copy .env.example .env   # opcional: la API por defecto es http://localhost:3000
npm run dev              # app en http://localhost:5173
```

Usuarios de prueba (contraseña `123456`). En la pantalla de login hay botones para completarlos:

| Rol     | Email                                  |
|---------|----------------------------------------|
| Admin   | admin@mail.com                         |
| Docente | gomez@mail.com (Programación II)       |
| Alumna  | ana@mail.com                           |

## Pantallas

| Rol      | Pantalla                     | Qué se puede hacer                                                               |
|----------|------------------------------|----------------------------------------------------------------------------------|
| Todos    | Login · Registro             | Ingresar o crear una cuenta (el registro público siempre crea alumnos)           |
| Todos    | Inicio                       | Resumen según el rol (por ejemplo, notas pendientes de publicar) y accesos rápidos |
| Alumno   | Mis calificaciones           | Promedio por materia, tabla de notas con filtro y detalle de cada nota           |
| Docente  | Mis materias                 | Las materias que dicta                                                           |
| Docente  | Gestionar materia            | Pestañas: calificaciones (cargar, publicar, corregir, anular, eliminar), evaluaciones (crear, editar, eliminar) y alumnos |
| Docente  | Calificaciones               | Todas las notas de sus materias, con filtros por materia, estado y tipo          |
| Docente  | Detalle de nota · Historial de alumno | Historial de cambios de una nota; promedios y notas de un alumno        |
| Admin    | Usuarios                     | Buscar, crear usuarios con cualquier rol y cambiar roles                         |
| Admin    | Materias                     | Crear, editar y eliminar materias; inscribir y desinscribir alumnos              |
| Admin    | Calificaciones               | Todas las notas del sistema                                                      |

## Cómo se consume la API

| Método    | Ejemplos de uso en la app                                                     |
|-----------|-------------------------------------------------------------------------------|
| **GET**   | Listar materias, evaluaciones, calificaciones y usuarios; ver detalles e historiales |
| **POST**  | Login, registro, crear evaluación, cargar nota, crear usuario, crear materia, inscribir alumnos |
| **PUT**   | Editar evaluación, corregir nota, editar materia                              |
| **PATCH** | Publicar o anular una nota, cambiar el rol de un usuario                      |
| **DELETE**| Eliminar evaluación, nota pendiente o materia; desinscribir un alumno         |

Todas las llamadas pasan por `apiFetch` (`frontend/src/api/api.js`), que usa `fetch`, manda el
token JWT en el header `Authorization` y convierte los errores del backend en mensajes para
mostrar en pantalla. Si el token vence, la sesión se cierra sola.

## Organización del frontend

```
frontend/src/
├── api/api.js              # apiFetch: todas las llamadas al backend
├── context/SesionContext   # usuario logueado y token, disponible en toda la app (Context)
├── hooks/
│   ├── useDatos.js         # traer datos (GET) con useState + useEffect
│   ├── useAccion.js        # crear, editar, eliminar (POST/PUT/PATCH/DELETE)
│   └── useTitulo.js        # título de la pestaña según la pantalla
├── components/             # piezas reutilizables
│   ├── Menu, PiePagina, Logo, RutaProtegida
│   ├── TablaCalificaciones, TarjetasPromedio, TarjetaDato, DatosCalificacion
│   ├── ModalConfirmar, MensajeError, MensajeExito, Cargando, EstadoBadge
│   ├── docente/            # formularios de evaluaciones y notas, GestionCalificaciones
│   └── admin/              # formularios de usuarios, materias e inscripciones
├── pages/                  # una carpeta por rol
│   ├── alumno/  docente/  admin/
│   └── Login, Registro, Inicio, NoEncontrada
└── App.jsx                 # rutas de la aplicación (React Router)
```

## Conceptos de React aplicados

| Concepto                        | Dónde                                                                  |
|---------------------------------|------------------------------------------------------------------------|
| Componentes reutilizables       | `TablaCalificaciones` la usan el alumno, el docente y el admin; `ModalConfirmar` sirve para publicar, eliminar y desinscribir |
| `useState`                      | Formularios, filtros, ventanas abiertas, mensajes                      |
| `useEffect`                     | `useDatos` (pedir datos al backend), cierre de sesión al vencer el token, título de la pestaña |
| Hooks propios                   | `useDatos`, `useAccion`, `useTitulo`                                   |
| Context                         | `SesionContext`: el usuario y el token en toda la app                   |
| React Router                    | Rutas por pantalla, parámetros (`/materias/:id`), rutas protegidas por rol (`RutaProtegida`) |
| Eventos                         | `onSubmit` en formularios, `onChange` en inputs y filtros, `onClick` en acciones |
| React Bootstrap                 | `Navbar`, `Card`, `Table`, `Modal`, `Form`, `Tabs`, `Alert`, `Badge`, `Spinner` |

## Seguridad

Las pantallas están protegidas por rol en el frontend (`RutaProtegida`), pero la seguridad real
está en el backend: aunque alguien escriba una URL a mano, la API verifica el token y el rol en
cada pedido y responde 401 o 403. El backend permite las llamadas desde el frontend porque
`http://localhost:5173` está en `CORS_ORIGIN` (ver `backend/.env.example`).
