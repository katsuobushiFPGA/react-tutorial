import { Step1 } from "./components/Step1";
import { Step2 } from "./components/Step2";
import { Step3 } from "./components/Step3";
import { Step4 } from "./components/Step4";
import { Thanks } from "./components/Thanks";
import { useState } from "react";
import { FormProvider } from "./contexts/FormContext";

type StepState = "Step1" | "Step2" | "Step3" | "Step4" | "Thanks";

export default function ZodForm() {
  const [currentStep, setCurrentStep] = useState<StepState>("Step1");
  return (
    <FormProvider>
      {currentStep === "Step1" && <Step1 />}
      {currentStep === "Step2" && <Step2 />}
      {currentStep === "Step3" && <Step3 />}
      {currentStep === "Step4" && <Step4 />}
      {currentStep === "Thanks" && <Thanks />}
    </FormProvider>
  );
}
