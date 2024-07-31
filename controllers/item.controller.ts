import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/Errorhandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ItemModel, { IItems } from "../models/item.models";
import { v2 as cloudinary } from "cloudinary";
import { GetAllItems, GetItemById } from "../services/item.services";

//new item
export const ItemEntry = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, desc, category, price, product_pic, purpose } = req.body;
      if (!name && !desc && !category && !price) {
        return next(
          new ErrorHandler(`Please provide all the required information`, 422)
        );
      }
      let product_photo = {};
      if (product_pic) {
        const myCloud = await cloudinary.uploader.upload(product_pic, {
          folder: "products",
        });

        product_photo = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      await ItemModel.create({
        name,
        desc,
        category,
        price,
        product_photo,
        purpose,
      })
        .then(() => {
          res
            .status(201)
            .json({ success: true, message: "Item data saved successfully" });
        })
        .catch((error: any) => {
          return next(
            new ErrorHandler("The data save operation was unsuccessful", 500)
          );
        });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//single item data
export const SingleItemData = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) {
        return next(new ErrorHandler("There is no ID provided", 422));
      }
      GetItemById(id, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//single item data
export const AllItems = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      GetAllItems(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
interface IItemDataUpdate {
  name: string;
  desc: string;
  category: string;
  price: number;
  product_pic: string;
  purpose: string;
}

//update item data
export const UpdateItemData = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, desc, price, category, product_pic, purpose } =
        req.body as IItemDataUpdate;

      const { id } = req.params;
      if (!name && !desc && !price && !category && !product_pic && !purpose) {
        return next(
          new ErrorHandler("There is no information provided as an update", 422)
        );
      }
      const item = await ItemModel.findById(id);
      if (!item) {
        new ErrorHandler("There is no item with the specified id", 409);
      }
      if (item && name) {
        item.name = name;
      }
      if (item && desc) {
        item.desc = desc;
      }
      if (item && price) {
        item.price = price;
      }
      if (item && category) {
        item.category = category;
      }
      if (item && product_pic) {
        if (item.product_photo.public_id) {
          await cloudinary.uploader.destroy(item?.product_photo?.public_id);
        }
        const myCloud = await cloudinary.uploader.upload(product_pic, {
          folder: "products",
        });
        item.product_photo = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      if (item && purpose) {
        item.purpose = purpose;
      }

      await item
        ?.save()
        .then(() => {
          res.status(201).json({
            success: true,
            message: "Information successfully updated",
            item,
          });
        })
        .catch((error: any) => {
          return next(new ErrorHandler(error.message, 500));
        });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// delete staff
export const DeleteItemData = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const item = await ItemModel.findByIdAndDelete(id);
      if (!item) {
        return next(new ErrorHandler("The item doesn't exist", 409));
      }

      res.status(201).json({
        success: true,
        message: `The item ${item.name} successfully deleted`,
        item,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
