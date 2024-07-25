import express from "express";
import {
    createCampaign,
    withdrawCampaign
} from "../controllers/owner.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/createCampaign", auth, createCampaign);
router.post("/withdrawCampaign", auth, withdrawCampaign);

export default router;