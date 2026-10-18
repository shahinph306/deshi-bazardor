
import Image from "next/image";
import banner from "../../public/basket.svg";
import CurrentDate from "@/components/Date";
import HomeScrollButton from "../components/HomeScrollButton";
import RisingProductsPrices from "../components/RisingProductsPrices";
import DecreasingProductPrices from "@/components/DecresingProductPrices";
import AllProductsPrices from "../components/AllProducts";


export default async function Home() {
  const response = await fetch(
    "https://openapi.programming-hero.com/api/bazardor/products",
    {
      next: { revalidate: 60 },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const result = await response.json();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const products = Array.isArray(result)
    ? result
    : result.data?.products ?? result.data ?? result.products ?? [];

  return (
    <main className="w-full">
      
      <div className="mx-auto container px-4">

        <section className="mt-12  flex w-full items-center justify-between gap-6 border border-gray-300 bg-base-100 px-4 py-12">
          <div className="flex-1">
            
             <div className="text-green-700 bg-green-200 w-max">
              <CurrentDate></CurrentDate>
             </div>
          
            <h1 className="py-4 text-2xl font-bold sm:text-3xl lg:text-4xl">
              আজকের বাজারের দাম এক নজরে
            </h1>

            <p className="py-2 text-gray-500">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
            </p>

            <div className="pt-6">
              <HomeScrollButton />
            </div>
          </div>

          <div className="hidden shrink-0 sm:block">
            <Image
              src={banner}
              alt="Basket of vegetables"
              width={240}
              height={240}
              priority
              className="h-auto w-full max-w-60"
            />
          </div>
        </section>

        <section className="w-full py-2">
          <RisingProductsPrices />
        </section>

        <section className="w-full py-2">
          <DecreasingProductPrices />
        </section>

        <section id="all-products-section" className="w-full py-2">
          <AllProductsPrices products={products} />
        </section>

      </div>
    </main>
  );
}