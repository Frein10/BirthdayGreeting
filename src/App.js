import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, MotionConfig, useReducedMotion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ArrowDown, ArrowUpRight, CakeSlice, Check, ChevronLeft, ChevronRight, Gift, Heart, Image as ImageIcon, Mail, PartyPopper, RotateCcw, Sparkles, Star, Volume2, VolumeX, X } from 'lucide-react';
import { birthday } from './birthday.config';
import { useBirthdayAudio } from './useBirthdayAudio';
import './App.css';

const asset = (path) => /^(https?:)?\/\//.test(path) ? path : `${process.env.PUBLIC_URL}/${path.replace(/^\//, '')}`;
const photoPath = (memory) => memory.src ? asset(memory.src) : undefined;
const palette = ['#f3d496', '#c1a0f0', '#f0a6cb', '#ffffff', '#9570d2'];
const decorativeStars = Array.from({ length: 23 }, (_, i) => ({ left: `${(i * 43 + 7) % 100}%`, top: `${(i * 29 + 5) % 95}%`, delay: `${i * .21}s` }));

function Photo({ memory, index, ...props }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [memory.src, index]);
  return failed || !memory.src ? <div className="photo-fallback"><ImageIcon size={35} /><span>A moment worth keeping</span></div> : <img {...props} src={photoPath(memory, index)} alt={memory.alt || memory.title} onError={() => setFailed(true)} />;
}

function Modal({ modal, onClose, memory, memoryIndex }) {
  const dialog = useRef(null);
  useEffect(() => {
    if (!modal) return;
    const el = dialog.current;
    const previousFocus = document.activeElement;
    const overflow = document.body.style.overflow;
    el.showModal();
    document.body.style.overflow = 'hidden';
    return () => { el.close(); document.body.style.overflow = overflow; previousFocus?.focus(); };
  }, [modal]);
  if (!modal) return null;
  return <dialog className={`birthday-dialog ${modal === 'photo' ? 'photo-dialog' : ''}`} ref={dialog} onCancel={onClose} onClose={onClose} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} aria-labelledby="dialog-title">
    <motion.div className="dialog-inner" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
      <button autoFocus className="icon-button dialog-close" onClick={onClose} aria-label="Close birthday surprise"><X size={20} /></button>
      {modal === 'photo' ? <><Photo memory={memory} index={memoryIndex} className="full-memory" /><p className="eyebrow">MOMENT {String(memoryIndex + 1).padStart(2, '0')}</p><h2 id="dialog-title">{memory.title}</h2><p>{memory.note}</p></> : modal === 'wish' ? <div className="wish-reveal"><Sparkles size={46} /><p className="eyebrow">MAY GOD BLESS YOUR NEXT CHAPTER</p><h2 id="dialog-title">A prayer for you.<br /><em>With all our love.</em></h2><p>{birthday.surprise}</p><button className="gold-button" onClick={onClose}>Keeping this in my heart <Heart size={17} /></button></div> : <>
        <div className="letter-stamp"><Heart size={27} /></div><p className="eyebrow">SEALED WITH A WHOLE LOT OF LOVE</p><h2 id="dialog-title">Dear {birthday.name},</h2><p className="letter-lead">{birthday.greeting}</p>{birthday.message.map((paragraph, i) => <p key={i}>{paragraph}</p>)}<div className="signature"><span>With all our love,</span><strong>{birthday.from}</strong><Heart size={18} /></div>
      </>}
    </motion.div>
  </dialog>;
}

function BirthdayPage() {
  const reducedMotion = useReducedMotion();
  const [opened, setOpened] = useState(false);
  const [modal, setModal] = useState(null);
  const [candles, setCandles] = useState([true, true, true, true, true]);
  const [memoryIndex, setMemoryIndex] = useState(0);
  const [particles, setParticles] = useState([]);
  const [celebration, setCelebration] = useState('');
  const timer = useRef(null);
  const lastBurst = useRef(0);
  const candlesState = useRef(candles);
  const { playing, audioError, play, toggle } = useBirthdayAudio();
  const memories = birthday.memories.length ? birthday.memories : [{ src: '', title: 'The memories still to come', note: 'Here’s to all our next adventures.', alt: 'A birthday memory' }];
  const remaining = candles.filter(Boolean).length;
  const closeModal = useCallback(() => setModal(null), []);

  useEffect(() => {
    document.title = `Happy birthday, ${birthday.name}! · A little celebration`;
    return () => { clearTimeout(timer.current); confetti.reset(); };
  }, []);

  const celebrate = useCallback(() => {
    const now = Date.now();
    if (now - lastBurst.current < 450) return;
    lastBurst.current = now;
    setCelebration('A little extra love, just for you!');
    clearTimeout(timer.current);
    if (!reducedMotion) {
      const options = { particleCount: window.innerWidth < 640 ? 45 : 75, spread: 75, startVelocity: 38, colors: palette, ticks: 170, disableForReducedMotion: true, zIndex: 20 };
      confetti({ ...options, angle: 60, origin: { x: .04, y: .66 } });
      confetti({ ...options, angle: 120, origin: { x: .96, y: .66 } });
      setParticles(Array.from({ length: 9 }, (_, i) => ({ id: `${now}-${i}`, left: 8 + i * 10, heart: i % 2 === 0 })));
    }
    timer.current = setTimeout(() => { setParticles([]); setCelebration(''); }, 3200);
  }, [reducedMotion]);

  const unwrap = () => {
    if (!opened) { setOpened(true); if (!playing) void play(); }
    celebrate();
    setModal('letter');
  };
  const blowCandle = (index) => {
    if (!candlesState.current[index]) return;
    const next = candlesState.current.map((lit, i) => i === index ? false : lit);
    candlesState.current = next;
    setCandles(next);
    if (next.every((lit) => !lit)) { celebrate(); setModal('wish'); }
  };
  const relight = () => { const next = [true, true, true, true, true]; candlesState.current = next; setCandles(next); };
  const nextMemory = (direction) => setMemoryIndex((i) => (i + direction + memories.length) % memories.length);

  return <div className={`birthday-app ${opened ? 'party-started' : ''}`}>
    <a href="#main-content" className="skip-link">Skip to birthday greeting</a>
    <header className="site-header flex items-center justify-between">
      <a className="brand flex items-center gap-2" href="#home"><Sparkles size={21} aria-hidden="true" />a little celebration<span>.</span></a>
      <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation"><a href="#letter">Your letter</a><a href="#memories">Our memories</a><a href="#wish">Make a wish</a></nav>
      <button className={`sound-button flex items-center gap-2 ${playing ? 'sound-playing' : ''}`} onClick={toggle} aria-pressed={playing} aria-label={playing ? 'Turn sound off' : 'Turn sound on'}>{playing ? <Volume2 size={16} /> : <VolumeX size={16} />}<span>{playing ? 'Sound on' : 'Sound off'}</span></button>
    </header>
    {audioError && <p role="status" className="audio-error section-width">{audioError}</p>}
    <main id="main-content"><section className="hero section-width" id="home" aria-labelledby="hero-title">
      <div className="star-field" aria-hidden="true">{decorativeStars.map((star, i) => <span key={i} style={{ left: star.left, top: star.top, animationDelay: star.delay }} className={i % 5 === 0 ? 'large-star' : ''}>{i % 5 === 0 ? '✦' : '·'}</span>)}</div>
      <div className="hero-copy"><div className="eyebrow"><span />THANKING GOD FOR YOU, TODAY & ALWAYS</div>
        <h1 id="hero-title">{['A heart full of', 'gratitude.'].map((line, i) => <motion.div key={line} initial={{ opacity: 0, y: reducedMotion ? 0 : 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .13, duration: .6 }}>{line}</motion.div>)}<motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .3 }}>All for you.</motion.span><Sparkles className="headline-star" aria-hidden="true" /></h1>
        <p className="hero-recipient">Happy birthday, {birthday.name} <span aria-hidden="true">♡</span></p>
        <p className="hero-description">Across every mile, your love brings us home.<br className="hidden sm:block" /> Today, Mom, we celebrate the blessing you are.</p>
        <motion.button whileTap={{ scale: .97 }} className="gold-button" onClick={unwrap}><Gift size={19} />{opened ? 'Read your birthday letter' : 'Unwrap your gift'}<ArrowUpRight size={19} /></motion.button>
        <p className="tap-note"><span aria-hidden="true">✦</span> {opened ? 'Always in our hearts, no matter the miles.' : 'A little tap. A whole lot of happy.'}</p>
      </div>
      <div className="gift-stage"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><motion.button className="gift-art-button" onClick={unwrap} aria-label="Open your birthday gift" animate={!reducedMotion && opened ? { y: [0, -13, 0], rotate: [-2, 2, -2] } : {}} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} whileHover={{ scale: 1.03 }}><img className="gift-art" src={asset('art/gift.jpg')} width="800" height="800" alt="A lavender gift with an extravagant golden bow and floating stars" fetchPriority="high" /></motion.button><span className="gift-label">a little something, just for you</span><span className="gift-tag"><Heart size={12} /> PACKED WITH LOVE</span></div>
      <a className="scroll-note" href="#letter">MORE LOVE IS WAITING BELOW <ArrowDown size={15} /></a>
    </section>
    <div className="birthday-ribbon" aria-hidden="true">IT’S YOUR DAY <Sparkles size={16} /> BLESSED TO CALL YOU MOM <Sparkles size={16} /> YOU ARE SO LOVED <Sparkles size={16} /> HERE’S TO YOU <Sparkles size={16} /> IT’S YOUR DAY</div>
    <section className="section-width surprises" aria-labelledby="surprises-title">
      <div className="section-heading"><div><p className="eyebrow">THE GOOD STUFF</p><h2 id="surprises-title">Little moments. <em>Big feelings.</em></h2></div><p>From your family, with love and gratitude.</p></div>
      <div className="surprise-grid">
        <article className="glass-panel letter-panel backdrop-blur-sm" id="letter">
          <div className="panel-top"><span className="panel-icon"><Mail size={18} /></span><span className="panel-number">01 / FOR YOUR HEART</span></div>
          <button className="envelope-button" onClick={() => setModal('letter')} aria-label="Open your personal letter"><Mail size={111} strokeWidth={.7} /><span className="wax-seal"><Heart size={20} /></span><span className="envelope-note">to our wonderful Mom</span></button>
          <h3>A note from the heart</h3><p>Some things are too special to fit<br className="hidden lg:block" /> in a birthday text.</p><button className="text-button" onClick={() => setModal('letter')}>Open your letter <ArrowUpRight size={16} /></button>
        </article>
        <article className="glass-panel memory-panel backdrop-blur-sm" id="memories">
          <div className="panel-top"><span className="panel-icon"><ImageIcon size={18} /></span><span className="panel-number">02 / THE HAPPY BITS</span></div>
          <div className="polaroid-stage"><div className="polaroid-back" aria-hidden="true"><Photo memory={memories[(memoryIndex + 1) % memories.length]} index={(memoryIndex + 1) % memories.length} loading="lazy" /></div><motion.button className="polaroid" whileHover={{ rotate: 0, scale: 1.03 }} whileTap={{ scale: .98 }} onClick={() => setModal('photo')} aria-label={`View memory: ${memories[memoryIndex].title}`}><Photo memory={memories[memoryIndex]} index={memoryIndex} width="280" height="190" loading="lazy" /><span>{memories[memoryIndex].title} <Heart size={11} /></span></motion.button><Sparkles className="polaroid-sparkle" size={22} aria-hidden="true" /></div>
          <div className="memory-heading"><h3>The moments we keep</h3></div><p>{memories[memoryIndex].note}</p><div className="memory-controls"><button className="icon-button" onClick={() => nextMemory(-1)} aria-label="Previous memory" disabled={memories.length < 2}><ChevronLeft size={17} /></button><span aria-live="polite">{String(memoryIndex + 1).padStart(2, '0')} <span>/ {String(memories.length).padStart(2, '0')}</span></span><button className="icon-button" onClick={() => nextMemory(1)} aria-label="Next memory" disabled={memories.length < 2}><ChevronRight size={17} /></button></div>
        </article>
        <article className="glass-panel cake-panel backdrop-blur-sm" id="wish">
          <div className="panel-top"><span className="panel-icon"><CakeSlice size={18} /></span><span className="panel-number">03 / A BIRTHDAY BLESSING</span></div>
          <div className="cake-stage"><img src={asset('art/cake.jpg')} width="800" height="800" alt="A lavender birthday cake with gold decorations" loading="lazy" /><div className="candles" role="group" aria-label="Birthday candles">{candles.map((lit, i) => <button key={i} className={`candle ${lit ? 'lit' : 'blown'}`} onClick={() => blowCandle(i)} disabled={!lit} aria-label={`Blow out candle ${i + 1}${lit ? '' : ' (already out)'}`}><span className="flame" aria-hidden="true">🔥</span><span className="candle-stick" aria-hidden="true" /><span className="candle-smoke" aria-hidden="true">~</span></button>)}</div></div>
          <h3>{remaining ? 'One wish. All yours.' : 'A wish and a prayer for you.'}</h3><p aria-live="polite">{remaining ? `Make a wish, then tap each candle. ${remaining} ${remaining === 1 ? 'left' : 'to go'}.` : 'May God bless you with joy and good health. ♡'}</p>{remaining ? <div className="candle-hint"><Sparkles size={14} /> Psst… there’s a surprise at the end.</div> : <div className="wish-actions"><button className="text-button" onClick={() => setModal('wish')}>Your surprise <Heart size={15} /></button><button className="icon-button" onClick={relight} aria-label="Relight all candles"><RotateCcw size={16} /></button></div>}
        </article>
      </div>
      <div className="celebrate-section"><div className="celebrate-copy"><span className="tiny-stars" aria-hidden="true">✦ · ✧</span><h2>Because you deserve <em>all the confetti.</em></h2><p>No such thing as too much birthday love.</p></div><motion.button className="celebrate-button" whileTap={{ scale: .95 }} onClick={celebrate}><PartyPopper size={18} />Let’s celebrate<Star size={14} /></motion.button></div>
    </section></main>
    <footer><span>Made with</span><Heart size={13} aria-label="love" /><span>from your family. Happy birthday, Mom.</span></footer>
    <div className="celebration-status" role="status">{celebration && <span><Check size={15} />{celebration}</span>}</div>
    <div className="party-particles" aria-hidden="true"><AnimatePresence>{particles.map((p) => <motion.span key={p.id} style={{ left: `${p.left}%` }} initial={{ y: 0, opacity: 0, scale: .5 }} animate={{ y: '-75vh', opacity: [0, 1, 1, 0], rotate: p.heart ? 25 : -45, scale: [1, 1.6, 1] }} transition={{ duration: 2.6, delay: p.left / 400 }}>{p.heart ? '💜' : '✨'}</motion.span>)}</AnimatePresence></div>
    <Modal modal={modal} onClose={closeModal} memory={memories[memoryIndex]} memoryIndex={memoryIndex} />
  </div>;
}
export default function App() { return <MotionConfig reducedMotion="user"><BirthdayPage /></MotionConfig>; }
