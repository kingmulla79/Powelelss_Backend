import mongoose, { Document, Model, ObjectId, Schema } from "mongoose";
export interface IAllowances extends Document {
  id_no: string;
  month: string;
  year: string;
  arrears: string;
  house: string;
  imprest_amount: string;
  transport: string;
  staff_member: Object;
}

const AllowanceSchema: Schema<IAllowances> = new mongoose.Schema(
  {
    staff_member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
    },
    id_no: {
      type: String,
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    arrears: {
      type: String,
      required: true,
    },
    house: {
      type: String,
      required: true,
    },
    imprest_amount: {
      type: String,
      required: true,
    },
    transport: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const AllowanceModel: Model<IAllowances> = mongoose.model(
  "Allowance",
  AllowanceSchema
);

export default AllowanceModel;
