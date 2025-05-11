import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { rateLimit } from "express-rate-limit";
import * as authService from "../services/auth.services";

export const authRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    StatusCodes: StatusCodes.TOO_MANY_REQUESTS,
    message: "Too many requests from this IP, please try again after an hour",
  },
});

export const getNonce = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { walletAddress } = req.params;

    if (!walletAddress || !walletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid wallet address",
        error: "Invalid wallet address",
      });
    }

    const result = await authService.getNonce(walletAddress);
    console.log(result);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const verifySignature = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { walletAddress, signature } = req.body;

    const { token } = await authService.verifySignature(
      walletAddress,
      signature
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      // secure: process.env.NODE_ENV === "production", // hanya HTTPS kalau production :)
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 hari
    });

    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Login success" });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie("token");
    res.json({ success: true, message: "Logout success" });
  } catch (error) {
    next(error);
  }
};
