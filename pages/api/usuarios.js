// // pages/api/usuarios.js
// import pool from '../../db';

// export default async function handler(req, res) {
//   if (req.method === 'GET') {
//     try {
//       const result = await pool.query('SELECT * FROM usuarios');
//       res.status(200).json(result.rows);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Error al obtener los usuarios' });
//     }
//   } else {
//     res.setHeader('Allow', ['GET']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }

// pages/api/usuarios.js
// pages/api/usuarios.js
import pool from '../../db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Leer todos los usuarios
    try {
      const result = await pool.query('SELECT * FROM usuarios');
      res.status(200).json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
  } else if (req.method === 'POST') {
    // Crear un nuevo usuario
    const { nombre, correo, contraseña,rol } = req.body; // Cambiado a 'correo'
    try {
      const result = await pool.query('INSERT INTO usuarios (nombre, correo, contraseña, rol) VALUES ($1, $2, $3, $4) RETURNING *', [nombre, correo, contraseña, rol]);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al crear el usuario' });
    }
  } else if (req.method === 'PUT') {
    // Actualizar un usuario
    const { id, nombre, correo, contraseña, rol } = req.body; // Cambiado a 'correo'
    try {
      const result = await pool.query('UPDATE usuarios SET nombre = $1, correo = $2, contraseña = $3, rol = $4 WHERE id = $5 RETURNING *', [nombre, correo, contraseña, rol, id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
  } else if (req.method === 'DELETE') {
    // Eliminar un usuario
    const { id } = req.body; // Asegúrate de que el cuerpo de la solicitud tenga este campo
    try {
      const result = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.status(204).end(); // No content
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}