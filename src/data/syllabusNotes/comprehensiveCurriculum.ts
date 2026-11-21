import type { StudyNote } from '../../types';

const CREATED_AT = '2026-01-20T08:00:00.000Z';

export const COMPREHENSIVE_CURRICULUM_NOTES: StudyNote[] = [
  // =========================================================================
  // 1. CORE MATHEMATICS (SHS 1 - 3 GES/NaCCA)
  // =========================================================================
  {
    id: 'note-coremath-s1-real-numbers',
    topicId: 'coremath-s1-sets',
    isBuiltIn: true,
    title: 'Real Number System: Classification, Properties, Significant Figures & Standard Form',
    subject: 'coremath',
    grade: 'SHS1',
    tags: ['SHS1', 'Core Maths', 'Real Numbers', 'Standard Form', 'Significant Figures'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Real Number System, Properties & Standard Form

## 1. Hierarchy of Real Numbers ($\\mathbb{R}$)
- **Natural Numbers ($\\mathbb{N}$):** Counting numbers $\\{1, 2, 3, 4, \\dots\\}$.
- **Whole Numbers ($\\mathbb{W}$):** Natural numbers plus zero $\\{0, 1, 2, 3, \\dots\\}$.
- **Integers ($\\mathbb{Z}$):** Positive and negative whole numbers $\\{\\dots, -2, -1, 0, 1, 2, \\dots\\}$.
- **Rational Numbers ($\\mathbb{Q}$):** Any number expressible as $\\frac{p}{q}$ where $p, q \\in \\mathbb{Z}$ and $q \\neq 0$ (terminating or repeating decimals such as $\\frac{3}{4} = 0.75$ or $0.\\overline{3} = \\frac{1}{3}$).
- **Irrational Numbers ($\\mathbb{Q}'$):** Non-terminating, non-repeating decimals that cannot be written as fractions of integers (e.g., $\\sqrt{2}, \\sqrt{5}, \\pi, e$).
- **Real Numbers ($\\mathbb{R}$):** Union of all rational and irrational numbers: $\\mathbb{R} = \\mathbb{Q} \\cup \\mathbb{Q}'$.

## 2. Algebraic Field Properties of Real Numbers
| Property | Addition | Multiplication |
| :--- | :--- | :--- |
| **Closure** | $a + b \\in \\mathbb{R}$ | $a \\cdot b \\in \\mathbb{R}$ |
| **Commutative** | $a + b = b + a$ | $a \\cdot b = b \\cdot a$ |
| **Associative** | $(a + b) + c = a + (b + c)$ | $(ab)c = a(bc)$ |
| **Identity Element** | Additive identity is $0$ ($a + 0 = a$) | Multiplicative identity is $1$ ($a \\cdot 1 = a$) |
| **Inverse Element** | Additive inverse of $a$ is $-a$ | Multiplicative inverse of $a \\neq 0$ is $\\frac{1}{a}$ |
| **Distributive** | $a(b + c) = ab + ac$ | Division by zero is **strictly undefined** |

## 3. Significant Figures & Standard Form
- **Significant Figures Rules:**
  1. All non-zero digits ($1\\text{–}9$) are always significant.
  2. Zeros *between* non-zero digits are significant ($4007$ has 4 s.f.).
  3. Leading zeros before the first non-zero digit are **not** significant ($0.0045$ has 2 s.f.).
  4. Trailing zeros after a decimal point are significant ($2.500$ has 4 s.f.).
- **Standard Form (Scientific Notation):** Written as $A \\times 10^n$ where $1 \\le A < 10$ and $n \\in \\mathbb{Z}$.
  - Large numbers ($\\ge 10$) have positive exponent $n$ (e.g., $456,000 = 4.56 \\times 10^5$).
  - Small decimals ($< 1$) have negative exponent $n$ (e.g., $0.00072 = 7.2 \\times 10^{-4}$).

## 4. Worked WASSCE Example
**Question:** Evaluate $\\frac{0.0036 \\times 4.2 \\times 10^5}{0.018}$, leaving your answer in standard form to 2 significant figures.
- Convert components: $0.0036 = 3.6 \\times 10^{-3}$ and $0.018 = 1.8 \\times 10^{-2}$.
- Divide coefficients: $\\frac{3.6 \\times 4.2}{1.8} = 2 \\times 4.2 = 8.4$.
- Combine powers of $10$: $10^{-3 + 5 - (-2)} = 10^4$.
- **Result:** $8.4 \\times 10^4$ (already satisfies $1 \\le 8.4 < 10$, 2 s.f.).`,
  },
  {
    id: 'note-coremath-s1-algebra-relations',
    topicId: 'coremath-s1-algebra',
    isBuiltIn: true,
    title: 'Algebraic Expressions, Factorization, Change of Subject & Relations/Functions',
    subject: 'coremath',
    grade: 'SHS1',
    tags: ['SHS1', 'Core Maths', 'Algebra', 'Factorization', 'Functions'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Algebraic Expressions, Factorization & Relations/Functions

## 1. Expansion, Factorization & Algebraic Fractions
- **Difference of Two Squares:** $a^2 - b^2 = (a - b)(a + b)$.
- **Perfect Square Trinomials:** $(a \\pm b)^2 = a^2 \\pm 2ab + b^2$.
- **Factoring Quadratics ($ax^2 + bx + c$):** Find two numbers $m, n$ such that $m + n = b$ and $m \\cdot n = ac$, split the middle term, and factor by grouping.
- **Algebraic Fractions:** Factorize numerator and denominator completely before cancelling common factors; never cancel individual terms across a $+$ or $-$ sign!
  - Example: $\\frac{x^2 - 9}{x^2 + 5x + 6} = \\frac{(x - 3)(x + 3)}{(x + 2)(x + 3)} = \\frac{x - 3}{x + 2}$ (valid for $x \\neq -2, -3$).

## 2. Change of Subject of a Formula
1. Clear fractions by multiplying every term by the LCM of denominators.
2. Eliminate square roots by squaring both sides if required.
3. Collect all terms containing the target variable onto the LHS and remaining terms onto the RHS.
4. Factor out the target variable and divide by its coefficient.
- **Worked Example:** Make $r$ the subject of $V = \\frac{1}{3}\\pi r^2 h$:
  $$3V = \\pi r^2 h \\implies r^2 = \\frac{3V}{\\pi h} \\implies r = \\sqrt{\\frac{3V}{\\pi h}}$$

## 3. Relations, Mappings & Functions
- A **Relation** pairs elements from a **Domain** ($X$, input set) to a **Co-domain** ($Y$, target set). The **Range** is the subset of $Y$ actually mapped onto.
- **Four Types of Relations:**
  1. **One-to-One:** Each input maps to a unique output (is a function).
  2. **Many-to-One:** Multiple inputs share the same output (is a function, e.g., $f(x) = x^2$).
  3. **One-to-Many:** One input maps to multiple outputs (**not** a function).
  4. **Many-to-Many:** Multiple inputs map to multiple outputs (**not** a function).
- **WASSCE Mapping Rule Test:** For an arithmetic linear sequence mapping $x \\mapsto y$, find constant difference $m = \\frac{\\Delta y}{\\Delta x}$ and substitute a point to get $y = mx + c$.`,
  },
  {
    id: 'note-coremath-s2-modular-simultaneous',
    topicId: 'coremath-s2-geometry',
    isBuiltIn: true,
    title: 'Modular Arithmetic (mod n) & Simultaneous Linear Equations',
    subject: 'coremath',
    grade: 'SHS2',
    tags: ['SHS2', 'Core Maths', 'Modular Arithmetic', 'Simultaneous Equations'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Modular Arithmetic & Simultaneous Linear Equations

## 1. Modular Arithmetic (Clock / Remainder Arithmetic)
- We write $a \\equiv r \\pmod{n}$ if integer $a$ leaves remainder $r$ ($0 \\le r < n$) when divided by modulus $n > 0$. Equivalently, $n$ divides $(a - r)$.
- **Reduction Rule:** Divide $a$ by $n$ and take the non-negative remainder. For negative numbers, add multiples of $n$ until in $\\{0, 1, \\dots, n-1\\}$ (e.g., $-3 \\equiv 2 \\pmod{5}$ because $-3 + 5 = 2$).
- **Modular Operations:**
  - Addition: $(a \\oplus_n b) = (a + b) \\bmod n$.
  - Multiplication: $(a \\otimes_n b) = (a \\times b) \\bmod n$.
- **Solving Modular Equations:** Solve $3x + 2 \\equiv 1 \\pmod{5}$:
  - Test $x \\in \\{0, 1, 2, 3, 4\\}$, or simplify $3x \\equiv -1 \\equiv 4 \\equiv 9 \\pmod{5} \\implies x \\equiv 3 \\pmod{5}$.
- **Cyclic Day/Clock Applications:** If today is Tuesday (Day 2), what day is it $100$ days from now? $100 = 14 \\times 7 + 2 \\equiv 2 \\pmod{7}$, so $2 + 2 = 4$ (Thursday).

## 2. Simultaneous Linear Equations in Two Variables
Given $a_1 x + b_1 y = c_1$ and $a_2 x + b_2 y = c_2$:
1. **Elimination Method:** Scale equations so coefficients of $x$ (or $y$) match in magnitude, then add (opposite signs) or subtract (same signs) to eliminate one variable.
2. **Substitution Method:** Isolate one variable from the simpler equation and substitute into the second equation.
3. **Graphical Method:** Plot both lines; the coordinates $(x_0, y_0)$ of their intersection represent the unique solution. Parallel lines indicate no solution; coincident lines indicate infinitely many solutions.

## 3. Worked Word Problem
*3 pens and 2 notebooks cost GH₵ 26, while 5 pens and 3 notebooks cost GH₵ 41. Find unit prices.*
- Let pen $= p$, notebook $= n$: (1) $3p + 2n = 26$, (2) $5p + 3n = 41$.
- Multiply (1) by $3$ and (2) by $2$: $9p + 6n = 78$ and $10p + 6n = 82$.
- Subtract: $p = 4$. Substitute into (1): $12 + 2n = 26 \\implies n = 7$.
- **Answer:** Each pen costs GH₵ 4 and each notebook costs GH₵ 7.`,
  },
  {
    id: 'note-coremath-s2-sequences-ap-gp',
    topicId: 'coremath-s2-mensuration',
    isBuiltIn: true,
    title: 'Sequences & Series: Arithmetic (AP) & Geometric Progressions (GP)',
    subject: 'coremath',
    grade: 'SHS2',
    tags: ['SHS2', 'Core Maths', 'AP', 'GP', 'Sequences', 'Series'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Sequences & Series (Arithmetic & Geometric Progressions)

## 1. Arithmetic Progression (AP)
An AP has a constant **common difference** $d = U_2 - U_1 = U_{n+1} - U_n$ between consecutive terms.
- **$n$-th Term:**
  $$U_n = a + (n - 1)d$$
  where $a = U_1$ is the first term.
- **Sum of the first $n$ terms ($S_n$):**
  $$S_n = \\frac{n}{2}[2a + (n - 1)d] = \\frac{n}{2}(a + l)$$
  where $l = U_n$ is the last term.
- **Arithmetic Mean:** If $x, y, z$ are consecutive AP terms, then $2y = x + z \\implies y = \\frac{x + z}{2}$.

## 2. Geometric Progression (GP)
A GP has a constant non-zero **common ratio** $r = \\frac{U_2}{U_1} = \\frac{U_{n+1}}{U_n}$.
- **$n$-th Term:**
  $$U_n = ar^{n-1}$$
- **Sum of the first $n$ terms ($S_n$):**
  $$S_n = \\frac{a(1 - r^n)}{1 - r} \\text{ for } |r| < 1, \\quad \\text{or} \\quad S_n = \\frac{a(r^n - 1)}{r - 1} \\text{ for } r > 1$$
- **Geometric Mean:** If $x, y, z$ are consecutive GP terms, then $y^2 = xz$.
- **Sum to Infinity (for convergent GP with $|r| < 1$):**
  $$S_\\infty = \\frac{a}{1 - r}$$

## 3. Worked WASSCE Problem
**Question:** The 3rd term of a GP is $12$ and the 6th term is $96$. Find the common ratio $r$, first term $a$, and sum of the first 5 terms.
- $U_3 = ar^2 = 12$ and $U_6 = ar^5 = 96$.
- Divide $U_6 / U_3$: $\\frac{ar^5}{ar^2} = \\frac{96}{12} \\implies r^3 = 8 \\implies r = 2$.
- Substitute $r = 2$: $a(2)^2 = 12 \\implies 4a = 12 \\implies a = 3$.
- Sum of first 5 terms: $S_5 = \\frac{3(2^5 - 1)}{2 - 1} = 3(31) = 93$.`,
  },
  {
    id: 'note-coremath-s3-constructions-earth',
    topicId: 'coremath-s3-trigonometry',
    isBuiltIn: true,
    title: 'Geometrical Constructions, Loci & The Earth as a Sphere',
    subject: 'coremath',
    grade: 'SHS3',
    tags: ['SHS3', 'Core Maths', 'Constructions', 'Loci', 'Earth as a Sphere'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Geometrical Constructions, Loci & The Earth as a Sphere

## 1. Standard Ruler & Compasses Only Constructions
- **Perpendicular Bisector of $AB$:** Open compass $> \\frac{1}{2}AB$, draw arcs above and below from $A$ and $B$, join intersections. Every point on this line is equidistant from points $A$ and $B$.
- **Angle Bisector:** Draw arc from vertex cutting both arms at $P, Q$; draw equal-radius arcs from $P, Q$ intersecting inside the angle; join to vertex. Every point is equidistant from the two lines.
- **Standard Constructible Angles:**
  - $60^\\circ$: equilateral arc method. Bisect $60^\\circ \\rightarrow 30^\\circ \\rightarrow 15^\\circ$.
  - $90^\\circ$: perpendicular at a point ($180^\\circ$ bisected). Bisect $90^\\circ \\rightarrow 45^\\circ$.
  - $120^\\circ$: two consecutive $60^\\circ$ arcs; $75^\\circ = 60^\\circ + \\frac{30^\\circ}{2}$; $105^\\circ = 90^\\circ + 15^\\circ$; $135^\\circ = 90^\\circ + 45^\\circ$.
- **Loci Summary:**
  1. Equidistant from fixed point $P$: Circle centered at $P$.
  2. Equidistant from two points $A, B$: Perpendicular bisector of $AB$.
  3. Equidistant from two intersecting lines: Angle bisectors of the angle between them.
  4. Constant distance from straight line: Two parallel lines on either side.

## 2. The Earth as a Sphere (Mensuration II)
- Mean Earth radius $R = 6400\\text{ km}$, $\\pi \\approx \\frac{22}{7}$.
- **Great Circles:** Equator ($0^\\circ$ latitude) and all lines of **Longitude (Meridians)** have radius $R$.
- **Small Circles (Parallels of Latitude $\\theta$):** Radius decreases away from the Equator:
  $$r = R \\cos\\theta$$
- **Angular Difference Rules:** Same side (N & N, or E & E) $\\rightarrow$ **subtract** angles; opposite sides (N & S, or E & W) $\\rightarrow$ **add** angles.
- **Distance along Meridian (or Equator):**
  $$D = \\frac{\\alpha}{360^\\circ} \\times 2\\pi R$$
- **Distance along Parallel of Latitude $\\theta$:**
  $$D = \\frac{\\alpha}{360^\\circ} \\times 2\\pi R \\cos\\theta$$`,
  },
  {
    id: 'note-coremath-s3-logic-trig-graphs',
    topicId: 'coremath-s3-statistics',
    isBuiltIn: true,
    title: 'Logical Reasoning (Truth Tables & Venn Arguments) & Trigonometric Graphs',
    subject: 'coremath',
    grade: 'SHS3',
    tags: ['SHS3', 'Core Maths', 'Logic', 'Truth Tables', 'Trigonometric Graphs'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Logical Reasoning & Trigonometric Graphs

## 1. Mathematical Logic & Connectives
A **mathematical statement** is a declarative sentence that is strictly either True ($T$) or False ($F$).
- **Negation ($\\sim p$):** Opposite truth value of $p$.
- **Conjunction ($p \\land q$):** "$p$ and $q$" — True **only** when both $p$ and $q$ are True.
- **Disjunction ($p \\lor q$):** "$p$ or $q$" — False **only** when both $p$ and $q$ are False.
- **Implication ($p \\implies q$):** "If $p$, then $q$" — False **only** when $p$ is True and $q$ is False.
  - **Converse:** $q \\implies p$.
  - **Inverse:** $\\sim p \\implies \\sim q$.
  - **Contrapositive:** $\\sim q \\implies \\sim p$ (always logically **equivalent** to $p \\implies q$).
- **Biconditional ($p \\iff q$):** True when $p$ and $q$ share the same truth value.
- **Tautology:** Compound proposition that is always True in every row. **Contradiction:** Always False.

## 2. Trigonometric Wave Graphs ($0^\\circ \\le x \\le 360^\\circ$)
- Graph of $y = a \\sin(bx)$:
  - Starts at $(0^\\circ, 0)$, peaks at amplitude $+a$, period $= \\frac{360^\\circ}{b}$.
- Graph of $y = a \\cos(bx)$:
  - Starts at maximum $(0^\\circ, +a)$, crosses zero at $90^\\circ/b$, trough $-a$ at $180^\\circ/b$, returns to $+a$ at $360^\\circ/b$.
- **Graphical Solutions:** To solve $a\\cos x + c = 0$, rewrite as $y = a\\cos x$ and read $x$-coordinates where the curve intersects horizontal line $y = -c$ (or linear line $y = mx + k$).`,
  },

  // =========================================================================
  // 2. ADDITIONAL (ELECTIVE) MATHEMATICS (SHS 1 - 3 GES/NaCCA)
  // =========================================================================
  {
    id: 'note-addmath-s1-binary-operations',
    topicId: 'math-s1-algebra',
    isBuiltIn: true,
    title: 'Binary Operations: Properties, Identity, Inverse Elements & Cayley Tables',
    subject: 'addmaths',
    grade: 'SHS1',
    tags: ['SHS1', 'Add Maths', 'Binary Operations', 'Cayley Tables', 'Identity'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Binary Operations & Cayley Tables

## 1. Definition & Closure
A binary operation $*$ on a non-empty set $S$ is a rule assigning every ordered pair $(a, b) \\in S \\times S$ to a unique element $a * b$.
- **Closure:** $S$ is closed under $*$ if $a * b \\in S$ for every $a, b \\in S$.

## 2. Algebraic Properties
- **Commutativity:** $a * b = b * a$ for all $a, b \\in S$. (On a Cayley table, the grid is symmetric across the main top-left to bottom-right diagonal.)
- **Associativity:** $(a * b) * c = a * (b * c)$ for all $a, b, c \\in S$.
- **Distributivity:** $*$ distributes over $\\Delta$ if $a * (b \\Delta c) = (a * b) \\Delta (a * c)$.

## 3. Identity ($e$) and Inverse ($a^{-1}$)
- **Identity Element $e$:** An element $e \\in S$ such that $a * e = e * a = a$ for all $a \\in S$.
  - *Tip:* In a Cayley table, look for the row identical to the top header and the column identical to the left header!
- **Inverse Element $a^{-1}$:** Given identity $e$, the inverse of $a$ is $a^{-1} \\in S$ satisfying $a * a^{-1} = a^{-1} * a = e$. Note any element making the denominator zero has **no inverse**.

## 4. Worked WASSCE Example
*Operation $a * b = a + b + 2ab$ on $\\mathbb{R}$. Find $e$ and the inverse of $3$.*
1. **Identity:** $a * e = a \\implies a + e + 2ae = a \\implies e(1 + 2a) = 0 \\implies e = 0$.
2. **Inverse of $3$:** $3 * x = e = 0 \\implies 3 + x + 2(3)x = 0 \\implies 7x = -3 \\implies x = -\\frac{3}{7}$.`,
  },
  {
    id: 'note-addmath-s1-functions-rational',
    topicId: 'math-s1-quadratics',
    isBuiltIn: true,
    title: 'Mappings, Injective/Surjective/Bijective Functions, Inverses & Partial Fractions',
    subject: 'addmaths',
    grade: 'SHS1',
    tags: ['SHS1', 'Add Maths', 'Bijective', 'Inverse Functions', 'Partial Fractions'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Functions, Composition, Inverses & Rational Partial Fractions

## 1. Classification of Functions
- **Injective (One-to-One):** $f(a) = f(b) \\implies a = b$. Passes the Horizontal Line Test.
- **Surjective (Onto):** Range equals the entire Co-domain (every $y \\in Y$ has at least one pre-image $x \\in X$).
- **Bijective:** Both injective and surjective; **only bijective functions possess an inverse $f^{-1}$**.

## 2. Composite & Inverse Functions
- **Composite Function:** $(f \\circ g)(x) = f(g(x))$ (apply $g$ first, then $f$; generally $f(g(x)) \\neq g(f(x))$).
- **Finding $f^{-1}(x)$:** Write $y = f(x)$, swap $x$ and $y$ (or solve explicitly for $x$ in terms of $y$), then state domain restrictions (denominators $\\neq 0$).
- Graphically, $y = f^{-1}(x)$ is the reflection of $y = f(x)$ in the line $y = x$.

## 3. Rational Functions & Partial Fractions
For a rational function $\\frac{P(x)}{Q(x)}$:
- **Improper Fraction ($\\deg P \\ge \\deg Q$):** First perform polynomial **long division** to get $S(x) + \\frac{R(x)}{Q(x)}$.
- **Partial Fraction Templates:**
  1. **Distinct Linear Factors:** $\\frac{px + q}{(x - a)(x - b)} \\equiv \\frac{A}{x - a} + \\frac{B}{x - b}$.
  2. **Repeated Linear Factor:** $\\frac{px + q}{(x - a)^2} \\equiv \\frac{A}{x - a} + \\frac{B}{(x - a)^2}$.
  3. **Irreducible Quadratic Factor:** $\\frac{px + q}{(x - a)(x^2 + k)} \\equiv \\frac{A}{x - a} + \\frac{Bx + C}{x^2 + k}$.`,
  },
  {
    id: 'note-addmath-s1-linear-programming',
    topicId: 'math-s1-quadratics',
    isBuiltIn: true,
    title: 'Inequalities, Sign Charts & Two-Variable Linear Programming',
    subject: 'addmaths',
    grade: 'SHS1',
    tags: ['SHS1', 'Add Maths', 'Linear Programming', 'Inequalities', 'Optimization'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Inequalities & Linear Programming Optimization

## 1. Quadratic & Rational Inequalities
Never cross-multiply an unknown denominator $x - a$ in a rational inequality $\\frac{P(x)}{Q(x)} > 0$ because its sign may be negative and flip the inequality!
- **Sign Chart Method:**
  1. Bring all terms to one side ($\\le 0$ or $> 0$) and combine into a single fraction.
  2. Find critical points where numerator $= 0$ or denominator $= 0$ (denominator roots are always excluded with open circles).
  3. Test sign of each interval and select matching regions.

## 2. Linear Programming (WASSCE Paper 2 Application)
1. Define decision variables $x, y \\ge 0$ (non-negativity constraints).
2. Translate word conditions ("at least" $\\ge$, "at most / budget limit" $\\le$) into linear inequalities.
3. Draw boundary lines ($=$ solid for $\\le / \\ge$, dashed for $< / >$) and shade the unwanted region (or feasible region, clearly labeled **R**).
4. **Corner-Point Theorem:** The maximum or minimum value of the linear objective function $P = ax + by$ always occurs at one of the **vertices (corner points)** of the convex feasible region. Evaluate $P$ at every vertex!`,
  },
  {
    id: 'note-addmath-s2-parabola-conics',
    topicId: 'math-s2-coordgeo',
    isBuiltIn: true,
    title: 'Coordinate Geometry II: General Circle & Parabola (Focus, Directrix, Tangents)',
    subject: 'addmaths',
    grade: 'SHS2',
    tags: ['SHS2', 'Add Maths', 'Circle Equation', 'Parabola', 'Tangent', 'Normal'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Coordinate Geometry II: Circles & Parabola

## 1. Equations of a Circle
- **Standard Form:** $(x - a)^2 + (y - b)^2 = r^2$ with center $(a, b)$ and radius $r$.
- **General Form:** $x^2 + y^2 + 2gx + 2fy + c = 0$:
  - Center $= (-g, -f)$.
  - Radius $r = \\sqrt{g^2 + f^2 - c}$ (requires $g^2 + f^2 - c > 0$).
- **Tangent at Point $(x_1, y_1)$ on Circle:** Radius gradient $m_r = \\frac{y_1 - b}{x_1 - a}$; tangent gradient $m_t = -\\frac{1}{m_r}$ (perpendicular to radius).

## 2. The Parabola ($y^2 = 4ax$)
A parabola is the locus of points equidistant from a fixed point (**focus**) and a fixed straight line (**directrix**).
- For standard rightward parabola $y^2 = 4ax$ ($a > 0$):
  - **Vertex:** $(0, 0)$
  - **Focus:** $S(a, 0)$
  - **Directrix:** $x = -a$
  - **Latus Rectum Length:** $4a$ (passes through $S(a,0)$)
  - **Parametric Coordinates:** $(at^2, 2at)$
- **Differentiating for Tangent & Normal:** $2y\\frac{dy}{dx} = 4a \\implies \\frac{dy}{dx} = \\frac{2a}{y}$. At $(at^2, 2at)$, tangent gradient is $\\frac{1}{t}$ and normal gradient is $-t$.`,
  },
  {
    id: 'note-addmath-s2-statics-lami',
    topicId: 'math-s2-vectors',
    isBuiltIn: true,
    title: 'Statics: Resolution of Forces, Lami’s Theorem, Friction & Moments',
    subject: 'addmaths',
    grade: 'SHS2',
    tags: ['SHS2', 'Add Maths', 'Statics', 'Lami Theorem', 'Friction', 'Moments'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Mechanics — Statics, Lami’s Theorem, Friction & Moments

## 1. Resolution of Coplanar Forces
For any force $F$ acting at angle $\\theta$ to the positive $x$-axis:
$$F_x = F \\cos\\theta, \\qquad F_y = F \\sin\\theta$$
Resultant magnitude $R = \\sqrt{(\\sum F_x)^2 + (\\sum F_y)^2}$ and direction $\\tan\\alpha = \\frac{\\sum F_y}{\\sum F_x}$.

## 2. Equilibrium & Lami’s Theorem
A particle is in translational equilibrium when $\\sum F_x = 0$ and $\\sum F_y = 0$.
- **Lami’s Theorem (3 Coplanar Equilibrium Forces):** If three forces $P, Q, R$ meet at a point and balance, each force is proportional to the sine of the angle between the other two:
  $$\\frac{P}{\\sin\\alpha} = \\frac{Q}{\\sin\\beta} = \\frac{R}{\\sin\\gamma}$$

## 3. Limiting Friction & Rigid Body Moments
- **Limiting Static Friction:** $F_{\\max} = \\mu R$ where $\\mu$ is the coefficient of friction and $R$ is normal reaction.
- **Angle of Friction $\\lambda$:** $\\tan\\lambda = \\mu$.
- **Moment (Torque) of a Force:** $\\tau = F \\times d_\\perp$. For rigid body equilibrium: $\\sum F_x = 0$, $\\sum F_y = 0$, and $\\sum \\text{Clockwise Moments} = \\sum \\text{Anticlockwise Moments}$.`,
  },
  {
    id: 'note-addmath-s3-linear-transforms',
    topicId: 'math-s2-vectors',
    isBuiltIn: true,
    title: 'Linear Transformations ($2\\times 2$ Matrices): Reflection, Rotation, Shear & Determinant',
    subject: 'addmaths',
    grade: 'SHS3',
    tags: ['SHS3', 'Add Maths', 'Matrices', 'Linear Transformations', 'Determinant'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Linear Transformations in the Coordinate Plane

## 1. Matrix Representation
A linear transformation $T$ maps position vector $\\begin{pmatrix} x \\\\ y \\end{pmatrix} \\mapsto \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}\\begin{pmatrix} x \\\\ y \\end{pmatrix}$.
- **Column Rule:** Column 1 is the image of $\\mathbf{i} = \\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix}$ and Column 2 is the image of $\\mathbf{j} = \\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix}$.

## 2. Standard WASSCE Transformation Matrices
- **Reflection in $x$-axis ($y=0$):** $\\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}$
- **Reflection in $y$-axis ($x=0$):** $\\begin{pmatrix} -1 & 0 \\\\ 0 & 1 \\end{pmatrix}$
- **Reflection in $y = x$:** $\\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$; in $y = -x$: $\\begin{pmatrix} 0 & -1 \\\\ -1 & 0 \\end{pmatrix}$
- **Anticlockwise Rotation by $\\theta$ about Origin:** $\\begin{pmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{pmatrix}$
- **Enlargement scale $k$ center $(0,0)$:** $\\begin{pmatrix} k & 0 \\\\ 0 & k \\end{pmatrix}$
- **Shear parallel to $x$-axis factor $k$:** $\\begin{pmatrix} 1 & k \\\\ 0 & 1 \\end{pmatrix}$

## 3. Composite Transformations & Area Scale Factor
- Applying $A$ followed by $B$ corresponds to matrix product **$BA$** (right-to-left order!).
- **Area Property:** $\\text{Area of Image} = |\\det(M)| \\times \\text{Area of Object}$. If $\\det(M) = 0$, the transformation is singular and collapses 2D shapes onto a line/point.`,
  },
  {
    id: 'note-addmath-s3-correlation-regression',
    topicId: 'math-s3-stats',
    isBuiltIn: true,
    title: 'Correlation & Regression: Pearson’s r, Spearman’s ρ & Lines of Best Fit',
    subject: 'addmaths',
    grade: 'SHS3',
    tags: ['SHS3', 'Add Maths', 'Correlation', 'Regression', 'Pearson', 'Spearman'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Bivariate Statistics: Correlation & Linear Regression

## 1. Scatter Diagrams & Correlation Coefficient ($r$)
Correlation measures the strength and direction of a **linear** relationship between two variables ($-1 \\le r \\le +1$):
- $r = +1$: Perfect positive linear correlation; $r = 0$: No linear correlation; $r = -1$: Perfect negative linear correlation.
- **Pearson’s Product-Moment Correlation ($r$):**
  $$r = \\frac{n\\sum xy - (\\sum x)(\\sum y)}{\\sqrt{[n\\sum x^2 - (\\sum x)^2][n\\sum y^2 - (\\sum y)^2]}}$$
- **Spearman’s Rank Correlation ($\\rho$ or $r_s$):**
  $$r_s = 1 - \\frac{6\\sum d^2}{n(n^2 - 1)}$$
  where $d = R_x - R_y$ is the rank difference for each pair of the $n$ observations.

## 2. Linear Regression Line ($y$ on $x$)
Used to predict $y$ from a given $x$ inside the data range (interpolation):
$$y - \\bar{y} = b_{yx}(x - \\bar{x}), \\qquad b_{yx} = \\frac{n\\sum xy - (\\sum x)(\\sum y)}{n\\sum x^2 - (\\sum x)^2}$$
Notice the regression line **always passes through the mean point $(\\bar{x}, \\bar{y})$**, and the product of the two regression slopes satisfies $b_{yx} \\cdot b_{xy} = r^2$.`,
  },
  {
    id: 'note-addmath-s3-dynamics-pulleys',
    topicId: 'math-s3-diffcalc',
    isBuiltIn: true,
    title: 'Dynamics: Momentum, Elastic/Inelastic Collisions, Inclined Planes & Pulleys',
    subject: 'addmaths',
    grade: 'SHS3',
    tags: ['SHS3', 'Add Maths', 'Dynamics', 'Pulleys', 'Inclined Planes', 'Momentum'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Mechanics — Dynamics, Collisions, Inclined Planes & Connected Particles

## 1. Impulse, Momentum & Collisions
- **Linear Momentum:** $\\mathbf{p} = m\\mathbf{v}$ ($\\text{kg m s}^{-1}$).
- **Impulse:** $\\mathbf{J} = \\mathbf{F}\\Delta t = m\\mathbf{v} - m\\mathbf{u}$ (change in momentum).
- **Conservation of Linear Momentum:** When net external force is zero:
  $$m_1 u_1 + m_2 u_2 = m_1 v_1 + m_2 v_2$$
- **Coalescing (Inelastic) Impact:** Common velocity $V = \\frac{m_1 u_1 + m_2 u_2}{m_1 + m_2}$; kinetic energy is lost as heat/sound.

## 2. Motion on an Inclined Plane (Angle $\\alpha$)
- Weight components: $mg \\sin\\alpha$ parallel down the plane; $mg \\cos\\alpha$ perpendicular to the plane ($R = mg\\cos\\alpha$).
- If friction $\\mu$ opposes downward sliding:
  $$mg\\sin\\alpha - \\mu mg\\cos\\alpha = ma \\implies a = g(\\sin\\alpha - \\mu\\cos\\alpha)$$

## 3. Connected Particles (Light Inextensible String over Smooth Pulley)
For masses $m_1 > m_2$ hanging vertically over a smooth pulley:
- Equation for $m_1$ (accelerating down): $m_1 g - T = m_1 a$.
- Equation for $m_2$ (accelerating up): $T - m_2 g = m_2 a$.
- Add equations to eliminate tension $T$:
  $$a = \\frac{(m_1 - m_2)g}{m_1 + m_2}, \\qquad T = \\frac{2 m_1 m_2 g}{m_1 + m_2}$$`,
  },

  // =========================================================================
  // 3. PHYSICS (SHS 1 - 3 GES/NaCCA)
  // =========================================================================
  {
    id: 'note-phys-s1-pressure-flotation',
    topicId: 'phys-s1-dynamics',
    isBuiltIn: true,
    title: 'Pressure in Solids & Fluids, Pascal’s Hydraulics & Archimedes’ Principle',
    subject: 'physics',
    grade: 'SHS1',
    tags: ['SHS1', 'Physics', 'Pressure', 'Pascal', 'Archimedes', 'Flotation'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Pressure, Hydraulics, Barometers & Flotation

## 1. Pressure in Solids & Liquids
- **Solid Pressure:** $P = \\frac{F_\\perp}{A}$ ($1\\text{ Pa} = 1\\text{ N m}^{-2}$). Smaller contact area yields higher pressure.
- **Hydrostatic Liquid Pressure:** $P = h\\rho g$ (depends on depth $h$, fluid density $\\rho$, and $g$ — independent of container cross-section!).
- **Total Absolute Pressure:** $P_{\\text{abs}} = P_{\\text{atm}} + h\\rho g$.

## 2. Pascal’s Principle & Hydraulic Press
Pressure applied to an enclosed incompressible fluid is transmitted undiminished to every point:
$$\\frac{F_1}{A_1} = \\frac{F_2}{A_2} \\implies F_2 = F_1 \\left(\\frac{A_2}{A_1}\\right) = F_1 \\left(\\frac{r_2}{r_1}\\right)^2$$
Wait: Energy is conserved ($F_1 d_1 = F_2 d_2$), so a larger piston moves a smaller distance!

## 3. Barometers, Manometers & Archimedes’ Principle
- **Mercury Barometer:** $P_{\\text{atm}} = h\\rho_{\\text{Hg}} g \\approx 0.76\\text{ m} \\times 13600 \\times 9.81 \\approx 1.013 \\times 10^5\\text{ Pa}$.
- **Archimedes’ Principle:** Upthrust $U$ equals weight of displaced fluid:
  $$U = V_{\\text{sub}}\\rho_{\\text{fluid}} g = W_{\\text{air}} - W_{\\text{fluid}}$$
- **Law of Flotation:** A floating body displaces its own weight of fluid ($U = mg$). Fraction submerged $= \\frac{\\rho_{\\text{object}}}{\\rho_{\\text{fluid}}}$.`,
  },
  {
    id: 'note-phys-s1-electrostatics-capacitors',
    topicId: 'phys-s3-electricity',
    isBuiltIn: true,
    title: 'Electrostatics, Coulomb’s Law, Electric Potential & Parallel-Plate Capacitors',
    subject: 'physics',
    grade: 'SHS1',
    tags: ['SHS1', 'Physics', 'Electrostatics', 'Coulomb Law', 'Capacitors'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Electrostatics, Electric Fields & Capacitors

## 1. Charge, Coulomb’s Law & Electric Field
- **Quantization:** $q = ne$ ($e = 1.602 \\times 10^{-19}\\text{ C}$).
- **Coulomb’s Law:** Force between point charges $q_1, q_2$ separated by distance $r$:
  $$F = \\frac{1}{4\\pi\\varepsilon_0}\\frac{|q_1 q_2|}{r^2} = \\frac{k|q_1 q_2|}{r^2}, \\quad k \\approx 8.99 \\times 10^9\\text{ N m}^2\\text{ C}^{-2}$$
- **Electric Field Strength ($E$):** Force per unit positive test charge: $E = \\frac{F}{q} = \\frac{kQ}{r^2}$ ($\\text{N C}^{-1}$ or $\\text{V m}^{-1}$).
- **Electric Potential ($V$):** Work done bringing $+1\\text{ C}$ from infinity: $V = \\frac{kQ}{r}$ (scalar, Volts). Between parallel plates separated by $d$: $E = \\frac{V}{d}$.

## 2. Capacitors & Dielectrics
- **Capacitance:** $C = \\frac{Q}{V}$ ($1\\text{ F} = 1\\text{ C V}^{-1}$).
- **Parallel-Plate Capacitor:** $C = \\frac{\\varepsilon_0 \\varepsilon_r A}{d}$ (increases with larger area $A$, higher relative permittivity $\\varepsilon_r$, or smaller plate spacing $d$).
- **Combinations (Opposite to Resistors!):**
  - **Parallel:** Same voltage $V$; $C_{\\text{total}} = C_1 + C_2 + \\dots$
  - **Series:** Same charge $Q$; $\\frac{1}{C_{\\text{total}}} = \\frac{1}{C_1} + \\frac{1}{C_2}$.
- **Stored Energy:**
  $$E = \\frac{1}{2}QV = \\frac{1}{2}CV^2 = \\frac{Q^2}{2C}$$`,
  },
  {
    id: 'note-phys-s1-semiconductors-diodes',
    topicId: 'phys-s3-nuclear',
    isBuiltIn: true,
    title: 'Atomic Energy Levels, Semiconductors, p-n Junction Diodes & Rectification',
    subject: 'physics',
    grade: 'SHS1',
    tags: ['SHS1', 'Physics', 'Semiconductors', 'Diode', 'Rectification'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Semiconductors, p-n Junctions & Rectification

## 1. Energy Bands & Doping
- **Conductors:** Overlapping valence and conduction bands. **Insulators:** Very wide forbidden energy gap ($> 5\\text{ eV}$). **Semiconductors ($Si, Ge$):** Narrow band gap ($\approx 0.7\\text{–}1.1\\text{ eV}$); resistance *decreases* as temperature rises.
- **Intrinsic Semiconductor:** Pure Silicon/Germanium where electron concentration equals hole concentration ($n_e = n_h$).
- **n-Type Doping:** Add **pentavalent** Group 15 donor impurity ($P, As, Sb$); majority carriers are **electrons**.
- **p-Type Doping:** Add **trivalent** Group 13 acceptor impurity ($B, Al, In$); majority carriers are positive **holes**.

## 2. p-n Junction Diode & Rectification
- At the junction, diffusion creates a thin **depletion layer** lacking free carriers, producing a barrier potential ($\approx 0.7\\text{ V}$ for Silicon).
- **Forward Bias:** $p$-side to $+$ battery, $n$-side to $-$; depletion layer shrinks and large current flows once $V > 0.7\\text{ V}$.
- **Reverse Bias:** $p$-side to $-$, $n$-side to $+$; depletion layer widens and only tiny leakage current flows.
- **Rectification (AC to DC):**
  - **Half-Wave:** Single diode conducts only positive half-cycles.
  - **Full-Wave Bridge (4 Diodes):** Converts both positive and negative AC half-cycles into unidirectional DC, smoothed by a parallel reservoir capacitor.`,
  },
  {
    id: 'note-phys-s2-matter-circular-gravitation',
    topicId: 'phys-s1-dynamics',
    isBuiltIn: true,
    title: 'Surface Tension, Viscosity (Stokes’ Law), Uniform Circular Motion & Gravitation',
    subject: 'physics',
    grade: 'SHS2',
    tags: ['SHS2', 'Physics', 'Circular Motion', 'Gravitation', 'Stokes Law', 'Viscosity'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Properties of Matter, Circular Motion & Universal Gravitation

## 1. Surface Tension, Capillarity & Stokes’ Viscosity
- **Cohesion vs Adhesion:** Cohesion attracts like molecules (water–water); adhesion attracts unlike molecules (water–glass). Water forms a **concave** meniscus in clean glass (adhesion $>$ cohesion, rises in capillary); mercury forms a **convex** meniscus (cohesion $>$ adhesion, depresses).
- **Stokes’ Viscous Drag:** $F_v = 6\\pi\\eta r v$. At **terminal velocity**, Weight $=$ Upthrust $+$ Drag:
  $$\\frac{4}{3}\\pi r^3 (\\rho_s - \\rho_f) g = 6\\pi\\eta r v_t \\implies v_t = \\frac{2 r^2 (\\rho_s - \\rho_f) g}{9\\eta}$$

## 2. Uniform Circular Motion
- Angular speed $\\omega = \\frac{2\\pi}{T} = 2\\pi f$, linear speed $v = r\\omega$.
- **Centripetal Acceleration & Force:** Always directed **radially inward** toward center:
  $$a_c = \\frac{v^2}{r} = r\\omega^2, \\qquad F_c = \\frac{mv^2}{r} = mr\\omega^2$$
- For a banked frictionless curve at angle $\\theta$: $\\tan\\theta = \\frac{v^2}{rg}$.

## 3. Newton’s Universal Gravitation & Satellites
$$F = \\frac{GMm}{r^2}, \\qquad g = \\frac{GM}{r^2}, \\qquad v_{\\text{orbit}} = \\sqrt{\\frac{GM}{r}}, \\qquad v_{\\text{escape}} = \\sqrt{\\frac{2GM}{R}} = \\sqrt{2gR}$$
For Earth ($R \\approx 6.4 \\times 10^6\\text{ m}$), $v_{\\text{escape}} \\approx 11.2\\text{ km s}^{-1}$. A **geostationary satellite** orbits above the Equator with period $T = 24\\text{ h}$.`,
  },
  {
    id: 'note-phys-s2-shm-calorimetry',
    topicId: 'phys-s2-thermal',
    isBuiltIn: true,
    title: 'Simple Harmonic Motion (SHM), Resonance & Calorimetry (Specific & Latent Heat)',
    subject: 'physics',
    grade: 'SHS2',
    tags: ['SHS2', 'Physics', 'SHM', 'Resonance', 'Calorimetry', 'Latent Heat'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Simple Harmonic Motion (SHM) & Calorimetry

## 1. Simple Harmonic Motion (SHM)
SHM is periodic oscillatory motion where acceleration is directly proportional to displacement $x$ from equilibrium and always directed toward it:
$$a = -\\omega^2 x, \\qquad v = \\pm\\omega\\sqrt{A^2 - x^2}, \\qquad v_{\\max} = \\omega A$$
- **Simple Pendulum:** $T = 2\\pi\\sqrt{\\frac{L}{g}}$ (independent of bob mass!).
- **Mass-Spring System:** $T = 2\\pi\\sqrt{\\frac{m}{k}}$.
- **Resonance:** Occurs when external driving frequency matches the system’s natural frequency, yielding maximum amplitude energy transfer.

## 2. Calorimetry & Latent Heat
- **Sensible Heating (Temperature Change):** $Q = mc\\Delta\\theta$, where $c$ is specific heat capacity ($\\text{J kg}^{-1}\\text{ K}^{-1}$). Water has high $c = 4200\\text{ J kg}^{-1}\\text{ K}^{-1}$.
- **Phase Change (Constant Temperature):** $Q = mL$, where $L_f$ is specific latent heat of fusion and $L_v$ is specific latent heat of vaporization.
- **Method of Mixtures:** $\\text{Heat Lost by Hot Body} = \\text{Heat Gained by Cold Water + Calorimeter}$ (minimize heat loss with lagging/lid and stir continuously).`,
  },
  {
    id: 'note-phys-s3-deformation-heat-transfer',
    topicId: 'phys-s2-thermal',
    isBuiltIn: true,
    title: 'Deformation of Solids (Hooke & Young’s Modulus) & Heat Transfer (Stefan-Boltzmann)',
    subject: 'physics',
    grade: 'SHS3',
    tags: ['SHS3', 'Physics', 'Young Modulus', 'Hooke Law', 'Heat Transfer'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Deformation of Solids & Modes of Heat Transfer

## 1. Elasticity, Stress, Strain & Young’s Modulus
- **Hooke’s Law:** Within the proportional limit, extension $e$ is proportional to applied force: $F = ke$.
- **Tensile Stress:** $\\sigma = \\frac{F}{A}$ ($\\text{N m}^{-2}$ or Pa).
- **Tensile Strain:** $\\varepsilon = \\frac{e}{L_0}$ (dimensionless ratio).
- **Young’s Modulus ($E$):** Measure of material stiffness:
  $$E = \\frac{\\text{Stress}}{\\text{Strain}} = \\frac{FL_0}{Ae}$$
- **Elastic Strain Energy Stored:** $U = \\frac{1}{2}Fe = \\frac{1}{2}ke^2$; Energy per unit volume $= \\frac{1}{2}\\sigma\\varepsilon$.

## 2. Three Modes of Heat Transfer
1. **Conduction:** Thermal energy transfer through solids via lattice vibrations and free electrons without bulk particle motion:
   $$\\frac{Q}{t} = \\frac{kA(T_2 - T_1)}{L}$$
2. **Convection:** Bulk fluid circulation driven by buoyancy density differences (land/sea breezes).
3. **Thermal Radiation:** Electromagnetic infrared waves needing **no medium**. Governed by **Stefan-Boltzmann Law**:
   $$P = e\\sigma A T^4$$
   Dull black surfaces are optimal absorbers and emitters; shiny silver surfaces reflect radiation (Thermos vacuum flask reduces conduction/convection via vacuum and radiation via silvered walls).`,
  },
  {
    id: 'note-phys-s3-lasers-transistors-xrays',
    topicId: 'phys-s3-nuclear',
    isBuiltIn: true,
    title: 'Photoelectric Effect, X-Rays, Lasers & Bipolar Junction Transistors (BJT)',
    subject: 'physics',
    grade: 'SHS3',
    tags: ['SHS3', 'Physics', 'Photoelectric', 'Lasers', 'X-Rays', 'Transistors'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Photoelectric Effect, X-Rays, Lasers & BJT Transistors

## 1. Einstein’s Photoelectric Equation & de Broglie Wavelength
- Light carries discrete photon energy $E = hf = \\frac{hc}{\\lambda}$.
- **Photoelectric Equation:**
  $$hf = \\Phi + KE_{\\max} = hf_0 + eV_s$$
  where $\\Phi = hf_0$ is the metal **work function** and $V_s$ is stopping potential. Raising light *intensity* increases photocurrent (number of emitted electrons/s), while only raising *frequency* ($f > f_0$) increases $KE_{\\max}$.
- **de Broglie Matter Wavelength:** $\\lambda = \\frac{h}{p} = \\frac{h}{mv}$.

## 2. X-Rays & Lasers
- **X-Rays:** Produced when fast thermionic electrons accelerated across voltage $V$ strike a high-melting Tungsten/Molybdenum target. Minimum cutoff wavelength: $\\lambda_{\\min} = \\frac{hc}{eV}$.
- **LASER (Light Amplification by Stimulated Emission of Radiation):** Requires **population inversion** (more atoms in excited metastable state than ground state). Produces coherent, monochromatic, collimated, high-intensity beams used in eye surgery, fiber-optic telecom, and barcode scanning.

## 3. Bipolar Junction Transistors (BJT — n-p-n / p-n-p)
- Three terminals: **Emitter ($E$)**, thin lightly doped **Base ($B$)**, and **Collector ($C$)**.
- Current relation: $I_E = I_B + I_C$, DC current gain $\\beta = \\frac{I_C}{I_B}$ (typically $50\\text{–}300$). Used both as a solid-state electronic **switch** (cutoff/saturation) and small-signal **amplifier** (active mode).`,
  },

  // =========================================================================
  // 4. CHEMISTRY (SHS 1 - 3 GES/NaCCA)
  // =========================================================================
  {
    id: 'note-chem-s1-states-of-matter',
    topicId: 'chem-s1-stoichiometry',
    isBuiltIn: true,
    title: 'States of Matter: Crystal Lattices, Graham’s Law of Diffusion & Dalton’s Partial Pressures',
    subject: 'chemistry',
    grade: 'SHS1',
    tags: ['SHS1', 'Chemistry', 'States of Matter', 'Graham Law', 'Dalton Law', 'Crystals'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# States of Matter, Crystal Types & Quantitative Gas Laws

## 1. Four Crystalline Solid Types
| Crystal Type | Structural Particles | Bonding Forces | Properties & Examples |
| :--- | :--- | :--- | :--- |
| **Ionic** | Cations & Anions | Strong electrostatic lattice | High m.p., brittle, conducts only when molten/aqueous ($\\text{NaCl}, \\text{MgO}$) |
| **Simple Molecular** | Discrete molecules | Weak van der Waals / H-bonds | Low m.p./b.p., soft, non-conductor ($\\text{I}_2, \\text{CO}_2$, Ice) |
| **Giant Covalent** | Atoms in 3D network | Strong directional covalent | Extremely hard/high m.p. (Diamond insulator; Graphite conducts via delocalized $e^-$) |
| **Metallic** | Cations in $e^-$ sea | Metallic attraction | Malleable, ductile, high electrical & thermal conductivity ($\\text{Cu, Fe, Al}$) |

## 2. Quantitative Gas Mixtures & Diffusion
- **Ideal Gas Equation:** $PV = nRT = \\frac{m}{M}RT$ ($R = 8.314\\text{ J mol}^{-1}\\text{ K}^{-1}$).
- **Dalton’s Law of Partial Pressures:** Total pressure of non-reacting gases equals sum of partial pressures:
  $$P_{\\text{total}} = P_A + P_B + \\dots, \\qquad P_A = X_A \\cdot P_{\\text{total}} = \\frac{n_A}{n_{\\text{total}}} P_{\\text{total}}$$
- **Graham’s Law of Diffusion/Effusion:** Rate of diffusion is inversely proportional to square root of molar mass ($M$) or vapor density ($d$) at constant $T, P$:
  $$\\frac{R_1}{R_2} = \\sqrt{\\frac{M_2}{M_1}} = \\sqrt{\\frac{d_2}{d_1}} = \\frac{t_2}{t_1}$$`,
  },
  {
    id: 'note-chem-s1-periodic-trends-detail',
    topicId: 'chem-s1-atoms',
    isBuiltIn: true,
    title: 'Periodic Table Structure & Quantitative Periodic Trends (IE, Electronegativity & Radius)',
    subject: 'chemistry',
    grade: 'SHS1',
    tags: ['SHS1', 'Chemistry', 'Periodic Trends', 'Ionization Energy', 'Electronegativity'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Periodic Classification & Periodic Trends

## 1. Governing Factors Behind Periodic Trends
Every periodic trend is controlled by the balance between:
1. **Effective Nuclear Charge ($Z_{\\text{eff}}$):** Increases across a period as protons are added to the same shell.
2. **Shielding (Screening) & Shell Number ($n$):** Increases down a group as extra principal shells ($n$) are added.

## 2. Four Key Periodic Properties (WASSCE Paper 2 Explanations)
| Property | Across Period ($\\rightarrow$) | Down Group ($\\downarrow$) | Key Exceptions & Notes |
| :--- | :--- | :--- | :--- |
| **Atomic Radius** | Decreases (higher $Z_{\\text{eff}}$ pulls same shell closer) | Increases (new electron shells & more shielding) | Cations $< $ parent atom; Anions $>$ parent atom |
| **1st Ionization Energy** | Generally increases | Decreases (outer $e^-$ further & more shielded) | Drops at $\\text{B}$ ($2p^1 < 2s^2$) and $\\text{O}$ ($2p^4$ paired $e^-$ repulsion $< 2p^3$) |
| **Electron Affinity** | Becomes more exothermic | Less exothermic | $\\text{Cl}$ more negative than $\\text{F}$ (compact $2p$ repulsion in $\\text{F}$) |
| **Electronegativity** | Increases ($\\text{F} = 4.0$ max) | Decreases | Determines bond polarity ($\\Delta\\chi > 1.7 \\rightarrow$ ionic) |`,
  },
  {
    id: 'note-chem-s2-inorganic-period3-groups',
    topicId: 'chem-s2-kinetics',
    isBuiltIn: true,
    title: 'Inorganic Chemistry: Period 3, Groups 1, 2, 7 & First-Row Transition Metals',
    subject: 'chemistry',
    grade: 'SHS2',
    tags: ['SHS2', 'Chemistry', 'Period 3', 'Halogens', 'Transition Metals'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Descriptive Inorganic Chemistry: Period 3, Groups & Transition Metals

## 1. Period 3 Elements ($\\text{Na}$ to $\\text{Ar}$)
- **Oxides Acid-Base Shift:** Strongly basic ($\\text{Na}_2\\text{O}, \\text{MgO}$) $\\rightarrow$ **Amphoteric** ($\\text{Al}_2\\text{O}_3$ reacts with both $\\text{H}^+$ and $\\text{OH}^-$) $\\rightarrow$ Acidic covalent oxides ($\\text{SiO}_2, \\text{P}_4\\text{O}_{10}, \\text{SO}_3, \\text{Cl}_2\\text{O}_7$).
- **Chlorides:** Ionic ($\\text{NaCl}$ dissolves neutrally pH 7; $\\text{MgCl}_2$ slightly acidic pH 6.5) $\\rightarrow$ Covalent hydrolyzing chlorides ($\\text{AlCl}_3, \\text{SiCl}_4, \\text{PCl}_5$ fume with $\\text{HCl}$ gas in water).

## 2. Group Trends (1, 2, 7)
- **Group 1 & 2 Metals:** Reactivity increases down the group as 1st/2nd ionization energies fall. Flame colors: $\\text{Li}$ crimson, $\\text{Na}$ golden-yellow, $\\text{K}$ lilac, $\\text{Ca}$ brick-red.
- **Group 7 Halogens ($\\text{F}_2 \\rightarrow \\text{I}_2$):** Oxidizing strength decreases down the group. A higher halogen displaces a lower halide: $\\text{Cl}_2 + 2\\text{Br}^- \\rightarrow 2\\text{Cl}^- + \\text{Br}_2$.

## 3. First-Row Transition Metals ($\\text{Sc}$ to $\\text{Zn}$)
A **transition element** forms at least one ion with an **incompletely filled $d$-subshell** (thus $\\text{Sc}^{3+}$ and $\\text{Zn}^{2+}$ fail strict IUPAC transition criteria). Four hallmarks:
1. **Variable Oxidation States:** ($+2$ to $+7$ in $\\text{Mn}$).
2. **Colored Ions:** $d$-$d$ orbital splitting absorbs visible wavelengths ($[\\text{Cu}(\\text{H}_2\\text{O})_6]^{2+}$ blue; $\\text{MnO}_4^-$ purple).
3. **Complex Ion Formation:** Ligands donate lone pairs into empty $3d/4s$ orbitals (e.g., $[\\text{Fe}(\\text{CN})_6]^{4-}$).
4. **Catalytic Activity:** $\\text{Fe}$ in Haber process, $\\text{V}_2\\text{O}_5$ in Contact process, $\\text{MnO}_2$ for $\\text{H}_2\\text{O}_2$ decomposition.`,
  },
  {
    id: 'note-chem-s2-salts-buffers-ksp',
    topicId: 'chem-s2-acids',
    isBuiltIn: true,
    title: 'Buffers, Salt Hydrolysis, Salt Preparation & Solubility Product ($K_{sp}$)',
    subject: 'chemistry',
    grade: 'SHS2',
    tags: ['SHS2', 'Chemistry', 'Buffers', 'Ksp', 'Salts', 'Hydrolysis'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Buffers, Salt Hydrolysis & Solubility Equilibria ($K_{\\text{sp}}$)

## 1. Buffer Solutions & Henderson–Hasselbalch Equation
A **buffer** resists sudden $\\text{pH}$ changes upon adding small amounts of strong acid or base.
- **Acidic Buffer:** Weak acid $+$ its conjugate salt (e.g., $\\text{CH}_3\\text{COOH} + \\text{CH}_3\\text{COONa}$):
  $$\\text{pH} = \\text{p}K_a + \\log_{10}\\left(\\frac{[\\text{Salt}]}{[\\text{Acid}]}\\right)$$
- **Basic Buffer:** Weak base $+$ its conjugate salt (e.g., $\\text{NH}_3(\\text{aq}) + \\text{NH}_4\\text{Cl}$).

## 2. Salt Hydrolysis & Preparation Methods
- **Salt Hydrolysis:** $\\text{Na}_2\\text{CO}_3$ (strong base + weak acid) gives alkaline solution ($\\text{pH} > 7$); $\\text{NH}_4\\text{Cl}$ or $\\text{FeCl}_3$ (weak base + strong acid) gives acidic solution ($\\text{pH} < 7$); $\\text{NaCl}$ stays neutral ($\\text{pH} = 7$).
- **Laboratory Salt Synthesis:**
  1. **Titration:** Soluble Group 1 / $\\text{NH}_4^+$ salts.
  2. **Excess Insoluble Base/Carbonate/Metal + Acid:** $\\text{CuSO}_4, \\text{ZnCl}_2$.
  3. **Double Decomposition (Precipitation):** Insoluble salts like $\\text{BaSO}_4$ or $\\text{AgCl}$.

## 3. Solubility Product ($K_{\\text{sp}}$) & Common-Ion Effect
For sparingly soluble $\\text{A}_x\\text{B}_y(s) \\rightleftharpoons x\\text{A}^{y+}(aq) + y\\text{B}^{x-}(aq)$:
$$K_{\\text{sp}} = [\\text{A}^{y+}]^x [\\text{B}^{x-}]^y$$
- **Precipitation Criterion:** Precipitate forms if ionic product $Q > K_{\\text{sp}}$. Adding a common ion shifts equilibrium left, **reducing** salt solubility.`,
  },
  {
    id: 'note-chem-s3-benzene-amides-polymers',
    topicId: 'chem-s3-organic',
    isBuiltIn: true,
    title: 'Aromatic Benzene, Alkanoic Derivatives, Biomolecules & Synthetic Polymers',
    subject: 'chemistry',
    grade: 'SHS3',
    tags: ['SHS3', 'Chemistry', 'Benzene', 'Polymers', 'Biochemistry', 'Saponification'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Benzene Aromaticity, Biochemistry & Polymerization

## 1. Benzene ($\\text{C}_6\\text{H}_6$) & Aromaticity
- Planar hexagonal ring with $sp^2$ carbons and 6 delocalized $\\pi$-electrons above/below the ring (equal C–C bond lengths $0.139\\text{ nm}$, intermediate between single and double bonds).
- Because of resonance stability, benzene undergoes **electrophilic substitution** (nitration with conc. $\\text{HNO}_3/\\text{H}_2\\text{SO}_4$ at $55^\\circ\\text{C}$, Friedel-Crafts alkylation) rather than addition decolorizing bromine water.

## 2. Organic Biomolecules & Saponification
- **Carbohydrates:** Monosaccharides (glucose $\\text{C}_6\\text{H}_{12}\\text{O}_6$, reducing sugar gives brick-red $\\text{Cu}_2\\text{O}$ with Benedict’s/Fehling’s); Disaccharides (sucrose is non-reducing; maltose, lactose); Polysaccharides (starch turns blue-black with iodine, cellulose).
- **Proteins:** Built from $\\alpha$-amino acids linked by **peptide (amide) bonds** ($-\\text{CONH}-$); confirmed by **Biuret test** (violet color) or Xanthoproteic test.
- **Saponification (Soap Making):** Hydrolysis of triglyceride fats/oils with hot $\\text{NaOH}$ (or $\\text{KOH}$ for soft *Alata Samina* local black soap) yields glycerol $+$ sodium alkanoate soap.

## 3. Addition vs Condensation Polymers
| Type | Mechanism & By-product | Key Examples & Uses |
| :--- | :--- | :--- |
| **Addition Polymerization** | Monomers with $\\text{C=C}$ double bond open and link; **no small molecule lost** | **Polythene** (bags), **PVC** ($\\text{CH}_2\\text{=CHCl}$, pipes), **Polystyrene** |
| **Condensation Polymerization** | Bifunctional monomers join, eliminating small molecule ($\text{H}_2\\text{O}$ or $\\text{HCl}$) | **Nylon-6,6** (polyamide, $-\\text{CONH}-$), **Terylene** (polyester, $-\\text{COO}-$), Starch, Proteins |`,
  },
  {
    id: 'note-chem-s3-ghana-metals-environment',
    topicId: 'chem-s3-qualitative',
    isBuiltIn: true,
    title: 'Industrial Chemistry in Ghana: Metal Extraction (Gold, Al, Fe), Crude Oil & Green Chemistry',
    subject: 'chemistry',
    grade: 'SHS3',
    tags: ['SHS3', 'Chemistry', 'Gold Extraction', 'Bauxite', 'Blast Furnace', 'Crude Oil'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Metal Extraction in Ghana, Petroleum & Environmental Chemistry

## 1. Extraction of Metals in Ghana & West Africa
1. **Iron (Blast Furnace at Tema/Steelworks):** Hematite ($\\text{Fe}_2\\text{O}_3$), coke ($\\text{C}$), and limestone ($\\text{CaCO}_3$). $\\text{CO}$ reduces $\\text{Fe}_2\\text{O}_3 + 3\\text{CO} \\rightarrow 2\\text{Fe} + 3\\text{CO}_2$. Limestone decomposes to $\\text{CaO}$ to remove acidic silica slag ($\\text{CaO} + \\text{SiO}_2 \\rightarrow \\text{CaSiO}_3$).
2. **Aluminium from Ghanaian Bauxite (Awaso/Atewa):** Purified $\\text{Al}_2\\text{O}_3$ dissolved in molten **cryolite** ($\\text{Na}_3\\text{AlF}_6$, lowers m.p. from $2045^\\circ\\text{C}$ to $\\sim 950^\\circ\\text{C}$) and electrolyzed at **VALCO** using carbon anodes: $\\text{Al}^{3+} + 3e^- \\rightarrow \\text{Al}(l)$.
3. **Gold Mining (Obuasi, Tarkwa, Prestea):** Cyanidation leaches gold into soluble $[\\text{Au}(\\text{CN})_2]^-$ complex, displaced by zinc dust. *(Contrast with illegal galamsey use of toxic mercury $\\text{Hg}$ that poisons rivers and aquifers).*

## 2. Petroleum Refining & Environmental Green Chemistry
- **Fractional Distillation:** Separates crude oil by boiling range (Refinery gas $\\rightarrow$ Petrol/Gasoline $\\rightarrow$ Kerosene $\\rightarrow$ Diesel $\\rightarrow$ Bitumen).
- **Cracking & Octane Rating:** Thermal/catalytic cracking breaks long-chain alkanes into high-demand petrol and alkenes. Branched/aromatic hydrocarbons raise octane number and reduce engine knocking.
- **Environmental Pollutants:** $\\text{SO}_2/\\text{NO}_x \\rightarrow$ acid rain; $\\text{CFCs} \\rightarrow$ stratospheric $\\text{O}_3$ depletion; excess $\\text{CO}_2/\\text{CH}_4 \\rightarrow$ enhanced greenhouse warming.`,
  },

  // =========================================================================
  // 5. BIOLOGY (SHS 1 - 3 GES/NaCCA)
  // =========================================================================
  {
    id: 'note-bio-s1-selected-organisms',
    topicId: 'bio-s1-cell',
    isBuiltIn: true,
    title: 'Life Processes in Selected Organisms (Amoeba, Paramecium, Euglena, Spirogyra, Rhizopus, Insects & Vertebrates)',
    subject: 'biology',
    grade: 'SHS1',
    tags: ['SHS1', 'Biology', 'Amoeba', 'Euglena', 'Spirogyra', 'Rhizopus', 'Tilapia', 'Cockroach'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Life Processes in Selected Organisms (GES Practical Syllabus)

## 1. Unicellular & Filamentous Protoctists / Fungi
| Organism | Locomotion | Nutrition | Osmoregulation & Respiration | Reproduction |
| :--- | :--- | :--- | :--- | :--- |
| ***Amoeba proteus*** | **Pseudopodia** (cytoplasmic streaming) | Holozoic (**phagocytosis**) | **Contractile vacuole** expels excess water; cell surface diffusion | Binary fission & multiple fission (encystment) |
| ***Paramecium*** | Coordinated **cilia** | Holozoic via oral groove & cytopharynx | **Two contractile vacuoles** (anterior & posterior star-shaped) | Transverse binary fission & sexual **conjugation** |
| ***Euglena viridis*** | Whip-like **flagellum** (light sensed by stigma/eyespot) | **Mixotrophic**: Autotrophic (chloroplasts) + saprophytic in dark | Contractile vacuole near reservoir; aerobic diffusion | Longitudinal binary fission |
| ***Spirogyra*** | Non-motile floating filament | Autotrophic (**spiral ribbon chloroplast** with pyrenoids) | Diffusion across cell wall | Fragmentation & scalariform **conjugation** |
| ***Rhizopus* (Bread Mold)** | Non-motile hyphae (rhizoids, stolons, sporangiophores) | **Saprophytic** extracellular enzyme digestion | Diffusion through coenocytic hyphae | Asexual **sporangiospores** & sexual **zygospores** |

## 2. Arthropods & Vertebrates Highlighted in WASSCE Practicals
- **Cockroach & Butterfly:** Tracheal spiracle system for gas exchange; **Malpighian tubules** for uric acid excretion; open circulatory system; butterfly shows **complete metamorphosis** (egg $\\rightarrow$ larva $\\rightarrow$ pupa $\\rightarrow$ adult) whereas cockroach shows **incomplete metamorphosis** (egg $\\rightarrow$ nymph $\\rightarrow$ adult).
- **Tilapia (Osteichthyes):** Operculum covering gill arches (counter-current gaseous exchange), swim bladder for buoyancy, lateral line sensing water vibrations, two-chambered heart (single circulation).
- **Toad (Amphibia):** Moist vascular skin + buccal cavity + lungs; three-chambered heart; external fertilization in water.`,
  },
  {
    id: 'note-bio-s2-taxonomy-five-kingdoms',
    topicId: 'bio-s1-classification',
    isBuiltIn: true,
    title: 'Taxonomy, Binomial Nomenclature, Five Kingdoms & Major Plant/Animal Phyla',
    subject: 'biology',
    grade: 'SHS2',
    tags: ['SHS2', 'Biology', 'Taxonomy', 'Five Kingdoms', 'Chordata', 'Arthropoda'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Diversity of Living Things: Taxonomy & Five Kingdoms

## 1. Linnaean Hierarchy & Binomial Rules
Hierarchy from broadest to most specific: **Kingdom $\\rightarrow$ Phylum (Division) $\\rightarrow$ Class $\\rightarrow$ Order $\\rightarrow$ Family $\\rightarrow$ Genus $\\rightarrow$ Species**. *(Mnemonic: King Philip Came Over For Good Soup)*.
- **Binomial Nomenclature:** Two-part Latinized scientific name: *Genus* (**Capitalized** first letter) + *species* (**lowercase**), *italicized* in print or **separately underlined** when handwritten (e.g., *Homo sapiens*, *Zea mays*, *Theobroma cacao*).

## 2. The Five Kingdoms
1. **Prokaryotae (Monera):** Microscopic unicellular prokaryotes lacking true membrane-bound nucleus or mitochondria; $70\\text{S}$ ribosomes; cell wall of peptidoglycan (murein). Example: *Escherichia coli*, cyanobacteria.
2. **Protoctista:** Mostly unicellular eukaryotes (*Amoeba, Plasmodium, Spirogyra*).
3. **Fungi:** Eukaryotic heterotrophs (saprophytes/parasites) with **chitin** cell walls and hyphae forming mycelium (*Rhizopus, Saccharomyces* yeast, mushrooms). Never possess chlorophyll!
4. **Plantae:** Multicellular photosynthetic autotrophs with **cellulose** cell walls: **Bryophyta** (mosses, non-vascular), **Pteridophyta** (ferns, vascular with spores), **Gymnospermae** (naked seeds in cones), **Angiospermae** (flowering plants: Monocotyledons vs Dicotyledons).
5. **Animalia:** Multicellular heterotrophs without cell walls: Cnidaria (hydra), Platyhelminthes (flatworms), Nematoda (roundworms), Annelida (earthworm — metameric segmentation), Mollusca (snail — muscular foot & mantle), **Arthropoda** (jointed appendages & chitin exoskeleton: Insecta, Arachnida, Crustacea, Myriapoda), **Chordata** (Pisces, Amphibia, Reptilia, Aves, Mammalia).`,
  },
  {
    id: 'note-bio-s2-nervous-musculoskeletal',
    topicId: 'bio-s2-homeostasis',
    isBuiltIn: true,
    title: 'Musculoskeletal System, Sense Organs (Eye/Ear), Reflex Arc & Endocrine Hormones',
    subject: 'biology',
    grade: 'SHS2',
    tags: ['SHS2', 'Biology', 'Nervous System', 'Eye', 'Ear', 'Hormones', 'Muscles'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Coordination, Sense Organs & Musculoskeletal Mechanics

## 1. Skeleton, Joints & Antagonistic Muscles
- **Joint Types:** Hinge (elbow, knee — uniaxial), Ball-and-socket (shoulder, hip — multiaxial), Pivot (atlas–axis neck), Gliding (carpals/tarsals). Synovial fluid lubricates; cartilage reduces friction; ligaments join bone-to-bone; tendons join muscle-to-bone.
- **Antagonistic Pairs:** Biceps (flexor) contracts while triceps (extensor) relaxes to bend the forearm.

## 2. Nervous Coordination & Reflex Arc
- **Reflex Arc Pathway:** Stimulus $\\rightarrow$ Receptor $\\rightarrow$ **Sensory Neurone** $\\rightarrow$ **Relay (Intermediate) Neurone** in spinal cord $\\rightarrow$ **Motor Neurone** $\\rightarrow$ Effector (muscle/gland) $\\rightarrow$ Rapid involuntary response.
- **Synaptic Transmission:** Impulse triggers $\\text{Ca}^{2+}$ influx $\\rightarrow$ vesicles release neurotransmitter (acetylcholine) across synaptic cleft $\\rightarrow$ binds post-synaptic receptors $\\rightarrow$ guarantees **unidirectional** conduction.

## 3. Eye Accommodation & Ear Hearing/Balance
- **Eye Defects:** **Myopia** (short-sightedness, eyeball too long, corrected with **concave/diverging** lens); **Hypermetropia** (long-sightedness, corrected with **convex/converging** lens).
- **Ear:** Tympanum + ossicles (malleus, incus, stapes) amplify vibrations into cochlea organ of Corti (**hearing**); semicircular canals & utriculus/sacculus detect angular & linear **balance**.

## 4. Endocrine Hormones
**Pituitary** (master gland: ADH, FSH, LH, Growth Hormone); **Thyroid** (thyroxine regulates BMR); **Adrenal** (adrenaline fight-or-flight raises heart rate & glycogenolysis); **Pancreas Islets of Langerhans** (**insulin** lowers blood glucose; **glucagon** raises it).`,
  },
  {
    id: 'note-bio-s2-humans-environment-disease',
    topicId: 'bio-s3-ecology',
    isBuiltIn: true,
    title: 'Pathogenic Microbes, Immunity, Vaccination & Environmental Conservation in Ghana',
    subject: 'biology',
    grade: 'SHS2',
    tags: ['SHS2', 'Biology', 'Pathogens', 'Immunity', 'Vaccination', 'Conservation'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Pathogens, Immunity & Sustainable Resource Conservation

## 1. Human Pathogens & Vector Control
| Pathogen Group | Examples & Diseases | Mode of Transmission & Prevention |
| :--- | :--- | :--- |
| **Bacteria** | *Vibrio cholerae* (Cholera), *Salmonella typhi* (Typhoid), *Mycobacterium* (TB) | Contaminated water/food or droplets; chlorination, oral rehydration, BCG |
| **Viruses** | HIV (AIDS), Hepatitis B, Influenza, Measles | Body fluids or aerosols; antiretroviral therapy, immunization |
| **Protozoa** | *Plasmodium falciparum* (Malaria) | Female *Anopheles* mosquito vector; ITNs, larval control |
| **Fungi** | *Tinea* (Ringworm), *Candida* | Direct contact; personal hygiene & antifungals |

## 2. Active vs Passive Immunity
- **Active Immunity:** Body produces its own antibodies and **memory B/T lymphocytes** (long-lasting): *Natural* (after infection) or *Artificial* (vaccination with attenuated/dead antigen).
- **Passive Immunity:** Ready-made antibodies received externally (immediate but short-lived, no memory cells): *Natural* (maternal IgG across placenta / IgA in colostrum) or *Artificial* (antivenom serum).

## 3. Conservation & Ghanaian Ecological Threats
- **Deforestation, Overfishing & Illegal Mining (*Galamsey*):** Mercury/cyanide runoff causes turbidity, heavy-metal bioaccumulation, and destruction of cocoa/aquatic habitats. Remediation uses forest reserves, closed fishing seasons, and reforestation.`,
  },
  {
    id: 'note-bio-s3-plant-anatomy-hormones',
    topicId: 'bio-s2-transport',
    isBuiltIn: true,
    title: 'Plant Morphology, Monocot vs Dicot Anatomy, Plant Hormones & Tropisms',
    subject: 'biology',
    grade: 'SHS3',
    tags: ['SHS3', 'Biology', 'Monocot', 'Dicot', 'Auxins', 'Tropisms', 'Xylem', 'Phloem'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Plant Morphology, Internal Anatomy & Plant Growth Regulators

## 1. Monocot vs Dicot Root & Stem Anatomy
| Feature | Dicotyledon (e.g., Sunflower, Hibiscus) | Monocotyledon (e.g., Maize, Grass) |
| :--- | :--- | :--- |
| **Root Vascular Bundle** | Central star-shaped xylem with phloem arms between | Ring of alternating xylem & phloem around wide pith |
| **Stem Vascular Bundle** | Arranged in a **single ring** with vascular cambium (secondary growth) | **Scattered** randomly in ground parenchyma (no cambium) |
| **Leaf Venation & Seeds** | Reticulate (net) venation; 2 cotyledons; taproot | Parallel venation; 1 cotyledon; fibrous roots |

## 2. Plant Hormones & Tropisms
- **Auxins (IAA):** Synthesized at shoot/root apices; promote **cell elongation in shoots** (positive **phototropism** as IAA migrates to shaded side) while **inhibiting** cell elongation on the lower side of horizontal roots (**positive geotropism**). Also cause apical dominance and parthenocarpy.
- **Gibberellins:** Break seed dormancy and stimulate stem internode elongation.
- **Cytokinins:** Promote cell division (cytokinesis) and delay leaf senescence.
- **Abscisic Acid (ABA):** Stress hormone — triggers **stomatal closure** during drought and induces seed dormancy.
- **Ethene (Ethylene):** Gaseous hormone promoting fruit ripening and leaf abscission.

## 3. Xylem Transpiration Pull vs Phloem Translocation
- **Xylem (Dead lignified vessels):** Cohesion-tension transpiration stream pulls water and minerals unidirectionally upward.
- **Phloem (Living sieve tubes + companion cells):** Energy-dependent bidirectional translocation of sucrose and amino acids from photosynthetic **sources** to **sinks**.`,
  },
  {
    id: 'note-bio-s3-biotech-water-aquaculture',
    topicId: 'bio-s3-evolution',
    isBuiltIn: true,
    title: 'Biology & Industry: Water Purification, Aquaculture, Recombinant DNA & Biogas',
    subject: 'biology',
    grade: 'SHS3',
    tags: ['SHS3', 'Biology', 'Biotechnology', 'Water Treatment', 'PCR', 'Aquaculture', 'Biogas'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Applied Biology, Water Treatment & Modern Biotechnology

## 1. Municipal Water Purification (Ghana Water Company Workflow)
1. **Screening:** Removes floating logs, plastics, and coarse debris.
2. **Coagulation & Flocculation:** Adding **alum** ($\\text{Al}_2(\\text{SO}_4)_3$) neutralizes negative clay colloids so fine mud clumps into heavy flocs.
3. **Sedimentation:** Flocs settle to bottom of clarifier tanks.
4. **Rapid Sand Filtration:** Gravel and fine sand beds trap remaining suspended particles and microbes.
5. **Chlorination (Disinfection):** Adding $\\text{Cl}_2$ (or $\\text{Ca}(\\text{OCl})_2$) kills waterborne bacteria (*Vibrio cholerae*); aeration improves taste.

## 2. Genetic Engineering, PCR & Cloning
- **Restriction Endonucleases:** Cut DNA at specific palindromic sequences leaving "sticky ends".
- **DNA Ligase:** Seals phosphodiester sugar-phosphate backbone to splice a human insulin gene into a bacterial **plasmid vector** (forming **recombinant DNA**).
- **Polymerase Chain Reaction (PCR):** Amplifies trace DNA exponentially via thermal cycles: Denaturation ($95^\\circ\\text{C}$) $\\rightarrow$ Annealing ($55^\\circ\\text{C}$) $\\rightarrow$ Extension ($72^\\circ\\text{C}$ using heat-stable *Taq* polymerase).

## 3. Food Fermentation, Aquaculture & Biogas
- Anaerobic respiration of *Saccharomyces* yeast ($\\text{C}_6\\text{H}_{12}\\text{O}_6 \\rightarrow 2\\text{C}_2\\text{H}_5\\text{OH} + 2\\text{CO}_2$) drives bread baking and beverage brewing; lactic acid bacteria ferment corn dough (*kenkey*).
- **Biogas Digesters:** Methanogenic archaebacteria anaerobically digest livestock manure into combustible **methane ($\\text{CH}_4$)** fuel plus nutrient-rich bio-slurry fertilizer.`,
  },

  // =========================================================================
  // 6. ICT (SHS 1 - 3 GES/NaCCA)
  // =========================================================================
  {
    id: 'note-ict-s1-word-dtp-ergonomics',
    topicId: 'ict-s1-os',
    isBuiltIn: true,
    title: 'Word Processing, Mail Merge, Desktop Publishing (DTP) & Computer Ergonomics',
    subject: 'ict',
    grade: 'SHS1',
    tags: ['SHS1', 'ICT', 'Word Processing', 'Mail Merge', 'DTP', 'Ergonomics'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Word Processing, Desktop Publishing & Ergonomics

## 1. Word Processing & Mail Merge Workflow
- **Formatting Controls:** Font styles, line spacing, page margins, **Page Break** (Ctrl+Enter) vs **Section Break** (allows different headers/footers or portrait/landscape orientation inside one document), footnotes, and automated Table of Contents via Heading Styles (\`H1\`–\`H3\`).
- **Mail Merge (3 Core Components):**
  1. **Main Document:** Static letter/certificate template with merge placeholders (\`<<First_Name>>\`, \`<<Score>>\`).
  2. **Data Source:** Spreadsheet, CSV, or database table storing individual recipient rows.
  3. **Merged Output:** Individualized batch letters, email blasts, or address labels.

## 2. Desktop Publishing (DTP) Principles
Unlike basic word processors focused on linear text, **DTP** software (Publisher, InDesign, Scribus) uses independent **text/image frames**, master pages, bleed margins, grid alignment, and typography hierarchy to produce flyers, school magazines, and brochures.

## 3. Computer Ergonomics & Lab Safety
- **Repetitive Strain Injury (RSI):** Prevented via neutral wrist posture, ergonomic keyboards, and hourly micro-breaks.
- **Computer Vision Syndrome (Eye Strain):** Keep monitor $50\\text{–}70\\text{ cm}$ away, top bezel at/below eye level, anti-glare lighting, **20-20-20 rule**.
- **Electrical & Data Hygiene:** Use UPS/surge protectors against voltage spikes; never eat/drink near equipment; route cables neatly to avoid tripping.`,
  },
  {
    id: 'note-ict-s2-dbms-internet-protocols',
    topicId: 'ict-s2-networking',
    isBuiltIn: true,
    title: 'DBMS Design (Keys, Queries, Forms, Reports) & Internet/Email Protocols',
    subject: 'ict',
    grade: 'SHS2',
    tags: ['SHS2', 'ICT', 'DBMS', 'Primary Key', 'Foreign Key', 'DNS', 'SMTP', 'HTTPS'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Database Design Architecture & Internet Protocols

## 1. Relational Database Objects & Keys
- **Table (Relation):** Structured grid of **Records (Tuples / Rows)** and **Fields (Attributes / Columns)**.
- **Primary Key (PK):** Minimal field(s) uniquely identifying every record (cannot be \`NULL\` or duplicated, e.g., \`Student_ID\`).
- **Foreign Key (FK):** Field in a child table referencing the Primary Key of a parent table to enforce **referential integrity** ($1:N$ relationship).
- **Four Core DBMS Objects (MS Access / SQL):**
  1. **Tables** — Store validated raw records.
  2. **Queries** — Filter, sort, calculate, and join subsets of data (\`SELECT ... WHERE ...\`).
  3. **Forms** — User-friendly graphical interfaces for safe data entry and editing.
  4. **Reports** — Formatted, printable summaries with totals and groupings.

## 2. Essential Web & Email Protocols
| Protocol | Layer & Role | Port / Security Note |
| :--- | :--- | :--- |
| **HTTP / HTTPS** | Transfers hypertext web pages between browser & server | HTTPS encrypts payloads via **TLS/SSL** |
| **DNS** | Translates domain names (\`wassce.edu.gh\`) to numeric IP addresses | Distributed hierarchical directory |
| **SMTP** | **Sends / relays** outgoing email from client to mail server | Simple Mail Transfer Protocol |
| **POP3 vs IMAP** | Retrieves incoming email | **POP3** downloads & typically deletes from server; **IMAP** synchronizes folders across devices |`,
  },
  {
    id: 'note-ict-s3-programming-emerging',
    topicId: 'ict-s3-sdlc',
    isBuiltIn: true,
    title: 'Programming Languages, Translators (Compiler vs Interpreter), PDLC & Emerging Tech',
    subject: 'ict',
    grade: 'SHS3',
    tags: ['SHS3', 'ICT', 'Compiler', 'Interpreter', 'PDLC', 'AI', 'IoT'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Programming Paradigms, Translators, PDLC & Emerging Technologies

## 1. Generations & Levels of Programming Languages
- **Machine Code (1GL):** Raw binary (\`10110000\`) executed directly by CPU; fast but error-prone and hardware-specific.
- **Assembly Language (2GL):** Mnemonic opcodes (\`MOV\`, \`ADD\`); translated 1:1 by an **Assembler**.
- **High-Level Languages (3GL — Python, Java, C++, JS):** Human-readable syntax, portable across architectures; must be translated into machine code.

## 2. Compiler vs Interpreter
| Feature | Compiler | Interpreter |
| :--- | :--- | :--- |
| **Translation Unit** | Entire source program translated at once into an executable binary | Translates and executes **one statement/line at a time** |
| **Execution Speed** | Fast runtime once compiled | Slower runtime overhead each run |
| **Error Reporting** | Lists all syntax errors together after full scan | Halts immediately at first syntax/runtime error |
| **Source Code Distribution** | Compiled executable runs without source | Source code needed at runtime |

## 3. Program Development Life Cycle (PDLC) & Emerging ICT
- **6 PDLC Phases:** (1) Problem Definition $\\rightarrow$ (2) Algorithm/Design (Pseudocode & Flowcharts) $\\rightarrow$ (3) Coding $\\rightarrow$ (4) Testing & Debugging (Syntax, Logic & Runtime errors) $\\rightarrow$ (5) Documentation (User & Technical manuals) $\\rightarrow$ (6) Maintenance.
- **Emerging Tech:** **Artificial Intelligence (AI)** (machine learning pattern recognition & adaptive tutors), **Internet of Things (IoT)** (sensor-connected smart agriculture & grid meters), and **Cloud Computing** (IaaS, PaaS, SaaS).`,
  },

  // =========================================================================
  // 7. ENGLISH LANGUAGE (SHS 1 - 3 GES/NaCCA)
  // =========================================================================
  {
    id: 'note-english-s2-phonology-stress-endings',
    topicId: 'english-s2-oral',
    isBuiltIn: true,
    title: 'Speechwork: Phonologically Conditioned Endings (-ed/-s), Syllabic Consonants & Stress Shifts',
    subject: 'english',
    grade: 'SHS2',
    tags: ['SHS2', 'English', 'Oral English', 'Stress Shifts', 'Phonology', 'WASSCE Paper 3'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Oral English: Conditioned Endings, Syllabic Consonants & Stress Shifts

## 1. Past Tense \`-ed\` Realizations (\`/t/\`, \`/d/\`, \`/ɪd/\`)
1. **Pronounced \`/ɪd/\`:** After alveolar stops **/t/** or **/d/** (*wan**ted***, *men**ded***, *decided*).
2. **Pronounced \`/t/\` (voiceless):** After voiceless consonants **/p, k, f, s, ʃ, tʃ/** (*stopped*, *laughed* \`/lɑːft/\`, *washed*, *watched*).
3. **Pronounced \`/d/\` (voiced):** After vowels and all other voiced consonants (*played*, *begged*, *loved*, *cleaned*).

## 2. Plural / 3rd-Person Singular \`-s / -es\` Realizations
1. **Pronounced \`/ɪz/\`:** After sibilants **/s, z, ʃ, ʒ, tʃ, dʒ/** (*boxes*, *wishes*, *judges*, *passes*).
2. **Pronounced \`/s/\`:** After voiceless non-sibilant consonants **/p, t, k, f, θ/** (*cats*, *books*, *laughs*, *months*).
3. **Pronounced \`/z/\`:** After vowels and voiced consonants (*boys*, *dogs*, *bags*, *runs*).

## 3. Word Stress & Noun/Verb Stress Shifts
- **Two-Syllable Disyllabic Shifts:** Many two-syllable English words take primary stress on the **first syllable when used as a Noun/Adjective**, and on the **second syllable when used as a Verb**:
  - *Noun:* **RE**-cord, **PRE**-sent, **CON**-duct, **EX**-port, **IN**-crease
  - *Verb:* re-**CORD**, pre-**SENT**, con-**DUCT**, ex-**PORT**, in-**CREASE**
- **Suffix Stress Rules:** Words ending in **\`-tion\` / \`-sion\` / \`-ic\` / \`-ity\`** shift primary stress onto the syllable immediately **preceding** the suffix (*e-du-**CA**-tion*, *e-lec-**TRI**-ci-ty*, *scien-**TI**-fic*).`,
  },
  {
    id: 'note-english-s2-voice-speech-modifiers',
    topicId: 'english-s2-clauses',
    isBuiltIn: true,
    title: 'Grammar Mastery: Direct & Indirect Speech, Active/Passive Voice & Phrasal Verbs',
    subject: 'english',
    grade: 'SHS2',
    tags: ['SHS2', 'English', 'Reported Speech', 'Passive Voice', 'Phrasal Verbs'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Reported Speech, Active/Passive Voice & Phrasal Verbs

## 1. Direct to Indirect (Reported) Speech Backshift Rules
When the reporting verb is in the past (*She said that...*), tenses step back one stage:
- **Present Simple $\\rightarrow$ Past Simple:** *"I read daily"* $\\rightarrow$ He said he *read* daily.
- **Present Continuous $\\rightarrow$ Past Continuous:** *"I am studying"* $\\rightarrow$ She said she *was studying*.
- **Present Perfect / Past Simple $\\rightarrow$ Past Perfect:** *"I finished"* $\\rightarrow$ He said he *had finished*.
- **Modal Backshifts:** *will $\\rightarrow$ would*, *can $\\rightarrow$ could*, *may $\\rightarrow$ might*.
- **Time/Place Deixis:** *now $\\rightarrow$ then*, *today $\\rightarrow$ that day*, *tomorrow $\\rightarrow$ the next day*, *yesterday $\\rightarrow$ the day before*, *here $\\rightarrow$ there*.
- *(Exception: Universal scientific truths remain in Present Simple!)*

## 2. Active to Passive Voice Transformation
Only **transitive verbs** (taking a direct object) can form a passive voice:
$$\\text{Subject}_{\\text{new}} + \\text{appropriate form of } \\mathbf{be} + \\text{Past Participle } (V_3) + [\\text{by } + \\text{Agent}]$$
- Active: *The prefect **cleaned** the laboratory.* $\\rightarrow$ Passive: *The laboratory **was cleaned** by the prefect.*
- Active Continuous: *They **are writing** the exam.* $\\rightarrow$ Passive: *The exam **is being written**.*

## 3. High-Yield WASSCE Phrasal Verbs
- **Call off** (cancel), **Put off** (postpone), **Put up with** (tolerate), **Look up to** (admire), **Look down on** (despise), **Come across** (find by chance), **Run out of** (exhaust supply), **Take after** (resemble a parent).`,
  },
  {
    id: 'note-english-s3-intonation-conditionals',
    topicId: 'english-s3-lexis',
    isBuiltIn: true,
    title: 'Oral Intonation (Tune 1 & Tune 2), Noun Modifiers & Conditional Sentences',
    subject: 'english',
    grade: 'SHS3',
    tags: ['SHS3', 'English', 'Intonation', 'Conditionals', 'Emphatic Stress', 'Modifiers'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Intonation Patterns, Emphatic Stress & Conditional Clauses

## 1. Tune 1 (Falling $\\searrow$) vs Tune 2 (Rising $\\nearrow$) Intonation
- **Tune 1 (Falling Intonation $\\searrow$):** Used for:
  1. Complete declarative statements (*She passed her WASSCE $\\searrow$*).
  2. *Wh-* information questions (*Where are the books? $\\searrow$*).
  3. Direct commands & exclamations (*Close the door! $\\searrow$*).
  4. Final item in a completed list.
- **Tune 2 (Rising Intonation $\\nearrow$):** Used for:
  1. *Yes/No* polar questions (*Did you finish the essay? $\\nearrow$*).
  2. Polite requests and non-final list items (*pencils $\\nearrow$, erasers $\\nearrow$, and rulers $\\searrow$*).
  3. Question tags expecting genuine confirmation (*You won’t be late, will you? $\\nearrow$*).

## 2. Emphatic / Contrastive Stress (WASSCE Exam Strategy)
In WASSCE Paper 3, the word in **CAPITALS** in the sentence indicates the contrast; choose the option whose question directly contradicts that specific capitalized word!
- Example: *"Kofi bought a **RED** car yesterday."* $\\rightarrow$ Correct question: *"Did Kofi buy a **blue** car yesterday?"*

## 3. The Four Conditional Sentence Patterns
| Type | Time & Probability | Tense Formula | Example |
| :--- | :--- | :--- | :--- |
| **Zero** | Always true scientific fact | \`If + Present Simple, Present Simple\` | *If you heat ice, it melts.* |
| **First** | Real future possibility | \`If + Present Simple, will + V1\` | *If she studies hard, she will pass.* |
| **Second** | Hypothetical / unreal present | \`If + Past Simple (were), would + V1\` | *If I were you, I would apologize.* |
| **Third** | Impossible past regret | \`If + had + V3, would have + V3\` | *If he had left early, he would have caught the bus.* |`,
  },
  {
    id: 'note-english-s3-minutes-cv-unseen',
    topicId: 'english-s3-speeches',
    isBuiltIn: true,
    title: 'Minutes of Meetings, CV Writing, Grammatical Functions & Unseen Literary Appreciation',
    subject: 'english',
    grade: 'SHS3',
    tags: ['SHS3', 'English', 'Minutes', 'CV Writing', 'Grammatical Function', 'Poetry'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Functional Writing, Grammatical Function Drills & Unseen Appreciation

## 1. Formal Minutes of a Meeting & Curriculum Vitae (CV)
- **Minutes Structure:** Title (Organization, Date, Time, Venue) $\\rightarrow$ Attendance / Apologies $\\rightarrow$ Opening Prayer & Reading/Adoption of Previous Minutes $\\rightarrow$ Matters Arising $\\rightarrow$ Agenda Items (concise third-person past tense + action owners) $\\rightarrow$ Any Other Business (AOB) $\\rightarrow$ Adjournment & Signature blocks (Chairperson & Secretary).
- **Curriculum Vitae (CV):** Personal Details (no sensitive IDs), Career Objective, Education & Qualifications (reverse chronological order), Work/Leadership Experience, Skills, Interests, and two verifiable Referees.

## 2. Answering WASSCE "Grammatical Name & Function" Questions
Always provide **both** parts accurately to earn full marks ($1 + 2 = 3$ marks):
1. **Grammatical Name:** Noun Clause / Adjectival (Relative) Clause / Adverbial Clause (of time, reason, concession, condition) / Noun Phrase / Prepositional Phrase.
2. **Grammatical Function:** State the exact grammatical relationship to the specific word/verb in the sentence (e.g., *"Object of the verb 'discovered'"*, *"Qualifies the noun 'student'"*, or *"Modifies the verb 'arrived'"*).

## 3. Unseen Prose & Poetry Appreciation Checklist
Identify **Tone** (writer’s attitude), **Mood/Atmosphere** (reader’s emotional feeling), **Rhyme Scheme** (\`ABAB\`, \`AABB\`), **Enjambment** (run-on lines without punctuation pause), **Caesura** (mid-line pause), **Soliloquy vs Aside** in drama, and concrete **Imagery** (visual, auditory, tactile).`,
  },

  // =========================================================================
  // 8. INTEGRATED SCIENCE & SOCIAL STUDIES (CORE GES/NaCCA DEEP DIVES)
  // =========================================================================
  {
    id: 'note-intsci-s2-machines-work-calculations',
    topicId: 'intsci-s2-machines',
    isBuiltIn: true,
    title: 'Simple Machines: Mechanical Advantage, Velocity Ratio & Efficiency Calculations',
    subject: 'integratedscience',
    grade: 'SHS2',
    tags: ['SHS2', 'Integrated Science', 'Simple Machines', 'MA', 'VR', 'Efficiency'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Simple Machines: Levers, Pulleys, Inclined Planes & Efficiency

## 1. Fundamental Machine Parameters
- **Mechanical Advantage ($MA$):** Ratio of Load overcome to Effort applied (dimensionless):
  $$MA = \\frac{\\text{Load } (L)}{\\text{Effort } (E)}$$
- **Velocity Ratio ($VR$):** Ratio of distance moved by Effort to distance moved by Load (depends purely on machine geometry, unaffected by friction!):
  $$VR = \\frac{d_E}{d_L}$$
- **Efficiency ($\\eta$):** Ratio of useful work output to total work input:
  $$\\eta = \\frac{\\text{Work Output}}{\\text{Work Input}} \\times 100\\% = \\frac{MA}{VR} \\times 100\\%$$
  Because friction and moving pulley weights always dissipate energy, real machine efficiency is strictly **$< 100\\%$**.

## 2. Quick Reference of GES Machine Velocity Ratios
- **Three Classes of Levers (PLE mnemonic):**
  - **1st Class:** Pivot (Fulcrum) in middle (crowbar, scissors).
  - **2nd Class:** **L**oad in middle (wheelbarrow, nutcracker — $MA > 1$).
  - **3rd Class:** **E**ffort in middle (human forearm, tweezers — speed multiplier).
- **Inclined Plane (angle $\\theta$, length $l$, height $h$):** $VR = \\frac{l}{h} = \\frac{1}{\\sin\\theta}$.
- **Block-and-Tackle Pulley System:** $VR =$ total number of supporting rope segments / pulleys.
- **Screw Jack (pitch $p$, handle length $R$):** $VR = \\frac{2\\pi R}{p}$.`,
  },
  {
    id: 'note-intsci-s3-climate-soil-agriculture',
    topicId: 'intsci-s2-ecology',
    isBuiltIn: true,
    title: 'Soil Conservation, Crop/Animal Husbandry & Biogeochemical Nitrogen Cycle',
    subject: 'integratedscience',
    grade: 'SHS3',
    tags: ['SHS3', 'Integrated Science', 'Soil Science', 'Nitrogen Cycle', 'Agriculture'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Soil Science, Crop Husbandry & The Nitrogen Cycle

## 1. Soil Composition, pH & Conservation
- Ideal fertile loam soil contains mineral particles ($45\\%$), water ($25\\%$), air ($25\\%$), and organic humus ($5\\%$).
- **Soil Conservation Methods:** Crop rotation (alternating deep-rooted cereals with nitrogen-fixing legumes), mulching (reduces evaporation & erosion), contour ploughing, terracing on slopes, and adding **agricultural lime ($\\text{CaO}$ or $\\text{CaCO}_3$)** to correct acidic soils.

## 2. Microbial Steps of the Nitrogen Cycle
1. **Nitrogen Fixation:** *Rhizobium* bacteria in legume root nodules (and lightning flashes) convert atmospheric $\\text{N}_2$ into ammonia/nitrates.
2. **Ammonification:** Decomposers break down urea and dead protein into ammonium ions ($\\text{NH}_4^+$).
3. **Nitrification (Aerobic):** *Nitrosomonas* oxidizes $\\text{NH}_4^+ \\rightarrow \\text{NO}_2^-$ (nitrite); *Nitrobacter* oxidizes $\\text{NO}_2^- \\rightarrow \\text{NO}_3^-$ (nitrate absorbed by plant roots).
4. **Denitrification (Anaerobic):** *Pseudomonas* bacteria in waterlogged soils reduce $\\text{NO}_3^-$ back into atmospheric $\\text{N}_2$ gas (prevented by proper soil drainage and ploughing).`,
  },
  {
    id: 'note-soc-s2-constitution-separation-powers',
    topicId: 'soc-s2-governance',
    isBuiltIn: true,
    title: 'Ghana’s 1992 Constitution, Separation of Powers, Checks & Balances & Rule of Law',
    subject: 'socialstudies',
    grade: 'SHS2',
    tags: ['SHS2', 'Social Studies', '1992 Constitution', 'Rule of Law', 'Democracy'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Constitutional Democracy, Rule of Law & Separation of Powers

## 1. Features of Ghana’s 1992 Fourth Republican Constitution
- Supreme law of Ghana (Article 1(2): any law inconsistent with it is void to the extent of the inconsistency).
- Protects Fundamental Human Rights and Freedoms (Chapter 5), establishes independent commissions (Electoral Commission, CHRAJ, NCCE, Media Commission), and provides an entrenched amendment process.

## 2. Separation of Powers & Checks and Balances
| Arm of Government | Core Function | Constitutional Checks on Other Arms |
| :--- | :--- | :--- |
| **Legislature (Parliament)** | Enacts laws, approves national budget & taxes | Scrutinizes ministers, approves presidential nominees, can impeach President |
| **Executive (President & Cabinet)** | Implements policies, maintains defense & foreign affairs | Presidential assent/veto on bills; nominates superior court judges (with Council of State & Parliamentary approval) |
| **Judiciary (Supreme Court & Courts)** | Interprets Constitution and adjudicates disputes | **Judicial Review**: can declare Executive acts or Parliamentary statutes unconstitutional |

## 3. Dicey’s Pillars of the Rule of Law
(1) Supremacy of regular law over arbitrary power; (2) Equality before the law regardless of status; (3) Protection of individual liberties enforced by independent courts.`,
  },
  {
    id: 'note-soc-s3-intl-cooperation-finance',
    topicId: 'soc-s3-peace',
    isBuiltIn: true,
    title: 'International Cooperation (ECOWAS, AU, UN), Peace Building & Financial Literacy',
    subject: 'socialstudies',
    grade: 'SHS3',
    tags: ['SHS3', 'Social Studies', 'ECOWAS', 'AU', 'UN', 'Entrepreneurship', 'Finance'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# International Cooperation, Conflict Resolution & Financial Literacy

## 1. Ghana in ECOWAS, African Union (AU) & United Nations (UN)
- **ECOWAS (Est. 1975, Treaty of Lagos):** Promotes West African economic integration, free movement of persons/goods (ECOWAS passport, ETLS trade scheme), and regional peacekeeping (**ECOMOG**). Challenges include currency differences, political instability, and tariff barriers.
- **African Union (AU — evolved from OAU in 2002):** Promotes continental unity, Agenda 2063, peer review governance, and AfCFTA (headquartered in **Accra, Ghana**!).
- **United Nations (UN, 1945):** Maintains global peace (Security Council), socio-economic welfare (UNESCO, WHO, UNICEF), and peacekeeping (Ghana Armed Forces rank among top global UN troop contributors).

## 2. Peace Building & Personal Financial Literacy
- **Conflict Resolution:** Negotiation (direct dialogue), Mediation (neutral third party facilitates), Arbitration (binding ruling), and Reconciliation.
- **Financial Planning & Entrepreneurship:** Distinguish **needs vs wants**, maintain an emergency savings fund, evaluate **risk vs return** before investing (Treasury Bills, mutual funds, equities on the Ghana Stock Exchange), and register viable SMEs properly with the Registrar-General’s Department.`,
  },
];
