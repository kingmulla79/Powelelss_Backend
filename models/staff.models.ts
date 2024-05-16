import mongoose, { Document, Model, Schema } from "mongoose";
export interface IStaff extends Document {
  id_no: string;
  first_name: string;
  surname: string;
  phone_no: string;
  job_title: string;
  P_no: string;
  basic_salary: number;
}

const StaffSchema: Schema<IStaff> = new mongoose.Schema(
  {
    id_no: {
      type: String,
      require: true,
      unique: true,
    },
    first_name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    phone_no: {
      type: String,
      required: true,
      unique: true,
    },
    job_title: {
      type: String,
      required: true,
    },
    P_no: {
      type: String,
      required: true,
      unique: true,
    },
    basic_salary: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const StaffModel: Model<IStaff> = mongoose.model("Staff", StaffSchema);

export default StaffModel;
