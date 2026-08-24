import type { Metadata } from "next";
import { Jost } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import "./animations-system.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import PageLoader from "@/components/PageLoader";

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MiniStore — Mini Ecommerce Store",
  description:
    "MiniStore is a clean, minimal ecommerce template built with Next.js and Tailwind CSS.",
};

// Security headers
export async function generateStaticParams() {
  return [];
}

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' http://127.0.0.1:8000 http://localhost:8000 http://127.0.0.1:9003 http://127.0.0.1:9004;
  frame-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={jost.variable}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col" suppressHydrationWarning>
        <PageLoader />
        <Suspense fallback={null}>
          <Providers>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
