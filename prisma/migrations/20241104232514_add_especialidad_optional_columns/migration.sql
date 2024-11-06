/*
  Warnings:

  - You are about to drop the column `especialidad` on the `Usuario` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cita" ADD COLUMN     "especialidadId" INTEGER;

-- AlterTable
ALTER TABLE "Disponibilidad" ADD COLUMN     "especialidadId" INTEGER;

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "especialidad",
ADD COLUMN     "especialidadId" INTEGER,
ALTER COLUMN "rol" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Especialidad" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Especialidad_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Especialidad_nombre_key" ON "Especialidad"("nombre");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_especialidadId_fkey" FOREIGN KEY ("especialidadId") REFERENCES "Especialidad"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Disponibilidad" ADD CONSTRAINT "Disponibilidad_especialidadId_fkey" FOREIGN KEY ("especialidadId") REFERENCES "Especialidad"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cita" ADD CONSTRAINT "Cita_especialidadId_fkey" FOREIGN KEY ("especialidadId") REFERENCES "Especialidad"("id") ON DELETE SET NULL ON UPDATE CASCADE;
