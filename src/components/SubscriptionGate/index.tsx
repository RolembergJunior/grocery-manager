"use client";

import { useAtomValue } from "jotai";
import { profileAtom } from "@/lib/atoms/profile";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SubscriptionGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = useAtomValue(profileAtom);
  const router = useRouter();

  const isActive =
    profile?.stripeCustomerStatus === "trialing" ||
    profile?.stripeCustomerStatus === "active";

  useEffect(() => {
    if (profile === null) return; // Profile not yet loaded
    if (!isActive) {
      router.replace("/subscribe");
    }
  }, [profile, isActive, router]);

  if (profile === null) return null; // Loading — hide content until check is done
  if (!isActive) return null; // Redirecting
  return <>{children}</>;
}
