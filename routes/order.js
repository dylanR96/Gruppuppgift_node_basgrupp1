import { Router } from "express";
import {
  createOrder,
  getOrderStatus,
  changeOrder,
  deleteItem,
  completeOrder,
  orderHistory,
  getOrder,
} from "../controllers/orderController.js";
import authenticate from "../middleware/auth.js";

const router = Router();

// Get cart
router.get("/getOrder/:orderId", getOrder);

// Change order
router.put("/changeOrder/:orderId", changeOrder);

// Create order
router.post("/createOrder", createOrder);

// Remove item from cart
router.delete("/deleteItem/:orderId", deleteItem);

// Orderstatus
router.get("/orderStatus/:orderId", getOrderStatus);

// Complete order
router.post("/completeOrder/:orderId", completeOrder);

// Order history and authentication
router.get("/orderHistory/:userId", authenticate, orderHistory);

export default router;
