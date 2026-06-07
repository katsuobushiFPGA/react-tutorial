import "./App.css";
import { Routes, Route } from "react-router";
import Home from "./Home";
import ZodForm from "./ZodForm";
import ReactHookForm from "./ReactHookForm";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/zod-form" element={<ZodForm />} />
      <Route path="/react-hook-form" element={<ReactHookForm />} />
    </Routes>
  );
}
