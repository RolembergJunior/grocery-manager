"use client";

import { useMemo, useState } from "react";
import {
  signInWithPopup,
  getIdToken,
  GoogleAuthProvider,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebaseClient";
import { toast } from "sonner";
import {
  ShieldAlert,
  Trash2,
  CheckCircle2,
  LogIn,
  AlertTriangle,
  UserX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AlertDialog from "@/components/AlertDialog";
import RenderWhen from "@/components/RenderWhen";

const DELETED_DATA = [
  "Seu perfil e login",
  "Seus produtos e categorias do inventário",
  "Suas listas de compras e itens",
  "Sua assinatura e dados de pagamento",
];

export default function RemoveAccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [firstConfirm, setFirstConfirm] = useState(false);
  const [showFinalDialog, setShowFinalDialog] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [noAccount, setNoAccount] = useState(false);

  const provider = useMemo(() => {
    const p = new GoogleAuthProvider();
    p.setCustomParameters({ prompt: "select_account" });
    return p;
  }, []);

  const screen = deleted
    ? "deleted"
    : noAccount
      ? "noAccount"
      : user
        ? "confirm"
        : "signin";

  function resetFlow() {
    setUser(null);
    setNoAccount(false);
    setFirstConfirm(false);
  }

  async function handleSignIn() {
    setIsSigningIn(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await getIdToken(result.user, true);

      const res = await fetch("/api/remove-account/verify", {
        method: "POST",
        headers: { Authorization: `Bearer ${idToken}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Falha ao verificar a conta");
      }

      if (!data.exists) {
        await auth.signOut().catch(() => null);
        setNoAccount(true);
        return;
      }

      setUser(result.user);
    } catch (error) {
      console.error("Error signing in:", error);
      toast.error("Não foi possível entrar. Tente novamente.");
      await auth.signOut().catch(() => null);
    } finally {
      setIsSigningIn(false);
    }
  }

  async function handleDelete() {
    if (!user) return;

    setIsDeleting(true);
    try {
      const idToken = await getIdToken(user, true);

      const res = await fetch("/api/remove-account", {
        method: "POST",
        headers: { Authorization: `Bearer ${idToken}` },
      });

      if (res.status === 404) {
        await auth.signOut().catch(() => null);
        setUser(null);
        setNoAccount(true);
        return;
      }

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.error || "Falha ao excluir a conta");
      }

      await auth.signOut().catch(() => null);
      setDeleted(true);
    } catch (error) {
      console.error("Error removing account:", error);
      toast.error("Não foi possível excluir a conta. Tente novamente.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <RenderWhen isTrue={screen === "deleted"}>
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-7 h-7 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Conta excluída</h1>
            <p className="text-sm text-gray-600 mt-2">
              Sua conta e todos os dados associados foram removidos
              permanentemente. Sentiremos sua falta!
            </p>
          </div>
        </RenderWhen>

        <RenderWhen isTrue={screen === "noAccount"}>
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <UserX className="w-7 h-7 text-gray-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Nenhuma conta encontrada
            </h1>
            <p className="text-sm text-gray-600 mt-2 mb-6">
              Não há nenhuma conta do ListaAí associada a este login, então nada
              foi excluído.
            </p>
            <Button
              type="button"
              onClick={resetFlow}
              variant="outline"
              size="lg"
              className="w-full"
            >
              Tentar outra conta
            </Button>
          </div>
        </RenderWhen>

        <RenderWhen isTrue={screen === "signin" || screen === "confirm"}>
          <>
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <ShieldAlert className="w-7 h-7 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Excluir conta</h1>
              <p className="text-sm text-gray-600 mt-2">
                Esta página remove permanentemente a sua conta do ListaAí e
                todos os dados associados.
              </p>
            </div>

            <RenderWhen
              isTrue={screen === "confirm"}
              elseElement={
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 text-center">
                    Para confirmar que a conta é sua, entre com o Google antes de
                    excluir.
                  </p>
                  <Button
                    type="button"
                    onClick={handleSignIn}
                    disabled={isSigningIn}
                    variant="default"
                    size="lg"
                    className="w-full"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    {isSigningIn ? "Entrando..." : "Entrar com Google"}
                  </Button>
                </div>
              }
            >
              <div className="space-y-5">
                <div className="bg-gray-50 rounded-xl px-4 py-3">
                  <p className="text-xs text-gray-500 mb-1">Conectado como</p>
                  <p className="text-sm font-semibold text-gray-800 break-all">
                    {user?.email || "—"}
                  </p>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    <p className="text-sm font-bold text-red-700">
                      O que será excluído permanentemente
                    </p>
                  </div>
                  <ul className="list-disc list-inside space-y-1">
                    {DELETED_DATA.map((item) => (
                      <li key={item} className="text-sm text-red-700">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={firstConfirm}
                    onChange={(e) => setFirstConfirm(e.target.checked)}
                    className="mt-1 w-4 h-4 accent-red-600 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700">
                    Entendo que esta ação é{" "}
                    <strong>permanente e não pode ser desfeita</strong>, e quero
                    excluir todos os dados da minha conta.
                  </span>
                </label>

                <Button
                  type="button"
                  onClick={() => setShowFinalDialog(true)}
                  disabled={!firstConfirm || isDeleting}
                  variant="danger"
                  size="lg"
                  className="w-full"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {isDeleting ? "Excluindo..." : "Excluir minha conta"}
                </Button>
              </div>
            </RenderWhen>
          </>
        </RenderWhen>
      </div>

      <AlertDialog
        isOpen={showFinalDialog}
        onClose={() => setShowFinalDialog(false)}
        title="Tem certeza absoluta?"
        description={`Esta é a confirmação final. Todos os dados da conta ${
          user?.email || ""
        } serão apagados para sempre e não poderão ser recuperados.`}
        variant="danger"
        actions={[
          {
            label: "Cancelar",
            onClick: () => null,
            autoClose: true,
            variant: "secondary",
          },
          {
            label: "Excluir definitivamente",
            onClick: handleDelete,
            autoClose: true,
            variant: "danger",
          },
        ]}
      />
    </div>
  );
}
