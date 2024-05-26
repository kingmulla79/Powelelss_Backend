import express from "express";

import { UserUpdateAccessToken } from "../controllers/user.controllers";
import { authorizedRoles, isAuthenticated } from "../middleware/Auth";
import {
  AllDeductionsData,
  DeductionEntry,
  DeleteDeductionData,
  SingleDeductionData,
  UpdateDeductionData,
} from "../controllers/deductions.controllers";

const DeductionRouter = express.Router();

DeductionRouter.post(
  "/new-deduction",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  DeductionEntry
);
DeductionRouter.get(
  "/single-deduction/:id",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  SingleDeductionData
);
DeductionRouter.get(
  "/all-deductions",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  AllDeductionsData
);
DeductionRouter.put(
  "/update-deduction/:id",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  UpdateDeductionData
);
DeductionRouter.delete(
  "/delete-deduction/:id",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  DeleteDeductionData
);

export default DeductionRouter;
