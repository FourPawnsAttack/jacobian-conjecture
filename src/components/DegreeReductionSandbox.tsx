import React, { useState } from 'react';
import { MathView } from './Math';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

export const DegreeReductionSandbox: React.FC = () => {
  const [a1, setA1] = useState<number>(1);
  const [b1, setB1] = useState<number>(1);
  const [a2, setA2] = useState<number>(-1);
  const [b2, setB2] = useState<number>(-1);

  const [x, setX] = useState<number>(2);
  const [y, setY] = useState<number>(-1);

  const s1 = a1 * x + b1 * y;
  const s2 = a2 * x + b2 * y;

  const jh11 = 3 * s1 * s1 * a1;
  const jh12 = 3 * s1 * s1 * b1;
  const jh21 = 3 * s2 * s2 * a2;
  const jh22 = 3 * s2 * s2 * b2;

  const trJH = jh11 + jh22;
  const detJH = jh11 * jh22 - jh12 * jh21;

  const isNilpotent = Math.abs(trJH) < 1e-5 && Math.abs(detJH) < 1e-5;
  const detJF = 1 - trJH + detJH;

  const setPresetNilpotent = () => {
    setA1(1); setB1(1);
    setA2(-1); setB2(-1);
  };

  const setPresetNonNilpotent = () => {
    setA1(1); setB1(0);
    setA2(0); setB2(1);
  };

  return (
    <div className="widget-card my-10 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">Interactive Figure 4</span>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            Degree Reduction & Nilpotent Cubic Matrix Inspector
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={setPresetNilpotent}
            className="px-3 py-1.5 text-xs font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-800 rounded-lg hover:bg-emerald-900/60 transition-colors"
          >
            Preset: Nilpotent Map (H = (s^3, -s^3))
          </button>
          <button
            onClick={setPresetNonNilpotent}
            className="px-3 py-1.5 text-xs font-medium bg-rose-950/60 text-rose-300 border border-rose-800 rounded-lg hover:bg-rose-900/60 transition-colors"
          >
            Preset: Non-Nilpotent Cubic
          </button>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 mb-6">
        <div className="text-xs font-semibold text-emerald-400 mb-1">Bass-Connell-Wright & Yagzhev Reduction Theorem</div>
        <div className="text-xs text-slate-300 leading-relaxed mb-3">
          To prove the Jacobian conjecture for all dimensions <MathView math="n" />, it is sufficient to consider maps of the form <MathView math="F(X) = X - H(X)" /> where <MathView math="H" /> is cubic homogeneous and its Jacobian <MathView math="J_H" /> is <strong>nilpotent</strong> (<MathView math="J_H^n = 0" />).
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block mb-1">Cubic Map <MathView math="H(x,y)" /> Definition:</span>
            <div className="font-mono text-cyan-300">
              <MathView math={`H_1(x,y) = (${a1}x ${b1 >= 0 ? `+ ${b1}` : b1}y)^3`} />
            </div>
            <div className="font-mono text-cyan-300">
              <MathView math={`H_2(x,y) = (${a2}x ${b2 >= 0 ? `+ ${b2}` : b2}y)^3`} />
            </div>
          </div>
          <div>
            <span className="text-slate-400 block mb-1">Overall Map <MathView math="F(x,y) = (x - H_1, \, y - H_2)" />:</span>
            <div className="font-mono text-amber-300">
              <MathView math={`F(x,y) = \\left(x - (${a1}x ${b1 >= 0 ? `+ ${b1}` : b1}y)^3, \\; y - (${a2}x ${b2 >= 0 ? `+ ${b2}` : b2}y)^3\\right)`} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Controls */}
        <div className="lg:col-span-5 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4 text-xs">
          <div className="font-semibold text-slate-200 border-b border-slate-800 pb-2">
            Adjust Coefficients for <MathView math="H(x,y)" />:
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1"><MathView math="a_1" />: {a1}</label>
              <input
                type="range"
                min="-2" max="2" step="1"
                value={a1}
                onChange={(e) => setA1(parseInt(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-900"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1"><MathView math="b_1" />: {b1}</label>
              <input
                type="range"
                min="-2" max="2" step="1"
                value={b1}
                onChange={(e) => setB1(parseInt(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-900"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1"><MathView math="a_2" />: {a2}</label>
              <input
                type="range"
                min="-2" max="2" step="1"
                value={a2}
                onChange={(e) => setA2(parseInt(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-900"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1"><MathView math="b_2" />: {b2}</label>
              <input
                type="range"
                min="-2" max="2" step="1"
                value={b2}
                onChange={(e) => setB2(parseInt(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-900"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Evaluation Point <MathView math="x" />: {x}</label>
              <input
                type="range"
                min="-3" max="3" step="0.5"
                value={x}
                onChange={(e) => setX(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-900"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Evaluation Point <MathView math="y" />: {y}</label>
              <input
                type="range"
                min="-3" max="3" step="0.5"
                value={y}
                onChange={(e) => setY(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Matrix Analysis Output */}
        <div className="lg:col-span-7 space-y-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="font-semibold text-slate-200">
              Jacobian Matrix of <MathView math="H(x,y)" /> evaluated at <MathView math={`(${x},${y})`} />:
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 bg-slate-900 p-3 rounded-lg border border-slate-800">
              <MathView
                math={`J_H = \\begin{pmatrix} ${jh11.toFixed(1)} & ${jh12.toFixed(1)} \\\\ ${jh21.toFixed(1)} & ${jh22.toFixed(1)} \\end{pmatrix}`}
              />

              <div className="text-left space-y-1 font-mono text-[11px] border-l border-slate-800 pl-4">
                <div><MathView math={`\\text{Trace}(J_H) = `} /> <span className={Math.abs(trJH) < 1e-5 ? 'text-emerald-400 font-bold' : 'text-rose-400'}>{trJH.toFixed(1)}</span></div>
                <div><MathView math={`\\det(J_H) = `} /> <span className={Math.abs(detJH) < 1e-5 ? 'text-emerald-400 font-bold' : 'text-rose-400'}>{detJH.toFixed(1)}</span></div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Nilpotency Status (<MathView math="J_H^2 = 0" />):</span>
              {isNilpotent ? (
                <span className="px-2.5 py-1 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> NILPOTENT MATRIX!
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-md bg-rose-950 text-rose-300 border border-rose-800 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> NOT NILPOTENT
                </span>
              )}
            </div>
          </div>

          <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
            isNilpotent ? 'bg-emerald-950/20 border-emerald-900/50 text-slate-300' : 'bg-slate-950 border-slate-800 text-slate-400'
          }`}>
            <strong className="text-white block mb-1">Determinant & Polynomial Inverse:</strong>
            <MathView math={`\\det J_F = \\det(I - J_H) = 1 - \\text{Tr}(J_H) + \\det(J_H) = ${detJF.toFixed(2)}`} />
            {isNilpotent && (
              <div className="mt-2 text-emerald-300">
                Because <MathView math="J_H" /> is nilpotent, the inverse map is explicitly given by the finite polynomial series: <MathView math="F^{-1}(u,v) = (u + H_1(u,v), \, v + H_2(u,v))" />!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
