"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import ProtectedRoute from "@/components/ProtectedRoute";

type Cita = {
  id: number;
  medico: { nombre: string };
  fecha: string;
  hora: string;
  disponibilidad: { horaInicio: string; horaFin: string };
};

export default function ClienteDashboard() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const res = await fetch("/api/citas/clientes", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) {
          throw new Error("Error al obtener las citas del cliente");
        }

        const data: Cita[] = await res.json();
        setCitas(data);
      } catch (err: unknown) {
        const error = err as Error;
        setError(error.message);
        Swal.fire({
           icon: "error",
           title: "Error",
           text: error.message || "Error al obtener citas",
           timer: 3000,
           timerProgressBar: true,
        });
     }     
    };

    fetchCitas();
  }, []);

  const handleCancelCita = async (citaId: number) => {
    try {
      const res = await fetch(`/api/citas/clientes/${citaId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      if (!res.ok) {
        throw new Error("Error al cancelar la cita");
      }
  
      Swal.fire({
        icon: "success",
        title: "Cita Cancelada",
        text: "La cita ha sido cancelada con éxito",
        timer: 3000,
        timerProgressBar: true,
      });
  
      setCitas((prevCitas) => prevCitas.filter((cita) => cita.id !== citaId));
    } catch (error) {
      console.error("Error al cancelar la cita:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cancelar la cita. Por favor intente de nuevo.",
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };
  
  return (
    <ProtectedRoute requiredRole="Cliente">
      <div className="max-w-4xl mx-auto mt-10 p-5 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-5 text-center">Mis Citas</h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {citas.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-3 border">Médico</th>
                <th className="p-3 border">Fecha</th>
                <th className="p-3 border">Hora</th>
                <th className="p-3 border">Horario</th>
                <th className="p-3 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {citas.map((cita) => (
                <tr key={cita.id} className="text-center">
                  <td className="p-3 border">{cita.medico.nombre}</td>
                  <td className="p-3 border">{new Date(cita.fecha).toLocaleDateString()}</td>
                  <td className="p-3 border">{new Date(cita.hora).toLocaleTimeString()}</td>
                  <td className="p-3 border">
                    {new Date(cita.disponibilidad.horaInicio).toLocaleTimeString()} -{" "}
                    {new Date(cita.disponibilidad.horaFin).toLocaleTimeString()}
                  </td>
                  <td className="p-3 border">
                    <button
                      onClick={() => handleCancelCita(cita.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-150 ease-in-out"
                    >
                      Cancelar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-600">No tienes citas programadas.</p>
        )}
      </div>
    </ProtectedRoute>
  );
}
