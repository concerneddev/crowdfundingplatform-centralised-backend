import express from "express";
import {
    donateCampaign
} from "../controllers/donor.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/donatecampaign", auth, donateCampaign);

export default router;