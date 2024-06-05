import { Router } from "express";
import { createUser, login, logout } from "../controllers/usersController.js";
import authenticate from "../middleware/auth.js";

const router = Router();

// Logga in användare
router.post("/loginUser", login);

// Hämta orderhistorik för inloggad användare
// router.get("/loginUser/orderHistory", authenticate, (req, res) => {
// });

// Skapa användare
router.post("/createUser", createUser);

// Logga ut användare
router.post("/logout", logout);

export default router;
