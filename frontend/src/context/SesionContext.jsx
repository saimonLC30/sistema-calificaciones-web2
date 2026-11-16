// ─────────────────────────────────────────────────────────────
// Sesión del usuario: quién está logueado y su token.
// Funciona igual que el CarritoContext del ejemplo de la materia:
// un Context que cualquier componente puede leer con useSesion().
// La sesión se guarda en localStorage para no perderla al recargar.
// ─────────────────────────────────────────────────────────────
import { createContext, useContext, useEffect, useState } from 'react'
import { apiFetch } from '../api/api'

const SesionContext = createContext()
const CLAVE = 'sesion'

function leerSesionGuardada() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE))
  } catch {
    return null
  }
}

export function SesionProvider({ children }) {
  // sesion = { token, usuario: { id, nombre, email, rol } } o null
  const [sesion, setSesion] = useState(leerSesionGuardada)

  function guardarSesion(nueva) {
    setSesion(nueva)
    if (nueva) localStorage.setItem(CLAVE, JSON.stringify(nueva))
    else localStorage.removeItem(CLAVE)
  }

  async function iniciarSesion(email, password) {
    const datos = await apiFetch('/api/auth/login', { method: 'POST', body: { email, password } })
    guardarSesion({ token: datos.token, usuario: datos.user })
    return datos.user
  }

  async function registrarse(nombre, email, password) {
    const datos = await apiFetch('/api/auth/register', { method: 'POST', body: { nombre, email, password } })
    guardarSesion({ token: datos.token, usuario: datos.user })
    return datos.user
  }

  function cerrarSesion() {
    guardarSesion(null)
  }

  // Si el backend responde 401 (token vencido), se cierra la sesión sola
  useEffect(() => {
    function alExpirar() {
      setSesion(null)
      localStorage.removeItem(CLAVE)
    }
    window.addEventListener('sesion-expirada', alExpirar)
    return () => window.removeEventListener('sesion-expirada', alExpirar)
  }, [])

  return (
    <SesionContext.Provider
      value={{
        usuario: sesion?.usuario ?? null,
        token: sesion?.token ?? null,
        iniciarSesion,
        registrarse,
        cerrarSesion,
      }}
    >
      {children}
    </SesionContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSesion() {
  return useContext(SesionContext)
}
