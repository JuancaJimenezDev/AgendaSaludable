import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generarToken } from '@/utils/jwt';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  const { correo, password } = await request.json();

  const usuario = await prisma.usuario.findUnique({
    where: { correo },
  });

  if (!usuario) {
    return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 401 });
  }

  const passwordMatch = await bcrypt.compare(password, usuario.contrasena);
  if (!passwordMatch) {
    return NextResponse.json({ message: 'Contraseña incorrecta' }, { status: 401 });
  }

  // Genera el token con el rol del usuario
  const token = generarToken({ id: usuario.id, rol: usuario.rol });

  return NextResponse.json({ token });
}
