import type { Todo } from "@/types/todo.ts";
import TodoApp from "./TodoApp.tsx";
import Header from "./Header.tsx";
import List from "./List.tsx";
import Footer from "./Footer.tsx";
import Hint from "./Hint.tsx";

import { useState } from "react";

export default function Todo() {
  const [todos, setTodos] = useState<Todo[]>([]);

  function genId(): string {
    return crypto.randomUUID();
  }

  function handleRegistTodo(text: string) {
    setTodos([...todos, { id: genId(), text: text, done: false }]);
  }

  function handleSingleCheck(id: string, checked: boolean) {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, done: checked } : todo)),
    );
  }

  function handleEdit(id: string) {
    console.log("handleEdit, id: " + id);
  }

  function handleDelete(id: string) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  return (
    <>
      <TodoApp>
        <Header onRegistTodo={handleRegistTodo} />
        <List
          data={todos}
          onCheck={handleSingleCheck}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        {todos.length > 0 && <Footer count={todos.length} />}
      </TodoApp>
      <Hint />
    </>
  );
}
