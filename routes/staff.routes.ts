import express from "express";

import { UserUpdateAccessToken } from "../controllers/user.controllers";
import { authorizedRoles, isAuthenticated } from "../middleware/Auth";
import {
  AllStaffData,
  DeleteStaffData,
  SingleStaffData,
  StaffEntry,
  UpdateStaffData,
} from "../controllers/staff.controllers";
const StaffRouter = express.Router();

StaffRouter.post(
  "/new-employee",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  StaffEntry
);
StaffRouter.get(
  "/get-single-staff/:id",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  SingleStaffData
);
StaffRouter.get(
  "/get-all-staff-data",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  AllStaffData
);
StaffRouter.put(
  "/update-staff-data/:id",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  UpdateStaffData
);
StaffRouter.delete(
  "/delete-staff-data/:id",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  DeleteStaffData
);

export default StaffRouter;
