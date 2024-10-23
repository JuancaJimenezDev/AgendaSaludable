"use client";  // Asegura que el componente se ejecute en el lado del cliente

import { useRouter } from 'next/navigation';  // Cambia a 'next/navigation' para usar el nuevo sistema de navegación
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';  // Sin destructuración

interface DecodedToken {
  exp: number;
  [key: string]: any;
}

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const [isLoading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login'); // Redirige si no está autenticado
    } else {
      try {
        const decodedToken: DecodedToken = jwtDecode(token);
        // Verifica si el token ha expirado
        if (Date.now() > decodedToken.exp * 1000) {
          localStorage.removeItem('token');
          router.push('/auth/login');
        } else {
          setLoading(false); // Permite el acceso a la ruta protegida
        }
      } catch (error) {
        localStorage.removeItem('token');
        router.push('/auth/login');
      }
    }
  }, [router]);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login'); // Redirige si no está autenticado
    } else {
      try {
        const decodedToken: DecodedToken = jwtDecode(token);
        // Verifica si el token ha expirado
        if (Date.now() > decodedToken.exp * 1000) {
          localStorage.removeItem('token');
          router.push('/auth/login');
        } else {
          setLoading(false); // Permite el acceso a la ruta protegida
        }
      } catch (error) {
        localStorage.removeItem('token');
        router.push('/auth/login');
      }
    }
  }, [router]);
    

  if (isLoading) {
    return <div>Loading...</div>; // Indicador de carga mientras verifica el token
  }

  return children; // Si está autenticado, muestra el contenido protegido
};

export default ProtectedRoute;
