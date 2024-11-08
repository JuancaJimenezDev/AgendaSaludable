// src/app/api/auth/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validarToken } from "@/utils/jwt";

export async function GET(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  const payload = validarToken(token);

  if (!payload) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const usuario = await prisma.usuario.findUnique({
    where: { id: payload.id },
    select: {
      nombre: true,
      rol: true,
    },
  });

  if (!usuario) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(usuario);
}
