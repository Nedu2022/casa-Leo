import { useCallback, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { useGSAP } from '@gsap/react'
import { Hero, VillaStory } from './components/Villa'
import Marketplace from './components/Marketplace'
import PropertyModal from './components/PropertyModal'
import Contact from './components/Contact'
import { Loader, Navbar } from './components/Chrome'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, useGSAP)

export default function App() {
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(() => new Set())
  const [owned, setOwned] = useState(() => new Set())
  const [open, setOpen] = useState(null)
  const [onlySaved, setOnlySaved] = useState(false)

  const nav = useCallback((id) => {
    const target = id === 'top' ? 0 : `#${id}`
    gsap.to(window, { scrollTo: { y: target, offsetY: id === 'top' ? 0 : 70 }, duration: 1.4, ease: 'power3.inOut' })
  }, [])

  const toggleSave = useCallback((id) => setSaved((s) => {
    const n = new Set(s)
    n.has(id) ? n.delete(id) : n.add(id)
    return n
  }), [])

  return (
    <>
      {loading && <Loader onDone={() => setLoading(false)} />}
      <Navbar saved={saved.size} onNav={nav} onSaved={() => { setOnlySaved(true); nav('collection') }} />

      <Hero ready={!loading} onTour={() => nav('villa')} onBook={() => nav('contact')} />
      <VillaStory onBook={() => nav('contact')} onBrowse={() => nav('collection')} />

      <Marketplace
        saved={saved}
        toggleSave={toggleSave}
        onOpen={setOpen}
        onlySaved={onlySaved}
        setOnlySaved={setOnlySaved}
      />
      <Contact />

      {open && (
        <PropertyModal
          key={open.id}
          listing={open}
          onClose={() => setOpen(null)}
          saved={saved}
          toggleSave={toggleSave}
          owned={owned}
          onPurchased={(id) => setOwned((s) => new Set(s).add(id))}
        />
      )}
    </>
  )
}
