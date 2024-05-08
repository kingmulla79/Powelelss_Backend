require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import UserModel, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/Errorhandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ejs from "ejs";
import path from "path";
import jwt, { Secret } from "jsonwebtoken";
import sendMail from "../utils/sendMail";
import cron from "node-cron";
import { sendToken } from "../utils/jwt";
import { redis } from "../utils/Redis";

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
      // const userId = req.user?._id;
      // redis.del(userId);
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
