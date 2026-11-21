import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  escapeHtml,
  highlightCodeLine,
  parseMarkdownBlocks,
  renderInlineTextWithMath,
} from './markdownRenderer.ts';

describe('markdownRenderer & syntax highlighter', () => {
  it('escapes special HTML characters safely', () => {
    assert.equal(
      escapeHtml(`<script>alert("x" & 'y')</script>`),
      '&lt;script&gt;alert(&quot;x&quot; &amp; &#39;y&#39;)&lt;/script&gt;'
    );
  });

  it('highlights Python without corrupting Tailwind class numbers or escaping entities', () => {
    const sample = [
      'def wassce_grade(score):',
      '    # Check boundary 100',
      '    if score >= 80:',
      '        return "A1"',
      "    return 'F9'",
    ].join('\n');

    const html = highlightCodeLine(sample, 'python');
    assert.ok(html.includes('<span class="text-violet-400 font-medium">def</span>'));
    assert.ok(html.includes('<span class="text-slate-500 italic"># Check boundary 100</span>'));
    assert.ok(html.includes('<span class="text-amber-300">80</span>'));
    assert.ok(html.includes('<span class="text-emerald-400">&quot;A1&quot;</span>'));
    assert.ok(html.includes('<span class="text-emerald-400">&#39;F9&#39;</span>'));

    // Ensure no nested spans inside class="..." attributes
    assert.equal(html.includes('text-violet-<span'), false);
    assert.equal(html.includes('400 font-medium">'), true);
    assert.equal(html.includes('</span> font-medium">'), false);
    assert.equal(html.includes('&#<span'), false);
  });

  it('highlights SQL without corrupting Tailwind class numbers or single quotes', () => {
    const sample =
      "SELECT name, COUNT(*) FROM students WHERE form = 3 AND house = 'Aggrey'; -- SHS 3";
    const html = highlightCodeLine(sample, 'sql');

    assert.ok(html.includes('<span class="text-sky-400 font-semibold">SELECT</span>'));
    assert.ok(html.includes('<span class="text-amber-300">3</span>'));
    assert.ok(html.includes('<span class="text-emerald-400">&#39;Aggrey&#39;</span>'));
    assert.ok(html.includes('<span class="text-slate-500 italic">-- SHS 3</span>'));
    assert.equal(html.includes('text-sky-<span'), false);
    assert.equal(html.includes('</span> font-semibold">'), false);
  });

  it('highlights HTML tags and escapes text safely', () => {
    const sample = '<section id="main">2 &lt; 3</section>';
    const html = highlightCodeLine(sample, 'html');
    assert.ok(html.includes('<span class="text-cyan-400">&lt;section</span>'));
    assert.ok(html.includes('<span class="text-amber-200"> id=&quot;main&quot;</span>'));
    assert.ok(html.includes('<span class="text-cyan-400">&gt;</span>'));
    assert.ok(html.includes('&amp;lt;'));
  });

  it('parses headings, math blocks, fenced code blocks, lists, and paragraphs', () => {
    const md = [
      '# Newton Mechanics',
      '',
      '$$F = ma$$',
      '',
      '- Velocity $v = u + at$',
      '- Impulse $J = Ft$',
      '',
      '```python',
      'def force(m, a):',
      '    return m * a',
      '```',
      '',
      'Always include **SI units**.',
    ].join('\n');

    const blocks = parseMarkdownBlocks(md);
    assert.equal(blocks.length, 5);
    assert.deepEqual(blocks[0], { type: 'heading', level: 1, text: 'Newton Mechanics' });
    assert.deepEqual(blocks[1], { type: 'math', tex: 'F = ma' });
    assert.equal(blocks[2].type, 'list');
    assert.equal(blocks[3].type, 'code');
    assert.equal(blocks[4].type, 'paragraph');

    const inlineHtml = renderInlineTextWithMath('**SI units** and `print(1)`');
    assert.ok(inlineHtml.includes('<strong class="font-semibold text-slate-100">SI units</strong>'));
    assert.ok(inlineHtml.includes('<code '));
  });

  it('parses Markdown tables with headers and data rows', () => {
    const md = [
      '| Physical Quantity | Formula | Dimensional Formula |',
      '| :--- | :--- | :--- |',
      '| Force | $F = ma$ | $[M^1 L^1 T^{-2}]$ |',
      '| Power | $P = W/t$ | $[M^1 L^2 T^{-3}]$ |',
    ].join('\n');

    const blocks = parseMarkdownBlocks(md);
    assert.equal(blocks.length, 1);
    assert.equal(blocks[0].type, 'table');
    if (blocks[0].type === 'table') {
      assert.deepEqual(blocks[0].headers, ['Physical Quantity', 'Formula', 'Dimensional Formula']);
      assert.equal(blocks[0].rows.length, 2);
      assert.equal(blocks[0].rows[0][0], 'Force');
      assert.equal(blocks[0].rows[1][2], '$[M^1 L^2 T^{-3}]$');
    }
  });

  it('renders bold spans that enclose inline KaTeX math without leftover asterisks', () => {
    const html = renderInlineTextWithMath(
      '**Mass ($M$)**, **LHS ($s$ — Displacement)**: $[L]$'
    );
    assert.equal(html.includes('**'), false);
    assert.ok(html.includes('<strong class="font-semibold text-slate-100">Mass ('));
    assert.ok(html.includes('<strong class="font-semibold text-slate-100">LHS ('));
    assert.ok(html.includes('katex'));
  });
});
