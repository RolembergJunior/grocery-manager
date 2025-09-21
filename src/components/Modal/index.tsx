import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import RenderWhen from "../RenderWhen";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  className?: string;
  iconTitle?: React.ReactNode;
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  size = "md",
  showCloseButton = true,
  closeOnOverlayClick = true,
  className = "",
  iconTitle,
}: ModalProps) {
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
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  function handleOverlayClick(e: React.MouseEvent) {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  }

  const modalContent = (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4"
      onClick={handleOverlayClick}
    >
      <div
        className={`
          bg-white rounded-xl shadow-2xl w-full ${sizeClasses[size]} 
          transform transition-all duration-200 ease-out
          ${className}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <RenderWhen isTrue={!!title || !!showCloseButton}>
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <RenderWhen isTrue={!!title}>
              <div className="flex items-center gap-2">
                {iconTitle && iconTitle}
                <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
              </div>
            </RenderWhen>
            <RenderWhen isTrue={!!showCloseButton}>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </RenderWhen>
          </div>
        </RenderWhen>

        <div className="p-6 max-h-[60vh] overflow-y-scroll">{children}</div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
