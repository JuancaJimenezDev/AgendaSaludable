import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
    try {
        const { nombre, correo, password } = await request.json();

        // Verificar que todos los campos necesarios están presentes
        if (!nombre || !correo || !password) {
            return new Response(JSON.stringify({ message: 'Todos los campos son requeridos' }), { status: 400 });
        }

        // Verifica si el usuario ya existe
        const existingUser = await prisma.usuario.findUnique({
            where: { correo },
        });

        if (existingUser) {
            return new Response(JSON.stringify({ message: 'El correo ya está registrado' }), { status: 400 });
        }

        // Genera el hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10); // 10 es el valor recomendado para el salt

        await prisma.usuario.create({
            data: {
              nombre,
              correo,
              contrasena: hashedPassword,
              rol: 'Cliente',
            },
          });

        return new Response(JSON.stringify({ message: 'Usuario registrado exitosamente' }), { status: 201 });
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        return new Response(JSON.stringify({ message: 'Error al registrar el usuario' }), { status: 500 });
    }
}
