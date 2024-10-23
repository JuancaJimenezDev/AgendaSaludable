"use client";

import { useForm, SubmitHandler } from 'react-hook-form';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type FormData = {
  correo: string;
  password: string;
};

function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter(); // Utiliza el hook `useRouter` de Next.js

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const resJson = await res.json();

      if (!res.ok) {
        setErrorMessage(resJson.message);
      } else {
        // Almacena el token en localStorage
        localStorage.setItem('token', resJson.token);
        router.push('/dashboard'); // Redirige a dashboard
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      setErrorMessage('Error al iniciar sesión');
    }
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex justify-center items-center">
      <form onSubmit={handleSubmit(onSubmit)} className="w-1/4">
        <h1 className="text-slate-200 font-bold text-4xl mb-4">Login</h1>

        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        <label htmlFor="correo" className="text-slate-500 mb-2 block text-sm">Correo</label>
        <input
          type="email"
          {...register("correo", { required: 'El correo es obligatorio' })}
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
        />
        {errors.correo && (
          <p className="text-red-500">
            {errors.correo.message ? errors.correo.message : 'Error'}
          </p>
        )}

        <label htmlFor="password" className="text-slate-500 mb-2 block text-sm">Contraseña</label>
        <input
          type="password"
          {...register("password", { required: 'La contraseña es obligatoria' })}
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
        />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}

        <button className="w-full bg-blue-500 text-white p-3 rounded-lg">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
