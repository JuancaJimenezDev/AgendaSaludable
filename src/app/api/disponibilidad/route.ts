// src/app/api/disponibilidad/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validarToken } from '@/utils/jwt';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return NextResponse.json({ error: "No token provided" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const payload = validarToken(token);

    // Validación de roles
    if (!payload || (payload.rol !== "Medico" && payload.rol !== "Cliente")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const medicoId = parseInt(searchParams.get("medicoId") || "", 10);
    const especialidadId = parseInt(searchParams.get("especialidadId") || "", 10);

    // Si el usuario es cliente, debe proporcionar un medicoId para ver la disponibilidad de un médico específico
    if (payload.rol === "Cliente" && !medicoId) {
      return NextResponse.json({ error: "Medico ID requerido" }, { status: 400 });
    }

    // Definir condiciones de búsqueda
    const whereConditions: any = {};

    // Si el usuario es un médico, mostrar solo su propia disponibilidad
    if (payload.rol === "Medico") {
      whereConditions.medicoId = payload.id;
    } else {
      // Si es cliente, usar el medicoId proporcionado en la solicitud
      whereConditions.medicoId = medicoId;
    }

    // Agregar especialidad a las condiciones si está especificada
    if (especialidadId) {
      whereConditions.especialidadId = especialidadId;
    }

    // Consulta a la base de datos
    const disponibilidad = await prisma.disponibilidad.findMany({
      where: whereConditions,
      include: {
        medico: { select: { nombre: true } },
        especialidad: { select: { nombre: true } },
      },
    });

    return NextResponse.json(disponibilidad, { status: 200 });
  } catch (error) {
    console.error("Error al obtener la disponibilidad:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Agregar disponibilidad (POST)
// Ajustado para verificar y formatear los tiempos correctamente
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return NextResponse.json({ error: "No token provided" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const payload = validarToken(token);

    if (!payload || payload.rol !== "Medico") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { fecha, horaInicio, horaFin, especialidadId } = await req.json();
    if (!fecha || !horaInicio || !horaFin) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Convertir `fechaInicio` y `fechaFin` en strings ISO para evitar problemas con el almacenamiento en BD.
    const fechaInicio = new Date(`${fecha}T${horaInicio}:00`).toISOString();
    const fechaFin = new Date(`${fecha}T${horaFin}:00`).toISOString();

    if (isNaN(new Date(fechaInicio).getTime()) || isNaN(new Date(fechaFin).getTime())) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
    }

    if (new Date(fechaFin) <= new Date(fechaInicio)) {
      return NextResponse.json({ error: "La hora de fin debe ser después de la hora de inicio" }, { status: 400 });
    }

    const nuevaDisponibilidad = await prisma.disponibilidad.create({
      data: {
        medicoId: payload.id,
        fecha: fechaInicio, // Asegúrate de que el formato de `fecha` esté correcto en la base de datos.
        horaInicio: fechaInicio,
        horaFin: fechaFin,
        especialidadId,
      },
    });

    return NextResponse.json(nuevaDisponibilidad, { status: 201 });
  } catch (error) {
    console.error("Error al agregar disponibilidad:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
