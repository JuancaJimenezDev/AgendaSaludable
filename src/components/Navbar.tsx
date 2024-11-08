import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface NavbarProps {
  userRole: "Medico" | "Cliente" | "Administrador";
}

const Navbar: React.FC<NavbarProps> = ({ userRole }) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    router.push("/login"); // Redirige al login después de cerrar sesión
    window.location.reload(); // Recarga la página para limpiar cualquier estado relacionado con el usuario
  };

  return (
    <nav className="navbar">
      <ul>
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
            <li><Link href="/admin/usuarios">Usuarios</Link></li>
          </>
        )}
        <li>
          <button onClick={handleLogout} className="logout-button">
            Cerrar sesión
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
