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
  { id: "1", name: "Hand-Thrown Mug",       description: "A cozy mug with a warm terracotta glaze. Perfect for your morning ritual.",            price: "25", imageUrl: "" },
  { id: "2", name: "Decorative Bowl",        description: "Wide, shallow bowl with a speckled cream finish. Beautiful for everyday use.",          price: "40", imageUrl: "" },
  { id: "3", name: "Planter Pot",            description: "Sturdy drainage-ready planter with a matte earth-tone glaze.",                          price: "35", imageUrl: "" },
  { id: "4", name: "Slim Vase",              description: "Elegant narrow-neck vase in warm amber. Makes any single stem a statement.",             price: "50", imageUrl: "" },
  { id: "5", name: "Candle Holder",          description: "Squat dimpled candle holder that casts the warmest glow.",                               price: "20", imageUrl: "" },
  { id: "6", name: "Dinner Plate Set (×2)",  description: "Two hand-shaped dinner plates in matching warm white glaze. Dishwasher safe.",           price: "60", imageUrl: "" },
];

const EMOJI: Record<string, string> = { "1": "🏺", "2": "🍚", "3": "🌿", "4": "💐", "5": "🕯️", "6": "🍽️" };

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

    const subject = encodeURIComponent("Order Inquiry — Building Libraries Pottery");
    const body = encodeURIComponent(
      `Hi Building Libraries team,\n\nI'd like to place an order!\n\n` +
      `Name: ${name}\nReply-to: ${email}\nItem: ${item}\nQuantity: ${qty}\n` +
      (msg ? `Notes: ${msg}\n` : "") + `\nThank you!`
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
          <a href="#shop"  className="hover:text-[#C67B52] transition-colors">Shop</a>
          <a href="#about" className="hover:text-[#C67B52] transition-colors">Mission</a>
          <a href="#order" className="hover:text-[#C67B52] transition-colors">Order</a>
        </nav>
      </header>

      {/* HERO */}
      <section className="text-center py-24 px-4" style={{ background: "linear-gradient(135deg,#5C3A1E 0%,#7A4A28 100%)" }}>
        <span className="inline-block bg-[#C67B52] text-white font-sans text-xs font-bold tracking-widest uppercase px-4 py-1 rounded-full mb-4">
          Every purchase builds a future
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-[#FDF6EC] leading-tight max-w-2xl mx-auto mb-4">
          Beautiful Pottery.<br /><span style={{ color: "#C67B52" }}>Books for Every Child.</span>
        </h1>
        <p className="font-sans text-[#F0E0C8] text-lg max-w-md mx-auto mb-8">
          Hand-crafted ceramics made with love — 100% of proceeds go toward building libraries.
        </p>
        <a href="#shop"  className="inline-block bg-[#C67B52] hover:bg-[#A05E3A] text-white font-sans font-semibold px-6 py-3 rounded-full transition-colors mr-3">Shop the Collection</a>
        <a href="#about" className="inline-block border-2 border-[#C67B52] text-[#C67B52] hover:bg-[#C67B52] hover:text-white font-sans font-semibold px-6 py-3 rounded-full transition-colors">Our Story</a>
      </section>

      {/* STATS */}
      <section className="py-10 px-4" style={{ backgroundColor: "#F0E0C8" }}>
        <div className="flex justify-center gap-16 flex-wrap">
          {[["📚", "12", "Libraries built"], ["👧", "3,400+", "Children reached"], ["🏺", "100%", "Goes to the cause"]].map(([icon, num, label]) => (
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
          <h2 className="text-3xl font-bold" style={{ color: "#5C3A1E" }}>Our Pottery Collection</h2>
          <p className="font-sans mt-2" style={{ color: "#8B6A52" }}>Each piece is handmade — no two are exactly alike.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {products.map((p, i) => (
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
                  <span className="text-xl font-bold" style={{ color: "#A05E3A" }}>${p.price}</span>
                  <button onClick={() => prefillOrder(p)}
                          className="font-sans text-sm font-semibold px-4 py-1.5 rounded-full text-white transition-colors"
                          style={{ backgroundColor: "#C67B52" }}
                          onMouseOver={e => (e.currentTarget.style.backgroundColor = "#A05E3A")}
                          onMouseOut={e  => (e.currentTarget.style.backgroundColor = "#C67B52")}>
                    Order
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
          <h2 className="text-3xl font-bold mb-6" style={{ color: "#5C3A1E" }}>Why We Do This</h2>
          <p className="font-sans mb-4" style={{ color: "#8B6A52" }}>
            Building Libraries is a community-driven project with one simple belief: every child deserves access to books. Our pottery is thrown, glazed, and fired by volunteers and local artisans.
          </p>
          <blockquote className="text-left border-l-4 pl-5 py-2 my-6 italic text-lg rounded-r-xl"
                      style={{ borderColor: "#C67B52", backgroundColor: "#FDF6EC", color: "#5C3A1E" }}>
            &ldquo;The library was the first place I ever felt like the world was big enough for me.&rdquo;
          </blockquote>
          <p className="font-sans" style={{ color: "#8B6A52" }}>
            Every dollar goes directly toward books, shelves, and training teachers to run reading programs.
          </p>
        </div>
      </section>

      {/* ORDER FORM */}
      <section id="order" className="py-20 px-4" style={{ backgroundColor: "#FFFBF5" }}>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold" style={{ color: "#5C3A1E" }}>Place an Order</h2>
          <p className="font-sans mt-2" style={{ color: "#8B6A52" }}>We&apos;ll reply within 24 hours to confirm and arrange payment.</p>
        </div>
        <form onSubmit={submitOrder} className="max-w-lg mx-auto rounded-xl p-8 space-y-4"
              style={{ backgroundColor: "#FDF6EC", boxShadow: "0 2px 16px rgba(60,30,10,0.08)" }}>
          <div>
            <label className="block font-sans font-semibold text-sm mb-1" style={{ color: "#5C3A1E" }}>Your Name</label>
            <input name="name" required placeholder="Jane Smith"
                   className="w-full border rounded-lg px-3 py-2 font-sans text-sm bg-white focus:outline-none focus:border-[#C67B52]"
                   style={{ borderColor: "#D9C4AD" }} />
          </div>
          <div>
            <label className="block font-sans font-semibold text-sm mb-1" style={{ color: "#5C3A1E" }}>Email Address</label>
            <input name="email" type="email" required placeholder="jane@example.com"
                   className="w-full border rounded-lg px-3 py-2 font-sans text-sm bg-white focus:outline-none focus:border-[#C67B52]"
                   style={{ borderColor: "#D9C4AD" }} />
          </div>
          <div>
            <label className="block font-sans font-semibold text-sm mb-1" style={{ color: "#5C3A1E" }}>Item</label>
            <select name="item" required
                    value={selected ? `${selected.name} — $${selected.price}` : ""}
                    onChange={e => setSelected(null)}
                    className="w-full border rounded-lg px-3 py-2 font-sans text-sm bg-white focus:outline-none focus:border-[#C67B52]"
                    style={{ borderColor: "#D9C4AD" }}>
              <option value="" disabled>Select a product…</option>
              {products.map(p => (
                <option key={p.id} value={`${p.name} — $${p.price}`}>{p.name} — ${p.price}</option>
              ))}
              <option value="Multiple items (describe below)">Multiple items (describe below)</option>
            </select>
          </div>
          <div>
            <label className="block font-sans font-semibold text-sm mb-1" style={{ color: "#5C3A1E" }}>Quantity</label>
            <input name="qty" type="number" min="1" max="99" defaultValue="1" required
                   className="w-full border rounded-lg px-3 py-2 font-sans text-sm bg-white focus:outline-none focus:border-[#C67B52]"
                   style={{ borderColor: "#D9C4AD" }} />
          </div>
          <div>
            <label className="block font-sans font-semibold text-sm mb-1" style={{ color: "#5C3A1E" }}>Notes</label>
            <textarea name="message" rows={3} placeholder="Colour preferences, gift wrapping, delivery notes…"
                      className="w-full border rounded-lg px-3 py-2 font-sans text-sm bg-white focus:outline-none focus:border-[#C67B52] resize-none"
                      style={{ borderColor: "#D9C4AD" }} />
          </div>
          <button type="submit"
                  className="w-full text-white font-sans font-semibold py-3 rounded-full transition-colors"
                  style={{ backgroundColor: "#C67B52" }}
                  onMouseOver={e => (e.currentTarget.style.backgroundColor = "#A05E3A")}
                  onMouseOut={e  => (e.currentTarget.style.backgroundColor = "#C67B52")}>
            Send My Order
          </button>
          <p className="font-sans text-xs text-center" style={{ color: "#8B6A52" }}>
            Your inquiry will be sent to{" "}
            <a href="mailto:tinysunmoon@gmail.com" className="underline" style={{ color: "#C67B52" }}>
              tinysunmoon@gmail.com
            </a>
          </p>
        </form>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-10 px-4 font-sans text-sm" style={{ backgroundColor: "#5C3A1E", color: "#F0E0C8" }}>
        <p className="font-bold text-base mb-1 text-[#FDF6EC]">Building Libraries — Pottery for a Purpose</p>
        <p>Questions? <a href="mailto:tinysunmoon@gmail.com" className="text-[#C67B52] hover:underline">tinysunmoon@gmail.com</a></p>
        <p className="mt-4 opacity-50 text-xs">© 2026 Building Libraries. All proceeds support children&apos;s education.</p>
      </footer>

      {/* Toast */}
      {toastVisible && (
        <div className="fixed bottom-6 right-6 font-sans text-sm font-semibold px-5 py-3 rounded-xl shadow-lg text-[#FDF6EC]"
             style={{ backgroundColor: "#5C3A1E" }}>
          Your order email is opening!
        </div>
      )}
    </div>
  );
}
