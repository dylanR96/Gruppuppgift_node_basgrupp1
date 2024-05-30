import { Router } from "express";
import { createUser } from "../controllers/usersController.js";

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
router.post("/createUser", createUser);

export default router;
