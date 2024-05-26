import express from "express";

import { UserUpdateAccessToken } from "../controllers/user.controllers";
import { authorizedRoles, isAuthenticated } from "../middleware/Auth";
import {
  AllExpensesData,
  DeleteExpenseData,
  ExpenseCodeRetrieve,
  ExpenseEntry,
  SingleExpenseData,
  UpdateExpenseData,
} from "../controllers/expense.controllers";

const ExpenseRouter = express.Router();

ExpenseRouter.get(
  "/get-count",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  ExpenseCodeRetrieve
);
ExpenseRouter.post(
  "/new-expense",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  ExpenseEntry
);
ExpenseRouter.get(
  "/single-expense/:id",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  SingleExpenseData
);
ExpenseRouter.get(
  "/all-expenses",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  AllExpensesData
);
ExpenseRouter.put(
  "/update-expense/:id",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  UpdateExpenseData
);
ExpenseRouter.delete(
  "/delete-expense/:id",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  DeleteExpenseData
);

export default ExpenseRouter;
