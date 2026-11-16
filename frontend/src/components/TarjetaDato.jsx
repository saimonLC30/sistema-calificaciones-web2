import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'

// Un número destacado con su etiqueta (para el resumen del inicio).
// Si recibe "ruta", toda la tarjeta es un link.
export default function TarjetaDato({ valor, etiqueta, ruta, destacado = false }) {
  const contenido = (
    <Card className={`h-100 shadow-sm ${destacado ? 'border-warning' : ''}`}>
      <Card.Body>
        <div className="dato-valor">{valor ?? '…'}</div>
        <div className="text-muted">{etiqueta}</div>
      </Card.Body>
    </Card>
  )
  return ruta ? <Link to={ruta} className="text-decoration-none text-reset">{contenido}</Link> : contenido
}
