import { response, Response } from "express";
export default function (
  response: Response,
  statusCode: number,
  status: "Success" | "Error",
  message: object
) {
  return response.status(statusCode).json({
    status: status,
    data: message,
  });
}
