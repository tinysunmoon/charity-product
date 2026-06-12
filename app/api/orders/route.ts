import { NextRequest, NextResponse } from "next/server";
import { appendOrder, getOrders, updateProductStatus } from "@/lib/google";
import { sendOrderConfirmation } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const orders = await getOrders();
    return NextResponse.json(orders);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, productName, price, customerName, customerEmail, quantity, notes } = body;

    if (!productId || !customerName || !customerEmail) {
      return NextResponse.json({ error: "Thiếu thông tin bắt buộc" }, { status: 400 });
    }

    const orderId   = `order_${Date.now()}`;
    const orderedAt = new Date().toISOString();

    await appendOrder([
      orderId, productId, productName, customerName, customerEmail,
      quantity ?? "1", notes ?? "", "pending", orderedAt,
    ]);

    await updateProductStatus(productId, "sold_out");

    await sendOrderConfirmation({
      customerEmail,
      customerName,
      productName,
      price,
      quantity: quantity ?? "1",
      orderId,
    });

    return NextResponse.json({ success: true, orderId });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[orders POST]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
