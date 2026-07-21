import React, { useState, useEffect, useRef } from 'react';
import { MathView } from './Math';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

export const OneDExplorer: React.FC = () => {
  const [a, setA] = useState<number>(0);
  const [b, setB] = useState<number>(0.5);
  const [c, setC] = useState<number>(1);
  const [d, setD] = useState<number>(0);
  const [xHover, setXHover] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Derivative coefficients: f'(x) = 3a x^2 + 2b x + c
  const da = 3 * a;
  const db = 2 * b;
  const dc = c;

  // Compute discriminant of f'(x) = 0 (for quadratic f'(x))
  const discriminant = da !== 0 ? db * db - 4 * da * dc : null;
  const isConstantDerivative = a === 0 && b === 0;
  const isNonZeroConstant = isConstantDerivative && c !== 0;

  // Roots of derivative
  const derivRoots: number[] = [];
  if (da !== 0 && discriminant !== null && discriminant >= 0) {
    const r1 = (-db + Math.sqrt(discriminant)) / (2 * da);
    const r2 = (-db - Math.sqrt(discriminant)) / (2 * da);
    derivRoots.push(r1, r2);
  } else if (da === 0 && db !== 0) {
    derivRoots.push(-dc / db);
  }

  const evalF = (x: number) => a * x * x * x + b * x * x + c * x + d;
  const evalDF = (x: number) => 3 * a * x * x + 2 * b * x + c;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Grid coordinates
    const minX = -4;
    const maxX = 4;
    const minY = -6;
    const maxY = 6;

    const toScreenX = (x: number) => ((x - minX) / (maxX - minX)) * width;
    const toScreenY = (y: number) => height - ((y - minY) / (maxY - minY)) * height;
    const toMathX = (px: number) => minX + (px / width) * (maxX - minX);

    // Draw Axes
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();

    // X Axis
    const y0 = toScreenY(0);
    ctx.moveTo(0, y0);
    ctx.lineTo(width, y0);

    // Y Axis
    const x0 = toScreenX(0);
    ctx.moveTo(x0, 0);
    ctx.lineTo(x0, height);
    ctx.stroke();

    // Grid lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 0.5;
    for (let x = Math.ceil(minX); x <= Math.floor(maxX); x++) {
      if (x === 0) continue;
      const sx = toScreenX(x);
      ctx.beginPath();
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, height);
      ctx.stroke();
    }
    for (let y = Math.ceil(minY); y <= Math.floor(maxY); y++) {
      if (y === 0) continue;
      const sy = toScreenY(y);
      ctx.beginPath();
      ctx.moveTo(0, sy);
      ctx.lineTo(width, sy);
      ctx.stroke();
    }

    // Draw Derivative f'(x) in Amber/Orange
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    let started = false;
    for (let px = 0; px <= width; px += 2) {
      const x = toMathX(px);
      const df = evalDF(x);
      const py = toScreenY(df);
      if (!started) {
        ctx.moveTo(px, py);
        started = true;
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Function f(x) in Cyan/Teal
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 3;
    ctx.beginPath();
    started = false;
    for (let px = 0; px <= width; px += 2) {
      const x = toMathX(px);
      const fVal = evalF(x);
      const py = toScreenY(fVal);
      if (!started) {
        ctx.moveTo(px, py);
        started = true;
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();

    // Mark Critical Points (where f'(x) = 0)
    derivRoots.forEach((rx) => {
      if (rx >= minX && rx <= maxX) {
        const sx = toScreenX(rx);
        const sy = toScreenY(evalF(rx));

        // Vertical guide line
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(sx, 0);
        ctx.lineTo(sx, height);
        ctx.stroke();
        ctx.setLineDash([]);

        // Red dot on f(x)
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(sx, sy, 6, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.fillStyle = '#f87171';
        ctx.font = '11px Inter, sans-serif';
        ctx.fillText(`f'(${rx.toFixed(2)})=0`, sx + 8, sy - 8);
      }
    });

    // Draw Hover Inspector
    if (xHover !== null && xHover >= minX && xHover <= maxX) {
      const sx = toScreenX(xHover);
      const fVal = evalF(xHover);
      const dfVal = evalDF(xHover);
      const syF = toScreenY(fVal);

      // Line
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, height);
      ctx.stroke();

      // Tangent line on f(x)
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      const tangentDx = 1.5;
      const xStart = xHover - tangentDx;
      const xEnd = xHover + tangentDx;
      const yStart = fVal - tangentDx * dfVal;
      const yEnd = fVal + tangentDx * dfVal;
      ctx.moveTo(toScreenX(xStart), toScreenY(yStart));
      ctx.lineTo(toScreenX(xEnd), toScreenY(yEnd));
      ctx.stroke();

      // Dot on f(x)
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.arc(sx, syF, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [a, b, c, d, xHover]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const mathX = -4 + (px / canvas.width) * 8;
    setXHover(mathX);
  };

  const presetLinear = () => { setA(0); setB(0); setC(2); setD(1); };
  const presetCubicInvertible = () => { setA(0.2); setB(0); setC(1); setD(0); };
  const presetCubicFold = () => { setA(0.5); setB(0); setC(-2); setD(0); };

  return (
    <div className="widget-card my-8 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-semibold tracking-wider text-cyan-400 uppercase">Interactive Figure 1</span>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            1D Polynomial Derivative & Invertibility
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={presetLinear}
            className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg transition-colors border border-slate-700"
          >
            Linear (Constant f')
          </button>
          <button
            onClick={presetCubicInvertible}
            className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded-lg transition-colors border border-slate-700"
          >
            Strict Monotonic Monomial
          </button>
          <button
            onClick={presetCubicFold}
            className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-rose-300 rounded-lg transition-colors border border-slate-700"
          >
            Cubic with Local Folds
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Canvas */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
            <canvas
              ref={canvasRef}
              width={500}
              height={380}
              className="w-full h-full cursor-crosshair"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setXHover(null)}
            />

            {/* Legend Overlay */}
            <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-sm p-2.5 rounded-lg border border-slate-800 text-xs flex flex-col gap-1.5 shadow-lg">
              <div className="flex items-center gap-2">
                <span className="w-3 h-1 bg-cyan-400 rounded-full inline-block"></span>
                <span className="text-slate-300 font-medium"><MathView math="f(x)" /> (Function)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-0.5 border-t border-dashed border-amber-400 inline-block"></span>
                <span className="text-slate-300 font-medium"><MathView math="f'(x)" /> (Derivative)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-1 bg-emerald-500 rounded-full inline-block"></span>
                <span className="text-slate-300 font-medium">Tangent line</span>
              </div>
            </div>

            {/* Dynamic Hover Status */}
            {xHover !== null && (
              <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-slate-800 text-xs font-mono text-slate-300 shadow-lg">
                <div>x = {xHover.toFixed(2)}</div>
                <div className="text-cyan-400">f(x) = {evalF(xHover).toFixed(2)}</div>
                <div className="text-amber-400">f'(x) = {evalDF(xHover).toFixed(2)}</div>
              </div>
            )}
          </div>
        </div>

        {/* Controls & Math Insight */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-sm font-semibold text-slate-300 mb-3">
              Function Formula:
            </div>
            <div className="text-center py-2 bg-slate-900 rounded-lg border border-slate-800 mb-4">
              <MathView
                math={`f(x) = ${a !== 0 ? `${a}x^3 + ` : ''}${b !== 0 ? `${b}x^2 + ` : ''}${c}x ${d !== 0 ? (d > 0 ? `+ ${d}` : `${d}`) : ''}`}
                block
              />
              <MathView
                math={`f'(x) = ${da !== 0 ? `${da}x^2 + ` : ''}${db !== 0 ? `${db}x + ` : ''}${dc}`}
              />
            </div>

            {/* Sliders */}
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Coefficient <MathView math="a" /> (<MathView math="x^3" />):</span>
                  <span className="font-mono text-cyan-300">{a}</span>
                </div>
                <input
                  type="range"
                  min="-1"
                  max="1"
                  step="0.1"
                  value={a}
                  onChange={(e) => setA(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-800"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Coefficient <MathView math="b" /> (<MathView math="x^2" />):</span>
                  <span className="font-mono text-cyan-300">{b}</span>
                </div>
                <input
                  type="range"
                  min="-2"
                  max="2"
                  step="0.1"
                  value={b}
                  onChange={(e) => setB(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-800"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Linear <MathView math="c" /> (<MathView math="x" />):</span>
                  <span className="font-mono text-cyan-300">{c}</span>
                </div>
                <input
                  type="range"
                  min="-4"
                  max="4"
                  step="0.2"
                  value={c}
                  onChange={(e) => setC(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Theoretical Insight Box */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs leading-relaxed text-slate-300">
            {isNonZeroConstant ? (
              <div className="flex items-start gap-2 text-emerald-400">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-300 block mb-1">Constant Non-Zero Derivative:</strong>
                  Because <MathView math="f'(x) = c \neq 0" /> is constant, <MathView math="f(x)" /> is strictly linear (<MathView math="f(x) = cx + d" />). Linear polynomial functions are always 1-to-1 global bijections with inverse <MathView math="f^{-1}(y) = \frac{y-d}{c}" />!
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2 text-amber-400">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
                <div>
                  <strong className="text-amber-300 block mb-1">Non-Constant Derivative:</strong>
                  By the Fundamental Theorem of Algebra, any polynomial derivative <MathView math="f'(x)" /> of degree <MathView math="\ge 1" /> MUST have complex roots! At these critical roots where <MathView math="f'(z) = 0" />, local invertibility breaks completely.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
