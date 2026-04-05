import type { FilterStatus } from "./types";

export default function Footer({
  activeFilterStatus,
  activeCount,
  completeCount,
  onClearComplete,
  onClickFilter,
}: {
  activeFilterStatus: FilterStatus;
  activeCount: number;
  completeCount: number;
  onClearComplete: () => void;
  onClickFilter: (filter: FilterStatus) => void;
}) {
  return (
    <div className="todo-footer" id="todo-footer">
      <span className="todo-count" id="todo-count">
        {activeCount} item left
      </span>
      <div className="todo-filters">
        <button
          className={`filter-btn ${activeFilterStatus === "All" ? "active" : ""}`}
          onClick={() => onClickFilter("All")}
        >
          All
        </button>
        <button
          className={`filter-btn ${activeFilterStatus === "Active" ? "active" : ""}`}
          onClick={() => onClickFilter("Active")}
        >
          Active
        </button>
        <button
          className={`filter-btn ${activeFilterStatus === "Completed" ? "active" : ""}`}
          onClick={() => onClickFilter("Completed")}
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
