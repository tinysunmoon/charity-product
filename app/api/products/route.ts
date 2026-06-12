import { NextResponse } from "next/server";
import { getProducts } from "@/lib/google";

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[products]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
