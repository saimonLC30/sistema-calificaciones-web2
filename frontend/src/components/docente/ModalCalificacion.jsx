import { useState } from 'react'
import { Modal, Form, Button, Spinner } from 'react-bootstrap'
import { useAccion } from '../../hooks/useAccion'
import MensajeError from '../MensajeError'

// Formulario para CARGAR una nota nueva (POST /api/calificaciones).
// Recibe los alumnos y las evaluaciones de la materia para armar los <select>.
export default function ModalCalificacion({ alumnos, evaluaciones, onListo, onCerrar }) {
  const { ejecutar, enviando, error } = useAccion()

  const [formulario, setFormulario] = useState({
    alumno: alumnos[0]?._id ?? '',
    evaluacion: evaluaciones[0]?._id ?? '',
    nota: '',
    observaciones: '',
    publicar: false,
  })

  const evaluacionElegida = evaluaciones.find((ev) => ev._id === formulario.evaluacion)
  const notaMaxima = evaluacionElegida?.notaMaxima ?? 10

  function cambiar(e) {
    const { name, value, type, checked } = e.target
    setFormulario({ ...formulario, [name]: type === 'checkbox' ? checked : value })
  }

  async function guardar(e) {
    e.preventDefault()
    try {
      await ejecutar('/api/calificaciones', {
        method: 'POST',
        body: {
          alumno: formulario.alumno,
          evaluacion: formulario.evaluacion,
          nota: Number(formulario.nota),
          observaciones: formulario.observaciones || undefined,
          estado: formulario.publicar ? 'publicada' : 'pendiente',
        },
      })
      onListo(formulario.publicar ? 'Nota cargada y publicada' : 'Nota cargada (pendiente de publicar)')
    } catch {
      // el error se muestra en el formulario
    }
  }

  if (alumnos.length === 0 || evaluaciones.length === 0) {
    return (
      <Modal show onHide={onCerrar} centered>
        <Modal.Header closeButton><Modal.Title>Cargar nota</Modal.Title></Modal.Header>
        <Modal.Body>
          {alumnos.length === 0 ? 'La materia no tiene alumnos inscriptos.' : 'Primero creá una evaluación.'}
        </Modal.Body>
      </Modal>
    )
  }

  return (
    <Modal show onHide={onCerrar} centered>
      <Form onSubmit={guardar}>
        <Modal.Header closeButton>
          <Modal.Title>Cargar nota</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <MensajeError mensaje={error} />

          <Form.Group className="mb-3">
            <Form.Label>Alumno</Form.Label>
            <Form.Select name="alumno" value={formulario.alumno} onChange={cambiar}>
              {alumnos.map((a) => (
                <option key={a._id} value={a._id}>{a.nombre}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Evaluación</Form.Label>
            <Form.Select name="evaluacion" value={formulario.evaluacion} onChange={cambiar}>
              {evaluaciones.map((ev) => (
                <option key={ev._id} value={ev._id}>{ev.titulo}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Nota (de 0 a {notaMaxima})</Form.Label>
            <Form.Control type="number" name="nota" min={0} max={notaMaxima} step={0.01} value={formulario.nota} onChange={cambiar} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Observaciones (opcional)</Form.Label>
            <Form.Control as="textarea" rows={2} name="observaciones" value={formulario.observaciones} onChange={cambiar} maxLength={500} />
          </Form.Group>

          <Form.Check
            type="switch"
            name="publicar"
            label="Publicarla ahora (si no, queda pendiente y el alumno no la ve)"
            checked={formulario.publicar}
            onChange={cambiar}
          />
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
