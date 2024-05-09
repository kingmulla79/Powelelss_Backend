require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import UserModel, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/Errorhandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ejs from "ejs";
import path from "path";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import sendMail from "../utils/sendMail";
import cron from "node-cron";
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendToken,
} from "../utils/jwt";
import { redis } from "../utils/Redis";
import { GetAllUsers, GetUserById } from "../services/user.services";
import { v2 as cloudinary } from "cloudinary";

//register user
interface IRegistrationBody {
  username: string;
  email: string;
  password: string;
  phone?: string;
  avatar?: string;
}

export const UserRegistration = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, email, password, phone } = req.body;

      if (!username || !email! || !password) {
        return next(new ErrorHandler("Please provide all the details", 400));
      }

      const isEmailExist = await UserModel.findOne({ email });
      if (isEmailExist) {
        return next(
          new ErrorHandler(
            "The email is already in use. Please choose another one",
            400
          )
        );
      }
      const isUsernameExist = await UserModel.findOne({ username });
      if (isUsernameExist) {
        return next(
          new ErrorHandler(
            "The username is already in use. Please choose another one",
            400
          )
        );
      }
      const isPhoneNumberExist = await UserModel.findOne({ phone });
      if (isPhoneNumberExist) {
        return next(
          new ErrorHandler(
            "The phone is already in use. Please choose another one",
            400
          )
        );
      }

      //password policy
      const passwordPattern: RegExp =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
      const password_test = passwordPattern.test(password);

      if (!password_test) {
        return next(
          new ErrorHandler(
            "The password must be 8 to 24 characters long with at least one uppercase letter, on lower case letter, one special character i.e [!@#$%] and one number",
            400
          )
        );
      }

      const user: IRegistrationBody = {
        username,
        email,
        password,
        phone,
      };

      const activationToken = createActivationToken(user);
      const activationCode = activationToken.activationCode;
      const data = { user: { username: user.username }, activationCode };
      const html = ejs.renderFile(
        path.join(__dirname, "../mails/Activation-mails.ejs"),
        data
      );
      try {
        await sendMail({
          email: email,
          subject: "QuizzHacks Activation",
          template: "Activation-mails.ejs",
          data,
        })
          .then(() => {
            res.status(201).json({
              success: true,
              message: `Account creation successful. Check the email: ${user.email} for an activation code to complete the setup process`,
              activationToken: activationToken.token,
            });
          })
          .catch((error) => {
            return next(
              new ErrorHandler(
                `Error while sending activation mail. ${error}`,
                400
              )
            );
          });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface IActivationToken {
  token: string;
  activationCode: string;
}

export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
  const token = jwt.sign(
    { user, activationCode },
    process.env.ACTIVATION_SECRET as Secret,
    { expiresIn: process.env.EXPIRE_DURATION }
  );
  return { token, activationCode };
};

//verify user
interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

export const UserActivation = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code } =
        req.body as IActivationRequest;
      if (!activation_token || !activation_code) {
        return next(
          new ErrorHandler(
            "The activation code and token must be provided",
            400
          )
        );
      }
      const newUser: { user: IUser; activationCode: string } = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string
      ) as { user: IUser; activationCode: string };
      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid activation code used", 400));
      }
      const { email, username, password, phone } = newUser.user;

      await UserModel.create({
        email,
        password,
        username,
        phone,
        isVerified: true,
      })
        .then((result) => {
          res.status(201).json({
            success: true,
            message: `Your account has been successfully verified`,
          });
        })
        .catch((error) => {
          return next(new ErrorHandler("Error while verifying user data", 400));
        });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//login user
interface ILoginRequest {
  email: string;
  password: string;
}

export const UserLogin = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest;

      if (!email || !password) {
        return next(
          new ErrorHandler("Please enter both the email and password", 400)
        );
      }
      const user = await UserModel.findOne({ email: email }).select(
        "+password"
      );
      if (!user) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }
      const isPasswordMatch = await user?.comparePassword(password);
      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }
      sendToken(user, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//logout user
export const UserLogout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;
      redis.del(userId);
      res.cookie("access_token", "", { maxAge: 1 });
      res.cookie("refresh_token", "", { maxAge: 1 });
      res.status(200).json({
        success: true,
        message: `User succcessfully logged out`,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update access token
export const UserUpdateAccessToken = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refresh_token as string;
      const decode = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN as string
      ) as JwtPayload;
      if (!decode) {
        return next(new ErrorHandler("Could refresh token", 400));
      }
      const session = await redis.get(decode.id as string);
      if (!session) {
        return next(
          new ErrorHandler("Please login to access these resources", 400)
        );
      }
      const user = JSON.parse(session);
      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN as string,
        {
          expiresIn: "10m",
        }
      );
      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN as string,
        {
          expiresIn: "3d",
        }
      );

      req.user = user;
      res.cookie("access_token", accessToken, accessTokenOptions);
      res.cookie("refresh_token", refreshToken, refreshTokenOptions);

      await redis.set(user._id, JSON.stringify(user), "EX", 604800); //expires in seven days
      console.log("successfully refreshed tokens");

      next();
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//get user by id

export const UserGetUserInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userID = req.user?._id;
      GetUserById(userID, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//get all users

export const UserGetAllUsersInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      GetAllUsers(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// social authentication
interface ISocialAuthBody {
  email: string;
  username: string;
  avatar: string;
}

export const UserSocialAuth = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, username, avatar } = req.body as ISocialAuthBody;
      const existUser = await UserModel.findOne({ email: email });
      if (!existUser) {
        const newUser = await UserModel.create({
          email,
          username,
          avatar,
          isVerified: true,
        });
        sendToken(newUser, 200, res);
      } else {
        sendToken(existUser, 200, res);
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//update user info. (username only)
interface IUpdateUserInfo {
  username?: string;
}

export const UserUpdateInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username } = req.body as IUpdateUserInfo;
      if (!username) {
        return next(new ErrorHandler(`No information to update`, 400));
      }
      const userId = req.user?._id;
      const user = await UserModel.findById(userId);

      if (username && user) {
        const isUsernameExist = await UserModel.findOne({ username: username });
        if (isUsernameExist) {
          return next(
            new ErrorHandler(`A user with this username already exist`, 400)
          );
        }

        user.username = username;
      }
      await user?.save();
      await redis.set(userId, JSON.stringify(user));

      res.status(201).json({
        success: true,
        message: `The username information has been successfully updated`,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//update password

interface IUpdatePassword {
  oldPassword: string;
  newPassword: string;
}

export const UserUpdatePassword = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { oldPassword, newPassword } = req.body as IUpdatePassword;
      if (!oldPassword || !newPassword) {
        return next(
          new ErrorHandler(`Please provide all the information required`, 400)
        );
      }
      const user = await UserModel.findById(req.user?._id).select("+password");

      if (user?.password === undefined) {
        return next(new ErrorHandler(`The password can't be updated`, 400));
      }
      const isPasswordMatch = await user?.comparePassword(oldPassword);

      if (!isPasswordMatch) {
        return next(new ErrorHandler(`Invalid old password`, 400));
      }

      if (isPasswordMatch && oldPassword === newPassword) {
        return next(
          new ErrorHandler(`The old and new passwords cannot be the same`, 400)
        );
      }
      user.password = newPassword;

      await user.save();

      await redis.set(req.user?._id, JSON.stringify(user));
      res.status(200).json({
        success: true,
        message: `Password updated successfully`,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//update avatar
interface IUpdateProfilePic {
  avatar: string;
}

export const UserUpdateProfilePic = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { avatar } = req.body;
      const userId = req.user?._id;

      const user = await UserModel.findById(userId);

      if (avatar && user) {
        // if there is an avatar already
        if (user?.avatar.public_id) {
          // delete old image first
          await cloudinary.uploader.destroy(user?.avatar?.public_id);
          const myCloud = await cloudinary.uploader.upload(avatar, {
            folder: "avatars",
          });
          user.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        } else {
          const myCloud = await cloudinary.uploader.upload(avatar, {
            folder: "avatars",
          });
          user.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        }
      }

      await user?.save();

      await redis.set(userId, JSON.stringify(user));

      res.status(200).json({
        success: true,
        message: "Profile picture successfully updated",
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//update user role to admin
export const UserUpdateRole = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, role } = req.body;
      const user = await UserModel.findOne({ email: email });
      if (!user) {
        return next(
          new ErrorHandler(
            "There is no user with the specified email address",
            400
          )
        );
      }
      if (user.role === role) {
        return next(
          new ErrorHandler(
            "There is updated role is the same as the user role",
            400
          )
        );
      }
      user.role = role;

      await user
        .save()
        .then(() => {
          res.status(200).json({
            success: true,
            message: `The user role successfully updated for ${user.username}`,
            user,
          });
        })
        .catch((error) => {
          return next(new ErrorHandler(error.message, 400));
        });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// delete user
export const UserDeleteUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const user = await UserModel.findByIdAndDelete(id);
      if (!user) {
        return next(new ErrorHandler("The user doesn't exist", 400));
      }

      if (user.avatar.public_id) {
        const avatar = JSON.parse(JSON.stringify(user?.avatar));
        await cloudinary.uploader.destroy(avatar.public_id).then((result) => {
          console.log("Image successfully deleted from cloudinary");
        });
      }
      await redis.del(id).then((result) => {
        console.log("User cache successfully cleared");
      });
      res.status(200).json({
        success: true,
        message: `The user ${user.username} successfully deleted`,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//send reset email
export const UserResetMail = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, link } = req.body;
      if (!email || !link) {
        return next(
          new ErrorHandler("Please provide all the necessary information", 400)
        );
      }

      const isEmailExist = await UserModel.findOne({ email });
      if (!isEmailExist) {
        return next(
          new ErrorHandler("There is no user with the specified mail", 400)
        );
      }

      const data = { link };
      const html = ejs.renderFile(
        path.join(__dirname, "../mails/Reset-Password.ejs"),
        data
      );
      try {
        await sendMail({
          email: email,
          subject: "QuizzHacks Activation",
          template: "Reset-Password.ejs",
          data,
        });

        res.status(201).json({
          success: true,
          message: `Email successfully sent. Check your mail to reset your password`,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface IForgotPassword {
  password: string;
  passwordConfirm: string;
}
//forgot password
export const UserForgotPassword = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const email = req.params.email;
      const { password, passwordConfirm } = req.body as IForgotPassword;
      if (!password || !passwordConfirm) {
        return next(
          new ErrorHandler(`Please provide all the information required`, 400)
        );
      }
      if (password !== passwordConfirm) {
        return next(new ErrorHandler(`Both passwords must match`, 400));
      }
      const user = await UserModel.findOne({ email: email }).select(
        "+password"
      );
      if (!user) {
        return next(new ErrorHandler(`No user with the provided email`, 400));
      }

      user.password = password;

      await user.save();

      await redis.set(req.user?._id, JSON.stringify(user));
      res.status(200).json({
        success: true,
        message: `Password updated successfully`,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//delete unverified users
cron.schedule("0 * * * *", async () => {
  const anHourAgo = new Date(Date.now() - 1 * 60 * 60 * 1000);
  await UserModel.deleteMany({
    isVerified: false,
    createdAt: { $lt: anHourAgo },
  });
  console.log("_____________");
  console.log("running cron: deleting unverified users");
});
