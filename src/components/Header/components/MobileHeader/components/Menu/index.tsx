"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Edit, ImagePlus, LogOut } from "lucide-react";
import { Session } from "next-auth";
import RenderWhen from "@/components/RenderWhen";
import SignOutButton from "../../../SignOutButton";
import { signOut } from "@/auth";
import { signOutAction } from "@/app/actions/manageAuth";
import Image from "next/image";

export default function Menu({ session }: { session: Session | null }) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    {
      icon: Edit,
      label: "Editar nome",
      onClick: () => {
        console.log("Editar nome clicked");
        setUserMenuOpen(false);
      },
    },
    {
      icon: ImagePlus,
      label: "Adicionar imagem",
      onClick: () => {
        console.log("Adicionar imagem clicked");
        setUserMenuOpen(false);
      },
    },
    {
      icon: LogOut,
      label: "Sign out",
      onClick: () => {
        signOutAction();
        setUserMenuOpen(false);
      },
      danger: true,
    },
  ];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setUserMenuOpen(!userMenuOpen)}
        className="flex items-center space-x-3 px-4 py-2 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg shadow-sm transition-all duration-200 focus:outline-none"
      >
        <div className="flex-shrink-0">
          <Image
            src={session?.user?.image || ""}
            alt={session?.user?.name || ""}
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>

        <div className="flex-1 text-left">
          <p className="text-sm font-medium text-gray-900">
            {session?.user?.name}
          </p>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            userMenuOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <RenderWhen isTrue={userMenuOpen}>
        <RenderWhen isTrue={!!session?.user}>
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setUserMenuOpen(false)}
            />

            <div className="absolute right-0 z-20 mt-2 w-64 bg-white border border-gray-100 rounded-xl shadow-xl ring-1 ring-black/10 ring-opacity-5 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-100">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <Image
                    src={session?.user?.image || ""}
                    alt={session?.user?.name || ""}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {session?.user?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {session?.user?.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="py-2">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={index}
                      onClick={item.onClick}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 ${
                        item.danger
                          ? "text-red-700 hover:bg-red-50 hover:text-red-800"
                          : "text-gray-700 hover:text-gray-900"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 ${
                          item.danger ? "text-red-500" : "text-gray-400"
                        }`}
                      />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        </RenderWhen>
      </RenderWhen>
    </div>
  );
}
