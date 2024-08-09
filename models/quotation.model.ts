import mongoose, { Document, Model, Schema } from "mongoose";

interface IQuotationDetails extends Document {
  itemDescription: string;
  quantity: number;
  price: number;
  unit: string;
  subTotal: number;
  tax: number;
  discount: number;
  amountPayable: number;
}
export interface IQuotation extends Document {
  quotation_no: string;
  client_name: string;
  client_email: string;
  client_address: string;
  client_contact_number: string;
  quotation_date: string;
  quotation_due_date: string;
  terms: string;
  quotation_type: string;
  quotation_details: IQuotationDetails[];
  status: string;
  count: number;
}

const QuotationDetailsSchema = new Schema<IQuotationDetails>({
  itemDescription: String,
  quantity: Number,
  price: Number,
  unit: String,
  subTotal: Number,
  tax: Number,
  discount: Number,
  amountPayable: Number,
});

const QuotationSchema = new Schema<IQuotation>(
  {
    quotation_no: {
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
    quotation_date: {
      type: String,
      required: true,
    },
    quotation_due_date: {
      type: String,
      required: true,
    },
    terms: {
      type: String,
      required: true,
    },
    quotation_type: {
      type: String,
      required: true,
    },
    quotation_details: [QuotationDetailsSchema],
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

const QuotationModel: Model<IQuotation> = mongoose.model(
  "Quotation",
  QuotationSchema
);

export default QuotationModel;
