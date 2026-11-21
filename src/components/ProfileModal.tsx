import React, { useEffect, useRef, useState } from 'react';
import { Check, Cloud, CloudOff, Download, HardDrive, LogOut, Upload, X } from 'lucide-react';
import { SUBJECT_LIST } from '../data/subjects';
import type { GradeLevel, SubjectId, UserProfile } from '../types';
import { AVATAR_OPTIONS, AvatarIcon } from './AvatarIcon';

interface CloudAuthSummary {
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface ProfileModalProps {
  isOpen: boolean;
  isFirstSetup: boolean;
  profile: UserProfile | null;
  cloudUser?: CloudAuthSummary | null;
  isAuthBusy?: boolean;
  onGoogleSignIn?: () => void;
  onGoogleSignOut?: () => void;
  onOpenGoogleDrive?: () => void;
  onSave: (nextProfile: UserProfile) => void;
  onClose: () => void;
  onExportBackup: () => void;
  onImportBackup: (file: File) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  isFirstSetup,
  profile,
  cloudUser,
  isAuthBusy = false,
  onGoogleSignIn,
  onGoogleSignOut,
  onOpenGoogleDrive,
  onSave,
  onClose,
  onExportBackup,
  onImportBackup,
}) => {
  const [fullName, setFullName] = useState(profile?.fullName ?? '');
  const [preferredName, setPreferredName] = useState(profile?.preferredName ?? '');
  const [avatarId, setAvatarId] = useState(profile?.avatarId ?? 'atom');
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>(profile?.gradeLevel ?? 'SHS3');
  const [targetYear, setTargetYear] = useState<number>(profile?.targetYear ?? 2027);
  const [schoolName, setSchoolName] = useState(profile?.schoolName ?? '');
  const [subjects, setSubjects] = useState<SubjectId[]>(
    profile?.subjects ?? [
      'physics',
      'chemistry',
      'biology',
      'addmaths',
      'ict',
      'coremath',
      'english',
      'integratedscience',
      'socialstudies',
    ]
  );
  const [dailyGoal, setDailyGoal] = useState<number>(profile?.dailyQuestionGoal ?? 15);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen || !profile) return;
    setFullName(profile.fullName ?? '');
    setPreferredName(profile.preferredName ?? '');
    setAvatarId(profile.avatarId ?? 'atom');
    setGradeLevel(profile.gradeLevel ?? 'SHS3');
    setTargetYear(profile.targetYear ?? 2027);
    setSchoolName(profile.schoolName ?? '');
    setSubjects(
      profile.subjects?.length
        ? profile.subjects
        : [
            'physics',
            'chemistry',
            'biology',
            'addmaths',
            'ict',
            'coremath',
            'english',
            'integratedscience',
            'socialstudies',
          ]
    );
    setDailyGoal(profile.dailyQuestionGoal ?? 15);
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const toggleSubject = (id: SubjectId) => {
    setSubjects((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev; // keep at least one subject
        return prev.filter((s) => s !== id);
      }
      return [...prev, id];
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedFull = fullName.trim();
    if (!trimmedFull) {
      setError('Please enter your full name to personalize your WASSCE dashboard.');
      return;
    }
    const trimmedPref = preferredName.trim() || trimmedFull.split(' ')[0];
    setError('');
    onSave({
      fullName: trimmedFull,
      preferredName: trimmedPref,
      avatarId,
      gradeLevel,
      targetYear: Number(targetYear) || 2027,
      schoolName: schoolName.trim(),
      subjects,
      dailyQuestionGoal: Math.max(5, Math.min(100, Number(dailyGoal) || 15)),
      createdAt: profile?.createdAt ?? new Date().toISOString(),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
    >
      <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <h2 id="profile-modal-title" className="text-lg font-bold text-white">
              {isFirstSetup ? 'Create Your WASSCE Student Profile' : 'Edit Student Profile & Cloud Sync'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Tailored to the Ghana Education Service (GES) SHS 1–3 Science &amp; ICT Syllabus
            </p>
          </div>
          {!isFirstSetup && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close profile dialog"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Cloud Sync (Google Auth + Firestore) */}
          {(onGoogleSignIn || onGoogleSignOut) && (
            <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
                    cloudUser
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                      : 'bg-cyan-500/12 border-cyan-500/25 text-cyan-300'
                  }`}
                >
                  {cloudUser ? <Cloud className="w-4 h-4" /> : <CloudOff className="w-4 h-4" />}
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">
                    {cloudUser
                      ? `Cloud Sync Active (${cloudUser.displayName || cloudUser.email || 'Google Account'})`
                      : 'Cloud Sync with Google Account'}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {cloudUser
                      ? `${cloudUser.email ?? 'Signed in'} · Notes, exam attempts, mistakes & flashcards sync automatically.`
                      : 'Sign in with Google to back up and sync your notes, mock scores, mistakes & flashcards.'}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {onOpenGoogleDrive && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenGoogleDrive();
                    }}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-cyan-300 transition-colors whitespace-nowrap"
                  >
                    <HardDrive className="w-3.5 h-3.5" />
                    <span>Google Drive</span>
                  </button>
                )}

                {cloudUser ? (
                  <button
                    type="button"
                    disabled={isAuthBusy}
                    onClick={onGoogleSignOut}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-xs font-semibold text-slate-200 transition-colors whitespace-nowrap"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{isAuthBusy ? 'Signing out...' : 'Sign Out'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isAuthBusy}
                    onClick={onGoogleSignIn}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/35 disabled:opacity-50 text-xs font-semibold text-cyan-200 transition-colors whitespace-nowrap"
                  >
                    <Cloud className="w-3.5 h-3.5" />
                    <span>{isAuthBusy ? 'Connecting...' : 'Sign in with Google'}</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {error && (
            <div role="alert" className="px-4 py-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="student-full-name" className="block text-xs font-medium text-slate-300 mb-1.5">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <input
                id="student-full-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Abena Osei-Mensah"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label htmlFor="student-preferred-name" className="block text-xs font-medium text-slate-300 mb-1.5">
                Preferred Name / Nickname
              </label>
              <input
                id="student-preferred-name"
                type="text"
                value={preferredName}
                onChange={(e) => setPreferredName(e.target.value)}
                placeholder="e.g. Abena"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <span className="block text-xs font-medium text-slate-300 mb-2">Choose Academic Avatar</span>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
              {AVATAR_OPTIONS.map((opt) => {
                const selected = avatarId === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setAvatarId(opt.id)}
                    aria-label={`Select ${opt.label} avatar`}
                    aria-pressed={selected}
                    className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-colors ${
                      selected
                        ? 'bg-slate-800/90 border-cyan-400 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <AvatarIcon avatarId={opt.id} size="sm" />
                    <span className="text-[11px] truncate max-w-full">{opt.shortLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="student-grade" className="block text-xs font-medium text-slate-300 mb-1.5">
                Grade Level / Form
              </label>
              <select
                id="student-grade"
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value as GradeLevel)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="SHS1">SHS 1 (Grade 10)</option>
                <option value="SHS2">SHS 2 (Grade 11)</option>
                <option value="SHS3">SHS 3 (Grade 12 · WASSCE)</option>
              </select>
            </div>

            <div>
              <label htmlFor="target-year" className="block text-xs font-medium text-slate-300 mb-1.5">
                Target WASSCE Year
              </label>
              <select
                id="target-year"
                value={targetYear}
                onChange={(e) => setTargetYear(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400"
              >
                <option value={2027}>2027 WASSCE</option>
                <option value={2028}>2028 WASSCE</option>
                <option value={2029}>2029 WASSCE</option>
                <option value={2030}>2030 WASSCE</option>
              </select>
            </div>

            <div>
              <label htmlFor="daily-goal" className="block text-xs font-medium text-slate-300 mb-1.5">
                Daily Question Goal
              </label>
              <input
                id="daily-goal"
                type="number"
                min={5}
                max={100}
                value={dailyGoal}
                onChange={(e) => setDailyGoal(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white tabular-nums focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label htmlFor="school-name" className="block text-xs font-medium text-slate-300 mb-1.5">
              Senior High School Name (Optional)
            </label>
            <input
              id="school-name"
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="e.g. Prempeh College, Wesley Girls' High, or Presec Legon"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="space-y-3">
            <span className="block text-xs font-medium text-slate-300">
              Elective &amp; Core Focus Subjects
            </span>

            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Electives (Science &amp; ICT)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SUBJECT_LIST.filter((s) => s.category === 'elective').map((sub) => {
                  const active = subjects.includes(sub.id);
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => toggleSubject(sub.id)}
                      aria-pressed={active}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-left transition-colors ${
                        active
                          ? `${sub.bgSoftClass} ${sub.borderClass} text-white`
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-sm font-medium">{sub.name}</span>
                      {active && <Check className={`w-4 h-4 ${sub.textClass}`} />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Core WASSCE Subjects
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SUBJECT_LIST.filter((s) => s.category === 'core').map((sub) => {
                  const active = subjects.includes(sub.id);
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => toggleSubject(sub.id)}
                      aria-pressed={active}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-left transition-colors ${
                        active
                          ? `${sub.bgSoftClass} ${sub.borderClass} text-white`
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-sm font-medium">{sub.name}</span>
                      {active && <Check className={`w-4 h-4 ${sub.textClass}`} />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {!isFirstSetup && (
            <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-400">
                Backup or restore all profile, exam history, mistake bank, and notes as JSON.
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onExportBackup}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export JSON
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Import JSON
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/json,.json"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onImportBackup(file);
                    e.target.value = '';
                  }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            {!isFirstSetup && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-medium text-slate-200 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition-colors whitespace-nowrap"
            >
              {isFirstSetup ? 'Save Profile & Enter Masterclass' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
