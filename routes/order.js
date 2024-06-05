import { Router } from "express";
import {
  createOrder,
  getOrderStatus,
  changeOrder,
  deleteItem,
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

// Ta bort produkt från varukorg
router.delete("/deleteItem/:orderId", deleteItem);

// Orderstatus
router.get("/createOrder/orderStatus/:orderId", getOrderStatus);

export default router;
