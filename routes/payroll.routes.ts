import express from "express";

import { UserUpdateAccessToken } from "../controllers/user.controllers";
import { authorizedRoles, isAuthenticated } from "../middleware/Auth";
import { PayrollEntry } from "../controllers/payroll.controllers";

const PayrollRouter = express.Router();

PayrollRouter.post(
  "/payroll-entry",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  PayrollEntry
);

export default PayrollRouter;
