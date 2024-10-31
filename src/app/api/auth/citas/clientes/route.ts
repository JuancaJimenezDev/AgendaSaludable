import { NextResponse } from 'next/server';
import { validarToken } from '@/utils/jwt';
import { prisma } from '@/lib/prisma';

// Función para manejar las solicitudes GET y obtener los doctores y su disponibilidad
export async function GET(req: Request) {
  try {
    // Obtener el header de autorización
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return NextResponse.json({ error: 'No token provided' }, { status: 401 });

    const token = authHeader.split(' ')[1];
    const payload = validarToken(token);

    // Validar que el rol del token sea 'Cliente'
    if (!payload || payload.rol !== 'Cliente') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Obtener los doctores disponibles
    const doctoresDisponibles = await prisma.usuario.findMany({
      where: { rol: 'Medico' },
      include: {
        disponibilidad: true, // Obtener la disponibilidad del doctor
      },
    });

    // Retornar la lista de doctores
    return NextResponse.json(doctoresDisponibles, { status: 200 });
  } catch (error) {
    console.error('Error al obtener los doctores:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Crear una nueva cita (POST)
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return NextResponse.json({ error: 'No token provided' }, { status: 401 });

    const token = authHeader.split(' ')[1];
    const payload = validarToken(token);
    if (!payload || payload.rol !== 'Cliente') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const clienteId = payload.id;
    const body = await req.json();
    const { medicoId, disponibilidadId, fecha, hora } = body;

    if (!medicoId || !disponibilidadId || !fecha || !hora) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Crear la cita
    const nuevaCita = await prisma.cita.create({
      data: {
        clienteId,
        medicoId,
        disponibilidadId,
        fecha: new Date(fecha),
        hora: new Date(`${fecha}T${hora}:00`),
        estado: 'Programada', // Estado inicial
      },
      include: {
        medico: true, // Incluir el médico relacionado en la respuesta
      },
    });

    return NextResponse.json(nuevaCita, { status: 201 });
  } catch (error) {
    console.error('Error al crear cita:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Editar cita (PUT)
export async function PUT(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return NextResponse.json({ error: 'No token provided' }, { status: 401 });

    const token = authHeader.split(' ')[1];
    const payload = validarToken(token);
    if (!payload || payload.rol !== 'Cliente') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { id, fecha, hora } = body;

    if (!id || !fecha || !hora) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const citaActualizada = await prisma.cita.update({
      where: { id },
      data: {
        fecha: new Date(fecha),
        hora: new Date(`${fecha}T${hora}:00`),
        estado: 'Reprogramada', // Cambiar estado si la cita se edita
      },
    });

    return NextResponse.json(citaActualizada, { status: 200 });
  } catch (error) {
    console.error('Error al actualizar cita:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Eliminar (cancelar) cita (DELETE)
export async function DELETE(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return NextResponse.json({ error: 'No token provided' }, { status: 401 });

    const token = authHeader.split(' ')[1];
    const payload = validarToken(token);
    if (!payload || payload.rol !== 'Cliente') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Cancelar la cita
    await prisma.cita.update({
      where: { id },
      data: {
        estado: 'Cancelada',
      },
    });

    return NextResponse.json({ message: 'Cita cancelada' }, { status: 200 });
  } catch (error) {
    console.error('Error al cancelar cita:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
