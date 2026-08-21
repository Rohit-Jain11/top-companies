"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const status = useAuthStore((s) => s.status);
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-muted/30 p-4 relative z-1 overflow-hidden after:absolute after:top-[-70%] after:left-0 after:w-full after:h-full after:bg-[linear-gradient(0deg,rgba(255,255,255,0)_0%,rgba(217,43,66,1)_100%)] after:z-[-1] after:opacity-[0.2]">
      <div className="w-full max-w-127.5 space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex w-7.5 h-7.5 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M16.25 3H7.75C7.06 3 6.5 3.56 6.5 4.25V21H17.5V4.25C17.5 3.56 16.94 3 16.25 3ZM11 17H9.5V14.5H11V17ZM11 13H9.5V10.5H11V13ZM11 9H9.5V6.5H11V9ZM14.5 17H13V14.5H14.5V17ZM14.5 13H13V10.5H14.5V13ZM14.5 9H13V6.5H14.5V9ZM19.25 10H19V21H22V12.75C21.9987 12.0211 21.7085 11.3224 21.1931 10.8069C20.6776 10.2915 19.9789 10.0013 19.25 10ZM4.75 10H5V21H2V12.75C2.00132 12.0211 2.29148 11.3224 2.80692 10.8069C3.32236 10.2915 4.02106 10.0013 4.75 10Z" fill="white"></path>
            </svg>
          </div>
          <h1 className="font-fraunces text-foreground tracking-[-0.44px] text-[22px] leading-8.5 font-semibold">Top Companies Admin</h1>
        </div>
        {children}
      </div>
    </div>
  );
}
