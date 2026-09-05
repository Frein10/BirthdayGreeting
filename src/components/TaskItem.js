function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const { id, title, completed } = task;

  return (
    <li className={completed ? 'task-item completed' : 'task-item'}>
      <button
        className="check-button"
        type="button"
        onClick={() => onToggle(id)}
        aria-label={completed ? `Mark ${title} as unfinished` : `Mark ${title} as finished`}
      >
        {completed ? '✓' : ''}
      </button>

      <span className="task-title">{title}</span>

      <div className="task-actions">
        <button className="edit-button" type="button" onClick={() => onEdit(task)}>
          Edit
        </button>

        <button className="delete-button" type="button" onClick={() => onDelete(id)}>
          Delete
        </button>
      </div>
    </li>
  );
}

export default TaskItem;
