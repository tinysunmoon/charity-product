import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { uploadImage } from "@/lib/cloudinary";
import { appendProduct } from "@/lib/google";

export const maxDuration = 60;
export const dynamic     = "force-dynamic";

async function resizeImage(buffer: Buffer): Promise<{ buffer: Buffer; mime: string }> {
  const resized = await sharp(buffer)
    .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
  return { buffer: resized, mime: "image/webp" };
}

export async function POST(req: NextRequest) {
  try {
    const formData   = await req.formData();
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
      const { buffer, mime } = await resizeImage(raw);
      imageUrl = await uploadImage(buffer, mime);
    }

    const id        = `prod_${Date.now()}`;
    const createdAt = new Date().toISOString();

    await appendProduct([id, name, description, price, imageUrl, createdAt, "available"]);

    return NextResponse.json({ success: true, id, imageUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[upload]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
