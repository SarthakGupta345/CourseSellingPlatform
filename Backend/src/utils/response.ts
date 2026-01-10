import { Response } from "express";

export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  error?: any
) => {
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
