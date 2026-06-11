import { getProducts } from "@/lib/google";
import ShopClient from "./ShopClient";

export const revalidate = 60; // ISR: refresh products every 60 seconds

export default async function HomePage() {
  let products: Record<string, string>[] = [];
  try {
    products = await getProducts();
  } catch {
    // On first deploy before env vars are set, fall back to empty
  }

  return <ShopClient products={products} />;
}
