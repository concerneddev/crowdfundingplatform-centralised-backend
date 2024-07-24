import mongoose from "mongoose";
import { Owner } from "./Owner";

const campaignSchema = mongoose.Schema(
    {
        contractAddress: {
            type: String,
            required: true,
            unique: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Owner",
            required: true,
        },
        title: {
            type: String,
            required: true,
            min: 5,
            max: 50,
        },
        description: {
            type: String,
            required: true,
            min: 15,
            max: 200,
        },
        goalAmount: {
            type: Number,
            required: true,
        },
        currentAmount: {
            type: Number,
            required: true,
        },
        finalAmount: {
            type: Number,
        },
        campaignState: {
            type: String,
            required: true,
            enum: ["active", "inactive"],
        }
        // donors
        // donations
    },
    {
        timestamps: true,
    }
);

export const Campaign = mongoose.model("Campaign", campaignSchema);