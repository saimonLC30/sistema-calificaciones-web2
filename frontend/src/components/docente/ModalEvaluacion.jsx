import { useState } from 'react'
import { Modal, Form, Button, Spinner, Row, Col } from 'react-bootstrap'
import { useAccion } from '../../hooks/useAccion'
import MensajeError from '../MensajeError'
import { TIPOS_EVALUACION, nombreTipo, fechaParaInput, hoy } from '../../utils'

// Formulario para CREAR (POST) o EDITAR (PUT) una evaluación.
// Si recibe "evaluacion", edita; si no, crea una nueva en la materia.
export default function ModalEvaluacion({ materiaId, evaluacion, onListo, onCerrar }) {
  const editando = Boolean(evaluacion)
  const { ejecutar, enviando, error } = useAccion()

  const [formulario, setFormulario] = useState({
    titulo: evaluacion?.titulo ?? '',
    tipo: evaluacion?.tipo ?? 'parcial',
    fecha: evaluacion ? fechaParaInput(evaluacion.fecha) : hoy(),
    notaMaxima: evaluacion?.notaMaxima ?? 10,
    descripcion: evaluacion?.descripcion ?? '',
  })

  function cambiar(e) {
    setFormulario({ ...formulario, [e.target.name]: e.target.value })
  }

  async function guardar(e) {
    e.preventDefault()
    const datos = { ...formulario, notaMaxima: Number(formulario.notaMaxima) }
    try {
      if (editando) {
        await ejecutar(`/api/evaluaciones/${evaluacion._id}`, { method: 'PUT', body: datos })
        onListo('Evaluación actualizada')
      } else {
        await ejecutar('/api/evaluaciones', { method: 'POST', body: { ...datos, materia: materiaId } })
        onListo('Evaluación creada')
      }
    } catch {
      // el error se muestra en el formulario
    }
  }

  return (
    <Modal show onHide={onCerrar} centered>
      <Form onSubmit={guardar}>
        <Modal.Header closeButton>
          <Modal.Title>{editando ? 'Editar evaluación' : 'Nueva evaluación'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <MensajeError mensaje={error} />

          <Form.Group className="mb-3">
            <Form.Label>Título</Form.Label>
            <Form.Control name="titulo" value={formulario.titulo} onChange={cambiar} placeholder="Ej: Primer parcial" required />
          </Form.Group>

          <Row>
            <Col sm={6}>
              <Form.Group className="mb-3">
                <Form.Label>Tipo</Form.Label>
                <Form.Select name="tipo" value={formulario.tipo} onChange={cambiar}>
                  {TIPOS_EVALUACION.map((tipo) => (
                    <option key={tipo} value={tipo}>{nombreTipo(tipo)}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group className="mb-3">
                <Form.Label>Fecha</Form.Label>
                <Form.Control type="date" name="fecha" value={formulario.fecha} onChange={cambiar} required />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Nota máxima</Form.Label>
            <Form.Control type="number" name="notaMaxima" min={1} max={100} value={formulario.notaMaxima} onChange={cambiar} required />
          </Form.Group>

          <Form.Group>
            <Form.Label>Descripción (opcional)</Form.Label>
            <Form.Control as="textarea" rows={2} name="descripcion" value={formulario.descripcion} onChange={cambiar} maxLength={500} />
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
