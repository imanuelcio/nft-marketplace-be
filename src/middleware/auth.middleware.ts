import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt";
import { StatusCodes } from "http-status-codes";
import { AuthToken } from "../types/user.type";

interface CustomRequest extends Request {
  user?: any;
}

export const authMiddleware = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized: Token not found in cookies",
        error: "Unauthorized",
      });
      return;
    }

    const decoded = verifyJwt(token) as AuthToken;

    req.user = {
      userId: decoded.userId,
      walletAddress: decoded.walletAddress,
    };

    next();
  } catch (error: any) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Invalid token",
      error: error.message,
    });
  }
};
