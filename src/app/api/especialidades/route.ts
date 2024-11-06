import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const especialidades = await prisma.especialidad.findMany({
      select: {
        id: true,
        nombre: true,
      },
    });
    return NextResponse.json(especialidades);
  } catch (error) {
    console.error("Error al obtener especialidades:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
