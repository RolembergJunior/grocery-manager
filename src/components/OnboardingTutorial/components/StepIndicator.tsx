interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function StepIndicator({
  currentStep,
  totalSteps,
}: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={`h-2 rounded-full transition-all duration-300 ${
            index === currentStep
              ? "w-8 bg-blue"
              : index < currentStep
              ? "w-2 bg-blue/60"
              : "w-2 bg-gray-300"
          }`}
        />
      ))}
    </div>
  );
}
