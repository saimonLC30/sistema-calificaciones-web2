import { useState } from 'react'
import { Card, Form, Button, Spinner } from 'react-bootstrap'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useSesion } from '../context/SesionContext'
import MensajeError from '../components/MensajeError'
import { useTitulo } from '../hooks/useTitulo'

// Registro público: el backend siempre crea la cuenta como alumno
export default function Registro() {
  useTitulo('Crear cuenta')
  const { usuario, registrarse } = useSesion()
  const navigate = useNavigate()

  const [formulario, setFormulario] = useState({ nombre: '', email: '', password: '' })
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')

  if (usuario) return <Navigate to="/" replace />

  // Un solo manejador para todos los campos (usa el "name" de cada input)
  function cambiar(e) {
    setFormulario({ ...formulario, [e.target.name]: e.target.value })
  }

  async function manejarEnvio(e) {
    e.preventDefault()
    setEnviando(true)
    setError('')
    try {
      await registrarse(formulario.nombre, formulario.email, formulario.password)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="pantalla-login px-3">
      <Card className="shadow-sm">
        <Card.Body className="p-4">
          <h2 className="mb-4">Crear cuenta</h2>

          <MensajeError mensaje={error} />

          <Form onSubmit={manejarEnvio}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre y apellido</Form.Label>
              <Form.Control name="nombre" value={formulario.nombre} onChange={cambiar} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={formulario.email} onChange={cambiar} required />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control type="password" name="password" value={formulario.password} onChange={cambiar} minLength={6} required />
              <Form.Text>Mínimo 6 caracteres.</Form.Text>
            </Form.Group>

            <Button type="submit" className="w-100" disabled={enviando}>
              {enviando ? <Spinner animation="border" size="sm" /> : 'Registrarme'}
            </Button>
          </Form>

          <p className="mt-3 mb-0 text-center">
            ¿Ya tenés cuenta? <Link to="/login">Ingresá</Link>
          </p>
        </Card.Body>
      </Card>
    </div>
  )
}
