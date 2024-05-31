import { Router } from "express";
import { deleteItem } from "../controllers/orderController.js";

const router = Router();

// Hämta varukorg
router.get("/getOrder", (req, res) => {
  res.send("<h1>Visa varukorg</h1>");
});

// Ändra varukorg
router.put("/changeOrder", (req, res) => {
  res.sendStatus(200);
});

// Skapa order
router.post("/createOrder", (req, res) => {
  res.sendStatus(201);
});

// Ta bort produkt från varukorg
router.delete("/deleteItem", deleteItem);

// Orderstatus
router.post("/createOrder/orderStatus", (req, res) => {
  res.sendStatus(200);
});

export default router;
