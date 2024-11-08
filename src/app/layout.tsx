// src/app/layout.tsx
"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import "./globals.css";

interface LayoutProps {
  children: ReactNode;
}

type UserRole = "Medico" | "Cliente" | "Administrador";

export default function RootLayout({ children }: LayoutProps) {
  const [role, setRole] = useState<UserRole | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Función para verificar el token y el rol
  const fetchRole = () => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("userRole") as UserRole | null;

    if (token && storedRole) {
      setRole(storedRole);
      setIsAuthenticated(true); // Marca al usuario como autenticado
    } else {
      setRole(null);
      setIsAuthenticated(false);
      router.push("/login"); // Redirige al login si no hay token o rol
    }
  };

  useEffect(() => {
    // Verificar el rol al cargar el componente
    fetchRole();

    // Escuchar eventos de cambios en `localStorage`
    window.addEventListener("storage", fetchRole);

    // Limpieza del evento al desmontar el componente
    return () => {
      window.removeEventListener("storage", fetchRole);
    };
  }, [router]);

  return (
    <html lang="es">
      <head>
        <title>Agenda Saludable</title>
        <meta name="description" content="Aplicación de gestión de citas médicas" />
      </head>
      <body className="bg-background-color text-text-color font-sans">
        {/* Renderizar Navbar solo si el usuario está autenticado y tiene un rol */}
        {isAuthenticated && role && <Navbar userRole={role} />}
        <main>{children}</main>
      </body>
    </html>
  );
}
