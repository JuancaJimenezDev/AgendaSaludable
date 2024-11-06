// src/app/admin/layout.tsx
import ProtectedRoute from "@/components/ProtectedRoute";
import React from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="Administrador">
      <div className="admin-layout">
        {/* Aquí puedes agregar cualquier diseño específico para el área de administración */}
        {children}
      </div>
    </ProtectedRoute>
  );
}
