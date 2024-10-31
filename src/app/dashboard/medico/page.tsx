"use client"
import { useEffect, useState } from 'react';

type Cita = {
  id: number;
  cliente: {
    nombre: string;
  };
  fecha: string;
  hora: string;
  disponibilidad: {
    horaInicio: string;
    horaFin: string;
  };
};

export default function MedicoCitas() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const res = await fetch('/api/citas/medico', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!res.ok) {
          throw new Error('Error al obtener las citas');
        }

        const data: Cita[] = await res.json();
        setCitas(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchCitas();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Citas del Médico</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {citas.map((cita) => (
          <li key={cita.id} className="mb-4">
            <strong>Cliente:</strong> {cita.cliente.nombre} <br />
            <strong>Fecha:</strong> {new Date(cita.fecha).toLocaleDateString()} <br />
            <strong>Hora:</strong> {new Date(cita.hora).toLocaleTimeString()} <br />
            <strong>Disponibilidad:</strong> {new Date(cita.disponibilidad.horaInicio).toLocaleTimeString()} a {new Date(cita.disponibilidad.horaFin).toLocaleTimeString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
