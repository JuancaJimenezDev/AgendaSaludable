'use client';  
import { useState } from "react";

export default function GestionCitas() {
  const [formData, setFormData] = useState({
    medico: "",
    tipoConsulta: "",
    horario: "",
    fecha: "",
    evaluaciones: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica para enviar la información al backend o almacenarla
    console.log("Cita creada:", formData);
  };

  const handleCancel = () => {
    setFormData({
      medico: "",
      tipoConsulta: "",
      horario: "",
      fecha: "",
      evaluaciones: "",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          Gestión de Citas
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Aquí podrás gestionar las citas: crear, cancelar y confirmar.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="medico"
              className="block text-sm font-medium text-gray-700"
            >
              Médico
            </label>
            <select
              id="medico"
              name="medico"
              value={formData.medico}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecciona un médico</option>
              <option value="medico1">Médico 1</option>
              <option value="medico2">Médico 2</option>
              <option value="medico3">Médico 3</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="tipoConsulta"
              className="block text-sm font-medium text-gray-700"
            >
              Tipo de Consulta
            </label>
            <input
              type="text"
              id="tipoConsulta"
              name="tipoConsulta"
              value={formData.tipoConsulta}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tipo de consulta"
            />
          </div>

          <div>
            <label
              htmlFor="horario"
              className="block text-sm font-medium text-gray-700"
            >
              Horario
            </label>
            <input
              type="time"
              id="horario"
              name="horario"
              value={formData.horario}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="fecha"
              className="block text-sm font-medium text-gray-700"
            >
              Fecha
            </label>
            <input
              type="date"
              id="fecha"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="evaluaciones"
              className="block text-sm font-medium text-gray-700"
            >
              Evaluaciones
            </label>
            <textarea
              id="evaluaciones"
              name="evaluaciones"
              value={formData.evaluaciones}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Escribe tus evaluaciones..."
            />
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Crear Cita
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
