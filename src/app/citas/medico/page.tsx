"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import Swal from "sweetalert2";
import ProtectedRoute from "@/components/ProtectedRoute";
import { format } from "date-fns";

interface Disponibilidad {
  id: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  ocupada?: boolean;
}

export default function CitasMedicoPage() {
  const [disponibilidad, setDisponibilidad] = useState<Disponibilidad[]>([]);
  const [selectedDisponibilidad, setSelectedDisponibilidad] = useState<Disponibilidad | null>(null);
  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) {
      Swal.fire("Error", "No se encontró el token de autenticación.", "error");
      return;
    }

    const fetchDisponibilidad = async () => {
      if (!token) {
        Swal.fire("Error", "No se encontró el token de autenticación", "error");
        return;
      }
      try {
        const res = await fetch("/api/disponibilidad", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data: Disponibilidad[] = await res.json();
          setDisponibilidad(data);
        } else {
          Swal.fire("Error", "Error al cargar disponibilidad", "error");
        }
      } catch {
        Swal.fire("Error", "Hubo un problema al intentar cargar la disponibilidad", "error");
      }
    };

    fetchDisponibilidad();
  }, [token]);

  const handleEventClick = (eventClickInfo: { event: { id: string } }) => {
    const selectedEvent = disponibilidad.find(
      (item) => item.id === parseInt(eventClickInfo.event.id)
    );
    if (selectedEvent) {
      setSelectedDisponibilidad(selectedEvent);
      setDialogOpen(true);
    }
  };

  const handleDeleteDisponibilidad = async () => {
    if (!selectedDisponibilidad || !token) return;

    try {
      const res = await fetch(`/api/disponibilidad/${selectedDisponibilidad.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        Swal.fire("Éxito", "Disponibilidad eliminada correctamente", "success");
        setDisponibilidad((prev) => prev.filter((item) => item.id !== selectedDisponibilidad.id));
        setDialogOpen(false);
      } else {
        const data = await res.json();
        Swal.fire("Error", data.error || "Error al eliminar disponibilidad", "error");
      }
    } catch {
      Swal.fire("Error", "Error de red al intentar eliminar disponibilidad", "error");
    }
  };

  return (
    <ProtectedRoute requiredRole="Medico">
      <div className="max-w-4xl mx-auto mt-10 p-5 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-5 text-center">Panel de Disponibilidad</h1>

        {disponibilidad.length > 0 ? (
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={disponibilidad.map((item) => ({
              id: item.id.toString(),
              title: item.ocupada ? "Reservado" : "Disponible",
              start: `${format(new Date(item.fecha), "yyyy-MM-dd")}T${format(new Date(item.horaInicio), "HH:mm:ss")}`,
              end: `${format(new Date(item.fecha), "yyyy-MM-dd")}T${format(new Date(item.horaFin), "HH:mm:ss")}`,
              backgroundColor: item.ocupada ? "#F87171" : "#34D399",
              borderColor: item.ocupada ? "#B91C1C" : "#10B981",
              textColor: "#ffffff",
            }))}
            eventClick={handleEventClick}
            height="auto"
            contentHeight={350}
            aspectRatio={1.3}
          />
        ) : (
          <p>No tienes disponibilidades registradas.</p>
        )}

        <Dialog open={isDialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>Detalles de la Disponibilidad</DialogTitle>
          <DialogContent>
            {selectedDisponibilidad ? (
              <p>
                Fecha: {format(new Date(selectedDisponibilidad.fecha), "dd/MM/yyyy")} <br />
                Hora: {format(new Date(selectedDisponibilidad.horaInicio), "HH:mm")} - {format(new Date(selectedDisponibilidad.horaFin), "HH:mm")}
              </p>
            ) : (
              <p>Información de disponibilidad no cargada.</p>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleDeleteDisponibilidad} color="secondary">
              Eliminar Disponibilidad
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
}
