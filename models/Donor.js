import mongoose from "mongoose";
import { User } from "./User.js";

const donorSchema = mongoose.Schema(
  {
    publicKey: {
      type: String,
      required: true,
      unique: true,
    },
    donorData: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    donations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Donation",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Donor = mongoose.model("Donor", donorSchema);
