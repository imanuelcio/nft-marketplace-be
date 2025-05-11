import { StatusCodes } from "http-status-codes";
import { Response } from "express";
import { ApiResponse } from "../types/user.type";

export const responseHandler = {
  success<T>(
    res: Response,
    message: string,
    data?: T,
    statusCode = StatusCodes.OK
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      message: message,
    };

    if (data !== undefined) {
      response.data = data;
    }

    return res.status(statusCode).json(response);
  },

  error(
    res: Response,
    message: string,
    error: string,
    statusCode = StatusCodes.BAD_REQUEST
  ): Response {
    const response: ApiResponse<null> = {
      success: false,
      message,
    };

    if (error !== undefined) {
      response.error = error;
    }

    return res.status(statusCode).json(response);
  },

  notFound(res: Response, message = "Resource not found"): Response {
    return this.error(res, message, "Not Found", StatusCodes.NOT_FOUND);
  },

  unauthorized(res: Response, message: "Unauthorized"): Response {
    return this.error(res, message, "unauthorized", StatusCodes.UNAUTHORIZED);
  },

  forbidden(res: Response, message = "Access forbidden"): Response {
    return this.error(res, message, "Forbidden", StatusCodes.FORBIDDEN);
  },
};
