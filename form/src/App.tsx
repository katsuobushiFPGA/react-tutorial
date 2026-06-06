import "./App.css";
import { Step1 } from "./_components/form/Step1";
import { Step2 } from "./_components/form/Step2";
import { Step3 } from "./_components/form/Step3";
import { Step4 } from "./_components/form/Step4";
import { Thanks } from "./_components/form/Thanks";

function App() {
  return (
    <>
      <Step1 />
      <Step2 />
      <Step3 />
      <Step4 />
      <Thanks />
    </>
  );
}

export default App;
