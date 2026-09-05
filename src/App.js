import { useState } from 'react';
import './App.css';
import TaskItem from './components/TaskItem';

const startingTasks = [
  { id: 1, title: 'Review React useState', completed: true },
  { id: 2, title: 'Practice map and filter', completed: false },
  { id: 3, title: 'Prepare for the practical exam', completed: false },
];

function App() {
  const [tasks, setTasks] = useState(startingTasks);
  const [taskName, setTaskName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const cleanTaskName = taskName.trim();

    if (cleanTaskName === '') {
      setError('Please enter a task before saving.');
      return;
    }

    if (editingId !== null) {
      const updatedTasks = tasks.map((task) => {
        if (task.id === editingId) {
          return { ...task, title: cleanTaskName };
        }

        return task;
      });

      setTasks(updatedTasks);
      setEditingId(null);
    } else {
      const newTask = {
        id: Date.now(),
        title: cleanTaskName,
        completed: false,
      };

      setTasks([...tasks, newTask]);
    }

    setTaskName('');
    setError('');
  };

  const handleEdit = ({ id, title }) => {
    setTaskName(title);
    setEditingId(id);
    setError('');
  };

  const handleDelete = (id) => {
    const shouldDelete = window.confirm('Delete this task?');

    if (shouldDelete) {
      const remainingTasks = tasks.filter((task) => task.id !== id);
      setTasks(remainingTasks);

      if (editingId === id) {
        handleCancelEdit();
      }
    }
  };

  const handleToggle = (id) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, completed: !task.completed };
      }

      return task;
    });

    setTasks(updatedTasks);
  };

  const handleCancelEdit = () => {
    setTaskName('');
    setEditingId(null);
    setError('');
  };

  const completedTasks = tasks.filter((task) => task.completed).length;
  const remainingTasks = tasks.length - completedTasks;

  return (
    <main className="app-shell">
      <section className="planner" aria-labelledby="planner-title">
        <header className="planner-header">
          <div>
            <h1 id="planner-title">CappyPlanner</h1>
            <p className="intro">Your calm space for organizing today's tasks.</p>
          </div>
        </header>

        <form className="task-form" onSubmit={handleSubmit}>
          <label htmlFor="task-name">
            {editingId !== null ? 'Edit task' : 'Add a new task'}
          </label>

          <div className="form-row">
            <input
              id="task-name"
              type="text"
              value={taskName}
              onChange={(event) => setTaskName(event.target.value)}
              placeholder="What needs to be done?"
              aria-describedby={error ? 'form-error' : undefined}
            />

            <button className="primary-button" type="submit">
              {editingId !== null ? 'Save changes' : 'Add task'}
            </button>

            {editingId !== null && (
              <button
                className="secondary-button"
                type="button"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            )}
          </div>

          {error && <p className="form-error" id="form-error">{error}</p>}
        </form>

        <div className="list-heading">
          <div>
            <p className="eyebrow">TODAY</p>
            <h2>Your tasks</h2>
          </div>

          <p className="task-summary">
            <strong>{remainingTasks}</strong> remaining
            <span aria-hidden="true"> · </span>
            <strong>{completedTasks}</strong> done
          </p>
        </div>

        {tasks.length === 0 ? (
          <div className="empty-state">
            <p>Your list is empty.</p>
            <span>Add a task above to get started.</span>
          </div>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggle}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        )}
      </section>

      <p className="storage-note">Tasks are kept in memory and reset when the page reloads.</p>
    </main>
  );
}

export default App;
