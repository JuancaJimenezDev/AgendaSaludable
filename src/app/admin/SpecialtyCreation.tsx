// src/app/admin/SpecialtyCreation.tsx
"use client"; // Agrega esta línea al inicio del archivo

import { useState } from "react";
import { TextField, Button } from "@mui/material";
import Swal from "sweetalert2";

export default function SpecialtyCreation() {
  const [newEspecialidad, setNewEspecialidad] = useState("");

  const handleCrearEspecialidad = async () => {
    if (!newEspecialidad.trim()) return;

    const token = localStorage.getItem("token");

    const res = await fetch("/api/admin/especialidades", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nombre: newEspecialidad }),
    });

    if (res.ok) {
      Swal.fire("Éxito", "Especialidad creada correctamente", "success");
      setNewEspecialidad("");
    } else {
      Swal.fire("Error", "No se pudo crear la especialidad", "error");
    }
  };

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-5 text-center">Crear Nueva Especialidad</h2>
      <div className="flex gap-2 justify-center">
        <TextField
          label="Nombre de la Especialidad"
          value={newEspecialidad}
          onChange={(e) => setNewEspecialidad(e.target.value)}
          variant="outlined"
        />
        <Button variant="contained" color="primary" onClick={handleCrearEspecialidad}>
          Crear Especialidad
        </Button>
      </div>
    </div>
  );
}
