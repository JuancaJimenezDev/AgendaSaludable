"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      try {
        // Decodificar el token manualmente sin `jwt-decode`
        const payload: DecodedToken = JSON.parse(atob(token.split('.')[1]));

        if (Date.now() >= payload.exp * 1000) {
          localStorage.removeItem("token");
          router.push("/login");
        } else if (payload.rol !== requiredRole) {
          router.push("/unauthorized");
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error decodificando el token:", error);
        localStorage.removeItem("token");
        router.push("/login");
      }
    }
  }, [router, requiredRole]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return children;
};

export default ProtectedRoute;
