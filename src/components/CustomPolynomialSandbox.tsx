import React, { useState, useEffect, useRef } from 'react';
import { MathView } from './Math';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface PresetFormula {
  name: string;
  f1Expr: string;
  f2Expr: string;
  eval1: (x: number, y: number) => number;
  eval2: (x: number, y: number) => number;
  detExpr: string;
  isConstantDet: boolean;
}

const TEMPLATES: PresetFormula[] = [
  {
    name: 'Triangular Shear: f1 = x + y^3, f2 = y',
    f1Expr: 'x + y^3',
    f2Expr: 'y',
    eval1: (x, y) => x + y * y * y,
    eval2: (_, y) => y,
    detExpr: '1 \\cdot 1 - (3y^2)(0) = 1',
    isConstantDet: true,
  },
  {
    name: 'Swallowing Map: f1 = x + y^2, f2 = y + (x+y^2)^2',
    f1Expr: 'x + y^2',
    f2Expr: 'y + (x+y^2)^2',
    eval1: (x, y) => x + y * y,
    eval2: (x, y) => y + Math.pow(x + y * y, 2),
    detExpr: '1 \\cdot (1 + 4y(x+y^2)) - 2y(2(x+y^2)) = 1',
    isConstantDet: true,
  },
  {
    name: 'Non-Constant Det: f1 = x^2 - y, f2 = x + y^2',
    f1Expr: 'x^2 - y',
    f2Expr: 'x + y^2',
    eval1: (x, y) => x * x - y,
    eval2: (x, y) => x + y * y,
    detExpr: '(2x)(2y) - (-1)(1) = 4xy + 1',
    isConstantDet: false,
  },
];

export const CustomPolynomialSandbox: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<number>(0);
  const [testResult, setTestResult] = useState<{ isConstant: boolean; sampleDetValues: number[]; hasZeros: boolean } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentTemplate = TEMPLATES[selectedTemplate];

  useEffect(() => {
    const f1 = currentTemplate.eval1;
    const f2 = currentTemplate.eval2;

    const eps = 1e-4;
    const sampleDets: number[] = [];
    let hasZeros = false;

    for (let x = -2; x <= 2; x += 0.5) {
      for (let y = -2; y <= 2; y += 0.5) {
        const df1_dx = (f1(x + eps, y) - f1(x - eps, y)) / (2 * eps);
        const df1_dy = (f1(x, y + eps) - f1(x, y - eps)) / (2 * eps);
        const df2_dx = (f2(x + eps, y) - f2(x - eps, y)) / (2 * eps);
        const df2_dy = (f2(x, y + eps) - f2(x, y - eps)) / (2 * eps);

        const det = df1_dx * df2_dy - df1_dy * df2_dx;
        sampleDets.push(det);
        if (Math.abs(det) < 0.001) hasZeros = true;
      }
    }

    const firstDet = sampleDets[0];
    const isConstant = sampleDets.every((d) => Math.abs(d - firstDet) < 0.01);

    setTestResult({
      isConstant,
      sampleDetValues: [sampleDets[0], sampleDets[10], sampleDets[25]],
      hasZeros,
    });
  }, [selectedTemplate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.fillStyle = '#0b1329';
    ctx.fillRect(0, 0, w, h);

    const minX = -3, maxX = 3, minY = -3, maxY = 3;
    const toSx = (x: number) => ((x - minX) / (maxX - minX)) * w;
    const toSy = (y: number) => h - ((y - minY) / (maxY - minY)) * h;

    const f1 = currentTemplate.eval1;
    const f2 = currentTemplate.eval2;

    ctx.lineWidth = 1;
    for (let gx = -2.5; gx <= 2.5; gx += 0.5) {
      ctx.strokeStyle = Math.abs(gx) < 0.1 ? '#06b6d4' : '#1e293b';
      ctx.beginPath();
      for (let gy = -2.5; gy <= 2.5; gy += 0.1) {
        const u = f1(gx, gy);
        const v = f2(gx, gy);
        if (gy === -2.5) ctx.moveTo(toSx(u), toSy(v));
        else ctx.lineTo(toSx(u), toSy(v));
      }
      ctx.stroke();
    }

    for (let gy = -2.5; gy <= 2.5; gy += 0.5) {
      ctx.strokeStyle = Math.abs(gy) < 0.1 ? '#f59e0b' : '#1e293b';
      ctx.beginPath();
      for (let gx = -2.5; gx <= 2.5; gx += 0.1) {
        const u = f1(gx, gy);
        const v = f2(gx, gy);
        if (gx === -2.5) ctx.moveTo(toSx(u), toSy(v));
        else ctx.lineTo(toSx(u), toSy(v));
      }
      ctx.stroke();
    }
  }, [selectedTemplate]);

  return (
    <div className="widget-card my-10 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-semibold tracking-wider text-cyan-400 uppercase">Interactive Sandbox</span>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            2D Polynomial Map Determinant Tester
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <label className="text-xs text-slate-400 font-semibold block">Select Preset 2D Polynomial Map:</label>
            <div className="space-y-2">
              {TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedTemplate(idx)}
                  className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${
                    selectedTemplate === idx
                      ? 'bg-slate-800 text-cyan-300 border-cyan-500 font-semibold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-850 hover:text-slate-200'
                  }`}
                >
                  {tmpl.name}
                </button>
              ))}
            </div>
          </div>

          {/* Result Card */}
          {testResult && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-semibold">Jacobian Determinant Analysis:</span>
                {testResult.isConstant ? (
                  <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Constant Determinant!
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Non-Constant Determinant
                  </span>
                )}
              </div>

              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-amber-300 text-center">
                <MathView math={`\\det J_F = ${currentTemplate.detExpr}`} />
              </div>

              <div className="text-slate-300 text-[11px] leading-relaxed">
                {testResult.isConstant ? (
                  <span>
                    The Jacobian determinant is <strong>constant</strong> over the entire sampled space. According to the Jacobian conjecture, this polynomial mapping MUST have a polynomial inverse!
                  </span>
                ) : (
                  <span>
                    The determinant varies with <MathView math="(x,y)" />. Hence, the Jacobian hypothesis does not apply to this mapping.
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Canvas Render */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-2 px-1 text-xs text-slate-400">
            <span>Transformed Image Grid Visualization</span>
          </div>
          <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
            <canvas ref={canvasRef} width={400} height={400} className="w-full h-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
