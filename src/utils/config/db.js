import mongoose from "mongoose";
import constants from "./constants.js";

export async function connectDB() {
  try {
    await mongoose.connect(constants.dbUrl);
    console.log("DB connected successfully");
    return true;
  } catch (e) {
    console.log("DB connection failed.", e);
    return false;
  }
}
