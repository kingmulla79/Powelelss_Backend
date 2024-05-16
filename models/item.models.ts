import mongoose, { Document, Model, Schema } from "mongoose";
export interface IItems extends Document {
  name: string;
  desc: string;
  category: string;
  price: number;
  product_photo: {
    public_id: string;
    url: string;
  };
  purpose: string;
}

const ItemSchema: Schema<IItems> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    product_photo: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
    purpose: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ItemModel: Model<IItems> = mongoose.model("Item", ItemSchema);

export default ItemModel;
