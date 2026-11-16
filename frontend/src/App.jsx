import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SesionProvider } from './context/SesionContext'
import Menu from './components/Menu'
import RutaProtegida from './components/RutaProtegida'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Inicio from './pages/Inicio'
import NoEncontrada from './pages/NoEncontrada'
import MisCalificaciones from './pages/alumno/MisCalificaciones'
import DetalleCalificacion from './pages/alumno/DetalleCalificacion'

// Todas las rutas (vistas) de la aplicación
export default function App() {
  return (
    <SesionProvider>
      <BrowserRouter>
        <Menu />
        <Routes>
          {/* Públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* Cualquier usuario logueado */}
          <Route path="/" element={<RutaProtegida><Inicio /></RutaProtegida>} />

          {/* Alumno */}
          <Route path="/mis-calificaciones" element={<RutaProtegida roles={['alumno']}><MisCalificaciones /></RutaProtegida>} />
          <Route path="/mis-calificaciones/:id" element={<RutaProtegida roles={['alumno']}><DetalleCalificacion /></RutaProtegida>} />

          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </BrowserRouter>
    </SesionProvider>
  )
}
