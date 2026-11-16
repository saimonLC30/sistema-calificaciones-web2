import { useState } from 'react'
import { Container, Button, Table, Badge } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDatos } from '../../hooks/useDatos'
import Cargando from '../../components/Cargando'
import MensajeError from '../../components/MensajeError'
import MensajeExito from '../../components/MensajeExito'
import ModalConfirmar from '../../components/ModalConfirmar'
import ModalMateria from '../../components/admin/ModalMateria'

// Gestión de materias (solo admin): crear, editar, eliminar.
// Para inscribir alumnos o cargar notas se entra a "Gestionar" (la misma pantalla que usa el docente).
export default function Materias() {
  const { datos, error, recargar } = useDatos('/api/materias')
  const [mensaje, setMensaje] = useState('')
  const [modal, setModal] = useState(null) // { tipo: 'nueva' | 'editar' | 'eliminar', materia? }

  function listo(texto) {
    setModal(null)
    setMensaje(texto)
    recargar()
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Materias</h2>
        <Button onClick={() => setModal({ tipo: 'nueva' })}>+ Nueva materia</Button>
      </div>

      <MensajeExito mensaje={mensaje} onCerrar={() => setMensaje('')} />
      <MensajeError mensaje={error} />
      {!datos && !error && <Cargando />}

      {datos && (
        <Table striped bordered hover responsive className="bg-white align-middle mt-3">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Período</th>
              <th>Docentes</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {datos.resultados.map((m) => (
              <tr key={m._id}>
                <td><Badge bg="secondary">{m.codigo}</Badge></td>
                <td>{m.nombre}</td>
                <td>{m.periodo}</td>
                <td>{m.docentes.map((d) => d.nombre).join(', ') || <span className="text-muted">Sin docentes</span>}</td>
                <td className="text-nowrap">
                  <Button as={Link} to={`/materias/${m._id}`} size="sm" variant="primary" className="me-1">Gestionar</Button>
                  <Button size="sm" variant="outline-primary" className="me-1" onClick={() => setModal({ tipo: 'editar', materia: m })}>Editar</Button>
                  <Button size="sm" variant="outline-danger" onClick={() => setModal({ tipo: 'eliminar', materia: m })}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {modal?.tipo === 'nueva' && <ModalMateria onListo={listo} onCerrar={() => setModal(null)} />}
      {modal?.tipo === 'editar' && <ModalMateria materia={modal.materia} onListo={listo} onCerrar={() => setModal(null)} />}
      {modal?.tipo === 'eliminar' && (
        <ModalConfirmar
          titulo="Eliminar materia"
          mensaje={<>¿Eliminar <b>{modal.materia.nombre}</b> ({modal.materia.periodo})? Solo se puede si todavía no tiene evaluaciones.</>}
          textoBoton="Eliminar"
          variante="danger"
          ruta={`/api/materias/${modal.materia._id}`}
          method="DELETE"
          mensajeExito="Materia eliminada"
          onListo={listo}
          onCerrar={() => setModal(null)}
        />
      )}
    </Container>
  )
}
