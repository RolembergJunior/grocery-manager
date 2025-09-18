"use client";

import { signOutAction } from "@/app/actions/manageAuth";

export default function SignOutButton() {
  return (
    <button
      onClick={signOutAction}
      className="px-4 py-2 rounded-lg bg-white text-gray-800 font-semibold shadow ring-1 ring-gray-300 hover:bg-gray-50 active:bg-gray-100 transition-colors"
    >
      Sign out
    </button>
  );
}
