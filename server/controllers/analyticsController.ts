import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAssyncError } from "../middleware/catchAssyncErrors";
import { generateLast12MonthsData } from "../utils/analytics.generator";
import CourseModel from "../models/course.model";
import userModel from "../models/user.model";
import OrderModel from "../models/order.model";

//Get user analytics --- only admin
export const getUsersAnalytics = CatchAssyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await generateLast12MonthsData(userModel);

      res.status(200).json({
        success: true,
        users,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//Get courses analytics --- only admin
export const getCoursesAnalytics = CatchAssyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courses = await generateLast12MonthsData(CourseModel);

      res.status(200).json({
        success: true,
        courses,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//Get orders analytics --- only admin
export const getOrdersAnalytics = CatchAssyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await generateLast12MonthsData(OrderModel);

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
