import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.SECRET_KEY;

export const register = async (req, res) => {
  try {
    // validate fields
    if (!req.body.username || !req.body.password) {
      return res.status(400).send({
        message: "Send all required fields: username and password.",
      });
    }

    const username = req.body.username;
    const password = req.body.password;

    // unique username
    let user = await User.findOne({ username });
    if (user) {
      return res.send(400).send({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({
      username: username,
      password: hashedPassword,
      role: "user",
    });

    res.status(201).send({ message: "User registered successfully." });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    // validate fields
    if (!req.body.username || !req.body.password) {
      return res.status(400).send({
        message: "Send all required fields: username and password.",
      });
    }

    const username = req.body.username;
    const password = req.body.password;

    // check if User exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send({
        message: "Invalid credentials.",
      });
    }

    // compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ message: "Invalid credentials." });
    }

    // generate JWT
    const payload = { userId: user._id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: 3600 });

    res.send({ token });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

export const logout = async (req, res) => {
  res.send({ message: "User logged Out" });

  // delete the JWT token from client side
  // that logic to be written in the frontend part
};
