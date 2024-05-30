import { Router } from "express";

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
