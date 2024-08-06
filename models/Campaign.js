import mongoose from "mongoose";
import { User } from "./User.js";
import { Donor } from "./Donor.js";
import { Donation } from "./Donation.js";
import { Owner } from "./Owner.js";

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
      min: 0,
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
    },
    tags: [
      {
        type: String,
      },
    ],
    donors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Donor",
      },
    ],
    donations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Donation",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Campaign = mongoose.model("Campaign", campaignSchema);
