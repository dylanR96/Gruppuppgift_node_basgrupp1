import { Router } from "express";
import {
  createOrder,
  getOrderStatus,
  changeOrder,
  deleteItem,
  completeOrder,
  getOrder,
} from "../controllers/orderController.js";

const router = Router();

// Hämta varukorg
router.get("/getOrder/:orderId", getOrder);

// Ändra varukorg
router.put("/changeOrder", changeOrder);

// Skapa order
router.post("/createOrder", createOrder);

// Ta bort produkt från varukorg
router.delete("/deleteItem", deleteItem);

// Orderstatus
router.get("/createOrder/orderStatus/:orderId", getOrderStatus);

router.post("/completeOrder/:orderId", completeOrder);

export default router;
