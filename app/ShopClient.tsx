"use client";

import { useState } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
}

const FALLBACK_PRODUCTS: Product[] = [
  { id: "1", name: "Cốc gốm thủ công",        description: "Cốc gốm men nâu ấm áp, phù hợp cho buổi sáng thưởng thức trà hay cà phê.",           price: "250000",  imageUrl: "" },
  { id: "2", name: "Bát trang trí",             description: "Bát rộng miệng men trắng đốm, vừa đẹp để trưng bày vừa tiện dùng hàng ngày.",         price: "400000",  imageUrl: "" },
  { id: "3", name: "Chậu trồng cây",            description: "Chậu gốm chắc chắn có lỗ thoát nước, men đất màu tự nhiên, phù hợp trồng cây mini.",  price: "350000",  imageUrl: "" },
  { id: "4", name: "Bình hoa cổ thon",          description: "Bình hoa cổ hẹp men hổ phách ấm áp, một bông hoa đã đủ làm điểm nhấn.",               price: "500000",  imageUrl: "" },
  { id: "5", name: "Đế cắm nến",                description: "Đế nến thấp gốm nổi vân, tạo ánh sáng ấm áp dịu dàng cho những buổi tối thư giãn.",  price: "200000",  imageUrl: "" },
  { id: "6", name: "Bộ đĩa ăn (×2)",            description: "Hai chiếc đĩa ăn thủ công men trắng kem, an toàn lò vi sóng và máy rửa bát.",         price: "600000",  imageUrl: "" },
];

const EMOJI: Record<string, string> = { "1": "🏺", "2": "🍚", "3": "🌿", "4": "💐", "5": "🕯️", "6": "🍽️" };

function formatVND(price: string) {
  const n = parseInt(price, 10);
  if (isNaN(n)) return price;
  return n.toLocaleString("vi-VN") + " ₫";
}

export default function ShopClient({ products: rawProducts }: { products: Record<string, string>[] }) {
  const products: Product[] = rawProducts.length > 0
    ? rawProducts.map((p) => ({ id: p.id, name: p.name, description: p.description, price: p.price, imageUrl: p.imageUrl ?? "" }))
    : FALLBACK_PRODUCTS;

  const [selected, setSelected] = useState<Product | null>(null);
  const [toastVisible, setToastVisible] = useState(false);

  function prefillOrder(p: Product) {
    setSelected(p);
    document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
  }

  function submitOrder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name  = fd.get("name") as string;
    const email = fd.get("email") as string;
    const item  = fd.get("item") as string;
    const qty   = fd.get("qty") as string;
    const msg   = fd.get("message") as string;

    const subject = encodeURIComponent("Đặt hàng — Gốm Building Libraries");
    const body = encodeURIComponent(
      `Xin chào đội ngũ Building Libraries,\n\nTôi muốn đặt hàng!\n\n` +
      `Họ tên: ${name}\nEmail liên hệ: ${email}\nSản phẩm: ${item}\nSố lượng: ${qty}\n` +
      (msg ? `Ghi chú: ${msg}\n` : "") + `\nXin cảm ơn!`
    );
    window.location.href = `mailto:tinysunmoon@gmail.com?subject=${subject}&body=${body}`;

    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3500);
    (e.target as HTMLFormElement).reset();
    setSelected(null);
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
          {[["📚", "12", "Thư viện đã xây"], ["👧", "3.400+", "Trẻ em được tiếp cận"], ["🏺", "100%", "Đóng góp cho mục đích"]].map(([icon, num, label]) => (
            <div key={label} className="text-center">
              <div className="text-3xl mb-1">{icon}</div>
              <strong className="block text-2xl font-bold" style={{ color: "#A05E3A" }}>{num}</strong>
              <span className="font-sans text-sm" style={{ color: "#8B6A52" }}>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SHOP */}
      <section id="shop" className="py-20 px-4" style={{ backgroundColor: "#FFFBF5" }}>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold" style={{ color: "#5C3A1E" }}>Bộ sưu tập gốm</h2>
          <p className="font-sans mt-2" style={{ color: "#8B6A52" }}>Mỗi sản phẩm được làm thủ công — không có hai cái giống nhau.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {products.map((p) => (
            <div key={p.id}
                 className="rounded-xl overflow-hidden flex flex-col transition-transform hover:-translate-y-1 hover:shadow-lg"
                 style={{ backgroundColor: "#FDF6EC", boxShadow: "0 2px 12px rgba(60,30,10,0.08)" }}>
              <div className="w-full aspect-video flex items-center justify-center text-5xl overflow-hidden"
                   style={{ backgroundColor: "#F0E0C8" }}>
                {p.imageUrl
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                  : <span>{EMOJI[p.id] ?? "🏺"}</span>
                }
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-lg mb-1" style={{ color: "#5C3A1E" }}>{p.name}</h3>
                <p className="font-sans text-sm flex-1 mb-4" style={{ color: "#8B6A52" }}>{p.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold" style={{ color: "#A05E3A" }}>{formatVND(p.price)}</span>
                  <button onClick={() => prefillOrder(p)}
                          className="font-sans text-sm font-semibold px-4 py-1.5 rounded-full text-white transition-colors"
                          style={{ backgroundColor: "#C67B52" }}
                          onMouseOver={e => (e.currentTarget.style.backgroundColor = "#A05E3A")}
                          onMouseOut={e  => (e.currentTarget.style.backgroundColor = "#C67B52")}>
                    Đặt hàng
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-20 px-4" style={{ backgroundColor: "#F0E0C8" }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6" style={{ color: "#5C3A1E" }}>Tại sao chúng tôi làm điều này</h2>
          <p className="font-sans mb-4" style={{ color: "#8B6A52" }}>
            Building Libraries là dự án cộng đồng với một niềm tin đơn giản: mọi đứa trẻ đều xứng đáng được tiếp cận sách. Đồ gốm của chúng tôi được tạo ra bởi tình nguyện viên và nghệ nhân địa phương.
          </p>
          <blockquote className="text-left border-l-4 pl-5 py-2 my-6 italic text-lg rounded-r-xl"
                      style={{ borderColor: "#C67B52", backgroundColor: "#FDF6EC", color: "#5C3A1E" }}>
            &ldquo;Thư viện là nơi đầu tiên tôi cảm thấy thế giới đủ rộng lớn cho mình.&rdquo;
          </blockquote>
          <p className="font-sans" style={{ color: "#8B6A52" }}>
            Toàn bộ doanh thu được dùng trực tiếp để mua sách, làm kệ và đào tạo giáo viên điều hành chương trình đọc sách.
          </p>
        </div>
      </section>

      {/* ORDER FORM */}
      <section id="order" className="py-20 px-4" style={{ backgroundColor: "#FFFBF5" }}>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold" style={{ color: "#5C3A1E" }}>Đặt hàng</h2>
          <p className="font-sans mt-2" style={{ color: "#8B6A52" }}>Chúng tôi sẽ phản hồi trong vòng 24 giờ để xác nhận và hướng dẫn thanh toán.</p>
        </div>
        <form onSubmit={submitOrder} className="max-w-lg mx-auto rounded-xl p-8 space-y-4"
              style={{ backgroundColor: "#FDF6EC", boxShadow: "0 2px 16px rgba(60,30,10,0.08)" }}>
          <div>
            <label className="block font-sans font-semibold text-sm mb-1" style={{ color: "#5C3A1E" }}>Họ và tên</label>
            <input name="name" required placeholder="Nguyễn Văn A"
                   className="w-full border rounded-lg px-3 py-2 font-sans text-sm bg-white focus:outline-none focus:border-[#C67B52]"
                   style={{ borderColor: "#D9C4AD" }} />
          </div>
          <div>
            <label className="block font-sans font-semibold text-sm mb-1" style={{ color: "#5C3A1E" }}>Địa chỉ email</label>
            <input name="email" type="email" required placeholder="example@email.com"
                   className="w-full border rounded-lg px-3 py-2 font-sans text-sm bg-white focus:outline-none focus:border-[#C67B52]"
                   style={{ borderColor: "#D9C4AD" }} />
          </div>
          <div>
            <label className="block font-sans font-semibold text-sm mb-1" style={{ color: "#5C3A1E" }}>Sản phẩm</label>
            <select name="item" required
                    value={selected ? `${selected.name} — ${formatVND(selected.price)}` : ""}
                    onChange={() => setSelected(null)}
                    className="w-full border rounded-lg px-3 py-2 font-sans text-sm bg-white focus:outline-none focus:border-[#C67B52]"
                    style={{ borderColor: "#D9C4AD" }}>
              <option value="" disabled>Chọn sản phẩm…</option>
              {products.map(p => (
                <option key={p.id} value={`${p.name} — ${formatVND(p.price)}`}>{p.name} — {formatVND(p.price)}</option>
              ))}
              <option value="Nhiều sản phẩm (mô tả bên dưới)">Nhiều sản phẩm (mô tả bên dưới)</option>
            </select>
          </div>
          <div>
            <label className="block font-sans font-semibold text-sm mb-1" style={{ color: "#5C3A1E" }}>Số lượng</label>
            <input name="qty" type="number" min="1" max="99" defaultValue="1" required
                   className="w-full border rounded-lg px-3 py-2 font-sans text-sm bg-white focus:outline-none focus:border-[#C67B52]"
                   style={{ borderColor: "#D9C4AD" }} />
          </div>
          <div>
            <label className="block font-sans font-semibold text-sm mb-1" style={{ color: "#5C3A1E" }}>Ghi chú</label>
            <textarea name="message" rows={3} placeholder="Yêu cầu về màu sắc, gói quà, địa chỉ giao hàng…"
                      className="w-full border rounded-lg px-3 py-2 font-sans text-sm bg-white focus:outline-none focus:border-[#C67B52] resize-none"
                      style={{ borderColor: "#D9C4AD" }} />
          </div>
          <button type="submit"
                  className="w-full text-white font-sans font-semibold py-3 rounded-full transition-colors"
                  style={{ backgroundColor: "#C67B52" }}
                  onMouseOver={e => (e.currentTarget.style.backgroundColor = "#A05E3A")}
                  onMouseOut={e  => (e.currentTarget.style.backgroundColor = "#C67B52")}>
            Gửi đơn hàng
          </button>
          <p className="font-sans text-xs text-center" style={{ color: "#8B6A52" }}>
            Yêu cầu sẽ được gửi đến{" "}
            <a href="mailto:tinysunmoon@gmail.com" className="underline" style={{ color: "#C67B52" }}>
              tinysunmoon@gmail.com
            </a>
          </p>
        </form>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-10 px-4 font-sans text-sm" style={{ backgroundColor: "#5C3A1E", color: "#F0E0C8" }}>
        <p className="font-bold text-base mb-1 text-[#FDF6EC]">Building Libraries — Gốm vì một mục đích</p>
        <p>Liên hệ: <a href="mailto:tinysunmoon@gmail.com" className="text-[#C67B52] hover:underline">tinysunmoon@gmail.com</a></p>
        <p className="mt-4 opacity-50 text-xs">© 2026 Building Libraries. Toàn bộ doanh thu hỗ trợ giáo dục trẻ em.</p>
      </footer>

      {/* Toast */}
      {toastVisible && (
        <div className="fixed bottom-6 right-6 font-sans text-sm font-semibold px-5 py-3 rounded-xl shadow-lg text-[#FDF6EC]"
             style={{ backgroundColor: "#5C3A1E" }}>
          Email đặt hàng đang được mở!
        </div>
      )}
    </div>
  );
}
