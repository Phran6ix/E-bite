import { NextFunction, Request, Response } from "express";
import response from "../../utils/response";

function sendError(err: any, req: Request, res: Response, next: NextFunction) {
  return response(res, err.statusCode, err.status, {
    message: err.message,
    error: err,
  });
}

function ErrorController(err: any, req: Request, res: Response, next: NextFunction) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status;

  sendError(err, req, res, next);
}

export default ErrorController;
