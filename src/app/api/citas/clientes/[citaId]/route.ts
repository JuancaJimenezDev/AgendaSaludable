import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validarToken } from "@/utils/jwt";

export async function DELETE(req: Request, { params }: { params: { citaId: string } }) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Authorization header missing" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const payload = validarToken(token);

    if (!payload || payload.rol !== "Cliente") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const citaId = parseInt(params.citaId);
    if (isNaN(citaId)) {
      return NextResponse.json({ error: "ID de cita inválido" }, { status: 400 });
    }

    const cita = await prisma.cita.findUnique({ where: { id: citaId } });
    if (!cita) {
      return NextResponse.json({ error: "Cita no encontrada" }, { status: 404 });
    }

    if (cita.disponibilidadId !== null) {
      await prisma.disponibilidad.update({
        where: { id: cita.disponibilidadId },
        data: { ocupada: false },
      });
    }

    await prisma.cita.delete({ where: { id: citaId } });

    return NextResponse.json({ message: "Cita cancelada" }, { status: 200 });
  } catch (error) {
    console.error("Error al cancelar la cita:", error);

    const errorMessage = (error as Error).message;
    return NextResponse.json(
      { error: "Error interno del servidor", details: errorMessage },
      { status: 500 }
    );
  }
}
