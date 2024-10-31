"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Calendar, { CalendarProps } from 'react-calendar'; // Importar los tipos correctos
import 'react-calendar/dist/Calendar.css';
import { jwtDecode } from 'jwt-decode'; // Decodificar el JWT para validar roles

// Tipos para los datos
interface Medico {
  id: number;
  nombre: string;
  especialidad: string;
  disponibilidad: Disponibilidad[];
}

interface Disponibilidad {
  id: number;
  fecha: string; // Formato de fecha YYYY-MM-DD
  horaInicio: string;
  horaFin: string;
}

interface Cita {
  id: number;
  fecha: string;
  hora: string;
  estado: string;
  medico: Medico | null; // Asegurarnos de que el médico puede ser nulo
}

// Componente protegido
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const router = useRouter();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      const decodedToken: any = jwtDecode(token);

      // Verificar si el usuario es un "Cliente"
      if (decodedToken.rol !== 'Cliente') {
        router.push('/unauthorized'); // Redirigir si no es cliente
      } else {
        setLoading(false);
      }
    }
  }, [router]);

  if (isLoading) return <div>Loading...</div>;

  return children;
};

export default function ClienteCitasPage() {
  const [doctores, setDoctores] = useState<Medico[]>([]); // Doctores disponibles
  const [disponibilidad, setDisponibilidad] = useState<Disponibilidad[]>([]); // Disponibilidad seleccionada
  const [selectedMedico, setSelectedMedico] = useState<number | null>(null); // Médico seleccionado
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // Aquí está la corrección para el tipo de Date
  const [horaInicio, setHoraInicio] = useState<string>(''); // Hora de la cita
  const [citas, setCitas] = useState<Cita[]>([]); // Citas del cliente
  const [diasDisponibles, setDiasDisponibles] = useState<Date[]>([]); // Días disponibles en el calendario
  const router = useRouter();

  // Obtener doctores disponibles y citas existentes
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');

      try {
        // Obtener doctores disponibles
        const resDoctores = await fetch('/api/auth/citas/clientes', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resDoctores.ok) {
          throw new Error('Error al obtener los doctores');
        }
        const doctoresData = await resDoctores.json();
        setDoctores(doctoresData);

        // Obtener citas del cliente
        const resCitas = await fetch('/api/auth/citas/clientes', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resCitas.ok) {
          throw new Error('Error al obtener citas');
        }
        const citasData = await resCitas.json();
        setCitas(citasData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  // Función para reservar cita
  const handleReservarCita = async () => {
    if (!selectedMedico || !selectedDate || !horaInicio) {
      alert('Por favor, selecciona un médico, fecha y horario.');
      return;
    }

    const token = localStorage.getItem('token');

    const res = await fetch('/api/auth/citas/clientes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        medicoId: selectedMedico,
        disponibilidadId: disponibilidad[0]?.id, // Asumiendo la primera disponibilidad válida
        fecha: selectedDate.toISOString().split('T')[0],
        hora: horaInicio,
      }),
    });

    if (res.ok) {
      alert('Cita reservada correctamente.');
      const nuevaCita = await res.json();
      setCitas((prev) => [...prev, nuevaCita]);
    } else {
      console.error('Error al reservar cita');
    }
  };

  // Función para cancelar cita
  const handleCancelarCita = async (id: number) => {
    const token = localStorage.getItem('token');

    const res = await fetch(`/api/auth/citas`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      alert('Cita cancelada.');
      setCitas((prev) => prev.filter((cita) => cita.id !== id));
    } else {
      console.error('Error al cancelar cita');
    }
  };

  // Seleccionar médico y cargar la disponibilidad
  const handleSelectMedico = (medicoId: number) => {
    setSelectedMedico(medicoId);
    const medico = doctores.find((doc) => doc.id === medicoId);
    if (medico) {
      setDisponibilidad(medico.disponibilidad);

      // Cargar los días disponibles en el calendario
      const diasDisponibles = medico.disponibilidad.map((disp) => new Date(disp.fecha));
      setDiasDisponibles(diasDisponibles);
    }
  };

  // Filtrar disponibilidad según la fecha seleccionada
  const disponibilidadFiltrada = disponibilidad.filter((disp) => {
    return selectedDate && disp.fecha === selectedDate.toISOString().split('T')[0];
  });

  // Manejar el cambio de fecha con el calendario
  const handleDateChange: CalendarProps['onChange'] = (value) => {
    if (Array.isArray(value)) {
      setSelectedDate(value[0]); // Si es un rango de fechas, selecciona la primera
    } else {
      setSelectedDate(value); // Si es solo una fecha
    }
  };

  // Agregar estilos especiales para los días con disponibilidad en el calendario
  const tileClassName = ({ date }: { date: Date }) => {
    return diasDisponibles.find((d) => d.toDateString() === date.toDateString())
      ? 'highlight' // Clase CSS para resaltar los días disponibles
      : '';
  };

  return (
    <ProtectedRoute>
      <div>
        <h1>Reservar Cita</h1>

        <h2>Doctores Disponibles</h2>
        <ul>
          {doctores.length > 0 ? (
            doctores.map((medico) => (
              <li key={medico.id} onClick={() => handleSelectMedico(medico.id)}>
                {medico.nombre} - {medico.especialidad}
              </li>
            ))
          ) : (
            <p>No hay doctores disponibles en este momento.</p>
          )}
        </ul>

        {selectedMedico && (
          <>
            <h2>Seleccionar Fecha</h2>
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              tileClassName={tileClassName} // Agregar clases personalizadas para los días con disponibilidad
            />

            <h2>Seleccionar Hora</h2>
            <ul>
              {disponibilidadFiltrada.length > 0 ? (
                disponibilidadFiltrada.map((disp) => (
                  <li key={disp.id}>
                    Desde: {new Date(disp.horaInicio).toLocaleTimeString()} - Hasta: {new Date(disp.horaFin).toLocaleTimeString()}
                    <input
                      type="time"
                      value={horaInicio}
                      onChange={(e) => setHoraInicio(e.target.value)}
                    />
                  </li>
                ))
              ) : (
                <p>No hay disponibilidad para este día.</p>
              )}
            </ul>

            <button onClick={handleReservarCita}>Reservar Cita</button>
          </>
        )}

        <h2>Mis Citas</h2>
        <ul>
          {citas.map((cita) => (
            <li key={cita.id}>
              {new Date(cita.fecha).toLocaleDateString()} - {new Date(cita.hora).toLocaleTimeString()} con{' '}
              {cita.medico ? cita.medico.nombre : 'Médico no encontrado'}
              <button onClick={() => handleCancelarCita(cita.id)}>Cancelar</button>
            </li>
          ))}
        </ul>

        <style jsx>{`
          .highlight {
            background-color: yellow;
          }
        `}</style>
      </div>
    </ProtectedRoute>
  );
}
