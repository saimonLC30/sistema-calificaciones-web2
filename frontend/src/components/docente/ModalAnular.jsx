import { useState } from 'react'
import { Modal, Form, Button, Spinner } from 'react-bootstrap'
import { useAccion } from '../../hooks/useAccion'
import MensajeError from '../MensajeError'

// ANULAR una nota (PATCH /api/calificaciones/:id/estado). El motivo es obligatorio.
export default function ModalAnular({ calificacion, onListo, onCerrar }) {
  const { ejecutar, enviando, error } = useAccion()
  const [motivo, setMotivo] = useState('')

  async function anular(e) {
    e.preventDefault()
    try {
      await ejecutar(`/api/calificaciones/${calificacion._id}/estado`, { method: 'PATCH', body: { estado: 'anulada', motivo } })
      onListo('Calificación anulada')
    } catch {
      // el error se muestra en el formulario
    }
  }

  return (
    <Modal show onHide={onCerrar} centered>
      <Form onSubmit={anular}>
        <Modal.Header closeButton>
          <Modal.Title>Anular nota</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Vas a anular la nota de <b>{calificacion.alumno?.nombre}</b> en {calificacion.evaluacion?.titulo}.
            Queda registrada en el historial y <b>no se puede deshacer</b>.
          </p>
          <MensajeError mensaje={error} />
          <Form.Group>
            <Form.Label>Motivo</Form.Label>
            <Form.Control value={motivo} onChange={(e) => setMotivo(e.target.value)} required />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onCerrar}>Cancelar</Button>
          <Button type="submit" variant="danger" disabled={enviando}>
            {enviando ? <Spinner animation="border" size="sm" /> : 'Anular'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
