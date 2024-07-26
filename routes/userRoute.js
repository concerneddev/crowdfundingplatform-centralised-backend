import express from "express";
import {
    myProfile
} from "../controllers/user.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/profile", auth, myProfile);

export default router;