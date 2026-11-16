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

// Opciones para los <select> de tipo de evaluación
export const TIPOS_EVALUACION = Object.keys(TIPOS)

// Para un <input type="date">: "2026-09-15T00:00:00.000Z" -> "2026-09-15"
export function fechaParaInput(fecha) {
  return fecha ? String(fecha).slice(0, 10) : ''
}

export function hoy() {
  return new Date().toISOString().slice(0, 10)
}
