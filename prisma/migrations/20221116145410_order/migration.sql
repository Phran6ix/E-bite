/*
  Warnings:

  - You are about to drop the column `Payment` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `cartId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `Cart` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `userId` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `desciption` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "CATEGORY" ADD VALUE 'SmallChops';

-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_userId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_cartId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- DropIndex
DROP INDEX "Order_cartId_key";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "Payment",
DROP COLUMN "cartId",
ADD COLUMN     "Paid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "product" TEXT[],
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "description",
ADD COLUMN     "desciption" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "order" TEXT NOT NULL;

-- DropTable
DROP TABLE "Cart";

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
