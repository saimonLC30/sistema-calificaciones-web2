// ─────────────────────────────────────────────────────────────
// Hook reutilizable para traer datos del backend (GET).
// Devuelve { datos, cargando, error, recargar } y lo usan todas las pantallas
// que muestran información. Usa useState y useEffect.
// Si cambia la ruta (por ejemplo, al elegir un filtro), vuelve a pedir los datos.
// ─────────────────────────────────────────────────────────────
import { useEffect, useState } from 'react'
import { apiFetch } from '../api/api'
import { useSesion } from '../context/SesionContext'

export function useDatos(ruta) {
  const { token } = useSesion()
  const [version, setVersion] = useState(0)
  // "clave" identifica qué pedido es el último: la ruta + cuántas veces se recargó
  const clave = `${ruta}#${version}`
  const [resultado, setResultado] = useState({ clave: null, datos: null, error: '' })

  useEffect(() => {
    let cancelado = false // por si el componente se cierra antes de que llegue la respuesta

    apiFetch(ruta, { token })
      .then((datos) => {
        if (!cancelado) setResultado({ clave, datos, error: '' })
      })
      .catch((err) => {
        if (!cancelado) setResultado((anterior) => ({ clave, datos: anterior.datos, error: err.message }))
      })

    return () => {
      cancelado = true
    }
  }, [ruta, token, clave])

  return {
    datos: resultado.datos,
    cargando: resultado.clave !== clave, // todavía no llegó la respuesta del último pedido
    error: resultado.error,
    recargar: () => setVersion((v) => v + 1), // para volver a pedir los datos después de guardar algo
  }
}
