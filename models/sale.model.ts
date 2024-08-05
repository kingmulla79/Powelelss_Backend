import mongoose, { Document, Model, Schema } from "mongoose";

interface ISaleDetails extends Document {
  itemDescription: string;
  quantity: number;
  price: number;
  unit: string;
  subTotal: number;
  tax: number;
  discount: number;
  amountPayable: number;
}
export interface ISale extends Document {
  sale_no: string;
  client_name: string;
  client_email: string;
  client_address: string;
  client_contact_number: string;
  sale_date: string;
  sale_due_date: string;
  terms: string;
  sale_type: string;
  sale_details: ISaleDetails[];
  status: string;
  count: number;
}

const SaleDetailsSchema = new Schema<ISaleDetails>({
  itemDescription: String,
  quantity: Number,
  price: Number,
  unit: String,
  subTotal: Number,
  tax: Number,
  discount: Number,
  amountPayable: Number,
});

const SaleSchema = new Schema<ISale>(
  {
    sale_no: {
      type: String,
      required: true,
    },
    client_name: {
      type: String,
      // required: true,
    },
    client_email: {
      type: String,
      // required: true,
    },
    client_address: {
      type: String,
      // required: true,
    },
    client_contact_number: {
      type: String,
      // required: true,
    },
    sale_date: {
      type: String,
      required: true,
    },
    sale_due_date: {
      type: String,
      required: true,
    },
    terms: {
      type: String,
      required: true,
    },
    sale_type: {
      type: String,
      required: true,
    },
    sale_details: [SaleDetailsSchema],
    status: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  { timestamps: true }
);

const SaleModel: Model<ISale> = mongoose.model("Sale", SaleSchema);

export default SaleModel;
