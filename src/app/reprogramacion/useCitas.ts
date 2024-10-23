'use client'

import { useState } from 'react'

export interface Cita {
  id: number
  fecha: Date
  hora: string
  doctor: string
  especialidad: string
}

export function useCitas() {
  const [citas, setCitas] = useState<Cita[]>([
    { id: 1, fecha: new Date(2024, 9, 20), hora: '10:00', doctor: 'Dra. García', especialidad: 'Cardiología' },
    { id: 2, fecha: new Date(2024, 9, 22), hora: '15:30', doctor: 'Dr. Martínez', especialidad: 'Dermatología' },
    { id: 3, fecha: new Date(2024, 9, 25), hora: '09:15', doctor: 'Dr. López', especialidad: 'Pediatría' },
  ])

  const cancelarCita = (id: number) => {
    setCitas(citas.filter(cita => cita.id !== id))
  }

  const reprogramarCita = (id: number, nuevaFecha: Date) => {
    setCitas(citas.map(cita => 
      cita.id === id ? { ...cita, fecha: nuevaFecha } : cita
    ))
  }

  return { citas, cancelarCita, reprogramarCita }
}