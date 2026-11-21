import React, { useEffect, useState } from 'react';
import { Check, Pencil, Sparkles, X } from 'lucide-react';
import type {
  AccentTheme,
  LayoutDensity,
  OrbCorner,
  PersonalizationPreferences,
  TeacherPersonaId,
} from '../types';
import {
  ACCENT_THEME_PRESETS,
  TEACHER_PERSONA_PROFILES,
} from '../utils/personalization';

interface PersonalizationModalProps {
  isOpen: boolean;
  preferences: PersonalizationPreferences;
  onSave: (next: PersonalizationPreferences) => void;
  onClose: () => void;
}

const CORNER_OPTIONS: { id: OrbCorner; label: string }[] = [
  { id: 'top-left', label: 'Top Left' },
  { id: 'top-right', label: 'Top Right' },
  { id: 'bottom-left', label: 'Bottom Left' },
  { id: 'bottom-right', label: 'Bottom Right' },
];

export const PersonalizationModal: React.FC<PersonalizationModalProps> = ({
  isOpen,
  preferences,
  onSave,
  onClose,
}) => {
  const [draft, setDraft] = useState<PersonalizationPreferences>(preferences);

  useEffect(() => {
    if (isOpen) {
      setDraft(preferences);
    }
  }, [isOpen, preferences]);

  if (!isOpen) return null;

  const activePreset = ACCENT_THEME_PRESETS[draft.accentTheme];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...draft,
      studioTagline: draft.studioTagline.trim() || 'GES WASSCE Prep Studio',
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Personalize study studio"
      data-testid="personalization-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs"
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950 p-5 sm:p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${activePreset.badgeClass}`}>
              <Pencil className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display text-base sm:text-lg font-bold text-white">
                Personalize Study Studio
              </h2>
              <p className="text-xs text-slate-400">
                Customize your color theme, layout density, AI teacher presenter, and orb dock corner.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close personalization settings"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Studio Banner Tagline */}
        <div className="space-y-1.5">
          <label htmlFor="studio-tagline-input" className="block text-xs font-semibold text-slate-300">
            Top Header Studio Tagline
          </label>
          <input
            id="studio-tagline-input"
            data-testid="personalize-tagline-input"
            type="text"
            maxLength={48}
            value={draft.studioTagline}
            onChange={(e) => setDraft((prev) => ({ ...prev, studioTagline: e.target.value }))}
            placeholder="e.g. A1 Distinction Track · Science 3"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-cyan-400 outline-none text-xs sm:text-sm text-white placeholder:text-slate-500"
          />
        </div>

        {/* Accent Theme Swatches */}
        <div className="space-y-2">
          <span className="block text-xs font-semibold text-slate-300">Accent Palette</span>
          <div className="grid grid-cols-2 gap-2.5">
            {(Object.keys(ACCENT_THEME_PRESETS) as AccentTheme[]).map((themeId) => {
              const spec = ACCENT_THEME_PRESETS[themeId];
              const selected = draft.accentTheme === themeId;
              return (
                <button
                  key={themeId}
                  type="button"
                  data-testid={`personalize-theme-${themeId}`}
                  aria-pressed={selected}
                  onClick={() => setDraft((prev) => ({ ...prev, accentTheme: themeId }))}
                  className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-colors ${
                    selected
                      ? `${spec.softBgClass} ${spec.borderClass} ${spec.textClass}`
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0"
                      style={{ backgroundColor: spec.primaryHex }}
                    />
                    <span>{spec.label}</span>
                  </span>
                  {selected && <Check className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Default Human AI Teacher Presenter */}
        <div className="space-y-2">
          <span className="block text-xs font-semibold text-slate-300">
            Default Video AI Teacher Presenter
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {(Object.keys(TEACHER_PERSONA_PROFILES) as TeacherPersonaId[]).map((personaId) => {
              const p = TEACHER_PERSONA_PROFILES[personaId];
              const selected = draft.teacherPersona === personaId;
              return (
                <button
                  key={personaId}
                  type="button"
                  data-testid={`personalize-teacher-${personaId}`}
                  aria-pressed={selected}
                  onClick={() => setDraft((prev) => ({ ...prev, teacherPersona: personaId }))}
                  className={`text-left p-2.5 rounded-xl border transition-colors ${
                    selected
                      ? 'bg-slate-800 border-cyan-400/60 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: p.accentHex }}
                    />
                    <span className="truncate">{p.name}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 line-clamp-2">{p.roleTitle}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Layout Density + Robotic Ball Corner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <span className="block text-xs font-semibold text-slate-300">Workspace Density</span>
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
              {(['comfortable', 'compact'] as LayoutDensity[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  data-testid={`personalize-density-${d}`}
                  aria-pressed={draft.density === d}
                  onClick={() => setDraft((prev) => ({ ...prev, density: d }))}
                  className={`py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                    draft.density === d
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="block text-xs font-semibold text-slate-300">Robotic Ball Corner</span>
            <div className="grid grid-cols-2 gap-1.5">
              {CORNER_OPTIONS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  data-testid={`personalize-corner-${c.id}`}
                  aria-pressed={draft.orbCorner === c.id}
                  onClick={() => setDraft((prev) => ({ ...prev, orbCorner: c.id }))}
                  className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold transition-colors ${
                    draft.orbCorner === c.id
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            data-testid="personalize-save-btn"
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${activePreset.buttonClass}`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Save Studio Style</span>
          </button>
        </div>
      </form>
    </div>
  );
};
