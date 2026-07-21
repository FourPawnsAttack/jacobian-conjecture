import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { MathView } from './Math';
import { CheckCircle2, XCircle, Trophy, RotateCcw } from 'lucide-react';

interface Question {
  id: number;
  questionMath: string;
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    questionMath: '\\det J_F(x) = c \\neq 0',
    questionText: 'According to the Inverse Function Theorem from calculus, what does a non-zero Jacobian determinant at a point x0 guarantee?',
    options: [
      'The mapping F is globally bijective across the entire space C^n.',
      'The mapping F is locally invertible in a small open neighborhood around x0.',
      'The inverse mapping is guaranteed to be a polynomial.',
      'The function F must be linear.',
    ],
    correctIndex: 1,
    explanation: 'The Inverse Function Theorem is a local result! It guarantees that F is locally 1-to-1 near x0, but says nothing about global injectivity.',
  },
  {
    id: 2,
    questionMath: 'F(x,y) = (e^x, \\, y e^{-x})',
    questionText: 'The function F has Jacobian determinant 1 everywhere. Why is it NOT a counterexample to the Jacobian Conjecture?',
    options: [
      'Because e^x is negative for some real numbers.',
      'Because e^x is not a polynomial, making it a transcendental function outside the conjecture’s scope.',
      'Because its Jacobian determinant is actually zero at the origin.',
      'Because it is 1-to-1 over the complex numbers C^2.',
    ],
    correctIndex: 1,
    explanation: 'The Jacobian Conjecture specifically specifies POLYNOMIAL maps! Transcendental functions like e^z have infinite complex periodicity (e^(z+2πi) = e^z), allowing them to fold without derivative zeroes.',
  },
  {
    id: 3,
    questionMath: '\\text{Alp\\ddot{o}ge Counterexample (July 2026)}',
    questionText: 'In July 2026, Levent Alpöge presented an explicit counterexample over C^3 with constant determinant det J = -2. What are the points P1 and P2 that produce a collision F(P1) = F(P2)?',
    options: [
      'P1 = (0,0,-1/4) and P2 = (1, -3/2, 13/2), both mapping to (-1/4, 0, 0).',
      'P1 = (0,0,0) and P2 = (1,1,1), both mapping to (0,0,0).',
      'P1 = (1,0,0) and P2 = (-1,0,0), both mapping to (1,1,1).',
      'P1 = (2,2,2) and P2 = (-2,-2,-2), both mapping to (0,0,0).',
    ],
    correctIndex: 0,
    explanation: 'Alpöge proved F(0,0,-1/4) = (-1/4,0,0) and F(1,-3/2,13/2) = (-1/4,0,0), proving F is non-injective despite constant det J = -2!',
  },
  {
    id: 4,
    questionMath: '\\det J_F(x,y) > 0 \\quad \\text{everywhere on } \\mathbb{R}^2',
    questionText: 'What did Sergey Pinchuk prove in 1994 regarding polynomial maps over the REAL numbers R^2?',
    options: [
      'He proved the Jacobian Conjecture for all 2D real polynomial maps.',
      'He proved that no real polynomial can have constant positive Jacobian determinant.',
      'He disproved the Real Jacobian Conjecture by constructing a real degree 25 polynomial map with det J > 0 that is non-injective.',
      'He proved that all real polynomial maps must be linear.',
    ],
    correctIndex: 2,
    explanation: 'Pinchuk constructed a degree 25 real polynomial map on R^2 with det J > 0 everywhere that is NOT 1-to-1! Over R, polynomials can fold at infinity, whereas over C complex zeros prevent this.',
  },
  {
    id: 5,
    questionMath: 'F(X) = X - H(X)',
    questionText: 'The Bass-Connell-Wright & Yagzhev reduction theorem states that to solve the Jacobian conjecture for ALL dimensions, it suffices to prove it for which special maps?',
    options: [
      'Degree 2 quadratic maps in dimension 2.',
      'Degree 3 maps with H cubic homogeneous and JH nilpotent (JH^n = 0).',
      'Linear maps with constant diagonal matrices.',
      'Exponential functions over C^n.',
    ],
    correctIndex: 1,
    explanation: 'Unbelievably, any high-degree polynomial map can be reduced to a cubic map with a nilpotent Jacobian matrix! If the conjecture holds for all cubic nilpotent maps, it holds universally.',
  },
  {
    id: 6,
    questionMath: '\\text{Ax-Grothendieck Theorem}',
    questionText: 'Why does the Ax-Grothendieck Theorem dramatically simplify the Jacobian Conjecture over C^n?',
    options: [
      'Because it proves that all polynomials are linear.',
      'Because any INJECTIVE polynomial map C^n -> C^n is automatically bijective with a polynomial inverse! Thus, one only needs to prove injectivity.',
      'Because it calculates the inverse polynomial explicitly in 1 step.',
      'Because it proves the Jacobian conjecture for n >= 100.',
    ],
    correctIndex: 1,
    explanation: 'Ax-Grothendieck eliminates the burden of constructing the inverse! It shows that for polynomial maps over C^n, injectivity automatically forces polynomial bijectivity.',
  },
];

export const Quiz: React.FC = () => {
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    if (submitted) return;
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      if (userAnswers[q.id] === q.correctIndex) score += 1;
    });
    return score;
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const score = calculateScore();
    if (score === QUIZ_QUESTIONS.length) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Fallback
      }
    }
  };

  const handleReset = () => {
    setUserAnswers({});
    setSubmitted(false);
  };

  const score = calculateScore();

  return (
    <div className="widget-card my-12 p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-semibold tracking-wider text-cyan-400 uppercase">Self Assessment</span>
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            Test Your Intuition: The Jacobian Quiz
          </h3>
        </div>
        {submitted && (
          <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-bold text-white">
              Score: <span className="text-cyan-400">{score}</span> / {QUIZ_QUESTIONS.length}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {QUIZ_QUESTIONS.map((q, qIdx) => {
          const selectedOption = userAnswers[q.id];
          const isCorrect = selectedOption === q.correctIndex;

          return (
            <div
              key={q.id}
              className={`p-5 rounded-xl border transition-all ${
                submitted
                  ? isCorrect
                    ? 'bg-emerald-950/20 border-emerald-800/60'
                    : 'bg-rose-950/20 border-rose-800/60'
                  : 'bg-slate-950 border-slate-800'
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="w-6 h-6 rounded-full bg-slate-800 text-cyan-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {qIdx + 1}
                </span>
                <div className="space-y-1">
                  <div className="font-mono text-cyan-300 text-xs">
                    <MathView math={q.questionMath} />
                  </div>
                  <h4 className="text-sm font-semibold text-white leading-snug">
                    {q.questionText}
                  </h4>
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 ml-9 mt-3">
                {q.options.map((opt, optIdx) => {
                  const isSelected = selectedOption === optIdx;
                  let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850';

                  if (submitted) {
                    if (optIdx === q.correctIndex) {
                      btnStyle = 'bg-emerald-950 text-emerald-200 border-emerald-700 font-semibold';
                    } else if (isSelected && !isCorrect) {
                      btnStyle = 'bg-rose-950 text-rose-200 border-rose-700';
                    } else {
                      btnStyle = 'bg-slate-900 border-slate-800/40 opacity-50';
                    }
                  } else if (isSelected) {
                    btnStyle = 'bg-cyan-950 text-cyan-200 border-cyan-500 font-semibold ring-1 ring-cyan-500/50';
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      disabled={submitted}
                      className={`p-3 rounded-lg border text-left text-xs leading-relaxed transition-all flex items-start gap-2 ${btnStyle}`}
                    >
                      <span className="font-mono text-slate-400 shrink-0">
                        {String.fromCharCode(65 + optIdx)}.
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Submitted Explanation */}
              {submitted && (
                <div className="ml-9 mt-3 p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                  {isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <strong className={isCorrect ? 'text-emerald-400' : 'text-rose-400'}>
                      {isCorrect ? 'Correct! ' : 'Incorrect. '}
                    </strong>
                    {q.explanation}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={Object.keys(userAnswers).length < QUIZ_QUESTIONS.length}
            className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Quiz & Check Answers
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all border border-slate-700 flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Retake Quiz
          </button>
        )}
      </div>
    </div>
  );
};
