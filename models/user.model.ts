require("dotenv").config();
import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const emailPattern: RegExp =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const passwordPattern: RegExp =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  avatar: {
    public_id: string;
    url: string;
  };
  phone: string;
  role: string;
  isVerified: boolean;
  comparePassword: (password: string) => Promise<boolean>;
  AccessToken: () => string;
  RefreshToken: () => string;
}

const UserSchema: Schema<IUser> = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please enter a username"],
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: function (value: string) {
          return emailPattern.test(value);
        },
        message: "Please enter a valid email",
      },
      unique: true,
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
      minlength: [8, "Please enter more than 8 characters"],
      maxlength: [24, "Ensure the password is not more than 24 characters"],
      validate: {
        validator: function (value: string) {
          return passwordPattern.test(value);
        },
        message: "Please enter a valid password",
      },
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    role: {
      type: String,
      default: "admin",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

//password hash
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// compare password
UserSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<Boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Access token
UserSchema.methods.AccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN || "", {
    expiresIn: "5m",
  });
};

//Refresh token
UserSchema.methods.RefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN || "", {
    expiresIn: "3d",
  });
};

// UserSchema.statics.isThisUsernameInUse = async function (username) {
//   if (!username) throw new Error("Invalid username: No username provided");
//   try {
//     const user = await this.findOne({ username });
//     if (user) {
//       return false;
//     } else {
//       return true;
//     }
//   } catch (error: any) {
//     console.log("Error inside isThisUsernameInUse method", error.message);
//     return false;
//   }
// };

// UserSchema.statics.isThisEmailInUse = async function (email) {
//   if (!email) throw new Error("Invalid email: No email provided");
//   try {
//     const user = await this.findOne({ email });
//     if (user) {
//       return false;
//     } else {
//       return true;
//     }
//   } catch (error: any) {
//     console.log("Error inside isThisEmailInUse method", error.message);
//     return false;
//   }
// };

const UserModel: Model<IUser> = mongoose.model("User", UserSchema);

export default UserModel;
