import { useState } from 'react'
import { Modal, Form, Button, Spinner } from 'react-bootstrap'
import { useAccion } from '../../hooks/useAccion'
import MensajeError from '../MensajeError'

// Cambiar el rol de un usuario (PATCH /api/usuarios/:id/rol)
export default function ModalRol({ usuario, onListo, onCerrar }) {
  const { ejecutar, enviando, error } = useAccion()
  const [rol, setRol] = useState(usuario.rol)

  async function guardar(e) {
    e.preventDefault()
    try {
      await ejecutar(`/api/usuarios/${usuario.id}/rol`, { method: 'PATCH', body: { rol } })
      onListo(`${usuario.nombre} ahora es ${rol}`)
    } catch {
      // el error se muestra en el formulario
    }
  }

  return (
    <Modal show onHide={onCerrar} centered>
      <Form onSubmit={guardar}>
        <Modal.Header closeButton>
          <Modal.Title>Cambiar rol</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><b>{usuario.nombre}</b> · {usuario.email}</p>
          <MensajeError mensaje={error} />
          <Form.Select value={rol} onChange={(e) => setRol(e.target.value)}>
            <option value="alumno">Alumno</option>
            <option value="docente">Docente</option>
            <option value="admin">Administrador</option>
          </Form.Select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onCerrar}>Cancelar</Button>
          <Button type="submit" disabled={enviando || rol === usuario.rol}>
            {enviando ? <Spinner animation="border" size="sm" /> : 'Guardar'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
