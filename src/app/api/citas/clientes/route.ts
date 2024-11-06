import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validarToken } from '@/utils/jwt';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const payload = validarToken(token);

    if (!payload || payload.rol !== "Cliente") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { disponibilidadId, fecha, hora } = await req.json();

    const disponibilidad = await prisma.disponibilidad.findUnique({
      where: { id: disponibilidadId },
    });

    if (!disponibilidad) {
      return NextResponse.json({ error: "Disponibilidad no encontrada" }, { status: 404 });
    }

    const cita = await prisma.cita.create({
      data: {
        clienteId: payload.id,
        medicoId: disponibilidad.medicoId,
        disponibilidadId,
        fecha: new Date(fecha),
        hora: new Date(hora),
        estado: "Programada",
      },
    });

    return NextResponse.json(cita, { status: 201 });
  } catch (error) {
    console.error("Error al agendar la cita:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
