import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { responseHandler } from "../utils/responseHandler";
import { asyncHandler } from "../middleware/error.middleware";
import { userService } from "../services/user.services";
import { UserInput } from "../types/user.type";

export const userController = {
  /**
   * Get all users
   * @route GET /api/users
   * @access Private (requires authentication)
   */
  getAllUsers: asyncHandler(async (req: Request, res: Response) => {
    const users = await userService.getAllUser();
    return responseHandler.success(res, "Users fetched successfully", users);
  }),

  /**
   * Get user profile by ID or wallet address
   * @route GET /api/users/:idOrWallet
   * @access Private (requires authentication)
   */
  getUserProfile: asyncHandler(async (req: Request, res: Response) => {
    const { idOrWallet } = req.params;
    const user = await userService.getUserProfile(idOrWallet);

    if (!user) {
      return responseHandler.notFound(res, "User not found");
    }

    return responseHandler.success(
      res,
      "User profile fetched successfully",
      user
    );
  }),

  /**
   * Update user profile
   * @route PUT /api/users/:id
   * @access Private (requires authentication and ownership)
   */
  updateUserProfile: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userData = req.body as UserInput;

    // Ensure the authenticated user matches the requested user ID
    if (!req.user || id !== req.user.userId) {
      return responseHandler.forbidden(
        res,
        "You do not have permission to update this profile"
      );
    }

    try {
      const updatedUser = await userService.updateProfile(
        id,
        req.user.walletAddress,
        userData
      );
      return responseHandler.success(
        res,
        "User profile updated successfully",
        updatedUser,
        StatusCodes.OK
      );
    } catch (error) {
      if (error instanceof Error && error.message.includes("not found")) {
        return responseHandler.notFound(res, "User not found");
      }
      if (error instanceof Error && error.message.includes("does not match")) {
        return responseHandler.forbidden(
          res,
          "Wallet address does not match user ID"
        );
      }
      throw error;
    }
  }),
};
