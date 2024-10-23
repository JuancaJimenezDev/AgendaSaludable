import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Asegúrate de que la ruta esté correcta

export async function GET() {
  try {
    const disponibilidad = await prisma.disponibilidad.findMany({
      include: {
        medico: true,
      },
    });

    return NextResponse.json(disponibilidad);
  } catch (error) {
    console.error('Error al obtener disponibilidad:', error);
    return NextResponse.json({ error: 'Error al obtener disponibilidad' }, { status: 500 });
  }
}
