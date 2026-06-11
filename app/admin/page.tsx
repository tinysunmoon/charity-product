"use client";

import { useState, useRef, useEffect } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  createdAt: string;
}

export default function AdminPage() {
  const [products, setProducts]   = useState<Product[]>([]);
  const [loading, setLoading]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast]         = useState<{ msg: string; ok: boolean } | null>(null);
  const [preview, setPreview]     = useState<string | null>(null);
  const formRef                   = useRef<HTMLFormElement>(null);

  async function loadProducts() {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      showToast("Failed to load products", false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadProducts(); }, []);

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploading(true);
    try {
      const fd = new FormData(e.currentTarget);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      showToast("Product added successfully!", true);
      formRef.current?.reset();
      setPreview(null);
      loadProducts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      showToast(msg, false);
    } finally {
      setUploading(false);
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
    else setPreview(null);
  }

  return (
    <div className="min-h-screen bg-[#FFFBF5]">

      {/* Header */}
      <header className="bg-brown text-cream px-6 py-4 flex items-center justify-between sticky top-0 z-50"
              style={{ backgroundColor: "#5C3A1E" }}>
        <div>
          <span className="font-bold text-xl text-[#FDF6EC]">Building <span className="text-[#C67B52]">Libraries</span></span>
          <span className="ml-3 text-sm text-[#F0E0C8] font-sans">/ Admin</span>
        </div>
        <a href="/" className="text-[#F0E0C8] hover:text-[#C67B52] text-sm font-sans transition-colors">
          View public shop →
        </a>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Upload form */}
        <section>
          <h2 className="text-2xl font-bold text-[#5C3A1E] mb-6">Add New Product</h2>
          <form ref={formRef} onSubmit={handleSubmit}
                className="bg-[#FDF6EC] rounded-xl p-6 shadow-sm space-y-4 border border-[#F0E0C8]">

            <div>
              <label className="block text-sm font-semibold text-[#5C3A1E] font-sans mb-1">
                Product Name *
              </label>
              <input name="name" required placeholder="e.g. Hand-Thrown Mug"
                     className="w-full border border-[#D9C4AD] rounded-lg px-3 py-2 text-sm font-sans bg-white focus:outline-none focus:border-[#C67B52]" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#5C3A1E] font-sans mb-1">
                Description *
              </label>
              <textarea name="description" required rows={3}
                        placeholder="A cozy mug with a warm terracotta glaze…"
                        className="w-full border border-[#D9C4AD] rounded-lg px-3 py-2 text-sm font-sans bg-white focus:outline-none focus:border-[#C67B52] resize-none" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#5C3A1E] font-sans mb-1">
                Price (USD) *
              </label>
              <input name="price" required placeholder="25" type="number" min="0" step="0.01"
                     className="w-full border border-[#D9C4AD] rounded-lg px-3 py-2 text-sm font-sans bg-white focus:outline-none focus:border-[#C67B52]" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#5C3A1E] font-sans mb-1">
                Product Image
              </label>
              <input name="image" type="file" accept="image/*" onChange={handleImageChange}
                     className="w-full text-sm font-sans text-[#5C3A1E] file:mr-3 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:bg-[#C67B52] file:text-white file:font-semibold file:cursor-pointer hover:file:bg-[#A05E3A] cursor-pointer" />
              {preview && (
                <div className="mt-3 rounded-lg overflow-hidden border border-[#D9C4AD] w-full aspect-video bg-[#F0E0C8]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <button type="submit" disabled={uploading}
                    className="w-full bg-[#C67B52] hover:bg-[#A05E3A] disabled:opacity-60 text-white font-semibold font-sans py-2.5 rounded-full transition-colors text-sm">
              {uploading ? "Uploading…" : "Upload to Drive & Save to Sheet"}
            </button>

            <p className="text-xs text-center text-[#8B6A52] font-sans">
              Image → Google Drive &nbsp;|&nbsp; Data → Google Sheets
            </p>
          </form>
        </section>

        {/* Product list */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#5C3A1E]">Current Products</h2>
            <button onClick={loadProducts}
                    className="text-sm font-sans text-[#C67B52] hover:text-[#A05E3A] font-semibold transition-colors">
              {loading ? "Refreshing…" : "Refresh"}
            </button>
          </div>

          {loading ? (
            <div className="text-center py-16 text-[#8B6A52] font-sans text-sm">Loading…</div>
          ) : products.length === 0 ? (
            <div className="bg-[#FDF6EC] rounded-xl border border-[#F0E0C8] p-10 text-center text-[#8B6A52] font-sans text-sm">
              No products yet. Add your first one!
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {products.map((p) => (
                <div key={p.id} className="bg-[#FDF6EC] rounded-xl border border-[#F0E0C8] p-4 flex gap-4 items-start">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#F0E0C8] flex-shrink-0">
                    {p.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">🏺</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-[#5C3A1E] text-sm truncate">{p.name}</h3>
                      <span className="font-bold text-[#A05E3A] text-sm flex-shrink-0">${p.price}</span>
                    </div>
                    <p className="text-xs text-[#8B6A52] font-sans mt-0.5 line-clamp-2">{p.description}</p>
                    <p className="text-xs text-[#D9C4AD] font-sans mt-1">
                      {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl text-sm font-sans font-semibold shadow-lg transition-all
          ${toast.ok ? "bg-[#5C3A1E] text-[#FDF6EC]" : "bg-red-600 text-white"}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
