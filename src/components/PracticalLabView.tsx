import React, { useEffect, useState } from 'react';
import { CheckCircle2, ExternalLink, Eye, FlaskConical, Sliders } from 'lucide-react';
import { PRACTICAL_EXPERIMENTS } from '../data/practicals';
import { SUBJECTS } from '../data/subjects';
import type { GradeFilter } from '../types';
import { getGradeDisplayLabel } from '../utils/personalization';
import { LabSimulatorHost } from './LabSimulators';
import { MathText } from './MathText';

type LabPanelMode = 'simulator' | 'diagram' | 'phet';

interface PracticalLabViewProps {
  onLogSimulationRun?: (experimentId: string, grade: string) => void;
}

export const PracticalLabView: React.FC<PracticalLabViewProps> = ({ onLogSimulationRun }) => {
  const [selectedExpId, setSelectedExpId] = useState(PRACTICAL_EXPERIMENTS[0].id);
  const [gradeFilter, setGradeFilter] = useState<GradeFilter>('ALL');
  const [subjectFilter, setSubjectFilter] = useState<string>('ALL');
  const [panelMode, setPanelMode] = useState<LabPanelMode>('simulator');
  const [imgFailed, setImgFailed] = useState<Record<string, boolean>>({});
  const [readings, setReadings] = useState<Record<string, string>>({});
  const [showReadingHints, setShowReadingHints] = useState(false);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});

  const visibleExperiments = PRACTICAL_EXPERIMENTS.filter((e) => {
    if (gradeFilter !== 'ALL' && e.grade !== gradeFilter) return false;
    if (subjectFilter !== 'ALL' && e.subject !== subjectFilter) return false;
    return true;
  });

  const exp =
    visibleExperiments.find((e) => e.id === selectedExpId) ??
    visibleExperiments[0] ??
    PRACTICAL_EXPERIMENTS[0];
  const subInfo = SUBJECTS[exp.subject];

  useEffect(() => {
    onLogSimulationRun?.(exp.id, exp.grade);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exp.id]);

  const handleSelectExperiment = (id: string) => {
    setSelectedExpId(id);
    const nextExp = PRACTICAL_EXPERIMENTS.find((e) => e.id === id);
    if (nextExp && !nextExp.simulatorKind) {
      setPanelMode('diagram');
    } else {
      setPanelMode('simulator');
    }
  };

  const shortTabTitle: Record<string, string> = {
    'prac-phys-projectile': 'Projectile Motion',
    'prac-phys-pendulum': 'Simple Pendulum',
    'prac-phys-optics': 'Optical Bench',
    'prac-phys-micrometer': 'Micrometer Gauge',
    'prac-phys-ohms': "Ohm's Law",
    'prac-phys-waves': 'Standing Waves',
    'prac-chem-titration': 'Acid-Base Titration',
    'prac-chem-gas': 'Ideal Gas Laws',
    'prac-chem-thomson-crt': 'Thomson CRT',
    'prac-chem-rutherford': 'Rutherford Foil',
    'prac-bio-enzyme': 'Enzyme Kinetics',
    'prac-ict-logic-network': 'Logic & Network',
    'prac-math-calculus': 'Calculus & Tangents',
    'prac-phys-radioactive-decay': 'Half-Life Decay',
    'prac-bio-osmosis-photosynthesis': 'Osmosis & Leaf',
    'prac-intsci-machines': 'Simple Machines',
    'prac-phys-kinematics-shs1': 'Kinematics Motion',
    'prac-chem-calorimetry-shs1': 'Calorimetry Heat',
    'prac-math-bearings-shs2': 'Bearings & Trig',
    'prac-phys-electrostatics-shs2': 'Electrostatics',
    'prac-phys-transformer-shs3': 'AC Transformer',
    'prac-bio-genetics-shs3': 'Mendel Genetics',
  };

  const labSubjects = Array.from(new Set(PRACTICAL_EXPERIMENTS.map((e) => e.subject)));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-lg sm:text-xl font-bold text-white">
            Interactive Practical &amp; Simulation Lab ({PRACTICAL_EXPERIMENTS.length} Simulators · Grades 10–12)
          </h2>
          <p className="text-xs text-slate-400">
            Categorized from Grade 10 (SHS 1) to Grade 12 (SHS 3) with Three.js 3D apparatus labs and real-time STEM simulators
          </p>
        </div>

        {/* Grade 10 - Grade 12 Categorization Tabs */}
        <div
          role="group"
          aria-label="Filter simulations by grade"
          className="inline-flex flex-wrap items-center p-1 rounded-xl bg-slate-950 border border-slate-800 gap-1 text-xs"
        >
          {(['ALL', 'SHS1', 'SHS2', 'SHS3'] as const).map((g) => {
            const count =
              g === 'ALL'
                ? PRACTICAL_EXPERIMENTS.length
                : PRACTICAL_EXPERIMENTS.filter((e) => e.grade === g).length;
            const active = gradeFilter === g;
            return (
              <button
                key={g}
                type="button"
                data-testid={`lab-grade-${g}`}
                onClick={() => {
                  setGradeFilter(g);
                  const first = PRACTICAL_EXPERIMENTS.find(
                    (e) =>
                      (g === 'ALL' || e.grade === g) &&
                      (subjectFilter === 'ALL' || e.subject === subjectFilter)
                  );
                  if (first) handleSelectExperiment(first.id);
                }}
                aria-pressed={active}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors tabular-nums ${
                  active
                    ? 'bg-cyan-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {getGradeDisplayLabel(g)} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Subject Filter Strip */}
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => setSubjectFilter('ALL')}
          aria-pressed={subjectFilter === 'ALL'}
          className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-colors ${
            subjectFilter === 'ALL'
              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          All Subjects (
          {
            PRACTICAL_EXPERIMENTS.filter((e) =>
              gradeFilter === 'ALL' ? true : e.grade === gradeFilter
            ).length
          }
          )
        </button>
        {labSubjects.map((subId) => {
          const sub = SUBJECTS[subId];
          const count = PRACTICAL_EXPERIMENTS.filter(
            (e) =>
              e.subject === subId && (gradeFilter === 'ALL' ? true : e.grade === gradeFilter)
          ).length;
          return (
            <button
              key={subId}
              type="button"
              onClick={() => {
                setSubjectFilter(subId);
                const firstMatch = PRACTICAL_EXPERIMENTS.find(
                  (e) =>
                    e.subject === subId && (gradeFilter === 'ALL' || e.grade === gradeFilter)
                );
                if (firstMatch) handleSelectExperiment(firstMatch.id);
              }}
              aria-pressed={subjectFilter === subId}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-colors tabular-nums ${
                subjectFilter === subId
                  ? `${sub.bgSoftClass} ${sub.borderClass} ${sub.textClass}`
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {sub.shortName} ({count})
            </button>
          );
        })}
      </div>

      {/* Experiment Selector Strip */}
      {visibleExperiments.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-center text-xs text-slate-400">
          No simulations match this exact Subject + Grade combination yet. Switch Subject to &ldquo;All Subjects&rdquo; to explore all {getGradeDisplayLabel(gradeFilter)} labs.
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {visibleExperiments.map((item) => {
            const itemSub = SUBJECTS[item.subject];
            const active = item.id === exp.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectExperiment(item.id)}
                aria-pressed={active}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors whitespace-nowrap ${
                  active
                    ? `${itemSub.bgSoftClass} ${itemSub.borderClass} ${itemSub.textClass}`
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>
                  {itemSub.shortName} · {shortTabTitle[item.id] ?? item.title.split(':')[0]}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-slate-950/70 text-slate-300 text-[10px] font-mono">
                  {item.grade === 'SHS1' ? 'G10' : item.grade === 'SHS2' ? 'G11' : 'G12'}
                </span>
                {item.is3D && (
                  <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold">
                    3D
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Experiment Header + Workbench Mode Switcher */}
      <div className="rounded-2xl bg-slate-900/85 border border-slate-800/90 p-5 sm:p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className={`text-xs font-semibold ${subInfo.textClass}`}>
              WASSCE Paper 3 Practical · {subInfo.name} · {getGradeDisplayLabel(exp.grade)} {exp.is3D ? '· Three.js 3D Apparatus' : ''}
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white">{exp.title}</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              <strong className="text-slate-200">Aim: </strong>
              <MathText text={exp.aim} />
            </p>
          </div>

          <div className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800 max-w-full self-start">
            {exp.simulatorKind && (
              <button
                type="button"
                onClick={() => setPanelMode('simulator')}
                aria-pressed={panelMode === 'simulator'}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                  panelMode === 'simulator' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Interactive Sim</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setPanelMode('diagram')}
              aria-pressed={panelMode === 'diagram'}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                panelMode === 'diagram' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Apparatus Diagram</span>
            </button>
            {exp.phetUrl && (
              <button
                type="button"
                onClick={() => setPanelMode('phet')}
                aria-pressed={panelMode === 'phet'}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                  panelMode === 'phet' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FlaskConical className="w-3.5 h-3.5" />
                <span>PhET Live Lab</span>
              </button>
            )}
          </div>
        </div>

        {/* Active Stage */}
        {panelMode === 'simulator' && exp.simulatorKind && (
          <LabSimulatorHost kind={exp.simulatorKind} />
        )}

        {panelMode === 'diagram' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
            <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col">
              {!imgFailed[exp.id] ? (
                <img
                  src={exp.imageUrl}
                  alt={exp.imageCaption}
                  referrerPolicy="no-referrer"
                  onError={() => setImgFailed((prev) => ({ ...prev, [exp.id]: true }))}
                  className="w-full h-64 sm:h-80 object-cover"
                />
              ) : (
                <div className="w-full h-64 sm:h-80 bg-gradient-to-br from-slate-900 to-slate-950 flex flex-col items-center justify-center p-6 text-center">
                  <FlaskConical className={`w-10 h-10 mb-2 ${subInfo.textClass}`} />
                  <div className="text-sm font-semibold text-white">{exp.title}</div>
                </div>
              )}
              <div className="px-4 py-2.5 bg-slate-900/90 border-t border-slate-800 text-xs text-slate-400">
                {exp.imageCaption}
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 flex flex-col justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-slate-300 mb-2">
                  Apparatus Checklist &amp; Procedural Flow
                </div>
                <ul className="space-y-1.5 text-xs text-slate-400 mb-4">
                  {exp.apparatus.map((app, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${subInfo.textClass}`} />
                      <MathText text={app} />
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-2">
                <div className="text-xs font-semibold text-slate-300">WASSCE Procedure</div>
                <ol className="space-y-1.5 text-xs text-slate-300 list-decimal pl-4 leading-relaxed">
                  {exp.procedureSteps.map((step, idx) => (
                    <li key={idx}>
                      <MathText text={step} />
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        )}

        {panelMode === 'phet' && exp.phetUrl && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{exp.phetTitle} (University of Colorado Boulder HTML5 Simulation)</span>
              <a
                href={exp.phetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium"
              >
                <span>Open full screen</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 h-[440px]">
              <iframe
                src={exp.phetUrl}
                title={exp.phetTitle ?? exp.title}
                className="w-full h-full border-0"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>

      {/* Experimental Readings Table & Paper 3 Questions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 p-5 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="font-display text-base font-bold text-white">
                Experimental Observation &amp; Readings Table
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Record your observed simulator values before verifying against theoretical targets
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowReadingHints((v) => !v)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-cyan-300 transition-colors whitespace-nowrap"
            >
              {showReadingHints ? 'Hide Expected' : 'Check Expected'}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-left">
                  <th className="py-2 pr-3">Measured Quantity</th>
                  <th className="py-2 pr-3">Your Reading</th>
                  {showReadingHints && <th className="py-2">Expected</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {exp.readingsTable.map((row) => (
                  <tr key={row.id}>
                    <td className="py-3 pr-3">
                      <div className="text-slate-200 font-medium">{row.parameter}</div>
                      <div className="text-[11px] text-slate-500">Unit: {row.unit}</div>
                    </td>
                    <td className="py-3 pr-3">
                      <input
                        type="text"
                        aria-label={`Reading for ${row.parameter}`}
                        value={readings[row.id] ?? ''}
                        onChange={(e) =>
                          setReadings((prev) => ({ ...prev, [row.id]: e.target.value }))
                        }
                        placeholder={`e.g. ${row.expectedValue}`}
                        className="w-28 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                      />
                    </td>
                    {showReadingHints && (
                      <td className="py-3 font-mono text-emerald-300 tabular-nums">
                        {row.expectedValue} {row.unit}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-3 border-t border-slate-800 space-y-1.5">
            <div className="text-xs font-semibold text-slate-300">Mandatory WASSCE Precautions</div>
            <ul className="space-y-1 text-xs text-slate-400 list-disc pl-4">
              {exp.precautions.map((p, idx) => (
                <li key={idx}>{p}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 p-5 space-y-4">
          <h3 className="font-display text-base font-bold text-white">
            Paper 3 Observation &amp; Calculation Questions
          </h3>
          <div className="space-y-4">
            {exp.questions.map((q, idx) => {
              const isShown = Boolean(revealedAnswers[q.id]);
              return (
                <div key={q.id} className="rounded-xl bg-slate-950/80 border border-slate-800 p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">
                      <span className="font-mono text-cyan-400 mr-2">Q{idx + 1}.</span>
                      <MathText text={q.prompt} />
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 shrink-0">[{q.marks}m]</span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setRevealedAnswers((prev) => ({ ...prev, [q.id]: !prev[q.id] }))
                    }
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300"
                  >
                    {isShown ? 'Hide Explained Answer' : 'Reveal Explained Answer'}
                  </button>

                  {isShown && (
                    <div className="pt-2 border-t border-slate-800 text-xs text-emerald-200 leading-relaxed">
                      <MathText text={q.explainedAnswer} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
