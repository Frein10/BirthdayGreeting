import { fireEvent, render, screen, within, act } from '@testing-library/react';
import confetti from 'canvas-confetti';
import App from './App';
import { birthday } from './birthday.config';

jest.mock('canvas-confetti', () => {
  const fn = jest.fn();
  fn.reset = jest.fn();
  return { __esModule: true, default: fn };
});
const mockPlay = jest.fn();
jest.mock('./useBirthdayAudio', () => ({ useBirthdayAudio: () => ({ playing: false, audioError: '', play: mockPlay, toggle: jest.fn() }) }));

beforeAll(() => {
  window.matchMedia = (query) => ({ matches: false, media: query, onchange: null, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => false });
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); };
});
beforeEach(() => { jest.clearAllMocks(); });

test('opens the gift on a deliberate tap, starts music once, and shows the personal letter', () => {
  render(<App />);
  expect(mockPlay).not.toHaveBeenCalled();
  expect(confetti).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: /unwrap your gift/i }));
  expect(mockPlay).toHaveBeenCalledTimes(1);
  expect(confetti).toHaveBeenCalledTimes(2);
  expect(screen.getByRole('dialog')).toHaveAttribute('open');
  expect(screen.getByRole('heading', { name: `Dear ${birthday.name},` })).toBeInTheDocument();
  expect(document.body.style.overflow).toBe('hidden');
  fireEvent.click(screen.getByRole('button', { name: /close birthday surprise/i }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(document.body.style.overflow).toBe('');
  fireEvent.click(screen.getByRole('button', { name: /read your birthday letter/i }));
  expect(mockPlay).toHaveBeenCalledTimes(1);
});

test('letter can open independently and close with native Escape/cancel', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /^open your letter$/i }));
  expect(mockPlay).not.toHaveBeenCalled();
  fireEvent(screen.getByRole('dialog'), new Event('cancel', { bubbles: true }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('surprise appears only after all five candles go out and candles can be relit', () => {
  render(<App />);
  const candles = screen.getByRole('group', { name: /birthday candles/i });
  for (let i = 1; i <= 4; i++) {
    fireEvent.click(within(candles).getByRole('button', { name: `Blow out candle ${i}` }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  }
  expect(screen.getByText(/1 left/i)).toBeInTheDocument();
  const spent = within(candles).getByRole('button', { name: /candle 1 \(already out\)/i });
  expect(spent).toBeDisabled();
  fireEvent.click(spent);
  expect(screen.getByText(/1 left/i)).toBeInTheDocument();
  fireEvent.click(within(candles).getByRole('button', { name: 'Blow out candle 5' }));
  expect(within(screen.getByRole('dialog')).getByRole('heading', { name: /a prayer for you/i })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /close birthday surprise/i }));
  fireEvent.click(screen.getByRole('button', { name: /relight all candles/i }));
  expect(within(candles).getAllByRole('button')).toHaveLength(5);
  within(candles).getAllByRole('button').forEach((button) => expect(button).toBeEnabled());
});

test('memory controls wrap around and open the selected full photo', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /previous memory/i }));
  fireEvent.click(screen.getByRole('button', { name: `View memory: ${birthday.memories[2].title}` }));
  expect(screen.getByRole('heading', { name: birthday.memories[2].title })).toBeInTheDocument();
  expect(within(screen.getByRole('dialog')).getByRole('img')).toHaveAttribute('src', expect.stringContaining('mom3.jpg'));
  fireEvent.click(screen.getByRole('button', { name: /close birthday surprise/i }));
  fireEvent.click(screen.getByRole('button', { name: /next memory/i }));
  expect(screen.getByRole('button', { name: `View memory: ${birthday.memories[0].title}` })).toBeInTheDocument();
});

test('a missing memory photo shows a readable fallback', () => {
  render(<App />);
  const frame = screen.getByRole('button', { name: `View memory: ${birthday.memories[0].title}` });
  fireEvent.error(within(frame).getByRole('img'));
  expect(within(frame).getByText(/a moment worth keeping/i)).toBeInTheDocument();
});

test('celebrate emits confetti, throttles rapid taps, and cleans feedback up', () => {
  jest.useFakeTimers();
  const { unmount } = render(<App />);
  const celebrate = screen.getByRole('button', { name: /let’s celebrate/i });
  fireEvent.click(celebrate);
  fireEvent.click(celebrate);
  expect(confetti).toHaveBeenCalledTimes(2);
  expect(screen.getByRole('status')).toHaveTextContent(/a little extra love/i);
  act(() => { jest.advanceTimersByTime(3500); });
  expect(screen.getByRole('status')).toBeEmptyDOMElement();
  unmount();
  expect(confetti.reset).toHaveBeenCalled();
  jest.useRealTimers();
});
