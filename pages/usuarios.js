// pages/usuarios.js
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de que Bootstrap esté importado


const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [rol, setRol] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    const response = await fetch('/api/usuarios');
    const data = await response.json();
    setUsuarios(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingUserId) {
      await fetch(`/api/usuarios`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: editingUserId, nombre, correo, contraseña, rol }),
      });
    } else {
      await fetch(`/api/usuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, correo, contraseña, rol }),
      });
    }
    setNombre('');
    setCorreo('');
    setContraseña('');
    setRol('');
    setEditingUserId(null);
    fetchUsuarios();
  };

  const handleEdit = (usuario) => {
    setNombre(usuario.nombre);
    setCorreo(usuario.correo);
    setContraseña(usuario.contraseña);
    setRol(usuario.rol);
    setEditingUserId(usuario.id);
  };

  const handleDelete = async (id) => {
    await fetch(`/api/usuarios`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    fetchUsuarios();
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Lista de Usuarios</h1>
      <form className="mb-4" onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            className="form-control"
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <input
            className="form-control"
            type="email"
            placeholder="Correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <input
            className="form-control"
            type="password"
            placeholder="Contraseña"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <input
            className="form-control"
            type="text"
            placeholder="Rol"
            value={rol}
            onChange={(e) => setRol(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" type="submit">
          {editingUserId ? 'Actualizar' : 'Crear'}
        </button>
      </form>
      <ul className="list-group">
        {usuarios.map(usuario => (
          <li key={usuario.id} className="list-group-item d-flex justify-content-between align-items-center">
            {usuario.nombre} - {usuario.correo} - {usuario.rol}
            <div>
              <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(usuario)}>Editar</button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(usuario.id)}>Borrar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Usuarios;