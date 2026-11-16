// ─────────────────────────────────────────────────────────────
// Hook reutilizable para traer datos del backend (GET).
// Devuelve { datos, cargando, error, recargar } y lo usan todas las pantallas
// que muestran información. Usa useState y useEffect.
// ─────────────────────────────────────────────────────────────
import { useEffect, useState } from 'react'
import { apiFetch } from '../api/api'
import { useSesion } from '../context/SesionContext'

export function useDatos(ruta) {
  const { token } = useSesion()
  const [datos, setDatos] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let cancelado = false // por si el componente se cierra antes de que llegue la respuesta

    apiFetch(ruta, { token })
      .then((respuesta) => {
        if (!cancelado) {
          setDatos(respuesta)
          setError('')
        }
      })
      .catch((err) => {
        if (!cancelado) setError(err.message)
      })
      .finally(() => {
        if (!cancelado) setCargando(false)
      })

    return () => {
      cancelado = true
    }
  }, [ruta, token, version])

  // Para volver a pedir los datos (por ejemplo, después de guardar algo)
  function recargar() {
    setCargando(true)
    setVersion((v) => v + 1)
  }

  return { datos, cargando, error, recargar }
}
