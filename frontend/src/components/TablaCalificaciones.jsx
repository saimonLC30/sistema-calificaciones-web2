import { Table } from 'react-bootstrap'
import EstadoBadge from './EstadoBadge'
import { formatearFecha, nombreTipo } from '../utils'

// Tabla de calificaciones reutilizable.
//   mostrarAlumno / mostrarMateria: qué columnas mostrar según la pantalla
//   acciones(calificacion): botones de la última columna (cada pantalla decide cuáles)
export default function TablaCalificaciones({ calificaciones, mostrarAlumno = false, mostrarMateria = true, acciones }) {
  if (calificaciones.length === 0) {
    return <p className="text-muted my-3">No hay calificaciones para mostrar.</p>
  }

  return (
    <Table striped bordered hover responsive className="bg-white align-middle">
      <thead>
        <tr>
          {mostrarAlumno && <th>Alumno</th>}
          {mostrarMateria && <th>Materia</th>}
          <th>Evaluación</th>
          <th>Tipo</th>
          <th>Fecha</th>
          <th>Nota</th>
          <th>Estado</th>
          {acciones && <th>Acciones</th>}
        </tr>
      </thead>
      <tbody>
        {calificaciones.map((c) => (
          <tr key={c._id}>
            {mostrarAlumno && <td>{c.alumno?.nombre}</td>}
            {mostrarMateria && <td>{c.materia?.nombre}</td>}
            <td>{c.evaluacion?.titulo}</td>
            <td>{nombreTipo(c.tipoEvaluacion)}</td>
            <td>{formatearFecha(c.fecha)}</td>
            <td><b>{c.nota}</b> / {c.evaluacion?.notaMaxima}</td>
            <td><EstadoBadge estado={c.estado} /></td>
            {acciones && <td className="text-nowrap">{acciones(c)}</td>}
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
