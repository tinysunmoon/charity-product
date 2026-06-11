import { NextRequest, NextResponse } from "next/server";
import { uploadToDrive, appendToSheet } from "@/lib/google";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const name        = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price       = formData.get("price") as string;
    const imageFile   = formData.get("image") as File | null;

    if (!name || !description || !price) {
      return NextResponse.json({ error: "name, description, and price are required" }, { status: 400 });
    }

    let imageUrl = "";
    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      imageUrl = await uploadToDrive(buffer, imageFile.name, imageFile.type);
    }

    const id        = `prod_${Date.now()}`;
    const createdAt = new Date().toISOString();

    await appendToSheet([id, name, description, price, imageUrl, createdAt]);

    return NextResponse.json({ success: true, id, imageUrl });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
