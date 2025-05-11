import { Router } from "express";
import {
  getNonce,
  logout,
  verifySignature,
} from "../controllers/auth.controller";
const authRouter = Router();

authRouter.get("/auth/nonce/:walletAddress", getNonce);
authRouter.post("/auth/verify", verifySignature);
authRouter.post("/auth/logout", logout);

export default authRouter;
