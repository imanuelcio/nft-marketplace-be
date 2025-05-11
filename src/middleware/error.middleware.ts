import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

export const ErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log(`error : ${error.message}`);
  console.log(error.stack);

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: "An Internal server error",
    error:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : error.message,
  });
  return;
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: `Cant ${req.method} ${req.originalUrl}`,
    error: "Not found",
  });
  return;
};

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
