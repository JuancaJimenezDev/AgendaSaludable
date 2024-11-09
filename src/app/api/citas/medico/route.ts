// src/app/api/citas/medico/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Asegúrate de que esté bien configurado el cliente Prisma
import { validarToken } from '@/utils/jwt'; // Para verificar el token de autenticación

// Forzar que esta ruta se trate como dinámica en Next.js
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const payload = validarToken(token);

    // Validación de rol de médico
    if (!payload || payload.rol !== 'Medico') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Obtener las citas programadas del médico
    const citasMedico = await prisma.cita.findMany({
      where: { medicoId: payload.id, estado: 'Programada' },
      include: {
        cliente: {
          select: { nombre: true, correo: true }
        },
        disponibilidad: {
          select: { fecha: true, horaInicio: true, horaFin: true }
        }
      }
    });

    return NextResponse.json(citasMedico, { status: 200 });
  } catch (error) {
    console.error('Error al obtener las citas del médico:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
