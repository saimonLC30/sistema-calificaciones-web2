import { Container, Button, Card, ListGroup, Row, Col } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { useDatos } from '../../hooks/useDatos'
import Cargando from '../../components/Cargando'
import MensajeError from '../../components/MensajeError'
import DatosCalificacion from '../../components/DatosCalificacion'
import { formatearFecha } from '../../utils'
import { useTitulo } from '../../hooks/useTitulo'

// Qué significa cada acción del historial
const ACCIONES = {
  creada: 'Cargó la nota',
  modificada: 'Corrigió la nota',
  cambio_estado: 'Cambió el estado',
}

// Detalle de una calificación + su historial de cambios (solo docente y admin).
// GET /api/calificaciones/:id
export default function DetalleCalificacionDocente() {
  useTitulo('Detalle de nota')
  const { id } = useParams()
  const navigate = useNavigate()
  const { datos, error } = useDatos(`/api/calificaciones/${id}`)

  return (
    <Container className="py-4">
      <Button variant="link" className="px-0 mb-2" onClick={() => navigate(-1)}>← Volver</Button>

      <MensajeError mensaje={error} />
      {!datos && !error && <Cargando />}

      {datos && (
        <Row>
          <Col lg={6} className="mb-3">
            <DatosCalificacion calificacion={datos.calificacion} />
          </Col>

          <Col lg={6}>
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>Historial de cambios</Card.Title>
                <ListGroup variant="flush">
                  {datos.calificacion.historial.map((h, i) => (
                    <ListGroup.Item key={i}>
                      <div className="d-flex justify-content-between">
                        <b>{ACCIONES[h.accion] || h.accion}</b>
                        <small className="text-muted">{formatearFecha(h.fecha)}</small>
                      </div>
                      <small>
                        {h.usuario?.nombre}
                        {h.notaAnterior !== undefined && h.notaAnterior !== h.notaNueva && ` · nota ${h.notaAnterior} → ${h.notaNueva}`}
                        {h.accion === 'creada' && ` · nota ${h.notaNueva}`}
                        {h.estadoAnterior && h.estadoAnterior !== h.estadoNuevo && ` · ${h.estadoAnterior} → ${h.estadoNuevo}`}
                        {h.accion === 'creada' && ` · ${h.estadoNuevo}`}
                      </small>
                      {h.motivo && <div className="text-muted"><small>Motivo: {h.motivo}</small></div>}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  )
}
