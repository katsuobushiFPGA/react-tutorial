import type { Todo, FilterStatus } from "@/types/todo.ts";
import { useState } from "react";
import TodoApp from "./TodoApp.tsx";
import Header from "./Header.tsx";
import List from "./List.tsx";
import Footer from "./Footer.tsx";
import Hint from "./Hint.tsx";

function genId(): string {
  return crypto.randomUUID();
}

export default function Todo() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterStatus>("All");
  const emptyMessage =
    todos.length === 0
      ? "タスクを追加してください"
      : "該当するタスクはありません";
  const filteredTodos = todos.filter((t) => {
    if (filter === "Active") return !t.done;
    if (filter === "Completed") return t.done;
    return true;
  });
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

  function handleChangeFilter(filter: FilterStatus) {
    setFilter(filter);
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
          data={filteredTodos}
          emptyMessage={emptyMessage}
          onCheck={handleSingleCheck}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        {todos.length > 0 && (
          <Footer
            activeFilterStatus={filter}
            activeCount={activeTodoCount}
            completeCount={completeTodoCount}
            onClearComplete={handleClearComplete}
            onChangeFilter={handleChangeFilter}
          />
        )}
      </TodoApp>
      <Hint />
    </>
  );
}
