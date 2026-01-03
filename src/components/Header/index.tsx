"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import RenderWhen from "../RenderWhen";
import SignInButton from "./components/signInButton";
import SignOutButton from "./components/SignOutButton";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { Package, ShoppingCart, User, Store } from "lucide-react";
import { useSetAtom } from "jotai";
import MobileHeader from "./components/MobileHeader";
import { isActive } from "./utils";
import { fetchProductsAtom } from "@/lib/atoms/products";
import { fetchListsAtom } from "@/lib/atoms/lists";
import { fetchCategoriesAtom } from "@/lib/atoms/categories";
import { fetchListItemsAtom } from "@/lib/atoms/list-items";
import { loadingAtom, LoadingParams } from "@/lib/atoms/loading";
import { fetchProfileData } from "@/lib/atoms/profile";

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const setIsLoading = useSetAtom(loadingAtom);

  const fetchProfile = useSetAtom(fetchProfileData);
  const fetchProducts = useSetAtom(fetchProductsAtom);
  const fetchLists = useSetAtom(fetchListsAtom);
  const fetchCategories = useSetAtom(fetchCategoriesAtom);
  const fetchListItems = useSetAtom(fetchListItemsAtom);

  const title =
    pathname === "/shopping-list"
      ? "Compras"
      : pathname === "/inventory"
      ? "Inventário"
      : pathname === "/profile"
      ? "Perfil"
      : "Home";

  useEffect(() => {
    if (!session?.user) return;

    initData();
  }, [session?.user]);

  async function initData() {
    setIsLoading({ isOpen: true, message: "Carregando..." });
    try {
      await fetchProfile();
      await fetchProducts();
      await fetchLists();
      await fetchCategories();
      await fetchListItems();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading({} as LoadingParams);
    }
  }

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
                <Store className="w-6 h-6" />
                <span className="text-xs mt-1">Home</span>
              </div>
            </Link>

            <Link
              href="/inventory"
              aria-current={pathname === "/inventory" ? "page" : undefined}
            >
              <div
                className={`flex flex-col items-center mx-6 transition-all duration-200 ease-in-out ${isActive(
                  "/inventory",
                  pathname
                )}`}
              >
                <Package className="w-6 h-6" />
                <span className="text-xs mt-1">Inventário</span>
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
              <Link href="/profile">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 ring-1 ring-gray-300 cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all">
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
              </Link>
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
