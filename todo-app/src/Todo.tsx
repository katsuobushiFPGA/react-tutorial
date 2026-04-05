import type { Todo } from "@/types/todo.ts";
import TodoApp from "./TodoApp.tsx";
import Header from "./Header.tsx";
import List from "./List.tsx";
import Footer from "./Footer.tsx";
import Hint from "./Hint.tsx";

import { useState } from "react";

function genId(): string {
  return crypto.randomUUID();
}

export default function Todo() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const allChecked = todos.length > 0 && todos.every((t) => t.done);
  const activeTodoCount = todos.filter((todo) => !todo.done).length;
  const completeTodoCount = todos.length - activeTodoCount;

  function handleAllCheck(checked: boolean) {
    setTodos((prev) => prev.map((todo) => ({ ...todo, done: checked })));
  }

  function handleRegistTodo(text: string) {
    setTodos((prev) => [...prev, { id: genId(), text: text, done: false }]);
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

  function handleClearComplete() {
    setTodos((prev) => prev.filter((todo) => !todo.done));
  }

  return (
    <>
      <TodoApp>
        <Header
          allChecked={allChecked}
          onRegistTodo={handleRegistTodo}
          onCheck={handleAllCheck}
        />
        <List
          data={todos}
          onCheck={handleSingleCheck}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        {todos.length > 0 && (
          <Footer
            activeCount={activeTodoCount}
            completeCount={completeTodoCount}
            onClearComplete={handleClearComplete}
          />
        )}
      </TodoApp>
      <Hint />
    </>
  );
}
