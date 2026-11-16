import { useState } from 'react'
import { Container, Row, Col, Form } from 'react-bootstrap'
import { useSearchParams } from 'react-router-dom'
import { useDatos } from '../../hooks/useDatos'
import Cargando from '../../components/Cargando'
import MensajeError from '../../components/MensajeError'
import MensajeExito from '../../components/MensajeExito'
import GestionCalificaciones from '../../components/docente/GestionCalificaciones'
import { TIPOS_EVALUACION, nombreTipo } from '../../utils'
import { useTitulo } from '../../hooks/useTitulo'

const ESTADOS = ['pendiente', 'publicada', 'revisada', 'anulada']

// Todas las calificaciones que puede ver el usuario, con filtros.
// Docente: las de sus materias. Admin: todas. (Lo decide el backend.)
// Los filtros se mandan como parámetros: GET /api/calificaciones?materia=...&estado=...&tipo=...
export default function Calificaciones() {
  useTitulo('Calificaciones')
  // Los filtros pueden venir en la URL (ej: desde el inicio, /calificaciones?estado=pendiente)
  const [parametrosUrl] = useSearchParams()
  const [filtros, setFiltros] = useState({
    materia: parametrosUrl.get('materia') ?? '',
    estado: parametrosUrl.get('estado') ?? '',
    tipo: parametrosUrl.get('tipo') ?? '',
  })
  const [mensaje, setMensaje] = useState('')

  // Arma "?materia=...&estado=..." solo con los filtros elegidos
  const parametros = new URLSearchParams({ limite: 100 })
  Object.entries(filtros).forEach(([clave, valor]) => {
    if (valor) parametros.set(clave, valor)
  })

  const materias = useDatos('/api/materias')
  const calificaciones = useDatos(`/api/calificaciones?${parametros}`)

  function cambiarFiltro(e) {
    setFiltros({ ...filtros, [e.target.name]: e.target.value })
  }

  function listo(texto) {
    setMensaje(texto)
    calificaciones.recargar()
  }

  return (
    <Container className="py-4">
      <h2>Calificaciones</h2>

      <MensajeExito mensaje={mensaje} onCerrar={() => setMensaje('')} />

      <Row className="my-3 g-2">
        <Col md={4}>
          <Form.Select name="materia" value={filtros.materia} onChange={cambiarFiltro}>
            <option value="">Todas las materias</option>
            {materias.datos?.resultados.map((m) => (
              <option key={m._id} value={m._id}>{m.nombre} ({m.periodo})</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Select name="estado" value={filtros.estado} onChange={cambiarFiltro}>
            <option value="">Todos los estados</option>
            {ESTADOS.map((estado) => (
              <option key={estado} value={estado}>{estado}</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Select name="tipo" value={filtros.tipo} onChange={cambiarFiltro}>
            <option value="">Todos los tipos</option>
            {TIPOS_EVALUACION.map((tipo) => (
              <option key={tipo} value={tipo}>{nombreTipo(tipo)}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      <MensajeError mensaje={calificaciones.error} />
      {calificaciones.cargando && <Cargando />}
      {calificaciones.datos && !calificaciones.cargando && (
        <>
          <p className="text-muted">{calificaciones.datos.total} calificación(es)</p>
          <GestionCalificaciones calificaciones={calificaciones.datos.resultados} onCambio={listo} />
        </>
      )}
    </Container>
  )
}
