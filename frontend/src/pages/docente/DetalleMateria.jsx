import { useState } from 'react'
import { Container, Tabs, Tab, Table, Button, Badge } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDatos } from '../../hooks/useDatos'
import Cargando from '../../components/Cargando'
import MensajeError from '../../components/MensajeError'
import MensajeExito from '../../components/MensajeExito'
import ModalConfirmar from '../../components/ModalConfirmar'
import ModalEvaluacion from '../../components/docente/ModalEvaluacion'
import ModalCalificacion from '../../components/docente/ModalCalificacion'
import GestionCalificaciones from '../../components/docente/GestionCalificaciones'
import ModalInscribir from '../../components/admin/ModalInscribir'
import { useSesion } from '../../context/SesionContext'
import { formatearFecha, nombreTipo } from '../../utils'

// Gestión de una materia, en tres pestañas: calificaciones, evaluaciones y alumnos.
// Usa tres GET: la materia, sus evaluaciones y sus calificaciones.
// El admin además puede inscribir y desinscribir alumnos desde la pestaña "Alumnos".
export default function DetalleMateria() {
  const { usuario } = useSesion()
  const esAdmin = usuario.rol === 'admin'
  const { id } = useParams()
  const navigate = useNavigate()
  const materia = useDatos(`/api/materias/${id}`)
  const evaluaciones = useDatos(`/api/evaluaciones?materia=${id}`)
  const calificaciones = useDatos(`/api/calificaciones?materia=${id}&limite=100`)

  const [mensaje, setMensaje] = useState('')
  // Qué ventana está abierta: { tipo: 'nueva-evaluacion' | 'editar-evaluacion' | 'eliminar-evaluacion' | 'nueva-nota', evaluacion? }
  const [modal, setModal] = useState(null)

  // Después de guardar: cerrar la ventana, mostrar el mensaje y volver a pedir los datos
  function listo(texto) {
    setModal(null)
    setMensaje(texto)
    materia.recargar()
    evaluaciones.recargar()
    calificaciones.recargar()
  }

  if (materia.error) return <Container className="py-4"><MensajeError mensaje={materia.error} /></Container>
  if (!materia.datos) return <Container className="py-4"><Cargando /></Container>

  const { nombre, codigo, periodo, docentes, alumnos } = materia.datos.materia
  const listaEvaluaciones = evaluaciones.datos?.resultados ?? []

  return (
    <Container className="py-4">
      <Button variant="link" className="px-0 mb-2" onClick={() => navigate(-1)}>← Volver</Button>
      <h2>{nombre} <Badge bg="secondary" className="fs-6 align-middle">{codigo}</Badge></h2>
      <p className="text-muted">
        Período {periodo} · Docentes: {docentes.map((d) => d.nombre).join(', ')} · {alumnos.length} alumno(s)
      </p>

      <MensajeExito mensaje={mensaje} onCerrar={() => setMensaje('')} />

      <Tabs defaultActiveKey="calificaciones" className="mb-3">
        {/* ── Calificaciones ───────────────────────── */}
        <Tab eventKey="calificaciones" title="Calificaciones">
          <div className="d-flex justify-content-end mb-2">
            <Button onClick={() => setModal({ tipo: 'nueva-nota' })}>+ Cargar nota</Button>
          </div>
          <MensajeError mensaje={calificaciones.error} />
          {calificaciones.datos ? (
            <GestionCalificaciones calificaciones={calificaciones.datos.resultados} mostrarMateria={false} onCambio={listo} />
          ) : (
            <Cargando />
          )}
        </Tab>

        {/* ── Evaluaciones ─────────────────────────── */}
        <Tab eventKey="evaluaciones" title={`Evaluaciones (${listaEvaluaciones.length})`}>
          <div className="d-flex justify-content-end mb-2">
            <Button onClick={() => setModal({ tipo: 'nueva-evaluacion' })}>+ Nueva evaluación</Button>
          </div>
          <MensajeError mensaje={evaluaciones.error} />
          {listaEvaluaciones.length === 0 ? (
            <p className="text-muted">Todavía no hay evaluaciones.</p>
          ) : (
            <Table striped bordered hover responsive className="bg-white align-middle">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Tipo</th>
                  <th>Fecha</th>
                  <th>Nota máxima</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {listaEvaluaciones.map((ev) => (
                  <tr key={ev._id}>
                    <td>{ev.titulo}</td>
                    <td>{nombreTipo(ev.tipo)}</td>
                    <td>{formatearFecha(ev.fecha)}</td>
                    <td>{ev.notaMaxima}</td>
                    <td className="text-nowrap">
                      <Button size="sm" variant="outline-primary" className="me-1" onClick={() => setModal({ tipo: 'editar-evaluacion', evaluacion: ev })}>Editar</Button>
                      <Button size="sm" variant="outline-danger" onClick={() => setModal({ tipo: 'eliminar-evaluacion', evaluacion: ev })}>Eliminar</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Tab>

        {/* ── Alumnos ──────────────────────────────── */}
        <Tab eventKey="alumnos" title={`Alumnos (${alumnos.length})`}>
          {esAdmin && (
            <div className="d-flex justify-content-end mb-2">
              <Button onClick={() => setModal({ tipo: 'inscribir' })}>+ Inscribir alumnos</Button>
            </div>
          )}
          <Table striped bordered hover responsive className="bg-white align-middle">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {alumnos.map((a) => (
                <tr key={a._id}>
                  <td>{a.nombre}</td>
                  <td>{a.email}</td>
                  <td className="text-nowrap">
                    <Button as={Link} to={`/alumnos/${a._id}`} size="sm" variant="outline-secondary" className="me-1">Ver historial</Button>
                    {esAdmin && (
                      <Button size="sm" variant="outline-danger" onClick={() => setModal({ tipo: 'desinscribir', alumno: a })}>Desinscribir</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
      </Tabs>

      {/* ── Ventanas (se muestran solo cuando hacen falta) ── */}
      {modal?.tipo === 'nueva-evaluacion' && <ModalEvaluacion materiaId={id} onListo={listo} onCerrar={() => setModal(null)} />}

      {modal?.tipo === 'editar-evaluacion' && (
        <ModalEvaluacion evaluacion={modal.evaluacion} onListo={listo} onCerrar={() => setModal(null)} />
      )}

      {modal?.tipo === 'eliminar-evaluacion' && (
        <ModalConfirmar
          titulo="Eliminar evaluación"
          mensaje={<>¿Eliminar <b>{modal.evaluacion.titulo}</b>? Solo se puede si todavía no tiene notas cargadas.</>}
          textoBoton="Eliminar"
          variante="danger"
          ruta={`/api/evaluaciones/${modal.evaluacion._id}`}
          method="DELETE"
          mensajeExito="Evaluación eliminada"
          onListo={listo}
          onCerrar={() => setModal(null)}
        />
      )}

      {modal?.tipo === 'inscribir' && (
        <ModalInscribir materiaId={id} inscriptos={alumnos} onListo={listo} onCerrar={() => setModal(null)} />
      )}

      {modal?.tipo === 'desinscribir' && (
        <ModalConfirmar
          titulo="Desinscribir alumno"
          mensaje={<>¿Desinscribir a <b>{modal.alumno.nombre}</b> de {nombre}? Solo se puede si todavía no tiene notas en la materia.</>}
          textoBoton="Desinscribir"
          variante="danger"
          ruta={`/api/materias/${id}/alumnos/${modal.alumno._id}`}
          method="DELETE"
          mensajeExito="Alumno desinscripto"
          onListo={listo}
          onCerrar={() => setModal(null)}
        />
      )}

      {modal?.tipo === 'nueva-nota' && (
        <ModalCalificacion alumnos={alumnos} evaluaciones={listaEvaluaciones} onListo={listo} onCerrar={() => setModal(null)} />
      )}
    </Container>
  )
}
