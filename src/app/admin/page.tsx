// src/app/admin/page.tsx
import UserTable from "@/app/admin/UserTable";
import SpecialtyCreation from "@/app/admin/SpecialtyCreation";

export default function AdminPage() {
  return (
    <div className="max-w-6xl mx-auto mt-10 p-5 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-5 text-center">Gestión de Usuarios y Especialidades</h1>
      
      {/* Tabla de Usuarios */}
      <UserTable />

      {/* Crear Especialidad */}
      <SpecialtyCreation />
    </div>
  );
}
