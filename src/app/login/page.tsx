'use client';  
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import prisma from '@/lib/prisma'; 
const bcrypt = require('bcryptjs');


export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            // Llamada a la API para verificar credenciales
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.success) {
                router.push('/dashboard'); // Redirigir a la vista inicial
            } else {
                setError(data.message || 'Credenciales incorrectas');
            }
        } catch (error) {
            setError('Error al iniciar sesión. Inténtalo de nuevo.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <form onSubmit={handleLogin} className="bg-white p-8 shadow-md rounded w-80">
                <h2 className="text-2xl font-bold mb-6">Inicio de Sesión</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Correo Electrónico</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Contraseña</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                    Iniciar Sesión
                </button>
            </form>
        </div>
    );
}
