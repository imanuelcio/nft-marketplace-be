import { StatusCodes } from "http-status-codes";
import { body, param, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
export const validate = (req: Request, res: Response, next: NextFunction) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Validation Failed",
      error: error.array()[0].msg,
    });
  }

  next(); // Return void instead of Response
};

export const profileUpdateValidation = [
  body("username")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be between 3 and 20 characters"),
  body("email").optional().isEmail().withMessage("Must be valid email address"),
  body("bio")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Bio must be between 3 and 100 characters"),
  body("avatar_url").optional().isURL().withMessage("Must be valid URL"),
  body("banner_url").optional().isURL().withMessage("Must be valid URL"),
  // validate,
];

export const profileParamsValidation = [
  param("idOrWallet")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("ID or wallet address is required"),
];

export const validationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validate(req, res, next);
};
