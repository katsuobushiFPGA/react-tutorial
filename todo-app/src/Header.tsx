import { useState } from "react";

export default function Header({
  onRegistTodo,
}: {
  onRegistTodo: (text: string) => void;
}) {
  const [text, setText] = useState("");

  return (
    <div className="todo-header">
      <h1 className="todo-title">todos</h1>
      <div className="todo-input-row">
        <button
          className="toggle-all"
          id="toggle-all"
          aria-label="全て選択"
        ></button>
        <input
          className="new-todo-input"
          id="new-todo-input"
          type="text"
          placeholder="What needs to be done?"
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              onRegistTodo(text);
              setText("");
            }
          }}
        />
      </div>
    </div>
  );
}
