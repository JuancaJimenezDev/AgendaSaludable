const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();
    console.log('Conexión exitosa a la base de datos');
  } catch (error) {
    console.error('Error conectando a la base de datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
