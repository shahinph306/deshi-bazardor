'use client';

export default function HomeScrollButton() {
  const handleScroll = () => {
    const section = document.getElementById('all-products-section');
    section?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <button
      onClick={handleScroll}
      className="bg-green-500 py-2 px-3 rounded-xl cursor-pointer text-white font-medium hover:bg-green-600 transition-colors"
    >
      View all products
    </button>
  );
}