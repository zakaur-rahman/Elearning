import expresss from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { createOrder, getAllOrders } from "../controllers/orderController";
const orderRouter = expresss.Router();

orderRouter.post("/create-order", isAuthenticated, createOrder);
orderRouter.post(
  "/get-orders",
  isAuthenticated,
  authorizeRoles("admin"),
  getAllOrders
);
export default orderRouter;
