import { useState } from 'react'
import { Container, Row, Col, Card, Table, Form, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDatos } from '../../hooks/useDatos'
import Cargando from '../../components/Cargando'
import MensajeError from '../../components/MensajeError'
import EstadoBadge from '../../components/EstadoBadge'
import { formatearFecha, nombreTipo } from '../../utils'

// El alumno ve sus notas publicadas o revisadas y el promedio de cada materia.
// GET /api/calificaciones/mis-calificaciones
export default function MisCalificaciones() {
  const { datos, cargando, error } = useDatos('/api/calificaciones/mis-calificaciones')
  const [materia, setMateria] = useState('todas')

  if (cargando) return <Container className="py-4"><Cargando texto="Cargando tus calificaciones..." /></Container>

  if (error) return <Container className="py-4"><MensajeError mensaje={error} /></Container>

  const { porMateria, calificaciones } = datos
  const filtradas = calificaciones.filter((c) => materia === 'todas' || c.materia._id === materia)

  return (
    <Container className="py-4">
      <h2>Mis calificaciones</h2>

      {calificaciones.length === 0 && (
        <p className="text-muted mt-3">Todavía no tenés calificaciones publicadas.</p>
      )}

      {/* Promedio por materia */}
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

      {calificaciones.length > 0 && (
        <>
          <Form.Select className="my-3" style={{ maxWidth: 320 }} value={materia} onChange={(e) => setMateria(e.target.value)}>
            <option value="todas">Todas las materias</option>
            {porMateria.map((item) => (
              <option key={item.materia._id} value={item.materia._id}>{item.materia.nombre}</option>
            ))}
          </Form.Select>

          <Table striped bordered hover responsive className="bg-white">
            <thead>
              <tr>
                <th>Materia</th>
                <th>Evaluación</th>
                <th>Tipo</th>
                <th>Fecha</th>
                <th>Nota</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map((c) => (
                <tr key={c._id}>
                  <td>{c.materia.nombre}</td>
                  <td>{c.evaluacion.titulo}</td>
                  <td>{nombreTipo(c.tipoEvaluacion)}</td>
                  <td>{formatearFecha(c.fecha)}</td>
                  <td><b>{c.nota}</b> / {c.evaluacion.notaMaxima}</td>
                  <td><EstadoBadge estado={c.estado} /></td>
                  <td>
                    <Button as={Link} to={`/mis-calificaciones/${c._id}`} variant="outline-primary" size="sm">Ver</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </Container>
  )
}
