import katex from 'katex';

export function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function highlightCodeLine(code: string, lang: string): string {
  const normalized = lang.toLowerCase();

  if (normalized === 'python' || normalized === 'py') {
    const pyTokenRegex =
      /(#.*$)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|\b(def|return|if|elif|else|for|while|in|import|from|as|class|print|range|len|True|False|None|and|or|not)\b|\b(\d+(?:\.\d+)?)\b|([&<>'"])/gm;
    return code.replace(
      pyTokenRegex,
      (
        match,
        comment: string | undefined,
        str: string | undefined,
        kw: string | undefined,
        num: string | undefined,
        special: string | undefined
      ) => {
        if (comment !== undefined) {
          return `<span class="text-slate-500 italic">${escapeHtml(comment)}</span>`;
        }
        if (str !== undefined) {
          return `<span class="text-emerald-400">${escapeHtml(str)}</span>`;
        }
        if (kw !== undefined) {
          return `<span class="text-violet-400 font-medium">${escapeHtml(kw)}</span>`;
        }
        if (num !== undefined) {
          return `<span class="text-amber-300">${escapeHtml(num)}</span>`;
        }
        if (special !== undefined) {
          return escapeHtml(special);
        }
        return escapeHtml(match);
      }
    );
  }

  if (normalized === 'sql') {
    const sqlTokenRegex =
      /(--.*$)|('(?:''|[^'])*'|"(?:""|[^"])*")|\b(SELECT|FROM|WHERE|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|PRIMARY|KEY|JOIN|ON|GROUP|BY|ORDER|ASC|DESC|AND|OR|NOT|INT|VARCHAR|COUNT|AVG|SUM)\b|\b(\d+(?:\.\d+)?)\b|([&<>'"])/gim;
    return code.replace(
      sqlTokenRegex,
      (
        match,
        comment: string | undefined,
        str: string | undefined,
        kw: string | undefined,
        num: string | undefined,
        special: string | undefined
      ) => {
        if (comment !== undefined) {
          return `<span class="text-slate-500 italic">${escapeHtml(comment)}</span>`;
        }
        if (str !== undefined) {
          return `<span class="text-emerald-400">${escapeHtml(str)}</span>`;
        }
        if (kw !== undefined) {
          return `<span class="text-sky-400 font-semibold">${escapeHtml(kw)}</span>`;
        }
        if (num !== undefined) {
          return `<span class="text-amber-300">${escapeHtml(num)}</span>`;
        }
        if (special !== undefined) {
          return escapeHtml(special);
        }
        return escapeHtml(match);
      }
    );
  }

  if (normalized === 'html' || normalized === 'xml') {
    const htmlTokenRegex =
      /(<!--[\s\S]*?-->)|(<\/?[a-zA-Z0-9-]+)((?:\s+[^<>]*?)?)(>)|([&<>'"])/g;
    return code.replace(
      htmlTokenRegex,
      (
        match,
        comment: string | undefined,
        openTag: string | undefined,
        attrs: string | undefined,
        closeBracket: string | undefined,
        special: string | undefined
      ) => {
        if (comment !== undefined) {
          return `<span class="text-slate-500 italic">${escapeHtml(comment)}</span>`;
        }
        if (openTag !== undefined && closeBracket !== undefined) {
          const attrHtml = attrs
            ? `<span class="text-amber-200">${escapeHtml(attrs)}</span>`
            : '';
          return `<span class="text-cyan-400">${escapeHtml(openTag)}</span>${attrHtml}<span class="text-cyan-400">${escapeHtml(closeBracket)}</span>`;
        }
        if (special !== undefined) {
          return escapeHtml(special);
        }
        return escapeHtml(match);
      }
    );
  }

  return escapeHtml(code);
}

export function renderKatexSafe(tex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(tex.trim(), {
      displayMode,
      throwOnError: false,
      strict: false,
    });
  } catch {
    return `<code>${escapeHtml(tex)}</code>`;
  }
}

export function renderInlineTextWithMath(text: string): string {
  const mathTokens: string[] = [];
  const tokenized = text
    .replace(/[\uE000\uE001]/g, '')
    .replace(/\$[^$\n]+\$/g, (match) => {
      const idx = mathTokens.length;
      mathTokens.push(renderKatexSafe(match.slice(1, -1), false));
      return `\uE000M${idx}\uE001`;
    });

  let safe = escapeHtml(tokenized);
  // Bold **text** (works even when enclosing inline math tokens)
  safe = safe.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-slate-100">$1</strong>');
  // Inline `code`
  safe = safe.replace(
    /`([^`]+)`/g,
    '<code class="px-1.5 py-0.5 rounded bg-slate-800/90 text-cyan-300 font-mono text-[0.88em]">$1</code>'
  );

  return safe.replace(/\uE000M(\d+)\uE001/g, (_, idxStr: string) => {
    const idx = Number(idxStr);
    return mathTokens[idx] ?? '';
  });
}

export type MarkdownBlock =
  | { type: 'heading'; level: 1 | 2 | 3; text: string }
  | { type: 'code'; lang: string; code: string }
  | { type: 'math'; tex: string }
  | { type: 'list'; items: string[] }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'paragraph'; text: string };

function splitTableCells(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((c) => c.trim());
}

function isTableSeparatorLine(line: string): boolean {
  const trimmed = line.trim();
  return /^\|?(\s*:?-{3,}:?\s*\|)+\s*:?-{3,}:?\s*\|?$/.test(trimmed);
}

export function parseMarkdownBlocks(markdown: string): MarkdownBlock[] {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const blocks: MarkdownBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.trim().startsWith('```')) {
      const lang = line.trim().slice(3).trim() || 'text';
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push({ type: 'code', lang, code: codeLines.join('\n') });
      i++;
      continue;
    }

    // Block math $$ ... $$
    if (line.trim().startsWith('$$')) {
      const singleLine = line.trim();
      if (singleLine.endsWith('$$') && singleLine.length > 4) {
        blocks.push({ type: 'math', tex: singleLine.slice(2, -2) });
        i++;
        continue;
      }
      const texLines: string[] = [line.replace(/^\s*\$\$/, '')];
      i++;
      while (i < lines.length && !lines[i].includes('$$')) {
        texLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) {
        texLines.push(lines[i].replace(/\$\$\s*$/, ''));
      }
      blocks.push({ type: 'math', tex: texLines.join('\n') });
      i++;
      continue;
    }

    // Markdown table
    if (
      line.includes('|') &&
      i + 1 < lines.length &&
      isTableSeparatorLine(lines[i + 1])
    ) {
      const headers = splitTableCells(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].includes('|') && lines[i].trim() !== '') {
        rows.push(splitTableCells(lines[i]));
        i++;
      }
      blocks.push({ type: 'table', headers, rows });
      continue;
    }

    // Headings
    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length as 1 | 2 | 3;
      blocks.push({ type: 'heading', level, text: headingMatch[2] });
      i++;
      continue;
    }

    // Bullet lists
    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ''));
        i++;
      }
      blocks.push({ type: 'list', items });
      continue;
    }

    // Blank line
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Paragraph
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].trim().startsWith('```') &&
      !lines[i].trim().startsWith('$$') &&
      !(lines[i].includes('|') && i + 1 < lines.length && isTableSeparatorLine(lines[i + 1])) &&
      !/^(#{1,3})\s+/.test(lines[i]) &&
      !/^\s*[-*]\s+/.test(lines[i])
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    blocks.push({ type: 'paragraph', text: paraLines.join(' ') });
  }

  return blocks;
}
