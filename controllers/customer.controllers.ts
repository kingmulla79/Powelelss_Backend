import { Request, Response, NextFunction } from "express";
import CustomerModel, { ICustomer } from "../models/customer.models";
import ErrorHandler from "../utils/Errorhandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import {
  GetAllCustomers,
  GetCustomerById,
} from "../services/customer.services";

export const CustomerEntry = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, address, contact_person, phone } =
      req.body as ICustomer;

    await CustomerModel.create({ name, email, address, contact_person, phone })
      .then(() =>
        res
          .status(201)
          .json({ success: true, message: "Customer successfully saved" })
      )
      .catch((error) => {
        return next(
          new ErrorHandler(
            `The customer data save operation was unsuccessful - ${error}`,
            400
          )
        );
      });
  }
);

export const CustomerDetails = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      GetAllCustomers(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
export const SingleCustomerDetails = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      GetCustomerById(id, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface ICustomerUpdate {
  name?: string;
  address?: string;
  email?: string;
  contact_person?: string;
  phone?: string;
}
export const UpdateCustomerDetails = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, address, email, contact_person, phone } =
        req.body as ICustomerUpdate;
      const { id } = req.params;
      if (!name && !email && !contact_person && !address && !phone) {
        return next(
          new ErrorHandler("There is no information provided as an update", 400)
        );
      }
      const customer = await CustomerModel.findById(id);
      if (!customer) {
        new ErrorHandler("There is no customer with the specified id", 400);
      }
      if (customer && name) {
        customer.name = name;
      }
      if (customer && email) {
        customer.email = email;
      }
      if (customer && address) {
        customer.address = address;
      }
      if (customer && contact_person) {
        customer.contact_person = contact_person;
      }
      if (customer && phone) {
        customer.phone = phone;
      }
      await customer
        ?.save()
        .then(() => {
          res.status(201).json({
            success: true,
            message: "Information successfully updated",
            customer,
          });
        })
        .catch((error: any) => {
          return next(new ErrorHandler(error.message, 400));
        });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// delete customer
export const DeleteCustomerData = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const customer = await CustomerModel.findByIdAndDelete(id);
      if (!customer) {
        return next(new ErrorHandler("The customer doesn't exist", 400));
      }

      res.status(200).json({
        success: true,
        message: `The customer ${customer.name} successfully deleted`,
        customer,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
