import { useState } from 'react'
import { Container, Form, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDatos } from '../../hooks/useDatos'
import Cargando from '../../components/Cargando'
import MensajeError from '../../components/MensajeError'
import TarjetasPromedio from '../../components/TarjetasPromedio'
import TablaCalificaciones from '../../components/TablaCalificaciones'
import { useTitulo } from '../../hooks/useTitulo'

// El alumno ve sus notas publicadas o revisadas y el promedio de cada materia.
// GET /api/calificaciones/mis-calificaciones
export default function MisCalificaciones() {
  useTitulo('Mis calificaciones')
  const { datos, error } = useDatos('/api/calificaciones/mis-calificaciones')
  const [materia, setMateria] = useState('todas')

  if (error) return <Container className="py-4"><MensajeError mensaje={error} /></Container>
  if (!datos) return <Container className="py-4"><Cargando texto="Cargando tus calificaciones..." /></Container>

  const { porMateria, calificaciones } = datos
  const filtradas = calificaciones.filter((c) => materia === 'todas' || c.materia._id === materia)

  return (
    <Container className="py-4">
      <h2>Mis calificaciones</h2>

      {calificaciones.length === 0 && (
        <p className="text-muted mt-3">Todavía no tenés calificaciones publicadas.</p>
      )}

      {/* Promedio por materia (componente reutilizable) */}
      <TarjetasPromedio porMateria={porMateria} />

      {calificaciones.length > 0 && (
        <>
          <Form.Select className="my-3" style={{ maxWidth: 320 }} value={materia} onChange={(e) => setMateria(e.target.value)}>
            <option value="todas">Todas las materias</option>
            {porMateria.map((item) => (
              <option key={item.materia._id} value={item.materia._id}>{item.materia.nombre}</option>
            ))}
          </Form.Select>

          {/* La misma tabla que usa el docente, con otras columnas y otros botones */}
          <TablaCalificaciones
            calificaciones={filtradas}
            acciones={(c) => (
              <Button as={Link} to={`/mis-calificaciones/${c._id}`} variant="outline-primary" size="sm">Ver</Button>
            )}
          />
        </>
      )}
    </Container>
  )
}
