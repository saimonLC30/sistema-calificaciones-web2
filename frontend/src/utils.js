// Funciones de ayuda para mostrar datos

// Las fechas se guardan en UTC: las mostramos en UTC para que no cambie el día
export function formatearFecha(fecha) {
  if (!fecha) return '-'
  return new Date(fecha).toLocaleDateString('es-AR', { timeZone: 'UTC' })
}

// "trabajo_practico" -> "Trabajo práctico"
const TIPOS = {
  parcial: 'Parcial',
  recuperatorio: 'Recuperatorio',
  trabajo_practico: 'Trabajo práctico',
  final: 'Final',
  oral: 'Oral',
  otro: 'Otro',
}

export function nombreTipo(tipo) {
  return TIPOS[tipo] || tipo
}
