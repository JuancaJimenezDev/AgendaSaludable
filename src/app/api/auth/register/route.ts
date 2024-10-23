import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
    const { nombre, correo, password } = await request.json();
  
    // Verifica si el usuario ya existe
    const existingUser = await prisma.usuario.findUnique({
        where: { correo }
    });
  
    if (existingUser) {
        return new Response(JSON.stringify({ message: 'El correo ya está registrado' }), { status: 400 });
    }
  
    try {
        // Genera el hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10); // 10 es el valor recomendado para el salt
  
        // Crea el usuario
        const newUser = await prisma.usuario.create({
            data: {
                nombre,
                correo,
                contrasena: hashedPassword, // Guarda la contraseña encriptada
            }
        });

        return new Response(JSON.stringify({ message: 'Usuario registrado exitosamente' }), { status: 200 });
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        return new Response(JSON.stringify({ message: 'Error al registrar el usuario' }), { status: 500 });
    }
}
