'use client'
import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core"; // Importar desde @fullcalendar/core
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Select, MenuItem } from "@mui/material";
import Swal from "sweetalert2";
import ProtectedRoute from "@/components/ProtectedRoute";
import { format } from "date-fns";
import { useCallback } from "react";


interface Disponibilidad {
  id: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  ocupada?: boolean;
}

interface Medico {
  id: number;
  nombre: string;
}

interface Especialidad {
  id: number;
  nombre: string;
}

export default function CitasClientePage() {
  const [disponibilidad, setDisponibilidad] = useState<Disponibilidad[]>([]);
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [selectedEspecialidad, setSelectedEspecialidad] = useState<number | null>(null);
  const [selectedMedico, setSelectedMedico] = useState<number | null>(null);
  const [selectedDisponibilidad, setSelectedDisponibilidad] = useState<Disponibilidad | null>(null);
  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) {
      Swal.fire("Error", "No se encontró el token de autenticación.", "error");
      return;
    }

    const fetchEspecialidades = async () => {
      try {
        const res = await fetch("/api/especialidades", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al obtener especialidades");

        const data: Especialidad[] = await res.json();
        setEspecialidades(data);
      } catch (error: unknown) {
        const err = error as Error;
        Swal.fire("Error", err.message || "Error desconocido", "error");
      }
    };
    fetchEspecialidades();
  }, [token]);

  useEffect(() => {
    const fetchMedicos = async () => {
      if (selectedEspecialidad) {
        try {
          const res = await fetch(`/api/doctores?especialidadId=${selectedEspecialidad}`);
          if (!res.ok) throw new Error("Error al obtener médicos");

          const data: Medico[] = await res.json();
          setMedicos(data);
        } catch (error: unknown) {
          const err = error as Error;
          Swal.fire("Error", err.message || "Error desconocido", "error");
        }
      }
    };
    fetchMedicos();
  }, [selectedEspecialidad]);

  const fetchDisponibilidad = useCallback(async () => {
    if (!token) {
      Swal.fire("Error", "No se encontró el token de autenticación", "error");
      return;
    }
    if (!selectedMedico) {
      Swal.fire("Error", "El ID del médico no está seleccionado", "error");
      return;
    }
    try {
      const res = await fetch(`/api/disponibilidad?medicoId=${selectedMedico}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (res.ok) {
        const data: Disponibilidad[] = await res.json();
        setDisponibilidad(data);
      } else {
        Swal.fire("Error", "Error al cargar disponibilidad", "error");
      }
    } catch (error: unknown) {
      const err = error as Error;
      Swal.fire("Error", err.message || "Error de red", "error");
    }
  }, [token, selectedMedico]); // Añade token y selectedMedico como dependencias
  
  useEffect(() => {
    if (selectedMedico) {
      fetchDisponibilidad();
    }
  }, [selectedMedico, fetchDisponibilidad]);

  const handleEventClick = (eventClickInfo: EventClickArg) => {
    const selectedEvent = disponibilidad.find(
       (item) => item.id === parseInt(eventClickInfo.event.id)
    );
    if (selectedEvent && !selectedEvent.ocupada) {
       setSelectedDisponibilidad(selectedEvent);
       setDialogOpen(true);
    } else {
       Swal.fire("Información", "Este horario ya ha sido reservado", "info");
    }
 };

  const handleAgendarCita = async () => {
    if (!selectedDisponibilidad || !token) return;

    try {
      const res = await fetch("/api/citas/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          disponibilidadId: selectedDisponibilidad.id,
          fecha: selectedDisponibilidad.fecha,
          hora: selectedDisponibilidad.horaInicio,
        }),
      });

      if (res.status === 403) {
        Swal.fire("Error", "No tienes permisos para agendar una cita.", "error");
        return;
      }

      if (res.ok) {
        Swal.fire("Éxito", "Cita agendada correctamente", "success");
        setDialogOpen(false);
        setDisponibilidad((prev) =>
          prev.map((item) => (item.id === selectedDisponibilidad.id ? { ...item, ocupada: true } : item))
        );
      } else {
        Swal.fire("Error", "Error al agendar la cita", "error");
      }
    } catch (error: unknown) {
      const err = error as Error;
      Swal.fire("Error", err.message || "Error de red al intentar agendar la cita", "error");
    }
  };

  return (
    <ProtectedRoute requiredRole="Cliente">
      <div className="max-w-4xl mx-auto mt-10 p-5 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-5 text-center">Agendar Cita</h1>
        <div className="flex gap-4 mb-4">
          <Select
            value={selectedEspecialidad || ""}
            onChange={(e) => setSelectedEspecialidad(e.target.value as number)}
            displayEmpty
            fullWidth
            variant="outlined"
          >
            <MenuItem value="" disabled>Especialidad</MenuItem>
            {especialidades.map((especialidad) => (
              <MenuItem key={especialidad.id} value={especialidad.id}>{especialidad.nombre}</MenuItem>
            ))}
          </Select>

          <Select
            value={selectedMedico || ""}
            onChange={(e) => setSelectedMedico(e.target.value as number)}
            displayEmpty
            fullWidth
            variant="outlined"
            disabled={!selectedEspecialidad}
          >
            <MenuItem value="" disabled>Doctor</MenuItem>
            {medicos.map((medico) => (
              <MenuItem key={medico.id} value={medico.id}>{medico.nombre}</MenuItem>
            ))}
          </Select>
        </div>

        {selectedMedico && disponibilidad.length > 0 ? (
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={disponibilidad.map((item) => {
              const startDateTime = new Date(
                 `${format(new Date(item.fecha), "yyyy-MM-dd")}T${format(new Date(item.horaInicio), "HH:mm:ss")}`
              ).toISOString();
           
              const endDateTime = new Date(
                 `${format(new Date(item.fecha), "yyyy-MM-dd")}T${format(new Date(item.horaFin), "HH:mm:ss")}`
              ).toISOString();
           
              return {
                 id: item.id.toString(),
                 title: item.ocupada ? "Reservado" : `Disponible: ${format(new Date(item.horaInicio), "HH:mm")} - ${format(new Date(item.horaFin), "HH:mm")}`,
                 start: startDateTime,
                 end: endDateTime,
                 backgroundColor: item.ocupada ? "#F87171" : "#34D399",
                 borderColor: item.ocupada ? "#B91C1C" : "#10B981",
                 textColor: "#ffffff",
              };
           })}
           
            eventClick={handleEventClick}
            height="auto"
            contentHeight={350}
            aspectRatio={1.3}
          />
        ) : (
          <p>No hay disponibilidad para el médico seleccionado.</p>
        )}

        <Dialog open={isDialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>Confirmar Cita</DialogTitle>
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
            <Button onClick={handleAgendarCita} color="primary">
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
}
