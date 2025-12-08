"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/auth-context";
import Link from "next/link";
import { User, Lock, ArrowRight, Loader2, Phone, Mail, CheckCircle } from "lucide-react";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  
  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const validateEgyptPhone = (number: string) => {
    const regex = /^(010|011|012|015)\d{8}$/;
    return regex.test(number);
  };

  const handleSendOtp = () => {
    setError("");
    if (authMethod === "phone" && !validateEgyptPhone(phone)) {
      setError("Please enter a valid Egyptian phone number (e.g., 01012345678)");
      return;
    }
    if (authMethod === "email" && !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    // Simulate sending OTP
    setTimeout(() => {
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(code);
      setIsOtpSent(true);
      setIsLoading(false);
      alert(`Your verification code is: ${code}`); // Simulation
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      // 1. Admin Login Check (Only in Login Mode)
      if (mode === "login") {
        if (email === "Admin" && password === "Hussein175#") {
           document.cookie = "admin_session=true; path=/";
           router.push("/admin/dashboard");
           return;
        }

        // Normal Login
        login({
          id: "1",
          name: authMethod === "email" ? email.split("@")[0] : "User",
          email: authMethod === "email" ? email : `${phone}@phone.com`,
        });
        router.push("/");
        return;
      }

      // 2. Registration Check
      if (mode === "register") {
        if (otp !== generatedOtp) {
          setError("Invalid verification code");
          setIsLoading(false);
          return;
        }

        // Register Success
        login({
          id: Math.random().toString(),
          name: authMethod === "email" ? email.split("@")[0] : "New User",
          email: authMethod === "email" ? email : `${phone}@phone.com`,
        });
        router.push("/");
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 blur-sm dark:opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />

      <div className="w-full max-w-md p-8 relative z-10">
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              {mode === "login" ? "Login to access your account" : "Join us to start shopping"}
            </p>
          </div>

          {/* Toggle Login/Register */}
          <div className="flex p-1 bg-gray-100 dark:bg-black/50 rounded-xl mb-6">
            <button
              onClick={() => { setMode("login"); setIsOtpSent(false); setError(""); }}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                mode === "login" ? "bg-white dark:bg-zinc-800 shadow-sm text-primary" : "text-gray-500"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => { setMode("register"); setIsOtpSent(false); setError(""); }}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                mode === "register" ? "bg-white dark:bg-zinc-800 shadow-sm text-primary" : "text-gray-500"
              }`}
            >
              Register
            </button>
          </div>

          {/* Toggle Email/Phone (Only for Register or if Login supports both) */}
          <div className="flex gap-4 mb-6 justify-center">
            <button
              onClick={() => { setAuthMethod("email"); setIsOtpSent(false); setError(""); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                authMethod === "email" 
                  ? "border-primary text-primary bg-primary/10" 
                  : "border-gray-200 dark:border-white/10 text-gray-500 hover:border-primary/50"
              }`}
            >
              <Mail className="h-4 w-4" />
              Email
            </button>
            <button
              onClick={() => { setAuthMethod("phone"); setIsOtpSent(false); setError(""); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                authMethod === "phone" 
                  ? "border-primary text-primary bg-primary/10" 
                  : "border-gray-200 dark:border-white/10 text-gray-500 hover:border-primary/50"
              }`}
            >
              <Phone className="h-4 w-4" />
              Phone
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {authMethod === "email" ? (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input
                    type="text" // changed from email to text to allow "Admin" username
                    required
                    placeholder="name@example.com"
                    className="block w-full pl-10 pr-3 py-3 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Phone Number (Egypt)</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="01xxxxxxxxx"
                    className="block w-full pl-10 pr-3 py-3 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={11}
                  />
                </div>
              </div>
            )}

            {mode === "login" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-3 py-3 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            )}

            {mode === "register" && (
              <>
                {!isOtpSent ? (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isLoading}
                    className="w-full py-3 bg-zinc-800 text-white rounded-xl font-bold hover:bg-zinc-700 transition-colors"
                  >
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Send Verification Code"}
                  </button>
                ) : (
                  <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Verification Code</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="Enter 4-digit code"
                        className="block w-full pl-10 pr-3 py-3 bg-gray-50 dark:bg-black/50 border border-green-500/50 rounded-xl text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={4}
                      />
                    </div>
                    <p className="text-xs text-green-500 ml-1">Code sent! Check your {authMethod}.</p>
                  </div>
                )}
              </>
            )}

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-500 text-center">
                {error}
              </div>
            )}

            {(mode === "login" || (mode === "register" && isOtpSent)) && (
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    {mode === "login" ? "Login" : "Verify & Register"} <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            )}
          </form>
          
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/5 text-center">
            <Link href="/" className="text-sm text-gray-500 hover:text-primary transition-colors">
              ← Back to Store
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
