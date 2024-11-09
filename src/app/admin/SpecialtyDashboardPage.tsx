'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import Swal from 'sweetalert2';

interface Especialidad {
  id: number;
  nombre: string;
}

export default function SpecialtyDashboardPage() {
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedEspecialidad, setSelectedEspecialidad] = useState<Especialidad | null>(null);
  const [newEspecialidadName, setNewEspecialidadName] = useState('');

  useEffect(() => {
    fetchEspecialidades();
  }, []);

  const fetchEspecialidades = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/admin/especialidades', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data: Especialidad[] = await res.json();
      setEspecialidades(data);
    } else {
      Swal.fire('Error', 'No se pudieron cargar las especialidades', 'error');
    }
  };

  const handleEditClick = (especialidad: Especialidad) => {
    setSelectedEspecialidad(especialidad);
    setNewEspecialidadName(especialidad.nombre);
    setEditDialogOpen(true);
  };

  const handleDeleteEspecialidad = async (especialidadId: number) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/admin/especialidades/${especialidadId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      Swal.fire('Eliminado', 'La especialidad ha sido eliminada correctamente', 'success');
      setEspecialidades((prev) => prev.filter((esp) => esp.id !== especialidadId));
    } else {
      Swal.fire('Error', 'No se pudo eliminar la especialidad', 'error');
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedEspecialidad) return;

    const token = localStorage.getItem('token');
    const res = await fetch(`/api/admin/especialidades/${selectedEspecialidad.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nombre: newEspecialidadName }),
    });

    if (res.ok) {
      Swal.fire('Actualizado', 'La especialidad ha sido actualizada correctamente', 'success');
      setEspecialidades((prev) =>
        prev.map((esp) =>
          esp.id === selectedEspecialidad.id ? { ...esp, nombre: newEspecialidadName } : esp
        )
      );
      setEditDialogOpen(false);
    } else {
      Swal.fire('Error', 'No se pudo actualizar la especialidad', 'error');
    }
  };

  return (
    <div className="container mx-auto mt-5">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Gestión de Especialidades</h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {especialidades.map((especialidad) => (
            <TableRow key={especialidad.id}>
              <TableCell>{especialidad.id}</TableCell>
              <TableCell>{especialidad.nombre}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleEditClick(especialidad)}
                >
                  Editar
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDeleteEspecialidad(especialidad.id)}
                  style={{ marginLeft: '10px' }}
                >
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Editar Especialidad</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre de la Especialidad"
            value={newEspecialidadName}
            onChange={(e) => setNewEspecialidadName(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSaveEdit} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
