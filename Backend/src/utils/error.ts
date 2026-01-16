// utils/AppError.ts
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly type: string;
  public readonly errors?: unknown[];

  constructor(
    statusCode: number,
    message: string,
    type: string = "APP_ERROR",
    errors?: unknown[]
  ) {
    super(message);

    this.statusCode = statusCode;
    this.type = type;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}
