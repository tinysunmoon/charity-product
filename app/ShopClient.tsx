"use client";

import { useState } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  status: string;
}

const FALLBACK_PRODUCTS: Product[] = [
  { id: "1", name: "Cốc gốm thủ công",       description: "Cốc gốm men nâu ấm áp, phù hợp cho buổi sáng thưởng thức trà hay cà phê.",          price: "250000", imageUrl: "", status: "available" },
  { id: "2", name: "Bát trang trí",            description: "Bát rộng miệng men trắng đốm, vừa đẹp để trưng bày vừa tiện dùng hàng ngày.",        price: "400000", imageUrl: "", status: "available" },
  { id: "3", name: "Chậu trồng cây",           description: "Chậu gốm chắc chắn có lỗ thoát nước, men đất màu tự nhiên, phù hợp trồng cây mini.", price: "350000", imageUrl: "", status: "available" },
  { id: "4", name: "Bình hoa cổ thon",         description: "Bình hoa cổ hẹp men hổ phách ấm áp, một bông hoa đã đủ làm điểm nhấn.",              price: "500000", imageUrl: "", status: "available" },
  { id: "5", name: "Đế cắm nến",               description: "Đế nến thấp gốm nổi vân, tạo ánh sáng ấm áp dịu dàng cho những buổi tối thư giãn.", price: "200000", imageUrl: "", status: "available" },
  { id: "6", name: "Bộ đĩa ăn (×2)",           description: "Hai chiếc đĩa ăn thủ công men trắng kem, an toàn lò vi sóng và máy rửa bát.",        price: "600000", imageUrl: "", status: "available" },
];

const EMOJI: Record<string, string> = { "1": "🏺", "2": "🍚", "3": "🌿", "4": "💐", "5": "🕯️", "6": "🍽️" };

function formatVND(price: string) {
  const n = parseInt(price, 10);
  return isNaN(n) ? price : n.toLocaleString("vi-VN") + " ₫";
}

export default function ShopClient({ products: rawProducts }: { products: Record<string, string>[] }) {
  const products: Product[] = rawProducts.length > 0
    ? rawProducts.map(p => ({ id: p.id, name: p.name, description: p.description, price: p.price, imageUrl: p.imageUrl ?? "", status: p.status ?? "available" }))
    : FALLBACK_PRODUCTS;

  const [orderProduct, setOrderProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting]     = useState(false);
  const [orderDone, setOrderDone]       = useState(false);
  const [orderError, setOrderError]     = useState("");
  const [lightbox, setLightbox]         = useState<Product | null>(null);

  function openOrder(p: Product) {
    setOrderProduct(p);
    setOrderDone(false);
    setOrderError("");
    setTimeout(() => document.getElementById("order")?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  async function handleOrder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!orderProduct) return;
    setSubmitting(true);
    setOrderError("");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId:     orderProduct.id,
          productName:   orderProduct.name,
          price:         orderProduct.price,
          customerName:  fd.get("name"),
          customerEmail: fd.get("email"),
          quantity:      fd.get("qty"),
          notes:         fd.get("message"),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Đặt hàng thất bại");
      setOrderDone(true);
      setOrderProduct(null);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setOrderError(err instanceof Error ? err.message : "Đặt hàng thất bại");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ fontFamily: "Georgia, serif" }}>

      {/* NAV */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4" style={{ backgroundColor: "#5C3A1E" }}>
        <div className="font-bold text-xl" style={{ color: "#FDF6EC" }}>
          Building <span style={{ color: "#C67B52" }}>Libraries</span>
        </div>
        <nav className="flex gap-6 font-sans text-sm" style={{ color: "#F0E0C8" }}>
          <a href="#shop"  className="hover:text-[#C67B52] transition-colors">Cửa hàng</a>
          <a href="#about" className="hover:text-[#C67B52] transition-colors">Sứ mệnh</a>
          <a href="#order" className="hover:text-[#C67B52] transition-colors">Đặt hàng</a>
        </nav>
      </header>

      {/* HERO */}
      <section className="text-center py-24 px-4" style={{ background: "linear-gradient(135deg,#5C3A1E 0%,#7A4A28 100%)" }}>
        <span className="inline-block bg-[#C67B52] text-white font-sans text-xs font-bold tracking-widest uppercase px-4 py-1 rounded-full mb-4">
          Mỗi mua sắm xây dựng tương lai
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-[#FDF6EC] leading-tight max-w-2xl mx-auto mb-4">
          Gốm thủ công đẹp.<br /><span style={{ color: "#C67B52" }}>Sách cho mọi trẻ em.</span>
        </h1>
        <p className="font-sans text-[#F0E0C8] text-lg max-w-md mx-auto mb-8">
          Đồ gốm được làm thủ công bằng tình yêu — 100% doanh thu dùng để xây dựng thư viện cho trẻ em.
        </p>
        <a href="#shop"  className="inline-block bg-[#C67B52] hover:bg-[#A05E3A] text-white font-sans font-semibold px-6 py-3 rounded-full transition-colors mr-3">Xem bộ sưu tập</a>
        <a href="#about" className="inline-block border-2 border-[#C67B52] text-[#C67B52] hover:bg-[#C67B52] hover:text-white font-sans font-semibold px-6 py-3 rounded-full transition-colors">Câu chuyện của chúng tôi</a>
      </section>

      {/* STATS */}
      <section className="py-10 px-4" style={{ backgroundColor: "#F0E0C8" }}>
        <div className="flex justify-center gap-16 flex-wrap">
          {[["📚","12","Thư viện đã xây"],["👧","3.400+","Trẻ em được tiếp cận"],["🏺","100%","Đóng góp cho mục đích"]].map(([icon,num,label]) => (
            <div key={label} className="text-center">
              <div className="text-3xl mb-1">{icon}</div>
              <strong className="block text-2xl font-bold" style={{ color:"#A05E3A" }}>{num}</strong>
              <span className="font-sans text-sm" style={{ color:"#8B6A52" }}>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SHOP */}
      <section id="shop" className="py-20 px-4" style={{ backgroundColor:"#FFFBF5" }}>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold" style={{ color:"#5C3A1E" }}>Bộ sưu tập gốm</h2>
          <p className="font-sans mt-2" style={{ color:"#8B6A52" }}>Mỗi sản phẩm được làm thủ công — không có hai cái giống nhau.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {products.map(p => {
            const soldOut = p.status === "sold_out";
            return (
              <div key={p.id}
                   className="rounded-xl overflow-hidden flex flex-col transition-transform hover:-translate-y-1 hover:shadow-lg"
                   style={{ backgroundColor:"#FDF6EC", boxShadow:"0 2px 12px rgba(60,30,10,0.08)", opacity: soldOut ? 0.75 : 1 }}>
                {/* Image */}
                <div className="relative w-full aspect-video flex items-center justify-center text-5xl overflow-hidden"
                     style={{ backgroundColor:"#F0E0C8", cursor: p.imageUrl ? "zoom-in" : "default" }}
                     onClick={() => p.imageUrl && setLightbox(p)}>
                  {p.imageUrl
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                    : <span>{EMOJI[p.id] ?? "🏺"}</span>
                  }
                  {soldOut && (
                    <div className="absolute inset-0 flex items-center justify-center"
                         style={{ backgroundColor:"rgba(92,58,30,0.55)" }}>
                      <span className="font-sans font-bold text-white text-lg tracking-wide">Đã đặt hàng</span>
                    </div>
                  )}
                </div>
                {/* Body */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-lg mb-1" style={{ color:"#5C3A1E" }}>{p.name}</h3>
                  <p className="font-sans text-sm flex-1 mb-4" style={{ color:"#8B6A52" }}>{p.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold" style={{ color:"#A05E3A" }}>{formatVND(p.price)}</span>
                    {soldOut ? (
                      <span className="font-sans text-sm font-semibold px-4 py-1.5 rounded-full"
                            style={{ backgroundColor:"#E5D5C5", color:"#8B6A52" }}>Hết hàng</span>
                    ) : (
                      <button onClick={() => openOrder(p)}
                              className="font-sans text-sm font-semibold px-4 py-1.5 rounded-full text-white transition-colors"
                              style={{ backgroundColor:"#C67B52" }}
                              onMouseOver={e=>(e.currentTarget.style.backgroundColor="#A05E3A")}
                              onMouseOut={e=>(e.currentTarget.style.backgroundColor="#C67B52")}>
                        Đặt hàng
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-20 px-4" style={{ backgroundColor:"#F0E0C8" }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6" style={{ color:"#5C3A1E" }}>Tại sao chúng tôi làm điều này</h2>
          <p className="font-sans mb-4" style={{ color:"#8B6A52" }}>
            Building Libraries là dự án cộng đồng với một niềm tin đơn giản: mọi đứa trẻ đều xứng đáng được tiếp cận sách. Đồ gốm của chúng tôi được tạo ra bởi tình nguyện viên và nghệ nhân địa phương.
          </p>
          <blockquote className="text-left border-l-4 pl-5 py-2 my-6 italic text-lg rounded-r-xl"
                      style={{ borderColor:"#C67B52", backgroundColor:"#FDF6EC", color:"#5C3A1E" }}>
            &ldquo;Thư viện là nơi đầu tiên tôi cảm thấy thế giới đủ rộng lớn cho mình.&rdquo;
          </blockquote>
          <p className="font-sans" style={{ color:"#8B6A52" }}>
            Toàn bộ doanh thu được dùng trực tiếp để mua sách, làm kệ và đào tạo giáo viên điều hành chương trình đọc sách.
          </p>
        </div>
      </section>

      {/* ORDER FORM */}
      <section id="order" className="py-20 px-4" style={{ backgroundColor:"#FFFBF5" }}>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold" style={{ color:"#5C3A1E" }}>Đặt hàng</h2>
          <p className="font-sans mt-2" style={{ color:"#8B6A52" }}>Chúng tôi sẽ phản hồi trong vòng 24 giờ để xác nhận và hướng dẫn thanh toán.</p>
        </div>

        {orderDone ? (
          <div className="max-w-lg mx-auto text-center bg-[#FDF6EC] rounded-xl p-10 border border-[#F0E0C8]">
            <div className="text-5xl mb-4">📬</div>
            <h3 className="font-bold text-xl mb-2" style={{ color:"#5C3A1E" }}>Đặt hàng thành công!</h3>
            <p className="font-sans text-sm" style={{ color:"#8B6A52" }}>
              Email xác nhận đã được gửi đến hộp thư của bạn. Chúng tôi sẽ liên hệ sớm.
            </p>
            <button onClick={() => setOrderDone(false)}
                    className="mt-6 font-sans text-sm font-semibold px-6 py-2 rounded-full text-white"
                    style={{ backgroundColor:"#C67B52" }}>
              Đặt thêm sản phẩm khác
            </button>
          </div>
        ) : (
          <form onSubmit={handleOrder} className="max-w-lg mx-auto rounded-xl p-8 space-y-4"
                style={{ backgroundColor:"#FDF6EC", boxShadow:"0 2px 16px rgba(60,30,10,0.08)" }}>

            {/* Selected product display */}
            {orderProduct && (
              <div className="flex items-center gap-3 p-3 rounded-lg border" style={{ borderColor:"#D9C4AD", backgroundColor:"#F0E0C8" }}>
                <span className="text-2xl">🏺</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color:"#5C3A1E" }}>{orderProduct.name}</p>
                  <p className="font-sans text-xs" style={{ color:"#8B6A52" }}>{formatVND(orderProduct.price)}</p>
                </div>
                <button type="button" onClick={() => setOrderProduct(null)}
                        className="font-sans text-xs" style={{ color:"#8B6A52" }}>Đổi</button>
              </div>
            )}

            {!orderProduct && (
              <div>
                <label className="block font-sans font-semibold text-sm mb-1" style={{ color:"#5C3A1E" }}>Chọn sản phẩm</label>
                <select required onChange={e => {
                  const p = products.find(p => p.id === e.target.value);
                  if (p) setOrderProduct(p);
                }} defaultValue=""
                        className="w-full border rounded-lg px-3 py-2 font-sans text-sm bg-white focus:outline-none"
                        style={{ borderColor:"#D9C4AD" }}>
                  <option value="" disabled>Chọn sản phẩm…</option>
                  {products.filter(p => p.status !== "sold_out").map(p => (
                    <option key={p.id} value={p.id}>{p.name} — {formatVND(p.price)}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block font-sans font-semibold text-sm mb-1" style={{ color:"#5C3A1E" }}>Họ và tên *</label>
              <input name="name" required placeholder="Nguyễn Văn A"
                     className="w-full border rounded-lg px-3 py-2 font-sans text-sm bg-white focus:outline-none"
                     style={{ borderColor:"#D9C4AD" }} />
            </div>
            <div>
              <label className="block font-sans font-semibold text-sm mb-1" style={{ color:"#5C3A1E" }}>Địa chỉ email *</label>
              <input name="email" type="email" required placeholder="example@email.com"
                     className="w-full border rounded-lg px-3 py-2 font-sans text-sm bg-white focus:outline-none"
                     style={{ borderColor:"#D9C4AD" }} />
            </div>
            <div>
              <label className="block font-sans font-semibold text-sm mb-1" style={{ color:"#5C3A1E" }}>Số lượng</label>
              <input name="qty" type="number" min="1" max="1" defaultValue="1" required
                     className="w-full border rounded-lg px-3 py-2 font-sans text-sm bg-white focus:outline-none"
                     style={{ borderColor:"#D9C4AD" }} />
            </div>
            <div>
              <label className="block font-sans font-semibold text-sm mb-1" style={{ color:"#5C3A1E" }}>Ghi chú</label>
              <textarea name="message" rows={3} placeholder="Yêu cầu về màu sắc, gói quà, địa chỉ giao hàng…"
                        className="w-full border rounded-lg px-3 py-2 font-sans text-sm bg-white focus:outline-none resize-none"
                        style={{ borderColor:"#D9C4AD" }} />
            </div>

            {orderError && (
              <p className="font-sans text-sm text-red-600 text-center">{orderError}</p>
            )}

            <button type="submit" disabled={submitting || !orderProduct}
                    className="w-full text-white font-sans font-semibold py-3 rounded-full transition-colors disabled:opacity-50"
                    style={{ backgroundColor:"#C67B52" }}>
              {submitting ? "Đang gửi…" : "Xác nhận đặt hàng"}
            </button>
            <p className="font-sans text-xs text-center" style={{ color:"#8B6A52" }}>
              Email xác nhận sẽ được gửi ngay đến hộp thư của bạn.
            </p>
          </form>
        )}
      </section>

      {/* FOOTER */}
      <footer className="text-center py-10 px-4 font-sans text-sm" style={{ backgroundColor:"#5C3A1E", color:"#F0E0C8" }}>
        <p className="font-bold text-base mb-1 text-[#FDF6EC]">Building Libraries — Gốm vì một mục đích</p>
        <p>Liên hệ: <a href="mailto:tinysunmoon@gmail.com" className="text-[#C67B52] hover:underline">tinysunmoon@gmail.com</a></p>
        <p className="mt-4 opacity-50 text-xs">© 2026 Building Libraries. Toàn bộ doanh thu hỗ trợ giáo dục trẻ em.</p>
      </footer>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
             style={{ backgroundColor:"rgba(0,0,0,0.85)" }}
             onClick={() => setLightbox(null)}>
          <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={lightbox.imageUrl} alt={lightbox.name}
                 className="w-full max-h-[80vh] object-contain rounded-xl shadow-2xl" />
            <div className="mt-3 text-center">
              <p className="font-bold text-lg text-white">{lightbox.name}</p>
              <p className="font-sans text-sm mt-0.5" style={{ color:"#F0E0C8" }}>{formatVND(lightbox.price)}</p>
            </div>
            <button onClick={() => setLightbox(null)}
                    className="absolute -top-4 -right-4 w-9 h-9 rounded-full flex items-center justify-center font-sans font-bold text-lg shadow-lg"
                    style={{ backgroundColor:"#C67B52", color:"white" }}>×</button>
          </div>
        </div>
      )}
    </div>
  );
}
