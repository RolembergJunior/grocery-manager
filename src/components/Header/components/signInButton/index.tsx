"use client";

import { signInAction } from "@/app/actions/manageAuth";

export default function SignInButton() {
  return (
    <button
      onClick={signInAction}
      className="px-4 py-2 rounded-lg bg-gray-900 text-white font-semibold shadow hover:bg-gray-800 active:bg-gray-700 transition-colors"
    >
      Sign in
    </button>
  );
}
