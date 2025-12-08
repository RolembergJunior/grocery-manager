"use client";

import { RecurrencyConfig } from "@/app/type";
import Modal from "@/components/Modal";
import { Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import RecurrencySelector from "./components/RecurrencySelector";

interface RecurrencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  value: RecurrencyConfig | null;
  onSave: (config: RecurrencyConfig | null) => void;
}

export default function RecurrencyModal({
  isOpen,
  onClose,
  value,
  onSave,
}: RecurrencyModalProps) {
  const [tempConfig, setTempConfig] = useState<RecurrencyConfig | null>(value);

  useEffect(() => {
    if (isOpen) {
      setTempConfig(value);
    }
  }, [isOpen, value]);

  function handleSave() {
    onSave(tempConfig);
    onClose();
  }

  function handleCancel() {
    setTempConfig(value);
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Configurar Recorrência"
      iconTitle={<Calendar className="w-5 h-5" />}
      size="lg"
    >
      <div className="space-y-6">
        <p className="text-sm text-gray-600">
          Configure com que frequência você compra este item para receber
          lembretes automáticos.
        </p>

        <RecurrencySelector value={tempConfig} onChange={setTempConfig} />

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <Button onClick={handleSave} className="flex-1">
            Salvar Recorrência
          </Button>
          <Button onClick={handleCancel} variant="outline" className="flex-1">
            Cancelar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
