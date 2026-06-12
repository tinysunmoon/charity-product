import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { uploadToDrive, appendToSheet } from "@/lib/google";

const MAX_WIDTH  = 1200;
const MAX_HEIGHT = 1200;
const QUALITY    = 82;

async function resizeImage(buffer: Buffer, originalName: string): Promise<{ buffer: Buffer; name: string; mime: string }> {
  const resized = await sharp(buffer)
    .resize(MAX_WIDTH, MAX_HEIGHT, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toBuffer();

  const baseName = originalName.replace(/\.[^.]+$/, "");
  return { buffer: resized, name: `${baseName}.webp`, mime: "image/webp" };
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const name        = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price       = formData.get("price") as string;
    const imageFile   = formData.get("image") as File | null;

    if (!name || !description || !price) {
      return NextResponse.json({ error: "Tên, mô tả và giá là bắt buộc" }, { status: 400 });
    }

    let imageUrl = "";
    if (imageFile && imageFile.size > 0) {
      const raw = Buffer.from(await imageFile.arrayBuffer());
      const { buffer, name: fileName, mime } = await resizeImage(raw, imageFile.name);
      imageUrl = await uploadToDrive(buffer, fileName, mime);
    }

    const id        = `prod_${Date.now()}`;
    const createdAt = new Date().toISOString();

    await appendToSheet([id, name, description, price, imageUrl, createdAt]);

    return NextResponse.json({ success: true, id, imageUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[upload]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
