import { Router } from "express";
const router = Router();

// Logga in användare
router.get("/loginUser", (req, res) => {
  //   console.log("Inloggad");
});

// Hämta orderhistorik för inloggad användare
router.get("/loginUser/orderHistory", (req, res) => {
  //   console.log("Orderhistorik");
});

// Skapa användare
router.post("/createUser", (req, res) => {
  res.status(201).json({ message: "Användare skapad" });
  //   console.log("Användare skapad");
});

export default router;
