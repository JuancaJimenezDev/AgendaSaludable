// src/app/api/admin/usuarios/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validarToken } from '@/utils/jwt';

// Ruta para obtener todos los usuarios
export async function GET(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return NextResponse.json({ error: "No token provided" }, { status: 401 });

  const token = authHeader.split(" ")[1];
  const payload = validarToken(token);

  // Verificar que sea un administrador
  if (!payload || payload.rol !== "Administrador") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const usuarios = await prisma.usuario.findMany({
    select: {
      id: true,
      nombre: true,
      correo: true,
      rol: true,
    },
  });
  return NextResponse.json(usuarios);
}

// Ruta para actualizar el rol de un usuario
export async function POST(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return NextResponse.json({ error: "No token provided" }, { status: 401 });

  const token = authHeader.split(" ")[1];
  const payload = validarToken(token);

  // Verificar que sea un administrador
  if (!payload || payload.rol !== "Administrador") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { userId, nuevoRol } = await req.json();

  if (!["Cliente", "Medico", "Administrador"].includes(nuevoRol)) {
    return NextResponse.json({ error: "Rol no válido" }, { status: 400 });
  }

  const usuarioActualizado = await prisma.usuario.update({
    where: { id: userId },
    data: { rol: nuevoRol },
  });

  return NextResponse.json(usuarioActualizado, { status: 200 });
}
