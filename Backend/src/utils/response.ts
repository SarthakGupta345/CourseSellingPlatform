import { NextFunction, Response, Request, RequestHandler } from "express";

export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  error?: any
) => {
  console.log(`Generated error: ${message}`);
  return res.status(statusCode).json({
    success: false,
    message,
    error,
  });
};

export const sendSuccess = (
  res: Response,
  statusCode: number,
  message: string,
  data?: any
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};


export const asyncHandler =
  (
    fn: (
      req: Request,
      res: Response,
      next: NextFunction
    ) => Promise<unknown>
  ): RequestHandler =>
    (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };