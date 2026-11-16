import { Card, ListGroup } from 'react-bootstrap'
import EstadoBadge from './EstadoBadge'
import { formatearFecha, nombreTipo } from '../utils'

// Los datos de una calificación en una tarjeta.
// La usan el detalle del alumno y el del docente.
export default function DatosCalificacion({ calificacion }) {
  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Subtitle className="text-muted mb-1">{calificacion.materia.nombre}</Card.Subtitle>
        <Card.Title className="mb-3">{calificacion.evaluacion.titulo}</Card.Title>

        <ListGroup variant="flush">
          <ListGroup.Item>
            Nota: <b className="fs-4">{calificacion.nota}</b> / {calificacion.evaluacion.notaMaxima}
          </ListGroup.Item>
          <ListGroup.Item>Estado: <EstadoBadge estado={calificacion.estado} /></ListGroup.Item>
          <ListGroup.Item>Alumno: {calificacion.alumno.nombre}</ListGroup.Item>
          <ListGroup.Item>Tipo: {nombreTipo(calificacion.tipoEvaluacion)}</ListGroup.Item>
          <ListGroup.Item>Fecha: {formatearFecha(calificacion.fecha)}</ListGroup.Item>
          <ListGroup.Item>Docente: {calificacion.docente.nombre}</ListGroup.Item>
          <ListGroup.Item>Observaciones: {calificacion.observaciones || '-'}</ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  )
}
