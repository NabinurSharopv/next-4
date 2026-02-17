
import Link from "next/link";

const Header = () => {
  return (
    <header className="w-full bg-white shadow-md dark:bg-neutral-900">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="text-2xl font-bold text-neutral-900 dark:text-white">MyApp</div>
        <nav className="space-x-6">
          <Link href="/" className="text-neutral-700 dark:text-neutral-200 hover:text-blue-600 transition">Home</Link>
          <Link href="/about" className="text-neutral-700 dark:text-neutral-200 hover:text-blue-600 transition">About</Link>
          <Link href="/contact" className="text-neutral-700 dark:text-neutral-200 hover:text-blue-600 transition">Contact</Link>
          <Link href="/login" className="text-neutral-700 dark:text-neutral-200 hover:text-blue-600 transition">Login</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
