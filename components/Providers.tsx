"use client";

import { ReactNode, useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/lib/cart";
import { usePathname, useSearchParams } from "next/navigation";
import { progressBar } from "@/lib/progress-bar";
import PageProgressBar from "@/components/PageProgressBar";

function RouteProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    progressBar.start();
    const t = setTimeout(() => progressBar.done(), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  return null;
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        <PageProgressBar />
        <RouteProgress />
        {children}
      </CartProvider>
    </SessionProvider>
  );
}
