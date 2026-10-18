import Image from "next/image";
import { Suspense } from "react";
import banner from "../../public/basket.svg";
import CurrentDate from "@/components/Date";
import HomeScrollButton from "../components/HomeScrollButton";
import RisingProductsPrices from "../components/RisingProductsPrices";
import DecreasingProductPrices from "../components/DecresingProductPrices";
import AllProductsPrices from "../components/AllProducts";
import ProductSkeleton from "@/components/ProductSkeleton";
import LoadingSpinner from "@/components/LoadingSpinner";

// ডাটা ফেচ করা কম্পোনেন্ট
async function ProductsData() {
  const response = await fetch(
    "https://openapi.programming-hero.com/api/bazardor/products",
    { next: { revalidate: 60 } }
  );

  if (!response.ok) {
    throw new Error("প্রোডাক্ট লোড করতে ব্যর্থ হয়েছে");
  }

  const result = await response.json();
  const products = Array.isArray(result)
    ? result
    : result.data?.products ?? result.data ?? result.products ?? [];

  return <AllProductsPrices products={products} />;
}

// মূল হোম পেজ
export default function Home() {
  return (
    <main className="w-full">
      <div className="mx-auto container px-4">
        {/* হিরো সেকশন — সবসময় দেখাবে */}
        <section className="mt-12 flex w-full items-center justify-between gap-6 border border-gray-300 bg-base-100 px-4 py-12">
          <div className="flex-1">
            <div className="text-green-700 bg-green-200 w-max px-3 py-1 rounded-full text-sm">
              <CurrentDate />
            </div>

            <h1 className="py-4 text-2xl font-bold sm:text-3xl lg:text-4xl">
              আজকের বাজারের দাম এক নজরে
            </h1>
            <p className="py-2 text-gray-500 max-w-lg">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
            </p>
            <div className="pt-6">
              <HomeScrollButton />
            </div>
          </div>
          <div className="hidden shrink-0 sm:block">
            <Image
              src={banner}
              alt="সবজির ঝুড়ি"
              width={240}
              height={240}
              priority
              className="h-auto w-full max-w-60"
            />
          </div>
        </section>

        {/* দাম বাড়ছে — লোডিংসহ */}
        <section className="w-full py-6">
          <Suspense fallback={<LoadingSpinner text="দাম বাড়ছে এমন প্রোডাক্ট লোড হচ্ছে..." />}>
            <RisingProductsPrices />
          </Suspense>
        </section>

        {/* দাম কমছে — লোডিংসহ */}
        <section className="w-full py-6">
          <Suspense fallback={<LoadingSpinner text="দাম কমছে এমন প্রোডাক্ট লোড হচ্ছে..." />}>
            <DecreasingProductPrices />
          </Suspense>
        </section>

        {/* সব প্রোডাক্ট — স্কেলটনসহ */}
        <section id="all-products-section" className="w-full py-6">
          <Suspense fallback={
            <div>
              <h2 className="text-xl font-bold mb-4">সব প্রোডাক্ট</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            </div>
          }>
            <ProductsData />
          </Suspense>
        </section>
      </div>
    </main>
  );
}