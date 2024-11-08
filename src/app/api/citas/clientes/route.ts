import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validarToken } from "@/utils/jwt";

interface ValidacionCliente {
  payload?: { id: number; rol: string };
  error?: string;
  status: number;
}

async function validarCliente(req: Request): Promise<ValidacionCliente> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return { error: "No se proporcionó un token", status: 401 };
  }

  const token = authHeader.split(" ")[1];
  const payload = validarToken(token);

  if (!payload || payload.rol !== "Cliente") {
    return { error: "No autorizado", status: 403 };
  }

  return { payload, status: 200 };
}

export async function POST(req: Request) {
  try {
    // Validar el token y el rol del cliente
    const { payload, error, status } = await validarCliente(req);
    if (error || !payload) return NextResponse.json({ error }, { status });

    // Obtener datos del cuerpo de la solicitud
    const { disponibilidadId, fecha, hora } = await req.json();

    // Verificar que los datos sean completos
    if (!disponibilidadId || !fecha || !hora) {
      return NextResponse.json(
        { error: "Datos incompletos: falta disponibilidadId, fecha o hora" },
        { status: 400 }
      );
    }

    // Verificar la disponibilidad en la base de datos
    const disponibilidad = await prisma.disponibilidad.findUnique({
      where: { id: disponibilidadId },
    });

    if (!disponibilidad) {
      return NextResponse.json({ error: "Disponibilidad no encontrada" }, { status: 404 });
    }

    if (disponibilidad.ocupada) {
      return NextResponse.json({ error: "La disponibilidad ya está ocupada" }, { status: 409 });
    }

    // Validar formato de fecha y hora
    const parsedFecha = new Date(fecha);
    const parsedHora = new Date(hora);

    if (isNaN(parsedFecha.getTime()) || isNaN(parsedHora.getTime())) {
      return NextResponse.json({ error: "Formato de fecha u hora incorrecto" }, { status: 400 });
    }

    // Crear la cita en la base de datos
    const nuevaCita = await prisma.cita.create({
      data: {
        clienteId: payload.id,
        medicoId: disponibilidad.medicoId,
        disponibilidadId: disponibilidad.id,
        fecha: parsedFecha,
        hora: parsedHora,
        estado: "Programada",
      },
    });

    // Actualizar la disponibilidad para marcarla como ocupada
    await prisma.disponibilidad.update({
      where: { id: disponibilidadId },
      data: { ocupada: true },
    });

    return NextResponse.json(nuevaCita, { status: 201 });
  } catch (error) {
    console.error("Error al agendar la cita:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    // Validar el token y el rol del cliente
    const { payload, error, status } = await validarCliente(req);
    if (error || !payload) return NextResponse.json({ error }, { status });

    // Obtener citas del cliente autenticado
    const citas = await prisma.cita.findMany({
      where: { clienteId: payload.id },
      include: {
        medico: { select: { nombre: true } },
        disponibilidad: { select: { horaInicio: true, horaFin: true } },
      },
      orderBy: { fecha: "asc" },
    });

    return NextResponse.json(citas, { status: 200 });
  } catch (error) {
    console.error("Error al obtener citas:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
