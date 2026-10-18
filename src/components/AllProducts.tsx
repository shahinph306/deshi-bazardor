"use client";
import { useMemo, useState } from "react";
import Link from "next/link";

export interface Product {
  id: number;
  slug: string;
  name?: string;
  nameEn?: string;
  nameBn?: string;
  image: string;
  unit: string;
  today: number;
  yesterday?: number;
  change: {
    dir: "up" | "down" | "same";
    pct: number;
  };
}

type SortOption = "default" | "price-low" | "price-high" | "name";

// সংখ্যাকে বাংলায় রূপান্তর
const enToBn = (num: number | string) =>
  num.toString().replace(/\d/g, d => "০১২৩৪৫৬৭৮৯"[parseInt(d)]);

export default function AllProductsPrices({
  products,
}: {
  products: Product[];
}) {
  const [sort, setSort] = useState<SortOption>("default");

  const sortedProducts = useMemo(() => {
    const items = [...products];
    switch (sort) {
      case "price-low":
        return items.sort((a, b) => a.today - b.today);
      case "price-high":
        return items.sort((a, b) => b.today - a.today);
      case "name":
        return items.sort((a, b) =>
          (a.nameBn || a.nameEn || a.name || a.slug).localeCompare(
            b.nameBn || b.nameEn || b.name || b.slug
          )
        );
      default:
        return items;
    }
  }, [products, sort]);

  return (
    <section className="w-full py-4">
      {/* শিরোনাম ও সাজানোর অপশন */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            সব পণ্য
          </h1>
          <p className="mt-2 text-[15px] text-gray-500">
            মোট {enToBn(products.length)}টি পণ্য দেখানো হচ্ছে
          </p>
        </div>
        <label className="flex items-center gap-2 text-xs text-gray-600">
          সাজান
          <select
            value={sort}
            onChange={(event) =>
              setSort(event.target.value as SortOption)
            }
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs outline-none focus:border-green-600"
          >
            <option value="default">সাধারণ</option>
            <option value="price-low">দাম: কম থেকে বেশি</option>
            <option value="price-high">দাম: বেশি থেকে কম</option>
            <option value="name">নাম অনুযায়ী</option>
          </select>
        </label>
      </div>

      {/* পণ্যসমূহ */}
      {sortedProducts.length > 0 ? (
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedProducts.map((product) => {
            // বাংলা নাম প্রাধান্য দিচ্ছি
            const productName =
              product.nameBn ||
              product.nameEn ||
              product.name ||
              product.slug.replaceAll("-", " ");

            const trendColor =
              product.change?.dir === "up"
                ? "text-red-500"
                : product.change?.dir === "down"
                  ? "text-green-600"
                  : "text-gray-500";

            return (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="block rounded-2xl border border-[#dce5dc] bg-[#fbfdfb] p-4 transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f0f5f0] text-2xl">
                    {product.image || "🛒"}
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-semibold text-gray-900">
                      {productName}
                    </h2>
                    <p className="text-xs text-gray-500">
                      প্রতি {product.unit}
                    </p>
                  </div>
                </div>

                <p className="mb-1 text-xs text-gray-500">আজকের দাম</p>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-lg font-bold text-gray-900">
                    <span className="mr-1 text-sm font-normal">৳</span>
                    {enToBn(product.today)}
                  </p>
                  <span
                    className={`inline-flex shrink-0 items-center gap-1 rounded-full bg-[#f0f5f0] px-3 py-1 text-xs font-medium ${trendColor}`}
                  >
                    {product.change?.dir === "up"
                      ? "▲"
                      : product.change?.dir === "down"
                        ? "▼"
                        : "—"}{" "}
                    {enToBn(Math.abs(product.change?.pct ?? 0))}%
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="py-12 text-center text-sm text-gray-500">
          কোনো পণ্য পাওয়া যায়নি
        </p>
      )}
    </section>
  );
}