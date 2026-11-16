import { useState } from 'react'
import { Modal, Button, Spinner } from 'react-bootstrap'
import { useAccion } from '../../hooks/useAccion'
import { useDatos } from '../../hooks/useDatos'
import MensajeError from '../MensajeError'
import Cargando from '../Cargando'
import ListaSeleccion from './ListaSeleccion'

// INSCRIBIR alumnos en una materia (POST /api/materias/:id/alumnos).
// Muestra solo los alumnos que todavía no están inscriptos.
export default function ModalInscribir({ materiaId, inscriptos, onListo, onCerrar }) {
  const { ejecutar, enviando, error } = useAccion()
  const alumnos = useDatos('/api/usuarios?rol=alumno&limite=100')
  const [elegidos, setElegidos] = useState([])

  const idsInscriptos = inscriptos.map((a) => a._id)
  const disponibles = alumnos.datos?.resultados.filter((a) => !idsInscriptos.includes(a.id)) ?? []

  async function inscribir() {
    try {
      await ejecutar(`/api/materias/${materiaId}/alumnos`, { method: 'POST', body: { alumnos: elegidos } })
      onListo(`${elegidos.length} alumno(s) inscripto(s)`)
    } catch {
      // el error se muestra en la ventana
    }
  }

  return (
    <Modal show onHide={onCerrar} centered>
      <Modal.Header closeButton>
        <Modal.Title>Inscribir alumnos</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <MensajeError mensaje={error} />
        {alumnos.datos ? (
          <ListaSeleccion personas={disponibles} seleccionados={elegidos} onCambiar={setElegidos} />
        ) : (
          <Cargando texto="Cargando alumnos..." />
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCerrar}>Cancelar</Button>
        <Button onClick={inscribir} disabled={enviando || elegidos.length === 0}>
          {enviando ? <Spinner animation="border" size="sm" /> : `Inscribir (${elegidos.length})`}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
