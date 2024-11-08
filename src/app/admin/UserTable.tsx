// src/app/admin/UserTable.tsx
"use client"; // Agrega esta línea al inicio del archivo

import { useEffect, useState } from "react";
import { Select, MenuItem, Button, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import Swal from "sweetalert2";

interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
  especialidadId?: number;
  especialidad?: { nombre: string };
}

interface Especialidad {
  id: number;
  nombre: string;
}

export default function UserTable() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsuarios();
    fetchEspecialidades();
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

  const fetchEspecialidades = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/admin/especialidades", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setEspecialidades(data);
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
      fetchUsuarios();
    } else {
      Swal.fire("Error", "No se pudo actualizar el rol", "error");
    }
  };

  const handleEspecialidadChange = async (userId: number, especialidadId: number) => {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/admin/especialidades", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, especialidadId }),
    });

    if (res.ok) {
      Swal.fire("Éxito", "Especialidad asignada correctamente", "success");
      fetchUsuarios();
    } else {
      Swal.fire("Error", "No se pudo asignar la especialidad", "error");
    }
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Nombre</TableCell>
          <TableCell>Correo</TableCell>
          <TableCell>Rol</TableCell>
          <TableCell>Especialidad</TableCell>
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
              {usuario.rol === "Medico" ? (
                <Select
                  value={usuario.especialidadId || ""}
                  onChange={(e) => handleEspecialidadChange(usuario.id, Number(e.target.value))}
                  displayEmpty
                >
                  <MenuItem value="">Sin especialidad</MenuItem>
                  {especialidades.map((especialidad) => (
                    <MenuItem key={especialidad.id} value={especialidad.id}>
                      {especialidad.nombre}
                    </MenuItem>
                  ))}
                </Select>
              ) : (
                <p>N/A</p>
              )}
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
  );
}
