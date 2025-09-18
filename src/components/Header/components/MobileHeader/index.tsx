import { Session } from "next-auth";
import Menu from "./components/Menu";
import { Package, Plus, ShoppingCart } from "lucide-react";
import { isActive } from "../../utils";
import Link from "next/link";
import RenderWhen from "@/components/RenderWhen";
import SignInButton from "../signInButton";

export default function MobileHeader({
  title,
  session,
  pathname,
}: {
  title: string;
  session: Session | null;
  pathname: string;
}) {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[1000] md:hidden bg-white border-t border-t-black/30 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-base font-semibold text-gray-900">{title}</h1>
          <RenderWhen isTrue={!!session?.user} elseElement={<SignInButton />}>
            <Menu session={session} />
          </RenderWhen>
        </div>
      </div>

      <nav className="fixed left-0 right-0 z-[1000] md:hidden bottom-0 bg-white border-t border-t-black/30 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-center items-center">
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

          <Link href="/?add=1">
            <div
              className={`flex flex-col items-center mx-6 transition-all duration-200 ease-in-out ${isActive(
                "/add",
                pathname
              )}`}
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
        </div>
      </nav>
    </>
  );
}
