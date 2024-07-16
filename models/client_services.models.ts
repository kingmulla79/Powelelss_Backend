import mongoose, { Document, Model, Schema } from "mongoose";

export interface IService extends Document {
  client_name: string;
  invoice_code: string;
  work_location: string;
  scope: string;
  scope_description: string;
  staff_member: Object;
  work_duration: number;
  date: string;
  cost: number;
  count: number;
}

const ServiceSchema: Schema<IService> = new mongoose.Schema({
  client_name: {
    type: String,
    required: true,
  },
  invoice_code: {
    type: String,
    required: true,
  },
  work_location: {
    type: String,
    required: true,
  },
  scope: {
    type: String,
    required: true,
  },
  scope_description: {
    type: String,
    required: true,
  },
  staff_member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
  },
  work_duration: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
});

const ServiceModel: Model<IService> = mongoose.model("Service", ServiceSchema);

export default ServiceModel;
