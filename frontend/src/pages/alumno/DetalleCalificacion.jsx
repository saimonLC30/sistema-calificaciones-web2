import { Container, Button } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { useDatos } from '../../hooks/useDatos'
import Cargando from '../../components/Cargando'
import MensajeError from '../../components/MensajeError'
import DatosCalificacion from '../../components/DatosCalificacion'

// Detalle de una calificación del alumno. El id viene de la URL: /mis-calificaciones/:id
// GET /api/calificaciones/:id  (el backend no le manda el historial interno al alumno)
export default function DetalleCalificacion() {
  const { id } = useParams()
  const { datos, error } = useDatos(`/api/calificaciones/${id}`)

  return (
    <Container className="py-4" style={{ maxWidth: 640 }}>
      <Button as={Link} to="/mis-calificaciones" variant="link" className="px-0 mb-2">← Volver a mis calificaciones</Button>

      <MensajeError mensaje={error} />
      {!datos && !error && <Cargando />}
      {datos && <DatosCalificacion calificacion={datos.calificacion} />}
    </Container>
  )
}
