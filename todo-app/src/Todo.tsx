import type { Todo } from "@/types/todo.ts";
import TodoApp from "./TodoApp.tsx";
import Header from "./Header.tsx";
import List from "./List.tsx";
import Footer from "./Footer.tsx";
import Hint from "./Hint.tsx";

import { useState } from "react";

export default function Todo() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [checkIds, setCheckIds] = useState<number[]>([]);

  function handleRegistTodo(text: string) {
    setTodos([...todos, { id: todos.length + 1, text: text, done: false }]);
  }

  function handleSingleCheck(id: number) {
    if (checkIds.includes(id)) {
      setCheckIds(
        checkIds.filter((tid) => {
          return id !== tid;
        }),
      );
    } else {
      setCheckIds([...checkIds, id]);
    }
    console.log("handleSingleCheck, id: " + id);
  }

  function handleDelete(id: number) {
    setTodos(
      todos.filter((todo) => {
        return todo.id !== id;
      }),
    );
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
        <Footer />
      </TodoApp>
      <Hint />
    </>
  );
}
