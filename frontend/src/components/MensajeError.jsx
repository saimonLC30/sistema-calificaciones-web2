import { Alert } from 'react-bootstrap'

// Muestra el mensaje de error que devuelve el backend (si hay uno)
export default function MensajeError({ mensaje }) {
  if (!mensaje) return null
  return <Alert variant="danger">{mensaje}</Alert>
}
