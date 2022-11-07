import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import response from "../../utils/response";
import AppError from "../../utils/AppError";

const prisma = new PrismaClient();

export async function getUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      address: true,
      phoneNo: true,
      role: true,
    },
  });

  response(res, 200, "Success", users);
}

export async function getUserById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id: number = +req.params.id;

  if (!id) return new AppError("Invalid Id", 400);
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      address: true,
      phoneNo: true,
      role: true,
    },
  });
  if (!user) return next(new AppError("User not found", 404));
  response(res, 200, "Success", user);
}

export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.body.password | req.body.role)
    return next(new AppError("Invalid route", 400));

  const id = parseInt(req.params.id);
  const { firstName, lastName, address, phoneNo } = req.body;

  const user = await prisma.user.update({
    where: {
      id,
    },
    data: {
      firstName,
      lastName,
      address,
      phoneNo,
    },
  });

  response(res, 200, "Success", user);
}

export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = parseInt(req.params.id);

  const user = await prisma.user.delete({
    where: {
      id,
    },
  });

  response(res, 204, "Error", {});
}
