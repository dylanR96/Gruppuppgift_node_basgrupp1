import { Router } from "express";
import { createUser, login } from "../controllers/usersController.js";

const router = Router();

// Logga in användare
router.post("/loginUser", login);

// Hämta orderhistorik för inloggad användare
router.get("/loginUser/orderHistory", (req, res) => {
  //   console.log("Orderhistorik");
});

// Skapa användare
router.post("/createUser", createUser);

export default router;
