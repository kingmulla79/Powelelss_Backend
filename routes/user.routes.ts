import express from "express";
import {
  UserActivation,
  UserDeleteUser,
  UserForgotPassword,
  UserGetAllUsersInfo,
  UserGetUserInfo,
  UserLogin,
  UserLogout,
  UserRegistration,
  UserResetMail,
  UserSocialAuth,
  UserUpdateAccessToken,
  UserUpdateInfo,
  UserUpdatePassword,
  UserUpdateProfilePic,
  UserUpdateRole,
} from "../controllers/user.controllers";
import { authorizedRoles, isAuthenticated } from "../middleware/Auth";
const UserRouter = express.Router();

UserRouter.post("/register", UserRegistration);
UserRouter.post("/user-activation", UserActivation);
UserRouter.post("/login", UserLogin);
UserRouter.post("/logout", UserLogout);
UserRouter.get(
  "/get-user-info",
  UserUpdateAccessToken,
  isAuthenticated,
  UserGetUserInfo
);
UserRouter.get(
  "/get-all-users-info",
  UserUpdateAccessToken,
  isAuthenticated,
  UserGetAllUsersInfo
);
UserRouter.get("/social-auth", UserSocialAuth);
UserRouter.put(
  "/update-info",
  UserUpdateAccessToken,
  isAuthenticated,
  UserUpdateInfo
);
UserRouter.put(
  "/update-password",
  UserUpdateAccessToken,
  isAuthenticated,
  UserUpdatePassword
);
UserRouter.put(
  "/update-profile-pic",
  UserUpdateAccessToken,
  isAuthenticated,
  UserUpdateProfilePic
);
UserRouter.put(
  "/update-user-role",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  UserUpdateRole
);
UserRouter.delete(
  "/delete-user/:id",
  UserUpdateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  UserDeleteUser
);

UserRouter.post("/send-reset-email", UserResetMail);
UserRouter.post("/forgot-password/:email", UserForgotPassword);

export default UserRouter;
