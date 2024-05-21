import express from "express";

import { UserUpdateAccessToken } from "../controllers/user.controllers";
import { authorizedRoles, isAuthenticated } from "../middleware/Auth";
import {
  AllAllowancesData,
  AllowanceEntry,
  DeleteAllowanceData,
  SingleAllowanceData,
  UpdateAllowanceData,
} from "../controllers/allowances.controllers";

const AllowanceRouter = express.Router();

AllowanceRouter.post(
  "/new-allowance",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  AllowanceEntry
);
AllowanceRouter.get(
  "/single-allowance-data/:id",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  SingleAllowanceData
);
AllowanceRouter.get(
  "/allowance-data",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  AllAllowancesData
);
AllowanceRouter.put(
  "/allowance-update/:id",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  UpdateAllowanceData
);
AllowanceRouter.delete(
  "/delete-allowance/:id",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  DeleteAllowanceData
);

export default AllowanceRouter;
