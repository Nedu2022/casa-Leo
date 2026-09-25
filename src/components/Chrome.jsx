import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { VILLA } from '../data/villa'

// Brief intro that also waits for the hero photograph, so the page never opens on a blank frame.
export function Loader({ onDone }) {
  const root = useRef(null)
  useGSAP(() => {
    const heroReady = new Promise((res) => {
      const img = new Image()
      img.onload = img.onerror = res
      img.src = VILLA.hero
      setTimeout(res, 5000)
    })
    const intro = gsap.timeline()
      .from('[data-l="word"]', { yPercent: 110, duration: 0.9, stagger: 0.08, ease: 'expo.out' })
      .from('[data-l="line"]', { scaleX: 0, duration: 0.9, ease: 'expo.inOut' }, '-=0.5')
    Promise.all([heroReady, intro.then()]).then(() => {
      gsap.timeline({ onComplete: onDone })
        .to('[data-l="word"]', { yPercent: -110, duration: 0.6, stagger: 0.05, ease: 'expo.in' })
        .to(root.current, { clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'expo.inOut' }, '-=0.2')
    })
  }, { scope: root })

  return (
    <div ref={root} className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-white" style={{ clipPath: 'inset(0 0 0% 0)' }}>
      <div className="flex gap-4 overflow-hidden font-display text-5xl text-ink sm:text-7xl">
        {['Casa', 'Leo', 'Estates'].map((w) => (
          <span key={w} data-l="word" className={`inline-block ${w === 'Leo' ? 'italic text-gold' : ''}`}>{w}</span>
        ))}
      </div>
      <div data-l="line" className="mt-6 h-px w-48 origin-left bg-gold" />
    </div>
  )
}

// Transparent over the hero photo, then a solid white bar once you scroll into the page.
export function Navbar({ saved, onNav, onSaved }) {
  const [solid, setSolid] = useState(false)
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.75)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const tone = solid ? 'text-ink' : 'text-white'
  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${solid ? 'border-b border-stone-200 bg-white/90 backdrop-blur-md' : 'bg-transparent'}`}>
      <div className={`mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-10 sm:py-5 ${tone}`}>
        <button onClick={() => onNav('top')} className={`font-display text-2xl tracking-wide ${solid ? '' : 'text-shadow'}`}>
          Casa <span className="italic text-gold">Leo</span>
        </button>
        <nav className="hidden items-center gap-8 text-[11px] font-medium uppercase tracking-[0.25em] md:flex">
          {[['villa', 'The Villa'], ['collection', 'Collection'], ['contact', 'Private Viewing']].map(([id, label]) => (
            <button key={id} onClick={() => onNav(id)} className="opacity-80 transition hover:opacity-100">
              {label}
            </button>
          ))}
        </nav>
        <button
          onClick={onSaved}
          className={`flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-medium uppercase tracking-[0.2em] transition ${solid ? 'border-stone-300 hover:border-gold' : 'border-white/40 hover:bg-white/10'}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={saved ? '#b8914a' : 'none'} stroke="#b8914a" strokeWidth="2" aria-hidden>
            <path d="M12 21s-7-4.35-9.5-8.5C.5 9 2.5 5 6.5 5c2 0 3.5 1 5.5 3 2-2 3.5-3 5.5-3 4 0 6 4 4 7.5C19 16.65 12 21 12 21z" />
          </svg>
          Saved <span className="text-gold">{saved}</span>
        </button>
      </div>
    </header>
  )
}
