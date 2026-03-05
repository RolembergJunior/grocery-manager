"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useOnboarding } from "@/hooks/use-onboarding";
import StepIndicator from "./components/StepIndicator";
import WelcomeStep from "./components/WelcomeStep";
import VisualCategoryStep from "./components/VisualCategoryStep";
import VisualProductStep from "./components/VisualProductStep";
import ListsStep from "./components/ListsStep";
import { completeOnboarding } from "@/services/profile";
import { toast } from "sonner";
import { useSetAtom } from "jotai";
import { profileAtom } from "@/lib/atoms/profile";
import RenderWhen from "../RenderWhen";

const TOTAL_STEPS = 4;

export default function OnboardingTutorial() {
  const {
    isOpen,
    currentStep,
    nextStep,
    previousStep,
    skipTutorial,
    closeTutorial,
  } = useOnboarding();

  const setProfile = useSetAtom(profileAtom);

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

  async function handleSkip() {
    toast.promise(completeOnboarding, {
      loading: "Finalizando tutorial...",
      success: () => {
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                hasCompletedOnboarding: true,
                onboardingCompletedAt: new Date().toISOString(),
              }
            : prev,
        );

        skipTutorial();

        return "Tutorial pulado com sucesso!";
      },
      error: (error) => {
        console.error("Error skipping onboarding:", error);

        return "Erro ao pular tutorial. Tente novamente.";
      },
    });
  }

  async function handleFinish() {
    toast.promise(completeOnboarding, {
      loading: "Finalizando tutorial...",
      success: () => {
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                hasCompletedOnboarding: true,
                onboardingCompletedAt: new Date().toISOString(),
              }
            : prev,
        );

        closeTutorial();

        return "Tutorial concluído com sucesso!";
      },
      error: (error) => {
        console.error("Error completing onboarding:", error);

        return "Erro ao finalizar tutorial. Tente novamente.";
      },
    });
  }

  const modalContent = (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex justify-center items-center p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 ease-out animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              Tutorial de Boas-vindas
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Passo {currentStep + 1} de {TOTAL_STEPS}
            </p>
          </div>
          <button
            onClick={handleSkip}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer"
            aria-label="Fechar tutorial"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <StepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />

          <RenderWhen isTrue={currentStep === 0}>
            <WelcomeStep onNext={nextStep} onSkip={handleSkip} />
          </RenderWhen>

          <RenderWhen isTrue={currentStep === 1}>
            <VisualCategoryStep
              onNext={nextStep}
              onPrevious={previousStep}
              onSkip={handleSkip}
            />
          </RenderWhen>

          <RenderWhen isTrue={currentStep === 2}>
            <VisualProductStep
              onNext={nextStep}
              onPrevious={previousStep}
              onSkip={handleSkip}
            />
          </RenderWhen>

          <RenderWhen isTrue={currentStep === 3}>
            <ListsStep onFinish={handleFinish} onPrevious={previousStep} />
          </RenderWhen>
        </div>
      </div>
    </div>
  );

  return (
    <RenderWhen isTrue={isOpen}>
      {createPortal(modalContent, document.body)}
    </RenderWhen>
  );
}
