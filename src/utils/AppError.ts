class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: Boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
