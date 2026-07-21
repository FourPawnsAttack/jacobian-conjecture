import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathProps {
  math: string;
  block?: boolean;
  className?: string;
}

export const MathView: React.FC<MathProps> = ({ math, block = false, className = '' }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: block,
        throwOnError: false,
      });
    } catch (error) {
      console.error('KaTeX error:', error);
      return math;
    }
  }, [math, block]);

  return (
    <span
      className={`katex-wrapper ${block ? 'block-math' : 'inline-math'} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
