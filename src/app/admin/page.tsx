"use client";

import { useEffect, useState } from "react";
import { Select, MenuItem, Button, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import Swal from "sweetalert2";

interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
}

export default function AdminPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);

  // Cargar usuarios
  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const res = await fetch("/api/admin/usuarios", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setUsuarios(data);
    setLoading(false);
  };

  const handleRolChange = async (userId: number, nuevoRol: string) => {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/admin/usuarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, nuevoRol }),
    });

    if (res.ok) {
      Swal.fire("Éxito", "Rol actualizado correctamente", "success");
      fetchUsuarios(); // Refresca la lista de usuarios
    } else {
      Swal.fire("Error", "No se pudo actualizar el rol", "error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-5 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-5 text-center">Gestión de Usuarios</h1>
      {loading ? (
        <p>Cargando usuarios...</p>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((usuario) => (
              <TableRow key={usuario.id}>
                <TableCell>{usuario.nombre}</TableCell>
                <TableCell>{usuario.correo}</TableCell>
                <TableCell>
                  <Select
                    value={usuario.rol}
                    onChange={(e) => handleRolChange(usuario.id, e.target.value)}
                  >
                    <MenuItem value="Cliente">Cliente</MenuItem>
                    <MenuItem value="Medico">Medico</MenuItem>
                    <MenuItem value="Administrador">Administrador</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleRolChange(usuario.id, usuario.rol)}>
                    Guardar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
