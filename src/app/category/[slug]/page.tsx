/* eslint-disable react-hooks/set-state-in-effect */

'use client';

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef, Suspense } from "react";

interface Product {
  id: number;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  image: string;
  unit: string;
  today: number;
  change: { dir: "up" | "down" | "flat"; pct: number };
}

type SortOption = "default" | "price-asc" | "price-desc";

const enToBn = (n: number | string) =>
  n.toString().replace(/\d/g, d => "০১২৩৪৫৬৭৮৯"[+d]);

const STORAGE_KEY = "bazardor-sort-preference";

async function getProducts() {
  const res = await fetch(
    "https://openapi.programming-hero.com/api/bazardor/products",
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : (data.data || []);
}

function CategoryContent() {
  const params = useParams();
  const slug = params.slug as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentSort, setCurrentSort] = useState<SortOption>("default");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as SortOption;
    if (saved) setCurrentSort(saved);
  }, []);

  useEffect(() => {
    async function load() {
      const all = await getProducts();
      setProducts(all.filter((p: { category: string; }) => p.category === slug));
      setLoading(false);
    }
    load();
  }, [slug]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSortChange = (value: SortOption) => {
    setCurrentSort(value);
    localStorage.setItem(STORAGE_KEY, value);
    setIsDropdownOpen(false);
  };

  const sortedProducts = (() => {
    const arr = [...products];
    if (currentSort === "price-asc") {
      arr.sort((a, b) => a.today - b.today);
    } else if (currentSort === "price-desc") {
      arr.sort((a, b) => b.today - a.today);
    }
    return arr;
  })();

  const categoryName = products[0]?.categoryNameBn || slug;

  const sortOptions = [
    { value: "default" as SortOption, label: "ডিফল্ট" },
    { value: "price-asc" as SortOption, label: "দাম: কম থেকে বেশি" },
    { value: "price-desc" as SortOption, label: "দাম: বেশি থেকে কম" },
  ];
  const selectedLabel = sortOptions.find(o => o.value === currentSort)?.label || "ডিফল্ট";

  if (loading) {
    return (
      <div className="text-center py-12">
        <p>লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      {/* ক্যাটাগরি হেডার */}
      <div className="bg-white p-5 rounded-xl shadow-sm mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{products[0]?.image || '📦'}</span>
          <div>
            <h1 className="text-xl font-bold">{categoryName}</h1>
            <p className="text-sm text-gray-500">
              মোট {enToBn(products.length)}টি পণ্যের আজকের দাম ও পরিবর্তন
            </p>
          </div>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2"
          >
            <span className="text-sm text-gray-600">সাজান:</span>
            <span className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors">
              <span className="text-sm font-medium">{selectedLabel}</span>
              <span className={`text-xs transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}>▼</span>
            </span>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-1 w-52 bg-white rounded-lg shadow-lg border z-10 overflow-hidden">
              {sortOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={`block w-full text-left px-4 py-2.5 text-sm transition-colors ${
                    currentSort === option.value
                      ? "bg-green-50 text-green-700 font-medium"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        মোট {enToBn(sortedProducts.length)}টি পণ্য দেখানো হচ্ছে
      </p>

      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedProducts.map(p => (
            <Link
              key={p.id}
              href={`/product/${p.id}`}
              className="block p-4 bg-white rounded-2xl border-2 border-[#dce5dc] hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#f0f5f0] text-2xl">
                  {p.image}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">{p.nameBn}</h2>
                  <p className="text-xs text-gray-500">প্রতি {p.unit}</p>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">আজকের দাম</p>
                  <p className="text-lg font-bold">৳ {enToBn(p.today)}</p>
                </div>
                <span className={`px-3 py-1 rounded-full bg-[#f0f5f0] text-xs font-medium ${
                  p.change.dir === "up" ? "text-red-500" :
                  p.change.dir === "down" ? "text-green-600" : "text-gray-500"
                }`}>
                  {p.change.dir === "up" ? "▲" : p.change.dir === "down" ? "▼" : "—"}{" "}
                  {enToBn(Math.abs(p.change.pct))}%
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-gray-500">
          এই বিভাগে কোনো পণ্য পাওয়া যায়নি
        </p>
      )}
    </div>
  );
}

export default function CategoryPage() {
  return (
    <main className="min-h-screen bg-[#f0f5f0] py-6 px-4">
      <Suspense fallback={
        <div className="container mx-auto max-w-5xl text-center py-12">
          <p>লোড হচ্ছে...</p>
        </div>
      }>
        <CategoryContent />
      </Suspense>
    </main>
  );
}