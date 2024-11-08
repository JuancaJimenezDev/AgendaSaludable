import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validarToken } from "@/utils/jwt";

export async function DELETE(req: Request, { params }: { params: { disponibilidadId: string } }) {
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

    const disponibilidadId = parseInt(params.disponibilidadId);
    if (isNaN(disponibilidadId)) {
      return NextResponse.json({ error: "Invalid disponibilidad ID" }, { status: 400 });
    }

    // Verificar que la disponibilidad pertenece al médico autenticado
    const disponibilidad = await prisma.disponibilidad.findUnique({
      where: { id: disponibilidadId },
    });

    if (!disponibilidad || disponibilidad.medicoId !== payload.id) {
      return NextResponse.json({ error: "Disponibilidad not found or not authorized" }, { status: 404 });
    }

    // Eliminar la disponibilidad
    await prisma.disponibilidad.delete({
      where: { id: disponibilidadId },
    });

    return NextResponse.json({ message: "Disponibilidad canceled" }, { status: 200 });
  } catch (error) {
    console.error("Error al cancelar disponibilidad:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
