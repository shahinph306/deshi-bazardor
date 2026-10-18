import Link from "next/link";

export default function NotFoundPage() {
  return (
    <section className="flex min-h-[420px] flex-1 flex-col items-center justify-center bg-[#F0F5F0] px-4 py-12 text-center">
      <div className="mb-3 text-6xl" role="img" aria-label="কেনাকাটার ঝুড়ি">
        🛒
      </div>
      <h1 className="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl">
        পেজটি পাওয়া যায়নি
      </h1>
      <p className="mb-5 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
        আপনি যে প্রোডাক্ট বা পেজটি খুঁজছেন সেটি সরিয়ে ফেলা হয়েছে অথবা কখনোই ছিল না।
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Link
          href="/"
          className="rounded-lg bg-green-700 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-green-800"
        >
          হোম পেজে যান
        </Link>
        <Link
          href="/auth/sign-in"
          className="rounded-lg border border-gray-800 px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-200"
        >
          সাইন ইন পেজে যান
        </Link>
      </div>
    </section>
  );
}