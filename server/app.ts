import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/error";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.route";
import analyticsRouter from "./routes/analytics.route";
import notificationRouter from "./routes/notification.route";
import layoutRouter from "./routes/layout.route";
require("dotenv").config();

export const app = express();
app.use(express.json({ limit: "50mb" }));

app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials:true,
  })
);

//Routers
app.use(
  "/api/v1",
  userRouter,
  courseRouter,
  orderRouter,
  notificationRouter,
  analyticsRouter,
  layoutRouter
);

// Testing API
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "API is working",
  });
});

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const error = new Error("Not Found") as any;
  error.statusCode = 404;
  next(error);
});

app.use(ErrorMiddleware);
