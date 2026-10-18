
const Footer = () => {
  return (
    <footer className="mt-6 w-full bg-gray-200 text-gray-700">
      <div className="mx-auto container flex w-full flex-col justify-between gap-3 px-2 py-4 sm:flex-row sm:items-center">
        <p className="text-sm">
          বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
        </p>

        <p className="text-sm sm:text-right">
        সকল দাম সম্ভাব্য: বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
        </p>
      </div>
    </footer>
  );
};

export default Footer;