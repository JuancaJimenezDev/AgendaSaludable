import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

interface Payload {
  id: number;  // El id del usuario
  rol: 'Medico' | 'Cliente' | 'Administrador';  // Roles permitidos
}

/**
 * Genera un token JWT basado en el payload proporcionado.
 * @param payload - Contiene el id del usuario y el rol.
 * @returns Un token JWT.
 */
export function generarToken(payload: Payload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });  // El token expira en 1 hora
}

/**
 * Valida un token JWT.
 * @param token - El token JWT a validar.
 * @returns El payload si el token es válido, o null si es inválido o ha expirado.
 */
export function validarToken(token: string): Payload | null {
  try {
    // Intentamos verificar el token y tipamos el resultado como Payload
    return jwt.verify(token, JWT_SECRET) as Payload;
  } catch (error) {
    console.error("Error verificando token:", error);
    return null;  // Si el token es inválido o ha expirado, retornamos null
  }
}
