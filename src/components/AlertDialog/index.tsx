"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, CheckCircle, Info, XCircle, X } from "lucide-react";
import RenderWhen from "../RenderWhen";
import { Button } from "../ui/button";

export type AlertVariant = "info" | "success" | "warning" | "danger";

export interface AlertAction {
  label: string;
  onClick: () => void;
  variant?: "default" | "secondary" | "danger";
  autoClose?: boolean;
}

interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  variant?: AlertVariant;
  actions?: AlertAction[];
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  icon?: React.ReactNode;
}

const variantConfig = {
  info: {
    icon: <Info />,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-100",
    borderColor: "border-blue-200",
  },
  success: {
    icon: <CheckCircle />,
    iconColor: "text-green-500",
    iconBg: "bg-green-100",
    borderColor: "border-green-200",
  },
  warning: {
    icon: <AlertTriangle />,
    iconColor: "text-yellow-500",
    iconBg: "bg-yellow-100",
    borderColor: "border-yellow-200",
  },
  danger: {
    icon: <XCircle />,
    iconColor: "text-red-500",
    iconBg: "bg-red-100",
    borderColor: "border-red-200",
  },
};

export default function AlertDialog({
  isOpen,
  onClose,
  title,
  description,
  variant = "info",
  actions = [],
  closeOnOverlayClick = false,
  closeOnEscape = true,
  icon,
}: AlertDialogProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && closeOnEscape) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose, closeOnEscape]);

  if (!isOpen) {
    return null;
  }

  function handleOverlayClick(e: React.MouseEvent) {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  }

  function handleActionClick(action: AlertAction) {
    action.onClick();
    if (action.autoClose !== false) {
      onClose();
    }
  }

  const config = variantConfig[variant];
  const IconComponent = icon || config.icon;

  const alertContent = (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-in fade-in duration-200"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-200 ease-out animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-6">
          {/* <div className="flex items-start gap-4"></div> */}
          <div className="flex items-center justify-center gap-2">
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full ${config.iconBg} flex items-center justify-center`}
            >
              {IconComponent}
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {title}
            </h3>
          </div>

          <div className="flex-1 pt-1">
            <RenderWhen isTrue={!!description}>
              <p className="text-sm text-gray-600 leading-relaxed">
                {description}
              </p>
            </RenderWhen>
          </div>
        </div>

        <RenderWhen isTrue={actions.length > 0}>
          <div className="px-6 pb-6">
            <div
              className={`flex gap-3 ${
                actions.length > 2 ? "flex-col" : "flex-row justify-end"
              }`}
            >
              {actions.map((action, index) => (
                <Button
                  key={index}
                  onClick={() => handleActionClick(action)}
                  variant={action.variant}
                  size={"lg"}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        </RenderWhen>
      </div>
    </div>
  );

  return createPortal(alertContent, document.body);
}
