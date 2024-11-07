// components/Navbar.tsx
"use client";
import Link from 'next/link';


const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-4">
        <li>
          <Link href="/" className="text-white hover:underline">Inicio</Link>
        </li>
        <li>
          <Link href="/login" className="text-white hover:underline">Login</Link>
        </li>
        <li>
          <Link href="/dashboard/medico" className="text-white hover:underline">Dashboard Médico</Link>
        </li>
        <li>
          <Link href="/dashboard/cliente" className="text-white hover:underline">Dashboard Cliente</Link>
        </li>
        <li>
          <Link href="/admin" className="text-white hover:underline">Administrador</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;