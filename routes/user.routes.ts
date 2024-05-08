import express from "express";
import {
  UserActivation,
  UserLogin,
  UserLogout,
  UserRegistration,
} from "../controllers/user.controllers";
const UserRouter = express.Router();

UserRouter.post("/register", UserRegistration);
UserRouter.post("/user-activation", UserActivation);
UserRouter.post("/login", UserLogin);
UserRouter.post("/logout", UserLogout);

export default UserRouter;
