import { useCallback, useEffect, useRef, useState } from 'react';

// A small music-box melody, synthesized locally: no audio downloads or autoplay.
const melody = [
  [261.63, .5], [261.63, .25], [293.66, .75], [261.63, .75], [349.23, .75], [329.63, 1.5],
  [261.63, .5], [261.63, .25], [293.66, .75], [261.63, .75], [392, .75], [349.23, 1.5],
  [261.63, .5], [261.63, .25], [523.25, .75], [440, .75], [349.23, .75], [329.63, .75], [293.66, 1.5],
  [466.16, .5], [466.16, .25], [440, .75], [349.23, .75], [392, .75], [349.23, 1.5],
];
export function useBirthdayAudio() {
  const context = useRef(null);
  const loop = useRef(null);
  const intent = useRef(false);
  const operation = useRef(0);
  const mounted = useRef(true);
  const [playing, setPlaying] = useState(false);
  const [audioError, setAudioError] = useState('');

  const stopLoop = useCallback(() => { clearInterval(loop.current); loop.current = null; }, []);
  const play = useCallback(async () => {
    intent.current = true;
    const request = ++operation.current;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) throw new Error('Audio unavailable');
      if (!context.current || context.current.state === 'closed') {
        context.current = new AudioContext();
      }
      const audio = context.current;
      await audio.resume();
      if (!mounted.current || request !== operation.current || !intent.current) return;
      if (audio.state !== 'running') throw new Error('Audio blocked');
      const schedule = () => {
        let start = audio.currentTime + .06;
        melody.forEach(([frequency, duration]) => {
          const oscillator = audio.createOscillator();
          const gain = audio.createGain();
          oscillator.type = 'sine';
          oscillator.frequency.value = frequency;
          gain.gain.setValueAtTime(0, start);
          gain.gain.linearRampToValueAtTime(.09, start + .025);
          gain.gain.exponentialRampToValueAtTime(.001, start + duration * .56);
          oscillator.connect(gain);
          gain.connect(audio.destination);
          oscillator.start(start);
          oscillator.stop(start + duration * .6);
          oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
          start += duration * .6;
        });
      };
      if (!loop.current) { schedule(); loop.current = setInterval(schedule, 15500); }
      audio.onstatechange = () => {
        if (mounted.current) setPlaying(audio.state === 'running' && intent.current);
      };
      setPlaying(true);
      setAudioError('');
    } catch {
      intent.current = false;
      stopLoop();
      if (mounted.current) {
        setPlaying(false);
        setAudioError('Sound couldn’t start here. Tap the sound button to try again, or open this page in Chrome.');
      }
    }
  }, [stopLoop]);

  const pause = useCallback(() => {
    intent.current = false;
    ++operation.current;
    stopLoop();
    const audio = context.current;
    context.current = null;
    if (audio) { audio.onstatechange = null; audio.close().catch(() => {}); }
    if (mounted.current) setPlaying(false);
  }, [stopLoop]);
  const toggle = useCallback(() => { if (intent.current) pause(); else void play(); }, [pause, play]);
  useEffect(() => {
    mounted.current = true;
    const onVisibility = () => { if (document.hidden) pause(); };
    document.addEventListener('visibilitychange', onVisibility);
    return () => { mounted.current = false; document.removeEventListener('visibilitychange', onVisibility); pause(); };
  }, [pause]);
  return { playing, audioError, play, toggle };
}
