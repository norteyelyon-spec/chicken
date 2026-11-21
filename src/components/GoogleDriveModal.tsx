import React, { useCallback, useEffect, useState } from 'react';
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Download,
  Edit3,
  FileJson,
  FileText,
  FolderOpen,
  HardDrive,
  Loader2,
  LogOut,
  RefreshCw,
  Search,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import type {
  StudyNote,
  StudyTimetableSchedule,
  UserProfile,
} from '../types';
import {
  clearDriveAccessToken,
  connectGoogleDriveWithPopup,
  downloadDriveFileText,
  DRIVE_STUDY_FOLDER_NAME,
  DriveAuthError,
  type DriveFileItem,
  ensureStudyFolder,
  formatNoteAsDriveMarkdown,
  formatTimetableAsDriveMarkdown,
  getDriveAccessToken,
  listDriveStudyFiles,
  overwriteDriveFile,
  parseImportedMarkdownNote,
  renameDriveFile,
  sanitizeDriveFileName,
  trashDriveFile,
  uploadNewDriveFile,
} from '../utils/googleDrive';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeNote: StudyNote | null;
  profile: UserProfile;
  timetable: StudyTimetableSchedule;
  buildBackupJson: () => string;
  onImportNote: (note: StudyNote) => void;
  onImportBackupJson: (jsonText: string) => boolean;
  onDriveAuthChange?: (connected: boolean) => void;
}

type ConfirmAction =
  | { kind: 'overwrite'; file: DriveFileItem; content: string; mimeType: string; label: string }
  | { kind: 'rename'; file: DriveFileItem; nextName: string }
  | { kind: 'trash'; file: DriveFileItem }
  | null;

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({
  isOpen,
  onClose,
  activeNote,
  profile,
  timetable,
  buildBackupJson,
  onImportNote,
  onImportBackupJson,
  onDriveAuthChange,
}) => {
  const [needsAuth, setNeedsAuth] = useState(() => !getDriveAccessToken());
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [isBusyAction, setIsBusyAction] = useState(false);

  const [folderId, setFolderId] = useState<string | null>(null);
  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [renamingFileId, setRenamingFileId] = useState<string | null>(null);
  const [renameDraft, setRenameDraft] = useState('');
  const [pendingConfirm, setPendingConfirm] = useState<ConfirmAction>(null);

  const refreshDriveFiles = useCallback(
    async (explicitFolderId?: string, queryText = searchQuery) => {
      const token = getDriveAccessToken();
      if (!token) {
        setNeedsAuth(true);
        onDriveAuthChange?.(false);
        return;
      }

      setIsLoadingFiles(true);
      setErrorMessage(null);
      try {
        const targetFolderId = explicitFolderId || folderId || (await ensureStudyFolder(token));
        setFolderId(targetFolderId);
        const list = await listDriveStudyFiles(token, targetFolderId, queryText);
        setFiles(list);
        setNeedsAuth(false);
        onDriveAuthChange?.(true);
      } catch (err) {
        if (err instanceof DriveAuthError) {
          setNeedsAuth(true);
          onDriveAuthChange?.(false);
          setErrorMessage(err.message);
        } else {
          setErrorMessage((err as Error).message || 'Could not load files from Google Drive.');
        }
      } finally {
        setIsLoadingFiles(false);
      }
    },
    [folderId, onDriveAuthChange, searchQuery]
  );

  useEffect(() => {
    if (!isOpen) return;
    const token = getDriveAccessToken();
    setNeedsAuth(!token);
    if (token) {
      void refreshDriveFiles();
    }
  }, [isOpen, refreshDriveFiles]);

  if (!isOpen) return null;

  const handleConnectDrive = async () => {
    if (isConnecting) return;
    setIsConnecting(true);
    setErrorMessage(null);
    setStatusMessage(null);
    try {
      const { user } = await connectGoogleDriveWithPopup();
      setNeedsAuth(false);
      onDriveAuthChange?.(true);
      setStatusMessage(
        `Connected to Google Drive (${user.email || user.displayName || 'Google Account'}).`
      );
      await refreshDriveFiles(undefined, '');
    } catch (err) {
      const code = (err as { code?: string })?.code ?? '';
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        setErrorMessage('Sign-in popup was closed before granting Google Drive access.');
      } else if (code === 'auth/popup-blocked') {
        setErrorMessage('Browser blocked the Google sign-in popup. Allow popups and retry.');
      } else {
        setErrorMessage((err as Error).message || 'Unable to connect Google Drive.');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectDrive = () => {
    clearDriveAccessToken();
    setNeedsAuth(true);
    setFolderId(null);
    setFiles([]);
    setPendingConfirm(null);
    onDriveAuthChange?.(false);
    setStatusMessage('Disconnected Google Drive access token from browser memory.');
  };

  const saveContentToDrive = async (fileName: string, content: string, mimeType: string, label: string) => {
    const token = getDriveAccessToken();
    if (!token) {
      setNeedsAuth(true);
      return;
    }

    setErrorMessage(null);
    setStatusMessage(null);
    setIsBusyAction(true);
    try {
      const targetFolderId = folderId || (await ensureStudyFolder(token));
      setFolderId(targetFolderId);
      const currentList = await listDriveStudyFiles(token, targetFolderId, '');
      setFiles(currentList);

      const existing = currentList.find((f) => f.name.toLowerCase() === fileName.toLowerCase());
      if (existing) {
        // Explicit user confirmation required before overwriting existing file!
        setPendingConfirm({
          kind: 'overwrite',
          file: existing,
          content,
          mimeType,
          label,
        });
        setIsBusyAction(false);
        return;
      }

      const created = await uploadNewDriveFile({
        token,
        folderId: targetFolderId,
        fileName,
        content,
        mimeType,
      });
      setStatusMessage(`Saved "${created.name}" to Google Drive (${DRIVE_STUDY_FOLDER_NAME}).`);
      await refreshDriveFiles(targetFolderId);
    } catch (err) {
      if (err instanceof DriveAuthError) {
        setNeedsAuth(true);
        onDriveAuthChange?.(false);
      }
      setErrorMessage((err as Error).message || 'Failed to save file to Google Drive.');
    } finally {
      setIsBusyAction(false);
    }
  };

  const executeConfirmedAction = async () => {
    if (!pendingConfirm) return;
    const token = getDriveAccessToken();
    if (!token) {
      setNeedsAuth(true);
      setPendingConfirm(null);
      return;
    }

    setIsBusyAction(true);
    setErrorMessage(null);
    try {
      if (pendingConfirm.kind === 'overwrite') {
        const updated = await overwriteDriveFile({
          token,
          fileId: pendingConfirm.file.id,
          content: pendingConfirm.content,
          mimeType: pendingConfirm.mimeType,
        });
        setStatusMessage(`Updated "${updated.name}" in Google Drive.`);
      } else if (pendingConfirm.kind === 'rename') {
        const renamed = await renameDriveFile({
          token,
          fileId: pendingConfirm.file.id,
          newName: pendingConfirm.nextName,
        });
        setRenamingFileId(null);
        setStatusMessage(`Renamed file to "${renamed.name}" in Google Drive.`);
      } else if (pendingConfirm.kind === 'trash') {
        await trashDriveFile(token, pendingConfirm.file.id);
        setStatusMessage(`Moved "${pendingConfirm.file.name}" to Google Drive Trash.`);
      }
      setPendingConfirm(null);
      await refreshDriveFiles();
    } catch (err) {
      if (err instanceof DriveAuthError) {
        setNeedsAuth(true);
        onDriveAuthChange?.(false);
      }
      setErrorMessage((err as Error).message || 'Google Drive operation failed.');
      setPendingConfirm(null);
    } finally {
      setIsBusyAction(false);
    }
  };

  const handleImportFile = async (file: DriveFileItem) => {
    const token = getDriveAccessToken();
    if (!token) {
      setNeedsAuth(true);
      return;
    }

    setIsBusyAction(true);
    setErrorMessage(null);
    setStatusMessage(null);
    try {
      const text = await downloadDriveFileText(token, file.id);
      if (file.name.toLowerCase().endsWith('.json') || file.mimeType.includes('json')) {
        const ok = onImportBackupJson(text);
        if (ok) {
          setStatusMessage(`Restored workspace backup from "${file.name}".`);
        } else {
          setErrorMessage(`"${file.name}" is not a valid WASSCE Masterclass JSON backup.`);
        }
      } else {
        const importedNote = parseImportedMarkdownNote(
          file.name,
          text,
          activeNote?.subject ?? 'chemistry',
          profile.gradeLevel
        );
        onImportNote(importedNote);
        setStatusMessage(`Imported "${importedNote.title}" into your Study Notes.`);
      }
    } catch (err) {
      if (err instanceof DriveAuthError) {
        setNeedsAuth(true);
        onDriveAuthChange?.(false);
      }
      setErrorMessage((err as Error).message || 'Could not download file from Google Drive.');
    } finally {
      setIsBusyAction(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="google-drive-modal-title"
      data-testid="google-drive-modal"
    >
      <div className="w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-auto relative">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/35 flex items-center justify-center text-cyan-300 shrink-0">
              <HardDrive className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 id="google-drive-modal-title" className="font-display text-base sm:text-lg font-bold text-white truncate">
                Google Drive Study Sync
              </h2>
              <p className="text-xs text-slate-400 truncate">
                Save notes, timetables &amp; full WASSCE backups in your "{DRIVE_STUDY_FOLDER_NAME}" Drive folder
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Google Drive dialog"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[82vh] overflow-y-auto">
          {statusMessage && (
            <div
              role="status"
              className="p-3 rounded-xl bg-emerald-500/12 border border-emerald-500/35 text-emerald-200 text-xs flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{statusMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div
              role="alert"
              className="p-3 rounded-xl bg-rose-500/12 border border-rose-500/35 text-rose-200 text-xs flex items-start gap-2"
            >
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {needsAuth ? (
            /* Official Sign in with Google Prompt */
            <div className="rounded-2xl bg-slate-950/90 border border-slate-800 p-6 sm:p-8 text-center space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300 mx-auto">
                <FolderOpen className="w-6 h-6" />
              </div>
              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="font-display text-base font-bold text-white">
                  Connect Your Google Drive
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Authorize Google Drive access to back up study notes, weekly schedules, and quiz backups directly into your "{DRIVE_STUDY_FOLDER_NAME}" folder. Access tokens stay in memory only and clear on sign-out.
                </p>
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  disabled={isConnecting}
                  onClick={() => void handleConnectDrive()}
                  data-testid="drive-google-signin-btn"
                  className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white hover:bg-slate-100 disabled:opacity-60 text-[#1f1f1f] font-medium text-sm border border-[#747775] shadow-sm transition-colors"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 48 48"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                  </svg>
                  <span>{isConnecting ? 'Connecting Google Drive...' : 'Sign in with Google'}</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Quick Upload Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  disabled={!activeNote || isBusyAction}
                  onClick={() => {
                    if (!activeNote) return;
                    void saveContentToDrive(
                      sanitizeDriveFileName(activeNote.title, '.md'),
                      formatNoteAsDriveMarkdown(activeNote),
                      'text/markdown',
                      'Study Note'
                    );
                  }}
                  className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800/80 disabled:opacity-45 border border-slate-800 text-left space-y-1.5 transition-colors"
                >
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-300">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Save Active Note</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">
                    {activeNote ? activeNote.title : 'Open any note in Study Notes first'}
                  </p>
                </button>

                <button
                  type="button"
                  disabled={isBusyAction}
                  onClick={() => {
                    void saveContentToDrive(
                      `WASSCE-Timetable-${profile.gradeLevel}.md`,
                      formatTimetableAsDriveMarkdown(timetable, profile),
                      'text/markdown',
                      'Weekly Timetable'
                    );
                  }}
                  className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800/80 disabled:opacity-45 border border-slate-800 text-left space-y-1.5 transition-colors"
                >
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                    <CalendarDays className="w-3.5 h-3.5" />
                    <span>Save Weekly Timetable</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Export {profile.gradeLevel} Mon–Sun schedule (.md)
                  </p>
                </button>

                <button
                  type="button"
                  disabled={isBusyAction}
                  onClick={() => {
                    void saveContentToDrive(
                      `WASSCE-Workspace-Backup-${profile.gradeLevel}.json`,
                      buildBackupJson(),
                      'application/json',
                      'Workspace Backup'
                    );
                  }}
                  className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800/80 disabled:opacity-45 border border-slate-800 text-left space-y-1.5 transition-colors"
                >
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300">
                    <FileJson className="w-3.5 h-3.5" />
                    <span>Save Full Backup</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Notes, scores, streak, timetable &amp; flashcards
                  </p>
                </button>
              </div>

              {/* Search & Folder Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    void refreshDriveFiles(undefined, searchQuery);
                  }}
                  className="relative flex-1 min-w-[220px]"
                >
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="search"
                    aria-label="Search files in Google Drive folder"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search files inside "${DRIVE_STUDY_FOLDER_NAME}"...`}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </form>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isLoadingFiles}
                    onClick={() => void refreshDriveFiles()}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                  >
                    {isLoadingFiles ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <RefreshCw className="w-3.5 h-3.5" />
                    )}
                    <span>Refresh</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDisconnectDrive}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-400 hover:text-rose-300 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Disconnect</span>
                  </button>
                </div>
              </div>

              {/* Drive File List */}
              <div className="rounded-2xl bg-slate-950/90 border border-slate-800 divide-y divide-slate-800/80">
                {isLoadingFiles ? (
                  <div className="p-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                    <span>Loading files from Google Drive...</span>
                  </div>
                ) : files.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500">
                    No files found inside "{DRIVE_STUDY_FOLDER_NAME}". Use the buttons above to save your active note, timetable, or backup!
                  </div>
                ) : (
                  files.map((file) => {
                    const isJson = file.name.toLowerCase().endsWith('.json') || file.mimeType.includes('json');
                    const isRenaming = renamingFileId === file.id;

                    return (
                      <div
                        key={file.id}
                        className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 text-cyan-300">
                            {isJson ? (
                              <FileJson className="w-4 h-4 text-amber-300" />
                            ) : (
                              <FileText className="w-4 h-4" />
                            )}
                          </div>
                          <div className="min-w-0 space-y-0.5">
                            {isRenaming ? (
                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  const trimmed = renameDraft.trim();
                                  if (!trimmed || trimmed === file.name) {
                                    setRenamingFileId(null);
                                    return;
                                  }
                                  setPendingConfirm({
                                    kind: 'rename',
                                    file,
                                    nextName: trimmed,
                                  });
                                }}
                                className="flex items-center gap-1.5"
                              >
                                <input
                                  type="text"
                                  aria-label={`New name for ${file.name}`}
                                  value={renameDraft}
                                  onChange={(e) => setRenameDraft(e.target.value)}
                                  className="px-2 py-1 rounded-lg bg-slate-900 border border-cyan-500/50 text-xs text-white focus:outline-none"
                                />
                                <button
                                  type="submit"
                                  className="px-2 py-1 rounded-lg bg-cyan-500 text-slate-950 text-[11px] font-bold"
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setRenamingFileId(null)}
                                  className="px-2 py-1 rounded-lg bg-slate-800 text-slate-300 text-[11px]"
                                >
                                  Cancel
                                </button>
                              </form>
                            ) : (
                              <div className="text-xs font-semibold text-white truncate">{file.name}</div>
                            )}
                            <div className="text-[11px] text-slate-500 tabular-nums">
                              {file.modifiedTime
                                ? `Updated ${new Date(file.modifiedTime).toLocaleDateString()}`
                                : 'Google Drive File'}
                              {file.size ? ` · ${Math.max(1, Math.round(Number(file.size) / 1024))} KB` : ''}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            disabled={isBusyAction}
                            onClick={() => void handleImportFile(file)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/35 text-cyan-200 text-[11px] font-semibold transition-colors"
                          >
                            <Download className="w-3 h-3" />
                            <span>{isJson ? 'Restore' : 'Import'}</span>
                          </button>

                          {!isJson && activeNote && (
                            <button
                              type="button"
                              disabled={isBusyAction}
                              onClick={() =>
                                setPendingConfirm({
                                  kind: 'overwrite',
                                  file,
                                  content: formatNoteAsDriveMarkdown(activeNote),
                                  mimeType: 'text/markdown',
                                  label: `Active Note (${activeNote.title})`,
                                })
                              }
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-[11px] font-semibold transition-colors"
                            >
                              <Upload className="w-3 h-3" />
                              <span>Overwrite</span>
                            </button>
                          )}

                          <button
                            type="button"
                            disabled={isBusyAction}
                            onClick={() => {
                              setRenamingFileId(file.id);
                              setRenameDraft(file.name);
                            }}
                            aria-label={`Rename ${file.name}`}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            disabled={isBusyAction}
                            onClick={() => setPendingConfirm({ kind: 'trash', file })}
                            aria-label={`Move ${file.name} to Trash`}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-500/20 border border-slate-800 text-slate-400 hover:text-rose-300 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>

        {/* Mandatory Explicit User Confirmation Modal before Mutating/Deleting Drive Files */}
        {pendingConfirm && (
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="drive-confirm-title"
            className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm"
          >
            <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-amber-500/40 p-5 space-y-4 shadow-2xl">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 id="drive-confirm-title" className="font-display text-sm sm:text-base font-bold text-white">
                    {pendingConfirm.kind === 'trash'
                      ? 'Move Google Drive File to Trash?'
                      : pendingConfirm.kind === 'rename'
                        ? 'Rename Google Drive File?'
                        : 'Overwrite Existing Google Drive File?'}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {pendingConfirm.kind === 'trash' && (
                      <>
                        Are you sure you want to move <strong>{pendingConfirm.file.name}</strong> to Google Drive Trash?
                      </>
                    )}
                    {pendingConfirm.kind === 'rename' && (
                      <>
                        Confirm renaming <strong>{pendingConfirm.file.name}</strong> to{' '}
                        <strong>{pendingConfirm.nextName}</strong> inside Google Drive.
                      </>
                    )}
                    {pendingConfirm.kind === 'overwrite' && (
                      <>
                        <strong>{pendingConfirm.file.name}</strong> already exists in "{DRIVE_STUDY_FOLDER_NAME}". Replace its Google Drive contents with your latest {pendingConfirm.label}?
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  disabled={isBusyAction}
                  onClick={() => setPendingConfirm(null)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isBusyAction}
                  onClick={() => void executeConfirmedAction()}
                  data-testid="drive-confirm-action-btn"
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                    pendingConfirm.kind === 'trash'
                      ? 'bg-rose-500 hover:bg-rose-400 text-white'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                  }`}
                >
                  {isBusyAction ? 'Applying...' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
