"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Product {
  id: number;
  slug: string;
  nameBn?: string;
  image: string;
  unit: string;
  today: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
}

const enToBn = (num: number | string) =>
  num.toString().replace(/\d/g, d => "০১২৩৪৫৬৭৮৯"[parseInt(d)]);

const DecreasingProductPrices = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "https://openapi.programming-hero.com/api/bazardor/products"
        );
        if (!res.ok) throw new Error("ডেটা লোড হয়নি");

        const result = await res.json();
        const allProducts: Product[] = Array.isArray(result)
          ? result
          : (result.data ?? []);

        const topProducts = allProducts
          .filter((p) => p.change?.dir === "down")
          .sort((a, b) => a.change.pct - b.change.pct)
          .slice(0, 6);

        setProducts(topProducts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="w-full py-6 text-center">
        <p className="text-gray-500">দাম কমার তালিকা লোড হচ্ছে...</p>
      </section>
    );
  }

  return (
    <section className="w-full py-6 bg-green-50/50 rounded-xl">
      <h1 className="mb-6 flex items-center gap-2 text-xl font-bold text-gray-900">
        <span className="text-green-600">▼</span>
        আজকে দাম কমেছে
      </h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="block rounded-2xl border-2 border-[#dce5dc] bg-white p-4 transition-shadow hover:shadow-md"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f0f5f0] text-2xl">
                {product.image}
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">
                  {product.nameBn || product.slug.replaceAll("-", " ")}
                </h2>
                <p className="text-xs text-gray-500">
                  প্রতি {product.unit}
                </p>
              </div>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <p className="mb-1 text-xs text-gray-500">আজকের দাম</p>
                <p className="text-lg font-bold text-gray-900">
                  <span className="mr-1 text-sm font-normal">৳</span>
                  {enToBn(product.today)}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                ▼ {enToBn(Math.abs(product.change.pct))}%
              </span>
            </div>
          </Link>
        ))}
      </div>

      {products.length === 0 && (
        <p className="py-10 text-center text-gray-500">
          আজকে কোনো পণ্যের দাম কমেনি
        </p>
      )}
    </section>
  );
};

export default DecreasingProductPrices;