import type { Todo } from "@/types/todo";

export default function List({
  data,
  editingId,
  emptyMessage,
  onCheck,
  onEdit,
  onEditText,
  onDelete,
}: {
  data: Todo[];
  editingId: string | null;
  emptyMessage: string;
  onCheck: (id: string, checked: boolean) => void;
  onEdit: (id: string) => void;
  onEditText: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}) {
  const todoItemClass = (todo: Todo) => {
    if (todo.id === editingId) {
      return "todo-item editing";
    } else if (todo.done) {
      return "todo-item completed";
    }
    return "todo-item";
  };

  return (
    <ul className="todo-list" id="todo-list">
      {data.length > 0 ? (
        data.map((d: Todo) => (
          <li key={d.id} className={todoItemClass(d)}>
            {d.id !== editingId ? (
              <>
                <input
                  key="view"
                  className="todo-check"
                  type="checkbox"
                  checked={d.done}
                  onChange={(e) => onCheck(d.id, e.target.checked)}
                />
                <label
                  className="todo-label"
                  onDoubleClick={() => {
                    onEdit(d.id);
                  }}
                >
                  {d.text}
                </label>
                <button
                  className="todo-delete"
                  aria-label="削除"
                  onClick={() => onDelete(d.id)}
                >
                  ×
                </button>
              </>
            ) : (
              <input
                key="edit"
                className="todo-edit-input"
                type="text"
                defaultValue={d.text}
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    onEditText(d.id, e.currentTarget.value);
                  }
                  if (e.key === "Escape") {
                    onEditText(d.id, d.text);
                  }
                }}
                onBlur={(e) => onEditText(d.id, e.currentTarget.value)}
                autoFocus
              />
            )}
          </li>
        ))
      ) : (
        <li className="todo-empty">{emptyMessage}</li>
      )}
    </ul>
  );
}
