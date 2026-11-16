import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SesionProvider } from './context/SesionContext'
import Menu from './components/Menu'
import PiePagina from './components/PiePagina'
import RutaProtegida from './components/RutaProtegida'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Inicio from './pages/Inicio'
import NoEncontrada from './pages/NoEncontrada'
import MisCalificaciones from './pages/alumno/MisCalificaciones'
import DetalleCalificacion from './pages/alumno/DetalleCalificacion'
import MisMaterias from './pages/docente/MisMaterias'
import DetalleMateria from './pages/docente/DetalleMateria'
import Calificaciones from './pages/docente/Calificaciones'
import HistorialAlumno from './pages/docente/HistorialAlumno'
import DetalleCalificacionDocente from './pages/docente/DetalleCalificacionDocente'
import Usuarios from './pages/admin/Usuarios'
import Materias from './pages/admin/Materias'

const GESTION = ['docente', 'admin'] // roles que gestionan materias y notas

// Todas las rutas (vistas) de la aplicación
export default function App() {
  return (
    <SesionProvider>
      <BrowserRouter>
        <div className="app">
          <Menu />
          <main>
            <Routes>
              {/* Públicas */}
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />

              {/* Cualquier usuario logueado */}
              <Route path="/" element={<RutaProtegida><Inicio /></RutaProtegida>} />

              {/* Alumno */}
              <Route path="/mis-calificaciones" element={<RutaProtegida roles={['alumno']}><MisCalificaciones /></RutaProtegida>} />
              <Route path="/mis-calificaciones/:id" element={<RutaProtegida roles={['alumno']}><DetalleCalificacion /></RutaProtegida>} />

              {/* Docente (y admin) */}
              <Route path="/materias" element={<RutaProtegida roles={['docente']}><MisMaterias /></RutaProtegida>} />
              <Route path="/materias/:id" element={<RutaProtegida roles={GESTION}><DetalleMateria /></RutaProtegida>} />
              <Route path="/calificaciones" element={<RutaProtegida roles={GESTION}><Calificaciones /></RutaProtegida>} />
              <Route path="/calificaciones/:id" element={<RutaProtegida roles={GESTION}><DetalleCalificacionDocente /></RutaProtegida>} />
              <Route path="/alumnos/:id" element={<RutaProtegida roles={GESTION}><HistorialAlumno /></RutaProtegida>} />

              {/* Admin */}
              <Route path="/admin/usuarios" element={<RutaProtegida roles={['admin']}><Usuarios /></RutaProtegida>} />
              <Route path="/admin/materias" element={<RutaProtegida roles={['admin']}><Materias /></RutaProtegida>} />

              <Route path="*" element={<NoEncontrada />} />
            </Routes>
          </main>
          <PiePagina />
        </div>
      </BrowserRouter>
    </SesionProvider>
  )
}
