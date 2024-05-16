import mongoose, { Document, Model, Schema } from "mongoose";

const emailPattern: RegExp =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export interface ICustomer extends Document {
  name: string;
  address: string;
  email: string;
  contact_person: string;
  phone: string;
  invoice_history: Object;
}

const CustomerSchema: Schema<ICustomer> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
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
    contact_person: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      unique: true,
      required: true,
    },
    invoice_history: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
    },
  },
  { timestamps: true }
);

const CustomerModel: Model<ICustomer> = mongoose.model(
  "Customer",
  CustomerSchema
);

export default CustomerModel;
