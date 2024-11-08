// src/components/ProtectedRoute.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface DecodedToken {
  exp: number;
  rol: string;
}

interface ProtectedRouteProps {
  children: JSX.Element;
  requiredRole: string;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const [isLoading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Nuevo estado para el cierre de sesión
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      // Si no hay token y no estamos cerrando sesión, redirige al login
      if (!token && !isLoggingOut) {
        Swal.fire("No se encontró el token, redirigiendo al login");
        router.push("/login");
        return;
      }

      try {
        const payload: DecodedToken = JSON.parse(atob(token!.split(".")[1]));

        // Verifica si el token ha expirado
        if (Date.now() >= payload.exp * 1000) {
          Swal.fire("Token expirado, redirigiendo al login");
          localStorage.removeItem("token");
          setIsLoggingOut(true); // Cambia el estado para indicar que estamos cerrando sesión
          router.push("/login");
        } else if (payload.rol !== requiredRole) {
          // Si el rol no es el requerido, redirige a una página de "no autorizado"
          Swal.fire("No tienes permisos para acceder a esta página");
          router.push("/unauthorized");
        } else {
          // Si todo es correcto, termina la carga y muestra el contenido
          setLoading(false);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("token");
        router.push("/login");
      }
    }
  }, [requiredRole, router, isLoggingOut]);

  if (isLoading || isLoggingOut) {
    return <div>Cargando...</div>; // Muestra el mensaje de carga mientras se procesa la sesión
  }

  return children;
};

export default ProtectedRoute;
