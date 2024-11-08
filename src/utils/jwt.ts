import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "s3cr3tK3y#2024"; // Asegúrate de que JWT_SECRET está en tu .env y no uses "secret" en producción.

console.log("JWT_SECRET loaded:", JWT_SECRET); // Línea de depuración, elimina en producción

interface Payload {
  id: number;
  rol: "Medico" | "Cliente" | "Administrador";
}

// Función para generar el token
export function generarToken(payload: Payload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}

// Función para validar el token
export function validarToken(token: string): Payload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as Payload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.error("Token expirado");
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.error("Token inválido");
    } else {
      console.error("Error verificando token:", error);
    }
    return null;
  }
}
