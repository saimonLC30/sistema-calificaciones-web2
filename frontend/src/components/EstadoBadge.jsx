import { Badge } from 'react-bootstrap'

// Cada estado de una calificación con su color
const COLORES = {
  pendiente: 'secondary',
  publicada: 'success',
  revisada: 'info',
  anulada: 'danger',
}

export default function EstadoBadge({ estado }) {
  return <Badge bg={COLORES[estado] || 'secondary'}>{estado}</Badge>
}
