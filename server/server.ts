import { app } from "./app";
import connectDB from "./database/mongodb";
import { v2 as cloudinary } from "cloudinary";
require("dotenv").config();

//Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.CLOUD_API_SECRET,
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on Port: ${process.env.PORT}`);
  connectDB();
});
