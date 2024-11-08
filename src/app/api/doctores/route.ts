import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const especialidadId = parseInt(searchParams.get("especialidadId") || "", 10);

  // Validación: Verificar si `especialidadId` es un número válido.
  if (isNaN(especialidadId)) {
    return NextResponse.json({ error: "Especialidad ID requerido y debe ser un número" }, { status: 400 });
  }

  try {
    // Consulta a Prisma para obtener los doctores con la especialidad especificada
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
