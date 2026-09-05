import { fireEvent, render, screen, within } from '@testing-library/react';
import App from './App';

test('adds a new task and clears the input', () => {
  render(<App />);

  const input = screen.getByLabelText(/add a new task/i);
  fireEvent.change(input, { target: { value: 'Finish my reviewer' } });
  fireEvent.click(screen.getByRole('button', { name: /add task/i }));

  expect(screen.getByText('Finish my reviewer')).toBeInTheDocument();
  expect(input).toHaveValue('');
});

test('blocks an empty task', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /add task/i }));

  expect(screen.getByText(/please enter a task/i)).toBeInTheDocument();
});

test('edits an existing task', () => {
  render(<App />);

  const taskRow = screen.getByText('Practice map and filter').closest('li');
  fireEvent.click(within(taskRow).getByRole('button', { name: /edit/i }));

  const input = screen.getByLabelText(/edit task/i);
  fireEvent.change(input, { target: { value: 'Practice map, filter, and reduce' } });
  fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

  expect(screen.getByText('Practice map, filter, and reduce')).toBeInTheDocument();
});

test('deletes a task after confirmation', () => {
  const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
  render(<App />);

  const taskRow = screen.getByText('Prepare for the practical exam').closest('li');
  fireEvent.click(within(taskRow).getByRole('button', { name: /delete/i }));

  expect(screen.queryByText('Prepare for the practical exam')).not.toBeInTheDocument();
  confirmSpy.mockRestore();
});
