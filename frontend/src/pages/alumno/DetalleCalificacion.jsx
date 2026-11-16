import { Container, Card, Button, ListGroup } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { useDatos } from '../../hooks/useDatos'
import Cargando from '../../components/Cargando'
import MensajeError from '../../components/MensajeError'
import EstadoBadge from '../../components/EstadoBadge'
import { formatearFecha, nombreTipo } from '../../utils'

// Detalle de una calificación. El id viene de la URL: /mis-calificaciones/:id
// GET /api/calificaciones/:id
export default function DetalleCalificacion() {
  const { id } = useParams()
  const { datos, cargando, error } = useDatos(`/api/calificaciones/${id}`)

  return (
    <Container className="py-4" style={{ maxWidth: 640 }}>
      <Button as={Link} to="/mis-calificaciones" variant="link" className="px-0 mb-2">← Volver a mis calificaciones</Button>

      {cargando && <Cargando />}
      <MensajeError mensaje={error} />

      {datos && (
        <Card className="shadow-sm">
          <Card.Body>
            <Card.Subtitle className="text-muted mb-1">{datos.calificacion.materia.nombre}</Card.Subtitle>
            <Card.Title className="mb-3">{datos.calificacion.evaluacion.titulo}</Card.Title>

            <ListGroup variant="flush">
              <ListGroup.Item>
                Nota: <b className="fs-4">{datos.calificacion.nota}</b> / {datos.calificacion.evaluacion.notaMaxima}
              </ListGroup.Item>
              <ListGroup.Item>Estado: <EstadoBadge estado={datos.calificacion.estado} /></ListGroup.Item>
              <ListGroup.Item>Tipo: {nombreTipo(datos.calificacion.tipoEvaluacion)}</ListGroup.Item>
              <ListGroup.Item>Fecha: {formatearFecha(datos.calificacion.fecha)}</ListGroup.Item>
              <ListGroup.Item>Docente: {datos.calificacion.docente.nombre}</ListGroup.Item>
              <ListGroup.Item>Observaciones: {datos.calificacion.observaciones || '-'}</ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
      )}
    </Container>
  )
}
