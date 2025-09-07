"use client";

export default function Footer() {
  return (
    <>
      <footer className="w-full bg-gray-900 text-white px-6 py-3 flex items-center justify-between mt-4">
        <span className="text-sm">
          © {new Date().getFullYear()} Tabco Satish
        </span>

        <nav className="flex gap-4">
          <a href="#" className="hover:text-gray-300">
            Privacy
          </a>
          <a href="#" className="hover:text-gray-300">
            Terms
          </a>
          <a href="#" className="hover:text-gray-300">
            Support
          </a>
        </nav>
      </footer>
    </>
  );
}
