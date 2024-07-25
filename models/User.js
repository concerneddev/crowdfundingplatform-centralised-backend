import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      min: 5,
      max: 20,
    },
    password: {
      type: String,
      required: true,
      min: 10,
      max: 20,
    },
    role: {
      type: String,
      enum: ["user", "owner", "donor"],
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);