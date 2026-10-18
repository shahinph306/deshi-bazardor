// "use client";
// import { authClient } from "@/lib/auth-client";
// import Link from "next/link";
// import { useState } from "react";
// import Image from "next/image";
// import { redirect } from "next/navigation";

// export default function UserInfo() {
//     const { data: session } = authClient.useSession();
//     const user = session?.user;
//     const [isMenuOpen, setIsMenuOpen] = useState(false);
//     const [failedImages, setFailedImages] = useState<string[]>([]);

//     const avatarLetter = user?.name?.charAt(0).toUpperCase() || "ব্য";
//     const imageUrl = user?.image || "";

//     const headerImageKey = `header:${imageUrl}`;
//     const menuImageKey = `menu:${imageUrl}`;
//     const headerImageError = failedImages.includes(headerImageKey);
//     const menuImageError = failedImages.includes(menuImageKey);

//     const markImageFailed = (key: string) => {
//         setFailedImages((prev) =>
//             prev.includes(key) ? prev : [...prev, key]
//         );
//     };

//     if (!user) {
//         return (
//             <div className="flex items-center gap-2">
//                 <Link
//                     href="/auth/sign-in"
//                     className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
//                 >
//                     সাইন ইন
//                 </Link>
//                 <Link
//                     href="/auth/sign-up"
//                     className="rounded-lg bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700"
//                 >
//                     সাইন আপ
//                 </Link>
//             </div>
//         );
//     }

//     return (
//         <div className="relative">
//             <button
//                 type="button"
//                 onClick={() => setIsMenuOpen((prev) => !prev)}
//                 className="flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-gray-50"
//                 aria-expanded={isMenuOpen}
//                 aria-label="ব্যবহারকারী মেনু খুলুন"
//             >
//                 <div className="relative h-8 w-8 shrink-0">
//                     {imageUrl && !headerImageError && (
//                         <Image
//                             src={imageUrl}
//                             alt={user.name || "ব্যবহারকারী"}
//                             width={40}
//                             height={40}
//                             unoptimized
//                             onError={() => markImageFailed(headerImageKey)}
//                             className="h-8 w-8 rounded-full border-2 border-green-500 object-cover"
//                         />
//                     )}
//                     {(!imageUrl || headerImageError) && (
//                         <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
//                             {avatarLetter}
//                         </div>
//                     )}
//                 </div>
//                 <span className="max-w-36 truncate text-sm font-medium text-gray-800">
//                     {user.name || "ব্যবহারকারী"}
//                 </span>
//                 <svg
//                     className={`h-4 w-4 text-gray-500 transition-transform ${isMenuOpen ? "rotate-180" : ""
//                         }`}
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                 >
//                     <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M19 9l-7 7-7-7"
//                     />
//                 </svg>
//             </button>

//             {isMenuOpen && (
//                 <>
//                     <button
//                         type="button"
//                         aria-label="মেনু বন্ধ করুন"
//                         className="fixed inset-0 z-10 cursor-default"
//                         onClick={() => setIsMenuOpen(false)}
//                     />
//                     <div className="absolute right-0 top-full z-20 mt-2 w-64 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
//                         <div className="flex items-center gap-3 border-b border-gray-100 p-4">
//                             <div className="relative h-10 w-10 shrink-0">
//                                 {imageUrl && !menuImageError && (
//                                     <Image
//                                         src={imageUrl}
//                                         alt={user.name || "ব্যবহারকারী"}
//                                         width={40}
//                                         height={40}
//                                         unoptimized
//                                         onError={() => markImageFailed(menuImageKey)}
//                                         className="h-10 w-10 rounded-full border-2 border-green-500 object-cover"
//                                     />
//                                 )}
//                                 {(!imageUrl || menuImageError) && (
//                                     <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 font-bold text-white">
//                                         {avatarLetter}
//                                     </div>
//                                 )}
//                             </div>
//                             <div className="min-w-0">
//                                 <p className="truncate font-semibold text-gray-900">
//                                     {user.name || "ব্যবহারকারী"}
//                                 </p>
//                                 <p className="mt-0.5 break-all text-xs text-gray-500">
//                                     {user.email}
//                                 </p>
//                             </div>
//                         </div>

//                         <div className="p-2">
//                             <Link
//                                 href="/profile"
//                                 onClick={() => setIsMenuOpen(false)}
//                                 className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-50"
//                             >
//                                 <svg
//                                     className="h-4 w-4"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     viewBox="0 0 24 24"
//                                 >
//                                     <path
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                         strokeWidth={2}
//                                         d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                                     />
//                                 </svg>
//                                 আমার প্রোফাইল
//                             </Link>

//                             <button
//                                 type="button"
//                                 onClick={async () => {
//                                     try {
//                                         const { error } = await authClient.signOut();
//                                         if (error) {
//                                             console.error("সাইন আউট ব্যর্থ:", error);
//                                             return;
//                                         }
//                                         // window.location.href = "/";
//                                         redirect("/")
//                                     } catch (err) {
//                                         console.error("সাইন আউট ব্যর্থ:", err);
//                                     }
//                                 }}
//                                 className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-red-600 hover:bg-red-50"
//                             >
//                                 <svg
//                                     className="h-4 w-4"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     viewBox="0 0 24 24"
//                                 >
//                                     <path
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                         strokeWidth={2}
//                                         d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
//                                     />
//                                 </svg>
//                                 সাইন আউট
//                             </button>
//                         </div>
//                     </div>
//                 </>
//             )}
//         </div>
//     );
// }






"use client";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

export default function UserInfo() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [failedImages, setFailedImages] = useState<string[]>([]);

  // ✅ ছবির আকার বড় করেছি — 32 → 40
  const avatarSize = 40;
  const avatarLetter = user?.name?.charAt(0).toUpperCase() || "ব্য";
  const imageUrl = user?.image || "";

  const headerImageKey = `header:${imageUrl}`;
  const menuImageKey = `menu:${imageUrl}`;
  const headerImageError = failedImages.includes(headerImageKey);
  const menuImageError = failedImages.includes(menuImageKey);

  const markImageFailed = (key: string) => {
    setFailedImages((prev) =>
      prev.includes(key) ? prev : [...prev, key]
    );
  };

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/auth/sign-in"
          className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
        >
          সাইন ইন
        </Link>
        <Link
          href="/auth/sign-up"
          className="rounded-lg bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700"
        >
          সাইন আপ
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsMenuOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-gray-50"
        aria-expanded={isMenuOpen}
        aria-label="ব্যবহারকারী মেনু খুলুন"
      >
        {/* ✅ হেডারের ছবি বড় করা হয়েছে */}
        <div className="relative h-10 w-10 shrink-0">
          {imageUrl && !headerImageError && (
            <Image
              src={imageUrl}
              alt={user.name || "ব্যবহারকারী"}
              width={avatarSize}
              height={avatarSize}
              unoptimized
              onError={() => markImageFailed(headerImageKey)}
              className="h-10 w-10 rounded-full border-2 border-green-500 object-cover"
            />
          )}
          {(!imageUrl || headerImageError) && (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-base font-bold text-white">
              {avatarLetter}
            </div>
          )}
        </div>

        <span className="max-w-36 truncate text-sm font-medium text-gray-800">
          {user.name || "ব্যবহারকারী"}
        </span>
        <svg
          className={`h-4 w-4 text-gray-500 transition-transform ${
            isMenuOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isMenuOpen && (
        <>
          <button
            type="button"
            aria-label="মেনু বন্ধ করুন"
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="absolute right-0 top-full z-20 mt-2 w-64 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
            <div className="flex items-center gap-3 border-b border-gray-100 p-4">
              {/* ড্রপডাউনের ছবি আগের মতোই আছে */}
              <div className="relative h-10 w-10 shrink-0">
                {imageUrl && !menuImageError && (
                  <Image
                    src={imageUrl}
                    alt={user.name || "ব্যবহারকারী"}
                    width={40}
                    height={40}
                    unoptimized
                    onError={() => markImageFailed(menuImageKey)}
                    className="h-10 w-10 rounded-full border-2 border-green-500 object-cover"
                  />
                )}
                {(!imageUrl || menuImageError) && (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 font-bold text-white">
                    {avatarLetter}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold text-gray-900">
                  {user.name || "ব্যবহারকারী"}
                </p>
                <p className="mt-0.5 break-all text-xs text-gray-500">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="p-2">
              <Link
                href="/profile"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-50"
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                আমার প্রোফাইল
              </Link>

              <button
                type="button"
                onClick={async () => {
                  try {
                    const { error } = await authClient.signOut();
                    if (error) {
                      console.error("সাইন আউট ব্যর্থ:", error);
                      return;
                    }
                    window.location.href = "/";
                  } catch (err) {
                    console.error("সাইন আউট ব্যর্থ:", err);
                  }
                }}
                className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-red-600 hover:bg-red-50"
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
                সাইন আউট
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}