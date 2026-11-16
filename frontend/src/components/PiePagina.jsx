import { Container } from 'react-bootstrap'

export default function PiePagina() {
  return (
    <footer className="border-top bg-white py-3 mt-auto">
      <Container className="text-center text-muted small">
        Sistema de Gestión de Calificaciones · Programación Web 2 · {new Date().getFullYear()}
      </Container>
    </footer>
  )
}
