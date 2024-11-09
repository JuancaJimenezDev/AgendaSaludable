// src/app/layout.tsx
"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import "./globals.css";
import { useCallback } from "react";

interface LayoutProps {
  children: ReactNode;
}

type UserRole = "Medico" | "Cliente" | "Administrador";

export default function RootLayout({ children }: LayoutProps) {
  const [role, setRole] = useState<UserRole | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();


  const fetchRole = useCallback(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("userRole") as UserRole | null;
  
    if (token && storedRole) {
      setRole(storedRole);
      setIsAuthenticated(true);
    } else {
      setRole(null);
      setIsAuthenticated(false);
      router.push("/login");
    }
  }, [router]);
  
  useEffect(() => {
    fetchRole();
    window.addEventListener("storage", fetchRole);
    return () => {
      window.removeEventListener("storage", fetchRole);
    };
  }, [fetchRole]);
  

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
