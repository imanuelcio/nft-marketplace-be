import express, { Request, Response } from "express";
import config from "./src/config/config";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./src/routes/auth.routes";
import profileRouter from "./src/routes/profile.routes";
import uploadToIPFS from "./src/utils/IPFS";
import path from "path";
const app = express();
dotenv.config();

const allowedOrigin = ["http://localhost:3000", "https://cio-nft.vercel.app/"];

app.use(cookieParser());
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
    // methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    // allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use("/api", authRouter);
app.use("/api", profileRouter);
app.get("/", (req: Request, res: Response) => {
  res.json({
    status: "success",
    message: "Hello im backend typesript 🐼!",
  });
});

app.listen(config.port, async () => {
  console.log(`✳️  Server running on port ${config.port}`);
});
