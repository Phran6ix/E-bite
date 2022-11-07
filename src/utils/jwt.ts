import * as jwt from "jsonwebtoken";

export async function sendToken(payload: any) {
  if (!process.env.JWT_SECRET) {
    throw new Error("Error has occured");
  }
  const token = await jwt.sign(payload, process.env.JWT_SECRET);
  return token;
}

export async function verifyToken(payload: any) {
  if (!process.env.JWT_SECRET) {
    throw new Error("Error has occured");
  }
  return await jwt.verify(payload, process.env.JWT_SECRET);
}
