"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import '../styles/globals.css';

type FormData = {
  correo: string;
  password: string;
};

function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

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
        localStorage.setItem('token', resJson.token);

        // Decodificar el token manualmente sin `jwt-decode`
        const payload = JSON.parse(atob(resJson.token.split('.')[1]));

        if (payload.rol === 'Medico') {
          router.push('/dashboard/medico');
        } else if (payload.rol === 'Cliente') {
          router.push('/dashboard/cliente');
        } else if(payload.rol === 'Administrador'){
          router.push('/admin');
        }
        else {
          router.push('/login')
        }
        }
      } catch (error) {
      Swal.fire("Error", "Error al iniciar sesión", "error");
      setErrorMessage('Error al iniciar sesión');
    }
  };

  return (
    
    // <div className="h-[calc(100vh-7rem)] flex justify-center items-center">
    //   <form onSubmit={handleSubmit(onSubmit)} className="w-1/4 bg-gray-800 p-6 rounded-lg">
    //     <h1 className="text-white font-bold text-4xl mb-6 text-center">Ingresar</h1>

    //     {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

    //     <label htmlFor="correo" className="text-slate-400 mb-2 block text-sm">Correo</label>
    //     <input
    //       type="email"
    //       {...register("correo", { required: 'El correo es obligatorio' })}
    //       className="p-3 rounded block mb-4 bg-gray-900 text-slate-300 w-full"
    //     />
    //     {errors.correo && <p className="text-red-500">{errors.correo.message}</p>}

    //     <label htmlFor="password" className="text-slate-400 mb-2 block text-sm">Contraseña</label>
    //     <input
    //       type="password"
    //       {...register("password", { required: 'La contraseña es obligatoria' })}
    //       className="p-3 rounded block mb-4 bg-gray-900 text-slate-300 w-full"
    //     />
    //     {errors.password && <p className="text-red-500">{errors.password.message}</p>}

    //     <button className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition">Login</button>
    //   </form>
    // </div>
    <div className="h-[calc(100vh-7rem)] flex justify-center items-center bg-gray-100">
    <form onSubmit={handleSubmit(onSubmit)} className="w-1/4 bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-gray-800 font-bold text-4xl mb-6 text-center">Login</h1>
  
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
  
      <label htmlFor="correo" className="text-gray-700 mb-2 block text-sm">Correo</label>
      <input
        type="email"
        {...register("correo", { required: 'El correo es obligatorio' })}
        className="p-3 rounded block mb-4 bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        placeholder="tuemail@ejemplo.com"
      />
      {errors.correo && <p className="text-red-500">{errors.correo.message}</p>}
  
      <label htmlFor="password" className="text-gray-700 mb-2 block text-sm">Contraseña</label>
      <input
        type="password"
        {...register("password", { required: 'La contraseña es obligatoria' })}
        className="p-3 rounded block mb-4 bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        placeholder="********"
      />
      {errors.password && <p className="text-red-500">{errors.password.message}</p>}
  
      <button className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200 ease-in-out">Login</button>
    </form>
  </div>
  );
}

export default LoginPage;
