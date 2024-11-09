"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";

type FormData = {
  nombre: string;
  correo: string;
  password: string;
};

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const resJson = await res.json();

      if (!res.ok) {
        setErrorMessage(resJson.message || 'Error al registrar el usuario');
        Swal.fire("Error", resJson.message || "Error al registrar el usuario", "error");
        return;
      }

      Swal.fire("Éxito", "Usuario registrado exitosamente", "success").then(() => {
        router.push('/login');
      });

      reset();
    } catch (error) {
      console.error('Register request error:', error);
      setErrorMessage('Error al registrar el usuario');
      Swal.fire("Error", "Error en el servidor", "error");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-r from-blue-200 to-indigo-200">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg transform transition-all hover:shadow-xl">
        <h1 className="text-gray-800 font-bold text-4xl mb-6 text-center">Crear una Cuenta</h1>

        {errorMessage && <p className="text-red-500 mb-4 text-center font-semibold">{errorMessage}</p>}

        <div className="mb-4">
          <label className="text-gray-700 mb-2 block text-sm font-medium">Nombre</label>
          <input
            type="text"
            placeholder="Ingrese su nombre"
            {...register("nombre", { required: 'El nombre es obligatorio' })}
            className="p-3 rounded-lg block border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
          />
          {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
        </div>

        <div className="mb-4">
          <label className="text-gray-700 mb-2 block text-sm font-medium">Correo</label>
          <input
            type="email"
            placeholder="Ingrese su correo"
            autoComplete="email"
            {...register("correo", { required: 'El correo es obligatorio' })}
            className="p-3 rounded-lg block border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
          />
          {errors.correo && <p className="text-red-500 text-xs mt-1">{errors.correo.message}</p>}
        </div>

        <div className="mb-6">
          <label className="text-gray-700 mb-2 block text-sm font-medium">Contraseña</label>
          <input
            type="password"
            placeholder="Ingrese su contraseña"
            autoComplete="new-password"
            {...register("password", { required: 'La contraseña es obligatoria' })}
            className="p-3 rounded-lg block border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all"
        >
          Registrarse
        </button>

        <p className="text-sm text-center text-gray-600 mt-6">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login" className="text-indigo-600 hover:text-indigo-800 font-semibold transition-all">
            Inicia sesión
          </Link>
        </p>
      </form>
    </div>
  );
}
