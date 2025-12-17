import type { Metadata } from "next";
import { Cairo, Geist, Geist_Mono } from "next/font/google";

// CSS imports
import "./globals.css";
import "./styles/notifications.css";

import { ThemeProvider } from "./components/theme-provider";
import { AuthProvider } from "./context/auth-context";
import { CartProvider } from "./context/cart-context";
import { NotificationProvider } from "./context/NotificationContext";
import { OrderProvider } from "./context/order-context";
import { ProductProvider } from "./context/product-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  title: "نوفا",
  description: "تجربة تسوق فاخرة",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${cairo.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <NotificationProvider>
            <AuthProvider>
              <ProductProvider>
                <OrderProvider>
                  <CartProvider>{children}</CartProvider>
                </OrderProvider>
              </ProductProvider>
            </AuthProvider>
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
