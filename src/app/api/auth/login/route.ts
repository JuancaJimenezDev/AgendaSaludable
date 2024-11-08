// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generarToken } from "@/utils/jwt";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const { correo, password } = await request.json();

    const usuario = await prisma.usuario.findUnique({
      where: { correo },
    });

    if (!usuario) {
      console.log("Usuario no encontrado");
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, usuario.contrasena);

    if (!passwordMatch) {
      console.log("Contraseña incorrecta");
      return NextResponse.json({ message: "Contraseña incorrecta" }, { status: 401 });
    }

    const token = generarToken({ id: usuario.id, rol: usuario.rol });
    console.log("Generated Token:", token);

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error("Error en el proceso de login:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}
