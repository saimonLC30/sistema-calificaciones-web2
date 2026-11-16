import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useSesion } from '../context/SesionContext'

// Accesos de cada rol. Se van sumando a medida que se agregan pantallas.
const ACCESOS = {
  alumno: [
    { titulo: 'Mis calificaciones', texto: 'Tus notas publicadas y el promedio de cada materia.', ruta: '/mis-calificaciones' },
  ],
  docente: [],
  admin: [],
}

export default function Inicio() {
  const { usuario } = useSesion()
  const accesos = ACCESOS[usuario.rol] || []

  return (
    <Container className="py-4">
      <h1>Hola, {usuario.nombre.split(' ')[0]}</h1>
      <p className="text-muted">Ingresaste como <b>{usuario.rol}</b>.</p>

      <Row className="mt-4">
        {accesos.map((acceso) => (
          <Col md={4} className="mb-3" key={acceso.ruta}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex flex-column">
                <Card.Title>{acceso.titulo}</Card.Title>
                <Card.Text className="flex-grow-1">{acceso.texto}</Card.Text>
                <Button as={Link} to={acceso.ruta} variant="primary">Entrar</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  )
}
