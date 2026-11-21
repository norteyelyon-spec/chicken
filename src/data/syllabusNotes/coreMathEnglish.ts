import type { StudyNote } from '../../types';

const CREATED_AT = '2026-01-15T08:00:00.000Z';

export const CORE_MATH_ENGLISH_SYLLABUS_NOTES: StudyNote[] = [
  // CORE MATHEMATICS (SHS 1 - 3)
  {
    id: 'syllabus-coremath-s1-sets',
    topicId: 'coremath-s1-sets',
    isBuiltIn: true,
    title: 'Unit 1.1: Sets, Venn Diagrams & Number Bases',
    subject: 'coremath',
    grade: 'SHS1',
    tags: ['SHS1', 'Core Math', 'Venn Diagrams', 'Number Bases', 'Recurring Decimals', 'Modular Arithmetic'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Sets, Venn Diagrams, Number Bases & Real Numbers

## Two-Set & Three-Set Venn Equations
For a universal set $U$, the complement $A'$ holds every element in $U$ outside $A$:
$$n(A \\cup B) = n(A) + n(B) - n(A \\cap B), \\qquad n(U) = n(A \\cup B) + n((A \\cup B)')$$
- **Formula Meaning:** Adding $n(A)$ and $n(B)$ counts the overlapping region $n(A \\cap B)$ twice, so subtracting $n(A \\cap B)$ once gives the exact union count.
- **3-Set Center-Outward Rule:** Always fill the triple intersection $n(A \\cap B \\cap C)$ **first**, subtract it from each pairwise intersection to get "two-only" crescents, then subtract from set totals to get the "only one" outer regions.
- **De Morgan’s Laws:** $(A \\cup B)' = A' \\cap B'$ and $(A \\cap B)' = A' \\cup B'$.

## Number Bases, Unknown Base Equations & Modular Arithmetic
- **Base $b \\rightarrow$ Base 10:** Expand positional powers $d_k b^k + \\dots + d_1 b^1 + d_0 b^0$ (e.g., $1101_2 = 1(2^3)+1(2^2)+0(2^1)+1(2^0) = 13_{10}$).
- **Unknown Base Check:** In $23_x + 14_x = 42_x$, expand $(2x + 3) + (x + 4) = 4x + 2 \\implies x = 5$; verify the base exceeds the largest digit ($5 > 4$).
- **Modular Arithmetic ($a \\equiv r \\pmod n$):** Divide $a$ by modulus $n$ and keep non-negative remainder $r \\in \\{0, 1, \\dots, n-1\\}$. For negative results like $-2 \\pmod 5$, keep adding $5$: $-2 + 5 = 3$.`,
  },
  {
    id: 'syllabus-coremath-s1-algebra',
    topicId: 'coremath-s1-algebra',
    isBuiltIn: true,
    title: 'Unit 1.2: Linear Equations, Inequalities, Subject & Variation',
    subject: 'coremath',
    grade: 'SHS1',
    tags: ['SHS1', 'Core Math', 'Algebra', 'Inequalities', 'Variation', 'Factorization'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Linear Equations, Factorization, Inequalities & Variation

## Factorization & Undefined Algebraic Fractions
- **Quadratic Trinomials ($ax^2 + bx + c$):** Find two integers $m, n$ satisfying $m + n = b$ and $m \\cdot n = ac$, split $bx = mx + nx$, and factor by grouping.
- **Zero vs Undefined Fraction Rule:** Fraction $\\frac{P(x)}{Q(x)}$ equals **zero** when numerator $P(x) = 0$ (and $Q(x) \\neq 0$), and is **undefined** when denominator $Q(x) = 0$ because division by zero is impossible.

## Change of Subject & Inequalities
To isolate a target variable buried inside fractions or square roots: clear denominators by multiplying by the LCM, square both sides to remove radicals, collect target terms on one side, factor out the target letter, and divide.
- **Inequality Sign Flip Rule:** Multiplying or dividing both sides by a **negative number** flips the inequality direction ($< \\leftrightarrow >$). Plot strict ($<, >$) with open circles and inclusive ($\\le, \\ge$) with solid dots.

## Direct, Inverse, Joint & Partial Variation
- **Direct ($y \\propto x$):** $y = kx$ ($k$ is the constant ratio $y/x$).
- **Inverse ($y \\propto 1/x$):** $y = \\frac{k}{x}$ ($k = xy$ stays constant as one grows and the other shrinks).
- **Joint ($y \\propto x / z^2$):** $y = \\frac{kx}{z^2}$.
- **Partial Variation:** $C = a + bn$ combines a fixed base term $a$ with a variable rate $bn$; substitute two $(n, C)$ pairs to solve $a$ and $b$ simultaneously.`,
  },
  {
    id: 'syllabus-coremath-s1-surds',
    topicId: 'coremath-s1-surds',
    isBuiltIn: true,
    title: 'Unit 1.3: Indices, Surds & Logarithmic Laws',
    subject: 'coremath',
    grade: 'SHS1',
    tags: ['SHS1', 'Core Math', 'Indices', 'Surds', 'Logarithms'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Indices, Surds & Logarithmic Laws

## Fractional & Negative Indices
$$a^m \\times a^n = a^{m+n}, \\qquad a^{-n} = \\frac{1}{a^n}, \\qquad a^{p/q} = (\\sqrt[q]{a})^p, \\qquad a^0 = 1\\;(a \\neq 0)$$
- **Formula Meaning:** Base $a$ repeats multiplication $m+n$ times; a negative power means reciprocal division ($1 / a^n$); denominator $q$ is the $q$-th root while numerator $p$ is the power.
- Solve exponential equations like $4^{x+1} = 32$ by rewriting both sides with common prime base $2$: $2^{2x+2} = 2^5 \\implies 2x + 2 = 5 \\implies x = 1.5$.

## Simplifying & Rationalizing Surds
Factor out the largest perfect square (e.g., $\\sqrt{72} = \\sqrt{36 \\times 2} = 6\\sqrt{2}$). To rationalize a binomial denominator, multiply numerator and denominator by its **conjugate**:
$$\\frac{1}{a + \\sqrt{b}} = \\frac{a - \\sqrt{b}}{a^2 - b}$$
- Multiplying $(a + \\sqrt{b})(a - \\sqrt{b})$ triggers Difference of Two Squares $a^2 - b$, cancelling the middle irrational terms!

## Core Logarithmic Rules ($a > 0, a \\neq 1$)
- $\\log_a(MN) = \\log_a M + \\log_a N$, $\\quad \\log_a(M/N) = \\log_a M - \\log_a N$, $\\quad \\log_a M^k = k\\log_a M$.
- **Worked Example:** Simplify $\\log_{10} 25 + \\log_{10} 4 = \\log_{10}(25 \\times 4) = \\log_{10} 100 = 2$ (since $10^2 = 100$).`,
  },
  {
    id: 'syllabus-coremath-s2-geometry',
    topicId: 'coremath-s2-geometry',
    isBuiltIn: true,
    title: 'Unit 2.1: Plane Geometry, Coordinate Lines & Circle Theorems',
    subject: 'coremath',
    grade: 'SHS2',
    tags: ['SHS2', 'Core Math', 'Circle Theorems', 'Polygons', 'Coordinate Geometry'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Plane Geometry, Coordinate Lines & Circle Theorems

## Polygon Angle Sums & Coordinate Geometry
For an $n$-sided convex polygon:
$$\\text{Sum of interior angles} = (n - 2) \\times 180^\\circ, \\qquad \\text{Each exterior angle (regular)} = \\frac{360^\\circ}{n}$$
- **Coordinate Lines:** Gradient $m = \\frac{y_2 - y_1}{x_2 - x_1}$, distance $d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$, midpoint $M = \\left(\\frac{x_1+x_2}{2}, \\frac{y_1+y_2}{2}\\right)$. Parallel lines have $m_1 = m_2$; **perpendicular lines satisfy $m_1 \\cdot m_2 = -1$**.

## Seven Essential WASSCE Circle Theorems
1. Angle subtended at the centre is **twice** the angle at the circumference on the same arc ($\\theta_c = 2\\theta$).
2. Angle in a **semicircle** is $90^\\circ$.
3. Angles in the **same segment** are equal.
4. Opposite interior angles of a **cyclic quadrilateral** sum to $180^\\circ$.
5. Exterior angle of a cyclic quad equals the opposite interior angle.
6. Radius meets tangent at $90^\\circ$; two tangents from an external point have equal length.
7. **Alternate Segment Theorem:** Angle between tangent and chord equals angle subtended by that chord in the alternate segment.`,
  },
  {
    id: 'syllabus-coremath-s2-mensuration',
    topicId: 'coremath-s2-mensuration',
    isBuiltIn: true,
    title: 'Unit 2.2: Mensuration: Areas, Sectors, Cones & Solid Volumes',
    subject: 'coremath',
    grade: 'SHS2',
    tags: ['SHS2', 'Core Math', 'Mensuration', 'Cones', 'Frustum', 'Sector Folding'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Mensuration: Areas, Sectors & Solid Volumes

## Circles, Arcs & Sector-to-Cone Folding
For a sector of radius $r$ and central angle $\\theta$ (degrees):
$$L_{\\text{arc}} = \\frac{\\theta}{360^\\circ} \\cdot 2\\pi r, \\qquad A_{\\text{sector}} = \\frac{\\theta}{360^\\circ} \\cdot \\pi r^2$$
- **Sector Folding Formula Insight:** When a circular sector is folded into a hollow cone, the sector radius $r_{\\text{sector}}$ becomes the cone's slant height $l$, and the sector's arc length wraps to form the cone base circumference $2\\pi R$: $\\frac{\\theta}{360^\\circ} \\cdot 2\\pi r_{\\text{sector}} = 2\\pi R$, with vertical height $h = \\sqrt{l^2 - R^2}$.

## 3D Solid Volumes & Frustums
- **Cylinder:** $V = \\pi r^2 h$ (base circle area $\\times$ height), curved surface $A = 2\\pi r h$, total surface area $= 2\\pi r(r + h)$.
- **Cone:** $V = \\frac{1}{3}\\pi r^2 h$ (one-third of a cylinder of equal base and height), curved surface $A = \\pi r l$ ($l^2 = r^2 + h^2$).
- **Sphere / Hemisphere:** $V_{\\text{sphere}} = \\frac{4}{3}\\pi r^3$, curved surface $A = 4\\pi r^2$; total surface area of a solid hemisphere $= 3\\pi r^2$.
- **Frustum:** Use similar triangles ($\\frac{r}{R} = \\frac{h_{\\text{top}}}{H}$) to find full height $H$, then subtract removed top cone volume from whole cone volume.`,
  },
  {
    id: 'syllabus-coremath-s2-bearings',
    topicId: 'coremath-s2-bearings',
    isBuiltIn: true,
    title: 'Unit 2.3: Vectors, Bearings & Complete Rigid Motion Table',
    subject: 'coremath',
    grade: 'SHS2',
    tags: ['SHS2', 'Core Math', 'Bearings', 'Vectors', 'Transformations', 'Enlargement'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Vectors, Bearings & Rigid Motion

## Three-Figure Bearings & Back Bearings
All bearings are measured **clockwise from true North** using 3 digits (e.g., $060^\\circ$, never $60^\\circ$). Always draw a North ($N$) arrow at the **"FROM"** station!
$$\\text{Back Bearing} = \\begin{cases} \\theta + 180^\\circ & \\text{if } \\theta < 180^\\circ \\\\ \\theta - 180^\\circ & \\text{if } \\theta \\ge 180^\\circ \\end{cases}$$
- Combine parallel North-South lines using alternate ($Z$) and co-interior ($C$) angles ($180^\\circ$) to obtain triangle interior angles before applying the Sine or Cosine Rule.

## Column Vectors & Plane Transformation Rules
Vector magnitude $|\\binom{x}{y}| = \\sqrt{x^2 + y^2}$, where $x$ is horizontal displacement and $y$ is vertical displacement.
- **Reflection in $x$-axis:** $(x, -y)$; **in $y$-axis:** $(-x, y)$; **in $y = x$:** $(y, x)$; **in $y = -x$:** $(-y, -x)$.
- **Rotation $90^\\circ$ anticlockwise ($270^\\circ$ CW) about origin:** $(-y, x)$; **$90^\\circ$ clockwise ($270^\\circ$ CCW):** $(y, -x)$; **$180^\\circ$:** $(-x, -y)$.
- **Enlargement scale factor $k$ from origin:** $(kx, ky)$, where $\\text{Image Area} = k^2 \\times \\text{Object Area}$.`,
  },
  {
    id: 'syllabus-coremath-s3-trigonometry',
    topicId: 'coremath-s3-trigonometry',
    isBuiltIn: true,
    title: 'Unit 3.1: Trigonometry, Special Angles (30°, 45°, 60°) & Surveying',
    subject: 'coremath',
    grade: 'SHS3',
    tags: ['SHS3', 'Core Math', 'Trigonometry', 'Special Angles', 'Sine Rule', 'Cosine Rule'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Trigonometry, Special Angles & Surveying

## Exact Derivation of Special Angles ($30^\\circ, 45^\\circ, 60^\\circ$)
- **From Equilateral Triangle (Side $2$ split in half):** Dropping an altitude creates a $30^\\circ\\text{–}60^\\circ\\text{–}90^\\circ$ right triangle with hypotenuse $2$, base $1$, and height $\\sqrt{2^2 - 1^2} = \\sqrt{3}$:
  - $\\sin 30^\\circ = \\frac{1}{2}, \\; \\cos 30^\\circ = \\frac{\\sqrt{3}}{2}, \\; \\tan 30^\\circ = \\frac{1}{\\sqrt{3}}$; $\\quad \\sin 60^\\circ = \\frac{\\sqrt{3}}{2}, \\; \\cos 60^\\circ = \\frac{1}{2}, \\; \\tan 60^\\circ = \\sqrt{3}$.
- **From Isosceles Right Triangle (Legs $1, 1$):** Hypotenuse is $\\sqrt{1^2 + 1^2} = \\sqrt{2}$, giving $\\sin 45^\\circ = \\cos 45^\\circ = \\frac{1}{\\sqrt{2}}$ and $\\tan 45^\\circ = 1$.

## Right & Oblique Triangle Laws
In right triangles use SOH-CAH-TOA. For non-right triangles with sides $a, b, c$ opposite angles $A, B, C$:
$$\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} \\quad \\text{(Sine Rule)}, \\qquad c^2 = a^2 + b^2 - 2ab\\cos C \\quad \\text{(Cosine Rule)}$$
$$\\text{Area of Triangle} = \\frac{1}{2}ab\\sin C$$
- **Angles of Elevation & Depression:** Angle of depression downward from top horizontal sightline equals angle of elevation upward from bottom horizontal sightline by alternate interior angles.`,
  },
  {
    id: 'syllabus-coremath-s3-statistics',
    topicId: 'coremath-s3-statistics',
    isBuiltIn: true,
    title: 'Unit 3.2: Grouped Statistics, Histograms, Ogives & Probability',
    subject: 'coremath',
    grade: 'SHS3',
    tags: ['SHS3', 'Core Math', 'Statistics', 'Frequency Density', 'Ogive', 'Variance', 'Probability'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Grouped Statistics, Frequency Density, Ogives & Probability

## Grouped Mean, Frequency Density, Variance & Standard Deviation
$$\\bar{x} = \\frac{\\sum fx}{\\sum f}, \\qquad \\text{Frequency Density} = \\frac{\\text{Class Frequency}}{\\text{Class Width}}, \\qquad s = \\sqrt{\\frac{\\sum f(x - \\bar{x})^2}{\\sum f}} = \\sqrt{\\frac{\\sum fx^2}{\\sum f} - \\bar{x}^2}$$
- **Formula Meaning:** $\\bar{x}$ weights each class midpoint $x$ by its frequency $f$. Squaring deviations $(x - \\bar{x})^2$ makes all spreads positive and penalizes extreme values; taking the square root returns standard deviation $s$ to the original data units!
- On a **Histogram with unequal class widths**, bar area (not just height!) represents frequency, so bar height MUST be plotted as **Frequency Density**.
- Plot **Cumulative Frequency Curves (Ogives)** against **Upper Class Boundaries** (anchored at cumulative frequency $0$ on the lower boundary of the first class), NOT against midpoints! Read $Q_1$ ($25\\%N$), $Q_2$ ($50\\%N$), $Q_3$ ($75\\%N$), and $\\text{IQR} = Q_3 - Q_1$ using clean dashed construction lines.

## Probability & Tree Diagrams Without Replacement
$$P(A \\cup B) = P(A) + P(B) - P(A \\cap B), \\qquad P(\\text{at least one}) = 1 - P(\\text{none})$$
- **Without Replacement Rule:** Multiply probabilities along branches, and decrement **both** the matching outcome count and the total denominator ($n \\to n - 1$) on the second draw!`,
  },
  {
    id: 'syllabus-coremath-s3-business',
    topicId: 'coremath-s3-business',
    isBuiltIn: true,
    title: 'Unit 3.3: Consumer, Financial & Reverse Percentage Mathematics',
    subject: 'coremath',
    grade: 'SHS3',
    tags: ['SHS3', 'Core Math', 'Compound Interest', 'Reverse Percentages', 'Taxes', 'Hire Purchase'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Consumer, Financial & Reverse Percentage Mathematics

## Simple vs Compound Interest, Depreciation & Reverse Percentages
$$I_{\\text{simple}} = \\frac{PRT}{100}, \\qquad A_{\\text{compound}} = P\\left(1 + \\frac{r}{100}\\right)^n, \\qquad V_{\\text{dep}} = P\\left(1 - \\frac{r}{100}\\right)^n$$
$$\\text{Original Value (Reverse \\%)} = \\frac{\\text{New Value}}{1 \\pm \\frac{r}{100}}$$
- **Why Reverse Percentage Works:** The original cost or value is always $100\\%$. If an item increases by $r\\%$, the new price equals $(100 + r)\\%$ of original—so you divide by $(1 + r/100)$ rather than taking $r\\%$ of the new price!
- **Compound Growth Meaning:** $P$ is initial principal, $r$ is rate per compounding period, and $n$ is total number of periods. For semi-annual compounding, halve $r$ and double $n$.

## Hire Purchase, Taxes & Exchange Rates
- **Hire Purchase:** $\\text{HP Price} = \\text{Cash Deposit} + (\\text{Monthly Instalment} \\times \\text{Months})$. Extra interest paid $= \\text{HP Price} - \\text{Cash Price}$.
- **Graduated Income Tax:** Deduct non-taxable reliefs/allowances first, then tax remaining chargeable income slice by slice through each bracket width.`,
  },

  // =========================================================================
  // SHS 1 CORE MATHEMATICS COMPLETE MASTER GUIDE (STRANDS 1 - 4 DEEP DIVES)
  // =========================================================================
  {
    id: 'note-mg-coremath-s1-strand1-numbers',
    topicId: 'coremath-s1-sets',
    isBuiltIn: true,
    title: 'SHS 1 Master Guide Strand 1: Real Numbers, Bases, Mod n, Surds, Reverse % & 3-Set Venn',
    subject: 'coremath',
    grade: 'SHS1',
    tags: ['SHS1', 'Core Maths', 'Strand 1', 'Recurring Decimals', 'Modular Arithmetic', 'Reverse Percentage', '3-Set Venn'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Strand 1: Numbers for Everyday Life (Complete SHS 1 Master Guide)

## 1.1 The Real Number System & Converting Recurring Decimals to Fractions
Every real number ($\\mathbb{R}$) is either **Rational** ($\\mathbb{Q} = \\{\\frac{p}{q} : p, q \\in \\mathbb{Z}, q \\neq 0\\}$ — terminating or repeating decimals) or **Irrational** ($\\mathbb{Q}'$ — non-terminating, non-repeating decimals such as $\\sqrt{2}, \\sqrt{5}, \\pi$).
- **Worked Derivation — Convert $0.2\\overline{36} = 0.2363636\\dots$ to a fraction in lowest terms:**
  1. Let $x = 0.2363636\\dots$
  2. Multiply by $10^1 = 10$ so the repeating block starts right after the decimal point: $10x = 2.363636\\dots$ (Eq. 1).
  3. Since $2$ digits repeat ($36$), multiply Eq. 1 by $10^2 = 100$: $1000x = 236.363636\\dots$ (Eq. 2).
  4. Subtract Eq. 1 from Eq. 2 to cancel the infinite tail cleanly:
$$1000x - 10x = 236.3636\\dots - 2.3636\\dots \\implies 990x = 234 \\implies x = \\frac{234}{990} = \\frac{13}{55}$$
- **WASSCE Pitfall:** Never stop at $\\frac{234}{990}$; WAEC requires fractions reduced to **lowest terms** ($\\div 18$).

## 1.2 Number Bases & Modular Arithmetic Equations
- **Unknown Base Derivation ($23_x + 14_x = 42_x$):**
  1. Expand each numeral into Base $10$ positional powers of $x$: $(2x^1 + 3x^0) + (1x^1 + 4x^0) = 4x^1 + 2x^0$.
  2. Simplify linear terms: $3x + 7 = 4x + 2 \\implies x = 5$.
  3. **Domain Check:** Base $x$ must strictly exceed the highest digit appearing ($5 > 4$, valid!).
- **Solving Linear Modular Equations ($3x + 4 \\equiv 2 \\pmod 5$):**
  1. Subtract $4$: $3x \\equiv -2 \\pmod 5$.
  2. Add multiples of modulus $5$ to make the RHS positive and divisible by $3$: $-2 + 5 = 3 \\implies 3x \\equiv 3 \\pmod 5$, or test $x \\in \\{0, 1, 2, 3, 4\\}$: $x = 1$ (check: $3(1)+4 = 7 \\equiv 2 \\pmod 5$, and also test $-2 + 5 = 3 \\implies x \\equiv 1$).
  - Wait: for $3x \\equiv 4 \\pmod 5$ add $5$ twice ($4 + 5 = 9 \\implies 3x \\equiv 9 \\implies x \\equiv 3 \\pmod 5$).

## 1.3 Surds, Conjugate Rationalization, Indices & Logarithms
$$\\frac{1}{a + \\sqrt{b}} \\times \\frac{a - \\sqrt{b}}{a - \\sqrt{b}} = \\frac{a - \\sqrt{b}}{a^2 - b}, \\qquad \\log_a(M^k) = k\\log_a M, \\qquad \\log_a(MN) = \\log_a M + \\log_a N$$
- **Meaning:** Conjugates flip the middle sign so $(a+\\sqrt{b})(a-\\sqrt{b}) = a^2 - b$ clears square roots from the denominator; $\\log_a x = y$ is simply the inverse question of $a^y = x$ ("What power of $a$ gives $x$?").

## 1.4 Financial Maths & Reverse Percentages
$$A = P\\left(1 + \\frac{r}{100}\\right)^n, \\qquad \\text{Original Price (Reverse \\%)} = \\frac{\\text{New Price}}{1 \\pm \\frac{r}{100}}$$
- **Worked Reverse Percentage Example:** A laptop sells for $\\text{GH₵}\\,2,300$ after a $15\\%$ markup. Since original price is $100\\%$, $\\text{GH₵}\\,2,300$ equals $115\\%$:
$$\\text{Original Price} = \\frac{2300}{1.15} = \\text{GH₵}\\,2,000$$

## 1.5 Three-Set Venn Diagrams (Center-Outward Method)
$$n(A \\cup B \\cup C) = n(A)+n(B)+n(C) - n(A\\cap B) - n(B\\cap C) - n(A\\cap C) + n(A\\cap B\\cap C)$$
- **Golden Solving Strategy:** Fill $x = n(A\\cap B\\cap C)$ in the dead center **first**, subtract $x$ from each pairwise intersection ("$A$ and $B$"), subtract the three inner slices around each set to get "Only $A$", "Only $B$", and "Only $C$", then add the outside complement $n((A\\cup B\\cup C)')$ so all $8$ regions equal $n(U)$.`,
  },
  {
    id: 'note-mg-coremath-s1-strand2-algebra',
    topicId: 'coremath-s1-algebra',
    isBuiltIn: true,
    title: 'SHS 1 Master Guide Strand 2: Factorization, Fractions, Coordinate Geometry & AP/GP',
    subject: 'coremath',
    grade: 'SHS1',
    tags: ['SHS1', 'Core Maths', 'Strand 2', 'Coordinate Geometry', 'Perpendicular Bisector', 'AP', 'GP'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Strand 2: Algebraic Reasoning & Coordinate Geometry (SHS 1 Master Guide)

## 2.1 Quadratic Factorization ($ax^2 + bx + c$) & Undefined/Zero Fractions
- **ac Split-Middle Method ($6x^2 + 11x - 10$):** Multiply $a \\cdot c = 6(-10) = -60$. Find $m + n = +11$ and $mn = -60$ ($m = 15, n = -4$):
  $$6x^2 + 15x - 4x - 10 = 3x(2x + 5) - 2(2x + 5) = (3x - 2)(2x + 5)$$
- **Zero vs Undefined Rational Expressions:** For $\\frac{x - 3}{x^2 - 4}$:
  - Value is **zero** when numerator $x - 3 = 0 \\implies x = 3$.
  - Expression is **undefined** when denominator $x^2 - 4 = 0 \\implies x = \\pm 2$ (division by $0$ breaks arithmetic).

## 2.2 Change of Subject, Simultaneous Systems & Inequalities
- **Isolating Buried Variables ($T = 2\\pi\\sqrt{\\frac{L}{g}}$):** Divide by $2\\pi$, square both sides to eliminate the root, then solve for $L$:
$$\\frac{T}{2\\pi} = \\sqrt{\\frac{L}{g}} \\implies \\frac{T^2}{4\\pi^2} = \\frac{L}{g} \\implies L = \\frac{gT^2}{4\\pi^2}$$
- **Inequalities:** Dividing both sides of $-3x \\ge 12$ by $-3$ **flips** the sign: $x \\le -4$.

## 2.3 Relations, Functions & Coordinate Geometry (Perpendicular Bisector)
| Coordinate Concept | Exact Formula | Geometric Meaning |
| :--- | :--- | :--- |
| **Gradient ($m$)** | $m = \\frac{y_2 - y_1}{x_2 - x_1}$ | Vertical rise divided by horizontal run |
| **Distance ($d$)** | $d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$ | Pythagoras applied to $(\\Delta x, \\Delta y)$ |
| **Midpoint ($M$)** | $M = \\left(\\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2}\\right)$ | Average of $x$-coordinates and $y$-coordinates |
| **Parallel Lines** | $m_1 = m_2$ | Identical slope; lines never meet |
| **Perpendicular Lines** | $m_1 \\cdot m_2 = -1$ | Right-angle ($90^\\circ$) intersection: negative reciprocal $m_2 = -1/m_1$ |

- **Worked Derivation — Perpendicular Bisector of $A(2, 3)$ and $B(6, 5)$:**
  1. Midpoint $M = (\\frac{2+6}{2}, \\frac{3+5}{2}) = (4, 4)$.
  2. Slope of $AB$: $m_{AB} = \\frac{5 - 3}{6 - 2} = \\frac{1}{2}$.
  3. Perpendicular slope: $m_{\\perp} = -\\frac{1}{1/2} = -2$ (check: $\\frac{1}{2} \\times (-2) = -1$).
  4. Equation through $(4, 4)$: $y - 4 = -2(x - 4) \\implies 2x + y = 12$.

## 2.4 Arithmetic & Geometric Sequences ($U_n, S_n, S_\\infty$)
- **AP:** $U_n = a + (n-1)d$, $\\; S_n = \\frac{n}{2}[2a + (n-1)d] = \\frac{n}{2}(a + l)$ (where $a$ is first term, $d$ constant difference, $l$ last term).
- **GP:** $U_n = ar^{n-1}$, $\\; S_n = \\frac{a(r^n - 1)}{r - 1}$ ($r \\neq 1$), $\\; S_\\infty = \\frac{a}{1 - r}$ for $|r| < 1$ (since $r^n \\to 0$ as $n \\to \\infty$).`,
  },
  {
    id: 'note-mg-coremath-s1-strand3-geometry',
    topicId: 'coremath-s2-geometry',
    isBuiltIn: true,
    title: 'SHS 1 Master Guide Strand 3: Transformations Table, Special Angles 30°/45°/60°, Bearings & Sector-Cone',
    subject: 'coremath',
    grade: 'SHS1',
    tags: ['SHS1', 'Core Maths', 'Strand 3', 'Transformations', 'Special Angles', 'Bearings', 'Constructions'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Strand 3: Geometry Around Us & Trigonometry (SHS 1 Master Guide)

## 3.1 Plane Geometry, Circle Theorems & Compass Constructions
- **Polygon Angles:** Interior sum $= (n-2)\\times 180^\\circ$; regular exterior $= \\frac{360^\\circ}{n}$.
- **Compass & Straightedge Constructions:** Keep compass radius fixed to cut $60^\\circ$ arcs; bisect $60^\\circ \\to 30^\\circ \\to 15^\\circ$; bisect a straight angle for $90^\\circ \\to 45^\\circ$; combine $60^\\circ + 15^\\circ = 75^\\circ$ and $90^\\circ + 15^\\circ = 105^\\circ$. Never erase construction arcs in WASSCE Paper 2!

## 3.2 Complete 10-Row Rigid Motion & Enlargement Transformation Table
Every point $P(x, y)$ maps to its image $P'(x', y')$ under standard origin-centered transformations:

| Transformation Rule | Image Mapping $(x', y')$ | Geometric Effect |
| :--- | :--- | :--- |
| **1. Translation by $\\binom{a}{b}$** | $(x + a,\\; y + b)$ | Shifts $a$ right/left and $b$ up/down |
| **2. Reflection in $x$-axis ($y = 0$)** | $(x,\\; -y)$ | Negates vertical coordinate $y$ |
| **3. Reflection in $y$-axis ($x = 0$)** | $(-x,\\; y)$ | Negates horizontal coordinate $x$ |
| **4. Reflection in line $y = x$** | $(y,\\; x)$ | Swaps $x$ and $y$ coordinates |
| **5. Reflection in line $y = -x$** | $(-y,\\; -x)$ | Swaps $x, y$ and flips both signs |
| **6. Rotation $90^\\circ$ Anticlockwise** | $(-y,\\; x)$ | Equivalent to $270^\\circ$ clockwise about origin |
| **7. Rotation $90^\\circ$ Clockwise** | $(y,\\; -x)$ | Equivalent to $270^\\circ$ anticlockwise about origin |
| **8. Rotation $180^\\circ$ (Half-Turn)** | $(-x,\\; -y)$ | Same result clockwise or anticlockwise |
| **9. Enlargement (scale $k$, origin)** | $(kx,\\; ky)$ | Scales lengths by $|k|$; negative $k$ inverts through $(0,0)$ |
| **10. Area Scaling under Scale $k$** | $\\text{Area}' = k^2 \\cdot \\text{Area}$ | 2D area scales by $k^2$, never $k$! |

## 3.3 Special Angles ($30^\\circ, 45^\\circ, 60^\\circ$) Exact Surd Derivation
- **Using Equilateral Triangle of side $2$:** Cut symmetrically into two $30^\\circ\\text{–}60^\\circ\\text{–}90^\\circ$ triangles with hypotenuse $2$, base $1$, and height $\\sqrt{2^2 - 1^2} = \\sqrt{3}$:
  - $\\sin 30^\\circ = \\frac{1}{2}, \\; \\cos 30^\\circ = \\frac{\\sqrt{3}}{2}, \\; \\tan 30^\\circ = \\frac{1}{\\sqrt{3}}$.
  - $\\sin 60^\\circ = \\frac{\\sqrt{3}}{2}, \\; \\cos 60^\\circ = \\frac{1}{2}, \\; \\tan 60^\\circ = \\sqrt{3}$.
- **Using Isosceles Right Triangle ($1, 1, \\sqrt{2}$):** $\\sin 45^\\circ = \\cos 45^\\circ = \\frac{1}{\\sqrt{2}}, \\; \\tan 45^\\circ = 1$.

## 3.4 Vectors, Three-Figure Bearings & Mensuration Sector-to-Cone Folding
- **Bearings:** Always measure **clockwise from North** in 3 digits ($045^\\circ$, not $45^\\circ$). Draw North lines at **every** station! Back bearing $= \\theta \\pm 180^\\circ$.
- **Sector-to-Cone Folding:** Arc length of sector $L = \\frac{\\theta}{360^\\circ}(2\\pi r_{\\text{sec}})$ folds into base circumference $2\\pi R_{\\text{cone}}$, slant height $l = r_{\\text{sec}}$, and vertical cone height $h = \\sqrt{l^2 - R^2}$:
$$V_{\\text{cone}} = \\frac{1}{3}\\pi R^2 h, \\qquad A_{\\text{curved}} = \\pi R l, \\qquad V_{\\text{cylinder}} = \\pi R^2 h, \\qquad V_{\\text{sphere}} = \\frac{4}{3}\\pi R^3$$`,
  },
  {
    id: 'note-mg-coremath-s1-strand4-data',
    topicId: 'coremath-s3-statistics',
    isBuiltIn: true,
    title: 'SHS 1 Master Guide Strand 4: Frequency Density, Ogives, Variance/SD & Tree Diagrams',
    subject: 'coremath',
    grade: 'SHS1',
    tags: ['SHS1', 'Core Maths', 'Strand 4', 'Frequency Density', 'Ogive', 'Standard Deviation', 'Probability Tree'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Strand 4: Handling Data — Statistics & Probability (SHS 1 Master Guide)

## 4.1 Grouped Statistics, Frequency Density Histograms & Ogive Quartiles
- **Unequal Class Width Histogram Rule:** Never plot raw frequencies directly when class intervals differ in width! Area equals frequency, so bar height is **Frequency Density**:
$$\\text{Frequency Density} = \\frac{\\text{Class Frequency}}{\\text{Class Width}}$$
  - *Example:* Interval $20\\text{–}35$ has width $15$ and frequency $15 \\implies \\text{Density} = 15/15 = 1.0$; interval $10\\text{–}20$ has width $10$ and frequency $5 \\implies \\text{Density} = 5/10 = 0.5$.
- **Cumulative Frequency Curve (Ogive) Rules:**
  1. Always plot Cumulative Frequency against **Upper Class Boundaries** (never class midpoints!).
  2. Anchor the S-curve at cumulative frequency $0$ on the **lower boundary of the first class**.
  3. Draw dashed horizontal & vertical lookup lines for **Lower Quartile ($Q_1 = 25\\%N$)**, **Median ($Q_2 = 50\\%N$)**, and **Upper Quartile ($Q_3 = 75\\%N$)**. $\\text{IQR} = Q_3 - Q_1$.
- **Grouped Mean, Variance ($s^2$) & Standard Deviation ($s$):**
$$\\bar{x} = \\frac{\\sum fx}{\\sum f}, \\qquad s^2 = \\frac{\\sum f(x - \\bar{x})^2}{\\sum f} = \\frac{\\sum fx^2}{\\sum f} - \\bar{x}^2, \\qquad s = \\sqrt{s^2}$$
  - **Formula Meaning:** Variance averages the squared distance of every class midpoint $x$ from mean $\\bar{x}$ weighted by $f$; taking the square root converts squared units back into original measurement units!

## 4.2 Probability & Tree Diagrams Without Replacement
$$P(A \\cup B) = P(A) + P(B) - P(A \\cap B), \\qquad P(\\text{at least one}) = 1 - P(\\text{none})$$
- **Without Replacement Worked Rule:** A bag holds $5$ red and $3$ blue balls ($8$ total). If two balls are drawn **without replacement**, the second-draw denominator drops from $8$ to $7$:
  - $P(\\text{Both Red}) = \\frac{5}{8} \\times \\frac{4}{7} = \\frac{20}{56} = \\frac{5}{14}$.
  - $P(\\text{Same Colour}) = P(RR) + P(BB) = \\frac{5}{8}\\cdot\\frac{4}{7} + \\frac{3}{8}\\cdot\\frac{2}{7} = \\frac{26}{56} = \\frac{13}{28}$.`,
  },

  // ENGLISH LANGUAGE (SHS 1 - 3)
  {
    id: 'syllabus-english-s1-concord',
    topicId: 'english-s1-concord',
    isBuiltIn: true,
    title: 'Unit 1.1: Parts of Speech & Rules of Concord',
    subject: 'english',
    grade: 'SHS1',
    tags: ['SHS1', 'English', 'Concord', 'Grammar', 'Agreement'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Parts of Speech & Rules of Concord

## Essential WASSCE Subject–Verb Agreement Rules
1. **Grammatical Concord:** Singular subjects take singular verbs; plural subjects take plural verbs. Ignore intervening prepositional phrases (*"The box of mangoes **is** heavy"*).
2. **Proximity Concord (*Either...or / Neither...nor / Not only...but also*):** Verb agrees with the **nearest** subject (*"Neither the teachers nor the headmaster **was** late"*).
3. **As well as / Together with / Including:** Verb agrees with the **first** subject (*"Kwame, together with his friends, **has** arrived"*).

## Indefinite Pronouns, Collective Nouns & Examiner Traps
4. **Indefinite Pronouns:** *Each, every, everyone, somebody, neither* take **singular** verbs (*"Each of the girls **has** a textbook"*).
5. **Pluralia Tantum & Collective Nouns:** *Scissors, trousers* take plural verbs; *news, mathematics, measles* take singular verbs; collective nouns (*jury, committee, team*) take singular when acting as one unit and plural when acting individually.
6. **Subjunctive & "One of the ... who":** *"She is one of the students who **have** passed"* (plural verb agrees with plural antecedent *students*); *"It is high time we **left**"* takes past subjunctive.`,
  },
  {
    id: 'syllabus-english-s1-comprehension',
    topicId: 'english-s1-comprehension',
    isBuiltIn: true,
    title: 'Unit 1.2: Reading Comprehension & Summary Writing',
    subject: 'english',
    grade: 'SHS1',
    tags: ['SHS1', 'English', 'Comprehension', 'Summary', 'Grammar Function'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Reading Comprehension & Summary Writing

## Vocabulary Replacement & Figurative Comprehension
- Replacement words/phrases must match **both meaning and exact grammatical part of speech / tense** so they drop smoothly into the sentence.
- Explain **contextual meaning** rather than giving literal definitions for idiomatic or metaphorical questions.

## Grammatical Name & Function Format
Always state two items: (1) Exact Name (**Noun phrase/clause**, **Adjectival clause**, **Adverbial clause of time/reason/concession**) + (2) Exact Function (*Subject of verb "...", Object of "...", Qualifies noun "...", Modifies verb "..."*).

## WASSCE Summary Golden Rules
- Write **one complete, simple sentence** per required point (include subject + finite verb).
- **Never copy passages verbatim (mindless lifting)**; paraphrase concisely omitting examples, statistics, and illustrations.`,
  },
  {
    id: 'syllabus-english-s1-composition',
    topicId: 'english-s1-composition',
    isBuiltIn: true,
    title: 'Unit 1.3: Narrative & Descriptive Composition',
    subject: 'english',
    grade: 'SHS1',
    tags: ['SHS1', 'English', 'Essays', 'Narrative', 'Descriptive'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Narrative & Descriptive Composition

## Essay Marking Criteria (50 Marks Breakdown)
WASSCE essays ($\\ge 450\\text{ words}$) are graded across **Content** (10), **Organization** (10), **Expression** (20), and **Mechanical Accuracy** (10 — deducted $0.5$ per spelling/punctuation/tense error).

## Narrative & Descriptive Craft
- **Narrative Arc:** Engaging hook/exposition $\\rightarrow$ rising conflict $\\rightarrow$ vivid climax $\\rightarrow$ meaningful resolution/lesson.
- **Tense Consistency:** Maintain consistent past tense in storytelling unless shifting deliberately inside punctuated direct dialogue.
- **Sensory Imagery & Coherence:** Blend sight, sound, smell, and texture alongside cohesive transitions (*moreover, consequently, meanwhile*) to achieve paragraph unity around clear topic sentences.`,
  },
  {
    id: 'syllabus-english-s2-clauses',
    topicId: 'english-s2-clauses',
    isBuiltIn: true,
    title: 'Unit 2.1: Clauses, Phrases & Complex Sentences',
    subject: 'english',
    grade: 'SHS2',
    tags: ['SHS2', 'English', 'Clauses', 'Syntax', 'Modifiers'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Clauses, Phrases & Complex Sentences

## Phrases vs Clauses
- **Phrase:** Word group lacking a subject–finite verb pair (e.g., *under the baobab tree*, *farmers from Tamale*).
- **Clause:** Contains both a grammatical subject and finite verb:
  - **Noun Clause:** Functions as subject, object, or complement (*"**What she discovered** amazed everyone"*).
  - **Adjectival (Relative) Clause:** Introduced by *who, which, that, whose* directly following the noun it qualifies.
  - **Adverbial Clause:** Modifies a verb/adjective (time *when*, reason *because*, concession *although*, condition *unless*).

## Fixing Common Sentence Errors
- **Comma Splice:** Joining independent clauses with only a comma; fix using a semicolon, period, or coordinating conjunction (*FANBOYS*).
- **Dangling Modifier:** *"Walking through the gate, the assembly hall looked huge"* falsely implies the hall walked! Fix: *"Walking through the gate, **we saw** the assembly hall looked huge."*`,
  },
  {
    id: 'syllabus-english-s2-oral',
    topicId: 'english-s2-oral',
    isBuiltIn: true,
    title: 'Unit 2.2: Oral English: Vowels, Consonants & Stress',
    subject: 'english',
    grade: 'SHS2',
    tags: ['SHS2', 'English', 'Oral English', 'Phonetics', 'Stress'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Oral English: Vowels, Consonants & Stress

## Pure Vowels, Diphthongs & Consonants
- **Short vs Long Vowels:** $/\\text{i}/$ (*sit*) vs $/\\text{i:}/$ (*seat*); $/\\text{ɒ}/$ (*cot*) vs $/\\text{ɔ:}/$ (*caught*); $/\\text{ʌ}/$ (*cup*) vs $/\\text{ɜ:}/$ (*curd*).
- **Diphthongs:** Glide smoothly from one vowel to another: $/\\text{eɪ}/$ (*gate*), $/\\text{aɪ}/$ (*kite*), $/\\text{ɔɪ}/$ (*boy*), $/\\text{əʊ}/$ (*go*).
- Watch silent consonants (*debt, island, plumber, honest*) and $-ed$ endings ($/\\text{t}/$ after voiceless *washed*, $/\\text{d}/$ after voiced *played*, $/\\text{ɪd}/$ after *t/d* *wanted*).

## Word & Emphatic Sentence Stress
- Two-syllable noun/verb pairs shift stress: **RE**cord (noun) vs re**CORD** (verb).
- Suffix rules: *-tion, -sion, -ic* pull stress to the **penultimate** syllable (*e-du-CA-tion*); *-ate, -ise, -ty* stress **third-from-end** (*de-MOC-ra-cy*).
- **Emphatic Stress:** Pick the question option that **contradicts ONLY the capitalized word** (*"Kofi bought a BLUE car"* $\\rightarrow$ *"Did Kofi buy a RED car?"*).`,
  },
  {
    id: 'syllabus-english-s2-formalwriting',
    topicId: 'english-s2-formalwriting',
    isBuiltIn: true,
    title: 'Unit 2.3: Formal Letters & Newspaper Articles',
    subject: 'english',
    grade: 'SHS2',
    tags: ['SHS2', 'English', 'Formal Letters', 'Articles', 'Register'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Formal Letters & Newspaper Articles

## Formal Letter Layout Checklist (Ghana WASSCE Standard)
1. **Writer’s Address & Date** (top-right, clear punctuation).
2. **Recipient’s Designation & Address** (left margin, e.g., *The Director, Ghana Education Service...*).
3. **Salutation:** \`Dear Sir,\` or \`Dear Madam,\`.
4. **Underlined / Capitalized Title:** Summarizing the letter’s purpose concisely.
5. **Formal Register:** No slang, contractions (*don’t* $\\rightarrow$ *do not*), or personal small talk.
6. **Subscription:** \`Yours faithfully,\` + **Signature** + **Full Name** (both first and surname!).

## Newspaper Articles & Letters to the Editor
- **Article Format:** Bold/underlined **Headline** $\\rightarrow$ persuasive body paragraphs $\\rightarrow$ **By-line (Full Name, Location/School)** at the bottom.
- **Semi-Formal Letters** (to teachers, mentors, elders): One address, \`Dear Mr. Mensah,\`, polite yet warm tone, ending with \`Yours sincerely,\` + First/Full Name.`,
  },
  {
    id: 'syllabus-english-s3-literature',
    topicId: 'english-s3-literature',
    isBuiltIn: true,
    title: 'Unit 3.1: Literary Appreciation & Figures of Speech',
    subject: 'english',
    grade: 'SHS3',
    tags: ['SHS3', 'English', 'Literature', 'Figures of Speech', 'Irony'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Literary Appreciation & Figures of Speech

## Sound & Comparison Devices
- **Simile vs Metaphor:** Simile uses *like/as* (*"brave as a lion"*); Metaphor states direct identity (*"Time is a thief"*).
- **Personification:** Grants human actions/emotions to inanimate objects (*"The angry clouds frowned"*).
- **Alliteration vs Assonance:** Repetition of initial consonant sounds (*"wild winds"*) vs repeated internal vowel sounds.
- **Onomatopoeia:** Words imitating sounds (*hiss, splash, boom*).

## Contrast, Irony & Substitution
- **Oxymoron vs Paradox:** Oxymoron pairs two adjacent contradictory words (*"living dead"*); Paradox is a seemingly absurd statement revealing truth (*"The child is father of the man"*).
- **Synecdoche vs Metonymy:** Synecdoche uses part for whole (*"all hands on deck"*); Metonymy uses an associated symbol (*"The Crown" for the monarchy*).
- **Irony Types:** Verbal (saying opposite), Situational (outcome reverses expectation), **Dramatic** (audience knows danger a character ignores).`,
  },
  {
    id: 'syllabus-english-s3-speeches',
    topicId: 'english-s3-speeches',
    isBuiltIn: true,
    title: 'Unit 3.2: Speech, Debate & Investigative Reports',
    subject: 'english',
    grade: 'SHS3',
    tags: ['SHS3', 'English', 'Speech', 'Debate', 'Reports'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Speech, Debate & Investigative Reports

## Public Speech & Debate Conventions
- **Vocative Protocol:** Open by greeting the dignitaries in descending order (*"Mr. Chairman, Panel of Judges, Accurate Timekeeper, Co-debaters, Ladies and Gentlemen..."*).
- **Debate Technique:** State clearly whether you are proposing or opposing the motion, **rebut** opposing arguments politely in paragraph 2, and reinforce your points with rhetorical questions and Ghanaian examples.
- End a speech cleanly with *"Thank you."*

## Committee & Investigative Reports
- Objective, impersonal third-person register (passive constructions where fitting).
- Standard structure: **Title** $\\rightarrow$ **Introduction / Terms of Reference** (who commissioned it & scope) $\\rightarrow$ **Procedure / Methods** $\\rightarrow$ **Findings** (numbered subsections) $\\rightarrow$ **Recommendations** $\\rightarrow$ **Signature, Name, Secretary/Chairperson & Date**.`,
  },
  {
    id: 'syllabus-english-s3-lexis',
    topicId: 'english-s3-lexis',
    isBuiltIn: true,
    title: 'Unit 3.3: WASSCE Lexis, Structure & Idiomatic Usage',
    subject: 'english',
    grade: 'SHS3',
    tags: ['SHS3', 'English', 'Lexis', 'Phrasal Verbs', 'Question Tags'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# WASSCE Lexis, Structure & Idiomatic Usage

## Question Tags & Conditional Sentences
- Positive statement $\\rightarrow$ Negative tag (*"Abena passed the test, **didn’t she?**"*); Negative statement $\\rightarrow$ Positive tag (*"They rarely visit, **do they?**"* — note *rarely, seldom, hardly* are negative!).
- *"I am right, **aren’t I?**"* and imperatives take *will you?* or *shall we?* (*"Let’s study, **shall we?**"*).
- **Third Conditional (unreal past):** *"If he **had studied**, he **would have passed**."*

## High-Frequency Phrasal Verbs & Idioms
- *Put off* (postpone) vs *put out* (extinguish) vs *put up with* (tolerate).
- *Call off* (cancel) vs *look up to* (respect) vs *run into* (meet by chance).
- **Antonyms & Near-Synonyms:** Check italicized target word polarity and collocation with adjacent prepositions (*accuse of, congratulate on, insist on, abstain from*).`,
  },
];
