"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { data, error } = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/",
    });

    if (data) {
      router.push("/");
      router.refresh();
    }
    if (error) {
      console.error(error);
      setErrorMsg("ইমেইল বা পাসওয়ার্ড ভুল! আবার চেষ্টা করুন।");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  const handleGithubSignIn = async () => {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/",
    });
  };

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-800">সাইন ইন</h2>
        <p className="text-gray-500 text-sm mt-2 mb-8">
          বিস্তারিত দাম, বাজারের তথ্য ও প্রোফাইল দেখতে অ্যাকাউন্টে প্রবেশ করুন।
        </p>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ইমেইল
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              পাসওয়ার্ড
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="আপনার পাসওয়ার্ড"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "সাইন ইন হচ্ছে..." : "সাইন ইন করুন"}
          </button>
        </form>

        <div className="flex items-center justify-center my-6 text-xs text-gray-400">
          <div className="h-px bg-gray-200 flex-1"></div>
          <span className="px-3">অথবা</span>
          <div className="h-px bg-gray-200 flex-1"></div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={handleGoogleSignIn}
            type="button"
            className="flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-2.5 hover:bg-gray-50 text-sm"
          >
            <Image src="/google.png" alt="Google" width={18} height={18} unoptimized />
            Google দিয়ে চালু করুন
          </button>
          <button
            onClick={handleGithubSignIn}
            type="button"
            className="flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-2.5 hover:bg-gray-50 text-sm"
          >
            <Image src="/github.png" alt="GitHub" width={18} height={18} unoptimized />
            GitHub দিয়ে চালু করুন
          </button>
        </div>

        <p className="text-sm text-gray-500">
          অ্যাকাউন্ট নেই?{" "}
          <Link href="/auth/sign-up" className="text-green-600 font-medium hover:underline">
            সাইন আপ করুন
          </Link>
        </p>
        <p className="text-xs text-gray-400 mt-4">
          <Link href="/" className="hover:underline">← হোম পেজে ফিরে যান</Link>
        </p>
      </div>
    </main>
  );
}