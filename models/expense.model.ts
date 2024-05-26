import mongoose, { Document, Model, Schema } from "mongoose";
export interface IExpenses extends Document {
  code: string;
  service_item_name: string;
  total_cost: string;
  recorded_by: string;
  date: string;
  count: number;
}

const Expenseschema: Schema<IExpenses> = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    service_item_name: {
      type: String,
      required: true,
    },
    total_cost: {
      type: String,
      required: true,
    },
    recorded_by: {
      type: String,
      required: true,
    },
    date: {
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

const ExpenseModel: Model<IExpenses> = mongoose.model("Expense", Expenseschema);

export default ExpenseModel;
