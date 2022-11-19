import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { sendToken, verifyToken } from "../../utils/jwt";
import sendOTP from "../../helper/sendOTP";
import { hashPassword, comparePassword } from "../../utils/bcrypt";
import response from "../../utils/response";
import AppError from "../../utils/AppError";
import * as crypto from "crypto";
import Email from "../../utils/email";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        firstName: string;
        lastName: string;
        role: string;
        address: string;
        email: string;
        password: string;
        phoneNo: string;
        Cart?: any;
        Review?: any;
        Product?: any;
        Order?: any;
      };
      //  [key: string]: string | number | object };
    }
  }
}

const prisma = new PrismaClient();

export async function signUp(req: Request, res: Response, next: NextFunction) {
  const { firstName, lastName, address, email } = req.body;

  let phoneNo: any = req.body.phoneNo;

  if (req.body.password != req.body.confirmPassword) {
    return next(new AppError("Passwords are not the same", 400));
  }

  let password = await hashPassword(req.body.password);

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      phoneNo,
      password,
      address,
      profilePic: "",
    },
  });

  let otp = await sendOTP(user);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      OTP: otp,
    },
  });

  response(res, 201, "Success", {});
}

export async function verifyOTP(req: Request, res: Response, next: NextFunction) {
  const OTP: number = req.body.otp;

  if (!OTP || !req.body.email) {
    return next(new AppError("Invalid Input", 400));
  }

  const user = await prisma.user.findUnique({
    where: {
      email: req.body?.email,
    },
  });

  if (!user || user.OTP !== OTP) {
    return next(new AppError("Invalid input", 400));
  }

  await prisma.user.update({
    where: {
      email: req.body.email,
    },
    data: {
      isVerfied: true,
      OTP: null,
    },
  });
  response(res, 204, "Success", {});
}

export async function userLogin(req: Request, res: Response, next: NextFunction) {
  let user;

  if (req.body.query.includes("@")) {
    user = await prisma.user.findUnique({
      where: {
        email: req.body.query,
      },
      select: {
        isVerfied: true,
        password: true,
        firstName: true,
        role: true,
        id: true,
        phoneNo: true,
        email: true,
        Order: true,
        Review: true,
      },
    });
  }

  if (!user || !(await comparePassword(req.body.password, user.password))) {
    return next(new AppError("Invalid credentials", 400));
  }

  const token = await sendToken(user.id);

  if (!user.isVerfied) {
    res.status(403).json({
      message: "User is not found",
    });
  } else {
    res.status(200).json({
      status: "Success",
      token,
      data: user,
    });
  }
}

export async function protect(req: Request, res: Response, next: NextFunction) {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("You are not logged in", 400));
  }

  const decodeUser = await verifyToken(token);

  if (!decodeUser) {
    return next(new AppError("Invalid Token", 400));
  }
  const user = await prisma.user.findUnique({
    where: {
      id: +decodeUser,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      address: true,
      password: true,
      phoneNo: true,
      Review: true,
      Product: true,
      Order: true,
      role: true,
      email: true,
    },
  });
  if (!user) {
    return next(new AppError("Invalid Token, User not found", 404));
  }

  req.user = user;
  next();
}

export async function updatePassword(req: Request, res: Response, next: NextFunction) {
  const user = req.user;
  if (!user) {
    return next(new AppError("An error occured", 400));
  }

  if (!(await comparePassword(req.body.password, user.password))) {
    return next(new AppError("Invalid password", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new AppError("Passwords are not the same", 400));
  }

  const password = await hashPassword(req.body.newPassword);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password,
    },
  });

  response(res, 204, "Success", {});
}

export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  if (!req.body.email) {
    return next(new AppError("Fields cannot be empty", 400));
  }
  const email = req.body.email;

  const random = crypto.randomBytes(64).toString("hex");
  const resetToken = await crypto.createHash("sha256").update(random).digest("hex");
  let user;
  try {
    user = await prisma.user.update({
      where: {
        email,
      },

      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: Date.now(),
      },
    });
  } catch (err: any) {
    return next(new AppError(`Error: ${err.message}`, err.status));
  }

  const url = `${req.protocol}://${req.get("host")}/api/v1/auth/reset-password/${random}`;
  await new Email(user, `Your reset password link: ${url}`).send("Reset your password");

  response(res, 204, "Success", {});
}

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  const token = req.params.token;
  const resetToken: string = await crypto.createHash("sha256").update(token).digest("hex");

  if (req.body.password != req.body.confirmPassword) {
    return next(new AppError("passwords are not the same", 400));
  }
  const password = await hashPassword(req.body.password);

  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: resetToken,
    },
  });

  if (!user || !user.passwordResetExpires) {
    return next(new AppError("User not found", 404));
  }
  if (user.passwordResetExpires + 600000 < Date.now()) {
    return next(new AppError("Token expired, please try again", 400));
  }

  console.log(user.passwordResetExpires + 600000 > Date.now(), Date.now());

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password,
      passwordResetToken: "",
    },
  });
  response(res, 200, "Success", {});
}

export function restrict(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("You are not authorized", 403));
    }
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You are not authorized", 403));
    }
    next();
  };
}

export async function resendOTP(req: Request, res: Response, next: NextFunction) {
  const { email } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const otp = await sendOTP(user);
  await prisma.user.update({
    where: {
      email,
    },
    data: {
      OTP: otp,
    },
  });

  res.status(200).json({
    message: "OTP has been sent",
  });
}
