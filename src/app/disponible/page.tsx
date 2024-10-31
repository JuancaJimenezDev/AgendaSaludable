"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// Definir el tipo de los elementos de disponibilidad
interface Disponibilidad {
  id: number;
  fecha: string; // Podría ser Date pero en este caso es más probable que venga como string desde la API
  horaInicio: string;
  horaFin: string;
}

export default function DisponibilidadPage() {
  // Estados para almacenar la fecha y las horas de inicio/fin
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [horaInicio, setHoraInicio] = useState<string>(''); // Estado para la hora de inicio
  const [horaFin, setHoraFin] = useState<string>(''); // Estado para la hora de fin
  const [disponibilidad, setDisponibilidad] = useState<Disponibilidad[]>([]); // Estado tipado correctamente
  const [editing, setEditing] = useState<boolean>(false); // Estado para editar
  const [editId, setEditId] = useState<number | null>(null); // ID para editar
  const router = useRouter();

  // Efecto para cargar la disponibilidad existente
  useEffect(() => {
    const fetchDisponibilidad = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/auth/disponible', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setDisponibilidad(data);
      } else {
        console.error('Error al obtener la disponibilidad');
      }
    };

    fetchDisponibilidad();
  }, []);

  // Función para agregar o editar disponibilidad
  const handleAgregarDisponibilidad = async () => {
    if (!selectedDate || !horaInicio || !horaFin) {
      alert('Por favor, selecciona una fecha y horarios válidos');
      return;
    }

    const token = localStorage.getItem('token');
    const url = editing ? `/api/auth/disponible?id=${editId}` : '/api/auth/disponible';
    const method = editing ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: editId,
        fecha: selectedDate.toISOString().split('T')[0], // Formato de fecha YYYY-MM-DD
        horaInicio,
        horaFin,
      }),
    });

    if (res.ok) {
      alert(editing ? 'Disponibilidad actualizada' : 'Disponibilidad agregada');
      setHoraInicio('');
      setHoraFin('');
      setSelectedDate(null);
      setEditing(false);
      setEditId(null);
      const updatedData = await res.json();
      setDisponibilidad((prev) =>
        editing ? prev.map((item) => (item.id === editId ? updatedData : item)) : [...prev, updatedData]
      );
    } else {
      console.error('Error al procesar la disponibilidad');
    }
  };

  // Función para eliminar disponibilidad
  const handleEliminarDisponibilidad = async (id: number) => {
    const token = localStorage.getItem('token');

    const res = await fetch('/api/auth/disponible', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setDisponibilidad(disponibilidad.filter((item) => item.id !== id));
    } else {
      console.error('Error al eliminar la disponibilidad');
    }
  };

  // Función para editar disponibilidad
  const handleEditar = (item: Disponibilidad) => {
    setEditing(true);
    setEditId(item.id);
    setSelectedDate(new Date(item.fecha));
    setHoraInicio(item.horaInicio.split('T')[1].slice(0, 5)); // Convertir a HH:MM
    setHoraFin(item.horaFin.split('T')[1].slice(0, 5)); // Convertir a HH:MM
  };

  return (
    <ProtectedRoute>
      <div>
        <h1>Gestión de Disponibilidad</h1>

        {/* Calendario para seleccionar la fecha */}
        <Calendar
          onChange={(value) => {
            if (Array.isArray(value)) {
              setSelectedDate(value[0]);
            } else {
              setSelectedDate(value);
            }
          }}
          value={selectedDate}
        />

        {selectedDate && (
          <div>
            <h2>{editing ? 'Editar Horarios para' : 'Seleccionar Horarios para'} {selectedDate.toDateString()}</h2>
            <label>
              Hora de inicio:
              <input
                type="time"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
              />
            </label>
            <label>
              Hora de fin:
              <input
                type="time"
                value={horaFin}
                onChange={(e) => setHoraFin(e.target.value)}
              />
            </label>
            <button onClick={handleAgregarDisponibilidad}>
              {editing ? 'Actualizar Disponibilidad' : 'Agregar Disponibilidad'}
            </button>
          </div>
        )}

        <h2>Disponibilidad Actual</h2>
        <ul>
          {disponibilidad.map((item) => (
            <li key={item.id}>
              {new Date(item.fecha).toLocaleDateString()} - Desde: {new Date(item.horaInicio).toLocaleTimeString()} 
              hasta: {new Date(item.horaFin).toLocaleTimeString()}
              <button onClick={() => handleEditar(item)}>Editar</button>
              <button onClick={() => handleEliminarDisponibilidad(item.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      </div>
    </ProtectedRoute>
  );
}
