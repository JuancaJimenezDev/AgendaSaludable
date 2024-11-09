'use client';  
export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Dashboard de Administración
        </h2>

        <div className="space-y-8">
          {/* Sección de Citas Programadas */}
          <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
            <h3 className="text-xl font-medium text-gray-700 mb-2">Citas Programadas</h3>
            <p className="text-gray-500">
              No hay citas programadas por el momento.
            </p>
          </div>

          {/* Sección de Doctores Disponibles */}
          <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
            <h3 className="text-xl font-medium text-gray-700 mb-2">Doctores Disponibles</h3>
            <p className="text-gray-500">
              Actualmente no hay médicos disponibles en el sistema.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
