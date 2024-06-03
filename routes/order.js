import { Router } from "express";
import { createOrder, changeOrder } from "../controllers/orderController.js";

const router = Router();

// Hämta varukorg
router.get("/getOrder", (req, res) => {
  res.send("<h1>Visa varukorg</h1>");
});

// Ändra varukorg
router.put("/changeOrder", changeOrder);

// Skapa order
router.post("/createOrder", createOrder);

// Ta bort order från varukorg
router.delete("/deleteItem", (req, res) => {
  res
    .status(200)
    .json({ message: "Produkten har tagits bort från kundvagnen" });
});

// Orderstatus
router.post("/createOrder/orderStatus", (req, res) => {
  res.sendStatus(200);
});

export default router;
