export default function Footer() {
  return (
    <div className="todo-footer" id="todo-footer">
      <span className="todo-count" id="todo-count"></span>
      <div className="todo-filters">
        <button className="filter-btn active" data-filter="all">
          All
        </button>
        <button className="filter-btn" data-filter="active">
          Active
        </button>
        <button className="filter-btn" data-filter="completed">
          Completed
        </button>
      </div>
      <button className="clear-completed" id="clear-completed">
        Clear completed
      </button>
    </div>
  );
}
