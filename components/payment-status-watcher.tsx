"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function PaymentStatusWatcher() {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 2000);

    return () => clearInterval(interval);
  }, [router]);

  return null;
}