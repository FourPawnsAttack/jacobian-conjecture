import React, { useState } from 'react';
import { MathView } from './Math';
import { ChevronRight, ChevronLeft, Award, CheckCircle2 } from 'lucide-react';

interface Step {
  title: string;
  math: string;
  explanation: string;
  insight?: string;
}

interface ProofCase {
  id: string;
  title: string;
  status: 'proven' | 'proven-special' | 'open';
  provenBy: string;
  steps: Step[];
}

const PROOF_CASES: ProofCase[] = [
  {
    id: 'n1',
    title: 'Dimension 1 (Any Degree)',
    status: 'proven',
    provenBy: 'Classical Calculus',
    steps: [
      {
        title: 'Step 1: Derivative Hypothesis',
        math: 'f(x) \\in \\mathbb{C}[x], \\quad f\'(x) = c \\in \\mathbb{C}^\\times',
        explanation: 'We are given a 1D polynomial map f(x) whose derivative f\'(x) is a non-zero constant c for all x.',
      },
      {
        title: 'Step 2: Integration',
        math: 'f(x) = \\int c \\, dx = c x + d',
        explanation: 'Integrating a constant derivative forces f(x) to be a strictly linear polynomial.',
      },
      {
        title: 'Step 3: Construct Inverse',
        math: 'g(y) = \\frac{y - d}{c} \\implies f(g(y)) = y',
        explanation: 'Linear functions have an immediate, explicit linear polynomial inverse! Hence, Jacobian Conjecture is trivially TRUE for n=1.',
        insight: 'Notice why non-constant polynomials fail: by Fundamental Theorem of Algebra, any polynomial derivative of degree ≥ 1 has complex roots, so derivative cannot be non-zero constant!',
      },
    ],
  },
  {
    id: 'deg2',
    title: 'Dimension 2, Degree 2 Maps',
    status: 'proven-special',
    provenBy: 'Stuart S.-S. Wang (1980)',
    steps: [
      {
        title: 'Step 1: General Quadratic System',
        math: 'F(x,y) = (P(x,y), Q(x,y)), \\quad \\deg(P), \\deg(Q) \\le 2',
        explanation: 'Let P and Q be quadratic polynomials in 2 variables.',
      },
      {
        title: 'Step 2: Jacobian Matrix Expansion',
        math: 'J_F(x,y) = \\begin{pmatrix} 2a_1 x + b_1 y + d_1 & b_1 x + 2c_1 y + e_1 \\\\ 2a_2 x + b_2 y + d_2 & b_2 x + 2c_2 y + e_2 \\end{pmatrix}',
        explanation: 'We compute the partial derivatives matrix. The determinant det(J_F) is a polynomial of degree up to 2 in x and y.',
      },
      {
        title: 'Step 3: Determinant Vanishing Conditions',
        math: '\\det J_F(x,y) = c \\implies \\text{Degree 2 & 1 terms of } \\det J_F \\text{ must vanish identically}',
        explanation: 'Setting coefficients of x^2, xy, y^2, x, y to zero yields linear dependence among quadratic terms of P and Q.',
      },
      {
        title: 'Step 4: Affine Triangular Reduction',
        math: 'F(x,y) \\sim (x + y^2, \\, y)',
        explanation: 'Via a linear change of variables, every quadratic map with constant non-zero Jacobian det reduces to triangular shear form!',
      },
      {
        title: 'Step 5: Polynomial Inverse Construction',
        math: 'F^{-1}(u,v) = (u - v^2, \\, v)',
        explanation: 'Triangular shear maps are explicitly polynomial invertible. Thus, Wang proved the conjecture for all degree 2 maps in 2D!',
        insight: 'Wang\'s 1980 theorem settled the degree 2 case completely, showing that quadratic maps can never form counterexamples.',
      },
    ],
  },
  {
    id: 'ax-grothendieck',
    title: 'The Ax-Grothendieck Equivalence',
    status: 'proven',
    provenBy: 'James Ax & Alexander Grothendieck',
    steps: [
      {
        title: 'Step 1: The Ax-Grothendieck Theorem',
        math: '\\text{If } F: \\mathbb{C}^n \\to \\mathbb{C}^n \\text{ is injective polynomial map} \\implies F \\text{ is bijective with polynomial inverse}',
        explanation: 'A profound theorem in algebraic geometry: any 1-to-1 polynomial map from complex space to itself is automatically an automorphism with a polynomial inverse!',
      },
      {
        title: 'Step 2: Local to Global Reduction',
        math: '\\det J_F(x) = c \\neq 0 \\implies F \\text{ is locally 1-to-1 near every point}',
        explanation: 'The Inverse Function Theorem guarantees local injectivity near every point in C^n.',
      },
      {
        title: 'Step 3: The Equivalent Core Problem',
        math: '\\mathcal{JC}_n \\iff \\left[ \\det J_F(x) = c \\neq 0 \\implies F \\text{ is globally injective over } \\mathbb{C}^n \\right]',
        explanation: 'Thanks to Ax-Grothendieck, to solve the Jacobian Conjecture, one ONLY needs to prove global injectivity!',
        insight: 'This turns an inverse-construction problem into a pure topologic/algebraic injectivity question.',
      },
    ],
  },
];

export const ProofExplorer: React.FC = () => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>('deg2');
  const [stepIndex, setStepIndex] = useState<number>(0);

  const activeCase = PROOF_CASES.find((c) => c.id === selectedCaseId) || PROOF_CASES[0];
  const currentStep = activeCase.steps[stepIndex] || activeCase.steps[0];

  return (
    <div className="widget-card my-10 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-semibold tracking-wider text-cyan-400 uppercase">Interactive Figure 5</span>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            Step-by-Step Proof & Reduction Explorer
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {PROOF_CASES.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedCaseId(c.id);
                setStepIndex(0);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                selectedCaseId === c.id
                  ? 'bg-slate-800 text-cyan-300 border-cyan-500 shadow'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 mb-6 flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-400 block mb-1">Target Case:</span>
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            {activeCase.title}
          </h4>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 block mb-1">Status / Result:</span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Proven by {activeCase.provenBy}
          </span>
        </div>
      </div>

      {/* Step Navigator Bar */}
      <div className="flex items-center justify-between gap-2 mb-6">
        <button
          onClick={() => setStepIndex((prev) => Math.max(0, prev - 1))}
          disabled={stepIndex === 0}
          className="px-3.5 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Previous Step
        </button>

        <div className="flex items-center gap-1.5">
          {activeCase.steps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setStepIndex(idx)}
              className={`w-3 h-3 rounded-full transition-all ${
                stepIndex === idx
                  ? 'bg-cyan-400 ring-4 ring-cyan-500/20 scale-110'
                  : 'bg-slate-800 hover:bg-slate-700'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => setStepIndex((prev) => Math.min(activeCase.steps.length - 1, prev + 1))}
          disabled={stepIndex === activeCase.steps.length - 1}
          className="px-3.5 py-2 text-xs font-medium bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors shadow"
        >
          Next Step <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Step Display */}
      <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between text-xs border-b border-slate-900 pb-3">
          <span className="font-semibold text-cyan-400">Step {stepIndex + 1} of {activeCase.steps.length}</span>
          <span className="text-slate-300 font-bold text-sm">{currentStep.title}</span>
        </div>

        {/* Math Block */}
        <div className="my-4 p-4 rounded-xl bg-slate-900 border border-slate-800 text-center font-mono">
          <MathView math={currentStep.math} block />
        </div>

        {/* Text Explanation */}
        <p className="text-sm text-slate-300 leading-relaxed">
          {currentStep.explanation}
        </p>

        {/* Key Insight Callout */}
        {currentStep.insight && (
          <div className="mt-4 p-3.5 rounded-lg bg-cyan-950/30 border border-cyan-900/60 text-xs text-cyan-200 flex items-start gap-2.5">
            <Award className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-cyan-300 block mb-0.5">Mathematical Insight:</strong>
              {currentStep.insight}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
