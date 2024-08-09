import express from "express";

import { UserUpdateAccessToken } from "../controllers/user.controllers";
import { authorizedRoles, isAuthenticated } from "../middleware/Auth";
import {
  AllInvoicesData,
  DeleteInvoiceData,
  InvoiceCodeRetrieve,
  InvoiceEntry,
  InvoiceFilter,
  SingleInvoiceData,
  UpdateInvoiceData,
} from "../controllers/invoice.controllers";

const InvoiceRouter = express.Router();

InvoiceRouter.get(
  "/get-count",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  InvoiceCodeRetrieve
);
InvoiceRouter.post(
  "/new-invoice",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  InvoiceEntry
);
InvoiceRouter.get(
  "/single-invoice/:id",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  SingleInvoiceData
);
InvoiceRouter.get(
  "/invoice-type/:type",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  InvoiceFilter
);
InvoiceRouter.get(
  "/all-invoices",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  AllInvoicesData
);
InvoiceRouter.put(
  "/update-invoice/:id",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  UpdateInvoiceData
);
InvoiceRouter.delete(
  "/delete-invoice/:id",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  DeleteInvoiceData
);

export default InvoiceRouter;
