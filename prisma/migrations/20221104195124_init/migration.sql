/*
  Warnings:

  - A unique constraint covering the columns `[OTP]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phoneNo]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_OTP_key" ON "User"("OTP");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNo_key" ON "User"("phoneNo");
