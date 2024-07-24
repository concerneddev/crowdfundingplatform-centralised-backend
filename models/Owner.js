import mongoose from "mongoose";
import { User } from "./User.js";
import { Campaign } from "./Campaign.js";

const ownerSchema = mongoose.Schema(
    {
        ownerData: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        campaigns: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Campaign",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Owner = mongoose.model("Owner", ownerSchema);