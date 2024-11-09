"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("home");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <nav className="flex justify-between mb-12 p-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-700">Sistema de Citas</h1>
        <div className="space-x-4">
          <Link href="/gestion">
            <button
              onClick={() => handleTabClick("gestion")}
              className={`px-4 py-2 rounded ${
                activeTab === "gestion" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              Gestión de Citas
            </button>
          </Link>
          <Link href="/Calendario">
            <button
              onClick={() => handleTabClick("Calendario")}
              className={`px-4 py-2 rounded ${
                activeTab === "calendario" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              Calendario
            </button>
          </Link>
          <Link href="/admin-dashboard">
            <button
              onClick={() => handleTabClick("admin")}
              className={`px-4 py-2 rounded ${
                activeTab === "admin" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              Dashboard Admin
            </button>
          </Link>
        </div>
      </nav>

      <main className="container mx-auto p-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Bienvenido al Sistema de Citas</h2>
        <p className="text-gray-600">
          Selecciona una opción en el menú para acceder a la sección correspondiente.
        </p>
      </main>
    </div>
  );
}
