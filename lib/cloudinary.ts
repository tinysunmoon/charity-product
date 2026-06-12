import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(buffer: Buffer, mimeType: string): Promise<string> {
  const dataUri = `data:${mimeType};base64,${buffer.toString("base64")}`;
  const result  = await cloudinary.uploader.upload(dataUri, {
    folder: "building-libraries",
  });
  return result.secure_url;
}
