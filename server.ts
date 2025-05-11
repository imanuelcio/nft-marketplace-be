import express, { Request, Response } from "express";
import config from "./src/config/config";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./src/routes/auth.routes";
import profileRouter from "./src/routes/profile.routes";
const app = express();
dotenv.config();

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
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
