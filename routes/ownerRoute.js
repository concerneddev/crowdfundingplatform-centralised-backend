import express from "express";
import {
    createCampaign
} from "../controllers/owner.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/createCampaign", auth, createCampaign);

export default router;