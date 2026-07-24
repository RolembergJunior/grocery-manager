"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import {
  User,
  UserPen,
  XCircle,
  Trash2,
  CalendarClock,
  RefreshCw,
} from "lucide-react";
import { User as FirebaseUser } from "firebase/auth";
import { useAtom } from "jotai";
import { toast } from "sonner";
import RenderWhen from "@/components/RenderWhen";
import AlertDialog from "@/components/AlertDialog";
import { profileAtom } from "@/lib/atoms/profile";
import { auth } from "@/lib/firebaseClient";
import { signOutAction } from "@/app/actions/manageAuth";

interface AccountModalProps {
  isModalOpen: boolean;
  onCloseModal: () => void;
  user: FirebaseUser | null;
}

function getSubscriptionBadge(status?: string, cancelScheduled?: boolean) {
  if (cancelScheduled) {
    return {
      label: "Cancelamento agendado",
      className: "bg-orange-100 text-orange-700",
    };
  }
  if (status === "active") {
    return { label: "Ativa", className: "bg-green-100 text-green-700" };
  }
  if (status === "trialing") {
    return { label: "Teste grátis", className: "bg-blue-100 text-blue-700" };
  }
  return { label: "Inativa", className: "bg-gray-100 text-gray-600" };
}

function formatValidDate(value?: string): string | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? null
    : parsed.toLocaleDateString("pt-BR");
}

function cancelNoticeText(value?: string): string {
  const date = formatValidDate(value);
  return date ? `Acesso até ${date}` : "Acesso até o fim do período.";
}

function trialNoticeText(value?: string): string {
  const date = formatValidDate(value);
  return date
    ? `Teste grátis termina em ${date}`
    : "Você está no período de teste grátis.";
}

export default function AccountModal({
  isModalOpen,
  onCloseModal,
  user,
}: AccountModalProps) {
  const [profile, setProfile] = useAtom(profileAtom);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isReactivating, setIsReactivating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCancelAlertOpen, setIsCancelAlertOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const badge = getSubscriptionBadge(
    profile?.stripeCustomerStatus,
    profile?.cancelAtPeriodEnd
  );

  const subState = profile?.cancelAtPeriodEnd
    ? "cancelScheduled"
    : profile?.stripeCustomerStatus;

  async function handleCancelSubscription() {
    if (!profile?.stripeCustomerId) {
      toast.error("Conta de assinatura não encontrada.");
      return;
    }

    setIsCancelling(true);
    try {
      const response = await fetch("/api/stripe/cancel-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stripeCustomerId: profile.stripeCustomerId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to cancel subscription");
      }

      const result = await response.json();

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              cancelAtPeriodEnd: true,
              subscriptionEndDate: result.cancelAt ?? prev.subscriptionEndDate,
            }
          : prev
      );

      toast.success(
        "Assinatura cancelada. Você terá acesso até o fim do período."
      );
    } catch (error) {
      console.error("Error canceling subscription:", error);
      toast.error("Não foi possível cancelar a assinatura. Tente novamente.");
    } finally {
      setIsCancelling(false);
    }
  }

  async function handleReactivateSubscription() {
    if (!profile?.stripeCustomerId) {
      toast.error("Conta de assinatura não encontrada.");
      return;
    }

    setIsReactivating(true);
    try {
      const response = await fetch("/api/stripe/reactivate-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stripeCustomerId: profile.stripeCustomerId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to reactivate subscription");
      }

      setProfile((prev) =>
        prev ? { ...prev, cancelAtPeriodEnd: false } : prev
      );

      toast.success("Assinatura reativada com sucesso!");
    } catch (error) {
      console.error("Error reactivating subscription:", error);
      toast.error("Não foi possível reativar a assinatura. Tente novamente.");
    } finally {
      setIsReactivating(false);
    }
  }

  async function handleDeleteAccount() {
    if (!user?.uid) {
      toast.error("Usuário não encontrado.");
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch("/api/account/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete account");
      }

      toast.success("Conta excluída com sucesso.");
      if (typeof window !== "undefined") {
        localStorage.setItem("forceGoogleReauth", "1");
      }
      await auth.signOut().catch(() => null);
      await signOutAction();
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Não foi possível excluir a conta. Tente novamente.");
      setIsDeleting(false);
    }
  }

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={onCloseModal}
      title="Dados da conta"
      height="xl"
      iconTitle={<UserPen />}
    >
      <div className="space-y-4">
        <div className="flex justify-center mb-6">
          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-blue-400">
            <RenderWhen
              isTrue={!!user?.photoURL}
              elseElement={<User className="w-16 h-16 text-gray-400" />}
            >
              <img
                src={user?.photoURL!}
                alt={user?.displayName || "Profile"}
                className="w-full h-full object-cover"
              />
            </RenderWhen>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Nome</p>
            <p className="text-sm font-semibold text-gray-800">
              {user?.displayName || "—"}
            </p>
          </div>
          <div className="px-4 py-3">
            <p className="text-xs text-gray-500 mb-1">Email</p>
            <p className="text-sm font-semibold text-gray-800">
              {user?.email || "—"}
            </p>
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-blue-500">
              Status da Assinatura
            </p>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${badge.className}`}
            >
              {badge.label}
            </span>
          </div>

          <RenderWhen isTrue={subState === "cancelScheduled"}>
            <div className="mt-3 flex flex-col gap-2.5 py-2.5 px-3 bg-white border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2">
                <CalendarClock className="w-4 h-4 text-orange-500 shrink-0" />
                <span className="text-sm font-semibold text-orange-500">
                  {cancelNoticeText(profile?.subscriptionEndDate)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleReactivateSubscription}
                disabled={isReactivating}
                className="w-full flex items-center justify-center gap-2 py-2 bg-blue text-white rounded-lg hover:bg-blue/80 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="text-sm font-semibold">
                  {isReactivating ? "Reativando..." : "Reativar assinatura"}
                </span>
              </button>
            </div>
          </RenderWhen>

          <RenderWhen isTrue={subState === "trialing"}>
            <div className="mt-3 flex items-center gap-2 py-2.5 px-3 bg-white border border-blue-200 rounded-lg">
              <CalendarClock className="w-4 h-4 text-blue-500 shrink-0" />
              <span className="text-sm font-semibold text-blue-600">
                {trialNoticeText(profile?.subscriptionEndDate)}
              </span>
            </div>
          </RenderWhen>

          <RenderWhen isTrue={subState === "active"}>
            <button
              type="button"
              onClick={() => setIsCancelAlertOpen(true)}
              disabled={isCancelling}
              className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <XCircle className="w-4 h-4" />
              <span className="text-sm font-semibold">
                {isCancelling ? "Cancelando..." : "Cancelar assinatura"}
              </span>
            </button>
          </RenderWhen>
        </div>

        <button
          type="button"
          onClick={() => setIsDeleteAlertOpen(true)}
          disabled={isDeleting}
          className="w-full flex items-center justify-center gap-2 py-3 border border-red-200 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <Trash2 className="w-5 h-5" />
          <span className="font-bold">
            {isDeleting ? "Excluindo..." : "Excluir conta"}
          </span>
        </button>
      </div>

      <AlertDialog
        isOpen={isCancelAlertOpen}
        onClose={() => setIsCancelAlertOpen(false)}
        title="Cancelar assinatura?"
        description="Você continuará com acesso até o fim do período já pago."
        variant="danger"
        actions={[
          {
            label: "Voltar",
            onClick: () => null,
            autoClose: true,
            variant: "secondary",
          },
          {
            label: "Cancelar assinatura",
            onClick: handleCancelSubscription,
            autoClose: true,
            variant: "danger",
          },
        ]}
      />

      <AlertDialog
        isOpen={isDeleteAlertOpen}
        onClose={() => setIsDeleteAlertOpen(false)}
        title="Excluir conta?"
        description="Esta ação é permanente. Todos os seus dados (produtos, categorias, listas) e sua assinatura serão excluídos e não poderão ser recuperados."
        variant="danger"
        actions={[
          {
            label: "Cancelar",
            onClick: () => null,
            autoClose: true,
            variant: "secondary",
          },
          {
            label: "Excluir conta",
            onClick: handleDeleteAccount,
            autoClose: true,
            variant: "danger",
          },
        ]}
      />
    </Modal>
  );
}
