"use client";

import { useState, useEffect } from "react";
import { Share2, Copy, Check, Link, Loader2 } from "lucide-react";
import Modal from "../../../Modal";
import { Button } from "@/components/ui/button";
import { List } from "@/app/type";
import { toast } from "sonner";
import RenderWhen from "@/components/RenderWhen";
import { generateShareToken } from "@/services/lists";
import { useSetAtom } from "jotai";
import { listsAtom } from "@/lib/atoms";

function generateShareUrl(shareToken: string): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/shared/${shareToken}`;
  }
  return `/shared/${shareToken}`;
}

interface ShareListModalProps {
  isOpen: boolean;
  onClose: () => void;
  list: List | null;
}

export default function ShareListModal({
  isOpen,
  onClose,
  list,
}: ShareListModalProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEnabling, setIsEnabling] = useState(false);
  const [currentToken, setCurrentToken] = useState<string | null>(null);
  const setLists = useSetAtom(listsAtom);

  useEffect(() => {
    if (list && isOpen) {
      setIsSharing(!!list.shareToken);
      setCurrentToken(list.shareToken || null);
      setCopied(false);
    }
  }, [list, isOpen]);

  async function handleGenerateAndCopy() {
    if (!list) return;

    setIsEnabling(true);
    try {
      let token = currentToken;

      if (!token) {
        const result = await generateShareToken(list.id);
        token = result.shareToken;
        setCurrentToken(token);
        setIsSharing(true);

        setLists((prev) =>
          prev.map((l) => (l.id === list.id ? { ...l, shareToken: token } : l))
        );
      }

      const url = generateShareUrl(token);
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copiado!");
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast.error("Erro ao gerar ou copiar link");
    } finally {
      setIsEnabling(false);
    }
  }

  function handleClose() {
    setCopied(false);
    onClose();
  }

  const shareUrl = currentToken ? generateShareUrl(currentToken) : "";

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Compartilhar "${list?.name || "Lista"}"`}
      iconTitle={<Share2 className="w-5 h-5 text-blue" />}
      size="md"
    >
      <div className="space-y-5">
        <p className="text-sm text-gray-600">
          Quem acessar o link poderá visualizar apenas a lista de compras e
          marcar itens como comprados.
        </p>

        <Button
          onClick={handleGenerateAndCopy}
          disabled={isEnabling}
          variant="default"
          size="lg"
          className="w-full h-14 text-base gap-3"
        >
          {isEnabling ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : copied ? (
            <Check className="w-5 h-5" />
          ) : (
            <Copy className="w-5 h-5" />
          )}
          <span>
            {isEnabling
              ? "Gerando link..."
              : copied
              ? "Link copiado!"
              : isSharing
              ? "Copiar Link"
              : "Gerar e Copiar Link"}
          </span>
        </Button>

        <RenderWhen isTrue={isSharing && !!currentToken}>
          <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Link className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">
                Compartilhamento ativo
              </span>
            </div>
            <p className="text-xs text-green-600 break-all font-mono">
              {shareUrl}
            </p>
          </div>
        </RenderWhen>
      </div>
    </Modal>
  );
}
