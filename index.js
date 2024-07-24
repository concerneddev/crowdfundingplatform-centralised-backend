import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose, { mongo } from "mongoose";
import cors from "cors";

const app = express();

// middleware
app.use(express.json());
app.use(cors());

app.get("/", (request, response) => {
  console.log(request);
  return response
    .status(234)
    .send("Welcome to decentralised crowdfunding platform!");
});

// routes

// connection
mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("App connected to database.");

    app.listen(PORT, () => {
      console.log(`App is listening on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
