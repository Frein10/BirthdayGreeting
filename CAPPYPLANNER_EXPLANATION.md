# CappyPlanner Code Explanation

## What the application does

CappyPlanner is a single-page React to-do list. Its records are stored in memory, so the list resets when the browser reloads. The application supports Create, Read, Update, and Delete operations.

## Main files

- `src/App.js` stores the tasks and contains the CRUD functions.
- `src/components/TaskItem.js` displays one task and its buttons.
- `src/App.css` controls the design and responsive layout.

## State variables

```js
const [tasks, setTasks] = useState(startingTasks);
const [taskName, setTaskName] = useState('');
const [editingId, setEditingId] = useState(null);
const [error, setError] = useState('');
```

- `tasks` contains all task objects.
- `taskName` contains the controlled input value.
- `editingId` identifies the task currently being edited.
- `error` contains the validation message.

## CRUD operations

### Create

The form creates a task object and adds it to a new array.

```js
setTasks([...tasks, newTask]);
```

### Read

React reads the array with `map()` and displays one `TaskItem` for every task.

```jsx
{tasks.map((task) => (
  <TaskItem key={task.id} task={task} />
))}
```

### Update

Editing and completion toggling use `map()`. The matching task becomes a new updated object. All other tasks remain unchanged.

```js
const updatedTasks = tasks.map((task) => {
  if (task.id === editingId) {
    return { ...task, title: cleanTaskName };
  }

  return task;
});
```

### Delete

The application asks for confirmation and uses `filter()` to create an array without the selected task.

```js
const remainingTasks = tasks.filter((task) => task.id !== id);
```

## Form validation

`trim()` removes extra spaces. If the result is empty, the function displays an error and stops using `return`. After a successful add or edit, the input and error message reset.

## Props and destructuring

`TaskItem` receives its data and functions through props. The props and task properties are destructured to keep the code readable.

```js
function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const { id, title, completed } = task;
}
```

## Short presentation script

“CappyPlanner is an in-memory React CRUD application. I used `useState` to store the task list, the form input, the editing ID, and the validation message. Create adds a new object using the spread operator. Read uses `map` to display every task. Update also uses `map` to replace the matching task without changing the other records. Delete first displays a confirmation prompt, then uses `filter` to remove the chosen task. The input is controlled because its value comes from state and `onChange` updates that state. Empty submissions are blocked, and the form resets after a successful save.”
