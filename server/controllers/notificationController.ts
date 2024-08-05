import NotificationModel from "../models/notification.model";
import { NextFunction, Request, Response } from "express";
import { CatchAssyncError } from "../middleware/catchAssyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cron from "node-cron"
export const notification = CatchAssyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notification = await NotificationModel.find().sort({
        createdAt: -1,
      });

      res.status(201).json({
        success: true,
        notification,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Update notifications status
export const updateNotification = CatchAssyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notification = await NotificationModel.findById(req.params.id);

      if (!notification) {
        return next(
          new ErrorHandler("No notification found with the given id", 404)
        );
      } else {
        notification.status
          ? notification.status === "read"
          : notification?.status;
      }

      await notification.save();

      res.status(201).json({
        success: true,
        notification,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Delete Notification Admin only

cron.schedule("0 0 0 * * *", async () => {

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  await NotificationModel.deleteMany({
    status: "read", createdAt: { $lt: thirtyDaysAgo }
  })
  console.log('Deleted read notification');
})