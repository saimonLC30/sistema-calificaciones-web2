import { useState } from 'react'
import { Modal, Form, Button, Spinner, Alert } from 'react-bootstrap'
import { useAccion } from '../../hooks/useAccion'
import MensajeError from '../MensajeError'

// Formulario para CORREGIR una nota (PUT /api/calificaciones/:id).
// Si la nota ya estaba publicada, el motivo es obligatorio y pasa a "revisada".
export default function ModalCorreccion({ calificacion, onListo, onCerrar }) {
  const { ejecutar, enviando, error } = useAccion()
  const yaPublicada = calificacion.estado !== 'pendiente'

  const [formulario, setFormulario] = useState({
    nota: calificacion.nota,
    observaciones: calificacion.observaciones ?? '',
    motivo: '',
  })

  function cambiar(e) {
    setFormulario({ ...formulario, [e.target.name]: e.target.value })
  }

  async function guardar(e) {
    e.preventDefault()
    try {
      await ejecutar(`/api/calificaciones/${calificacion._id}`, {
        method: 'PUT',
        body: {
          nota: Number(formulario.nota),
          observaciones: formulario.observaciones,
          motivo: formulario.motivo || undefined,
        },
      })
      onListo('Calificación corregida')
    } catch {
      // el error se muestra en el formulario
    }
  }

  return (
    <Modal show onHide={onCerrar} centered>
      <Form onSubmit={guardar}>
        <Modal.Header closeButton>
          <Modal.Title>Corregir nota</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-3">
            <b>{calificacion.alumno?.nombre}</b> · {calificacion.evaluacion?.titulo}
          </p>

          {yaPublicada && (
            <Alert variant="info">
              Esta nota ya la vio el alumno: si cambiás la nota pasa a <b>revisada</b> y tenés que indicar el motivo.
            </Alert>
          )}

          <MensajeError mensaje={error} />

          <Form.Group className="mb-3">
            <Form.Label>Nota (de 0 a {calificacion.evaluacion?.notaMaxima})</Form.Label>
            <Form.Control type="number" name="nota" min={0} max={calificacion.evaluacion?.notaMaxima} step={0.01} value={formulario.nota} onChange={cambiar} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Observaciones</Form.Label>
            <Form.Control as="textarea" rows={2} name="observaciones" value={formulario.observaciones} onChange={cambiar} maxLength={500} />
          </Form.Group>

          <Form.Group>
            <Form.Label>Motivo del cambio {yaPublicada ? '' : '(opcional)'}</Form.Label>
            <Form.Control name="motivo" value={formulario.motivo} onChange={cambiar} placeholder="Ej: error al sumar el ejercicio 3" />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onCerrar}>Cancelar</Button>
          <Button type="submit" disabled={enviando}>
            {enviando ? <Spinner animation="border" size="sm" /> : 'Guardar'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
