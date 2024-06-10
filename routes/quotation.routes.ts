import express from "express";

import { UserUpdateAccessToken } from "../controllers/user.controllers";
import { authorizedRoles, isAuthenticated } from "../middleware/Auth";
import {
  AllQuotationsData,
  DeleteQuotationData,
  QuotationCodeRetrieve,
  QuotationEntry,
  SingleQuotationData,
  UpdateQuotationData,
} from "../controllers/quotation.controllers";

const QuotationRouter = express.Router();

QuotationRouter.get(
  "/get-count",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  QuotationCodeRetrieve
);
QuotationRouter.post(
  "/new-quotation",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  QuotationEntry
);
QuotationRouter.get(
  "/single-quotation/:id",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  SingleQuotationData
);
QuotationRouter.get(
  "/all-quotations",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  AllQuotationsData
);
QuotationRouter.put(
  "/update-quotation/:id",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  UpdateQuotationData
);
QuotationRouter.delete(
  "/delete-quotation/:id",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  DeleteQuotationData
);

export default QuotationRouter;
