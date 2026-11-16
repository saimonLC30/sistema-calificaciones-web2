import { useState } from 'react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import TablaCalificaciones from '../TablaCalificaciones'
import ModalConfirmar from '../ModalConfirmar'
import ModalCorreccion from './ModalCorreccion'
import ModalAnular from './ModalAnular'

// Tabla de calificaciones con las acciones del docente/admin.
// Qué botones aparecen depende del estado de cada nota (igual que la máquina de estados del backend):
//   pendiente -> Publicar · Corregir · Anular · Eliminar
//   publicada -> Corregir · Anular
//   revisada  -> Corregir · Anular
//   anulada   -> (nada: es un estado final)
export default function GestionCalificaciones({ calificaciones, mostrarMateria = true, onCambio }) {
  // Qué acción está abierta: { tipo: 'publicar' | 'corregir' | 'anular' | 'eliminar', calificacion }
  const [accion, setAccion] = useState(null)

  function abrir(tipo, calificacion) {
    setAccion({ tipo, calificacion })
  }

  function listo(mensaje) {
    setAccion(null)
    onCambio(mensaje)
  }

  function botones(c) {
    return (
      <div className="d-flex gap-1 flex-wrap">
        <Button as={Link} to={`/calificaciones/${c._id}`} size="sm" variant="outline-secondary">Ver</Button>
        {c.estado === 'pendiente' && (
          <Button size="sm" variant="success" onClick={() => abrir('publicar', c)}>Publicar</Button>
        )}
        {c.estado !== 'anulada' && (
          <>
            <Button size="sm" variant="outline-primary" onClick={() => abrir('corregir', c)}>Corregir</Button>
            <Button size="sm" variant="outline-danger" onClick={() => abrir('anular', c)}>Anular</Button>
          </>
        )}
        {c.estado === 'pendiente' && (
          <Button size="sm" variant="danger" onClick={() => abrir('eliminar', c)}>Eliminar</Button>
        )}
      </div>
    )
  }

  const c = accion?.calificacion

  return (
    <>
      <TablaCalificaciones calificaciones={calificaciones} mostrarAlumno mostrarMateria={mostrarMateria} acciones={botones} />

      {accion?.tipo === 'publicar' && (
        <ModalConfirmar
          titulo="Publicar nota"
          mensaje={<>¿Publicar el <b>{c.nota}</b> de {c.alumno?.nombre} en {c.evaluacion?.titulo}? Desde ese momento el alumno la va a poder ver.</>}
          textoBoton="Publicar"
          variante="success"
          ruta={`/api/calificaciones/${c._id}/estado`}
          method="PATCH"
          body={{ estado: 'publicada' }}
          mensajeExito="Nota publicada: el alumno ya la puede ver"
          onListo={listo}
          onCerrar={() => setAccion(null)}
        />
      )}

      {accion?.tipo === 'eliminar' && (
        <ModalConfirmar
          titulo="Eliminar nota"
          mensaje={<>¿Eliminar la nota de {c.alumno?.nombre} en {c.evaluacion?.titulo}? Como todavía está pendiente, el alumno nunca la vio.</>}
          textoBoton="Eliminar"
          variante="danger"
          ruta={`/api/calificaciones/${c._id}`}
          method="DELETE"
          mensajeExito="Nota eliminada"
          onListo={listo}
          onCerrar={() => setAccion(null)}
        />
      )}

      {accion?.tipo === 'corregir' && <ModalCorreccion calificacion={c} onListo={listo} onCerrar={() => setAccion(null)} />}

      {accion?.tipo === 'anular' && <ModalAnular calificacion={c} onListo={listo} onCerrar={() => setAccion(null)} />}
    </>
  )
}
