import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose, { mongo } from "mongoose";
import cors from "cors";
import authRoute from "./routes/authRoute.js";
import donorRoute from "./routes/donorRoute.js";
import ownerRoute from "./routes/ownerRoute.js";
import userRoute from "./routes/userRoute.js";

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
app.use("/auth", authRoute);
app.use("/owner", ownerRoute);
app.use("/donor", donorRoute);
app.use("/user", userRoute);

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
