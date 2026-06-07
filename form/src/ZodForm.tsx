import { Step1 } from "./components/Step1";
import { Step2 } from "./components/Step2";
import { Step3 } from "./components/Step3";
import { Step4 } from "./components/Step4";
import { Thanks } from "./components/Thanks";
import { useState } from "react";
import { FormProvider } from "./contexts/FormContext";

type StepProps = {
  onNext: () => void;
  onPrev: () => void;
};
const StepMap: React.ComponentType<StepProps>[] = [
  Step1,
  Step2,
  Step3,
  Step4,
  Thanks,
];

export default function ZodForm() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const CurrentComponent: React.ComponentType<StepProps> = StepMap[currentStep];

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };
  const handleNext = () => {
    if (currentStep < StepMap.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  return (
    <FormProvider>
      <CurrentComponent onPrev={handlePrev} onNext={handleNext} />
    </FormProvider>
  );
}
