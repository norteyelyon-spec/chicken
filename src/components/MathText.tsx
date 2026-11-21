import React from 'react';
import {
  highlightCodeLine,
  parseMarkdownBlocks,
  renderInlineTextWithMath,
  renderKatexSafe,
} from '../utils/markdownRenderer';

interface MathTextProps {
  text: string;
  className?: string;
}

export const MathText: React.FC<MathTextProps> = ({ text, className = '' }) => {
  const lines = text.split('\n');
  return (
    <span className={className}>
      {lines.map((line, i) => (
        <React.Fragment key={i}>
          {i > 0 && <br />}
          <span dangerouslySetInnerHTML={{ __html: renderInlineTextWithMath(line) }} />
        </React.Fragment>
      ))}
    </span>
  );
};

interface MarkdownPreviewProps {
  content: string;
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content }) => {
  const blocks = parseMarkdownBlocks(content);
  if (blocks.length === 0) {
    return <p className="text-sm text-slate-400 italic">Nothing written yet. Start typing or insert a template.</p>;
  }

  return (
    <div className="space-y-4 text-slate-200 leading-relaxed">
      {blocks.map((block, idx) => {
        if (block.type === 'heading') {
          if (block.level === 1) {
            return (
              <h1 key={idx} className="text-xl font-bold text-white tracking-tight border-b border-slate-800 pb-2">
                <MathText text={block.text} />
              </h1>
            );
          }
          if (block.level === 2) {
            return (
              <h2 key={idx} className="text-base font-semibold text-cyan-300 pt-1">
                <MathText text={block.text} />
              </h2>
            );
          }
          return (
            <h3 key={idx} className="text-sm font-semibold text-slate-200">
              <MathText text={block.text} />
            </h3>
          );
        }

        if (block.type === 'math') {
          return (
            <div
              key={idx}
              className="py-2 px-4 rounded-lg bg-slate-950/70 border border-slate-800/80 overflow-x-auto text-slate-100"
              dangerouslySetInnerHTML={{ __html: renderKatexSafe(block.tex, true) }}
            />
          );
        }

        if (block.type === 'code') {
          return (
            <div key={idx} className="rounded-lg border border-slate-800 bg-slate-950 overflow-hidden">
              <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-400 font-mono">
                <span>{block.lang.toUpperCase()}</span>
              </div>
              <pre className="p-3.5 text-xs sm:text-sm font-mono overflow-x-auto leading-6">
                <code
                  dangerouslySetInnerHTML={{
                    __html: highlightCodeLine(block.code, block.lang),
                  }}
                />
              </pre>
            </div>
          );
        }

        if (block.type === 'list') {
          return (
            <ul key={idx} className="space-y-1.5 pl-5 list-disc text-sm text-slate-300">
              {block.items.map((item, itemIdx) => (
                <li key={itemIdx}>
                  <MathText text={item} />
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === 'table') {
          return (
            <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950/75 overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/80 text-cyan-300">
                    {block.headers.map((header, hIdx) => (
                      <th key={hIdx} className="py-2 px-2.5 font-semibold whitespace-nowrap">
                        <MathText text={header} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {block.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-900/40">
                      {row.map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          className={`py-2 px-2.5 align-top ${
                            cIdx === 0 ? 'font-medium text-white' : 'text-slate-300'
                          }`}
                        >
                          <MathText text={cell} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        return (
          <p key={idx} className="text-sm text-slate-300 leading-7">
            <MathText text={block.text} />
          </p>
        );
      })}
    </div>
  );
};
