import { Container, Button } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDatos } from '../../hooks/useDatos'
import Cargando from '../../components/Cargando'
import MensajeError from '../../components/MensajeError'
import TarjetasPromedio from '../../components/TarjetasPromedio'
import TablaCalificaciones from '../../components/TablaCalificaciones'

// Historial académico de un alumno: promedios y todas sus notas.
// El docente solo ve las de sus materias (lo filtra el backend).
// GET /api/calificaciones/alumno/:id
export default function HistorialAlumno() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { datos, error } = useDatos(`/api/calificaciones/alumno/${id}`)

  return (
    <Container className="py-4">
      <Button variant="link" className="px-0 mb-2" onClick={() => navigate(-1)}>← Volver</Button>

      <MensajeError mensaje={error} />
      {!datos && !error && <Cargando />}

      {datos && (
        <>
          <h2>{datos.alumno.nombre}</h2>
          <p className="text-muted">{datos.alumno.email} · {datos.total} calificación(es)</p>

          <TarjetasPromedio porMateria={datos.porMateria} />

          <TablaCalificaciones
            calificaciones={datos.calificaciones}
            acciones={(c) => (
              <Button as={Link} to={`/calificaciones/${c._id}`} size="sm" variant="outline-secondary">Ver</Button>
            )}
          />
        </>
      )}
    </Container>
  )
}
