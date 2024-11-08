"use client";

import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import Swal from "sweetalert2";
import { format } from "date-fns";

interface Disponibilidad {
  id: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  ocupada?: boolean;
}

export default function DisponibilidadPage() {
  const [disponibilidades, setDisponibilidades] = useState<Disponibilidad[]>([]);
  const [fecha, setFecha] = useState<string>("");
  const [horaInicio, setHoraInicio] = useState<string>("");
  const [horaFin, setHoraFin] = useState<string>("");
  const [isDialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchDisponibilidad(token);
    } else {
      Swal.fire("Error", "No se encontró el token de autenticación", "error");
    }
  }, []);
  
  const fetchDisponibilidad = async (token: string) => {
    try {
      const resDisponibilidad = await fetch("/api/disponibilidad", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (resDisponibilidad.ok) {
        const data = await resDisponibilidad.json();
        setDisponibilidades(data); // Actualiza el estado con las disponibilidades obtenidas
      } else {
        const errorData = await resDisponibilidad.json();
        throw new Error(errorData.error || "Error al cargar disponibilidad");
      }
    } catch (error: any) {
      console.error("Error fetching disponibilidad:", error);
      Swal.fire("Error", error.message || "Hubo un problema al conectar con el servidor", "error");
    }
  };

  const handleDateClick = (arg: any) => {
    setFecha(arg.dateStr);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFecha("");
    setHoraInicio("");
    setHoraFin("");
  };

  const handleGuardarDisponibilidad = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire("Error", "No se encontró el token de autenticación", "error");
      return;
    }

    if (!fecha || !horaInicio || !horaFin) {
      Swal.fire("Error", "Por favor, completa todos los campos", "error");
      return;
    }

    // Verificar si ya existe una disponibilidad en el mismo día y horario
    const existeDisponibilidad = disponibilidades.some(
      (disp) =>
        disp.fecha === fecha &&
        disp.horaInicio === horaInicio &&
        disp.horaFin === horaFin
    );

    if (existeDisponibilidad) {
      Swal.fire("Error", "Ya existe una disponibilidad en el mismo horario", "error");
      return;
    }

    try {
      const res = await fetch("/api/disponibilidad", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fecha, horaInicio, horaFin }),
      });

      if (res.ok) {
        await fetchDisponibilidad(token); // Recarga las disponibilidades después de añadir una nueva
        Swal.fire("Éxito", "Disponibilidad agregada correctamente", "success");
        handleCloseDialog();
      } else {
        const errorData = await res.json();
        Swal.fire("Error", errorData.error || "Error al guardar disponibilidad", "error");
      }
    } catch (error: any) {
      Swal.fire("Error", error.message || "Hubo un problema al conectar con el servidor", "error");
      console.error("Error al guardar disponibilidad:", error);
    }
  };

  return (
    <div className="container mx-auto mt-5">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Disponibilidad de Médicos</h2>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={disponibilidades.map((item) => {
          const startDateTime = `${format(new Date(item.fecha), "yyyy-MM-dd")}T${format(new Date(item.horaInicio), "HH:mm:ss")}`;
          const endDateTime = `${format(new Date(item.fecha), "yyyy-MM-dd")}T${format(new Date(item.horaFin), "HH:mm:ss")}`;

          return {
            id: item.id.toString(),
            title: item.ocupada ? "Reservado" : "Disponible",
            start: startDateTime,
            end: endDateTime,
            backgroundColor: item.ocupada ? "#F87171" : "#34D399",
            borderColor: item.ocupada ? "#B91C1C" : "#10B981",
            textColor: "#ffffff",
          };
        })}
        dateClick={handleDateClick}
        height="auto"
        contentHeight={350}
        aspectRatio={1.3}
      />

      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Añadir Disponibilidad</DialogTitle>
        <DialogContent>
          <TextField
            type="date"
            label="Fecha"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            fullWidth
            margin="dense"
          />
          <TextField
            type="time"
            label="Hora de Inicio"
            value={horaInicio}
            onChange={(e) => setHoraInicio(e.target.value)}
            fullWidth
            margin="dense"
          />
          <TextField
            type="time"
            label="Hora de Fin"
            value={horaFin}
            onChange={(e) => setHoraFin(e.target.value)}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleGuardarDisponibilidad} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
