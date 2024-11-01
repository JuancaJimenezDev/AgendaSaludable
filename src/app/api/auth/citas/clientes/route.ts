import { NextResponse } from 'next/server';
import { validarToken } from '@/utils/jwt';
import { prisma } from '@/lib/prisma';

// GET para obtener doctores y su disponibilidad
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return NextResponse.json({ error: 'No token provided' }, { status: 401 });

    const token = authHeader.split(' ')[1];
    const payload = validarToken(token);

    // Validación de rol de cliente
    if (!payload || payload.rol !== 'Cliente') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Obtener los doctores con rol de "Medico" y su disponibilidad futura
    const doctoresDisponibles = await prisma.usuario.findMany({
      where: { rol: 'Medico' },
      select: {
        id: true,
        nombre: true,
        especialidad: true,
        disponibilidad: {
          where: {
            fecha: {
              gte: new Date(),
            },
          },
          select: {
            id: true,
            fecha: true,
            horaInicio: true,
            horaFin: true,
          },
        },
      },
    });

    return NextResponse.json(doctoresDisponibles, { status: 200 });
  } catch (error) {
    console.error('Error al obtener los doctores:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST para crear una nueva cita
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return NextResponse.json({ error: 'No token provided' }, { status: 401 });

    const token = authHeader.split(' ')[1];
    const payload = validarToken(token);

    // Validación de rol de cliente
    if (!payload || payload.rol !== 'Cliente') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const clienteId = payload.id;
    const { medicoId, disponibilidadId, fecha, hora } = await req.json();

    // Verificar que todos los campos necesarios estén presentes
    if (!medicoId || !disponibilidadId || !fecha || !hora) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Crear la cita en la base de datos
    const nuevaCita = await prisma.cita.create({
      data: {
        clienteId,
        medicoId,
        disponibilidadId,
        fecha: new Date(fecha),
        hora: new Date(`${fecha}T${hora}`),
        estado: 'Programada',
      },
      include: {
        medico: true,
      },
    });

    return NextResponse.json(nuevaCita, { status: 201 });
  } catch (error) {
    console.error('Error al crear cita:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
