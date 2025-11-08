"use client";

import { Session } from "next-auth";
import Link from "next/link";
import { User } from "lucide-react";
import Image from "next/image";
import RenderWhen from "@/components/RenderWhen";

export default function Menu({ session }: { session: Session | null }) {
  return (
    <Link href="/profile">
      <div className="flex items-center space-x-3 px-3 py-2 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg shadow-sm transition-all duration-200">
        <div className="flex-shrink-0">
          <RenderWhen
            isTrue={!!session?.user?.image}
            elseElement={
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-5 h-5 text-gray-500" />
              </div>
            }
          >
            <Image
              src={session!.user!.image!}
              alt={session!.user!.name || ""}
              width={32}
              height={32}
              className="rounded-full"
            />
          </RenderWhen>
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
            {session!.user!.name! || "Perfil"}
          </p>
        </div>
      </div>
    </Link>
  );
}
