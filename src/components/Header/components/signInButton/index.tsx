"use client";

import { useRouter } from "next/navigation";

export default function SignInButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push("/login")}
      className="px-4 py-2 rounded-lg bg-gray-900 text-white font-semibold shadow hover:bg-gray-800 active:bg-gray-700 transition-colors"
    >
      Sign in
    </button>
  );
}
