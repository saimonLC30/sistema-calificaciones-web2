import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useSesion } from '../context/SesionContext'
import { useDatos } from '../hooks/useDatos'
import { useTitulo } from '../hooks/useTitulo'
import TarjetaDato from '../components/TarjetaDato'

// Accesos rápidos de cada rol
const ACCESOS = {
  alumno: [
    { titulo: 'Mis calificaciones', texto: 'Tus notas publicadas y el promedio de cada materia.', ruta: '/mis-calificaciones' },
  ],
  docente: [
    { titulo: 'Mis materias', texto: 'Tus materias: alumnos, evaluaciones y carga de notas.', ruta: '/materias' },
    { titulo: 'Calificaciones', texto: 'Todas las notas de tus materias, con filtros. Publicá, corregí o anulá.', ruta: '/calificaciones' },
  ],
  admin: [
    { titulo: 'Usuarios', texto: 'Alta de docentes y alumnos, y cambio de roles.', ruta: '/admin/usuarios' },
    { titulo: 'Materias', texto: 'Crear materias, asignar docentes e inscribir alumnos.', ruta: '/admin/materias' },
    { titulo: 'Calificaciones', texto: 'Todas las notas del sistema, con filtros.', ruta: '/calificaciones' },
  ],
}

// ── Resumen de cada rol (cada uno pide sus propios datos al backend) ──

function ResumenAlumno() {
  const { datos } = useDatos('/api/calificaciones/mis-calificaciones')
  const promedios = datos?.porMateria.map((m) => m.promedio).filter((p) => p !== null) ?? []
  const general = promedios.length ? (promedios.reduce((a, b) => a + b, 0) / promedios.length).toFixed(2) : '-'

  return (
    <Row className="g-3">
      <Col sm={4}><TarjetaDato valor={datos?.total} etiqueta="Notas publicadas" ruta="/mis-calificaciones" /></Col>
      <Col sm={4}><TarjetaDato valor={datos?.porMateria.length} etiqueta="Materias con notas" /></Col>
      <Col sm={4}><TarjetaDato valor={datos ? general : undefined} etiqueta="Promedio general (sobre 10)" /></Col>
    </Row>
  )
}

function ResumenDocente() {
  const materias = useDatos('/api/materias')
  const pendientes = useDatos('/api/calificaciones?estado=pendiente&limite=1')
  const total = useDatos('/api/calificaciones?limite=1')
  const hayPendientes = pendientes.datos?.total > 0

  return (
    <Row className="g-3">
      <Col sm={4}><TarjetaDato valor={materias.datos?.total} etiqueta="Materias a cargo" ruta="/materias" /></Col>
      <Col sm={4}><TarjetaDato valor={total.datos?.total} etiqueta="Notas cargadas" ruta="/calificaciones" /></Col>
      <Col sm={4}>
        <TarjetaDato valor={pendientes.datos?.total} etiqueta="Pendientes de publicar" ruta="/calificaciones?estado=pendiente" destacado={hayPendientes} />
      </Col>
    </Row>
  )
}

function ResumenAdmin() {
  const usuarios = useDatos('/api/usuarios?limite=1')
  const materias = useDatos('/api/materias')
  const pendientes = useDatos('/api/calificaciones?estado=pendiente&limite=1')

  return (
    <Row className="g-3">
      <Col sm={4}><TarjetaDato valor={usuarios.datos?.total} etiqueta="Usuarios" ruta="/admin/usuarios" /></Col>
      <Col sm={4}><TarjetaDato valor={materias.datos?.total} etiqueta="Materias" ruta="/admin/materias" /></Col>
      <Col sm={4}><TarjetaDato valor={pendientes.datos?.total} etiqueta="Notas pendientes de publicar" ruta="/calificaciones?estado=pendiente" /></Col>
    </Row>
  )
}

const RESUMENES = { alumno: ResumenAlumno, docente: ResumenDocente, admin: ResumenAdmin }

export default function Inicio() {
  useTitulo('Inicio')
  const { usuario } = useSesion()
  const Resumen = RESUMENES[usuario.rol]
  const accesos = ACCESOS[usuario.rol] || []

  return (
    <Container className="py-4">
      <h1 className="h2">Hola, {usuario.nombre.split(' ')[0]}</h1>
      <p className="text-muted">Ingresaste como <b>{usuario.rol}</b>.</p>

      {Resumen && <Resumen />}

      <h2 className="h5 mt-5 mb-3">Accesos rápidos</h2>
      <Row>
        {accesos.map((acceso) => (
          <Col md={4} className="mb-3" key={acceso.ruta}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex flex-column">
                <Card.Title>{acceso.titulo}</Card.Title>
                <Card.Text className="flex-grow-1 text-muted">{acceso.texto}</Card.Text>
                <Button as={Link} to={acceso.ruta} variant="primary">Entrar</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  )
}
