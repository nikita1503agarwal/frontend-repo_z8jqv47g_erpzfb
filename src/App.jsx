import { useEffect, useRef, useState } from 'react'
import Spline from '@splinetool/react-spline'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ShieldCheck, Newspaper, Sparkles, Activity, ArrowRight, History, Link, Github } from 'lucide-react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="glass rounded-xl p-4 sm:p-6 flex items-center gap-4 hover:scale-[1.02] transition-transform">
      <div className="p-3 rounded-lg bg-white/5 text-cyan-300">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-white/60">{label}</p>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </div>
  )
}

function Feature({ title, desc, icon: Icon, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="glass rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start gap-4"
    >
      <div className="p-3 rounded-xl bg-white/5 text-purple-300">
        <Icon className="w-7 h-7" />
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-1">{title}</h3>
        <p className="text-white/70">{desc}</p>
      </div>
    </motion.div>
  )
}

function HeroParallax() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] })
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -120])
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -60])

  return (
    <section ref={containerRef} className="section relative overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/EF7JOSsHLk16Tlw9/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60 pointer-events-none" />

      <div className="relative z-10 h-screen flex items-center">
        <div className="container mx-auto px-6 sm:px-10">
          <motion.h1 style={{ y: y1 }} className="text-4xl sm:text-6xl md:text-7xl font-extrabold leading-tight">
            <span className="gradient-text">AI Integrity</span> Suite
          </motion.h1>
          <motion.p style={{ y: y2 }} className="mt-4 max-w-2xl text-white/80 text-lg">
            Plagiarism detection and fake news analysis that syncs with the latest headlines in real-time.
          </motion.p>
          <motion.div style={{ y: y3 }} className="mt-8 flex flex-col sm:flex-row gap-3">
            <a href="#analyze" className="px-5 py-3 rounded-xl bg-white text-black font-medium hover:opacity-90 inline-flex items-center gap-2">
              Try the Analyzer <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#features" className="px-5 py-3 rounded-xl bg-white/10 border border-white/10 font-medium hover:bg-white/15">
              Explore Features
            </a>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10 max-w-3xl">
            <StatCard icon={Activity} label="Realtime feeds" value="30+" />
            <StatCard icon={ShieldCheck} label="Detections" value="10k+" />
            <StatCard icon={Sparkles} label="Models" value="Hybrid" />
            <StatCard icon={Newspaper} label="Sources" value="Global" />
          </div>
        </div>
      </div>
    </section>
  )
}

function Analyze() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const submit = async () => {
    setLoading(true); setError(''); setResult(null)
    try {
      const res = await fetch(`${API_BASE}/analyze`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      const data = await res.json()
      setResult(data)
    } catch (e) { setError(e.message) } finally { setLoading(false) }
  }

  return (
    <section id="analyze" className="section flex items-center">
      <div className="container mx-auto px-6 sm:px-10 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold">Analyze your text</h2>
          <p className="text-white/70 mt-2">Paste or type content. We’ll compare against fresh headlines to estimate originality and credibility.</p>
          <div className="mt-6 glass rounded-2xl p-4">
            <textarea value={text} onChange={e=>setText(e.target.value)} rows={8} placeholder="Paste content here..." className="w-full bg-transparent outline-none resize-none placeholder:text-white/40" />
            <div className="flex items-center justify-between mt-3">
              <button onClick={submit} disabled={loading || !text.trim()} className="px-5 py-2 rounded-xl bg-white text-black font-medium disabled:opacity-50">
                {loading ? 'Analyzing…' : 'Run analysis'}
              </button>
              <span className="text-white/50 text-sm">Realtime news comparison</span>
            </div>
          </div>
          {error && <p className="text-red-400 mt-3">{error}</p>}
        </div>
        <div>
          <div className="glass rounded-2xl p-6">
            {!result ? (
              <div className="text-white/60">Results will appear here. Try a provocative claim.</div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="text-green-400" />
                  <p className="text-white/80"><span className="font-semibold">Verdict:</span> {result.verdict}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="glass p-3 rounded-lg">
                    <p className="text-sm text-white/60">Plagiarism</p>
                    <p className="text-2xl font-semibold">{Math.round(result.plagiarism_score*100)}%</p>
                  </div>
                  <div className="glass p-3 rounded-lg">
                    <p className="text-sm text-white/60">Fake news risk</p>
                    <p className="text-2xl font-semibold">{Math.round(result.fake_news_score*100)}%</p>
                  </div>
                </div>
                <p className="text-white/60 text-sm">Checked at {new Date(result.checked_at).toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function Features() {
  const feats = [
    { title: 'AI Plagiarism Detection', desc: 'Shingle matching across aggregated news feeds and web sources, with smart thresholds.', icon: ShieldCheck },
    { title: 'AI Fake News Detection', desc: 'Heuristics aligned with mainstream headlines to flag potentially misleading claims.', icon: Newspaper },
    { title: 'Realtime Feeds', desc: 'Continuously refreshes sources to reflect what the world is talking about.', icon: Activity },
    { title: 'Delightful UX', desc: 'Parallax, motion, and glass morphism keep users engaged while they explore.', icon: Sparkles },
  ]
  return (
    <section id="features" className="section py-20">
      <div className="container mx-auto px-6 sm:px-10">
        <h2 className="text-3xl sm:text-4xl font-bold mb-8">Features that keep you curious</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {feats.map((f, i) => (<Feature key={f.title} {...f} index={i} />))}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="py-10 text-center text-white/50">
      <p>Built for makers who care about truth and originality.</p>
      <div className="mt-3 flex items-center justify-center gap-4">
        <a href="#" className="hover:text-white">Docs</a>
        <a href="#" className="hover:text-white">Pricing</a>
        <a href="#" className="hover:text-white">Contact</a>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <div className="scroll-snap-y">
      <HeroParallax />
      <Analyze />
      <Features />
      <Footer />
    </div>
  )
}
