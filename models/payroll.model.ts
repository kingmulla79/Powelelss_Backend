import mongoose, { Document, Model, Schema } from "mongoose";
export interface IPayroll extends Document {
  id_no: string;
  net_salary: Number;
  remitted_amount: Number;
  outstanding_amount: Number;
  date_of_payment: string;
  staff_member: Object;
}

const PayrollSchema: Schema<IPayroll> = new mongoose.Schema(
  {
    staff_member: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Staff",
      required: true,
    },
    id_no: {
      type: String,
      required: true,
    },
    net_salary: {
      type: Number,
      required: true,
    },
    remitted_amount: {
      type: Number,
    },
    outstanding_amount: {
      type: Number,
    },
    date_of_payment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const PayrollModel: Model<IPayroll> = mongoose.model("Payroll", PayrollSchema);

export default PayrollModel;
