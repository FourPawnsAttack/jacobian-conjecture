import React, { useState, useEffect, useRef } from 'react';
import { MathView } from './Math';
import { Play, Crosshair, Layers } from 'lucide-react';

interface PresetMap {
  id: string;
  name: string;
  category: 'automorphism' | 'non-injective' | 'reduction';
  formula: { f1: string; f2: string };
  mathFormula: string;
  evalF: (x: number, y: number) => [number, number];
  jacobian: (x: number, y: number) => { j11: number; j12: number; j21: number; j22: number; det: number };
  detMath: string;
  invertible: boolean;
  inverseMath?: string;
  description: string;
}

const PRESET_MAPS: PresetMap[] = [
  {
    id: 'shear',
    name: 'Triangular Shear (Degree 2)',
    category: 'automorphism',
    formula: { f1: 'x + y^2', f2: 'y' },
    mathFormula: 'F(x,y) = (x + y^2, \\, y)',
    evalF: (x, y) => [x + y * y, y],
    jacobian: (_, y) => ({
      j11: 1,
      j12: 2 * y,
      j21: 0,
      j22: 1,
      det: 1,
    }),
    detMath: '\\det J_F(x,y) = 1 \\cdot 1 - 0 \\cdot (2y) = 1',
    invertible: true,
    inverseMath: 'F^{-1}(u,v) = (u - v^2, \\, v)',
    description: 'A non-linear map with constant Jacobian determinant 1. Bends grid lines into parabolas while preserving total area everywhere!',
  },
  {
    id: 'henon',
    name: 'Hénon Map (Symplectic)',
    category: 'automorphism',
    formula: { f1: '1 - 1.4*x^2 + y', f2: '0.3*x' },
    mathFormula: 'F(x,y) = (1 - 1.4x^2 + y, \\, 0.3x)',
    evalF: (x, y) => [1 - 1.4 * x * x + y, 0.3 * x],
    jacobian: (x) => ({
      j11: -2.8 * x,
      j12: 1,
      j21: 0.3,
      j22: 0,
      det: -0.3,
    }),
    detMath: '\\det J_F(x,y) = (-2.8x)(0) - (1)(0.3) = -0.3',
    invertible: true,
    inverseMath: 'F^{-1}(u,v) = (\\frac{v}{0.3}, \\, u - 1 + 1.4(\\frac{v}{0.3})^2)',
    description: 'Famous discrete dynamical map. Has constant determinant -0.3, so area contracts uniformly by 0.3x in every step.',
  },
  {
    id: 'nilpotent-cubic',
    name: 'Cubic Nilpotent (Bass-Connell-Wright)',
    category: 'automorphism',
    formula: { f1: 'x + (x+y)^3', f2: 'y - (x+y)^3' },
    mathFormula: 'F(x,y) = (x + (x+y)^3, \\, y - (x+y)^3)',
    evalF: (x, y) => {
      const s = x + y;
      const s3 = s * s * s;
      return [x + s3, y - s3];
    },
    jacobian: (x, y) => {
      const s = x + y;
      const d = 3 * s * s;
      return {
        j11: 1 + d,
        j12: d,
        j21: -d,
        j22: 1 - d,
        det: (1 + d) * (1 - d) - (d) * (-d),
      };
    },
    detMath: '\\det J_F = (1+3(x+y)^2)(1-3(x+y)^2) - (3(x+y)^2)(-3(x+y)^2) = 1',
    invertible: true,
    inverseMath: 'F^{-1}(u,v) = (u - (u+v)^3, \\, v + (u+v)^3)',
    description: 'Form: F(X) = X + H(X) where H is cubic homogeneous with nilpotent Jacobian. Perfectly constant det = 1!',
  },
  {
    id: 'complex-square',
    name: 'Complex Square z^2 (Non-Constant Det)',
    category: 'non-injective',
    formula: { f1: 'x^2 - y^2', f2: '2*x*y' },
    mathFormula: 'F(x,y) = (x^2 - y^2, \\, 2xy)',
    evalF: (x, y) => [x * x - y * y, 2 * x * y],
    jacobian: (x, y) => ({
      j11: 2 * x,
      j12: -2 * y,
      j21: 2 * y,
      j22: 2 * x,
      det: 4 * (x * x + y * y),
    }),
    detMath: '\\det J_F(x,y) = 4(x^2 + y^2)',
    invertible: false,
    description: 'The real representation of complex square z -> z^2. Determinant vanishes at (0,0). Every point (u,v) ≠ (0,0) has 2 preimages, folding the plane in half!',
  },
  {
    id: 'linear',
    name: 'Linear Affine Transformation',
    category: 'automorphism',
    formula: { f1: 'x + 1.5*y', f2: '0.8*x - y' },
    mathFormula: 'F(x,y) = (x + 1.5y, \\, 0.8x - y)',
    evalF: (x, y) => [x + 1.5 * y, 0.8 * x - y],
    jacobian: () => ({
      j11: 1,
      j12: 1.5,
      j21: 0.8,
      j22: -1,
      det: -1 - 1.2,
    }),
    detMath: '\\det J_F = (1)(-1) - (1.5)(0.8) = -2.2',
    invertible: true,
    inverseMath: 'F^{-1}(u,v) = \\text{Standard Matrix Inverse}',
    description: 'Linear map. Determinant is a non-zero constant (-2.2), maps straight grid lines into rotated, sheared straight lines.',
  },
];

export const TwoDGridMapper: React.FC = () => {
  const [selectedMapId, setSelectedMapId] = useState<string>('shear');
  const [dragPoint, setDragPoint] = useState<{ x: number; y: number }>({ x: 1, y: 1 });
  const [morphFactor, setMorphFactor] = useState<number>(1);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const domainCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const codomainCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const currentMap = PRESET_MAPS.find((m) => m.id === selectedMapId) || PRESET_MAPS[0];

  useEffect(() => {
    if (isAnimating) {
      const startTime = performance.now();
      const duration = 2500;

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        setMorphFactor(ease);

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(step);
        } else {
          setIsAnimating(false);
        }
      };

      animationFrameRef.current = requestAnimationFrame(step);
      return () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      };
    }
  }, [isAnimating]);

  useEffect(() => {
    const dCanvas = domainCanvasRef.current;
    const cCanvas = codomainCanvasRef.current;
    if (!dCanvas || !cCanvas) return;

    const dCtx = dCanvas.getContext('2d');
    const cCtx = cCanvas.getContext('2d');
    if (!dCtx || !cCtx) return;

    const w = dCanvas.width;
    const h = dCanvas.height;

    const minX = -3, maxX = 3, minY = -3, maxY = 3;
    const toScreenX = (x: number) => ((x - minX) / (maxX - minX)) * w;
    const toScreenY = (y: number) => h - ((y - minY) / (maxY - minY)) * h;

    // Clear
    dCtx.fillStyle = '#0b1329';
    dCtx.fillRect(0, 0, w, h);
    cCtx.fillStyle = '#0b1329';
    cCtx.fillRect(0, 0, w, h);

    // Draw Axes
    const drawAxes = (ctx: CanvasRenderingContext2D) => {
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, toScreenY(0));
      ctx.lineTo(w, toScreenY(0));
      ctx.moveTo(toScreenX(0), 0);
      ctx.lineTo(toScreenX(0), h);
      ctx.stroke();
    };

    drawAxes(dCtx);
    drawAxes(cCtx);

    const gridDensity = 10;
    const gridStep = (maxX - minX) / gridDensity;

    // Draw Domain Grid
    dCtx.lineWidth = 1;
    for (let x = minX; x <= maxX; x += gridStep) {
      dCtx.strokeStyle = Math.abs(x) < 0.01 ? '#64748b' : '#1e293b';
      dCtx.beginPath();
      dCtx.moveTo(toScreenX(x), 0);
      dCtx.lineTo(toScreenX(x), h);
      dCtx.stroke();
    }
    for (let y = minY; y <= maxY; y += gridStep) {
      dCtx.strokeStyle = Math.abs(y) < 0.01 ? '#64748b' : '#1e293b';
      dCtx.beginPath();
      dCtx.moveTo(0, toScreenY(y));
      dCtx.lineTo(w, toScreenY(y));
      dCtx.stroke();
    }

    const mapPoint = (x: number, y: number): [number, number] => {
      const [fx, fy] = currentMap.evalF(x, y);
      const t = morphFactor;
      return [(1 - t) * x + t * fx, (1 - t) * y + t * fy];
    };

    cCtx.lineWidth = 1.5;
    const samples = 20;

    // Horizontal grid lines mapped
    for (let y = minY; y <= maxY; y += gridStep) {
      const isAxis = Math.abs(y) < 0.01;
      cCtx.strokeStyle = isAxis ? '#06b6d4' : '#334155';
      cCtx.beginPath();
      for (let i = 0; i <= samples; i++) {
        const x = minX + (i / samples) * (maxX - minX);
        const [u, v] = mapPoint(x, y);
        const sx = toScreenX(u);
        const sy = toScreenY(v);
        if (i === 0) cCtx.moveTo(sx, sy);
        else cCtx.lineTo(sx, sy);
      }
      cCtx.stroke();
    }

    // Vertical grid lines mapped
    for (let x = minX; x <= maxX; x += gridStep) {
      const isAxis = Math.abs(x) < 0.01;
      cCtx.strokeStyle = isAxis ? '#f59e0b' : '#334155';
      cCtx.beginPath();
      for (let i = 0; i <= samples; i++) {
        const y = minY + (i / samples) * (maxY - minY);
        const [u, v] = mapPoint(x, y);
        const sx = toScreenX(u);
        const sy = toScreenY(v);
        if (i === 0) cCtx.moveTo(sx, sy);
        else cCtx.lineTo(sx, sy);
      }
      cCtx.stroke();
    }

    // Highlight small local square
    const px = dragPoint.x;
    const py = dragPoint.y;
    const sqSize = 0.4;
    const sqCornerX = px - sqSize / 2;
    const sqCornerY = py - sqSize / 2;

    dCtx.fillStyle = 'rgba(6, 182, 212, 0.25)';
    dCtx.strokeStyle = '#06b6d4';
    dCtx.lineWidth = 2;
    dCtx.fillRect(toScreenX(sqCornerX), toScreenY(sqCornerY + sqSize), toScreenX(sqCornerX + sqSize) - toScreenX(sqCornerX), toScreenY(sqCornerY) - toScreenY(sqCornerY + sqSize));
    dCtx.strokeRect(toScreenX(sqCornerX), toScreenY(sqCornerY + sqSize), toScreenX(sqCornerX + sqSize) - toScreenX(sqCornerX), toScreenY(sqCornerY) - toScreenY(sqCornerY + sqSize));

    // Drag point dot on Domain
    dCtx.fillStyle = '#ec4899';
    dCtx.beginPath();
    dCtx.arc(toScreenX(px), toScreenY(py), 7, 0, Math.PI * 2);
    dCtx.fill();
    dCtx.strokeStyle = '#ffffff';
    dCtx.lineWidth = 2;
    dCtx.stroke();

    // Map small local square onto Codomain Canvas
    cCtx.fillStyle = 'rgba(236, 72, 153, 0.3)';
    cCtx.strokeStyle = '#ec4899';
    cCtx.lineWidth = 2;
    cCtx.beginPath();
    const p1 = mapPoint(sqCornerX, sqCornerY);
    const p2 = mapPoint(sqCornerX + sqSize, sqCornerY);
    const p3 = mapPoint(sqCornerX + sqSize, sqCornerY + sqSize);
    const p4 = mapPoint(sqCornerX, sqCornerY + sqSize);

    cCtx.moveTo(toScreenX(p1[0]), toScreenY(p1[1]));
    cCtx.lineTo(toScreenX(p2[0]), toScreenY(p2[1]));
    cCtx.lineTo(toScreenX(p3[0]), toScreenY(p3[1]));
    cCtx.lineTo(toScreenX(p4[0]), toScreenY(p4[1]));
    cCtx.closePath();
    cCtx.fill();
    cCtx.stroke();

    // Transformed Drag Point on Codomain
    const [uP, vP] = mapPoint(px, py);
    cCtx.fillStyle = '#ec4899';
    cCtx.beginPath();
    cCtx.arc(toScreenX(uP), toScreenY(vP), 7, 0, Math.PI * 2);
    cCtx.fill();
    cCtx.strokeStyle = '#ffffff';
    cCtx.lineWidth = 2;
    cCtx.stroke();

    // Tangent Vectors
    const jac = currentMap.jacobian(px, py);
    const vecScale = 0.5 * morphFactor;
    cCtx.strokeStyle = '#f59e0b';
    cCtx.lineWidth = 3;
    cCtx.beginPath();
    cCtx.moveTo(toScreenX(uP), toScreenY(vP));
    cCtx.lineTo(toScreenX(uP + jac.j11 * vecScale), toScreenY(vP + jac.j21 * vecScale));
    cCtx.stroke();

    cCtx.strokeStyle = '#06b6d4';
    cCtx.lineWidth = 3;
    cCtx.beginPath();
    cCtx.moveTo(toScreenX(uP), toScreenY(vP));
    cCtx.lineTo(toScreenX(uP + jac.j12 * vecScale), toScreenY(vP + jac.j22 * vecScale));
    cCtx.stroke();

  }, [selectedMapId, dragPoint, morphFactor]);

  const handleDomainClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = domainCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const mathX = -3 + (px / canvas.width) * 6;
    const mathY = 3 - (py / canvas.height) * 6;
    setDragPoint({ x: Math.max(-2.8, Math.min(2.8, mathX)), y: Math.max(-2.8, Math.min(2.8, mathY)) });
  };

  const currentJacobian = currentMap.jacobian(dragPoint.x, dragPoint.y);

  return (
    <div className="widget-card my-10 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-semibold tracking-wider text-amber-400 uppercase">Interactive Figure 2</span>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            2D Coordinate Grid Transformation & Jacobian Matrix
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setMorphFactor(0);
              setIsAnimating(true);
            }}
            disabled={isAnimating}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors shadow-md disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5" />
            Animate Morphing
          </button>
        </div>
      </div>

      {/* Preset Map Selector Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {PRESET_MAPS.map((map) => (
          <button
            key={map.id}
            onClick={() => {
              setSelectedMapId(map.id);
              setMorphFactor(1);
            }}
            className={`px-3.5 py-2 text-xs font-medium rounded-xl border transition-all flex items-center gap-1.5 ${
              selectedMapId === map.id
                ? 'bg-slate-800 text-cyan-300 border-cyan-500 shadow-md ring-1 ring-cyan-500/50'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${map.invertible ? 'bg-emerald-400' : 'bg-rose-400'}`} />
            {map.name}
          </button>
        ))}
      </div>

      {/* Formula & Description Banner */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 mb-6 flex flex-wrap lg:flex-nowrap items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-400 mb-1">Mapping Definition:</div>
          <div className="text-lg font-bold text-cyan-300">
            <MathView math={currentMap.mathFormula} />
          </div>
          <div className="text-xs text-slate-300 mt-2 max-w-xl">
            {currentMap.description}
          </div>
        </div>
        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
          <div className="text-slate-400 font-semibold mb-1">Jacobian Determinant Formula:</div>
          <div className="font-mono text-amber-300">
            <MathView math={currentMap.detMath} />
          </div>
        </div>
      </div>

      {/* Dual Canvas Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Domain Canvas */}
        <div className="flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-2 px-1">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
              <Crosshair className="w-3.5 h-3.5" /> Domain <MathView math="(x,y) \\in \\mathbb{R}^2" />
            </span>
            <span className="text-xs text-slate-400">Click to place test point</span>
          </div>
          <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
            <canvas
              ref={domainCanvasRef}
              width={400}
              height={400}
              onClick={handleDomainClick}
              className="w-full h-full cursor-crosshair"
            />
            <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-cyan-300">
              Point P = ({dragPoint.x.toFixed(2)}, {dragPoint.y.toFixed(2)})
            </div>
          </div>
        </div>

        {/* Codomain Canvas */}
        <div className="flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-2 px-1">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" /> Transformed Codomain <MathView math="F(x,y) \\in \\mathbb{R}^2" />
            </span>
            <span className="text-xs text-slate-400">Area scale = |det J|</span>
          </div>
          <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
            <canvas
              ref={codomainCanvasRef}
              width={400}
              height={400}
              className="w-full h-full"
            />
            <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-amber-300">
              Mapped Q = ({currentMap.evalF(dragPoint.x, dragPoint.y)[0].toFixed(2)}, {currentMap.evalF(dragPoint.x, dragPoint.y)[1].toFixed(2)})
            </div>
          </div>
        </div>
      </div>

      {/* Live Local Matrix Inspector */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-4 items-center text-xs">
        <div className="md:col-span-6 flex items-center gap-4">
          <div>
            <div className="text-slate-400 font-medium mb-1">Local Jacobian Matrix at P:</div>
            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-mono text-slate-200 text-center">
              <MathView
                math={`J_F(${dragPoint.x.toFixed(1)}, ${dragPoint.y.toFixed(1)}) = \\begin{pmatrix} ${currentJacobian.j11.toFixed(2)} & ${currentJacobian.j12.toFixed(2)} \\\\ ${currentJacobian.j21.toFixed(2)} & ${currentJacobian.j22.toFixed(2)} \\end{pmatrix}`}
              />
            </div>
          </div>
          <div>
            <div className="text-slate-400 font-medium mb-1">Determinant Value:</div>
            <div className={`p-2.5 rounded-lg border text-sm font-bold text-center ${
              currentJacobian.det !== 0 ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800' : 'bg-rose-950/40 text-rose-300 border-rose-800'
            }`}>
              <MathView math={`\\det J_F = ${currentJacobian.det.toFixed(2)}`} />
            </div>
          </div>
        </div>

        <div className="md:col-span-6 border-t md:border-t-0 md:border-l border-slate-800 pl-0 md:pl-4 pt-3 md:pt-0 leading-relaxed text-slate-300">
          <strong className="text-white block mb-1">Geometric Meaning:</strong>
          {currentJacobian.det !== 0 ? (
            <span>
              The determinant is <strong className="text-emerald-400">non-zero ({currentJacobian.det.toFixed(2)})</strong>. The map scales local infinitesimal areas by factor <MathView math={`|\\det J| = ${Math.abs(currentJacobian.det).toFixed(2)}`} /> and preserves local orientation {currentJacobian.det > 0 ? '(positive)' : '(reversed/negative)'}. Inverse function theorem guarantees local invertibility near P!
            </span>
          ) : (
            <span className="text-rose-300">
              Determinant is <strong>ZERO</strong> at this point! Local areas collapse to zero width, creating a singular fold or branch point where local invertibility fails!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
