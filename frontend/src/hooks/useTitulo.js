import { useEffect } from 'react'

// Cambia el título de la pestaña del navegador según la pantalla
export function useTitulo(titulo) {
  useEffect(() => {
    document.title = titulo ? `${titulo} · Calificaciones` : 'Sistema de Calificaciones'
  }, [titulo])
}
