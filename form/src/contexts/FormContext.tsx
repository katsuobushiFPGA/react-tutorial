import { createContext, useContext, useState } from "react";
import type { Form1Data, Form2Data, Form3Data } from "../schemas/formSchema";

type FormValuesType = { form1: Form1Data; form2: Form2Data; form3: Form3Data };
type FormContextType = {
  formData: FormValuesType;
  updateForm1: (data: Form1Data) => void;
  updateForm2: (data: Form2Data) => void;
  updateForm3: (data: Form3Data) => void;
};

const FormContext = createContext<FormContextType | null>(null);

export function useFormContext() {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error("FormProviderの外で使われています");
  return ctx;
}

export function FormProvider({ children }: React.PropsWithChildren) {
  const [formData, setFormData] = useState<FormValuesType>({
    form1: { name: "", mail: "", age: 0, sex: null },
    form2: { survey1: null, survey2: null, survey3: null, survey4: null },
    form3: { improvement: null, opinion: "", recommend: null },
  });

  const updateForm1 = (data: Form1Data) => {
    setFormData((prev) => ({ ...prev, form1: data }));
  };

  const updateForm2 = (data: Form2Data) => {
    setFormData((prev) => ({ ...prev, form2: data }));
  };

  const updateForm3 = (data: Form3Data) => {
    setFormData((prev) => ({ ...prev, form3: data }));
  };

  return (
    <FormContext value={{ formData, updateForm1, updateForm2, updateForm3 }}>
      {children}
    </FormContext>
  );
}
