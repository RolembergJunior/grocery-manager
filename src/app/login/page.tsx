"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="min-h-dvh flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
        <h1 className="text-2xl font-bold mb-4 text-black">Sign in</h1>
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="bg-[#1E459F] text-white px-6 py-3 rounded-lg font-semibold shadow-lg cursor-pointer"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}
