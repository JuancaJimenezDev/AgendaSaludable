// src/utils/jwt.ts
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

interface Payload {
  id: number;
  rol: "Medico" | "Cliente" | "Administrador";
}

// Genera el token JWT
export function generarToken(payload: Payload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}

// Valida el token JWT
export function validarToken(token: string): Payload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as Payload;
  } catch (error) {
    console.error("Error verificando token:", error);
    return null; // Retorna null si el token es inválido o ha expirado
  }
}
