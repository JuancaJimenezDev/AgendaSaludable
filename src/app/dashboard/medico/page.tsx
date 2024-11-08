"use client";
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

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

type Disponibilidad = {
  id: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  ocupada: boolean;
};

export default function MedicoCitas() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [disponibilidades, setDisponibilidades] = useState<Disponibilidad[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const citasRes = await fetch('/api/citas/medico', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!citasRes.ok) throw new Error('Error al obtener las citas');
        const citasData: Cita[] = await citasRes.json();
        setCitas(citasData);

        const disponibilidadRes = await fetch('/api/disponibilidad', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!disponibilidadRes.ok) throw new Error('Error al obtener disponibilidades');
        const disponibilidadData: Disponibilidad[] = await disponibilidadRes.json();
        setDisponibilidades(disponibilidadData);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  const handleCancelDisponibilidad = async (disponibilidadId: number) => {
    try {
      const res = await fetch(`/api/disponibilidad/${disponibilidadId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
    
      if (!res.ok) throw new Error('Error al cancelar la disponibilidad');
    
      Swal.fire({
        icon: 'success',
        title: 'Disponibilidad Cancelada',
        text: 'La disponibilidad ha sido cancelada con éxito.',
        timer: 3000,
        timerProgressBar: true,
      });
    
      setDisponibilidades((prev) => prev.filter((disp) => disp.id !== disponibilidadId));
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'No se pudo cancelar la disponibilidad. Por favor intente de nuevo.',
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-5 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Citas del Médico</h1>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Citas Table */}
      <h2 className="text-xl font-semibold mt-6 mb-4">Citas con Clientes</h2>
      <table className="w-full border-collapse table-auto mb-8">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3 border text-left">Cliente</th>
            <th className="p-3 border text-left">Fecha</th>
            <th className="p-3 border text-left">Hora</th>
            <th className="p-3 border text-left">Horario de Disponibilidad</th>
          </tr>
        </thead>
        <tbody>
          {citas.map((cita, index) => (
            <tr key={cita.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
              <td className="p-3 border">{cita.cliente.nombre}</td>
              <td className="p-3 border">{new Date(cita.fecha).toLocaleDateString()}</td>
              <td className="p-3 border">{new Date(cita.hora).toLocaleTimeString()}</td>
              <td className="p-3 border">
                {new Date(cita.disponibilidad.horaInicio).toLocaleTimeString()} - {new Date(cita.disponibilidad.horaFin).toLocaleTimeString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Disponibilidades Table */}
      <h2 className="text-xl font-semibold mb-4">Disponibilidades</h2>
      <table className="w-full border-collapse table-auto">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3 border text-left">Fecha</th>
            <th className="p-3 border text-left">Horario</th>
            <th className="p-3 border text-left">Estado</th>
            <th className="p-3 border text-center">Acción</th>
          </tr>
        </thead>
        <tbody>
          {disponibilidades.map((disp, index) => (
            <tr key={disp.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
              <td className="p-3 border">{new Date(disp.fecha).toLocaleDateString()}</td>
              <td className="p-3 border">
                {new Date(disp.horaInicio).toLocaleTimeString()} - {new Date(disp.horaFin).toLocaleTimeString()}
              </td>
              <td className="p-3 border">
                <span className={`px-2 py-1 rounded ${disp.ocupada ? "bg-gray-500 text-white" : "bg-green-500 text-white"}`}>
                  {disp.ocupada ? "No Disponible" : "Disponible"}
                </span>
              </td>
              <td className="p-3 border text-center">
                {!disp.ocupada && (
                  <button
                    onClick={() => handleCancelDisponibilidad(disp.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-150 ease-in-out"
                  >
                    Cancelar Disponibilidad
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
