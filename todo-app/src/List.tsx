import type { Todo } from "@/types/todo";
import { useState } from "react";

export default function List({
  data,
  onCheck,
  onEdit,
  onDelete,
}: {
  data: Todo[];
  onCheck: (id: string, checked: boolean) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>("");

  return (
    <ul className="todo-list" id="todo-list">
      {data.length > 0 ? (
        data.map((d: Todo) => (
          <li key={d.id} className={`todo-item ${d.done ? "completed" : ""}`}>
            <input
              className="todo-check"
              type="checkbox"
              checked={d.done}
              onChange={(e) => onCheck(d.id, e.target.checked)}
            />
            <label className="todo-label" onDoubleClick={() => onEdit(d.id)}>
              {d.text}
            </label>
            <button
              className="todo-delete"
              aria-label="削除"
              onClick={() => onDelete(d.id)}
            >
              ×
            </button>
          </li>
        ))
      ) : (
        <li className="todo-empty">タスクを追加してください</li>
      )}
    </ul>
  );
}
