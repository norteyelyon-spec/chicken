import { GoogleAuthProvider, signInWithPopup, type User } from 'firebase/auth';
import { auth, createDriveGoogleProvider } from '../firebase.ts';
import type {
  GradeLevel,
  StudyNote,
  StudyTimetableSchedule,
  SubjectId,
  UserProfile,
} from '../types/index.ts';

// Strictly memory-only OAuth access token (never written to localStorage or sessionStorage).
let cachedDriveAccessToken: string | null = null;

export const DRIVE_STUDY_FOLDER_NAME = 'WASSCE Masterclass';

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime?: string;
  size?: string;
}

export class DriveAuthError extends Error {
  status: number;
  constructor(message: string, status = 401) {
    super(message);
    this.name = 'DriveAuthError';
    this.status = status;
  }
}

export function getDriveAccessToken(): string | null {
  return cachedDriveAccessToken;
}

export function setDriveAccessToken(token: string | null): void {
  cachedDriveAccessToken = token && token.trim() ? token.trim() : null;
}

export function clearDriveAccessToken(): void {
  cachedDriveAccessToken = null;
}

export function isDriveConnected(): boolean {
  return Boolean(cachedDriveAccessToken);
}

export async function connectGoogleDriveWithPopup(): Promise<{
  user: User;
  accessToken: string;
}> {
  const provider = createDriveGoogleProvider();
  const result = await signInWithPopup(auth, provider);
  const credential = GoogleAuthProvider.credentialFromResult(result);
  if (!credential?.accessToken) {
    throw new Error('Google Drive access permission was not returned. Please try again.');
  }
  setDriveAccessToken(credential.accessToken);
  return { user: result.user, accessToken: credential.accessToken };
}

async function driveFetch(url: string, init: RequestInit, token: string): Promise<Response> {
  const res = await fetch(url, {
    ...init,
    headers: {
      ...(init.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    clearDriveAccessToken();
    throw new DriveAuthError(
      'Your Google Drive session expired or was revoked. Please sign in again.',
      401
    );
  }
  return res;
}

async function parseDriveErrorMessage(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { error?: { message?: string } };
    if (data?.error?.message) return data.error.message;
  } catch {
    // ignore
  }
  return `Google Drive request failed (HTTP ${res.status}).`;
}

export async function ensureStudyFolder(token: string): Promise<string> {
  const query = encodeURIComponent(
    `name = '${DRIVE_STUDY_FOLDER_NAME}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`
  );
  const searchRes = await driveFetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)&pageSize=5`,
    { method: 'GET' },
    token
  );
  if (!searchRes.ok) {
    throw new Error(await parseDriveErrorMessage(searchRes));
  }
  const searchData = (await searchRes.json()) as { files?: { id: string; name: string }[] };
  if (searchData.files && searchData.files.length > 0) {
    return searchData.files[0].id;
  }

  const createRes = await driveFetch(
    'https://www.googleapis.com/drive/v3/files?fields=id,name',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: DRIVE_STUDY_FOLDER_NAME,
        mimeType: 'application/vnd.google-apps.folder',
      }),
    },
    token
  );
  if (!createRes.ok) {
    throw new Error(await parseDriveErrorMessage(createRes));
  }
  const created = (await createRes.json()) as { id: string };
  return created.id;
}

export async function listDriveStudyFiles(
  token: string,
  folderId: string,
  searchQuery = ''
): Promise<DriveFileItem[]> {
  const escaped = searchQuery.trim().replace(/'/g, "\\'");
  const qParts = [
    `'${folderId}' in parents`,
    'trashed = false',
    "mimeType != 'application/vnd.google-apps.folder'",
  ];
  if (escaped) {
    qParts.push(`name contains '${escaped}'`);
  }
  const q = encodeURIComponent(qParts.join(' and '));
  const url = `https://www.googleapis.com/drive/v3/files?q=${q}&orderBy=modifiedTime%20desc&pageSize=40&fields=files(id,name,mimeType,modifiedTime,size)`;
  const res = await driveFetch(url, { method: 'GET' }, token);
  if (!res.ok) {
    throw new Error(await parseDriveErrorMessage(res));
  }
  const data = (await res.json()) as { files?: DriveFileItem[] };
  return data.files ?? [];
}

export async function uploadNewDriveFile(params: {
  token: string;
  folderId: string;
  fileName: string;
  content: string;
  mimeType?: string;
}): Promise<DriveFileItem> {
  const mimeType = params.mimeType || 'text/markdown';
  const boundary = `wassce_drive_${Date.now()}`;
  const metadata = JSON.stringify({
    name: params.fileName,
    parents: [params.folderId],
  });

  const body =
    `--${boundary}\r\n` +
    `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
    `${metadata}\r\n` +
    `--${boundary}\r\n` +
    `Content-Type: ${mimeType}; charset=UTF-8\r\n\r\n` +
    `${params.content}\r\n` +
    `--${boundary}--`;

  const res = await driveFetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,modifiedTime,size',
    {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body,
    },
    params.token
  );

  if (!res.ok) {
    throw new Error(await parseDriveErrorMessage(res));
  }
  return (await res.json()) as DriveFileItem;
}

export async function overwriteDriveFile(params: {
  token: string;
  fileId: string;
  content: string;
  mimeType?: string;
}): Promise<DriveFileItem> {
  const mimeType = params.mimeType || 'text/markdown';
  const res = await driveFetch(
    `https://www.googleapis.com/upload/drive/v3/files/${encodeURIComponent(params.fileId)}?uploadType=media&fields=id,name,mimeType,modifiedTime,size`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': `${mimeType}; charset=UTF-8`,
      },
      body: params.content,
    },
    params.token
  );
  if (!res.ok) {
    throw new Error(await parseDriveErrorMessage(res));
  }
  return (await res.json()) as DriveFileItem;
}

export async function renameDriveFile(params: {
  token: string;
  fileId: string;
  newName: string;
}): Promise<DriveFileItem> {
  const res = await driveFetch(
    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(params.fileId)}?fields=id,name,mimeType,modifiedTime,size`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: params.newName.trim() }),
    },
    params.token
  );
  if (!res.ok) {
    throw new Error(await parseDriveErrorMessage(res));
  }
  return (await res.json()) as DriveFileItem;
}

export async function trashDriveFile(token: string, fileId: string): Promise<void> {
  const res = await driveFetch(
    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trashed: true }),
    },
    token
  );
  if (!res.ok) {
    throw new Error(await parseDriveErrorMessage(res));
  }
}

export async function downloadDriveFileText(token: string, fileId: string): Promise<string> {
  const res = await driveFetch(
    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?alt=media`,
    { method: 'GET' },
    token
  );
  if (!res.ok) {
    throw new Error(await parseDriveErrorMessage(res));
  }
  return res.text();
}

export function sanitizeDriveFileName(title: string, ext = '.md'): string {
  const base = title
    .replace(/[/\\?%*:|"<>]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 72);
  const safeBase = base || 'WASSCE-Study-Note';
  return safeBase.toLowerCase().endsWith(ext) ? safeBase : `${safeBase}${ext}`;
}

export function formatNoteAsDriveMarkdown(note: StudyNote): string {
  const metaHeader = [
    '---',
    `title: ${note.title}`,
    `subject: ${note.subject}`,
    `grade: ${note.grade}`,
    `tags: ${note.tags.join(', ')}`,
    `updatedAt: ${note.updatedAt}`,
    '---',
    '',
  ].join('\n');
  return `${metaHeader}${note.content}`;
}

export function parseImportedMarkdownNote(
  fileName: string,
  rawText: string,
  fallbackSubject: SubjectId = 'chemistry',
  fallbackGrade: GradeLevel = 'SHS1'
): StudyNote {
  const now = new Date().toISOString();
  const cleanName = fileName.replace(/\.(md|txt)$/i, '').trim() || 'Imported Drive Note';
  let title = cleanName;
  let subject: SubjectId = fallbackSubject;
  let grade: GradeLevel = fallbackGrade;
  let tags: string[] = ['Google-Drive'];
  let content = rawText.trim();

  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (fmMatch) {
    const frontmatter = fmMatch[1];
    content = fmMatch[2].trim();
    for (const line of frontmatter.split('\n')) {
      const idx = line.indexOf(':');
      if (idx === -1) continue;
      const key = line.slice(0, idx).trim().toLowerCase();
      const val = line.slice(idx + 1).trim();
      if (key === 'title' && val) title = val;
      if (key === 'grade' && (val === 'SHS1' || val === 'SHS2' || val === 'SHS3')) {
        grade = val;
      }
      if (
        key === 'subject' &&
        [
          'physics',
          'chemistry',
          'biology',
          'addmaths',
          'ict',
          'coremath',
          'english',
          'integratedscience',
          'socialstudies',
        ].includes(val)
      ) {
        subject = val as SubjectId;
      }
      if (key === 'tags' && val) {
        tags = Array.from(
          new Set([
            ...val
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean),
            'Google-Drive',
          ])
        );
      }
    }
  } else {
    const h1 = content.match(/^#\s+(.+)$/m);
    if (h1?.[1]) title = h1[1].trim();
  }

  return {
    id: `note-drive-${Date.now()}`,
    title,
    subject,
    grade,
    tags,
    content: content || `# ${title}\n\nImported from Google Drive.`,
    createdAt: now,
    updatedAt: now,
    isBuiltIn: false,
  };
}

export function formatTimetableAsDriveMarkdown(
  schedule: StudyTimetableSchedule,
  profile: UserProfile
): string {
  const studySlots = (schedule.slots ?? []).filter((s) => s.kind === 'study');
  const headerCells = studySlots.map((s) => s.label).join(' | ');
  const separatorCells = studySlots.map(() => '---').join('|');
  const lines = [
    `# WASSCE Weekly Study Timetable — ${profile.fullName} (${profile.gradeLevel})`,
    '',
    `Target Year: **${profile.targetYear}** · Daily Question Goal: **${profile.dailyQuestionGoal}**`,
    '',
    `| Day | ${headerCells} |`,
    `|---|${separatorCells}|`,
  ];

  const dayNames: Record<string, string> = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
  };

  const dayOrder = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ] as const;

  for (const dayId of dayOrder) {
    const dayRow = schedule.grid?.[dayId];
    if (!dayRow) continue;
    const row = studySlots
      .map((slot) => dayRow[slot.id]?.subjectId ?? dayRow[slot.id]?.customLabel ?? '-')
      .join(' | ');
    lines.push(`| ${dayNames[dayId] ?? dayId} | ${row} |`);
  }
  lines.push('');
  return lines.join('\n');
}
