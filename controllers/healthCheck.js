import mongoose from "mongoose";

export const checkHealthDb = async (req, res) => {
  try {
    await mongoose.connection.db.command({ ping: 1 });
    res.status(200).send({
      status: "ok",
      message: "MongoDB is connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "MongoDB connection failed",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};

export const checkHealthServer = async (req, res) => {
  try {
    res.status(200).send({
      status: "ok",
      message: "Server is running and healthy",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Server health check failed",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};
