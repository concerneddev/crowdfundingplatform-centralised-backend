import express from "express";
import {
    campaignById,
    profile,
    userCampaigns,
    userDonations,
    campaignDonations,
    campaignsByTag,
    donationById,
    campaignsListRecent
} from "../controllers/user.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/profile/:id?", auth, profile); 
router.get("/campaigns/:id?", auth, userCampaigns);
router.get("/campaignsrecent", campaignsListRecent)
router.get("/donations/:id?", auth, userDonations);
router.get("/campaign/:id?", auth, campaignById);
router.get("/campaigndonations/:id", auth, campaignDonations);
router.get("/campaignsbytag/:tag", auth, campaignsByTag);
router.get("/donation/:id", auth, donationById);
export default router;