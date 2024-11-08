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
  const router = useRouter();

  useEffect(() => {
    const fetchRole = () => {
      const token = localStorage.getItem("token");
      const storedRole = localStorage.getItem("userRole") as UserRole | null;

      if (token && storedRole) {
        setRole(storedRole);
      } else {
        router.push("/login");
      }
    };

    fetchRole();
    window.addEventListener("storage", fetchRole);

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
      <body>
        {role && <Navbar userRole={role} />}
        <main>{children}</main>
      </body>
    </html>
  );
}
