import type { ReactElement } from "react";

export type Todo = {
  id: number;
  text: string;
  done: boolean;
};

export type TodoProps = {
  children: [ReactElement, ReactElement, ReactElement];
};
