import { Spinner } from 'react-bootstrap'

// Indicador de "cargando" que se reutiliza en todas las pantallas
export default function Cargando({ texto = 'Cargando...' }) {
  return (
    <div className="d-flex align-items-center gap-2 my-4">
      <Spinner animation="border" size="sm" /> {texto}
    </div>
  )
}
