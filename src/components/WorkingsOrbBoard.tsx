import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowDownLeft,
  ArrowDownRight,
  ArrowUpLeft,
  ArrowUpRight,
  Calculator,
  Check,
  Columns2,
  Copy,
  Download,
  Eraser,
  Eye,
  Grid3X3,
  Maximize2,
  Minimize2,
  PenLine,
  PenTool,
  RotateCcw,
  Sigma,
  Trash2,
  Undo2,
  X,
} from 'lucide-react';
import type { OrbCorner } from '../types';
import { computeOrbCornerFromPoint, ORB_CORNER_STORAGE_KEY } from '../utils/personalization';
import { evaluateWorkingsExpression, type AngleMode } from '../utils/workingsMath.ts';
import { MarkdownPreview, MathText } from './MathText.tsx';

type BoardTab = 'sketch' | 'steps';
type PaperStyle = 'grid' | 'lined' | 'blank';
type StepsViewMode = 'split' | 'write' | 'preview';

const CANVAS_STORAGE_KEY = 'wassce_workings_canvas_v1';
const NOTES_STORAGE_KEY = 'wassce_workings_notes_v1';
const EXPR_STORAGE_KEY = 'wassce_workings_expr_v1';

interface WorkingsOrbBoardProps {
  orbCorner?: OrbCorner;
  onChangeOrbCorner?: (corner: OrbCorner) => void;
}

const CORNER_POSITION_CLASSES: Record<OrbCorner, string> = {
  'top-left': 'top-20 left-4 md:left-[calc(var(--sidebar-w,0px)+1rem)]',
  'top-right': 'top-20 right-4',
  'bottom-left': 'bottom-24 left-4 md:bottom-6 md:left-[calc(var(--sidebar-w,0px)+1rem)]',
  'bottom-right': 'bottom-24 right-4 md:bottom-6 md:right-6',
};

const BOARD_POSITION_CLASSES: Record<OrbCorner, { compact: string; max: string; origin: string }> = {
  'top-left': {
    compact: 'top-20 left-3 right-3 sm:right-auto md:left-[calc(var(--sidebar-w,0px)+1rem)] sm:w-[580px] h-[min(78vh,620px)]',
    max: 'top-20 left-4 right-4 md:left-[calc(var(--sidebar-w,0px)+1rem)] md:right-auto md:w-[min(78vw,920px)] h-[min(82vh,720px)]',
    origin: 'top left',
  },
  'top-right': {
    compact: 'top-20 left-3 right-3 sm:left-auto sm:right-6 sm:w-[580px] h-[min(78vh,620px)]',
    max: 'top-20 left-4 right-4 md:right-6 md:left-auto md:w-[min(92vw,960px)] h-[min(82vh,720px)]',
    origin: 'top right',
  },
  'bottom-left': {
    compact: 'bottom-20 left-3 right-3 sm:right-auto md:left-[calc(var(--sidebar-w,0px)+1rem)] md:bottom-6 sm:w-[580px] h-[min(78vh,620px)]',
    max: 'bottom-20 left-4 right-4 md:bottom-6 md:left-[calc(var(--sidebar-w,0px)+1rem)] md:right-auto md:w-[min(78vw,920px)] h-[min(84vh,740px)]',
    origin: 'bottom left',
  },
  'bottom-right': {
    compact: 'bottom-20 right-3 left-3 sm:left-auto sm:right-6 md:bottom-6 sm:w-[580px] h-[min(78vh,620px)]',
    max: 'bottom-20 right-4 left-4 md:bottom-6 md:right-6 md:left-auto md:w-[min(92vw,960px)] h-[min(84vh,740px)]',
    origin: 'bottom right',
  },
};

const PEN_COLORS = [
  { id: 'neon-blue', label: 'Neon Blue', hex: '#38bdf8' },
  { id: 'chalk-white', label: 'Chalk White', hex: '#f8fafc' },
  { id: 'solar-amber', label: 'Solar Amber', hex: '#fbbf24' },
  { id: 'emerald', label: 'Emerald', hex: '#34d399' },
] as const;

const PEN_WIDTHS = [
  { id: 'fine', label: 'Fine', size: 2 },
  { id: 'medium', label: 'Med', size: 4 },
  { id: 'bold', label: 'Bold', size: 7 },
] as const;

const QUICK_SYMBOLS = ['π', 'θ', 'Δ', '√(', '²', '³', '×', '÷', 'Ω', '→', '⇌'];

const KATEX_SNIPPETS: { id: string; label: string; snippet: string; title: string }[] = [
  {
    id: 'frac',
    label: 'a/b',
    title: 'Insert KaTeX fraction',
    snippet: '$\\frac{a}{b}$',
  },
  {
    id: 'sqrt',
    label: '√x',
    title: 'Insert KaTeX square root',
    snippet: '$\\sqrt{x}$',
  },
  {
    id: 'quad',
    label: 'Quad',
    title: 'Insert quadratic formula',
    snippet: '\n$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$\n',
  },
  {
    id: 'integral',
    label: '∫ dx',
    title: 'Insert definite integral',
    snippet: '\n$$\\int_{a}^{b} f(x)\\,dx$$\n',
  },
  {
    id: 'deriv',
    label: 'd/dx',
    title: 'Insert derivative notation',
    snippet: '$\\frac{dy}{dx}$',
  },
  {
    id: 'sum',
    label: '∑',
    title: 'Insert summation',
    snippet: '$\\sum_{i=1}^{n} x_i$',
  },
  {
    id: 'matrix',
    label: 'Matrix',
    title: 'Insert 2x2 matrix',
    snippet: '\n$$A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$$\n',
  },
  {
    id: 'chem',
    label: '⇌',
    title: 'Insert chemical equilibrium equation',
    snippet: '\n$$\\text{N}_2 + 3\\text{H}_2 \\rightleftharpoons 2\\text{NH}_3$$\n',
  },
];

export const WorkingsOrbBoard: React.FC<WorkingsOrbBoardProps> = ({
  orbCorner: controlledCorner,
  onChangeOrbCorner,
}) => {
  const [internalCorner, setInternalCorner] = useState<OrbCorner>(() => {
    try {
      const saved = localStorage.getItem(ORB_CORNER_STORAGE_KEY);
      if (
        saved === 'top-left' ||
        saved === 'top-right' ||
        saved === 'bottom-left' ||
        saved === 'bottom-right'
      ) {
        return saved;
      }
    } catch {
      // ignore storage errors
    }
    return 'bottom-right';
  });

  const activeCorner = controlledCorner ?? internalCorner;

  const setCorner = useCallback(
    (next: OrbCorner) => {
      setInternalCorner(next);
      try {
        localStorage.setItem(ORB_CORNER_STORAGE_KEY, next);
      } catch {
        // ignore storage errors
      }
      onChangeOrbCorner?.(next);
    },
    [onChangeOrbCorner]
  );

  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const orbDragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    moved: boolean;
  } | null>(null);
  const suppressNextOrbClickRef = useRef(false);

  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [activeTab, setActiveTab] = useState<BoardTab>('sketch');
  const [stepsViewMode, setStepsViewMode] = useState<StepsViewMode>('split');
  const [paperStyle, setPaperStyle] = useState<PaperStyle>('grid');
  const [penColor, setPenColor] = useState<string>(PEN_COLORS[0].hex);
  const [penWidth, setPenWidth] = useState<number>(PEN_WIDTHS[1].size);
  const [isEraser, setIsEraser] = useState(false);

  const [savedCanvasUrl, setSavedCanvasUrl] = useState<string>(() => {
    try {
      return localStorage.getItem(CANVAS_STORAGE_KEY) ?? '';
    } catch {
      return '';
    }
  });
  const [notesText, setNotesText] = useState<string>(() => {
    try {
      return localStorage.getItem(NOTES_STORAGE_KEY) ?? '';
    } catch {
      return '';
    }
  });
  const [exprText, setExprText] = useState<string>(() => {
    try {
      return localStorage.getItem(EXPR_STORAGE_KEY) ?? '';
    } catch {
      return '';
    }
  });
  const [angleMode, setAngleMode] = useState<AngleMode>('deg');
  const [copiedNotes, setCopiedNotes] = useState(false);
  const [canUndo, setCanUndo] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const undoStackRef = useRef<string[]>([]);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const notesTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const hasSavedWorkings = Boolean(savedCanvasUrl || notesText.trim() || exprText.trim());

  const liveEval = useMemo(() => {
    if (!exprText.trim()) return null;
    return evaluateWorkingsExpression(exprText, angleMode);
  }, [exprText, angleMode]);

  useEffect(() => {
    try {
      localStorage.setItem(NOTES_STORAGE_KEY, notesText);
    } catch {
      // ignore storage quota errors
    }
  }, [notesText]);

  useEffect(() => {
    try {
      localStorage.setItem(EXPR_STORAGE_KEY, exprText);
    } catch {
      // ignore storage quota errors
    }
  }, [exprText]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  const persistCanvasSnapshot = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const dataUrl = canvas.toDataURL('image/png');
      setSavedCanvasUrl(dataUrl);
      localStorage.setItem(CANVAS_STORAGE_KEY, dataUrl);
    } catch {
      // ignore storage quota issues
    }
  }, []);

  const syncCanvasDimensions = useCallback(() => {
    const canvas = canvasRef.current;
    const host = containerRef.current;
    if (!canvas || !host) return;
    const rect = host.getBoundingClientRect();
    if (rect.width < 40 || rect.height < 40) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const targetW = Math.floor(rect.width * dpr);
    const targetH = Math.floor(rect.height * dpr);

    if (canvas.width === targetW && canvas.height === targetH) return;

    const existingUrl =
      canvas.width > 0 && canvas.height > 0 ? canvas.toDataURL('image/png') : savedCanvasUrl;

    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const sourceToRestore = existingUrl || savedCanvasUrl;
    if (sourceToRestore) {
      const img = new Image();
      img.onload = () => {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.restore();
      };
      img.src = sourceToRestore;
    }
  }, [savedCanvasUrl]);

  useEffect(() => {
    if (!isOpen || activeTab !== 'sketch') return;
    let raf = requestAnimationFrame(() => syncCanvasDimensions());
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => syncCanvasDimensions());
    });
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [isOpen, activeTab, isMaximized, syncCanvasDimensions]);

  const getPointerPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const snapshot = canvas.toDataURL('image/png');
      undoStackRef.current = [...undoStackRef.current.slice(-19), snapshot];
      setCanUndo(true);
    } catch {
      // ignore snapshot failure
    }

    canvas.setPointerCapture(e.pointerId);
    const pt = getPointerPos(e);
    isDrawingRef.current = true;
    lastPointRef.current = pt;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';
    ctx.strokeStyle = isEraser ? '#000000' : penColor;
    ctx.lineWidth = isEraser ? penWidth * 3.5 : penWidth;

    ctx.beginPath();
    ctx.arc(pt.x, pt.y, isEraser ? penWidth * 1.75 : penWidth * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = isEraser ? '#000000' : penColor;
    ctx.fill();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !lastPointRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pt = getPointerPos(e);
    const prev = lastPointRef.current;

    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(pt.x, pt.y);
    ctx.stroke();

    lastPointRef.current = pt;
  };

  const handlePointerEnd = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    lastPointRef.current = null;
    try {
      canvasRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      // ignore if already released
    }
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.globalCompositeOperation = 'source-over';
    }
    persistCanvasSnapshot();
  };

  const handleUndo = () => {
    const prev = undoStackRef.current.pop();
    setCanUndo(undoStackRef.current.length > 0);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (prev) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.restore();
        persistCanvasSnapshot();
      };
      img.src = prev;
    } else {
      ctx.restore();
      setSavedCanvasUrl('');
      try {
        localStorage.removeItem(CANVAS_STORAGE_KEY);
      } catch {
        // ignore
      }
    }
  };

  const handleClearSketch = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      try {
        undoStackRef.current = [...undoStackRef.current.slice(-19), canvas.toDataURL('image/png')];
        setCanUndo(true);
      } catch {
        // ignore
      }
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
      }
    }
    setSavedCanvasUrl('');
    try {
      localStorage.removeItem(CANVAS_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const handleDownloadSketch = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const exCtx = exportCanvas.getContext('2d');
    if (!exCtx) return;
    exCtx.fillStyle = '#060d1c';
    exCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    exCtx.drawImage(canvas, 0, 0);
    const link = document.createElement('a');
    link.download = `wassce-workings-${new Date().toISOString().slice(0, 10)}.png`;
    link.href = exportCanvas.toDataURL('image/png');
    link.click();
  };

  const insertSymbolToNotes = (sym: string) => {
    if (stepsViewMode === 'preview') {
      setStepsViewMode('split');
    }
    const area = notesTextareaRef.current;
    if (!area) {
      setNotesText((prev) => `${prev}${sym}`);
      return;
    }
    const start = area.selectionStart ?? notesText.length;
    const end = area.selectionEnd ?? notesText.length;
    const updated = `${notesText.slice(0, start)}${sym}${notesText.slice(end)}`;
    setNotesText(updated);
    requestAnimationFrame(() => {
      area.focus();
      const cursor = start + sym.length;
      area.setSelectionRange(cursor, cursor);
    });
  };

  const handleAppendEvalToNotes = () => {
    if (!liveEval?.ok) return;
    const formattedLine = `$$${exprText.trim()} = ${liveEval.formatted}$$`;
    setNotesText((prev) => (prev.trim() ? `${prev.trimEnd()}\n${formattedLine}` : formattedLine));
  };

  const handleCopyNotes = async () => {
    if (!notesText.trim()) return;
    try {
      await navigator.clipboard.writeText(notesText);
      setCopiedNotes(true);
      setTimeout(() => setCopiedNotes(false), 1800);
    } catch {
      // ignore clipboard errors
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.section
            role="dialog"
            aria-label="Robotic Workings Board"
            data-testid="workings-board"
            data-orb-corner={activeCorner}
            initial={{ opacity: 0, scale: 0.88, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 18 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: BOARD_POSITION_CLASSES[activeCorner].origin }}
            className={`fixed z-50 flex flex-col rounded-2xl border border-cyan-400/50 bg-slate-950/95 backdrop-blur-md shadow-[0_0_40px_rgba(0,180,255,0.22)] overflow-hidden ${
              isMaximized
                ? BOARD_POSITION_CLASSES[activeCorner].max
                : BOARD_POSITION_CLASSES[activeCorner].compact
            }`}
          >
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-slate-800/90 bg-slate-900/90 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-slate-950 border border-cyan-400/70 shadow-[0_0_14px_rgba(0,212,255,0.45)] flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 32 32" className="w-5 h-5" aria-hidden="true">
                    <circle cx="16" cy="16" r="12" fill="#041224" stroke="#38bdf8" strokeWidth="1.8" />
                    <rect x="8.5" y="12" width="15" height="8" rx="4" fill="#08243f" stroke="#7dd3fc" strokeWidth="1.2" />
                    <circle cx="13" cy="16" r="1.7" fill="#38bdf8" />
                    <circle cx="19" cy="16" r="1.7" fill="#38bdf8" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h2 className="font-display text-sm font-bold text-white truncate">
                    Workings Board
                  </h2>
                  <p className="text-[11px] text-cyan-300/80 truncate">
                    Sketches, KaTeX equations &amp; calculations
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {/* 4-Corner Dock Switcher */}
                <div
                  role="group"
                  aria-label="Move workings ball corner"
                  className="hidden sm:flex items-center p-0.5 rounded-lg bg-slate-950 border border-slate-800"
                >
                  {(
                    [
                      { id: 'top-left', label: 'Move workings ball to top-left corner', icon: ArrowUpLeft },
                      { id: 'top-right', label: 'Move workings ball to top-right corner', icon: ArrowUpRight },
                      { id: 'bottom-left', label: 'Move workings ball to bottom-left corner', icon: ArrowDownLeft },
                      { id: 'bottom-right', label: 'Move workings ball to bottom-right corner', icon: ArrowDownRight },
                    ] as const
                  ).map((item) => {
                    const Icon = item.icon;
                    const active = activeCorner === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setCorner(item.id)}
                        data-testid={`orb-dock-${item.id}`}
                        aria-label={item.label}
                        aria-pressed={active}
                        title={item.label}
                        className={`p-1 rounded transition-colors ${
                          active
                            ? 'bg-cyan-500 text-slate-950'
                            : 'text-slate-400 hover:text-cyan-300'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center p-0.5 rounded-lg bg-slate-950 border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setActiveTab('sketch')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                      activeTab === 'sketch'
                        ? 'bg-cyan-500 text-slate-950'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    <span>Sketch</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('steps')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                      activeTab === 'steps'
                        ? 'bg-cyan-500 text-slate-950'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>KaTeX &amp; Calc</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMaximized((m) => !m)}
                  aria-label={isMaximized ? 'Compact workings board' : 'Expand workings board'}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
                >
                  {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Minimize workings board"
                  data-testid="workings-board-close"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body */}
            {activeTab === 'sketch' ? (
              <div className="flex-1 min-h-0 flex flex-col">
                {/* Drawing Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 border-b border-slate-800/80 bg-slate-900/55 shrink-0">
                  <div className="flex items-center gap-1.5">
                    {PEN_COLORS.map((c) => {
                      const active = !isEraser && penColor === c.hex;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            setIsEraser(false);
                            setPenColor(c.hex);
                          }}
                          aria-label={`${c.label} pen`}
                          aria-pressed={active}
                          className={`w-6 h-6 rounded-full border-2 transition-transform ${
                            active ? 'border-white scale-110' : 'border-slate-700 hover:scale-105'
                          }`}
                          style={{ backgroundColor: c.hex }}
                        />
                      );
                    })}

                    <span className="h-4 w-px bg-slate-800 mx-1" aria-hidden="true" />

                    <div className="flex items-center gap-1">
                      {PEN_WIDTHS.map((w) => (
                        <button
                          key={w.id}
                          type="button"
                          onClick={() => setPenWidth(w.size)}
                          className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                            penWidth === w.size
                              ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800'
                          }`}
                        >
                          {w.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setIsEraser((v) => !v)}
                      aria-pressed={isEraser}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                        isEraser
                          ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <Eraser className="w-3.5 h-3.5" />
                      <span>Eraser</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setPaperStyle((prev) =>
                          prev === 'grid' ? 'lined' : prev === 'lined' ? 'blank' : 'grid'
                        )
                      }
                      aria-label="Switch board background"
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-slate-300 hover:bg-slate-800 transition-colors"
                    >
                      <Grid3X3 className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="capitalize">{paperStyle}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleUndo}
                      disabled={!canUndo}
                      aria-label="Undo last stroke"
                      className="p-1.5 rounded-md text-slate-300 hover:bg-slate-800 disabled:opacity-35 transition-colors"
                    >
                      <Undo2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadSketch}
                      aria-label="Download workings as PNG"
                      className="p-1.5 rounded-md text-slate-300 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={handleClearSketch}
                      aria-label="Clear sketch board"
                      className="p-1.5 rounded-md text-slate-400 hover:text-rose-300 hover:bg-slate-800 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Canvas Surface */}
                <div
                  ref={containerRef}
                  className="relative flex-1 min-h-0 overflow-hidden bg-[#050c1a]"
                  style={
                    paperStyle === 'grid'
                      ? {
                          backgroundImage:
                            'radial-gradient(rgba(56, 189, 248, 0.22) 1px, transparent 1px)',
                          backgroundSize: '20px 20px',
                        }
                      : paperStyle === 'lined'
                        ? {
                            backgroundImage:
                              'linear-gradient(to bottom, rgba(56, 189, 248, 0.14) 1px, transparent 1px)',
                            backgroundSize: '100% 28px',
                          }
                        : undefined
                  }
                >
                  {!savedCanvasUrl && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-slate-500/80 select-none">
                      Sketch freehand equations, free-body diagrams, circuits, or rough work here
                    </div>
                  )}
                  <canvas
                    ref={canvasRef}
                    data-testid="workings-canvas"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerEnd}
                    onPointerCancel={handlePointerEnd}
                    className="block w-full h-full touch-none cursor-crosshair"
                  />
                </div>
              </div>
            ) : (
              <div className="flex-1 min-h-0 flex flex-col p-3.5 gap-2.5 bg-[#050c1a]">
                {/* Quick Math Evaluator */}
                <div className="rounded-xl border border-cyan-500/30 bg-slate-900/80 p-2.5 space-y-2 shrink-0">
                  <div className="flex items-center justify-between gap-2">
                    <label
                      htmlFor="workings-expr-input"
                      className="text-[11px] font-semibold text-cyan-300"
                    >
                      Quick Formula &amp; Expression Calculator
                    </label>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setAngleMode((m) => (m === 'deg' ? 'rad' : 'deg'))}
                        className="px-2 py-0.5 rounded bg-slate-950 border border-slate-700 text-[10px] font-mono text-cyan-300 hover:border-cyan-400 transition-colors"
                      >
                        {angleMode.toUpperCase()}
                      </button>
                      {exprText && (
                        <button
                          type="button"
                          onClick={() => setExprText('')}
                          aria-label="Clear expression"
                          className="p-1 rounded text-slate-400 hover:text-white"
                        >
                          <RotateCcw className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      id="workings-expr-input"
                      data-testid="workings-expr-input"
                      type="text"
                      value={exprText}
                      onChange={(e) => setExprText(e.target.value)}
                      placeholder="e.g. (9.8 * 25) / 2 or sin(30) * 100 or sqrt(144)"
                      className="flex-1 min-w-0 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 focus:border-cyan-400 outline-none text-xs font-mono text-white placeholder:text-slate-500"
                    />
                    <button
                      type="button"
                      disabled={!liveEval?.ok}
                      onClick={handleAppendEvalToNotes}
                      data-testid="workings-append-result"
                      className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 text-xs font-bold whitespace-nowrap transition-colors"
                    >
                      Add Step
                    </button>
                  </div>

                  {liveEval && (
                    <div
                      data-testid="workings-eval-output"
                      className={`text-xs font-mono tabular-nums flex items-center justify-between gap-2 ${
                        liveEval.ok ? 'text-emerald-300' : 'text-amber-300'
                      }`}
                    >
                      <span>{liveEval.ok ? `= ${liveEval.formatted}` : liveEval.error}</span>
                      {liveEval.ok && (
                        <span className="text-[11px] text-slate-300 truncate">
                          <MathText text={`$${exprText.trim()} = ${liveEval.formatted}$`} />
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* KaTeX Snippets & Mode Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-1.5 shrink-0">
                  <div className="flex flex-wrap items-center gap-1">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-cyan-300 mr-0.5">
                      <Sigma className="w-3 h-3" />
                      <span>LaTeX:</span>
                    </span>
                    {KATEX_SNIPPETS.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        title={item.title}
                        data-testid={`workings-katex-${item.id}`}
                        onClick={() => insertSymbolToNotes(item.snippet)}
                        className="px-2 py-1 rounded-md bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-[11px] font-mono text-cyan-200 transition-colors"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setStepsViewMode('write')}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md font-medium transition-colors ${
                        stepsViewMode === 'write' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <PenLine className="w-3 h-3" />
                      <span>Write</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStepsViewMode('split')}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md font-medium transition-colors ${
                        stepsViewMode === 'split' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Columns2 className="w-3 h-3" />
                      <span>Split</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStepsViewMode('preview')}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md font-medium transition-colors ${
                        stepsViewMode === 'preview' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Eye className="w-3 h-3" />
                      <span>KaTeX</span>
                    </button>
                  </div>
                </div>

                {/* Quick Symbols + Copy/Clear */}
                <div className="flex flex-wrap items-center gap-1 shrink-0">
                  {QUICK_SYMBOLS.map((sym) => (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => insertSymbolToNotes(sym)}
                      className="px-2 py-0.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-200 transition-colors"
                    >
                      {sym}
                    </button>
                  ))}
                  <div className="ml-auto flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => void handleCopyNotes()}
                      disabled={!notesText.trim()}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-[11px] text-slate-300 disabled:opacity-40 transition-colors"
                    >
                      {copiedNotes ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedNotes ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setNotesText('')}
                      disabled={!notesText.trim()}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-[11px] text-slate-400 hover:text-rose-300 disabled:opacity-40 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear</span>
                    </button>
                  </div>
                </div>

                {/* Editor + Live KaTeX Rendered Preview */}
                <div
                  className={`flex-1 min-h-0 grid gap-2.5 ${
                    stepsViewMode === 'split'
                      ? 'grid-cols-1 sm:grid-cols-2'
                      : 'grid-cols-1'
                  }`}
                >
                  {stepsViewMode !== 'preview' && (
                    <textarea
                      ref={notesTextareaRef}
                      data-testid="workings-steps-textarea"
                      value={notesText}
                      onChange={(e) => setNotesText(e.target.value)}
                      placeholder={`Write steps using $...$ inline or $$...$$ block KaTeX:\n$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$\n$$\\int_{0}^{\\pi} \\sin(x)\\,dx = 2$$`}
                      className="w-full h-full min-h-0 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-400/70 outline-none p-3 text-xs font-mono text-slate-100 placeholder:text-slate-600 resize-none leading-relaxed"
                    />
                  )}

                  {stepsViewMode !== 'write' && (
                    <div
                      data-testid="workings-katex-preview"
                      className="w-full h-full min-h-0 rounded-xl bg-slate-900/65 border border-cyan-500/25 p-3 overflow-y-auto"
                    >
                      {notesText.trim() ? (
                        <MarkdownPreview content={notesText} />
                      ) : (
                        <div className="text-xs text-slate-400 space-y-2">
                          <p className="font-semibold text-cyan-300">Live KaTeX Equation Preview</p>
                          <p>
                            Type LaTeX formulas above or click a snippet button (e.g.{' '}
                            <code className="text-cyan-200">Quad</code>,{' '}
                            <code className="text-cyan-200">∫ dx</code>,{' '}
                            <code className="text-cyan-200">Matrix</code>) to render complex equations cleanly.
                          </p>
                          <div className="py-1.5 px-3 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-200">
                            <MathText text="Sample: $F = G\frac{m_1 m_2}{r^2}$ · $\Delta G = \Delta H - T\Delta S$" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* Small Round Neon Blue Robotic Ball Trigger — Movable across all 4 screen corners */}
      {!isOpen && (
        <button
          type="button"
          onPointerDown={(e) => {
            orbDragRef.current = {
              pointerId: e.pointerId,
              startX: e.clientX,
              startY: e.clientY,
              moved: false,
            };
            try {
              e.currentTarget.setPointerCapture(e.pointerId);
            } catch {
              // ignore pointer capture issues
            }
          }}
          onPointerMove={(e) => {
            const drag = orbDragRef.current;
            if (!drag || drag.pointerId !== e.pointerId) return;
            const dx = e.clientX - drag.startX;
            const dy = e.clientY - drag.startY;
            if (!drag.moved && Math.hypot(dx, dy) > 8) {
              drag.moved = true;
            }
            if (drag.moved) {
              setDragPos({
                x: Math.max(8, Math.min(window.innerWidth - 64, e.clientX - 28)),
                y: Math.max(72, Math.min(window.innerHeight - 64, e.clientY - 28)),
              });
            }
          }}
          onPointerUp={(e) => {
            const drag = orbDragRef.current;
            if (!drag || drag.pointerId !== e.pointerId) return;
            orbDragRef.current = null;
            try {
              e.currentTarget.releasePointerCapture(e.pointerId);
            } catch {
              // ignore
            }
            if (drag.moved) {
              suppressNextOrbClickRef.current = true;
              const snapped = computeOrbCornerFromPoint(
                e.clientX,
                e.clientY,
                window.innerWidth,
                window.innerHeight
              );
              setCorner(snapped);
              setDragPos(null);
            }
          }}
          onPointerCancel={() => {
            orbDragRef.current = null;
            setDragPos(null);
          }}
          onClick={() => {
            if (suppressNextOrbClickRef.current) {
              suppressNextOrbClickRef.current = false;
              return;
            }
            setIsOpen(true);
          }}
          data-testid="workings-orb-trigger"
          data-orb-corner={activeCorner}
          aria-label={`Open robotic workings board (docked ${activeCorner})`}
          aria-expanded={false}
          title="Workings Board (drag to any of the 4 screen corners)"
          style={
            dragPos
              ? { left: `${dragPos.x}px`, top: `${dragPos.y}px`, touchAction: 'none' }
              : { touchAction: 'none' }
          }
          className={`fixed z-40 group w-14 h-14 rounded-full bg-slate-950 border-2 border-cyan-400/90 shadow-[0_0_24px_rgba(0,212,255,0.52),inset_0_0_14px_rgba(56,189,248,0.3)] flex items-center justify-center transition-transform duration-150 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 cursor-grab active:cursor-grabbing ${
            dragPos ? '' : CORNER_POSITION_CLASSES[activeCorner]
          }`}
        >
          <svg viewBox="0 0 56 56" className="w-12 h-12" aria-hidden="true">
            <defs>
              <radialGradient id="robotOrbCore" cx="38%" cy="32%" r="68%">
                <stop offset="0%" stopColor="#1e3a5f" />
                <stop offset="55%" stopColor="#07192e" />
                <stop offset="100%" stopColor="#020814" />
              </radialGradient>
              <linearGradient id="neonRim" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7dd3fc" />
                <stop offset="50%" stopColor="#00d4ff" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
            </defs>

            {/* Robotic Sphere Chassis */}
            <circle cx="28" cy="28" r="23" fill="url(#robotOrbCore)" stroke="url(#neonRim)" strokeWidth="2.2" />

            {/* Rotating Cyber Ring */}
            <g className="origin-center animate-[spin_10s_linear_infinite] motion-reduce:animate-none">
              <circle
                cx="28"
                cy="28"
                r="19.5"
                fill="none"
                stroke="#38bdf8"
                strokeOpacity="0.45"
                strokeWidth="1.2"
                strokeDasharray="16 8 6 8"
              />
            </g>

            {/* Robotic Antenna Node */}
            <line x1="28" y1="5" x2="28" y2="10" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="28" cy="4.5" r="2" fill="#7dd3fc" />

            {/* Visor Screen */}
            <rect
              x="13"
              y="19"
              width="30"
              height="17"
              rx="8.5"
              fill="#031122"
              stroke="#38bdf8"
              strokeWidth="1.5"
            />

            {/* Glowing Neon Blue Robotic Eyes */}
            <ellipse cx="21.5" cy="27.5" rx="3.1" ry="3.8" fill="#00d4ff" />
            <ellipse cx="34.5" cy="27.5" rx="3.1" ry="3.8" fill="#00d4ff" />
            <circle cx="20.6" cy="26.2" r="1.1" fill="#e0f2fe" />
            <circle cx="33.6" cy="26.2" r="1.1" fill="#e0f2fe" />

            {/* Subtle Mouth / Telemetry Arc */}
            <path
              d="M 23.5 32.3 Q 28 34.4 32.5 32.3"
              fill="none"
              stroke="#7dd3fc"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>

          {hasSavedWorkings && (
            <span
              aria-hidden="true"
              className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-cyan-300 border-2 border-slate-950 shadow-[0_0_8px_#00d4ff]"
            />
          )}
        </button>
      )}
    </>
  );
};
