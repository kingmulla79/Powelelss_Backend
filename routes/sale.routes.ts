import express from "express";

import { UserUpdateAccessToken } from "../controllers/user.controllers";
import { authorizedRoles, isAuthenticated } from "../middleware/Auth";
import {
  AllSalesData,
  DeleteSaleData,
  SaleCodeRetrieve,
  SaleEntry,
  SaleFilter,
  SingleSaleData,
  UpdateSaleData,
} from "../controllers/sale.controllers";

const SaleRouter = express.Router();

SaleRouter.get(
  "/get-count",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  SaleCodeRetrieve
);
SaleRouter.post(
  "/new-sale",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  SaleEntry
);
SaleRouter.get(
  "/single-sale/:id",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  SingleSaleData
);
SaleRouter.get(
  "/sale-type/:type",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  SaleFilter
);
SaleRouter.get(
  "/all-sales",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  AllSalesData
);
SaleRouter.put(
  "/update-sale/:id",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  UpdateSaleData
);
SaleRouter.delete(
  "/delete-sale/:id",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  DeleteSaleData
);

export default SaleRouter;
