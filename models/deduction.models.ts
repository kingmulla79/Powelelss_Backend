import mongoose, { Document, Model, Schema } from "mongoose";
export interface IDeductions extends Document {
  id_no: string;
  month: string;
  year: string;
  nhif: string;
  nssf: string;
  advances: string;
  taxes: string;
  staff_member: Object;
}

const DeductionSchema: Schema<IDeductions> = new mongoose.Schema(
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
    nhif: {
      type: String,
      required: true,
    },
    nssf: {
      type: String,
      required: true,
    },
    advances: {
      type: String,
      required: true,
    },
    taxes: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const DeductionModel: Model<IDeductions> = mongoose.model(
  "Deduction",
  DeductionSchema
);

export default DeductionModel;
