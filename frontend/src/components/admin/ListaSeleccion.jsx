import { Form } from 'react-bootstrap'

// Lista de casillas para elegir varias personas (docentes de una materia, alumnos a inscribir).
// "seleccionados" es un array de ids; onCambiar recibe el array nuevo.
export default function ListaSeleccion({ personas, seleccionados, onCambiar }) {
  function alternar(id) {
    if (seleccionados.includes(id)) onCambiar(seleccionados.filter((s) => s !== id))
    else onCambiar([...seleccionados, id])
  }

  if (personas.length === 0) return <p className="text-muted mb-0">No hay nadie para elegir.</p>

  return (
    <div className="border rounded p-2" style={{ maxHeight: 220, overflowY: 'auto' }}>
      {personas.map((p) => (
        <Form.Check
          key={p.id}
          id={`persona-${p.id}`}
          type="checkbox"
          label={`${p.nombre} (${p.email})`}
          checked={seleccionados.includes(p.id)}
          onChange={() => alternar(p.id)}
        />
      ))}
    </div>
  )
}
