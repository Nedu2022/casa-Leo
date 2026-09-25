import { useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { LISTINGS, fmtPrice } from '../data/listings'
import { Segmented, Range } from './Form'

const REGIONS = ['All', ...new Set(LISTINGS.map((l) => l.region))]
const SORTS = {
  featured: () => 0,
  'price-desc': (a, b) => b.price - a.price,
  'price-asc': (a, b) => a.price - b.price,
  area: (a, b) => b.area - a.area,
}

export default function Marketplace({ saved, toggleSave, onOpen, onlySaved, setOnlySaved }) {
  const [region, setRegion] = useState('All')
  const [maxPrice, setMaxPrice] = useState(45)
  const [sort, setSort] = useState('featured')
  const [q, setQ] = useState('')
  const grid = useRef(null)

  const list = useMemo(() => {
    const term = q.trim().toLowerCase()
    return LISTINGS.filter((l) =>
      (region === 'All' || l.region === region) &&
      l.price <= maxPrice * 1e6 &&
      (!onlySaved || saved.has(l.id)) &&
      (!term || `${l.name} ${l.location} ${l.tags.join(' ')}`.toLowerCase().includes(term)),
    ).sort(SORTS[sort])
  }, [region, maxPrice, sort, q, onlySaved, saved])

  // Reveal on first scroll into view, and re-run whenever the filtered list changes.
  useGSAP(() => {
    gsap.fromTo('[data-card]', { y: 50, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.8, stagger: 0.06, ease: 'expo.out',
      scrollTrigger: { trigger: grid.current, start: 'top 85%', once: true },
    })
  }, { dependencies: [list], scope: grid, revertOnUpdate: true })

  return (
    <section id="collection" className="relative z-20 bg-cream px-4 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-gold-deep">The Collection</p>
            <h2 className="mt-3 font-display text-5xl leading-none text-ink sm:text-7xl">
              Residences <span className="italic text-gold">beyond</span> compare
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-stone-600">
            {LISTINGS.length} off-market estates, each available to acquire outright or finance. Tap any home for the full gallery and financing.
          </p>
        </div>

        {/* filters */}
        <div className="mt-12 flex flex-col gap-4 rounded-3xl border border-stone-200 bg-white p-3 shadow-[0_10px_40px_-20px_rgba(28,25,23,0.18)] lg:flex-row lg:items-center lg:gap-3 lg:rounded-full">
          <label className="relative flex-1">
            <svg className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-stone-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search city, estate or feature"
              aria-label="Search listings"
              className="h-12 w-full rounded-full bg-stone-50 pl-13 pr-11 text-[15px] text-ink outline-none transition placeholder:text-stone-400 focus:bg-white focus:ring-4 focus:ring-gold/15 [&::-webkit-search-cancel-button]:hidden"
            />
            {q && (
              <button onClick={() => setQ('')} aria-label="Clear search" className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full bg-stone-200 text-xs text-stone-600 hover:bg-stone-300">✕</button>
            )}
          </label>
          <Segmented options={REGIONS.map((r) => [r, r])} value={region} onChange={setRegion} className="self-start lg:self-auto" />
          <div className="flex items-center gap-4 rounded-full px-3 lg:w-64">
            <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-stone-500">Max</span>
            <Range label="Maximum price" min={3} max={45} value={maxPrice} onChange={setMaxPrice} />
            <span className="w-14 shrink-0 rounded-full bg-stone-100 py-1 text-center text-xs font-medium text-ink">€{maxPrice}M</span>
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort listings" className="select lg:w-48">
            <option value="featured">Featured</option>
            <option value="price-desc">Price: high to low</option>
            <option value="price-asc">Price: low to high</option>
            <option value="area">Largest first</option>
          </select>
        </div>
        {onlySaved && (
          <button onClick={() => setOnlySaved(false)} className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-medium text-ink ring-1 ring-stone-200 hover:ring-gold">
            Showing saved only <span className="text-stone-400">·</span> <span className="text-gold-deep">Show all</span>
          </button>
        )}

        {/* grid */}
        <div ref={grid} className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((l) => (
            <article
              key={l.id}
              data-card
              onClick={() => onOpen(l)}
              className="group cursor-pointer overflow-hidden rounded-3xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] ring-1 ring-stone-200 transition duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-25px_rgba(28,25,23,0.3)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={l.photos[0]}
                  alt={`${l.name}, ${l.location}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-[1.2s] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/20" />
                <button
                  onClick={(e) => { e.stopPropagation(); toggleSave(l.id) }}
                  aria-label={saved.has(l.id) ? 'Remove from saved' : 'Save'}
                  className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-black/40 backdrop-blur-md transition hover:scale-110"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={saved.has(l.id) ? '#e9d8b4' : 'none'} stroke="#e9d8b4" strokeWidth="2">
                    <path d="M12 21s-7-4.35-9.5-8.5C.5 9 2.5 5 6.5 5c2 0 3.5 1 5.5 3 2-2 3.5-3 5.5-3 4 0 6 4 4 7.5C19 16.65 12 21 12 21z" />
                  </svg>
                </button>
                {l.id === 'castelldefels' && (
                  <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-950">Flagship</span>
                )}
                <span className="absolute bottom-[4.6rem] left-5 rounded-full bg-black/40 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-white/80 backdrop-blur-md">
                  {l.photos.length} photos
                </span>
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
                  <div className="min-w-0">
                    <h3 className="truncate font-display text-[1.7rem] leading-tight text-white">{l.name}</h3>
                    <p className="truncate text-[11px] uppercase tracking-[0.2em] text-white/70">{l.location}</p>
                  </div>
                  <p className="shrink-0 font-display text-2xl text-gold-soft">{fmtPrice(l.price)}</p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 px-5 py-4 text-xs text-stone-500">
                <div className="flex gap-4">
                  <span><b className="font-medium text-ink">{l.beds}</b> beds</span>
                  <span><b className="font-medium text-ink">{l.baths}</b> baths</span>
                  <span><b className="font-medium text-ink">{l.area.toLocaleString()}</b> m²</span>
                </div>
                <span className="truncate text-[10px] font-medium uppercase tracking-[0.15em] text-gold-deep">{l.tags[0]}</span>
              </div>
            </article>
          ))}
          {!list.length && (
            <p className="col-span-full py-20 text-center text-stone-500">No residences match. Try widening the price range.</p>
          )}
        </div>
      </div>
    </section>
  )
}
