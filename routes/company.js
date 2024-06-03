import { Router } from "express";
// import getMenu from "../controllers/companyController.js";

const router = Router();

// Hämta menyn
// router.get("/menu", getMenu);

// Hämta information om företaget
router.get("/companyInfo", (req, res) => {
  res.send("<h1>Om AirBean</h1>");
});

export default router;
