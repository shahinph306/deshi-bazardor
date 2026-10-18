/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
// /* eslint-disable @next/next/no-img-element */
// import { auth } from "@/lib/auth";
// import Link from "next/link";
// import { headers } from "next/headers"; // ✅ যোগ করুন

// export default async function ProfilePage() {
//   // ✅ headers পাঠানো জরুরী — Next.js 16-এ
//   const session = await auth.api.getSession({
//     headers: await headers()
//   });
  
//   const user = session?.user;

//   if (!user) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center p-6">
//         <p className="text-lg text-gray-600 mb-4">অনুগ্রহ করে প্রথমে লগইন করুন</p>
//         <Link
//           href="/auth/sign-in"
//           className="bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700"
//         >
//           সাইন ইন করুন
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-2xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-2">আমার প্রোফাইল</h1>
//       <p className="text-gray-500 mb-8">আপনার অ্যাকাউন্টের তথ্য এখানে পরিবর্তন করতে পারবেন।</p>

//       <div className="bg-white rounded-lg shadow p-6 mb-6 flex items-center gap-4">
//         {user.image ? (
//           <img
//             src={user.image}
//             alt={user.name || "প্রোফাইল ছবি"}
//             className="w-16 h-16 rounded-full object-cover border-2 border-green-500"
//             referrerPolicy="no-referrer"
//           />
//         ) : (
//           <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-white text-xl font-bold">
//             {user.name?.charAt(0).toUpperCase() || "ব্য"}
//           </div>
//         )}
//         <div>
//           <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
//           <p className="text-gray-500">{user.email}</p>
//         </div>
//         <Link
//           href="/"
//           className="ml-auto px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 text-sm"
//         >
//           হোমে ফিরে যান
//         </Link>
//       </div>

//       <div className="bg-white rounded-lg shadow p-6">
//         <h3 className="font-semibold text-lg mb-4">তথ্য পরিবর্তন করুন</h3>
//         <form className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               আপনার নাম
//             </label>
//             <input
//               type="text"
//               name="name"
//               defaultValue={user.name || ""}
//               className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
//               placeholder="আপনার নাম লিখুন"
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
//           >
//             হালনাগাদ করুন
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }






"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session, isPending, refetch } = authClient.useSession();
  const user = session?.user;
  const router = useRouter();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user?.name]);

  if (isPending) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <p className="text-gray-500">লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <p className="text-lg text-gray-600 mb-4">অনুগ্রহ করে প্রথমে লগইন করুন</p>
        <Link
          href="/auth/sign-in"
          className="bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700"
        >
          সাইন ইন করুন
        </Link>
      </div>
    );
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/update-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (!res.ok) throw new Error("আপডেট ব্যর্থ");

      setMessage("✅ নাম হালনাগাদ হয়েছে!");
      await refetch();
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      setMessage("❌ কিছু সমস্যা হয়েছে — আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  // ✅ নতুন — সাইন আউট ফাংশন
  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await authClient.signOut();
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("সাইন আউট ব্যর্থ:", err);
      setSigningOut(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">আমার প্রোফাইল</h1>
      <p className="text-gray-500 mb-8">আপনার তথ্য পরিবর্তন ও হালনাগাদ করুন।</p>

      <div className="bg-white rounded-lg shadow p-6 mb-6 flex items-center gap-4">
        {user.image ? (
          <img
            src={user.image}
            alt={user.name || "প্রোফাইল ছবি"}
            className="w-16 h-16 rounded-full object-cover border-2 border-green-500"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-white text-xl font-bold">
            {user.name?.charAt(0).toUpperCase() || "ব্য"}
          </div>
        )}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>
        </div>

        {/* ✅ নতুন — ছবির মতো সাইন আউট বাটন */}
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="ml-auto flex items-center gap-2 px-5 py-2.5 border-2 border-red-200 rounded-full text-red-600 hover:bg-red-50 hover:border-red-300 transition-all disabled:opacity-50"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          {signingOut ? "বিচ্ছিন্ন হচ্ছে..." : "সাইন আউট"}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold text-lg mb-4">নাম পরিবর্তন করুন</h3>

        {message && (
          <p className={`mb-4 text-sm ${message.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              নতুন নাম
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="আপনার নতুন নাম লিখুন"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {loading ? "হালনাগাদ হচ্ছে..." : "হালনাগাদ করুন"}
          </button>
        </form>
      </div>
    </div>
  );
}