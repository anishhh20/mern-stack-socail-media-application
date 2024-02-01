import express from "express";
import { getAds } from "../controllers/ads.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/getads", verifyToken, getAds);

export default router;