import { Row, Col, Card } from 'react-bootstrap'

// Una tarjeta por materia con el promedio (lo calcula el backend).
// La usan "Mis calificaciones" (alumno) y el historial de un alumno (docente).
export default function TarjetasPromedio({ porMateria }) {
  return (
    <Row className="mt-3">
      {porMateria.map((item) => (
        <Col md={4} className="mb-3" key={item.materia._id}>
          <Card className="tarjeta-promedio shadow-sm h-100">
            <Card.Body>
              <Card.Subtitle className="text-muted mb-1">{item.materia.periodo}</Card.Subtitle>
              <Card.Title>{item.materia.nombre}</Card.Title>
              <div className="promedio">{item.promedio ?? '-'}</div>
              <small className="text-muted">Promedio sobre 10 · {item.cantidadNotas} nota(s)</small>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  )
}
