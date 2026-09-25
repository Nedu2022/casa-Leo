import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { VILLA, ROOMS, CLOSING } from '../data/villa'

export function Hero({ onBook, onTour, ready }) {
  const root = useRef(null)
  useGSAP(() => {
    if (!ready) return
    gsap.fromTo('[data-h="img"]', { scale: 1.15 }, { scale: 1, duration: 2.6, ease: 'expo.out' })
    gsap.from('[data-h="txt"]', { y: 40, opacity: 0, duration: 1.1, stagger: 0.1, ease: 'expo.out', delay: 0.2 })
    // slow parallax as the page scrolls away
    gsap.to('[data-h="wrap"]', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } })
  }, { scope: root, dependencies: [ready] })

  return (
    <section ref={root} id="top" className="relative h-[100svh] min-h-[620px] overflow-hidden bg-stone-900">
      <div data-h="wrap" className="absolute inset-0">
        <img data-h="img" src={VILLA.hero} alt="Villa Castelldefels: stone villa with a pool" className="h-full w-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/5 to-black/65" />
      <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-16 sm:px-10 sm:pb-20">
        <p data-h="txt" className="text-[11px] font-medium uppercase tracking-[0.4em] text-gold-soft">{VILLA.kicker}</p>
        <h1 data-h="txt" className="mt-4 max-w-4xl font-display text-6xl leading-[0.92] text-white text-shadow sm:text-8xl lg:text-9xl">
          {VILLA.title}
        </h1>
        <div data-h="txt" className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-md text-base leading-relaxed text-white/90 text-shadow">{VILLA.body}</p>
          <div className="flex flex-wrap gap-3">
            <button onClick={onTour} className="rounded-full bg-white px-7 py-3.5 text-sm font-medium text-ink transition hover:bg-gold-soft">
              Tour the villa
            </button>
            <button onClick={onBook} className="rounded-full border border-white/60 px-7 py-3.5 text-sm text-white backdrop-blur-sm transition hover:bg-white/15">
              Book a private viewing
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function Room({ room, index }) {
  const flip = index % 2 === 1
  return (
    <article data-room className="grid items-center gap-8 md:grid-cols-12 md:gap-14">
      <div className={`md:col-span-7 ${flip ? 'md:order-2' : ''}`}>
        <div data-reveal className="overflow-hidden rounded-2xl" style={{ clipPath: 'inset(0 0 0 0 round 16px)' }}>
          <img data-zoom src={room.img} alt={room.title} loading="lazy" className="aspect-[4/3] w-full object-cover" />
        </div>
      </div>
      <div data-text className={`md:col-span-5 ${flip ? 'md:order-1' : ''}`}>
        <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-gold-deep">
          <span className="mr-3 font-display text-lg italic tracking-normal text-gold">{String(index + 1).padStart(2, '0')}</span>
          {room.kicker}
        </p>
        <h3 className="mt-4 font-display text-4xl leading-tight text-ink sm:text-5xl">{room.title}</h3>
        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-stone-600">{room.body}</p>
        {room.stats && (
          <div className="mt-8 flex gap-10 border-t border-stone-200 pt-6">
            {room.stats.map(([v, l]) => (
              <div key={l}>
                <div className="font-display text-3xl text-ink">{v}</div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-stone-500">{l}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}

export function VillaStory({ onBook, onBrowse }) {
  const root = useRef(null)
  useGSAP(() => {
    gsap.utils.toArray('[data-room]').forEach((el) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 80%', once: true } })
      tl.fromTo(el.querySelector('[data-reveal]'), { clipPath: 'inset(12% 8% 12% 8% round 16px)' }, { clipPath: 'inset(0% 0% 0% 0% round 16px)', duration: 1.3, ease: 'expo.out' })
        .fromTo(el.querySelector('[data-zoom]'), { scale: 1.2 }, { scale: 1, duration: 1.6, ease: 'expo.out' }, 0)
        .from(el.querySelector('[data-text]').children, { y: 30, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'expo.out' }, 0.2)
    })
    gsap.from('[data-intro] > *', { y: 30, opacity: 0, duration: 1, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '[data-intro]', start: 'top 80%', once: true } })
  }, { scope: root })

  return (
    <div ref={root}>
      <section id="villa" className="bg-white px-4 py-24 sm:px-10 sm:py-32">
        <div data-intro className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-12">
          <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-gold-deep lg:col-span-3">The Villa</p>
          <div className="lg:col-span-9">
            <h2 className="font-display text-5xl leading-[1.02] text-ink sm:text-7xl">
              Stone, light and the <span className="italic text-gold">Mediterranean</span>, arranged over two floors.
            </h2>
            <div className="mt-12 grid grid-cols-2 gap-8 border-t border-stone-200 pt-8 sm:grid-cols-4">
              {VILLA.stats.map(([v, l]) => (
                <div key={l}>
                  <div className="font-display text-4xl text-ink">{v}</div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-stone-500">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mx-auto mt-24 flex max-w-7xl flex-col gap-24 sm:mt-32 sm:gap-36">
          {ROOMS.map((r, i) => <Room key={r.title} room={r} index={i} />)}
        </div>
      </section>

      <section className="relative overflow-hidden">
        <img src={CLOSING} alt="Infinity pool at dusk overlooking the sea" loading="lazy" className="h-[80vh] min-h-[520px] w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-16 sm:px-10 sm:pb-20">
          <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-gold-soft">Private sale</p>
          <h2 className="mt-3 font-display text-5xl text-white text-shadow sm:text-7xl">Make it yours.</h2>
          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={onBook} className="rounded-full bg-white px-7 py-3.5 text-sm font-medium text-ink transition hover:bg-gold-soft">Book a private viewing</button>
            <button onClick={onBrowse} className="rounded-full border border-white/60 px-7 py-3.5 text-sm text-white transition hover:bg-white/15">Browse the collection</button>
          </div>
        </div>
      </section>
    </div>
  )
}
