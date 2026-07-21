import React, { useState, useEffect } from 'react';
import { Moon, Sun, BarChart2 } from 'lucide-react';

interface HeaderProps {
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, setTheme }) => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 transition-colors">
      {/* Reading Progress Bar */}
      <div
        className="h-1 bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-400 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo / Journal Identity */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center text-white font-serif font-bold shadow-lg shadow-cyan-500/20">
            J
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-widest text-cyan-400 uppercase">
              Interactive Mathematical Journal
            </div>
            <div className="text-sm font-semibold text-white tracking-tight font-serif">
              Annals of Interactive Geometry
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <a
            href="#visualizer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-cyan-300 rounded-lg border border-slate-800 transition-colors"
          >
            <BarChart2 className="w-3.5 h-3.5" /> 2D Grid Visualizer
          </a>

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </div>
    </header>
  );
};
