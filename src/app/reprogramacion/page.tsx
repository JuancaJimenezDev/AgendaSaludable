'use client'

import { useState } from 'react'
import { useCitas, Cita } from './useCitas'
import { CalendarIcon, Clock, ArrowLeft } from "lucide-react"
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'

export default function ReprogramacionPage() {
  const { citas, cancelarCita, reprogramarCita } = useCitas()
  const [citaSeleccionada, setCitaSeleccionada] = useState<Cita | null>(null)
  const [nuevaFecha, setNuevaFecha] = useState<Date | undefined>(undefined)

  const handleReprogramar = () => {
    if (citaSeleccionada && nuevaFecha) {
      reprogramarCita(citaSeleccionada.id, nuevaFecha)
      setCitaSeleccionada(null)
      setNuevaFecha(undefined)
    }
  }

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <Link href="/" className="flex items-center text-blue-600 hover:underline mb-6">
        <ArrowLeft className="mr-2 h-5 w-5" />
        <span className="text-lg">Volver al inicio</span>
      </Link>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Reprogramación de Citas</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {citas.map(cita => (
          <div key={cita.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{cita.especialidad}</h2>
              <p className="text-gray-600 mb-4">{cita.doctor}</p>
              <div className="flex items-center mb-2 text-gray-700">
                <CalendarIcon className="mr-2 h-5 w-5" />
                <span>{format(cita.fecha, 'PPP', { locale: es })}</span>
              </div>
              <div className="flex items-center mb-4 text-gray-700">
                <Clock className="mr-2 h-5 w-5" />
                <span>{cita.hora}</span>
              </div>
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    setCitaSeleccionada(cita)
                    setNuevaFecha(new Date(cita.fecha.getTime() + 7 * 24 * 60 * 60 * 1000))
                    handleReprogramar()
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Reprogramar
                </button>
                <button
                  onClick={() => cancelarCita(cita.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}