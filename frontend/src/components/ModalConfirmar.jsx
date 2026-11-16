import { Modal, Button, Spinner } from 'react-bootstrap'
import { useAccion } from '../hooks/useAccion'
import MensajeError from './MensajeError'

// Ventana para confirmar una acción (publicar, eliminar...).
// Recibe la ruta y el método de la API, y avisa con onListo cuando sale bien.
export default function ModalConfirmar({ titulo, mensaje, textoBoton, variante = 'primary', ruta, method, body, mensajeExito, onListo, onCerrar }) {
  const { ejecutar, enviando, error } = useAccion()

  async function confirmar() {
    try {
      await ejecutar(ruta, { method, body })
      onListo(mensajeExito)
    } catch {
      // el error ya se muestra en la ventana
    }
  }

  return (
    <Modal show onHide={onCerrar} centered>
      <Modal.Header closeButton>
        <Modal.Title>{titulo}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <MensajeError mensaje={error} />
        {mensaje}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCerrar}>Cancelar</Button>
        <Button variant={variante} onClick={confirmar} disabled={enviando}>
          {enviando ? <Spinner animation="border" size="sm" /> : textoBoton}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
