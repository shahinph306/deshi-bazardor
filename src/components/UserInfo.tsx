"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function UserInfo() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    const { error } = await authClient.signOut();
    if (error) {
      toast.error("সাইন আউট ব্যর্থ! আবার চেষ্টা করুন ❌");
      return;
    }
    toast.success("সফলভাবে সাইন আউট হয়েছে! দেখা হবে 👋");
    setIsMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/auth/sign-in" className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50">
          সাইন ইন
        </Link>
        <Link href="/auth/sign-up" className="rounded-lg bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700">
          সাইন আপ
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-50"
      >
        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center overflow-hidden">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name || "User"}
              width={40}
              height={40}
              className="object-cover"
              unoptimized
            />
          ) : (
            <span className="text-green-700 font-bold text-lg">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </span>
          )}
        </div>
        <span className="text-sm font-medium">{user.name || "ব্যবহারকারী"}</span>
        <svg
          className={`h-4 w-4 transition-transform ${isMenuOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isMenuOpen && (
        <>
          <button
            type="button"
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 z-10"
          />
          <div className="absolute right-0 top-full z-20 mt-2 w-64 rounded-xl border bg-white shadow-lg p-2">
            <div className="p-3 border-b">
              <p className="font-semibold">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <Link
              href="/profile"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50"
            >
              আমার প্রোফাইল
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 mt-1"
            >
              সাইন আউট
            </button>
          </div>
        </>
      )}
    </div>
  );
}