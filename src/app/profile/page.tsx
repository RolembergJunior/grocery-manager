"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import {
  User,
  ChevronRight,
  BarChart3,
  Settings,
  FileText,
  LogOut,
  X,
  Camera,
} from "lucide-react";
import { signOutAction } from "@/app/actions/manageAuth";
import RenderWhen from "@/components/RenderWhen";
import HeaderPage from "@/components/HeaderPage";
import Modal from "@/components/Modal";
import FieldForm from "@/components/FieldForm";
import { toast } from "sonner";
import AccountModal from "./components/AccoutModal";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  const menuItems = [
    {
      icon: FileText,
      label: "Dados da conta",
      onClick: () => setIsAccountModalOpen(true),
      showArrow: true,
    },
    {
      icon: Settings,
      label: "Configurações",
      onClick: () => console.log("Configurações"),
      showArrow: true,
    },
    // {
    //   icon: BarChart3,
    //   label: "Estatísticas",
    //   onClick: () => console.log("Estatísticas"),
    //   showArrow: true,
    // },
  ];

  return (
    <div className="min-h-dvh md:min-h-screen p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="w-12 h-12 bg-[var(--color-stats-card)] rounded-full flex items-center justify-center overflow-hidden">
            <RenderWhen
              isTrue={!!session?.user?.image}
              elseElement={
                <User className="w-6 h-6 text-[var(--color-text-gray)]" />
              }
            >
              <img
                src={session?.user?.image!}
                alt={session?.user?.name || "User"}
                className="w-full h-full object-cover"
              />
            </RenderWhen>
          </div>
          <h1 className="text-xl font-medium text-[var(--color-text-gray)]">
            {session?.user?.name || "Nome da pessoa"}
          </h1>
        </div>

        <HeaderPage />

        <div>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={item.onClick}
                className="w-full bg-white hover:bg-gray-200 px-5 py-4 flex items-center justify-between  transition-all border-b border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-[var(--color-text-gray)]" />
                  <span className="text-[var(--color-text-gray)] font-medium">
                    {item.label}
                  </span>
                </div>

                <RenderWhen isTrue={item.showArrow}>
                  <ChevronRight className="w-5 h-5 text-[var(--color-text-gray)]" />
                </RenderWhen>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => signOutAction()}
          className="w-full bg-white hover:bg-gray-200 px-5 py-4 flex items-center gap-3  transition-all border-b border-gray-200 text-red-600"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sair</span>
        </button>

        <AccountModal
          isModalOpen={isAccountModalOpen}
          onCloseModal={() => setIsAccountModalOpen(false)}
          session={session}
          updateSession={update}
        />
      </div>
    </div>
  );
}
