import express from "express";
import {
  CustomerDetails,
  CustomerEntry,
  DeleteCustomerData,
  SingleCustomerDetails,
  UpdateCustomerDetails,
} from "../controllers/customer.controllers";
import { UserUpdateAccessToken } from "../controllers/user.controllers";
import { authorizedRoles, isAuthenticated } from "../middleware/Auth";
const CustomerRouter = express.Router();

CustomerRouter.post(
  "/new-customer",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  CustomerEntry
);
CustomerRouter.get(
  "/get-all-customers",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  CustomerDetails
);
CustomerRouter.get(
  "/get-single-customer/:id",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  SingleCustomerDetails
);
CustomerRouter.put(
  "/update-customer-info/:id",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  UpdateCustomerDetails
);
CustomerRouter.delete(
  "/delete-customer-data/:id",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  DeleteCustomerData
);

export default CustomerRouter;
