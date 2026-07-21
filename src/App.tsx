import { useState } from 'react';
import { Header } from './components/Header';
import { Toc } from './components/Toc';
import { MathView } from './components/Math';
import { OneDExplorer } from './components/OneDExplorer';
import { TwoDGridMapper } from './components/TwoDGridMapper';
import { CounterexampleExplorer } from './components/CounterexampleExplorer';
import { AlpogeCounterexample } from './components/AlpogeCounterexample';
import { DegreeReductionSandbox } from './components/DegreeReductionSandbox';
import { ProofExplorer } from './components/ProofExplorer';
import { CustomPolynomialSandbox } from './components/CustomPolynomialSandbox';
import { Quiz } from './components/Quiz';
import { Footer } from './components/Footer';
import { Sparkles, ShieldCheck } from 'lucide-react';

export function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'light-theme bg-slate-50 text-slate-900'}`}>
      <Header theme={theme} setTheme={setTheme} />

      <main className="max-w-7xl mx-auto px-4 py-10 flex gap-10">
        {/* Sticky Table of Contents Sidebar */}
        <Toc />

        {/* Main Journal Article Content */}
        <article className="flex-1 max-w-4xl mx-auto space-y-12">
          {/* Article Header / Hero */}
          <header id="intro" className="space-y-6 pb-10 border-b border-slate-800/80">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-600 text-white uppercase tracking-wider shadow-lg flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Breakthrough Updated July 2026
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Published July 2026 • 15 min interactive read
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white font-serif leading-tight">
              The Mysterious Jacobian Conjecture:
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-300 to-cyan-300">
                From Keller's 1936 Problem to the 2026 AI Counterexample
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 font-serif italic leading-relaxed">
              If a polynomial function has a derivative that never vanishes, is it automatically 1-to-1 and globally invertible? In 1D calculus, the answer is trivially yes. For 90 years, mathematicians wondered if it holds in higher dimensions—until July 19, 2026, when an explicit 3D counterexample disproved it for <MathView math="n \ge 3" />!
            </p>

            <div className="flex items-center gap-4 pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold">
                  A
                </div>
                <span>By <strong>Antigravity Research Group</strong></span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5 text-cyan-400">
                <Sparkles className="w-3.5 h-3.5" /> Interactive Journal Edition
              </div>
            </div>
          </header>

          {/* Section 1: Introduction & The Core Intuition */}
          <section className="prose-journal text-slate-300">
            <h2 className="text-2xl md:text-3xl font-bold text-white font-serif mb-4 flex items-center gap-3">
              <span className="text-cyan-400 font-mono text-xl">1.</span> Introduction & The Core Question
            </h2>

            <p className="drop-cap">
              Imagine you are given a smooth mapping from space into itself. You want to know whether you can safely "undo" the mapping—that is, whether every target point comes from exactly one source point, without any overlapping folds, tearing, or crushing.
            </p>

            <p>
              In elementary calculus, your first tool is the <strong>derivative</strong>. If the derivative <MathView math="f'(x) \neq 0" /> everywhere, the function never turns around. It is strictly increasing or decreasing, so it is guaranteed to be 1-to-1 (injective) and invertible.
            </p>

            <div className="pull-quote">
              "Does local invertibility around every single point imply global 1-to-1 invertibility across the whole space?"
            </div>

            <p>
              For polynomial mappings over complex numbers <MathView math="\mathbb{C}^n" />, Ott-Heinrich Keller conjectured in 1936 that the answer is <strong>YES</strong>. For 90 years, mathematicians worked tirelessly to prove it—until July 2026!
            </p>
          </section>

          {/* Section 2: 1D Calculus Warmup */}
          <section id="one-d" className="prose-journal text-slate-300">
            <h2 className="text-2xl md:text-3xl font-bold text-white font-serif mb-4 flex items-center gap-3">
              <span className="text-cyan-400 font-mono text-xl">2.</span> The One-Dimensional Warm-Up
            </h2>

            <p>
              Why is dimension 1 so simple? Let <MathView math="f(x)" /> be a single-variable polynomial. Suppose its derivative <MathView math="f'(x) = c \neq 0" /> is a non-zero constant for all <MathView math="x" />.
            </p>

            <p>
              Integrating <MathView math="f'(x) = c" /> immediately gives <MathView math="f(x) = cx + d" />. This is a simple linear function, which has an obvious polynomial inverse <MathView math="f^{-1}(y) = \frac{y-d}{c}" />.
            </p>

            <p>
              What if <MathView math="f'(x)" /> were a non-constant polynomial? By the <strong>Fundamental Theorem of Algebra</strong>, any non-constant polynomial derivative over <MathView math="\mathbb{C}" /> MUST have at least one complex root where <MathView math="f'(z) = 0" />! Thus, it is impossible for a non-linear polynomial to have derivative non-zero everywhere.
            </p>

            {/* Interactive Widget 1 */}
            <OneDExplorer />
          </section>

          {/* Section 3: Higher Dimensions & Jacobian */}
          <section id="two-d" className="prose-journal text-slate-300">
            <h2 className="text-2xl md:text-3xl font-bold text-white font-serif mb-4 flex items-center gap-3">
              <span className="text-cyan-400 font-mono text-xl">3.</span> Higher Dimensions & The Jacobian Matrix
            </h2>

            <p>
              When we move from 1D to 2D space <MathView math="\mathbb{C}^2" />, a mapping <MathView math="F(x,y) = (f_1(x,y), \, f_2(x,y))" /> takes a point <MathView math="(x,y)" /> to a new point <MathView math="(u,v)" />.
            </p>

            <p>
              Instead of a single derivative number, the derivative of a multi-variable map is represented by the <strong>Jacobian Matrix</strong> of all partial derivatives:
            </p>

            <div className="my-6 p-4 rounded-xl bg-slate-900 border border-slate-800 text-center font-mono">
              <MathView
                math="J_F(x,y) = \begin{pmatrix} \frac{\partial f_1}{\partial x} & \frac{\partial f_1}{\partial y} \\[6pt] \frac{\partial f_2}{\partial x} & \frac{\partial f_2}{\partial y} \end{pmatrix}, \qquad \det J_F(x,y) = \frac{\partial f_1}{\partial x} \frac{\partial f_2}{\partial y} - \frac{\partial f_1}{\partial y} \frac{\partial f_2}{\partial x}"
                block
              />
            </div>

            <p>
              The <strong>Inverse Function Theorem</strong> guarantees that if <MathView math="\det J_F(x_0, y_0) \neq 0" />, then <MathView math="F" /> is locally invertible in a tiny neighborhood around <MathView math="(x_0, y_0)" />. Geometrically, the determinant <MathView math="\det J_F" /> tells us how infinitesimal areas expand or shrink under the mapping!
            </p>

            {/* Interactive Widget 2 */}
            <div id="visualizer">
              <TwoDGridMapper />
            </div>
          </section>

          {/* Section 4: Formulation of Conjecture */}
          <section id="conjecture" className="prose-journal text-slate-300">
            <h2 className="text-2xl md:text-3xl font-bold text-white font-serif mb-4 flex items-center gap-3">
              <span className="text-cyan-400 font-mono text-xl">4.</span> Formal Statement of the Jacobian Conjecture
            </h2>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-cyan-950/40 border border-cyan-500/40 shadow-xl my-6">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2">
                <ShieldCheck className="w-4 h-4" /> The Jacobian Conjecture (JC_n) — Ott-Heinrich Keller (1936)
              </div>

              <div className="text-slate-100 font-serif text-base leading-relaxed mb-4">
                Let <MathView math="F = (f_1, \dots, f_n): \mathbb{C}^n \to \mathbb{C}^n" /> be a polynomial mapping (i.e. each <MathView math="f_i \in \mathbb{C}[x_1, \dots, x_n]" />). If the Jacobian determinant is a non-zero constant:
                <MathView math="\det J_F(x_1, \dots, x_n) = c \in \mathbb{C}^\times \quad \text{for all } (x_1, \dots, x_n) \in \mathbb{C}^n" block />
                then <MathView math="F" /> has an inverse mapping <MathView math="G = (g_1, \dots, g_n): \mathbb{C}^n \to \mathbb{C}^n" /> which is also a <strong>polynomial mapping</strong>.
              </div>
            </div>

            <p>
              Notice how clean this formulation is! It requires only two assumptions:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4 mb-4">
              <li><MathView math="F" /> is composed of <strong>polynomials</strong>.</li>
              <li>The Jacobian determinant is a <strong>non-zero constant</strong>.</li>
            </ul>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-1">The Ax-Grothendieck Shortcut:</strong>
                By the famous Ax-Grothendieck Theorem, any 1-to-1 (injective) polynomial mapping from <MathView math="\mathbb{C}^n" /> to <MathView math="\mathbb{C}^n" /> is <em>automatically</em> a polynomial automorphism! Therefore, proving the Jacobian conjecture boils down strictly to proving that <MathView math="\det J_F = c \neq 0 \implies F \text{ is injective}" />.
              </div>
            </div>
          </section>

          {/* Section 5: The 2026 Alpöge 3D Counterexample (NEW!) */}
          <section id="alpoge" className="prose-journal text-slate-300">
            <h2 className="text-2xl md:text-3xl font-bold text-white font-serif mb-4 flex items-center gap-3">
              <span className="text-rose-400 font-mono text-xl">5.</span> The 2026 Alpöge Counterexample (<MathView math="\mathbb{C}^3" />)
            </h2>

            <p>
              For nearly 90 years, mathematicians suspected the conjecture held in all dimensions. However, on <strong>July 19, 2026</strong>, Levent Alpöge presented an explicit counterexample in 3D space, discovered with assistance from the <em>Claude Fable 5</em> AI model!
            </p>

            {/* Alpöge Interactive Widget */}
            <AlpogeCounterexample />
          </section>

          {/* Section 6: The Pitfalls & Real Counterexamples */}
          <section id="pitfalls" className="prose-journal text-slate-300">
            <h2 className="text-2xl md:text-3xl font-bold text-white font-serif mb-4 flex items-center gap-3">
              <span className="text-cyan-400 font-mono text-xl">6.</span> Real & Transcendental Traps
            </h2>

            <p>
              Even before Alpöge's 2026 breakthrough over <MathView math="\mathbb{C}^3" />, mathematicians had discovered that dropping any single hypothesis creates immediate counterexamples!
            </p>

            <p>
              If you drop the condition that <MathView math="F" /> is polynomial and allow smooth transcendental functions like <MathView math="e^x" />, non-injective counterexamples appear immediately.
            </p>

            <p>
              Even more surprisingly, if you work over the <strong>real numbers <MathView math="\mathbb{R}^2" /></strong> instead of complex numbers <MathView math="\mathbb{C}^2" />, Sergey Pinchuk constructed a famous degree 25 real polynomial counterexample in 1994!
            </p>

            {/* Interactive Widget 3 */}
            <CounterexampleExplorer />
          </section>

          {/* Section 7: Degree Reduction */}
          <section id="reductions" className="prose-journal text-slate-300">
            <h2 className="text-2xl md:text-3xl font-bold text-white font-serif mb-4 flex items-center gap-3">
              <span className="text-cyan-400 font-mono text-xl">7.</span> Degree Reduction & Nilpotent Maps
            </h2>

            <p>
              In 1980 and 1982, Yagzhev and Bass-Connell-Wright proved a astonishing reduction theorem: you do not need to study polynomials of arbitrary high degrees!
            </p>

            <p>
              Through clever introduction of auxiliary variables, any polynomial map can be reduced to a mapping of <strong>degree at most 3</strong> of the form:
            </p>

            <div className="my-4 p-4 rounded-xl bg-slate-900 border border-slate-800 text-center font-mono">
              <MathView math="F(X) = X - H(X)" block />
            </div>

            <p>
              where <MathView math="H(X)" /> is a <strong>cubic homogeneous polynomial map</strong> whose Jacobian matrix <MathView math="J_H(X)" /> is <strong>nilpotent</strong> (<MathView math="J_H(X)^n = 0" />).
            </p>

            {/* Interactive Widget 4 */}
            <DegreeReductionSandbox />
          </section>

          {/* Section 8: Step by Step Proof Explorer */}
          <section id="proofs" className="prose-journal text-slate-300">
            <h2 className="text-2xl md:text-3xl font-bold text-white font-serif mb-4 flex items-center gap-3">
              <span className="text-cyan-400 font-mono text-xl">8.</span> Step-by-Step Proof & Reduction Explorer
            </h2>

            <p>
              What cases have been successfully proven so far? Explore the mathematical steps for 1D maps, Stuart Wang's 1980 proof for quadratic maps in 2D, and the Ax-Grothendieck injectivity equivalence!
            </p>

            {/* Interactive Widget 5 */}
            <ProofExplorer />
          </section>

          {/* Section 9: Custom Polynomial Determinant Sandbox */}
          <section id="sandbox" className="prose-journal text-slate-300">
            <h2 className="text-2xl md:text-3xl font-bold text-white font-serif mb-4 flex items-center gap-3">
              <span className="text-cyan-400 font-mono text-xl">9.</span> Custom Determinant Sandbox
            </h2>

            <p>
              Test your own 2D polynomial mappings or inspect standard examples! Watch how the local area element scales and check if the Jacobian determinant remains constant.
            </p>

            {/* Interactive Widget 6 */}
            <CustomPolynomialSandbox />
          </section>

          {/* Section 10: Quiz */}
          <section id="quiz" className="prose-journal text-slate-300">
            <h2 className="text-2xl md:text-3xl font-bold text-white font-serif mb-4 flex items-center gap-3">
              <span className="text-cyan-400 font-mono text-xl">10.</span> Test Your Intuition
            </h2>

            <p>
              Put your understanding of the Jacobian Conjecture to the test with our interactive 5-question quiz!
            </p>

            {/* Interactive Widget 7 */}
            <Quiz />
          </section>

          {/* Section 11: References & Footer */}
          <Footer />
        </article>
      </main>
    </div>
  );
}
export default App;
