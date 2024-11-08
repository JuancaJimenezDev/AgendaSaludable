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
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        Swal.fire("No se encontró el token, redirigiendo al login");
        router.push("/login");
        return;
      }

      try {
        const payload: DecodedToken = JSON.parse(atob(token.split(".")[1]));

        if (Date.now() >= payload.exp * 1000) {
          Swal.fire("Token expirado, redirigiendo al login");
          localStorage.removeItem("token");
          router.push("/login");
        } else if (payload.rol !== requiredRole) {
          Swal.fire("No tienes permisos para acceder a esta página");
          router.push("/unauthorized");
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("token");
        router.push("/login");
      }
    }
  }, [requiredRole, router]);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return children;
};

export default ProtectedRoute;
