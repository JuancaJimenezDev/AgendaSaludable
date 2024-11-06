"use client";

import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Select, MenuItem } from "@mui/material";
import Swal from "sweetalert2";
import ProtectedRoute from "@/components/ProtectedRoute";

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

  // Función para obtener especialidades al cargar el componente
  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        const res = await fetch("/api/especialidades");
        const data = await res.json();
        console.log("Especialidades:", data); // Verifica que los datos de especialidades están llegando
        setEspecialidades(data);
      } catch (error) {
        console.error("Error al obtener especialidades:", error);
      }
    };
    fetchEspecialidades();
  }, []);

  // Función para obtener médicos al seleccionar una especialidad
  useEffect(() => {
    const fetchMedicos = async () => {
      if (selectedEspecialidad) {
        try {
          const res = await fetch(`/api/doctores?especialidadId=${selectedEspecialidad}`);
          const data = await res.json();
          console.log("Médicos:", data); // Verifica que los datos de médicos están llegando
          setMedicos(data);
        } catch (error) {
          console.error("Error al obtener médicos:", error);
        }
      }
    };
    fetchMedicos();
  }, [selectedEspecialidad]);

  // Función para obtener disponibilidad al seleccionar un médico
  useEffect(() => {
    const fetchDisponibilidad = async () => {
      const token = localStorage.getItem("token");
      if (!token || !selectedMedico) return;

      try {
        const res = await fetch(`/api/disponibilidad?medicoId=${selectedMedico}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        console.log("Disponibilidad:", data); // Verifica que los datos de disponibilidad están llegando
        setDisponibilidad(data);
      } catch (error) {
        console.error("Error al obtener disponibilidad:", error);
      }
    };
    fetchDisponibilidad();
  }, [selectedMedico]);

  const handleEventClick = (eventClickInfo: any) => {
    const selectedEvent = disponibilidad.find((item) => item.id === parseInt(eventClickInfo.event.id));
    if (selectedEvent && !selectedEvent.ocupada) {
      setSelectedDisponibilidad(selectedEvent);
      setDialogOpen(true);
    } else {
      Swal.fire("Información", "Este horario ya ha sido reservado", "info");
    }
  };

  const handleAgendarCita = async () => {
    if (!selectedDisponibilidad) return;

    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire("Error", "No se encontró el token de autenticación.", "error");
      return;
    }

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

    if (res.ok) {
      Swal.fire("Éxito", "Cita agendada correctamente", "success");
      setDialogOpen(false);
      setDisponibilidad((prev) =>
        prev.map((item) => (item.id === selectedDisponibilidad.id ? { ...item, ocupada: true } : item))
      );
    } else {
      Swal.fire("Error", "Error al agendar la cita", "error");
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

        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={disponibilidad.map((item) => ({
            id: item.id.toString(),
            title: `Disponible: ${item.horaInicio} - ${item.horaFin}`,
            start: `${item.fecha}T${item.horaInicio}`,
            end: `${item.fecha}T${item.horaFin}`,
            backgroundColor: item.ocupada ? "#F87171" : "#34D399",
            borderColor: item.ocupada ? "#B91C1C" : "#10B981",
            textColor: "#ffffff",
          }))}
          eventClick={handleEventClick}
          height="auto"
          contentHeight={350}
          aspectRatio={1.3}
        />

        <Dialog open={isDialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>Confirmar Cita</DialogTitle>
          <DialogContent>
            <p>¿Deseas agendar la cita en el siguiente horario?</p>
            <p>
              Fecha: {selectedDisponibilidad?.fecha} <br />
              Hora: {selectedDisponibilidad?.horaInicio} - {selectedDisponibilidad?.horaFin}
            </p>
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
