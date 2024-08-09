import { Request, Response, NextFunction } from "express";
import InvoiceModel, { IInvoice } from "../models/invoice.model";
import ErrorHandler from "../utils/Errorhandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import { GetAllInvoices, GetInvoiceById } from "../services/invoice.services";

export const InvoiceCodeRetrieve = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const latest_invoice = await InvoiceModel.findOne().sort({
        createdAt: -1,
      });

      if (!latest_invoice) {
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
          count: latest_invoice.count + 1,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//new invoice entry
export const InvoiceEntry = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        invoice_no,
        client_name,
        client_email,
        client_address,
        client_contact_number,
        invoice_date,
        invoice_due_date,
        terms,
        invoice_type,
        invoice_details,
        status,
        count,
      } = req.body as IInvoice;
      if (
        !invoice_no &&
        !client_name &&
        !client_address &&
        !client_email &&
        !client_contact_number &&
        !invoice_date &&
        !invoice_due_date &&
        !terms &&
        !invoice_type &&
        !invoice_details &&
        !status &&
        !count
      ) {
        return next(
          new ErrorHandler(`Please provide all the required information`, 422)
        );
      }

      await InvoiceModel.create({
        invoice_no,
        client_name,
        client_email,
        client_address,
        client_contact_number,
        invoice_date,
        invoice_due_date,
        terms,
        invoice_type,
        invoice_details,
        status,
        count,
      })
        .then(() => {
          res.status(201).json({
            success: true,
            messsage: `Invoice data saved successfully`,
          });
        })
        .catch((error) => {
          return next(
            new ErrorHandler(
              `The invoice data save operation was unsuccessful - ${error}`,
              500
            )
          );
        });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//single invoice data
export const SingleInvoiceData = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) {
        return next(new ErrorHandler("There is no ID provided", 422));
      }
      GetInvoiceById(id, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
export const InvoiceFilter = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.params;
      const invoice = await InvoiceModel.find({ invoice_type: type });
      if (invoice.length === 0) {
        return next(
          new ErrorHandler(
            `There is no record with the invoice type: ${type}`,
            500
          )
        );
      }
      res.status(200).json({
        success: true,
        message: "Data successfully fetched",
        invoice,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//invoice data
export const AllInvoicesData = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      GetAllInvoices(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//update invoice data
export const UpdateInvoiceData = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        invoice_no,
        client_name,
        client_email,
        client_address,
        client_contact_number,
        invoice_date,
        invoice_due_date,
        terms,
        invoice_type,
        invoice_details,
        status,
        count,
      } = req.body as IInvoice;
      if (
        !invoice_no &&
        !client_name &&
        !client_address &&
        !client_email &&
        !client_contact_number &&
        !invoice_date &&
        !invoice_due_date &&
        !terms &&
        !invoice_type &&
        !invoice_details &&
        !status &&
        !count
      ) {
        return next(
          new ErrorHandler(`Please provide all the required information`, 422)
        );
      }

      const { id } = req.params;

      const invoice = await InvoiceModel.findById(id);
      if (!invoice) {
        new ErrorHandler("There is no invoice with the specified id", 409);
      }
      if (invoice && invoice_no) {
        invoice.invoice_no = invoice_no;
      }
      if (invoice && client_name) {
        invoice.client_name = client_name;
      }

      if (invoice && client_address) {
        invoice.client_address = client_address;
      }
      if (invoice && client_email) {
        invoice.client_email = client_email;
      }
      if (invoice && client_contact_number) {
        invoice.client_contact_number = client_contact_number;
      }
      if (invoice && invoice_date) {
        invoice.invoice_date = invoice_date;
      }
      if (invoice && invoice_due_date) {
        invoice.invoice_due_date = invoice_due_date;
      }
      if (invoice && terms) {
        invoice.terms = terms;
      }
      if (invoice && invoice_type) {
        invoice.invoice_type = invoice_type;
      }
      if (invoice && invoice_details) {
        invoice.invoice_details = invoice_details;
      }
      if (invoice && status) {
        invoice.status = status;
      }
      if (invoice && count) {
        invoice.count = count;
      }

      await invoice
        ?.save()
        .then(() => {
          res.status(201).json({
            success: true,
            message: "Information successfully updated",
            invoice,
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

// delete invoice
export const DeleteInvoiceData = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const invoice = await InvoiceModel.findByIdAndDelete(id);
      if (!invoice) {
        return next(new ErrorHandler("The invoice doesn't exist", 409));
      }

      res.status(200).json({
        success: true,
        message: `The invoice data successfully deleted`,
        invoice,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
