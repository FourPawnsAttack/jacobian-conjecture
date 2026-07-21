import React, { useState } from 'react';
import { MathView } from './Math';
import { ShieldAlert, AlertOctagon, X } from 'lucide-react';

export const CounterexampleExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'exponential' | 'pinchuk'>('exponential');
  const [kPeriod, setKPeriod] = useState<number>(1);

  return (
    <div className="widget-card my-10 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-semibold tracking-wider text-rose-400 uppercase">Interactive Figure 3</span>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            The Trap of Assumptions: Real & Non-Polynomial Pitfalls
          </h3>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('exponential')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'exponential'
                ? 'bg-slate-800 text-rose-300 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Non-Algebraic Trap: (e^x, y e^-x)
          </button>
          <button
            onClick={() => setActiveTab('pinchuk')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'pinchuk'
                ? 'bg-slate-800 text-amber-300 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            2. Real Counterexample: Pinchuk (1994)
          </button>
        </div>
      </div>

      {activeTab === 'exponential' ? (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-1">
              <div className="text-xs font-semibold text-rose-400 mb-1">Holomorphic Non-Algebraic Map</div>
              <h4 className="text-lg font-bold text-white mb-2">
                <MathView math="F(x,y) = (e^x, \\, y e^{-x})" />
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Consider the smooth complex map <MathView math="F: \mathbb{C}^2 \to \mathbb{C}^2" />. Its Jacobian matrix is:
              </p>
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs font-mono text-center mb-3">
                <MathView math="J_F(x,y) = \begin{pmatrix} e^x & 0 \\ -y e^{-x} & e^{-x} \end{pmatrix} \implies \det J_F = e^x \cdot e^{-x} = 1 \neq 0" />
              </div>
              <div className="text-xs text-slate-400">
                The determinant is <strong>everywhere equal to 1</strong>! Yet, is this map 1-to-1 injective?
              </div>
            </div>

            <div className="w-full md:w-80 bg-rose-950/20 border border-rose-900/50 p-4 rounded-xl text-xs space-y-3">
              <div className="flex items-center gap-2 text-rose-400 font-semibold">
                <AlertOctagon className="w-4 h-4" /> Periodicity Test (Complex Planes)
              </div>
              <p className="text-slate-300 text-[11px]">
                Because <MathView math="e^{x + 2\pi i k} = e^x" /> for any integer <MathView math="k" />, adding multiples of <MathView math="2\pi i" /> to <MathView math="x" /> yields identical output image points!
              </p>

              <div className="space-y-2 pt-2 border-t border-rose-900/40">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Shift multiplier <MathView math="k" />:</span>
                  <span className="font-mono text-rose-300">{kPeriod}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="4"
                  step="1"
                  value={kPeriod}
                  onChange={(e) => setKPeriod(parseInt(e.target.value))}
                  className="w-full accent-rose-500 bg-slate-900"
                />
              </div>

              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] space-y-1">
                <div className="text-slate-400">Point 1: <MathView math={`P_1 = (0, 1)`} /></div>
                <div className="text-slate-400">Point 2: <MathView math={`P_2 = (0 + ${2 * kPeriod}\\pi i, 1)`} /></div>
                <div className="text-rose-400 font-bold border-t border-slate-800 pt-1 mt-1">
                  <MathView math={`F(P_1) = F(P_2) = (1, 1)`} />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs leading-relaxed text-slate-300">
            <strong className="text-white block mb-1">Key Takeaway for Jacobian Conjecture:</strong>
            The map <MathView math="F(x,y) = (e^x, y e^{-x})" /> is <strong>not polynomial</strong> because the exponential function <MathView math="e^x" /> is transcendental! The Jacobian Conjecture specifically requires that <MathView math="f_1, \dots, f_n" /> be <em>polynomials</em>. Without polynomial rigidity, transcendental functions can wrap endlessly around the complex plane.
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-1">
              <div className="text-xs font-semibold text-amber-400 mb-1">Real Smooth Counterexample</div>
              <h4 className="text-lg font-bold text-white mb-2">
                Sergey Pinchuk's Counterexample (1994)
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                In 1994, Sergey Pinchuk answered a long-standing question by constructing a polynomial mapping <MathView math="F = (P, Q): \mathbb{R}^2 \to \mathbb{R}^2" /> of degree 25 such that:
              </p>
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs font-mono text-center mb-3">
                <MathView math="\det J_F(x,y) > 0 \quad \text{for all } (x,y) \in \mathbb{R}^2" />
              </div>
              <div className="text-xs text-slate-300 leading-relaxed">
                Even though the Jacobian determinant is <strong>strictly positive everywhere</strong> on the real plane <MathView math="\mathbb{R}^2" />, the map <MathView math="F" /> is <strong>NOT 1-to-1</strong>! It has distinct real points mapped to the exact same output.
              </div>
            </div>

            <div className="w-full md:w-80 bg-amber-950/20 border border-amber-900/50 p-4 rounded-xl text-xs space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-semibold">
                <ShieldAlert className="w-4 h-4" /> Why does it work over <MathView math="\mathbb{R}^2" />?
              </div>
              <p className="text-slate-300 text-[11px] leading-normal">
                Over real numbers <MathView math="\mathbb{R}^2" />, a polynomial map can "fold at infinity" through an un-bounded asymptote without creating any real zero of derivative!
              </p>
              <p className="text-slate-300 text-[11px] leading-normal">
                However, when extended to complex space <MathView math="\mathbb{C}^2" />, Pinchuk's Jacobian determinant develops <strong>complex zeros</strong> at infinity! Thus, it is NOT a counterexample to the Complex Jacobian Conjecture.
              </p>
            </div>
          </div>

          {/* Interactive Comparison Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-xs text-left text-slate-300">
              <thead className="bg-slate-950 text-slate-200 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Domain & Map Type</th>
                  <th className="p-3">Det Hypothesis</th>
                  <th className="p-3">Global Invertibility?</th>
                  <th className="p-3">Verdict / Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/60">
                <tr>
                  <td className="p-3 font-semibold text-slate-100">Transcendental / Holomorphic (<MathView math="\mathbb{C}^n" />)</td>
                  <td className="p-3 font-mono text-emerald-400"><MathView math="\det J = 1" /></td>
                  <td className="p-3 text-rose-400 font-bold flex items-center gap-1"><X className="w-4 h-4" /> FALSE</td>
                  <td className="p-3">Fails due to complex periodicity (<MathView math="e^z" />).</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-100">Real Polynomials (<MathView math="\mathbb{R}^2" />)</td>
                  <td className="p-3 font-mono text-emerald-400"><MathView math="\det J > 0" /></td>
                  <td className="p-3 text-rose-400 font-bold flex items-center gap-1"><X className="w-4 h-4" /> FALSE</td>
                  <td className="p-3">Disproved by Pinchuk (1994). Real plane folds at infinity.</td>
                </tr>
                <tr className="bg-cyan-950/20 font-semibold text-cyan-200">
                  <td className="p-3 text-white font-bold">Complex Polynomials (<MathView math="\mathbb{C}^n" />)</td>
                  <td className="p-3 font-mono text-emerald-400"><MathView math="\det J = c \neq 0" /></td>
                  <td className="p-3 text-amber-300 font-bold flex items-center gap-1">? OPEN / UNKNOWN</td>
                  <td className="p-3 text-cyan-300"><strong>The Jacobian Conjecture!</strong> Unsolved for all <MathView math="n \ge 2" />.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
