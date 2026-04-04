import type { Todo } from "@/types/todo";
export default function List({
  data,
  onCheck,
  onDelete,
}: {
  data: Todo[];
  onCheck: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <ul className="todo-list" id="todo-list">
      {data.length > 0 ? (
        data.map((d: Todo) => (
          <li key={d.id} className="todo-item">
            <input
              className="todo-check"
              type="checkbox"
              checked={d.done}
              onChange={() => onCheck(d.id)}
            />
            <label className="todo-label">{d.text}</label>
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
