import { Request, Response, NextFunction } from "express";
import SaleModel, { ISale } from "../models/sale.model";
import ErrorHandler from "../utils/Errorhandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import { GetAllSales, GetSaleById } from "../services/sale.services";

export const SaleCodeRetrieve = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const latest_sale = await SaleModel.findOne().sort({
        createdAt: -1,
      });

      if (!latest_sale) {
        // there is no record saved yet, count defaults to 1
        res.status(200).json({
          success: true,
          message: "Count successfully retrieved",
          count: 1,
        });
      } else {
        res.status(200).json({
          success: true,
          message: "Count successfully retrieved",
          count: latest_sale.count + 1,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//new sale entry
export const SaleEntry = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        sale_no,
        client_name,
        client_email,
        client_address,
        client_contact_number,
        sale_date,
        sale_due_date,
        terms,
        sale_type,
        sale_details,
        status,
        count,
      } = req.body as ISale;
      if (
        !sale_no &&
        !client_name &&
        !client_address &&
        !client_email &&
        !client_contact_number &&
        !sale_date &&
        !sale_due_date &&
        !terms &&
        !sale_type &&
        !sale_details &&
        !status &&
        !count
      ) {
        return next(
          new ErrorHandler(`Please provide all the required information`, 422)
        );
      }

      await SaleModel.create({
        sale_no,
        client_name,
        client_email,
        client_address,
        client_contact_number,
        sale_date,
        sale_due_date,
        terms,
        sale_type,
        sale_details,
        status,
        count,
      })
        .then(() => {
          res.status(201).json({
            success: true,
            messsage: `Sale data saved successfully`,
          });
        })
        .catch((error) => {
          return next(
            new ErrorHandler(
              `The sale data save operation was unsuccessful - ${error}`,
              500
            )
          );
        });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//single sale data
export const SingleSaleData = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) {
        return next(new ErrorHandler("There is no ID provided", 422));
      }
      GetSaleById(id, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
export const SaleFilter = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.params;
      const sale = await SaleModel.find({ sale_type: type });
      if (sale.length === 0) {
        return next(
          new ErrorHandler(
            `There is no record with the sale type: ${type}`,
            500
          )
        );
      }
      res.status(200).json({
        success: true,
        message: "Data successfully fetched",
        sale,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//sale data
export const AllSalesData = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      GetAllSales(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//update sale data
export const UpdateSaleData = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        sale_no,
        client_name,
        client_email,
        client_address,
        client_contact_number,
        sale_date,
        sale_due_date,
        terms,
        sale_type,
        sale_details,
        status,
        count,
      } = req.body as ISale;
      if (
        !sale_no &&
        !client_name &&
        !client_address &&
        !client_email &&
        !client_contact_number &&
        !sale_date &&
        !sale_due_date &&
        !terms &&
        !sale_type &&
        !sale_details &&
        !status &&
        !count
      ) {
        return next(
          new ErrorHandler(`Please provide all the required information`, 422)
        );
      }

      const { id } = req.params;

      const sale = await SaleModel.findById(id);
      if (!sale) {
        new ErrorHandler("There is no sale with the specified id", 409);
      }
      if (sale && sale_no) {
        sale.sale_no = sale_no;
      }
      if (sale && client_name) {
        sale.client_name = client_name;
      }

      if (sale && client_address) {
        sale.client_address = client_address;
      }
      if (sale && client_email) {
        sale.client_email = client_email;
      }
      if (sale && client_contact_number) {
        sale.client_contact_number = client_contact_number;
      }
      if (sale && sale_date) {
        sale.sale_date = sale_date;
      }
      if (sale && sale_due_date) {
        sale.sale_due_date = sale_due_date;
      }
      if (sale && terms) {
        sale.terms = terms;
      }
      if (sale && sale_type) {
        sale.sale_type = sale_type;
      }
      if (sale && sale_details) {
        sale.sale_details = sale_details;
      }
      if (sale && status) {
        sale.status = status;
      }
      if (sale && count) {
        sale.count = count;
      }

      await sale
        ?.save()
        .then(() => {
          res.status(201).json({
            success: true,
            message: "Information successfully updated",
            sale,
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

// delete sale
export const DeleteSaleData = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const sale = await SaleModel.findByIdAndDelete(id);
      if (!sale) {
        return next(new ErrorHandler("The sale doesn't exist", 409));
      }

      res.status(200).json({
        success: true,
        message: `The sale data successfully deleted`,
        sale,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
