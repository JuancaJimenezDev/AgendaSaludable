import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const especialidadId = parseInt(searchParams.get("especialidadId") || "");

  if (!especialidadId) {
    return NextResponse.json({ error: "Especialidad ID requerido" }, { status: 400 });
  }

  try {
    const doctores = await prisma.usuario.findMany({
      where: { rol: "Medico", especialidadId },
      select: { id: true, nombre: true },
    });
    return NextResponse.json(doctores);
  } catch (error) {
    console.error("Error al obtener doctores:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
