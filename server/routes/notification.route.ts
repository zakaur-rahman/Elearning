import expresss from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import {
  notification,
  updateNotification,
} from "../controllers/notificationController";
const notificationRouter = expresss.Router();

notificationRouter.get(
  "/get-all-notifications",
  isAuthenticated,
  authorizeRoles("admin"),
  notification
);
notificationRouter.put(
  "/update-notifications/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  updateNotification
);
export default notificationRouter;

