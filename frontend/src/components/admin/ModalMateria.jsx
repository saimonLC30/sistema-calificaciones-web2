import { useState } from 'react'
import { Modal, Form, Button, Spinner, Row, Col } from 'react-bootstrap'
import { useAccion } from '../../hooks/useAccion'
import { useDatos } from '../../hooks/useDatos'
import MensajeError from '../MensajeError'
import Cargando from '../Cargando'
import ListaSeleccion from './ListaSeleccion'

// CREAR (POST) o EDITAR (PUT) una materia, con sus docentes.
export default function ModalMateria({ materia, onListo, onCerrar }) {
  const editando = Boolean(materia)
  const { ejecutar, enviando, error } = useAccion()
  const docentes = useDatos('/api/usuarios?rol=docente&limite=100')

  const [formulario, setFormulario] = useState({
    nombre: materia?.nombre ?? '',
    codigo: materia?.codigo ?? '',
    periodo: materia?.periodo ?? '',
  })
  const [docentesElegidos, setDocentesElegidos] = useState(materia?.docentes.map((d) => d._id) ?? [])

  function cambiar(e) {
    setFormulario({ ...formulario, [e.target.name]: e.target.value })
  }

  async function guardar(e) {
    e.preventDefault()
    const datos = { ...formulario, docentes: docentesElegidos }
    try {
      if (editando) {
        await ejecutar(`/api/materias/${materia._id}`, { method: 'PUT', body: datos })
        onListo('Materia actualizada')
      } else {
        await ejecutar('/api/materias', { method: 'POST', body: datos })
        onListo('Materia creada')
      }
    } catch {
      // el error se muestra en el formulario
    }
  }

  return (
    <Modal show onHide={onCerrar} centered>
      <Form onSubmit={guardar}>
        <Modal.Header closeButton>
          <Modal.Title>{editando ? 'Editar materia' : 'Nueva materia'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <MensajeError mensaje={error} />

          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control name="nombre" value={formulario.nombre} onChange={cambiar} placeholder="Ej: Programación II" required />
          </Form.Group>

          <Row>
            <Col sm={6}>
              <Form.Group className="mb-3">
                <Form.Label>Código</Form.Label>
                <Form.Control name="codigo" value={formulario.codigo} onChange={cambiar} placeholder="Ej: PROG2" required />
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group className="mb-3">
                <Form.Label>Período</Form.Label>
                <Form.Control name="periodo" value={formulario.periodo} onChange={cambiar} placeholder="Ej: 2026-2C" required />
                <Form.Text>AAAA-1C, AAAA-2C o AAAA-ANUAL</Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Form.Label>Docentes</Form.Label>
          {docentes.datos ? (
            <ListaSeleccion personas={docentes.datos.resultados} seleccionados={docentesElegidos} onCambiar={setDocentesElegidos} />
          ) : (
            <Cargando texto="Cargando docentes..." />
          )}
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
