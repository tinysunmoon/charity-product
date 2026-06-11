import { NextResponse } from "next/server";
import { getProducts } from "@/lib/google";

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}
