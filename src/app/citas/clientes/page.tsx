"use client";

import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import Swal from "sweetalert2";
import ProtectedRoute from "@/components/ProtectedRoute";

interface Disponibilidad {
  id: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
}

interface Medico {
  id: number;
  nombre: string;
  especialidad: string;
  disponibilidad: Disponibilidad[];
}

export default function ClienteCitasPage() {
  const [doctores, setDoctores] = useState<Medico[]>([]);
  const [especialidades, setEspecialidades] = useState<string[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Medico[]>([]);
  const [selectedEspecialidad, setSelectedEspecialidad] = useState<string>("");
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Disponibilidad | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("/api/auth/citas/clientes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          console.error("Status Code:", res.status); // Imprime el código de estado
          console.error("Response Body:", await res.text()); // Imprime el cuerpo completo de la respuesta
          throw new Error("Error al obtener los doctores");
        }
        const data = await res.json();
        setDoctores(data);
      } catch (error) {
        Swal.fire("Error", "Error al obtener los doctores", "error");
      }
    };    
    fetchDoctors();
  }, []);

  const handleSelectEspecialidad = (event: SelectChangeEvent<string>) => {
    const especialidad = event.target.value;
    setSelectedEspecialidad(especialidad);
    setFilteredDoctors(doctores.filter((doctor) => doctor.especialidad === especialidad));
  };

  const handleSelectDoctor = (event: SelectChangeEvent<number>) => {
    const doctorId = Number(event.target.value);
    setSelectedDoctor(doctorId);
  };

  const handleDateClick = (arg: { dateStr: string }) => {
    const doctor = doctores.find((doc) => doc.id === selectedDoctor);
    if (doctor) {
      const disponibilidad = doctor.disponibilidad.find((slot) => slot.fecha.startsWith(arg.dateStr));
      if (disponibilidad) {
        setSelectedSlot(disponibilidad);
        setDialogOpen(true);
      } else {
        Swal.fire("Info", "No hay disponibilidad para esta fecha", "info");
      }
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedSlot || !selectedDoctor) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/auth/citas/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          medicoId: selectedDoctor,
          disponibilidadId: selectedSlot.id,
          fecha: selectedSlot.fecha,
          hora: selectedSlot.horaInicio,
        }),
      });

      if (res.ok) {
        Swal.fire("Cita Programada", "Tu cita ha sido programada exitosamente", "success");
        setDialogOpen(false);
      } else {
        Swal.fire("Error", "Error al programar la cita", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Error al programar la cita", "error");
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto mt-10 p-5 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-5 text-center">Programación de Citas Médicas</h1>
        <div className="flex justify-center mb-5">
          <Select value={selectedEspecialidad} onChange={handleSelectEspecialidad} displayEmpty fullWidth>
            <MenuItem value="" disabled>Seleccione Especialidad</MenuItem>
            {especialidades.map((especialidad, index) => (
              <MenuItem key={index} value={especialidad}>{especialidad}</MenuItem>
            ))}
          </Select>
          {selectedEspecialidad && (
            <Select value={selectedDoctor ?? ""} onChange={handleSelectDoctor} displayEmpty fullWidth>
              <MenuItem value="" disabled>Seleccione Doctor</MenuItem>
              {filteredDoctors.map((doctor) => (
                <MenuItem key={doctor.id} value={doctor.id}>{doctor.nombre}</MenuItem>
              ))}
            </Select>
          )}
        </div>

        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          dateClick={handleDateClick}
          events={filteredDoctors.flatMap((doctor) =>
            doctor.disponibilidad.map((slot) => ({
              title: `Disponible`,
              start: slot.fecha,
              end: slot.horaFin,
            }))
          )}
        />

        <Dialog open={isDialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>Confirmar Cita</DialogTitle>
          <DialogContent>
            <p>Fecha: {selectedSlot?.fecha}</p>
            <p>Hora: {selectedSlot?.horaInicio} - {selectedSlot?.horaFin}</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleBookAppointment} color="primary">Confirmar Cita</Button>
          </DialogActions>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
}
