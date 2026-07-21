import React, { useState, useEffect } from 'react';
import { List } from 'lucide-react';

interface TocItem {
  id: string;
  title: string;
}

const TOC_ITEMS: TocItem[] = [
  { id: 'intro', title: '1. Introduction & The Core Question' },
  { id: 'one-d', title: '2. The 1D Calculus Warm-Up' },
  { id: 'two-d', title: '3. Higher Dimensions & The Jacobian' },
  { id: 'conjecture', title: '4. Formal Statement of the Conjecture' },
  { id: 'alpoge', title: '5. The 2026 Alpöge Counterexample' },
  { id: 'pitfalls', title: '6. Real & Transcendental Traps' },
  { id: 'reductions', title: '7. Degree Reduction & Nilpotent Maps' },
  { id: 'proofs', title: '8. Step-by-Step Proof Explorer' },
  { id: 'sandbox', title: '9. Custom Determinant Sandbox' },
  { id: 'quiz', title: '10. Test Your Intuition' },
  { id: 'references', title: '11. Academic References' },
];

export const Toc: React.FC = () => {
  const [activeId, setActiveId] = useState<string>('intro');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px' }
    );

    TOC_ITEMS.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Desktop Sticky Sidebar TOC */}
      <aside className="hidden xl:block w-64 shrink-0 sticky top-20 h-[calc(100vh-6rem)] overflow-y-auto p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs shadow-xl backdrop-blur-sm self-start">
        <div className="flex items-center gap-2 text-slate-400 font-semibold uppercase tracking-wider text-[11px] mb-4 pb-2 border-b border-slate-800">
          <List className="w-3.5 h-3.5 text-cyan-400" /> Contents
        </div>

        <nav className="space-y-1">
          {TOC_ITEMS.map((item) => {
            const isActive = activeId === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`block py-1.5 px-3 rounded-lg border transition-all text-[11.5px] leading-snug ${
                  isActive
                    ? 'bg-slate-800 text-cyan-300 border-cyan-500/50 font-semibold shadow-sm'
                    : 'text-slate-400 border-transparent hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                {item.title}
              </a>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Drawer Floating Toggle */}
      <div className="xl:hidden fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full shadow-2xl flex items-center justify-center border border-cyan-400/30"
          title="Table of Contents"
        >
          <List className="w-5 h-5" />
        </button>

        {isOpen && (
          <div className="absolute bottom-14 right-0 w-72 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl text-xs space-y-1 text-slate-200 max-h-96 overflow-y-auto">
            <div className="font-bold text-white mb-2 pb-2 border-b border-slate-800 flex justify-between items-center">
              <span>Article Outline</span>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            {TOC_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setIsOpen(false)}
                className={`block py-2 px-3 rounded-lg border text-xs transition-all ${
                  activeId === item.id
                    ? 'bg-slate-800 text-cyan-300 border-cyan-500 font-semibold'
                    : 'text-slate-300 border-slate-800/50 hover:bg-slate-800'
                }`}
              >
                {item.title}
              </a>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
