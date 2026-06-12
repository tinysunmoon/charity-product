import { NextRequest, NextResponse } from "next/server";
import { updateOrderStatus, updateProductStatus } from "@/lib/google";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status } = await req.json();
    const productId  = await updateOrderStatus(params.id, status);

    if (status === "cancelled") {
      await updateProductStatus(productId, "available");
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[orders PATCH]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
