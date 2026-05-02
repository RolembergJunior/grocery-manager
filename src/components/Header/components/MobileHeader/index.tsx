import { User as FirebaseUser } from "firebase/auth";
import { Package, ShoppingCart, Store, User } from "lucide-react";
import { isActive } from "../../utils";
import Link from "next/link";

export default function MobileHeader({
  title,
  user,
  pathname,
}: {
  title: string;
  user: FirebaseUser | null;
  pathname: string;
}) {
  return (
    <nav className="fixed left-0 right-0 z-[1000] md:hidden bottom-0 bg-white border-t border-t-black/30 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-center items-center">
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

        <Link
          href="/profile"
          aria-current={pathname === "/profile" ? "page" : undefined}
        >
          <div
            className={`flex flex-col items-center mx-6 transition-all duration-200 ease-in-out ${isActive(
              "/profile",
              pathname
            )}`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs mt-1">Perfil</span>
          </div>
        </Link>
      </div>
    </nav>
  );
}
