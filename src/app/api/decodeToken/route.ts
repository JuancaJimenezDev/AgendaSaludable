// src/app/api/decodeToken/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt_decode from "jwt-decode"; // Importación sin {}

interface DecodedToken {
  rol: "Medico" | "Cliente" | "Administrador";
}

export async function POST(req: NextRequest) {
  const { token } = await req.json();

  if (!token) {
    return NextResponse.json({ error: "Token no proporcionado" }, { status: 400 });
  }

  try {
    // Decodificar el payload del token JWT manualmente
    const base64Payload = token.split(".")[1];
    const payload = JSON.parse(Buffer.from(base64Payload, "base64").toString("utf-8"));

    if (!payload || !payload.rol) {
      return NextResponse.json({ error: "Token inválido: rol no encontrado" }, { status: 400 });
    }

    return NextResponse.json({ decoded: payload });
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return NextResponse.json({ error: "Token inválido" }, { status: 400 });
  }
}
