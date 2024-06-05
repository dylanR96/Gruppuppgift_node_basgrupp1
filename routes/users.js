import { Router } from "express";
import { createUser, login, logout } from "../controllers/usersController.js";

const router = Router();

// Log in user
router.post("/loginUser", login);

// Create user
router.post("/createUser", createUser);

// Log out user
router.post("/logout", logout);

export default router;
