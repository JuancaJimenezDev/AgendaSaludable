import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validarToken } from "@/utils/jwt";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const payload = validarToken(token);

    if (!payload || !["Cliente", "Medico"].includes(payload.rol)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    let medicoId = searchParams.get("medicoId") ? parseInt(searchParams.get("medicoId")!) : null;

    console.log("Received medicoId:", medicoId);

    // Validación de `medicoId` según el rol
    if (payload.rol === "Cliente") {
      if (!medicoId) {
        console.log("Cliente sin especificar `medicoId`.");
        return NextResponse.json({ error: "Medico ID requerido para cliente" }, { status: 400 });
      }
    } else if (payload.rol === "Medico") {
      medicoId = payload.id; // Asegurarse de que medicoId se asigne al id del médico autenticado
    }

    // Validación final de `medicoId`
    if (medicoId === null || isNaN(medicoId)) {
      return NextResponse.json({ error: "Invalid medico ID" }, { status: 400 });
    }

    // Obtener disponibilidad basada en `medicoId`
    const disponibilidades = await prisma.disponibilidad.findMany({
      where: { medicoId: medicoId }, // Ya que medicoId ahora es seguro, se usa directamente
      select: {
        id: true,
        fecha: true,
        horaInicio: true,
        horaFin: true,
        ocupada: true,
      },
    });

    console.log("Fetched disponibilidades:", disponibilidades);

    return NextResponse.json(disponibilidades, { status: 200 });
  } catch (error) {
    console.error("Error al obtener disponibilidad:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const payload = validarToken(token);

    if (!payload || payload.rol !== "Medico") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { fecha, horaInicio, horaFin } = await req.json();

    if (!fecha || !horaInicio || !horaFin) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    // Parse `fecha`, `horaInicio`, `horaFin` para asegurarnos de que son fechas válidas
    const parsedFecha = new Date(fecha);
    const parsedHoraInicio = new Date(`${fecha}T${horaInicio}`);
    const parsedHoraFin = new Date(`${fecha}T${horaFin}`);

    if (isNaN(parsedFecha.getTime()) || isNaN(parsedHoraInicio.getTime()) || isNaN(parsedHoraFin.getTime())) {
      return NextResponse.json({ error: "Formato de fecha u hora incorrecto" }, { status: 400 });
    }

    // Crear la nueva disponibilidad para el médico autenticado
    const nuevaDisponibilidad = await prisma.disponibilidad.create({
      data: {
        fecha: parsedFecha,
        horaInicio: parsedHoraInicio,
        horaFin: parsedHoraFin,
        medicoId: payload.id,
      },
    });

    return NextResponse.json(nuevaDisponibilidad, { status: 201 });
  } catch (error) {
    console.error("Error al agregar disponibilidad:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
