import { Alert } from 'react-bootstrap'

// Mensaje verde después de guardar algo. Se puede cerrar con la X.
export default function MensajeExito({ mensaje, onCerrar }) {
  if (!mensaje) return null
  return (
    <Alert variant="success" dismissible onClose={onCerrar}>
      {mensaje}
    </Alert>
  )
}
