import { useState } from 'react'
import { Container, Row, Col, Form, Button, Table, Badge } from 'react-bootstrap'
import { useDatos } from '../../hooks/useDatos'
import { useSesion } from '../../context/SesionContext'
import Cargando from '../../components/Cargando'
import MensajeError from '../../components/MensajeError'
import MensajeExito from '../../components/MensajeExito'
import ModalUsuario from '../../components/admin/ModalUsuario'
import ModalRol from '../../components/admin/ModalRol'
import { useTitulo } from '../../hooks/useTitulo'

const COLORES_ROL = { admin: 'danger', docente: 'primary', alumno: 'success' }

// Gestión de usuarios (solo admin): listar, buscar, crear y cambiar roles.
// GET /api/usuarios?rol=...&q=...
export default function Usuarios() {
  useTitulo('Usuarios')
  const { usuario: yo } = useSesion()
  const [rol, setRol] = useState('')
  const [texto, setTexto] = useState('') // lo que se escribe en el buscador
  const [busqueda, setBusqueda] = useState('') // lo que se busca al apretar "Buscar"
  const [mensaje, setMensaje] = useState('')
  const [modal, setModal] = useState(null) // { tipo: 'nuevo' | 'rol', usuario? }

  const parametros = new URLSearchParams({ limite: 100 })
  if (rol) parametros.set('rol', rol)
  if (busqueda) parametros.set('q', busqueda)
  const { datos, error, cargando, recargar } = useDatos(`/api/usuarios?${parametros}`)

  function buscar(e) {
    e.preventDefault()
    setBusqueda(texto.trim())
  }

  function listo(textoMensaje) {
    setModal(null)
    setMensaje(textoMensaje)
    recargar()
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Usuarios</h2>
        <Button onClick={() => setModal({ tipo: 'nuevo' })}>+ Nuevo usuario</Button>
      </div>

      <MensajeExito mensaje={mensaje} onCerrar={() => setMensaje('')} />

      <Form onSubmit={buscar}>
        <Row className="my-3 g-2">
          <Col md={4}>
            <Form.Select value={rol} onChange={(e) => setRol(e.target.value)}>
              <option value="">Todos los roles</option>
              <option value="alumno">Alumnos</option>
              <option value="docente">Docentes</option>
              <option value="admin">Administradores</option>
            </Form.Select>
          </Col>
          <Col md={6}>
            <Form.Control placeholder="Buscar por nombre o email" value={texto} onChange={(e) => setTexto(e.target.value)} />
          </Col>
          <Col md={2}>
            <Button type="submit" variant="outline-primary" className="w-100">Buscar</Button>
          </Col>
        </Row>
      </Form>

      <MensajeError mensaje={error} />
      {cargando && <Cargando />}

      {datos && !cargando && (
        <Table striped bordered hover responsive className="bg-white align-middle">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {datos.resultados.map((u) => (
              <tr key={u.id}>
                <td>{u.nombre}</td>
                <td>{u.email}</td>
                <td><Badge bg={COLORES_ROL[u.rol]}>{u.rol}</Badge></td>
                <td>
                  {/* El backend no deja que el admin se cambie su propio rol */}
                  {u.id !== yo.id && (
                    <Button size="sm" variant="outline-secondary" onClick={() => setModal({ tipo: 'rol', usuario: u })}>
                      Cambiar rol
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {modal?.tipo === 'nuevo' && <ModalUsuario onListo={listo} onCerrar={() => setModal(null)} />}
      {modal?.tipo === 'rol' && <ModalRol usuario={modal.usuario} onListo={listo} onCerrar={() => setModal(null)} />}
    </Container>
  )
}
