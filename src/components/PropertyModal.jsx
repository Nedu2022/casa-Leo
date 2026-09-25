import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { fmtPrice } from '../data/listings'
import { Field, Range } from './Form'

function monthly(principal, ratePct, years) {
  const r = ratePct / 100 / 12
  const n = years * 12
  return r === 0 ? principal / n : (principal * r) / (1 - Math.pow(1 + r, -n))
}

function Gallery({ listing }) {
  const [i, setI] = useState(0)
  const n = listing.photos.length
  const go = (d) => setI((v) => (v + d + n) % n)
  return (
    <div className="relative flex h-[42vh] flex-col bg-stone-100 lg:h-auto lg:min-h-[640px]">
      <div className="relative min-h-0 flex-1 overflow-hidden">
        {listing.photos.map((src, k) => (
          <img
            key={src}
            src={src}
            alt={`${listing.name}, photo ${k + 1} of ${n}`}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${k === i ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
        {n > 1 && ['‹', '›'].map((c, d) => (
          <button
            key={c}
            onClick={() => go(d ? 1 : -1)}
            aria-label={d ? 'Next photo' : 'Previous photo'}
            className={`absolute top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-2xl text-white backdrop-blur-md transition hover:bg-black/60 ${d ? 'right-4' : 'left-4'}`}
          >
            {c}
          </button>
        ))}
        <span className="absolute bottom-4 right-4 rounded-full bg-black/50 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-white/80 backdrop-blur-md">{i + 1} / {n}</span>
      </div>
      {n > 1 && (
        <div className="flex gap-2 p-3">
          {listing.photos.map((src, k) => (
            <button key={src} onClick={() => setI(k)} className={`h-16 flex-1 overflow-hidden rounded-lg ring-2 transition ${k === i ? 'ring-gold' : 'opacity-70 ring-transparent hover:opacity-100'}`}>
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
      {listing.credits && (
        <p className="px-4 pb-3 text-[10px] text-stone-500">Photos: {listing.credits.join(' · ')}</p>
      )}
    </div>
  )
}

export default function PropertyModal({ listing, onClose, saved, toggleSave, onPurchased, owned }) {
  const root = useRef(null)
  const [tab, setTab] = useState('overview')
  const [deposit, setDeposit] = useState(30)
  const [rate, setRate] = useState(3.9)
  const [years, setYears] = useState(25)
  const [step, setStep] = useState(0)
  const [offer, setOffer] = useState({ kind: 'full', amount: listing.price, name: '', email: '', funds: false })
  const [ref] = useState(() => 'CL-' + Math.random().toString(36).slice(2, 8).toUpperCase())

  useGSAP(() => {
    gsap.from('[data-m="bg"]', { opacity: 0, duration: 0.4 })
    gsap.from('[data-m="card"]', { y: 80, opacity: 0, scale: 0.97, duration: 0.8, ease: 'expo.out' })
  }, { scope: root })

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose])

  const loan = listing.price * (1 - deposit / 100)
  const pay = monthly(loan, rate, years)
  const canSubmit = offer.name.trim() && /\S+@\S+\.\S+/.test(offer.email) && offer.funds && offer.amount > 0
  const isOwned = owned.has(listing.id)

  return (
    <div ref={root} className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <div data-m="bg" onClick={onClose} className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm" />
      <div data-m="card" className="relative grid max-h-[94vh] w-full max-w-6xl overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl lg:grid-cols-[1.25fr_1fr]">
        {/* photo gallery */}
        <Gallery listing={listing} />

        {/* details */}
        <div className="flex max-h-[56vh] flex-col overflow-y-auto p-6 sm:p-8 lg:max-h-[94vh]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-gold-deep">{listing.location}</p>
              <h3 className="mt-2 font-display text-4xl leading-tight text-ink">{listing.name}</h3>
            </div>
            <button onClick={onClose} aria-label="Close" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-stone-200 text-stone-500 hover:bg-stone-100">✕</button>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <span className="font-display text-4xl text-ink">{fmtPrice(listing.price)}</span>
            <button onClick={() => toggleSave(listing.id)} className="rounded-full border border-stone-200 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-stone-600 hover:border-gold">
              {saved.has(listing.id) ? '♥ Saved' : '♡ Save'}
            </button>
          </div>

          <div className="mt-6 flex gap-1 rounded-full bg-stone-100 p-1 text-xs uppercase tracking-[0.15em]">
            {['overview', 'finance', 'purchase'].map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`flex-1 rounded-full py-2.5 capitalize transition ${tab === t ? 'bg-white text-ink shadow-sm' : 'text-stone-500 hover:text-ink'}`}>
                {t}
              </button>
            ))}
          </div>

          {tab === 'overview' && (
            <div className="mt-6">
              <p className="text-sm leading-relaxed text-stone-600">{listing.blurb}</p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {[['Bedrooms', listing.beds], ['Bathrooms', listing.baths], ['Interior', `${listing.area.toLocaleString()} m²`], ['Plot', `${listing.plot.toLocaleString()} m²`]].map(([k, v]) => (
                  <div key={k} className="rounded-xl border border-stone-200 p-4">
                    <div className="text-[10px] uppercase tracking-[0.25em] text-stone-500">{k}</div>
                    <div className="mt-1 font-display text-2xl text-ink">{v}</div>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {listing.tags.map((t) => (
                  <span key={t} className="rounded-full bg-cream px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-gold-deep">{t}</span>
                ))}
              </div>
              <button onClick={() => setTab('purchase')} className="mt-8 w-full rounded-full bg-ink py-4 text-sm font-medium text-white transition hover:bg-gold">
                {isOwned ? 'Reserved by you' : 'Acquire this residence'}
              </button>
            </div>
          )}

          {tab === 'finance' && (
            <div className="mt-6 space-y-5">
              {[
                ['Deposit', deposit, setDeposit, 10, 80, 1, `${deposit}% · ${fmtPrice(listing.price * deposit / 100)}`],
                ['Interest rate', rate, setRate, 1, 8, 0.1, `${rate.toFixed(1)}%`],
                ['Term', years, setYears, 5, 35, 1, `${years} years`],
              ].map(([label, val, set, min, max, stepv, shown]) => (
                <div key={label}>
                  <div className="flex justify-between text-xs"><span className="uppercase tracking-[0.2em] text-stone-500">{label}</span><span className="text-ink">{shown}</span></div>
                  <div className="mt-3"><Range label={label} min={min} max={max} step={stepv} value={val} onChange={set} /></div>
                </div>
              ))}
              <div className="rounded-2xl bg-cream p-6 text-center">
                <div className="text-[10px] uppercase tracking-[0.3em] text-stone-500">Estimated monthly</div>
                <div className="mt-2 font-display text-5xl text-ink">€ {Math.round(pay).toLocaleString()}</div>
                <div className="mt-2 text-xs text-stone-500">Loan of {fmtPrice(loan)} · illustrative only</div>
              </div>
            </div>
          )}

          {tab === 'purchase' && (
            <div className="mt-6">
              {isOwned || step === 2 ? (
                <div className="py-8 text-center">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold text-2xl text-white">✓</div>
                  <h4 className="mt-5 font-display text-3xl text-ink">Reservation received</h4>
                  <p className="mx-auto mt-3 max-w-xs text-sm text-stone-600">
                    Your private concierge will contact you within 24 hours to arrange due diligence and a viewing.
                  </p>
                  <p className="mt-4 text-xs uppercase tracking-[0.3em] text-gold-deep">Ref {ref}</p>
                </div>
              ) : (
                <>
                  <div className="mb-6 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em]">
                    {['Offer', 'Buyer'].map((s, i) => (
                      <span key={s} className={`flex items-center gap-2 ${i <= step ? 'text-gold-deep' : 'text-stone-400'}`}>
                        <span className={`grid h-6 w-6 place-items-center rounded-full border ${i <= step ? 'border-gold' : 'border-stone-300'}`}>{i + 1}</span>
                        {s}{i === 0 && <span className="mx-2 h-px w-8 bg-stone-300" />}
                      </span>
                    ))}
                  </div>
                  {step === 0 && (
                    <div className="space-y-3">
                      {[['full', 'Buy at asking price', fmtPrice(listing.price)], ['offer', 'Make an offer', 'Negotiate privately']].map(([k, t, sub]) => (
                        <button key={k} onClick={() => setOffer({ ...offer, kind: k, amount: k === 'full' ? listing.price : offer.amount })}
                          className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${offer.kind === k ? 'border-gold bg-cream' : 'border-stone-200 hover:border-stone-400'}`}>
                          <span className="text-sm text-ink">{t}</span>
                          <span className="text-xs text-stone-500">{sub}</span>
                        </button>
                      ))}
                      {offer.kind === 'offer' && (
                        <Field label="Your offer (€)" type="number" inputMode="numeric" value={offer.amount} onChange={(e) => setOffer({ ...offer, amount: +e.target.value })} />
                      )}
                      <button onClick={() => setStep(1)} className="mt-3 w-full rounded-full bg-ink py-4 text-sm font-medium text-white hover:bg-gold">Continue</button>
                    </div>
                  )}
                  {step === 1 && (
                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); if (canSubmit) { setStep(2); onPurchased(listing.id) } }}>
                      <Field label="Full name" autoComplete="name" value={offer.name} onChange={(e) => setOffer({ ...offer, name: e.target.value })} />
                      <Field label="Email" type="email" autoComplete="email" value={offer.email} onChange={(e) => setOffer({ ...offer, email: e.target.value })} />
                      <label className="flex cursor-pointer items-center gap-3 rounded-[14px] border border-stone-200 p-4 text-xs leading-relaxed text-stone-600 transition hover:border-stone-300">
                        <input type="checkbox" checked={offer.funds} onChange={(e) => setOffer({ ...offer, funds: e.target.checked })} className="check" />
                        I can provide proof of funds for {fmtPrice(offer.amount)} on request.
                      </label>
                      <div className="flex gap-3">
                        <button type="button" onClick={() => setStep(0)} className="rounded-full border border-stone-200 px-6 py-4 text-sm text-stone-600">Back</button>
                        <button disabled={!canSubmit} className="flex-1 rounded-full bg-ink py-4 text-sm font-medium text-white transition hover:bg-gold disabled:cursor-not-allowed disabled:opacity-40">
                          Reserve {offer.kind === 'full' ? 'at asking' : 'with offer'}
                        </button>
                      </div>
                    </form>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
