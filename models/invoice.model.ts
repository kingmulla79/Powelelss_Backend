import mongoose, { Document, Model, Schema } from "mongoose";

interface IInvoiceDetails extends Document {
  itemDescription: string;
  quantity: number;
  price: number;
  unit: string;
  subTotal: number;
  tax: number;
  discount: number;
  amountPayable: number;
}
export interface IInvoice extends Document {
  invoice_no: string;
  client_name: string;
  client_email: string;
  client_address: string;
  client_contact_number: string;
  invoice_date: string;
  invoice_due_date: string;
  terms: string;
  invoice_type: string;
  invoice_details: IInvoiceDetails[];
  status: string;
  count: number;
}

const InvoiceDetailsSchema = new Schema<IInvoiceDetails>({
  itemDescription: String,
  quantity: Number,
  price: Number,
  unit: String,
  subTotal: Number,
  tax: Number,
  discount: Number,
  amountPayable: Number,
});

const InvoiceSchema = new Schema<IInvoice>(
  {
    invoice_no: {
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
    invoice_date: {
      type: String,
      required: true,
    },
    invoice_due_date: {
      type: String,
      required: true,
    },
    terms: {
      type: String,
      required: true,
    },
    invoice_type: {
      type: String,
      required: true,
    },
    invoice_details: [InvoiceDetailsSchema],
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

const InvoiceModel: Model<IInvoice> = mongoose.model("Invoice", InvoiceSchema);

export default InvoiceModel;
