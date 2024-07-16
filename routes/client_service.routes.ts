import express from "express";

import { UserUpdateAccessToken } from "../controllers/user.controllers";
import { authorizedRoles, isAuthenticated } from "../middleware/Auth";
import {
  AllServicesData,
  DeleteServiceData,
  ServiceCodeRetrieve,
  ServiceEntry,
  SingleServiceData,
  UpdateServiceData,
} from "../controllers/client_services.controllers";

const ServiceRouter = express.Router();

ServiceRouter.get(
  "/get-count",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  ServiceCodeRetrieve
);

ServiceRouter.post(
  "/new-service",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  ServiceEntry
);
ServiceRouter.get(
  "/single-service/:id",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  SingleServiceData
);
ServiceRouter.get(
  "/all-services",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  AllServicesData
);
ServiceRouter.put(
  "/update-service/:id",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  UpdateServiceData
);
ServiceRouter.delete(
  "/delete-service/:id",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  DeleteServiceData
);

export default ServiceRouter;
