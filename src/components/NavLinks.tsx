// import Link from 'next/link';
// interface navs {
//     id: string,
//     slug: string,
//     nameBn: string,
//     icon: string
// }

// const NavLinks = async () => {
//     const res = await fetch('https://openapi.programming-hero.com/api/bazardor/categories');

//     if (!res.ok) {
//         throw new Error('Failed to fetch categories');
//     }

//     const navs = await res.json();

//     return (
//         <nav className="container mx-auto flex gap-4 py-4 items-center">
//             {navs.map((n: navs) => (
//                 <Link
//                     key={n.id}
//                     href={`/category/${n.slug}`}
//                     className="flex items-center hover:bg-gray-300 p-2 rounded-xl " 
//                 >
//                     <span>{n.icon}</span>
//                     <span className='capitalize'>{n.nameBn}</span>
//                 </Link>
//             ))}
//         </nav>
//     );
// };

// export default NavLinks;




"use client"; // 👈 যোগ করুন

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Category {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
}

const NavLinks = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('https://openapi.programming-hero.com/api/bazardor/categories');
        if (!res.ok) throw new Error('ক্যাটাগরি লোড হয়নি');
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : (data.data || []));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return <nav className="container mx-auto py-4">ক্যাটাগরি লোড হচ্ছে...</nav>;
  }

  return (
    <nav className="container mx-auto flex gap-4 py-4 flex-wrap">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/category/${cat.slug}`}
          className="flex items-center gap-2 hover:bg-green-100 px-3 py-2 rounded-xl transition-colors"
        >
          <span className="text-lg">{cat.icon}</span>
          <span>{cat.nameBn}</span>
        </Link>
      ))}
    </nav>
  );
};

export default NavLinks;