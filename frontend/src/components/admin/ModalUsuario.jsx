import { useState } from 'react'
import { Modal, Form, Button, Spinner } from 'react-bootstrap'
import { useAccion } from '../../hooks/useAccion'
import MensajeError from '../MensajeError'

// Formulario para CREAR un usuario con cualquier rol (POST /api/usuarios).
// Así el admin da de alta a los docentes (el registro público solo crea alumnos).
export default function ModalUsuario({ onListo, onCerrar }) {
  const { ejecutar, enviando, error } = useAccion()
  const [formulario, setFormulario] = useState({ nombre: '', email: '', password: '', rol: 'docente' })

  function cambiar(e) {
    setFormulario({ ...formulario, [e.target.name]: e.target.value })
  }

  async function guardar(e) {
    e.preventDefault()
    try {
      await ejecutar('/api/usuarios', { method: 'POST', body: formulario })
      onListo(`Usuario ${formulario.nombre} creado como ${formulario.rol}`)
    } catch {
      // el error se muestra en el formulario
    }
  }

  return (
    <Modal show onHide={onCerrar} centered>
      <Form onSubmit={guardar}>
        <Modal.Header closeButton>
          <Modal.Title>Nuevo usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <MensajeError mensaje={error} />

          <Form.Group className="mb-3">
            <Form.Label>Nombre y apellido</Form.Label>
            <Form.Control name="nombre" value={formulario.nombre} onChange={cambiar} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" value={formulario.email} onChange={cambiar} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Contraseña inicial</Form.Label>
            <Form.Control type="password" name="password" value={formulario.password} onChange={cambiar} minLength={6} required />
          </Form.Group>
          <Form.Group>
            <Form.Label>Rol</Form.Label>
            <Form.Select name="rol" value={formulario.rol} onChange={cambiar}>
              <option value="docente">Docente</option>
              <option value="alumno">Alumno</option>
              <option value="admin">Administrador</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onCerrar}>Cancelar</Button>
          <Button type="submit" disabled={enviando}>
            {enviando ? <Spinner animation="border" size="sm" /> : 'Crear'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
