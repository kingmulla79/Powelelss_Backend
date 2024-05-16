import express from "express";

import { UserUpdateAccessToken } from "../controllers/user.controllers";
import { authorizedRoles, isAuthenticated } from "../middleware/Auth";
import {
  AllItems,
  DeleteItemData,
  ItemEntry,
  SingleItemData,
  UpdateItemData,
} from "../controllers/item.controller";

const ItemRouter = express.Router();

ItemRouter.post(
  "/new-item",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  ItemEntry
);
ItemRouter.get(
  "/get-single-item/:id",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  SingleItemData
);
ItemRouter.get(
  "/get-all-items",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  AllItems
);
ItemRouter.put(
  "/update-item/:id",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  UpdateItemData
);
ItemRouter.delete(
  "/delete-item/:id",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  DeleteItemData
);

export default ItemRouter;
