"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("home");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Barra lateral */}
      <div className="w-64 bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold text-center mb-6">Sistema de Citas</h1>
        <div className="flex flex-col space-y-4">
          <Link href="/gestion">
            <button
              onClick={() => handleTabClick("gestion")}
              className={`px-4 py-2 rounded text-left ${
                activeTab === "gestion" ? "bg-blue-700" : "bg-blue-500"
              }`}
            >
              Gestión de Citas
            </button>
          </Link>
          <Link href="/Calendario">
            <button
              onClick={() => handleTabClick("calendario")}
              className={`px-4 py-2 rounded text-left ${
                activeTab === "calendario" ? "bg-blue-700" : "bg-blue-500"
              }`}
            >
              Calendario
            </button>
          </Link>
          <Link href="/admin-dashboard">
            <button
              onClick={() => handleTabClick("admin")}
              className={`px-4 py-2 rounded text-left ${
                activeTab === "admin" ? "bg-blue-700" : "bg-blue-500"
              }`}
            >
              Dashboard Admin
            </button>
          </Link>
        </div>
      </div>

      {/* Contenido  */}
      <div className="flex-1 p-6">
        <main className="flex flex-col items-center justify-center h-full">
          <h2 className="text-4xl font-semibold text-gray-800 mb-6 text-center">
            Bienvenido
          </h2>
          <p className="text-gray-600 text-center">
            Selecciona una opción en el menú .
          </p>
        </main>
      </div>
    </div>
  );
}
