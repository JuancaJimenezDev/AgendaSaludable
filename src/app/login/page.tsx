// src/app/login/page.tsx
"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

type FormData = {
  correo: string;
  password: string;
};

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const resJson = await response.json();
        setErrorMessage(resJson.message || "Error al iniciar sesión");
        Swal.fire("Error", resJson.message || "Error al iniciar sesión", "error");
        return;
      }

      const { token } = await response.json();

      // Guardar el token en localStorage y decodificar el rol
      localStorage.setItem("token", token);
      const payload = JSON.parse(atob(token.split(".")[1])); // Decodificar el payload del JWT
      localStorage.setItem("userRole", payload.rol);
      console.log("Token y rol guardados en localStorage:", token, payload.rol);

      // Dispara un evento `storage` para que `RootLayout` actualice el estado del rol
      window.dispatchEvent(new Event("storage"));

      // Redirigir según el rol del usuario
      switch (payload.rol) {
        case "Medico":
          router.push("/dashboard/medico");
          break;
        case "Cliente":
          router.push("/dashboard/cliente");
          break;
        case "Administrador":
          router.push("/admin");
          break;
        default:
          router.push("/login");
      }

      reset(); // Limpiar el formulario después del inicio de sesión
    } catch (error) {
      console.error("Error en el login:", error);
      setErrorMessage("Error al iniciar sesión");
      Swal.fire("Error", "Error en el servidor", "error");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-200 to-blue-400">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg transform transition-all hover:shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Iniciar Sesión
        </h2>

        {errorMessage && (
          <p className="text-red-500 mb-4 text-center font-semibold">{errorMessage}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Correo</label>
            <input
              type="email"
              {...register("correo", { required: "El correo es obligatorio" })}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
              placeholder="Correo electrónico"
            />
            {errors.correo && (
              <p className="text-red-500 text-xs mt-1">{errors.correo.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Contraseña</label>
            <input
              type="password"
              {...register("password", { required: "La contraseña es obligatoria" })}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
              placeholder="Contraseña"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Ingresar
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          ¿No tienes cuenta?{" "}
          <a
            href="/register"
            className="text-indigo-600 hover:text-indigo-700 font-semibold transition-all"
          >
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  );
}
