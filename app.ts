require("dotenv").config();
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { ErrorMiddleware } from "./middleware/Error";
import UserRouter from "./routes/user.routes";
import CustomerRouter from "./routes/customer.routes";
import StaffRouter from "./routes/staff.routes";
import ItemRouter from "./routes/item.routes";
import AllowanceRouter from "./routes/allowances.routes";
export const app = express();

//body parser
app.use(express.json());

//cookie parser
app.use(cookieParser());

//cors
app.use(cors({ origin: process.env.ORIGIN }));

app.use(express.urlencoded({ extended: true }));

// dev log messages
app.use(morgan("dev"));

//apis
app.use("/api/auth", UserRouter);
app.use("/api/customer", CustomerRouter);
app.use("/api/staff", StaffRouter);
app.use("/api/item", ItemRouter);
app.use("/api/allowance", AllowanceRouter);

// middleware to catch error from unknown routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

app.use(ErrorMiddleware);
