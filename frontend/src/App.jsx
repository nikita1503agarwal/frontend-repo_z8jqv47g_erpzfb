import { useEffect, useRef, useState } from "react";

const SplineHero = () => {
  return (
    <div className="relative h-[90vh] w-full overflow-hidden bg-black">
      <spline-viewer url="https://prod.spline.design/EF7JOSsHLk16Tlw9/scene.splinecode" class="absolute inset-0 w-full h-full"></spline-viewer>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black"></div>
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="max-w-3xl px-6 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white drop-shadow-lg">
            AI Guardian
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-white/80">
            Plagiarism & Fake News detection powered by real-time web intelligence.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <a href="#try" className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-medium text-white backdrop-blur transition hover:bg-white/20">
              Try the demo
            </a>
            <a href="#features" className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-indigo-500/90 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400">
              Explore features
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const useParallax = (speed = 0.3) => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const offset = rect.top * speed;
      el.style.transform = `translateY(${offset}px)`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [speed]);
  return ref;
};

const ParallaxLayer = ({ speed = 0.2, className = "", children }) => {
  const ref = useParallax(speed);
  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
};

const FeatureCard = ({ title, description, accent = "indigo" }) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur transition hover:border-white/20">
      <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-${accent}-500/20 blur-2xl`} />
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-white/70">{description}</p>
      <div className="mt-4 inline-flex items-center text-sm font-semibold text-white/90">
        Learn more →
      </div>
    </div>
  );
};

const Analyzer = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const submit = async () => {
    setLoading(true);
    setError("");
    try {
      const base = import.meta.env.VITE_BACKEND_URL || "";
      const res = await fetch(`${base}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("Failed to analyze");
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="try" className="relative mx-auto max-w-5xl px-6">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(1200px_circle_at_50%_-20%,rgba(99,102,241,0.25),transparent_60%)]" />
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Try it now</h2>
        <p className="mt-2 text-white/70">Paste some text and we will compare it with fresh headlines to estimate plagiarism and misinformation risk.</p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type your text here..."
          className="mt-4 w-full rounded-xl bg-black/40 p-4 text-white placeholder-white/40 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-indigo-500"
          rows={6}
        />
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={submit}
            disabled={loading || !text.trim()}
            className="inline-flex items-center rounded-full bg-indigo-500 px-5 py-2.5 text-white font-semibold shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400 disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
          {error && <span className="text-red-400">{error}</span>}
        </div>
        {result && (
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-sm text-white/60">Plagiarism</div>
              <div className="mt-1 text-2xl font-bold text-white">{Math.round(result.plagiarism_score * 100)}%</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-sm text-white/60">Fake News Risk</div>
              <div className="mt-1 text-2xl font-bold text-white">{Math.round(result.fake_news_score * 100)}%</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-sm text-white/60">Verdict</div>
              <div className="mt-1 text-xl font-semibold text-white">{result.verdict}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="min-h-screen w-full bg-black text-white">
      <link rel="preconnect" href="https://prod.spline.design" />
      <script type="module" defer src="https://cdn.jsdelivr.net/npm/@splinetool/viewer@1.9.41/build/spline-viewer.js"></script>

      <SplineHero />

      <section id="features" className="relative mx-auto max-w-6xl px-6 py-24">
        <ParallaxLayer speed={0.15} className="">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">Designed for truth.</h2>
        </ParallaxLayer>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ParallaxLayer speed={0.25}>
            <FeatureCard title="AI Plagiarism Detection" description="Compare your content against the latest headlines and summaries across the web." />
          </ParallaxLayer>
          <ParallaxLayer speed={0.35}>
            <FeatureCard title="AI Fake News Detection" description="Signal-driven models estimate misinformation risk based on topical consensus." accent="purple" />
          </ParallaxLayer>
          <ParallaxLayer speed={0.45}>
            <FeatureCard title="Live Web Intelligence" description="Fetches fresh articles from global publishers to ground judgments in reality." accent="emerald" />
          </ParallaxLayer>
        </div>
      </section>

      <section className="relative py-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(1000px_circle_at_20%_10%,rgba(168,85,247,0.3),transparent_60%)]" />
        <ParallaxLayer speed={0.2}>
          <Analyzer />
        </ParallaxLayer>
      </section>

      <footer className="border-t border-white/10 py-10 text-center text-white/60">
        © {new Date().getFullYear()} AI Guardian — Built for a more trustworthy web.
      </footer>
    </div>
  );
}

export default App;
