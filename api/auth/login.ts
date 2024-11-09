// pages/api/auth/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
const bcrypt = require('bcryptjs');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    const { email, password } = req.body;

    try {
        const user = await prisma.usuario.findUnique({
            where: { email },
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        // Aquí puedes manejar la autenticación con JWT, cookies, etc.
        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ message: 'Error en el servidor' });
    }
}

