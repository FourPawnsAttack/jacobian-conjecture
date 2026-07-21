import React, { useState } from 'react';
import { BookOpen, ExternalLink, Copy, Check } from 'lucide-react';

export const Footer: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);

  const bibtex = `@article{jacobian_conjecture_interactive_2026,
  title = {The Mysterious Jacobian Conjecture: An Interactive Journal Exploration},
  author = {Antigravity Interactive Mathematics},
  journal = {Annals of Interactive Geometry},
  year = {2026},
  url = {https://en.wikipedia.org/wiki/Jacobian_conjecture}
}`;

  const copyBibtex = () => {
    navigator.clipboard.writeText(bibtex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer id="references" className="mt-20 border-t border-slate-800 bg-slate-950 text-slate-400 text-xs py-16 px-4">
      <div className="max-w-4xl mx-auto space-y-10">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-wider text-xs mb-3">
            <BookOpen className="w-4 h-4" /> Academic References & Literature
          </div>
          <h3 className="text-xl font-bold text-white mb-6 font-serif">
            References & Key Milestones
          </h3>

          <ol className="space-y-4 list-decimal list-inside text-slate-300 leading-relaxed text-xs">
            <li className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80">
              <strong className="text-white">Keller, Ott-Heinrich (1936).</strong> "Ganze Cremona-Transformationen". <em>Monatshefte für Mathematik und Physik</em>, 47(1), 299–306.
              <span className="block text-slate-400 text-[11px] mt-1">First formulation of the Jacobian Conjecture.</span>
            </li>
            <li className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80">
              <strong className="text-white">Bass, Hyman; Connell, Edwin H.; Wright, David (1982).</strong> "The Jacobian conjecture: reduction of degree and formal expansion of the inverse". <em>Bulletin of the American Mathematical Society</em>, 7(2), 287–330.
              <span className="block text-slate-400 text-[11px] mt-1">Proved the fundamental degree reduction theorem to cubic maps of form X - H(X) with nilpotent Jacobian.</span>
            </li>
            <li className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80">
              <strong className="text-white">Pinchuk, Sergey (1994).</strong> "A counterexample to the real Jacobian conjecture". <em>Mathematische Zeitschrift</em>, 217(1), 1–4.
              <span className="block text-slate-400 text-[11px] mt-1">Disproved the Real Jacobian Conjecture by constructing a degree 25 smooth polynomial counterexample on R^2 with positive Jacobian.</span>
            </li>
            <li className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80">
              <strong className="text-white">Belov-Kanel, Alexei; Kontsevich, Maxim (2007).</strong> "The Jacobian conjecture is stably equivalent to the Dixmier conjecture". <em>Moscow Mathematical Journal</em>, 7(2), 209–218.
              <span className="block text-slate-400 text-[11px] mt-1">Proved the deep equivalence between the Jacobian Conjecture and Dixmier's conjecture on Weyl algebra automorphisms.</span>
            </li>
          </ol>
        </div>

        {/* BibTeX Citation Box */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">How to Cite This Article (BibTeX):</span>
            <button
              onClick={copyBibtex}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-[11px] transition-colors border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy BibTeX'}
            </button>
          </div>
          <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800/60 font-mono text-[11px] text-cyan-200 overflow-x-auto">
            {bibtex}
          </pre>
        </div>

        {/* External Links & Wikipedia reference */}
        <div className="pt-6 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-4 text-slate-400">
          <div className="flex items-center gap-2">
            <span>Primary Reference:</span>
            <a
              href="https://en.wikipedia.org/wiki/Jacobian_conjecture"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline flex items-center gap-1 font-medium"
            >
              Jacobian Conjecture on Wikipedia <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div>
            Built with React, KaTeX & Canvas • Designed by Antigravity
          </div>
        </div>
      </div>
    </footer>
  );
};
