import {  useLayoutEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  LogOut,
  Menu,
  Moon,
  Package,
  ShoppingCart,
  Sun,
  X,
} from "lucide-react";

import { useAuth } from "../context/auth-context";
import { useCart } from "../context/cart-context";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { items } = useCart();
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, []);
  if(!mounted){
    return null
  }

  const cartCount = items.reduce(
    (sum: number, item: { quantity: number }) => sum + item.quantity,
    0
  );

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-10 w-10 relative overflow-hidden rounded-lg">
                <Image
                  fill
                  src="/images/Logo.jpg"
                  alt="نوفا"
                  className="object-cover"
                  sizes="40px"
                  suppressHydrationWarning
                />
              </div>
              <span className="text-xl font-bold text-primary">نوفا</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <Link
                href="/"
                className="hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium"
              >
                الرئيسية
              </Link>
              <Link
                href="/products"
                className="hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium"
              >
                المنتجات
              </Link>
              <Link
                href="/about"
                className="hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium"
              >
                من نحن
              </Link>

              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors ${
                  mounted ? "opacity-100" : "opacity-0"
                }`}
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Auth */}
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">
                    أهلاً, {user.name}
                  </span>
                  <Link
                    href="/orders"
                    className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    title="طلباتي"
                  >
                    <Package className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={logout}
                    className="p-2 rounded-full hover:bg-red-500/10 hover:text-red-500 transition-colors"
                    title="تسجيل الخروج"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link
                    href="/login"
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    تسجيل الدخول
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-background border-b border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className="block hover:bg-white/10 px-3 py-2 rounded-md text-base font-medium"
            >
              الرئيسية
            </Link>
            <Link
              href="/products"
              className="block hover:bg-white/10 px-3 py-2 rounded-md text-base font-medium"
            >
              المنتجات
            </Link>
            <Link
              href="/about"
              className="block hover:bg-white/10 px-3 py-2 rounded-md text-base font-medium"
            >
              من نحن
            </Link>
            <Link
              href="/cart"
              className="block hover:bg-white/10 px-3 py-2 rounded-md text-base font-medium"
            >
              السلة ({cartCount})
            </Link>
            {user ? (
              <button
                onClick={logout}
                className="w-full text-left block hover:bg-white/10 px-3 py-2 rounded-md text-base font-medium text-red-500"
              >
                تسجيل الخروج
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block hover:bg-white/10 px-3 py-2 rounded-md text-base font-medium"
                >
                  تسجيل الدخول
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
