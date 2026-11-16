import { Navigate } from 'react-router-dom'
import { useSesion } from '../context/SesionContext'

// Protege una pantalla:
//   - sin sesión -> manda al login
//   - con un rol que no corresponde -> manda al inicio
// Es el equivalente en el frontend de los middlewares proteger y autorizar del backend.
export default function RutaProtegida({ roles, children }) {
  const { usuario } = useSesion()

  if (!usuario) return <Navigate to="/login" replace />
  if (roles && !roles.includes(usuario.rol)) return <Navigate to="/" replace />

  return children
}
