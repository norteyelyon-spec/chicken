import React from 'react';
import type { SubjectId } from '../types';

interface TopicVisualDiagramProps {
  subject: SubjectId;
  title?: string;
  compact?: boolean;
}

export const TopicVisualDiagram: React.FC<TopicVisualDiagramProps> = ({
  subject,
  title = '',
  compact = false,
}) => {
  const lower = title.toLowerCase();
  const sizeClass = compact ? 'w-20 h-14' : 'w-28 h-20';

  const renderGraphic = () => {
    switch (subject) {
      case 'physics': {
        if (lower.includes('circuit') || lower.includes('electric') || lower.includes('field')) {
          return (
            <svg viewBox="0 0 120 80" className={sizeClass} aria-hidden="true">
              <rect x="14" y="16" width="92" height="48" rx="6" fill="none" stroke="#1e293b" strokeWidth="1.5" />
              <path d="M14 40 H36 M42 30 V50 M48 34 V46 M48 40 H106" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" />
              <rect x="64" y="10" width="28" height="12" rx="3" fill="#0f172a" stroke="#22d3ee" strokeWidth="1.8" />
              <text x="78" y="19" textAnchor="middle" fill="#67e8f9" fontSize="8" fontFamily="monospace">R</text>
              <circle cx="28" cy="64" r="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.6" />
              <text x="28" y="67" textAnchor="middle" fill="#7dd3fc" fontSize="7" fontFamily="monospace">A</text>
            </svg>
          );
        }
        if (lower.includes('wave') || lower.includes('optic') || lower.includes('light')) {
          return (
            <svg viewBox="0 0 120 80" className={sizeClass} aria-hidden="true">
              <line x1="8" y1="40" x2="112" y2="40" stroke="#334155" strokeWidth="1.2" strokeDasharray="3 3" />
              <path
                d="M10 40 Q 22 14, 34 40 T 58 40 T 82 40 T 106 40"
                fill="none"
                stroke="#22d3ee"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <line x1="22" y1="26" x2="70" y2="26" stroke="#38bdf8" strokeWidth="1.2" />
              <circle cx="22" cy="26" r="2.2" fill="#22d3ee" />
              <circle cx="70" cy="26" r="2.2" fill="#22d3ee" />
              <text x="46" y="19" textAnchor="middle" fill="#67e8f9" fontSize="9" fontFamily="monospace">λ</text>
            </svg>
          );
        }
        return (
          <svg viewBox="0 0 120 80" className={sizeClass} aria-hidden="true">
            <line x1="12" y1="64" x2="108" y2="64" stroke="#334155" strokeWidth="1.5" />
            <line x1="16" y1="14" x2="16" y2="68" stroke="#334155" strokeWidth="1.5" />
            <path d="M16 64 Q 60 8, 104 64" fill="none" stroke="#22d3ee" strokeWidth="2.2" strokeDasharray="4 2" />
            <line x1="16" y1="64" x2="40" y2="28" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="60" cy="36" r="3" fill="#22d3ee" />
            <text x="72" y="25" fill="#67e8f9" fontSize="8" fontFamily="monospace">H max</text>
          </svg>
        );
      }

      case 'chemistry': {
        if (lower.includes('atom') || lower.includes('atomic') || lower.includes('quantum')) {
          return (
            <svg viewBox="0 0 120 80" className={sizeClass} aria-hidden="true">
              <ellipse cx="60" cy="40" rx="34" ry="13" transform="rotate(28 60 40)" fill="none" stroke="#10b981" strokeWidth="1.6" />
              <ellipse cx="60" cy="40" rx="34" ry="13" transform="rotate(-28 60 40)" fill="none" stroke="#34d399" strokeWidth="1.6" />
              <ellipse cx="60" cy="40" rx="13" ry="30" fill="none" stroke="#6ee7b7" strokeWidth="1.3" strokeDasharray="3 2" />
              <circle cx="60" cy="40" r="6" fill="#10b981" />
              <circle cx="90" cy="30" r="2.8" fill="#67e8f9" />
              <circle cx="30" cy="50" r="2.8" fill="#67e8f9" />
              <circle cx="60" cy="10" r="2.8" fill="#fbbf24" />
            </svg>
          );
        }
        if (lower.includes('titration') || lower.includes('acid') || lower.includes('stoich')) {
          return (
            <svg viewBox="0 0 120 80" className={sizeClass} aria-hidden="true">
              <path d="M12 62 C 38 62, 50 60, 56 38 C 62 16, 76 16, 106 16" fill="none" stroke="#10b981" strokeWidth="2.2" />
              <line x1="12" y1="39" x2="106" y2="39" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="56" cy="39" r="3.5" fill="#34d399" />
              <text x="76" y="34" fill="#6ee7b7" fontSize="8" fontFamily="monospace">pH 7.0</text>
              <line x1="12" y1="14" x2="12" y2="66" stroke="#475569" strokeWidth="1.3" />
              <line x1="12" y1="66" x2="108" y2="66" stroke="#475569" strokeWidth="1.3" />
            </svg>
          );
        }
        return (
          <svg viewBox="0 0 120 80" className={sizeClass} aria-hidden="true">
            <polygon points="60,16 82,28 82,52 60,64 38,52 38,28" fill="none" stroke="#10b981" strokeWidth="2" />
            <circle cx="60" cy="40" r="12" fill="none" stroke="#34d399" strokeWidth="1.4" strokeDasharray="3 2" />
            <circle cx="60" cy="16" r="3" fill="#10b981" />
            <circle cx="82" cy="52" r="3" fill="#10b981" />
            <circle cx="38" cy="52" r="3" fill="#10b981" />
          </svg>
        );
      }

      case 'biology': {
        if (lower.includes('gene') || lower.includes('dna') || lower.includes('hered')) {
          return (
            <svg viewBox="0 0 120 80" className={sizeClass} aria-hidden="true">
              <path d="M16 24 C 36 24, 44 56, 60 56 C 76 56, 84 24, 104 24" fill="none" stroke="#84cc16" strokeWidth="2.2" />
              <path d="M16 56 C 36 56, 44 24, 60 24 C 76 24, 84 56, 104 56" fill="none" stroke="#bef264" strokeWidth="2.2" />
              <line x1="28" y1="30" x2="28" y2="50" stroke="#4d7c0f" strokeWidth="1.5" />
              <line x1="60" y1="24" x2="60" y2="56" stroke="#4d7c0f" strokeWidth="1.5" />
              <line x1="92" y1="30" x2="92" y2="50" stroke="#4d7c0f" strokeWidth="1.5" />
            </svg>
          );
        }
        return (
          <svg viewBox="0 0 120 80" className={sizeClass} aria-hidden="true">
            <ellipse cx="60" cy="40" rx="44" ry="26" fill="#0f172a" stroke="#84cc16" strokeWidth="2" />
            <ellipse cx="60" cy="40" rx="38" ry="20" fill="none" stroke="#4d7c0f" strokeWidth="1" strokeDasharray="3 2" />
            <circle cx="48" cy="38" r="10" fill="#1a2e05" stroke="#a3e635" strokeWidth="1.8" />
            <circle cx="46" cy="36" r="3.5" fill="#bef264" />
            <ellipse cx="78" cy="44" rx="9" ry="5" fill="none" stroke="#a3e635" strokeWidth="1.4" />
          </svg>
        );
      }

      case 'addmaths':
        return (
          <svg viewBox="0 0 120 80" className={sizeClass} aria-hidden="true">
            <line x1="14" y1="64" x2="108" y2="64" stroke="#475569" strokeWidth="1.3" />
            <line x1="22" y1="12" x2="22" y2="68" stroke="#475569" strokeWidth="1.3" />
            <path d="M26 58 L26 36 C 46 20, 68 22, 86 16 L86 64 L26 64 Z" fill="#8b5cf6" fillOpacity="0.18" />
            <path d="M20 50 C 42 18, 72 24, 102 14" fill="none" stroke="#a78bfa" strokeWidth="2.2" />
            <line x1="36" y1="48" x2="88" y2="16" stroke="#c4b5fd" strokeWidth="1.3" strokeDasharray="3 2" />
            <text x="54" y="54" fill="#ddd6fe" fontSize="9" fontFamily="monospace">∫ f(x)dx</text>
          </svg>
        );

      case 'ict':
        return (
          <svg viewBox="0 0 120 80" className={sizeClass} aria-hidden="true">
            <line x1="60" y1="40" x2="24" y2="20" stroke="#3b82f6" strokeWidth="1.6" />
            <line x1="60" y1="40" x2="96" y2="20" stroke="#3b82f6" strokeWidth="1.6" />
            <line x1="60" y1="40" x2="24" y2="60" stroke="#3b82f6" strokeWidth="1.6" />
            <line x1="60" y1="40" x2="96" y2="60" stroke="#3b82f6" strokeWidth="1.6" />
            <rect x="50" y="31" width="20" height="18" rx="4" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1.8" />
            <circle cx="24" cy="20" r="6" fill="#0f172a" stroke="#60a5fa" strokeWidth="1.6" />
            <circle cx="96" cy="20" r="6" fill="#0f172a" stroke="#60a5fa" strokeWidth="1.6" />
            <circle cx="24" cy="60" r="6" fill="#0f172a" stroke="#60a5fa" strokeWidth="1.6" />
            <circle cx="96" cy="60" r="6" fill="#0f172a" stroke="#60a5fa" strokeWidth="1.6" />
            <text x="60" y="43" textAnchor="middle" fill="#bfdbfe" fontSize="7" fontFamily="monospace">HUB</text>
          </svg>
        );

      case 'coremath': {
        if (lower.includes('circle')) {
          return (
            <svg viewBox="0 0 120 80" className={sizeClass} aria-hidden="true">
              <circle cx="60" cy="40" r="26" fill="none" stroke="#f59e0b" strokeWidth="2" />
              <circle cx="60" cy="40" r="2.2" fill="#fbbf24" />
              <polygon points="60,14 38,54 84,54" fill="none" stroke="#fbbf24" strokeWidth="1.6" />
              <polyline points="38,54 60,40 84,54" fill="none" stroke="#fde68a" strokeWidth="1.4" strokeDasharray="3 2" />
              <text x="58" y="32" fill="#fcd34d" fontSize="8" fontFamily="monospace">θ</text>
              <text x="56" y="49" fill="#fde68a" fontSize="8" fontFamily="monospace">2θ</text>
            </svg>
          );
        }
        return (
          <svg viewBox="0 0 120 80" className={sizeClass} aria-hidden="true">
            <polygon points="24,62 94,62 94,20" fill="#f59e0b" fillOpacity="0.1" stroke="#f59e0b" strokeWidth="2" />
            <rect x="84" y="52" width="10" height="10" fill="none" stroke="#fbbf24" strokeWidth="1.3" />
            <text x="38" y="57" fill="#fcd34d" fontSize="8" fontFamily="monospace">θ</text>
            <text x="54" y="37" fill="#fde68a" fontSize="8" fontFamily="monospace">c</text>
          </svg>
        );
      }

      case 'english':
        return (
          <svg viewBox="0 0 120 80" className={sizeClass} aria-hidden="true">
            <rect x="46" y="10" width="28" height="14" rx="4" fill="#1f1218" stroke="#f43f5e" strokeWidth="1.6" />
            <text x="60" y="20" textAnchor="middle" fill="#fda4af" fontSize="8" fontFamily="monospace">S</text>
            <line x1="54" y1="24" x2="32" y2="44" stroke="#fb7185" strokeWidth="1.5" />
            <line x1="66" y1="24" x2="88" y2="44" stroke="#fb7185" strokeWidth="1.5" />
            <rect x="16" y="44" width="32" height="14" rx="4" fill="#0f172a" stroke="#fb7185" strokeWidth="1.5" />
            <text x="32" y="54" textAnchor="middle" fill="#fecdd3" fontSize="8" fontFamily="monospace">NP</text>
            <rect x="72" y="44" width="32" height="14" rx="4" fill="#0f172a" stroke="#fb7185" strokeWidth="1.5" />
            <text x="88" y="54" textAnchor="middle" fill="#fecdd3" fontSize="8" fontFamily="monospace">VP</text>
          </svg>
        );

      case 'integratedscience':
        return (
          <svg viewBox="0 0 120 80" className={sizeClass} aria-hidden="true">
            <circle cx="60" cy="40" r="24" fill="none" stroke="#14b8a6" strokeWidth="1.8" strokeDasharray="5 3" />
            <circle cx="60" cy="16" r="6" fill="#0f172a" stroke="#2dd4bf" strokeWidth="1.8" />
            <circle cx="82" cy="52" r="6" fill="#0f172a" stroke="#2dd4bf" strokeWidth="1.8" />
            <circle cx="38" cy="52" r="6" fill="#0f172a" stroke="#2dd4bf" strokeWidth="1.8" />
            <text x="60" y="18.5" textAnchor="middle" fill="#99f6e4" fontSize="7" fontFamily="monospace">N₂</text>
            <text x="82" y="54.5" textAnchor="middle" fill="#99f6e4" fontSize="6.5" fontFamily="monospace">NO₃</text>
            <text x="38" y="54.5" textAnchor="middle" fill="#99f6e4" fontSize="6.5" fontFamily="monospace">NH₄</text>
          </svg>
        );

      case 'socialstudies':
        return (
          <svg viewBox="0 0 120 80" className={sizeClass} aria-hidden="true">
            <line x1="60" y1="16" x2="60" y2="64" stroke="#f97316" strokeWidth="2" />
            <line x1="28" y1="26" x2="92" y2="26" stroke="#fb923c" strokeWidth="2" />
            <line x1="42" y1="64" x2="78" y2="64" stroke="#f97316" strokeWidth="2" />
            <path d="M22 44 L28 26 L34 44 Z" fill="none" stroke="#fdba74" strokeWidth="1.4" />
            <path d="M86 44 L92 26 L98 44 Z" fill="none" stroke="#fdba74" strokeWidth="1.4" />
            <path d="M20 44 Q 28 52, 36 44" fill="none" stroke="#f97316" strokeWidth="1.8" />
            <path d="M84 44 Q 92 52, 100 44" fill="none" stroke="#f97316" strokeWidth="1.8" />
          </svg>
        );
    }
  };

  return (
    <div className="shrink-0 rounded-xl bg-slate-950/90 border border-slate-800/90 p-1.5 flex items-center justify-center">
      {renderGraphic()}
    </div>
  );
};
