# Sistema de Gestión de Calificaciones — Frontend + Backend

Aplicación web completa para gestionar las notas de una institución.

- **`backend/`**: la API REST del proyecto de Programación II (Node.js, Express, MongoDB, JWT).
  Tiene su propio [README](backend/README.md) con la arquitectura y los endpoints.
- **`frontend/`**: la interfaz hecha en Programación Web 2 con **React + Vite**,
  React Router, React Bootstrap, Context, useState y useEffect.

Tres roles: el **admin** gestiona usuarios y materias, el **docente** carga y publica notas
de las materias que dicta, y el **alumno** ve sus notas y sus promedios.

## Cómo correrlo

Requisitos: Node.js 18 o superior y MongoDB corriendo.

**1. Backend** (en una terminal):

```bash
cd backend
npm install
cp .env.example .env   # poné un JWT_SECRET de 32 caracteres o más
npm run seed           # carga datos de prueba (borra la base)
npm run dev            # API en http://localhost:3000
```

**2. Frontend** (en otra terminal):

```bash
cd frontend
npm install
cp .env.example .env   # opcional: VITE_API_URL, por defecto http://localhost:3000
npm run dev            # app en http://localhost:5173
```

Usuarios de prueba (contraseña `123456`): `admin@mail.com`, `gomez@mail.com` (docente),
`ana@mail.com` (alumna). En la pantalla de login hay botones para completarlos.

## Estructura del frontend

```
frontend/src/
├── api/api.js            # apiFetch: todas las llamadas al backend (fetch + token + errores)
├── context/              # SesionContext: usuario logueado y token, disponible en toda la app
├── hooks/useDatos.js     # hook reutilizable para traer datos (useState + useEffect)
├── components/           # Menu, RutaProtegida, Cargando, MensajeError, EstadoBadge
├── pages/                # una carpeta por rol con sus pantallas
└── App.jsx               # rutas de la aplicación (React Router)
```

## Cómo se conectan

El frontend llama a la API con `fetch` y manda el token JWT en el header `Authorization`.
El backend permite esas llamadas porque `http://localhost:5173` está en `CORS_ORIGIN` (ver `backend/.env.example`).
Las pantallas están protegidas por rol con `RutaProtegida`, igual que las rutas de la API
están protegidas con los middlewares `proteger` y `autorizar`.
