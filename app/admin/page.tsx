"use client";

import { useState, useRef, useEffect } from "react";

interface Product {
  id: string; name: string; description: string;
  price: string; imageUrl: string; createdAt: string; status: string;
}
interface Order {
  orderId: string; productId: string; productName: string;
  customerName: string; customerEmail: string; quantity: string;
  notes: string; orderStatus: string; orderedAt: string;
}

function formatVND(price: string) {
  const n = parseInt(price, 10);
  return isNaN(n) ? price : n.toLocaleString("vi-VN") + " ₫";
}

export default function AdminPage() {
  const [tab, setTab]             = useState<"products" | "orders">("products");
  const [products, setProducts]   = useState<Product[]>([]);
  const [orders, setOrders]       = useState<Order[]>([]);
  const [loading, setLoading]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast]         = useState<{ msg: string; ok: boolean } | null>(null);
  const [preview, setPreview]     = useState<string | null>(null);
  const formRef                   = useRef<HTMLFormElement>(null);

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  }

  async function loadProducts() {
    setLoading(true);
    try {
      const res  = await fetch("/api/products");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch { showToast("Không thể tải sản phẩm", false); }
    finally   { setLoading(false); }
  }

  async function loadOrders() {
    setLoading(true);
    try {
      const res  = await fetch("/api/orders");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch { showToast("Không thể tải đơn hàng", false); }
    finally   { setLoading(false); }
  }

  useEffect(() => { loadProducts(); loadOrders(); }, []);

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploading(true);
    try {
      const fd  = new FormData(e.currentTarget);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Tải lên thất bại");
      showToast("Thêm sản phẩm thành công!", true);
      formRef.current?.reset();
      setPreview(null);
      loadProducts();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Tải lên thất bại", false);
    } finally { setUploading(false); }
  }

  async function cancelOrder(orderId: string) {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Huỷ thất bại");
      showToast("Đã huỷ đơn hàng", true);
      loadOrders();
      loadProducts();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Huỷ thất bại", false);
    }
  }

  const TAB_STYLE = (active: boolean) =>
    `px-5 py-2 font-sans font-semibold text-sm rounded-full transition-colors ${
      active ? "text-white" : "text-[#8B6A52] hover:text-[#5C3A1E]"
    }`;

  return (
    <div className="min-h-screen bg-[#FFFBF5]">

      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between sticky top-0 z-50" style={{ backgroundColor:"#5C3A1E" }}>
        <div>
          <span className="font-bold text-xl text-[#FDF6EC]">Building <span className="text-[#C67B52]">Libraries</span></span>
          <span className="ml-3 text-sm text-[#F0E0C8] font-sans">/ Quản trị</span>
        </div>
        <a href="/" className="text-[#F0E0C8] hover:text-[#C67B52] text-sm font-sans transition-colors">Xem cửa hàng →</a>
      </header>

      {/* Tab bar */}
      <div className="px-6 pt-6 pb-2 flex gap-2 max-w-5xl mx-auto">
        <button onClick={() => setTab("products")} className={TAB_STYLE(tab === "products")}
                style={tab === "products" ? { backgroundColor:"#C67B52" } : { backgroundColor:"#F0E0C8" }}>
          🏺 Sản phẩm {products.length > 0 && `(${products.length})`}
        </button>
        <button onClick={() => setTab("orders")} className={TAB_STYLE(tab === "orders")}
                style={tab === "orders" ? { backgroundColor:"#C67B52" } : { backgroundColor:"#F0E0C8" }}>
          📋 Đơn hàng {orders.length > 0 && `(${orders.length})`}
        </button>
      </div>

      {/* ── PRODUCTS TAB ── */}
      {tab === "products" && (
        <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Upload form */}
          <section>
            <h2 className="text-2xl font-bold text-[#5C3A1E] mb-6">Thêm sản phẩm mới</h2>
            <form ref={formRef} onSubmit={handleUpload}
                  className="bg-[#FDF6EC] rounded-xl p-6 shadow-sm space-y-4 border border-[#F0E0C8]">
              <div>
                <label className="block text-sm font-semibold text-[#5C3A1E] font-sans mb-1">Tên sản phẩm *</label>
                <input name="name" required placeholder="VD: Bình gốm thủ công"
                       className="w-full border border-[#D9C4AD] rounded-lg px-3 py-2 text-sm font-sans bg-white focus:outline-none focus:border-[#C67B52]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#5C3A1E] font-sans mb-1">Mô tả *</label>
                <textarea name="description" required rows={3}
                          placeholder="Bình gốm men nâu ấm áp…"
                          className="w-full border border-[#D9C4AD] rounded-lg px-3 py-2 text-sm font-sans bg-white focus:outline-none focus:border-[#C67B52] resize-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#5C3A1E] font-sans mb-1">Giá (VND) *</label>
                <input name="price" required placeholder="250000" type="number" min="0" step="1000"
                       className="w-full border border-[#D9C4AD] rounded-lg px-3 py-2 text-sm font-sans bg-white focus:outline-none focus:border-[#C67B52]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#5C3A1E] font-sans mb-1">
                  Hình ảnh <span className="font-normal text-[#8B6A52]">(tối đa 4MB — tự động nén)</span>
                </label>
                <input name="image" type="file" accept="image/*"
                       onChange={e => { const f = e.target.files?.[0]; setPreview(f ? URL.createObjectURL(f) : null); }}
                       className="w-full text-sm font-sans text-[#5C3A1E] file:mr-3 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:bg-[#C67B52] file:text-white file:font-semibold file:cursor-pointer hover:file:bg-[#A05E3A] cursor-pointer" />
                {preview && (
                  <div className="mt-3 rounded-lg overflow-hidden border border-[#D9C4AD] w-full aspect-video bg-[#F0E0C8]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt="Xem trước" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <button type="submit" disabled={uploading}
                      className="w-full bg-[#C67B52] hover:bg-[#A05E3A] disabled:opacity-60 text-white font-semibold font-sans py-2.5 rounded-full transition-colors text-sm">
                {uploading ? "Đang tải lên…" : "Tải lên Drive & Lưu vào Sheet"}
              </button>
              <p className="text-xs text-center text-[#8B6A52] font-sans">
                Hình ảnh → Cloudinary &nbsp;|&nbsp; Dữ liệu → Google Sheets
              </p>
            </form>
          </section>

          {/* Product list */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#5C3A1E]">Sản phẩm hiện tại</h2>
              <button onClick={loadProducts} className="text-sm font-sans text-[#C67B52] hover:text-[#A05E3A] font-semibold">
                {loading ? "Đang tải…" : "Làm mới"}
              </button>
            </div>
            {loading ? (
              <div className="text-center py-16 text-[#8B6A52] font-sans text-sm">Đang tải…</div>
            ) : products.length === 0 ? (
              <div className="bg-[#FDF6EC] rounded-xl border border-[#F0E0C8] p-10 text-center text-[#8B6A52] font-sans text-sm">
                Chưa có sản phẩm nào.
              </div>
            ) : (
              <div className="space-y-3">
                {products.map(p => (
                  <div key={p.id} className="bg-[#FDF6EC] rounded-xl border border-[#F0E0C8] p-4 flex gap-4 items-start">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#F0E0C8] flex-shrink-0">
                      {p.imageUrl
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-2xl">🏺</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <h3 className="font-semibold text-[#5C3A1E] text-sm truncate">{p.name}</h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="font-bold text-[#A05E3A] text-sm">{formatVND(p.price)}</span>
                          <span className={`font-sans text-xs font-semibold px-2 py-0.5 rounded-full ${
                            p.status === "sold_out"
                              ? "bg-red-100 text-red-600"
                              : "bg-green-100 text-green-700"
                          }`}>
                            {p.status === "sold_out" ? "Đã bán" : "Còn hàng"}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-[#8B6A52] font-sans mt-0.5 line-clamp-2">{p.description}</p>
                      <p className="text-xs text-[#D9C4AD] font-sans mt-1">
                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString("vi-VN") : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* ── ORDERS TAB ── */}
      {tab === "orders" && (
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#5C3A1E]">Đơn hàng</h2>
            <button onClick={loadOrders} className="text-sm font-sans text-[#C67B52] hover:text-[#A05E3A] font-semibold">
              {loading ? "Đang tải…" : "Làm mới"}
            </button>
          </div>

          {loading ? (
            <div className="text-center py-16 text-[#8B6A52] font-sans text-sm">Đang tải…</div>
          ) : orders.length === 0 ? (
            <div className="bg-[#FDF6EC] rounded-xl border border-[#F0E0C8] p-10 text-center text-[#8B6A52] font-sans text-sm">
              Chưa có đơn hàng nào.
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map(o => (
                <div key={o.orderId} className="bg-[#FDF6EC] rounded-xl border border-[#F0E0C8] p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-mono text-xs text-[#8B6A52]">#{o.orderId.replace("order_","")}</span>
                        <span className={`font-sans text-xs font-semibold px-2 py-0.5 rounded-full ${
                          o.orderStatus === "cancelled"
                            ? "bg-red-100 text-red-600"
                            : "bg-amber-100 text-amber-700"
                        }`}>
                          {o.orderStatus === "cancelled" ? "Đã huỷ" : "Đang chờ"}
                        </span>
                      </div>
                      <p className="font-semibold text-[#5C3A1E] text-sm">{o.productName}</p>
                      <p className="font-sans text-sm text-[#3D2B1F] mt-1">
                        {o.customerName} — <a href={`mailto:${o.customerEmail}`} className="text-[#C67B52] hover:underline">{o.customerEmail}</a>
                      </p>
                      <p className="font-sans text-xs text-[#8B6A52] mt-0.5">
                        Số lượng: {o.quantity}
                        {o.notes && ` · Ghi chú: ${o.notes}`}
                      </p>
                      <p className="font-sans text-xs text-[#D9C4AD] mt-1">
                        {o.orderedAt ? new Date(o.orderedAt).toLocaleString("vi-VN") : ""}
                      </p>
                    </div>
                    {o.orderStatus !== "cancelled" && (
                      <button onClick={() => cancelOrder(o.orderId)}
                              className="font-sans text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors flex-shrink-0"
                              style={{ borderColor:"#C67B52", color:"#C67B52" }}
                              onMouseOver={e => { e.currentTarget.style.backgroundColor="#C67B52"; e.currentTarget.style.color="white"; }}
                              onMouseOut={e  => { e.currentTarget.style.backgroundColor="transparent"; e.currentTarget.style.color="#C67B52"; }}>
                        Huỷ đơn
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl text-sm font-sans font-semibold shadow-lg
          ${toast.ok ? "bg-[#5C3A1E] text-[#FDF6EC]" : "bg-red-600 text-white"}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
