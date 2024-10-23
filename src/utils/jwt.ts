import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export function generarToken(payload: any) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });  // Duración de 1 hora
}

export function validarToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}
