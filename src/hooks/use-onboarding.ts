import { useState, useEffect } from "react";
import { useAtomValue } from "jotai";
import { profileAtom } from "@/lib/atoms/profile";

export function useOnboarding() {
  const profile = useAtomValue(profileAtom);

  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const shouldShowOnboarding =
    profile && !profile.hasCompletedOnboarding && !isOpen;

  useEffect(() => {
    if (shouldShowOnboarding) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [shouldShowOnboarding]);

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const previousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const skipTutorial = () => {
    setIsOpen(false);
    setCurrentStep(0);
  };

  const closeTutorial = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    currentStep,
    shouldShowOnboarding,
    nextStep,
    previousStep,
    skipTutorial,
    closeTutorial,
    setIsOpen,
  };
}
