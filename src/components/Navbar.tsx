import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface NavbarProps {
  userRole: "Medico" | "Cliente" | "Administrador";
}

const Navbar: React.FC<NavbarProps> = ({ userRole }) => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true); // Indicamos que estamos cerrando sesión
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    router.push("/login"); // Redirige al login después de cerrar sesión
  };

  if (isLoggingOut) return null; // Oculta el Navbar si está cerrando sesión

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-title">Agenda Saludable</div>
        <ul className="navbar-links">
          {userRole === "Medico" && (
            <>
              <li><Link href="/citas/medico">Citas</Link></li>
              <li><Link href="/disponibilidad">Disponibilidad</Link></li>
              <li><Link href="/dashboard/medico">Dashboard</Link></li>
            </>
          )}
          {userRole === "Cliente" && (
            <>
              <li><Link href="/citas/clientes">Citas</Link></li>
              <li><Link href="/dashboard/cliente">Dashboard</Link></li>
            </>
          )}
          {userRole === "Administrador" && (
            <>
              <li><Link href="/">Inicio</Link></li>
            </>
          )}
        </ul>
        <button onClick={handleLogout} className="logout-button">
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
