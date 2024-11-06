"use client";

import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import Swal from "sweetalert2";
import ProtectedRoute from "@/components/ProtectedRoute";

interface Disponibilidad {
  id: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
}

export default function DisponibilidadPage() {
  const [disponibilidad, setDisponibilidad] = useState<Disponibilidad[]>([]);
  const [selectedDisponibilidad, setSelectedDisponibilidad] = useState<Disponibilidad | null>(null);
  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [horaInicio, setHoraInicio] = useState<string>("");
  const [horaFin, setHoraFin] = useState<string>("");

  const fetchDisponibilidad = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire("Error", "No se encontró el token. Por favor, inicia sesión.", "error");
      return;
    }

    try {
      const res = await fetch("/api/disponibilidad", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const data = await res.json();
        setDisponibilidad(data);
      } else {
        const errorData = await res.json();
        Swal.fire("Error", errorData.error || "Error al obtener la disponibilidad", "error");
      }
    } catch (error) {
      console.error("Error al obtener la disponibilidad:", error);
      Swal.fire("Error", "Hubo un problema al conectarse con el servidor", "error");
    }
  };

  useEffect(() => {
    fetchDisponibilidad();
  }, []);

  const handleDateClick = (arg: { dateStr: string }) => {
    setSelectedDate(arg.dateStr);
    setHoraInicio("");
    setHoraFin("");
    setSelectedDisponibilidad(null); // Limpiar la selección previa
    setDialogOpen(true);
  };

  const handleEventClick = (eventClickInfo: any) => {
    const selectedEvent = disponibilidad.find((item) => item.id === parseInt(eventClickInfo.event.id));
    if (selectedEvent) {
      setSelectedDisponibilidad(selectedEvent);
      setSelectedDate(selectedEvent.fecha);
      setHoraInicio(selectedEvent.horaInicio);
      setHoraFin(selectedEvent.horaFin);
      setDialogOpen(true);
    }
  };

  const handleAgregarDisponibilidad = async () => {
    if (!selectedDate || !horaInicio || !horaFin) {
      Swal.fire("Advertencia", "Por favor, selecciona una fecha y horarios válidos", "warning");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire("Error", "No se encontró el token. Por favor, inicia sesión.", "error");
      return;
    }

    try {
      const res = await fetch("/api/disponibilidad", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fecha: selectedDate, horaInicio, horaFin }),
      });

      if (res.ok) {
        const newDisponibilidad = await res.json();
        setDisponibilidad((prev) => [...prev, newDisponibilidad]);
        Swal.fire("Éxito", "Disponibilidad agregada correctamente", "success");
        setDialogOpen(false);
      } else {
        const errorData = await res.json();
        Swal.fire("Error", errorData.error || "Error al agregar disponibilidad", "error");
      }
    } catch (error) {
      console.error("Error al agregar disponibilidad:", error);
      Swal.fire("Error", "Hubo un problema al conectarse con el servidor", "error");
    }
  };

  const handleEditarDisponibilidad = async () => {
    if (!selectedDisponibilidad || !selectedDate || !horaInicio || !horaFin) return;

    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire("Error", "No se encontró el token. Por favor, inicia sesión.", "error");
      return;
    }

    try {
      const res = await fetch(`/api/disponibilidad/${selectedDisponibilidad.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fecha: selectedDate, horaInicio, horaFin }),
      });

      if (res.ok) {
        const updatedDisponibilidad = await res.json();
        setDisponibilidad((prev) =>
          prev.map((item) => (item.id === updatedDisponibilidad.id ? updatedDisponibilidad : item))
        );
        Swal.fire("Éxito", "Disponibilidad actualizada correctamente", "success");
        setDialogOpen(false);
      } else {
        const errorData = await res.json();
        Swal.fire("Error", errorData.error || "Error al actualizar la disponibilidad", "error");
      }
    } catch (error) {
      console.error("Error al actualizar disponibilidad:", error);
      Swal.fire("Error", "Hubo un problema al conectarse con el servidor", "error");
    }
  };

  const handleEliminarDisponibilidad = async () => {
    if (!selectedDisponibilidad) return;

    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire("Error", "No se encontró el token. Por favor, inicia sesión.", "error");
      return;
    }

    try {
      const res = await fetch(`/api/disponibilidad/${selectedDisponibilidad.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setDisponibilidad((prev) =>
          prev.filter((item) => item.id !== selectedDisponibilidad.id)
        );
        Swal.fire("Éxito", "Disponibilidad eliminada correctamente", "success");
        setDialogOpen(false);
      } else {
        const errorData = await res.json();
        Swal.fire("Error", errorData.error || "Error al eliminar disponibilidad", "error");
      }
    } catch (error) {
      console.error("Error al eliminar disponibilidad:", error);
      Swal.fire("Error", "Hubo un problema al conectarse con el servidor", "error");
    }
  };

  return (
    <ProtectedRoute requiredRole="Medico">
      <div className="max-w-4xl mx-auto mt-10 p-5 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-5 text-center">Gestión de Disponibilidad</h1>

        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          events={disponibilidad.map((item) => ({
            id: item.id.toString(),
            title: `Disponible: ${item.horaInicio} - ${item.horaFin}`,
            start: `${item.fecha}T${item.horaInicio}`,
            end: `${item.fecha}T${item.horaFin}`,
            backgroundColor: "#34D399",
            borderColor: "#10B981",
            textColor: "#ffffff",
          }))}
          height="auto"
          contentHeight={350}
          aspectRatio={1.3}
        />

        <Dialog open={isDialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>{selectedDisponibilidad ? "Editar Disponibilidad" : "Agregar Disponibilidad"}</DialogTitle>
          <DialogContent>
            <TextField label="Fecha seleccionada" value={selectedDate || ""} fullWidth InputProps={{ readOnly: true }} margin="dense" />
            <TextField label="Hora de Inicio" type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} fullWidth margin="dense" />
            <TextField label="Hora de Fin" type="time" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} fullWidth margin="dense" />
          </DialogContent>
          <DialogActions>
            {selectedDisponibilidad ? (
              <>
                <Button onClick={handleEliminarDisponibilidad} color="secondary">Eliminar</Button>
                <Button onClick={handleEditarDisponibilidad} color="primary">Actualizar</Button>
              </>
            ) : (
              <Button onClick={handleAgregarDisponibilidad} color="primary">Agregar</Button>
            )}
            <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          </DialogActions>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
}
