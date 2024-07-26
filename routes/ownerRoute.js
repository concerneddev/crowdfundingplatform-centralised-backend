import express from "express";
import {
    createCampaign,
    withdrawCampaign
} from "../controllers/owner.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/createcampaign", auth, createCampaign);
router.post("/withdrawcampaign", auth, withdrawCampaign);

export default router;