import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Asegúrate de tener la ruta correcta

export async function POST(request: NextRequest) {
  const { clienteId, medicoId, fecha, hora } = await request.json();

  try {
    const cita = await prisma.cita.create({
      data: {
        clienteId,
        medicoId,
        fecha: new Date(fecha),
        hora: new Date(hora),
      },
    });

    return NextResponse.json(cita);
  } catch (error) {
    console.error('Error al crear cita:', error);
    return NextResponse.json({ error: 'Error al crear cita' }, { status: 500 });
  }
}
