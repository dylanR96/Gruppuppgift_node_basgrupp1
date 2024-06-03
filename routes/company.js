import { Router } from "express";
import { getMenu, getCompanyInfo } from "../controllers/companyController.js";

const router = Router();

// Hämta menyn
router.get("/menu", getMenu);

// Hämta information om företaget
router.get("/companyInfo", getCompanyInfo);

export default router;
