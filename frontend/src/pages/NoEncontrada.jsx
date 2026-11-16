import { Container, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function NoEncontrada() {
  return (
    <Container className="py-5 text-center">
      <h2>Página no encontrada</h2>
      <p className="text-muted">La dirección que buscás no existe.</p>
      <Button as={Link} to="/" variant="primary">Volver al inicio</Button>
    </Container>
  )
}
