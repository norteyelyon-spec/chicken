export type AngleMode = 'deg' | 'rad';

export interface WorkingsEvalResult {
  ok: true;
  value: number;
  formatted: string;
}

export interface WorkingsEvalError {
  ok: false;
  error: string;
}

export type WorkingsEvaluation = WorkingsEvalResult | WorkingsEvalError;

type Token =
  | { type: 'number'; value: number }
  | { type: 'ident'; name: string }
  | { type: 'op'; op: string }
  | { type: 'lparen' }
  | { type: 'rparen' };

function normalizeExpression(raw: string): string {
  return raw
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/[−–—]/g, '-')
    .replace(/π/g, 'pi')
    .replace(/²/g, '^2')
    .replace(/³/g, '^3')
    .replace(/√\s*\(/g, 'sqrt(')
    .replace(/√\s*([0-9.]+)/g, 'sqrt($1)')
    .replace(/\s+/g, '');
}

function tokenize(expr: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < expr.length) {
    const ch = expr[i];

    if (/[0-9.]/.test(ch)) {
      let numStr = '';
      let dotCount = 0;
      while (i < expr.length && /[0-9.]/.test(expr[i])) {
        if (expr[i] === '.') {
          dotCount += 1;
          if (dotCount > 1) {
            throw new Error(`Invalid number format near "${numStr}."`);
          }
        }
        numStr += expr[i];
        i += 1;
      }
      // Handle scientific notation e.g. 1.5e-3 or 2E4
      if (i < expr.length && (expr[i] === 'e' || expr[i] === 'E')) {
        const nextChar = expr[i + 1];
        const afterSign = nextChar === '+' || nextChar === '-' ? expr[i + 2] : nextChar;
        if (afterSign && /[0-9]/.test(afterSign)) {
          numStr += expr[i];
          i += 1;
          if (expr[i] === '+' || expr[i] === '-') {
            numStr += expr[i];
            i += 1;
          }
          while (i < expr.length && /[0-9]/.test(expr[i])) {
            numStr += expr[i];
            i += 1;
          }
        }
      }
      const parsed = Number(numStr);
      if (!Number.isFinite(parsed)) {
        throw new Error(`Invalid number "${numStr}"`);
      }
      tokens.push({ type: 'number', value: parsed });
      continue;
    }

    if (/[a-zA-Z_]/.test(ch)) {
      let ident = '';
      while (i < expr.length && /[a-zA-Z0-9_]/.test(expr[i])) {
        ident += expr[i];
        i += 1;
      }
      tokens.push({ type: 'ident', name: ident.toLowerCase() });
      continue;
    }

    if (ch === '(') {
      tokens.push({ type: 'lparen' });
      i += 1;
      continue;
    }

    if (ch === ')') {
      tokens.push({ type: 'rparen' });
      i += 1;
      continue;
    }

    if ('+-*/^%'.includes(ch)) {
      tokens.push({ type: 'op', op: ch });
      i += 1;
      continue;
    }

    throw new Error(`Unsupported symbol "${ch}"`);
  }

  // Insert implicit multiplication (e.g. 2pi, 2(3+4), (2)(3), 3sin(30))
  const withImplicit: Token[] = [];
  for (let idx = 0; idx < tokens.length; idx += 1) {
    const curr = tokens[idx];
    const prev = withImplicit[withImplicit.length - 1];
    if (prev) {
      const prevEndsValue =
        prev.type === 'number' ||
        prev.type === 'rparen' ||
        (prev.type === 'ident' && curr.type !== 'lparen');
      const currStartsFactor =
        curr.type === 'lparen' || curr.type === 'ident' || curr.type === 'number';
      if (prevEndsValue && currStartsFactor && !(prev.type === 'number' && curr.type === 'number')) {
        withImplicit.push({ type: 'op', op: '*' });
      }
    }
    withImplicit.push(curr);
  }

  return withImplicit;
}

export function formatCalcValue(value: number): string {
  if (!Number.isFinite(value)) return String(value);
  const rounded = Math.abs(value) < 1e-12 ? 0 : value;
  const abs = Math.abs(rounded);
  if (abs !== 0 && (abs >= 1e9 || abs < 1e-5)) {
    return rounded.toExponential(6).replace(/\.?0+e/, 'e');
  }
  return Number(rounded.toPrecision(10)).toString();
}

export function evaluateWorkingsExpression(
  rawExpression: string,
  angleMode: AngleMode = 'deg'
): WorkingsEvaluation {
  const normalized = normalizeExpression(rawExpression);
  if (!normalized) {
    return { ok: false, error: 'Enter an expression to calculate.' };
  }

  try {
    const tokens = tokenize(normalized);
    let pos = 0;

    const peek = (): Token | undefined => tokens[pos];
    const consume = (): Token => tokens[pos++];

    const toRadians = (x: number) => (angleMode === 'deg' ? (x * Math.PI) / 180 : x);
    const fromRadians = (x: number) => (angleMode === 'deg' ? (x * 180) / Math.PI : x);

    const parseExpression = (): number => {
      let left = parseTerm();
      while (true) {
        const next = peek();
        if (next?.type === 'op' && (next.op === '+' || next.op === '-')) {
          consume();
          const right = parseTerm();
          left = next.op === '+' ? left + right : left - right;
        } else {
          break;
        }
      }
      return left;
    };

    const parseTerm = (): number => {
      let left = parsePower();
      while (true) {
        const next = peek();
        if (next?.type === 'op' && (next.op === '*' || next.op === '/' || next.op === '%')) {
          consume();
          const right = parsePower();
          if (next.op === '*') {
            left *= right;
          } else if (next.op === '/') {
            if (right === 0) throw new Error('Division by zero');
            left /= right;
          } else {
            if (right === 0) throw new Error('Modulo by zero');
            left %= right;
          }
        } else {
          break;
        }
      }
      return left;
    };

    const parsePower = (): number => {
      const base = parseUnary();
      const next = peek();
      if (next?.type === 'op' && next.op === '^') {
        consume();
        const exponent = parsePower(); // right-associative
        return Math.pow(base, exponent);
      }
      return base;
    };

    const parseUnary = (): number => {
      const next = peek();
      if (next?.type === 'op' && (next.op === '+' || next.op === '-')) {
        consume();
        const val = parseUnary();
        return next.op === '-' ? -val : val;
      }
      return parsePrimary();
    };

    const parsePrimary = (): number => {
      const tok = peek();
      if (!tok) {
        throw new Error('Incomplete expression');
      }

      if (tok.type === 'number') {
        consume();
        return tok.value;
      }

      if (tok.type === 'lparen') {
        consume();
        const inner = parseExpression();
        const closing = peek();
        if (closing?.type !== 'rparen') {
          throw new Error('Missing closing parenthesis ")"');
        }
        consume();
        return inner;
      }

      if (tok.type === 'ident') {
        consume();
        if (tok.name === 'pi') return Math.PI;
        if (tok.name === 'e') return Math.E;

        const next = peek();
        if (next?.type !== 'lparen') {
          throw new Error(`Unknown identifier "${tok.name}"`);
        }
        consume();
        const arg = parseExpression();
        const closing = peek();
        if (closing?.type !== 'rparen') {
          throw new Error(`Missing ")" after ${tok.name}(...)`);
        }
        consume();

        switch (tok.name) {
          case 'sqrt':
            if (arg < 0) throw new Error('Square root of negative number');
            return Math.sqrt(arg);
          case 'abs':
            return Math.abs(arg);
          case 'sin':
            return Math.sin(toRadians(arg));
          case 'cos':
            return Math.cos(toRadians(arg));
          case 'tan': {
            const rad = toRadians(arg);
            if (Math.abs(Math.cos(rad)) < 1e-12) {
              throw new Error('tan is undefined at 90° / π/2');
            }
            return Math.tan(rad);
          }
          case 'asin':
            if (arg < -1 || arg > 1) throw new Error('asin input must be in [-1, 1]');
            return fromRadians(Math.asin(arg));
          case 'acos':
            if (arg < -1 || arg > 1) throw new Error('acos input must be in [-1, 1]');
            return fromRadians(Math.acos(arg));
          case 'atan':
            return fromRadians(Math.atan(arg));
          case 'log':
            if (arg <= 0) throw new Error('log input must be positive');
            return Math.log10(arg);
          case 'ln':
            if (arg <= 0) throw new Error('ln input must be positive');
            return Math.log(arg);
          case 'exp':
            return Math.exp(arg);
          default:
            throw new Error(`Unsupported function "${tok.name}"`);
        }
      }

      throw new Error('Unexpected token in expression');
    };

    const result = parseExpression();
    if (pos < tokens.length) {
      throw new Error('Unexpected trailing input in expression');
    }
    if (!Number.isFinite(result)) {
      throw new Error('Result is undefined or out of numeric range');
    }

    return {
      ok: true,
      value: result,
      formatted: formatCalcValue(result),
    };
  } catch (err) {
    return {
      ok: false,
      error: (err as Error).message || 'Invalid expression',
    };
  }
}
