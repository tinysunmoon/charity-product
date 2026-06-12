import { Resend } from "resend";

export async function sendOrderConfirmation({
  customerEmail,
  customerName,
  productName,
  price,
  quantity,
  orderId,
}: {
  customerEmail: string;
  customerName:  string;
  productName:   string;
  price:         string;
  quantity:      string;
  orderId:       string;
}): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const total  = (parseInt(price, 10) * parseInt(quantity, 10)).toLocaleString("vi-VN");

  await resend.emails.send({
    from:     "Building Libraries <onboarding@resend.dev>",
    replyTo: "tinysunmoon@gmail.com",
    to:       customerEmail,
    subject:  `Xác nhận đơn hàng #${orderId} — Building Libraries`,
    html: `
<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:40px 20px;background:#FFFBF5;">
  <div style="text-align:center;margin-bottom:28px;">
    <h1 style="color:#5C3A1E;font-size:22px;margin:0;">Building <span style="color:#C67B52;">Libraries</span></h1>
    <p style="color:#8B6A52;font-size:13px;margin:4px 0 0;">Gốm vì một mục đích</p>
  </div>

  <div style="background:#FDF6EC;border-radius:12px;padding:24px;margin-bottom:20px;border:1px solid #F0E0C8;">
    <p style="color:#3D2B1F;margin:0 0 10px;">Xin chào <strong>${customerName}</strong>,</p>
    <p style="color:#8B6A52;font-size:14px;margin:0;">
      Chúng tôi đã nhận được đơn đặt hàng của bạn. Đội ngũ sẽ liên hệ qua email trong vòng 24 giờ để xác nhận và hướng dẫn thanh toán.
    </p>
  </div>

  <div style="background:#F0E0C8;border-radius:12px;padding:20px;margin-bottom:20px;">
    <p style="color:#5C3A1E;font-size:12px;font-weight:bold;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 12px;">Chi tiết đơn hàng</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tr><td style="color:#8B6A52;padding:4px 0;">Mã đơn</td>     <td style="color:#3D2B1F;text-align:right;">#${orderId}</td></tr>
      <tr><td style="color:#8B6A52;padding:4px 0;">Sản phẩm</td>   <td style="color:#3D2B1F;text-align:right;">${productName}</td></tr>
      <tr><td style="color:#8B6A52;padding:4px 0;">Số lượng</td>   <td style="color:#3D2B1F;text-align:right;">${quantity}</td></tr>
      <tr style="border-top:1px solid #D9C4AD;">
        <td style="color:#5C3A1E;font-weight:bold;padding-top:10px;">Tổng cộng</td>
        <td style="color:#A05E3A;font-weight:bold;text-align:right;padding-top:10px;">${total} ₫</td>
      </tr>
    </table>
  </div>

  <p style="color:#8B6A52;font-size:13px;text-align:center;">
    Liên hệ: <a href="mailto:tinysunmoon@gmail.com" style="color:#C67B52;">tinysunmoon@gmail.com</a>
  </p>
  <p style="color:#D9C4AD;font-size:11px;text-align:center;margin-top:20px;">
    © 2026 Building Libraries. Toàn bộ doanh thu hỗ trợ giáo dục trẻ em.
  </p>
</div>`,
  });
}
