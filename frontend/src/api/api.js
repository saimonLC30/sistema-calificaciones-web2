// ─────────────────────────────────────────────────────────────
// Conexión con el backend (la API de Programación II).
// Todas las llamadas pasan por apiFetch: arma la URL, manda el token
// y convierte los errores del backend en un Error con su mensaje.
// ─────────────────────────────────────────────────────────────
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export async function apiFetch(ruta, { method = 'GET', body, token } = {}) {
  let respuesta

  try {
    respuesta = await fetch(API_URL + ruta, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new Error('No se pudo conectar con el servidor. ¿Está corriendo el backend (npm run dev)?')
  }

  const datos = await respuesta.json().catch(() => ({}))

  if (!respuesta.ok) {
    // Token vencido o inválido: avisamos para que se cierre la sesión
    if (respuesta.status === 401 && token) {
      window.dispatchEvent(new Event('sesion-expirada'))
    }
    const error = new Error(datos.message || 'Ocurrió un error inesperado')
    error.status = respuesta.status
    throw error
  }

  return datos
}
