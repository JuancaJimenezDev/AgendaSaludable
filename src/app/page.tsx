// src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";

export default function HomePage() {
  const [user, setUser] = useState<{ nombre: string; rol: string } | null>(null);

  useEffect(() => {
    // Intentar obtener información del usuario desde el token almacenado
    const token = localStorage.getItem("token");
    if (token) {
      // Hacer una solicitud al backend para obtener la información del usuario
      fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            Swal.fire("Error", "No se pudo autenticar al usuario.", "error");
          } else {
            setUser(data);
          }
        })
        .catch(() => Swal.fire("Error", "Error al cargar el usuario.", "error"));
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-6">Bienvenido a la Plataforma de Gestión Médica</h1>
      
      {user ? (
        <p className="text-lg mb-4">Hola, {user.nombre}. Has iniciado sesión como <strong>{user.rol}</strong>.</p>
      ) : (
        <p className="text-lg mb-4">Por favor, <Link href="/login" className="text-blue-500">inicia sesión</Link> para acceder a las funciones.</p>
      )}

      <div className="flex gap-4 mt-6">
        {user ? (
          <>
            {user.rol === "Administrador" && (
              <Link href="/admin" className="bg-blue-500 text-white px-4 py-2 rounded">Panel de Administración</Link>
            )}
            {user.rol === "Medico" && (
              <Link href="/citas/medico" className="bg-green-500 text-white px-4 py-2 rounded">Mis Citas y Disponibilidad</Link>
            )}
            {user.rol === "Cliente" && (
              <Link href="/citas/clientes" className="bg-indigo-500 text-white px-4 py-2 rounded">Agendar Cita</Link>
            )}
          </>
        ) : (
          <Link href="/register" className="bg-gray-500 text-white px-4 py-2 rounded">Registrarse</Link>
        )}
      </div>
    </div>
  );
}
