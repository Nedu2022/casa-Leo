import { useState } from 'react'
import { LISTINGS } from '../data/listings'
import { Field, Segmented } from './Form'

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [kind, setKind] = useState('in-person')
  return (
    <section id="contact" className="relative z-20 bg-white px-4 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-gold-deep">Private Viewing</p>
          <h2 className="mt-3 font-display text-5xl leading-none text-ink sm:text-6xl">
            Walk it in <span className="italic text-gold">person</span>.
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-stone-600">
            Viewings are by appointment only. We arrange helicopter transfers from Barcelona El Prat and a discreet walkthrough with the architect.
          </p>
          <div className="mt-10 grid max-w-md grid-cols-2 gap-6 text-sm">
            <div><div className="text-[10px] uppercase tracking-[0.25em] text-stone-500">Barcelona</div><div className="mt-1 text-ink">Passeig de Gràcia</div></div>
            <div><div className="text-[10px] uppercase tracking-[0.25em] text-stone-500">Hours</div><div className="mt-1 text-ink">By appointment</div></div>
          </div>
        </div>
        {sent ? (
          <div className="grid place-items-center rounded-3xl border border-gold/30 bg-cream p-10 text-center">
            <div>
              <div className="font-display text-4xl text-ink">Thank you.</div>
              <p className="mt-3 text-sm text-stone-600">A member of our private office will be in touch shortly.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true) }} className="grid gap-3 rounded-3xl border border-stone-200 bg-cream p-5 sm:grid-cols-2 sm:p-8">
            <Field label="Full name" required autoComplete="name" />
            <Field label="Email" type="email" required autoComplete="email" />
            <Field label="Phone" type="tel" autoComplete="tel" />
            <Field label="Residence" as="select" defaultValue="castelldefels">
              {LISTINGS.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
            </Field>
            <Field label="Preferred date" type="date" />
            <div className="flex flex-col justify-center gap-2 rounded-[14px] border border-stone-200 bg-white px-4 py-2.5">
              <span className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-gold-deep">Viewing type</span>
              <Segmented options={[['in-person', 'In person'], ['video', 'Video tour']]} value={kind} onChange={setKind} className="self-start" />
            </div>
            <Field label="Anything we should prepare?" as="textarea" rows={4} className="sm:col-span-2" />
            <button className="group mt-2 flex h-14 items-center justify-center gap-2 rounded-full bg-ink text-sm font-medium text-white transition hover:bg-gold sm:col-span-2">
              Request viewing
              <span className="transition group-hover:translate-x-1">→</span>
            </button>
          </form>
        )}
      </div>
      <footer className="mx-auto mt-24 flex max-w-7xl flex-col justify-between gap-4 border-t border-stone-200 pt-8 text-xs text-stone-500 sm:flex-row">
        <span className="font-display text-xl text-ink">Casa <span className="italic text-gold">Leo</span> Estates</span>
        <span>A concept project. Listings and prices are fictional; photographs are public domain or credited.</span>
      </footer>
    </section>
  )
}
