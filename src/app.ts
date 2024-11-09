import express, { type Express } from "express";
import morgan from "morgan";
import userRouter from "@/routes/user.routes";
import authRouter from "@/routes/auth.routes";
import tokenAuthAdmin from "@/middlewares/validator-token-admin";
import cookieParser from "cookie-parser";
import adminRouter from "@/routes/admin.routes";
import cors from "cors";

const app: Express = express();

const prefix = "/api/";

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    allowedHeaders: "*",
  })
);

app.use(prefix + "auth", authRouter);
app.use(prefix + "users", userRouter);
app.use(prefix + "admin", tokenAuthAdmin, adminRouter);

export default app;
