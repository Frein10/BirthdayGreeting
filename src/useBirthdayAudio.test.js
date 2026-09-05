import { act, renderHook } from '@testing-library/react';
import { useBirthdayAudio } from './useBirthdayAudio';

function makeAudio() {
  return {
    state: 'suspended', currentTime: 0, destination: {},
    resume: jest.fn(function () { this.state = 'running'; return Promise.resolve(); }),
    close: jest.fn(function () { this.state = 'closed'; return Promise.resolve(); }),
    createOscillator: jest.fn(() => ({ type: '', frequency: {}, connect: jest.fn(), start: jest.fn(), stop: jest.fn(), disconnect: jest.fn() })),
    createGain: jest.fn(() => ({ gain: { setValueAtTime: jest.fn(), linearRampToValueAtTime: jest.fn(), exponentialRampToValueAtTime: jest.fn() }, connect: jest.fn(), disconnect: jest.fn() })),
  };
}
beforeEach(() => { jest.useFakeTimers(); });
afterEach(() => { jest.useRealTimers(); delete window.AudioContext; });

test('sound is gesture initiated, can be muted, and releases its audio resources', async () => {
  const audio = makeAudio();
  window.AudioContext = jest.fn(() => audio);
  const { result, unmount } = renderHook(() => useBirthdayAudio());
  expect(window.AudioContext).not.toHaveBeenCalled();
  await act(async () => { await result.current.play(); });
  expect(result.current.playing).toBe(true);
  expect(audio.createOscillator).toHaveBeenCalledTimes(25);
  act(() => result.current.toggle());
  expect(result.current.playing).toBe(false);
  expect(audio.close).toHaveBeenCalledTimes(1);
  act(() => { jest.advanceTimersByTime(32000); });
  expect(audio.createOscillator).toHaveBeenCalledTimes(25);
  unmount();
});

test('audio failure gives an actionable message without preventing the greeting', async () => {
  const audio = makeAudio();
  audio.resume.mockRejectedValue(new Error('blocked'));
  window.AudioContext = jest.fn(() => audio);
  const { result } = renderHook(() => useBirthdayAudio());
  await act(async () => { await result.current.play(); });
  expect(result.current.playing).toBe(false);
  expect(result.current.audioError).toMatch(/sound couldn’t start/i);
  act(() => { jest.advanceTimersByTime(32000); });
  expect(audio.createOscillator).not.toHaveBeenCalled();
});

test('switching away from the page stops sound and clears its loop', async () => {
  const audio = makeAudio();
  window.AudioContext = jest.fn(() => audio);
  const { result } = renderHook(() => useBirthdayAudio());
  await act(async () => { await result.current.play(); });
  Object.defineProperty(document, 'hidden', { configurable: true, value: true });
  act(() => document.dispatchEvent(new Event('visibilitychange')));
  expect(result.current.playing).toBe(false);
  expect(audio.close).toHaveBeenCalledTimes(1);
  act(() => { jest.advanceTimersByTime(32000); });
  expect(audio.createOscillator).toHaveBeenCalledTimes(25);
  Object.defineProperty(document, 'hidden', { configurable: true, value: false });
});
