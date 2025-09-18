"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import RenderWhen from "../RenderWhen";
import SignInButton from "./components/signInButton";
import SignOutButton from "./components/SignOutButton";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { Package, Plus, ShoppingCart, User } from "lucide-react";
import { useSetAtom } from "jotai";
import { productsAtom } from "@/lib/atoms";
import { toast } from "sonner";
import MobileHeader from "./components/MobileHeader";
import { isActive } from "./utils";

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const setProducts = useSetAtom(productsAtom);

  const title = pathname === "/shopping-list" ? "Compras" : "Inventário";

  useEffect(() => {
    const abortController = new AbortController();

    async function initProducts() {
      if (!session?.user) {
        setProducts([]);
        return;
      }

      try {
        const userId = (session?.user as any)?.id || session?.user?.email;
        const res = await fetch(`/api/products?userId=${userId}`, {
          method: "GET",
          credentials: "include",
          signal: abortController.signal,
        });

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        toast.error(
          "Houve um erro ao tentar carregar os dados. Tente novamente mais tarde."
        );
      }
    }

    initProducts();

    return () => {
      abortController.abort();
    };
  }, [session?.user, setProducts]);

  return (
    <>
      <MobileHeader title={title} session={session} pathname={pathname} />

      <header className="hidden md:block fixed top-0 left-0 right-0 z-[1000] bg-white border-b shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>

          <nav aria-label="Primary" className="flex items-center">
            <Link href="/" aria-current={pathname === "/" ? "page" : undefined}>
              <div
                className={`flex flex-col items-center mx-6 transition-all duration-200 ease-in-out ${isActive(
                  "/",
                  pathname
                )}`}
              >
                <Package className="w-6 h-6" />
                <span className="text-xs mt-1">Inventário</span>
              </div>
            </Link>

            <Link href="/?add=1" scroll>
              <div
                className={`flex flex-col items-center mx-6 transition-all duration-200 ease-in-out ${
                  pathname === "/add"
                    ? "text-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Plus className="w-6 h-6" />
                <span className="text-xs mt-1">Adicionar</span>
              </div>
            </Link>

            <Link
              href="/shopping-list"
              aria-current={pathname === "/shopping-list" ? "page" : undefined}
            >
              <div
                className={`flex flex-col items-center mx-6 transition-all duration-200 ease-in-out ${isActive(
                  "/shopping-list",
                  pathname
                )}`}
              >
                <ShoppingCart className="w-6 h-6" />
                <span className="text-xs mt-1">Compras</span>
              </div>
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {session?.user && (
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 ring-1 ring-gray-300">
                {session.user.image ? (
                  <img
                    src={(session.user as any).image}
                    alt={session.user.name || session.user.email || "User"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-gray-500" />
                )}
              </div>
            )}
            <RenderWhen isTrue={!session?.user} elseElement={<SignOutButton />}>
              <SignInButton />
            </RenderWhen>
          </div>
        </div>
      </header>
    </>
  );
}
