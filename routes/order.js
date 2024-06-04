import { Router } from "express";
import {
  createOrder,
  getOrderStatus,
  changeOrder,
  deleteItem,
  completeOrder,
  orderHistory,
} from "../controllers/orderController.js";

const router = Router();

// Hämta varukorg
router.get("/getOrder", (req, res) => {
  res.send("<h1>Visa varukorg</h1>");
});

// Ändra varukorg
router.put("/changeOrder", changeOrder);

// Skapa order
router.post("/createOrder", createOrder);

// Töm varukorg
router.delete("/deleteItem", deleteItem);

// Orderstatus
router.get("/createOrder/orderStatus/:orderId", getOrderStatus);

router.post("/completeOrder/:orderId", completeOrder);

// Orderhistorik
router.get("/orderHistory/:userId", orderHistory);

export default router;
