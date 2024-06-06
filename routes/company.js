import { Router } from "express";

const router = Router();

// Get menu
router.get("/menu", getMenu);

// Get information about the company
router.get("/companyInfo", getCompanyInfo);

export default router;
