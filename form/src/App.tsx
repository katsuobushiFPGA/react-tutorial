import "./App.css";
import { Step1 } from "./_components/form/Step1";
import { Step2 } from "./_components/form/Step2";
import { Step3 } from "./_components/form/Step3";
import { Step4 } from "./_components/form/Step4";
import { Thanks } from "./_components/form/Thanks";
import { useState } from "react";

type StepProps = {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onNext: () => void;
  onPrev: () => void;
};

const componentMap: Record<FormState, React.ComponentType<StepProps>> = {
  Step1,
  Step2,
  Step3,
  Step4,
  Thanks,
};

export default function App() {
  const steps: FormState[] = ["Step1", "Step2", "Step3", "Step4", "Thanks"];
  const Component = componentMap[steps[stepIndex]];
  const [stepIndex, setStepIndex] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialData);
  return (
    <Component
      formData={formData}
      setFormData={setFormData}
      onNext={() => setStepIndex((i) => i + 1)}
      onPrev={() => setStepIndex((i) => i - 1)}
    />
  );
}
