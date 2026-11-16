import { useState } from 'react'
import { Card, Form, Button, Spinner } from 'react-bootstrap'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useSesion } from '../context/SesionContext'
import MensajeError from '../components/MensajeError'
import { useTitulo } from '../hooks/useTitulo'

// Usuarios que crea el seed del backend (npm run seed), para probar rápido
const USUARIOS_DE_PRUEBA = [
  { rol: 'Admin', email: 'admin@mail.com' },
  { rol: 'Docente', email: 'gomez@mail.com' },
  { rol: 'Alumna', email: 'ana@mail.com' },
]

export default function Login() {
  useTitulo('Ingresar')
  const { usuario, iniciarSesion } = useSesion()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')

  // Si ya hay sesión, no tiene sentido mostrar el login
  if (usuario) return <Navigate to="/" replace />

  async function manejarEnvio(e) {
    e.preventDefault()
    setEnviando(true)
    setError('')
    try {
      await iniciarSesion(email, password)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  function completar(emailDePrueba) {
    setEmail(emailDePrueba)
    setPassword('123456')
  }

  return (
    <div className="pantalla-login px-3">
      <Card className="shadow-sm">
        <Card.Body className="p-4">
          <h2 className="mb-4">Ingresar</h2>

          <MensajeError mensaje={error} />

          <Form onSubmit={manejarEnvio}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </Form.Group>

            <Button type="submit" className="w-100" disabled={enviando}>
              {enviando ? <Spinner animation="border" size="sm" /> : 'Ingresar'}
            </Button>
          </Form>

          <p className="mt-3 mb-0 text-center">
            ¿No tenés cuenta? <Link to="/registro">Registrate</Link>
          </p>
        </Card.Body>
      </Card>

      <Card className="mt-3">
        <Card.Body>
          <small className="text-muted d-block mb-2">Usuarios de prueba (contraseña 123456):</small>
          <div className="d-flex gap-2 flex-wrap">
            {USUARIOS_DE_PRUEBA.map((u) => (
              <Button key={u.email} variant="outline-secondary" size="sm" onClick={() => completar(u.email)}>
                {u.rol}
              </Button>
            ))}
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}
