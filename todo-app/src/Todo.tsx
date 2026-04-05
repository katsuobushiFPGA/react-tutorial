import type { Todo } from "@/types/todo.ts";
import TodoApp from "./TodoApp.tsx";
import Header from "./Header.tsx";
import List from "./List.tsx";
import Footer from "./Footer.tsx";
import Hint from "./Hint.tsx";

import { useState } from "react";

export default function Todo() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [checkIds, setCheckIds] = useState<string[]>([]);

  function genId(): string {
    return crypto.randomUUID();
  }

  function handleRegistTodo(text: string) {
    setTodos([...todos, { id: genId(), text: text, done: false }]);
  }

  function handleSingleCheck(id: string) {
    setCheckIds((prev) =>
      prev.includes(id) ? prev.filter((tid) => id !== tid) : [...prev, id],
    );
    console.log("handleSingleCheck, id: " + id);
  }

  function handleDelete(id: string) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    console.log("handleDelete, id: " + id);
  }

  return (
    <>
      <TodoApp>
        <Header onRegistTodo={handleRegistTodo} />
        <List
          data={todos}
          onCheck={handleSingleCheck}
          onDelete={handleDelete}
        />
        {todos.length > 0 && <Footer count={todos.length} />}
      </TodoApp>
      <Hint />
    </>
  );
}
