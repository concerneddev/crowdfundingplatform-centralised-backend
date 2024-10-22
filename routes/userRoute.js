import express from "express";
import {
    campaignById,
    profile,
    userCampaigns,
    userDonations,
    campaignDonations,
    campaignsByTag,
    donationById,
    campaignsListRecent,
    tagsList,
} from "../controllers/user.js";
import { checkHealthDb, checkHealthServer } from "../controllers/healthCheck.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/profile/:id?", auth, profile); 
router.get("/campaigns/:id?", auth, userCampaigns);
router.get("/campaignsrecent", campaignsListRecent)
router.get("/donations/:id?", auth, userDonations);
router.get("/campaign/:id", auth, campaignById);
router.get("/campaigndonations/:id", auth, campaignDonations);
router.get("/tagslist", auth, tagsList);
router.get("/campaignsbytag/:tag", auth, campaignsByTag);
router.get("/donation/:id", auth, donationById);
router.get("/healthdb", checkHealthDb);
router.get("/healthserver", checkHealthServer);

export default router;