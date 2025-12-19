"use client";



import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail, Phone, User } from "lucide-react";
import { useAuth } from "../context/auth-context";
import { useNotification } from "../context/NotificationContext";


export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register" | "admin">("login");

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const router = useRouter();
  const { showError, showInfo } = useNotification();

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";
  console.log("Using API Base:", apiBase);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (mode === "admin") {
        // ADMIN LOGIN
        const res = await fetch(`${apiBase}/api/admin/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        let data;
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
           data = await res.json();
        } else {
           // If not JSON, it might be a text error (like 404 Not Found)
           const text = await res.text();
           if (!res.ok) throw new Error(text || res.statusText);
           // If it was OK but not JSON? unexpected.
           data = {}; 
        }

        if (!res.ok) {
           throw new Error(data.message || res.statusText || "Admin login failed");
        }

        document.cookie = `admin_token=${data.token}; path=/`;
        localStorage.setItem("admin_token", data.token);
        router.push("/admin/dashboard");
      } else if (mode === "login") {
        // USER LOGIN
        if (!phone || phone.length !== 11) {
          throw new Error("Please enter a valid Egyptian phone number (11 digits)");
        }

        const res = await fetch(`${apiBase}/api/users/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone, email, password }),
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Login failed");

        localStorage.setItem("token", data.token);

        login({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: "user",
        });
        router.push("/");
      } else {
        // REGISTER
        if (!phone || phone.length !== 11) {
          throw new Error("Please enter a valid Egyptian phone number (11 digits)");
        }
        if (!name.trim()) {
          throw new Error("Please enter your full name");
        }

        const res = await fetch(`${apiBase}/api/users/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: email.includes("@") ? email : undefined,
            phone,
            password,
          }),
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Registration failed");

        localStorage.setItem("token", data.token);

        login({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: "user",
        });
        router.push("/");
      }

      showInfo("Success!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      showError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden" dir="rtl">
      <div className="w-full max-w-md p-8 relative z-10">
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              {mode === "admin"
                ? "دخول الأدمن"
                : mode === "login"
                ? "أهلاً بيك"
                : "إنشاء حساب"}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              {mode === "admin"
                ? "سجل دخول عشان تدير المتجر"
                : mode === "login"
                ? "سجل دخول عشان تتابع طلباتك"
                : "انضم لينا وابدأ التسوق"}
            </p>
          </div>

          {/* Toggle Login/Register */}
          <div className="flex p-1 bg-gray-100 dark:bg-black/50 rounded-xl mb-3">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                mode === "login"
                  ? "bg-white dark:bg-zinc-800 shadow-sm text-primary"
                  : "text-gray-500"
              }`}
            >
              تسجيل دخول
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                mode === "register"
                  ? "bg-white dark:bg-zinc-800 shadow-sm text-primary"
                  : "text-gray-500"
              }`}
            >
              حساب جديد
            </button>
          </div>

          <div className="flex justify-end mb-6">
            <button
              type="button"
              onClick={() =>
                setMode(mode === "admin" ? "login" : "admin")
              }
              className="text-xs font-semibold text-gray-500 hover:text-primary transition-colors underline"
            >
              {mode === "admin" ? "العودة لتسجيل دخول المستخدم" : "دخول الأدمن"}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === "register" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
                  الاسم بالكامل
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input
                    type="text"
                    placeholder="الاسم"
                    className="block w-full pr-10 pl-3 py-3 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
                البريد الإلكتروني {mode === "register" ? "(اختياري)" : ""}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="block w-full pr-10 pl-3 py-3 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Phone */}
         { mode !== "admin" && <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
                رقم الموبايل (مصر) <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="tel"
                  required
                  placeholder="01xxxxxxxxx"
                  maxLength={11}
                  className="block w-full pr-10 pl-3 py-3 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))
                  }
                />
              </div>
            </div>}

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
                كلمة المرور
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="block w-full pr-10 pl-3 py-3 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-500 text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "جاري التحميل..." : mode === "admin" ? "دخول الأدمن" : mode === "login" ? "دخول" : "تسجيل جديد"}{" "}
              <ArrowRight className="h-5 w-5 transform rotate-180" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/5 text-center">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-primary transition-colors flex items-center justify-center gap-2"
            >
              <ArrowRight className="h-4 w-4" /> العودة للمتجر
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
