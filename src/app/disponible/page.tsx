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
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [horaInicio, setHoraInicio] = useState<string>("");
  const [horaFin, setHoraFin] = useState<string>("");
  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchDisponibilidad = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/auth/disponible", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setDisponibilidad(data);
      } else {
        Swal.fire("Error", "Error al obtener la disponibilidad", "error");
      }
    };
    fetchDisponibilidad();
  }, []);

  const handleDateClick = (arg: { dateStr: string }) => {
    setSelectedDate(arg.dateStr);
    setDialogOpen(true);
  };

  const handleAgregarDisponibilidad = async () => {
    if (!selectedDate || !horaInicio || !horaFin) {
      Swal.fire("Advertencia", "Por favor, selecciona una fecha y horarios válidos", "warning");
      return;
    }
    const token = localStorage.getItem("token");
    const res = await fetch("/api/auth/disponible", {
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
  };

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto mt-10 p-5 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-5 text-center">Gestión de Disponibilidad</h1>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          dateClick={handleDateClick}
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
          <DialogTitle>Agregar Disponibilidad</DialogTitle>
          <DialogContent>
            <div>
              <TextField
                label="Fecha seleccionada"
                value={selectedDate || ""}
                fullWidth
                InputProps={{ readOnly: true }}
                margin="dense"
              />
              <TextField
                label="Hora de Inicio"
                type="time"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                fullWidth
                margin="dense"
              />
              <TextField
                label="Hora de Fin"
                type="time"
                value={horaFin}
                onChange={(e) => setHoraFin(e.target.value)}
                fullWidth
                margin="dense"
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleAgregarDisponibilidad} color="primary">
              Agregar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
}
