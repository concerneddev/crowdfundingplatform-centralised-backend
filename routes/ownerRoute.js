import express from "express";
import upload from "../middleware/multerConfig.js";
import {
    createCampaign,
    withdrawCampaign
} from "../controllers/owner.js";
import auth from "../middleware/auth.js";
import { uploadController } from "../controllers/uploadController.js";

const router = express.Router();

router.post("/createcampaign", auth, upload.single('image'), createCampaign);
router.post("/upload", auth, upload.single('image'), uploadController);

router.post("/withdrawcampaign", auth, withdrawCampaign);

export default router;