import express from "express";
import {
    profile,
    userDonations,
    userCampaigns
} from "../controllers/user.js";
import auth from "../middleware/auth.js";

const router = express.Router();

route.get("/profile", auth, profile);
route.get("/userDonations", auth, userDonations);
route.get("/userCampaigns", auth, userCampaigns);