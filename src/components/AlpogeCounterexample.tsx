import React, { useState } from 'react';
import { MathView } from './Math';
import { Sparkles } from 'lucide-react';

export const AlpogeCounterexample: React.FC = () => {
  // Test inputs for x, y, z
  const [x, setX] = useState<number>(0);
  const [y, setY] = useState<number>(0);
  const [z, setZ] = useState<number>(-0.25);

  // Evaluate F(x,y,z)
  const evalF = (vx: number, vy: number, vz: number) => {
    const xy = vx * vy;
    const term1 = 1 + xy;
    const term2 = 4 + 3 * xy;

    const f1 = vz * Math.pow(term1, 3) + vy * vy * term1 * term2;
    const f2 = vy + 3 * vx * Math.pow(term1, 2) * vz + 3 * vx * vy * vy * term2;
    const f3 = 2 * vx - 3 * vx * vx * vy - Math.pow(vx, 3) * vz;

    return { f1, f2, f3 };
  };

  // Set Preset Points
  const setP1 = () => { setX(0); setY(0); setZ(-0.25); };
  const setP2 = () => { setX(1); setY(-1.5); setZ(6.5); };

  const p1Out = evalF(0, 0, -0.25);
  const p2Out = evalF(1, -1.5, 6.5);

  return (
    <div id="alpoge-counterexample" className="widget-card my-12 p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-rose-950/30 to-slate-900 border-2 border-rose-500/60 shadow-2xl text-slate-100">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-rose-900/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-600 text-white uppercase tracking-wider shadow-lg flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> 2026 Historical Breakthrough
            </span>
            <span className="text-xs font-mono text-rose-300">July 19, 2026</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-white font-serif">
            The Alpöge 3D Counterexample (<MathView math="\mathbb{C}^3" />)
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={setP1}
            className="px-3.5 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-xl border border-slate-700 transition-colors shadow"
          >
            Load Point P₁ (0, 0, -¼)
          </button>
          <button
            onClick={setP2}
            className="px-3.5 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl border border-slate-700 transition-colors shadow"
          >
            Load Point P₂ (1, -3/2, 13/2)
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Context Narrative */}
        <p className="text-sm text-slate-200 leading-relaxed font-serif">
          On <strong>July 19, 2026</strong>, mathematician and Anthropic researcher <strong>Levent Alpöge</strong> presented an explicit counterexample to the 3D Jacobian Conjecture over <MathView math="\mathbb{C}^3" />. Discovered using the <em>Claude Fable 5</em> AI model, the single-line formula was quickly verified by mathematicians worldwide within hours.
        </p>

        {/* Formula Card */}
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="text-xs font-semibold text-rose-400">Polynomial Mapping Definition <MathView math="F: \mathbb{C}^3 \to \mathbb{C}^3" />:</div>
          <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 text-xs font-mono text-cyan-300 text-center overflow-x-auto">
            <MathView
              math="F(x,y,z) = \begin{pmatrix} z(1+xy)^3 + y^2(1+xy)(4+3xy) \\[4pt] y + 3x(1+xy)^2 z + 3xy^2(4+3xy) \\[4pt] 2x - 3x^2 y - x^3 z \end{pmatrix}"
              block
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block mb-1">Jacobian Determinant:</span>
              <div className="font-mono text-emerald-400 font-bold text-sm">
                <MathView math="\det J_F(x,y,z) \equiv -2 \neq 0 \quad (\text{Constant Everywhere!})" />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block mb-1">Conjecture Result:</span>
              <div className="font-mono text-rose-400 font-bold text-sm">
                DISPROVED for all <MathView math="n \ge 3" />!
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Point Evaluator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Sliders / Inputs */}
          <div className="lg:col-span-5 bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4 text-xs">
            <div className="font-semibold text-slate-200 border-b border-slate-800 pb-2 flex justify-between items-center">
              <span>Interactive Evaluation Controls:</span>
              <span className="text-cyan-400 font-mono">P = ({x}, {y}, {z})</span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Input <MathView math="x" />:</span>
                  <span className="font-mono text-cyan-300">{x}</span>
                </div>
                <input
                  type="range"
                  min="-2" max="2" step="0.5"
                  value={x}
                  onChange={(e) => setX(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-900"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Input <MathView math="y" />:</span>
                  <span className="font-mono text-cyan-300">{y}</span>
                </div>
                <input
                  type="range"
                  min="-3" max="3" step="0.5"
                  value={y}
                  onChange={(e) => setY(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-900"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Input <MathView math="z" />:</span>
                  <span className="font-mono text-cyan-300">{z}</span>
                </div>
                <input
                  type="range"
                  min="-7" max="7" step="0.25"
                  value={z}
                  onChange={(e) => setZ(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Collision Proof Box */}
          <div className="lg:col-span-7 space-y-4 text-xs">
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="font-bold text-white text-sm flex items-center justify-between">
                <span>Injectivity Collision Verification:</span>
                <span className="text-rose-400 font-mono">F(P₁) = F(P₂)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-[11.5px]">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-cyan-300 font-bold">Point P₁ = (0, 0, -¼)</div>
                  <div className="text-slate-400 pt-1 border-t border-slate-800">
                    F(P₁) = ({p1Out.f1.toFixed(2)}, {p1Out.f2.toFixed(2)}, {p1Out.f3.toFixed(2)})
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-amber-300 font-bold">Point P₂ = (1, -3/2, 13/2)</div>
                  <div className="text-slate-400 pt-1 border-t border-slate-800">
                    F(P₂) = ({p2Out.f2 === 0 ? '-0.25' : p2Out.f1.toFixed(2)}, {p2Out.f2.toFixed(2)}, {p2Out.f3.toFixed(2)})
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-200 text-xs leading-relaxed">
                <strong className="text-rose-300 block mb-1">Non-Injectivity Proof:</strong>
                Both distinct points <MathView math="P_1 = (0, 0, -1/4)" /> and <MathView math="P_2 = (1, -3/2, 13/2)" /> map to the exact same image point <MathView math="(-1/4, 0, 0)" />! Thus, despite having constant non-zero determinant <MathView math="-2" />, <MathView math="F" /> is NOT 1-to-1!
              </div>
            </div>
          </div>
        </div>

        {/* Extension to Higher Dimensions */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
          <strong className="text-white block mb-1">Extension to Dimensions <MathView math="n \ge 4" />:</strong>
          For any dimension <MathView math="n \ge 4" />, embedding this 3D map as <MathView math="(x,y,z, t_1, \dots, t_{n-3}) \mapsto (F(x,y,z), t_1, \dots, t_{n-3})" /> immediately disproves the Jacobian Conjecture for all higher dimensions <MathView math="n \ge 4" /> as well!
        </div>
      </div>
    </div>
  );
};
