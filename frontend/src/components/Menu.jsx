import { Navbar, Container, Nav, Button, Badge } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useSesion } from '../context/SesionContext'
import Logo from './Logo'

// Barra de navegación: muestra opciones distintas según el rol
export default function Menu() {
  const { usuario, cerrarSesion } = useSesion()
  const navigate = useNavigate()

  function salir() {
    cerrarSesion()
    navigate('/login')
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/"><Logo /> Calificaciones</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          {usuario && (
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Inicio</Nav.Link>
              {usuario.rol === 'alumno' && (
                <Nav.Link as={Link} to="/mis-calificaciones">Mis calificaciones</Nav.Link>
              )}
              {usuario.rol === 'docente' && (
                <>
                  <Nav.Link as={Link} to="/materias">Mis materias</Nav.Link>
                  <Nav.Link as={Link} to="/calificaciones">Calificaciones</Nav.Link>
                </>
              )}
              {usuario.rol === 'admin' && (
                <>
                  <Nav.Link as={Link} to="/admin/usuarios">Usuarios</Nav.Link>
                  <Nav.Link as={Link} to="/admin/materias">Materias</Nav.Link>
                  <Nav.Link as={Link} to="/calificaciones">Calificaciones</Nav.Link>
                </>
              )}
            </Nav>
          )}

          <Nav className="ms-auto align-items-lg-center gap-2">
            {usuario ? (
              <>
                <Navbar.Text>
                  {usuario.nombre} <Badge bg="light" text="dark">{usuario.rol}</Badge>
                </Navbar.Text>
                <Button variant="outline-light" size="sm" onClick={salir}>Salir</Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Ingresar</Nav.Link>
                <Nav.Link as={Link} to="/registro">Registrarse</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
