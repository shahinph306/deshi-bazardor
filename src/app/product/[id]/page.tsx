export const instant = false;
import Link from "next/link";
import { notFound } from "next/navigation";

interface Market {
  market: string;
  division: string;
  min: number;
  max: number;
}

interface ProductData {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
  markets: Market[];
}

const enToBn = (n: number | string) =>
  n.toString().replace(/\d/g, d => "০১২৩৪৫৬৭৮৯"[+d]);

async function getProduct(id: string) {
  const res = await fetch(
    `https://openapi.programming-hero.com/api/bazardor/products/${id}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return null;
  return res.json() as Promise<ProductData>;
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);
  
  if (!product) notFound();

  const productName = product.nameBn;
  const categoryName = product.categoryNameBn;
  const unitLabel = product.unit === "dozen" ? "ডজন" : product.unit;
  
  const priceChangeText = product.change.dir === "up"
    ? `গতকালের চেয়ে দাম বেড়েছে ${enToBn(Math.abs(product.change.pct))}%`
    : product.change.dir === "down"
    ? `গতকালের চেয়ে দাম কমেছে ${enToBn(Math.abs(product.change.pct))}%`
    : "গতকালের মতো দাম অপরিবর্তিত";

  const minPrice = Math.min(...product.markets.map(m => m.min));
  const maxPrice = Math.max(...product.markets.map(m => m.max));
  const avgPrice = (
    product.markets.reduce((s, m) => s + (m.min + m.max) / 2, 0) / product.markets.length
  ).toFixed(0);

  return (
    <main className="min-h-screen bg-[#f0f5f0] py-6 px-4">
      <div className="container mx-auto">
        <div className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:underline">হোম</Link>
          <span> / </span>
          <span className="text-gray-800 font-medium">{productName}</span>
        </div>

        <div className="bg-white rounded-2xl border border-[#dce5dc] p-6 mb-6 flex justify-between items-start flex-wrap gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#f0f5f0] flex items-center justify-center text-2xl">
              {product.image}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{productName}</h1>
              <p className="text-gray-500 text-sm mt-1">
                প্রতি {unitLabel} • {categoryName}
              </p>
              <p className="text-gray-500 text-sm mt-2">{priceChangeText}</p>
            </div>
          </div>
          <div className="text-center bg-[#f0f5f0] rounded-xl p-4 min-w-35">
            <p className="text-xs text-gray-500">আজকের দাম</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">৳ {enToBn(product.today)}</p>
            <p className="text-xs text-gray-500 mt-1">প্রতি {unitLabel}</p>
            <p className={`text-sm font-medium mt-1 ${
              product.change.dir === "down" ? "text-green-600" : "text-red-500"
            }`}>
              {product.change.dir === "up" ? "▲" : product.change.dir === "down" ? "▼" : "—"}
              {" "}{enToBn(Math.abs(product.change.pct))}%
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#dce5dc] p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">দামের সারসংক্ষেপ</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl bg-[#f0f5f0] p-4">
              <p className="text-xs text-gray-500">সর্বনিম্ন দাম</p>
              <p className="text-xl font-bold text-green-600 mt-1">৳ {enToBn(minPrice)}</p>
              <p className="text-xs text-gray-400 mt-1">সবচেয়ে কম দামের বাজার</p>
            </div>
            <div className="rounded-xl bg-[#f0f5f0] p-4">
              <p className="text-xs text-gray-500">সর্বোচ্চ দাম</p>
              <p className="text-xl font-bold text-red-500 mt-1">৳ {enToBn(maxPrice)}</p>
              <p className="text-xs text-gray-400 mt-1">সবচেয়ে বেশি দামের বাজার</p>
            </div>
            <div className="rounded-xl bg-[#f0f5f0] p-4">
              <p className="text-xs text-gray-500">গড় দাম</p>
              <p className="text-xl font-bold text-gray-900 mt-1">৳ {enToBn(avgPrice)}</p>
              <p className="text-xs text-gray-400 mt-1">প্রতি {unitLabel} হিসেবে</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#dce5dc] overflow-hidden">
          <div className="p-4 border-b border-[#dce5dc] font-bold text-gray-900">
            আজকের বিভিন্ন বাজারের দাম
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#f0f5f0] text-left">
                <tr>
                  <th className="px-4 py-3 font-medium text-gray-600">বাজার</th>
                  <th className="px-4 py-3 font-medium text-gray-600">বিভাগ</th>
                  <th className="px-4 py-3 font-medium text-gray-600">সর্বনিম্ন</th>
                  <th className="px-4 py-3 font-medium text-gray-600">সর্বোচ্চ</th>
                  <th className="px-4 py-3 font-medium text-gray-600">গড়</th>
                </tr>
              </thead>
              <tbody>
                {product.markets.map((market, i) => {
                  const avg = ((market.min + market.max) / 2).toFixed(0);
                  return (
                    <tr key={i} className="border-t border-[#f0f0f0] hover:bg-[#f9faf9]">
                      <td className="px-4 py-3 font-bold text-gray-800">{market.market}</td>
                      <td className="px-4 py-3 text-gray-500">{market.division}</td>
                      <td className="px-4 py-3 font-medium">৳ {enToBn(market.min)}</td>
                      <td className="px-4 py-3 font-medium">৳ {enToBn(market.max)}</td>
                      <td className="px-4 py-3 font-medium text-green-700">৳ {enToBn(avg)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}