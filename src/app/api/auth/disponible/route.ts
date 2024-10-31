import { NextResponse } from 'next/server';
import { validarToken } from '@/utils/jwt';
import { prisma } from '@/lib/prisma';

// Crear disponibilidad (POST)
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return NextResponse.json({ error: 'No token provided' }, { status: 401 });

    const token = authHeader.split(' ')[1];
    const payload = validarToken(token);
    if (!payload || payload.rol !== 'Medico') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const medicoId = payload.id;
    const body = await req.json();
    const { fecha, horaInicio, horaFin } = body;

    if (!fecha || !horaInicio || !horaFin) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const nuevaDisponibilidad = await prisma.disponibilidad.create({
      data: {
        medicoId,
        fecha: new Date(fecha),
        horaInicio: new Date(`${fecha}T${horaInicio}:00`),
        horaFin: new Date(`${fecha}T${horaFin}:00`),
      },
    });

    return NextResponse.json(nuevaDisponibilidad, { status: 201 });
  } catch (error) {
    console.error('Error al crear disponibilidad:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Obtener disponibilidad (GET)
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return NextResponse.json({ error: 'No token provided' }, { status: 401 });

    const token = authHeader.split(' ')[1];
    const payload = validarToken(token);
    if (!payload || payload.rol !== 'Medico') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const medicoId = payload.id;
    const disponibilidad = await prisma.disponibilidad.findMany({
      where: { medicoId },
    });
    return NextResponse.json(disponibilidad, { status: 200 });
  } catch (error) {
    console.error('Error al obtener la disponibilidad:', error);
    return NextResponse.json({ error: 'Error al obtener la disponibilidad' }, { status: 500 });
  }
}

// Editar disponibilidad (PUT)
export async function PUT(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return NextResponse.json({ error: 'No token provided' }, { status: 401 });

    const token = authHeader.split(' ')[1];
    const payload = validarToken(token);
    if (!payload || payload.rol !== 'Medico') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const medicoId = payload.id;
    const body = await req.json();
    const { id, fecha, horaInicio, horaFin } = body;

    if (!id || !fecha || !horaInicio || !horaFin) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const disponibilidadActualizada = await prisma.disponibilidad.update({
      where: { id },
      data: {
        medicoId,
        fecha: new Date(fecha),
        horaInicio: new Date(`${fecha}T${horaInicio}:00`),
        horaFin: new Date(`${fecha}T${horaFin}:00`),
      },
    });

    return NextResponse.json(disponibilidadActualizada, { status: 200 });
  } catch (error) {
    console.error('Error al actualizar la disponibilidad:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Eliminar disponibilidad (DELETE)
export async function DELETE(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return NextResponse.json({ error: 'No token provided' }, { status: 401 });

    const token = authHeader.split(' ')[1];
    const payload = validarToken(token);
    if (!payload || payload.rol !== 'Medico') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const medicoId = payload.id;
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    await prisma.disponibilidad.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Disponibilidad eliminada' }, { status: 200 });
  } catch (error) {
    console.error('Error al eliminar la disponibilidad:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
