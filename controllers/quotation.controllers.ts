import { Request, Response, NextFunction } from "express";
import QuotationModel, { IQuotation } from "../models/quotation.model";
import ErrorHandler from "../utils/Errorhandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import {
  GetQuotationById,
  GetAllQuotations,
} from "../services/quotations.services";

export const QuotationCodeRetrieve = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const latest_quotation = await QuotationModel.findOne().sort({
        createdAt: -1,
      });

      if (!latest_quotation) {
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
          count: latest_quotation.count + 1,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//new quotation entry
export const QuotationEntry = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        quotation_no,
        client_name,
        client_email,
        client_address,
        client_contact_number,
        quotation_date,
        quotation_due_date,
        terms,
        quotation_type,
        quotation_details,
        count,
      } = req.body as IQuotation;
      if (
        !quotation_no &&
        !client_name &&
        !client_address &&
        !client_email &&
        !client_contact_number &&
        !quotation_date &&
        !quotation_due_date &&
        !terms &&
        !quotation_type &&
        !quotation_details &&
        !count
      ) {
        return next(
          new ErrorHandler(`Please provide all the required information`, 422)
        );
      }

      await QuotationModel.create({
        quotation_no,
        client_name,
        client_email,
        client_address,
        client_contact_number,
        quotation_date,
        quotation_due_date,
        terms,
        quotation_type,
        quotation_details,
        count,
      })
        .then(() => {
          res.status(201).json({
            success: true,
            messsage: `Quotation data saved successfully`,
          });
        })
        .catch((error) => {
          return next(
            new ErrorHandler(
              `The quotation data save operation was unsuccessful - ${error}`,
              500
            )
          );
        });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//single quotation data
export const SingleQuotationData = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) {
        return next(new ErrorHandler("There is no ID provided", 422));
      }
      GetQuotationById(id, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//quotation data
export const AllQuotationsData = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      GetAllQuotations(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//update quotation data
export const UpdateQuotationData = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        quotation_no,
        client_name,
        client_email,
        client_address,
        client_contact_number,
        quotation_date,
        quotation_due_date,
        terms,
        quotation_type,
        quotation_details,
        count,
      } = req.body as IQuotation;
      if (
        !quotation_no &&
        !client_name &&
        !client_address &&
        !client_email &&
        !client_contact_number &&
        !quotation_date &&
        !quotation_due_date &&
        !terms &&
        !quotation_type &&
        !quotation_details &&
        !count
      ) {
        return next(
          new ErrorHandler(`Please provide all the required information`, 422)
        );
      }

      const { id } = req.params;

      const quotation = await QuotationModel.findById(id);
      if (!quotation) {
        new ErrorHandler("There is no quotation with the specified id", 409);
      }
      if (quotation && quotation_no) {
        quotation.quotation_no = quotation_no;
      }
      if (quotation && client_name) {
        quotation.client_name = client_name;
      }

      if (quotation && client_address) {
        quotation.client_address = client_address;
      }
      if (quotation && client_email) {
        quotation.client_email = client_email;
      }
      if (quotation && client_contact_number) {
        quotation.client_contact_number = client_contact_number;
      }
      if (quotation && quotation_date) {
        quotation.quotation_date = quotation_date;
      }
      if (quotation && quotation_due_date) {
        quotation.quotation_due_date = quotation_due_date;
      }
      if (quotation && terms) {
        quotation.terms = terms;
      }
      if (quotation && quotation_type) {
        quotation.quotation_type = quotation_type;
      }
      if (quotation && quotation_details) {
        quotation.quotation_details = quotation_details;
      }
      if (quotation && count) {
        quotation.count = count;
      }

      await quotation
        ?.save()
        .then(() => {
          res.status(201).json({
            success: true,
            message: "Information successfully updated",
            quotation,
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

// delete quotation
export const DeleteQuotationData = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const quotation = await QuotationModel.findByIdAndDelete(id);
      if (!quotation) {
        return next(new ErrorHandler("The quotation doesn't exist", 409));
      }

      res.status(200).json({
        success: true,
        message: `The quotation data successfully deleted`,
        quotation,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
