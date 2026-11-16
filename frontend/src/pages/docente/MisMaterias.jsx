import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDatos } from '../../hooks/useDatos'
import Cargando from '../../components/Cargando'
import MensajeError from '../../components/MensajeError'
import { useTitulo } from '../../hooks/useTitulo'

// Las materias que dicta el docente (GET /api/materias).
// El backend ya filtra: el docente solo recibe las suyas.
export default function MisMaterias() {
  useTitulo('Mis materias')
  const { datos, error } = useDatos('/api/materias')

  return (
    <Container className="py-4">
      <h2>Mis materias</h2>

      <MensajeError mensaje={error} />
      {!datos && !error && <Cargando texto="Cargando materias..." />}

      {datos && datos.resultados.length === 0 && <p className="text-muted mt-3">No tenés materias asignadas.</p>}

      <Row className="mt-3">
        {datos?.resultados.map((materia) => (
          <Col md={4} className="mb-3" key={materia._id}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex flex-column">
                <div className="mb-2">
                  <Badge bg="secondary" className="me-1">{materia.codigo}</Badge>
                  <Badge bg="light" text="dark">{materia.periodo}</Badge>
                </div>
                <Card.Title>{materia.nombre}</Card.Title>
                <Card.Text className="text-muted flex-grow-1">
                  Docentes: {materia.docentes.map((d) => d.nombre).join(', ') || '-'}
                </Card.Text>
                <Button as={Link} to={`/materias/${materia._id}`} variant="primary">Gestionar</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  )
}
