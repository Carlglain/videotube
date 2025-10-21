import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (LocalFilePath) => {
  try {
    if (!LocalFilePath) return null;
    const response = await cloudinary.uploader.upload(LocalFilePath, {
      resource_type: "auto",
    });
    console.log("File uploaded on Cloudinary, File source: ", response.url);
    fs.unlinkSync(localStorage);
    return response;
  } catch (error) {
    console.log("Error on Cloudinary: ", error);
    fs.unlinkSync(LocalFilePath);
    return null;
  }
};
export { uploadToCloudinary };
