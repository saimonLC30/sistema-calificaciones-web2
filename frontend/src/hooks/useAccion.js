// ─────────────────────────────────────────────────────────────
// Hook reutilizable para las acciones que MODIFICAN datos:
// POST (crear), PUT/PATCH (editar) y DELETE (eliminar).
// Maneja el "enviando..." y el mensaje de error de cada formulario.
// ─────────────────────────────────────────────────────────────
import { useState } from 'react'
import { apiFetch } from '../api/api'
import { useSesion } from '../context/SesionContext'

export function useAccion() {
  const { token } = useSesion()
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')

  async function ejecutar(ruta, { method, body } = {}) {
    setEnviando(true)
    setError('')
    try {
      return await apiFetch(ruta, { method, body, token })
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setEnviando(false)
    }
  }

  return { ejecutar, enviando, error }
}
