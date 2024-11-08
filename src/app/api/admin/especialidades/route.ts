// src/app/api/admin/especialidades/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validarToken } from "@/utils/jwt";

// Ruta para obtener todas las especialidades
export async function GET(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return NextResponse.json({ error: "No token provided" }, { status: 401 });

  const token = authHeader.split(" ")[1];
  const payload = validarToken(token);

  if (!payload || payload.rol !== "Administrador") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const especialidades = await prisma.especialidad.findMany({
    select: {
      id: true,
      nombre: true,
    },
  });
  return NextResponse.json(especialidades);
}

// Ruta para crear una nueva especialidad
export async function POST(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return NextResponse.json({ error: "No token provided" }, { status: 401 });

  const token = authHeader.split(" ")[1];
  const payload = validarToken(token);

  if (!payload || payload.rol !== "Administrador") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { nombre } = await req.json();

  const nuevaEspecialidad = await prisma.especialidad.create({
    data: {
      nombre,
    },
  });

  return NextResponse.json(nuevaEspecialidad, { status: 201 });
}

// Ruta para asignar una especialidad a un médico
export async function PUT(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return NextResponse.json({ error: "No token provided" }, { status: 401 });

  const token = authHeader.split(" ")[1];
  const payload = validarToken(token);

  if (!payload || payload.rol !== "Administrador") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { userId, especialidadId } = await req.json();

  const usuarioActualizado = await prisma.usuario.update({
    where: { id: userId },
    data: { especialidadId },
  });

  return NextResponse.json(usuarioActualizado, { status: 200 });
}
