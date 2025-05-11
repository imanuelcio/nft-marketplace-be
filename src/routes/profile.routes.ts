import { Router } from "express";
import { userController } from "../controllers/profile.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  profileParamsValidation,
  profileUpdateValidation,
  validationMiddleware,
} from "../middleware/validator.middleware";
const profileRouter = Router();

profileRouter.get(
  "/user/:idOrWallet",
  profileParamsValidation,
  validationMiddleware,
  authMiddleware,
  userController.getUserProfile
);

profileRouter.post(
  "/user/:id",
  ...profileUpdateValidation, // <== spread array
  validationMiddleware,
  authMiddleware,
  userController.updateUserProfile
);
export default profileRouter;
