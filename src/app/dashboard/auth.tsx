"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/auth";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const session = await auth();
      if (!session) {
        router.push("/login");
      }
    }

    checkAuth();
  }, [router]);

  return <>{children}</>;
}
