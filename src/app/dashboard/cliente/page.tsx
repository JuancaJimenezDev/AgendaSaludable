"use client"
import { useEffect, useState } from 'react';

type Cita = {
  id: number;
  medico: {
    nombre: string;
  };
  fecha: string;
  hora: string;
  disponibilidad: {
    horaInicio: string;
    horaFin: string;
  };
};

export default function ClienteCitas() {
  const [citas, setCitas] = useState<Cita[]>([]);  // Ajustamos el tipo de citas aquí
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const res = await fetch('/api/citas/cliente', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!res.ok) {
          throw new Error('Error al obtener las citas');
        }

        const data: Cita[] = await res.json();
        setCitas(data);
      } catch (err: any) {
        setError('Error obteniendo citas: ' + err.message);
      }
    };

    fetchCitas();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Citas Agendadas</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {citas.length === 0 ? (
        <p>No tienes citas agendadas</p>
      ) : (
        <ul>
          {citas.map((cita) => (
            <li key={cita.id} className="mb-2">
              <strong>Médico:</strong> {cita.medico.nombre} <br />
              <strong>Fecha:</strong> {new Date(cita.fecha).toLocaleDateString()} <br />
              <strong>Hora:</strong> {new Date(cita.hora).toLocaleTimeString()} <br />
              <strong>Disponibilidad:</strong> {new Date(cita.disponibilidad.horaInicio).toLocaleTimeString()} - {new Date(cita.disponibilidad.horaFin).toLocaleTimeString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
