import type { FilterStatus } from "./types";

export default function Footer({
  activeFilterStatus,
  activeCount,
  completeCount,
  onClearComplete,
  onChangeFilter,
}: {
  activeFilterStatus: FilterStatus;
  activeCount: number;
  completeCount: number;
  onClearComplete: () => void;
  onChangeFilter: (filter: FilterStatus) => void;
}) {
  return (
    <div className="todo-footer" id="todo-footer">
      <span className="todo-count" id="todo-count">
        {activeCount} item{activeCount !== 1 ? "s" : ""} left
      </span>
      <div className="todo-filters">
        <button
          className={`filter-btn ${activeFilterStatus === "All" ? "active" : ""}`}
          onClick={() => onChangeFilter("All")}
        >
          All
        </button>
        <button
          className={`filter-btn ${activeFilterStatus === "Active" ? "active" : ""}`}
          onClick={() => onChangeFilter("Active")}
        >
          Active
        </button>
        <button
          className={`filter-btn ${activeFilterStatus === "Completed" ? "active" : ""}`}
          onClick={() => onChangeFilter("Completed")}
        >
          Completed
        </button>
      </div>
      <button
        className="clear-completed"
        id="clear-completed"
        onClick={onClearComplete}
        style={
          completeCount > 0
            ? { visibility: "visible" }
            : { visibility: "hidden" }
        }
      >
        Clear completed
      </button>
    </div>
  );
}
