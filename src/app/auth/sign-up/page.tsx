"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const image = (formData.get("image") as string) || "";

    const { data, error } = await authClient.signUp.email({
      name,
      email,
      password,
      image,
      callbackURL: "/",
    });

    if (data) {
      toast.success("অ্যাকাউন্ট তৈরি সফল! স্বাগতম 🎉");
      router.push("/");
      router.refresh();
      return;
    }

    if (error) {
      console.error(error);
      const message = error.message || "সাইন আপ ব্যর্থ হয়েছে। আবার চেষ্টা করুন।";
      setErrorMsg(message);
      toast.error(`সাইন আপ ব্যর্থ! ${message} ❌`);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
      <div className="w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-800">সাইন আপ</h2>
        <p className="text-gray-500 text-sm mt-2 mb-8">
          বিস্তারিত দাম ও বাজারের তথ্য দেখতে অ্যাকাউন্ট তৈরি করুন।
        </p>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              নাম
            </label>
            <input
              name="name"
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="আপনার নাম লিখুন"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              প্রোফাইল ছবির লিঙ্ক <span className="text-gray-400 text-xs">(ঐচ্ছিক)</span>
            </label>
            <input
              name="image"
              type="url"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="https://example.com/photo.jpg"
            />
          </div>
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
              minLength={8}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="কমপক্ষে ৮টি অক্ষর"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "সাইন আপ করুন"}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-6">
          ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
          <Link href="/auth/sign-in" className="text-green-600 font-medium hover:underline">
            সাইন ইন করুন
          </Link>
        </p>
        <p className="text-xs text-gray-400 mt-4">
          <Link href="/" className="hover:underline">← হোম পেজে ফিরে যান</Link>
        </p>
      </div>
    </div>
  );
}