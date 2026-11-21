import type { StudyNote } from '../../types';

const CREATED_AT = '2026-01-15T08:00:00.000Z';

export const MATHS_ICT_SYLLABUS_NOTES: StudyNote[] = [
  // ADD MATHS (SHS 1 - 3)
  {
    id: 'syllabus-math-s1-algebra',
    topicId: 'math-s1-algebra',
    isBuiltIn: true,
    title: 'Unit 1.1: Surds, Indices, Logarithms & Polynomials',
    subject: 'addmaths',
    grade: 'SHS1',
    tags: ['SHS1', 'Add Maths', 'Logarithms', 'Factor Theorem', 'Partial Fractions'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Surds, Indices, Logarithms & Polynomials

## Laws of Indices, Surds & Logarithms
- Rationalize $\\frac{1}{a + \\sqrt{b}}$ by multiplying top and bottom by the conjugate $a - \\sqrt{b}$.
- Logarithmic equivalences ($x > 0, a > 0, a \\neq 1$):
$$\\log_a(xy) = \\log_a x + \\log_a y, \\qquad \\log_a\\left(\\frac{x}{y}\\right) = \\log_a x - \\log_a y, \\qquad \\log_a x^k = k\\log_a x$$
- Change of base formula: $\\log_a b = \\frac{\\log_c b}{\\log_c a}$.

## Remainder Theorem, Factor Theorem & Partial Fractions
When polynomial $f(x)$ is divided by $(ax - b)$, the remainder is $f(b/a)$. If $f(b/a) = 0$, then $(ax - b)$ is an exact linear factor of $f(x)$.
- **Partial Fraction Templates:**
  - Distinct linear factors $\\frac{A}{x - p} + \\frac{B}{x - q}$
  - Repeated linear factor $\\frac{A}{x - p} + \\frac{B}{(x - p)^2}$
  - Irreducible quadratic factor $\\frac{Ax + B}{x^2 + k}$`,
  },
  {
    id: 'syllabus-math-s1-quadratics',
    topicId: 'math-s1-quadratics',
    isBuiltIn: true,
    title: 'Unit 1.2: Quadratic Functions, Roots & Inequalities',
    subject: 'addmaths',
    grade: 'SHS1',
    tags: ['SHS1', 'Add Maths', 'Quadratics', 'Discriminant', 'Inequalities'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Quadratic Functions, Roots & Inequalities

## Discriminant & Completing the Square
For $f(x) = ax^2 + bx + c = a\\left(x + \\frac{b}{2a}\\right)^2 + \\left(c - \\frac{b^2}{4a}\\right)$, discriminant $\\Delta = b^2 - 4ac$:
- $\\Delta > 0$: Two distinct real roots.
- $\\Delta = 0$: Equal (repeated) real roots; curve touches $x$-axis tangentially.
- $\\Delta < 0$: No real roots ($ax^2 + bx + c$ keeps constant sign matching $a$).

## Symmetric Functions of Roots ($\\alpha, \\beta$)
$$\\alpha + \\beta = -\\frac{b}{a}, \\qquad \\alpha\\beta = \\frac{c}{a}, \\qquad \\alpha^2 + \\beta^2 = (\\alpha + \\beta)^2 - 2\\alpha\\beta$$
$$\\alpha^3 + \\beta^3 = (\\alpha + \\beta)^3 - 3\\alpha\\beta(\\alpha + \\beta)$$
To form a new quadratic with roots $p$ and $q$: $x^2 - (p + q)x + pq = 0$.

## Quadratic Inequalities
Sketch or use sign intervals around critical roots; never multiply an inequality by a variable expression whose sign could be negative without splitting cases.`,
  },
  {
    id: 'syllabus-math-s1-sequences',
    topicId: 'math-s1-sequences',
    isBuiltIn: true,
    title: 'Unit 1.3: Sequences, Series & Binomial Theorem',
    subject: 'addmaths',
    grade: 'SHS1',
    tags: ['SHS1', 'Add Maths', 'AP', 'GP', 'Binomial Theorem'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Sequences, Series & Binomial Theorem

## Arithmetic & Geometric Progressions (AP & GP)
- **Arithmetic ($d$ = common difference):**
$$U_n = a + (n - 1)d, \\qquad S_n = \\frac{n}{2}[2a + (n - 1)d]$$
- **Geometric ($r$ = common ratio):**
$$U_n = ar^{n-1}, \\qquad S_n = \\frac{a(1 - r^n)}{1 - r}, \\qquad S_\\infty = \\frac{a}{1 - r}\\;(|r| < 1)$$
Notice that the $n$-th term can always be recovered from partial sums via $U_n = S_n - S_{n-1}$.

## Binomial Expansion Theorem
For positive integer $n$, the $(r + 1)$-th term in $(a + b)^n$ is:
$$T_{r+1} = \\binom{n}{r} a^{n-r} b^r$$
- For rational approximations (e.g., $1.02^6$), expand first 3–4 terms until the required decimal precision stabilizes.

## Worked WASSCE Example
- **Problem:** A geometric progression has first term $a = 12$ and sum to infinity $S_\\infty = 18$. Find its common ratio $r$ and 4th term $U_4$.
- **Solution:** $18 = \\frac{12}{1 - r} \\implies 1 - r = \\frac{2}{3} \\implies r = \\frac{1}{3}$. Hence $U_4 = 12\\left(\\frac{1}{3}\\right)^3 = \\frac{12}{27} = \\frac{4}{9}$.`,
  },
  {
    id: 'syllabus-math-s2-coordgeo',
    topicId: 'math-s2-coordgeo',
    isBuiltIn: true,
    title: 'Unit 2.1: Coordinate Geometry: Lines & Circles',
    subject: 'addmaths',
    grade: 'SHS2',
    tags: ['SHS2', 'Add Maths', 'Circles', 'Tangents', 'Lines'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Coordinate Geometry: Lines & Circles

## Straight Lines & Perpendicular Distance
Two non-vertical lines with gradients $m_1, m_2$ are parallel if $m_1 = m_2$ and perpendicular if $m_1 m_2 = -1$.
$$\\tan\\theta = \\left|\\frac{m_1 - m_2}{1 + m_1 m_2}\\right|, \\qquad d = \\frac{|ax_1 + by_1 + c|}{\\sqrt{a^2 + b^2}}$$

## Circle Equations, Tangents & Normals
General form $x^2 + y^2 + 2gx + 2fy + c = 0$ represents a circle with centre $(-g, -f)$ and radius $r = \\sqrt{g^2 + f^2 - c}$:
$$(x - h)^2 + (y - k)^2 = r^2$$
- **Tangent at $P(x_1, y_1)$ on the circle:** The normal passes through centre $C(h, k)$ and $P$, so tangent gradient $m_T = -\\frac{x_1 - h}{y_1 - k}$.
- Length of tangent from external point $T(x_1, y_1)$: $L = \\sqrt{x_1^2 + y_1^2 + 2gx_1 + 2fy_1 + c}$.`,
  },
  {
    id: 'syllabus-math-s2-trig',
    topicId: 'math-s2-trig',
    isBuiltIn: true,
    title: 'Unit 2.2: Trigonometric Identities & Equations',
    subject: 'addmaths',
    grade: 'SHS2',
    tags: ['SHS2', 'Add Maths', 'Trigonometry', 'Harmonic Form', 'Double Angle'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Trigonometric Identities & Equations

## Compound & Double Angle Formulas
$$\\sin(A \\pm B) = \\sin A\\cos B \\pm \\cos A\\sin B, \\qquad \\cos(A \\pm B) = \\cos A\\cos B \\mp \\sin A\\sin B$$
$$\\sin 2A = 2\\sin A\\cos A, \\qquad \\cos 2A = \\cos^2 A - \\sin^2 A = 2\\cos^2 A - 1 = 1 - 2\\sin^2 A$$
Fundamental Pythagorean identities: $\\sin^2\\theta + \\cos^2\\theta = 1$, $1 + \\tan^2\\theta = \\sec^2\\theta$, $1 + \\cot^2\\theta = \\csc^2\\theta$.

## Harmonic Form $R\\cos(\\theta - \\alpha)$
To solve $a\\cos\\theta + b\\sin\\theta = c$ or locate maximum/minimum values:
$$a\\cos\\theta + b\\sin\\theta \\equiv R\\cos(\\theta - \\alpha), \\quad R = \\sqrt{a^2 + b^2}, \\quad \\tan\\alpha = \\frac{b}{a}$$
- Since $-1 \\le \\cos(\\theta - \\alpha) \\le 1$, the maximum value is $+R$ and minimum value is $-R$.`,
  },
  {
    id: 'syllabus-math-s2-vectors',
    topicId: 'math-s2-vectors',
    isBuiltIn: true,
    title: 'Unit 2.3: Vectors, Dot Product & Matrices',
    subject: 'addmaths',
    grade: 'SHS2',
    tags: ['SHS2', 'Add Maths', 'Vectors', 'Dot Product', 'Matrices'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Vectors, Dot Product & Matrices

## Vectors & Scalar Dot Product
Position vector $\\overrightarrow{AB} = \\mathbf{b} - \\mathbf{a}$. Unit vector along $\\mathbf{v}$ is $\\hat{\\mathbf{v}} = \\frac{\\mathbf{v}}{|\\mathbf{v}|}$.
$$\\mathbf{a} \\cdot \\mathbf{b} = a_x b_x + a_y b_y = |\\mathbf{a}||\\mathbf{b}|\\cos\\theta$$
- Two non-zero vectors are **orthogonal (perpendicular)** if and only if $\\mathbf{a} \\cdot \\mathbf{b} = 0$.

## $2 \\times 2$ Matrices, Determinants & Linear Systems
For matrix $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$, determinant $|A| = ad - bc$:
$$A^{-1} = \\frac{1}{ad - bc}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix} \\quad (ad - bc \\neq 0)$$
- Matrix $A$ is **singular** (has no inverse) when $ad - bc = 0$.
- Solve $A\\mathbf{x} = \\mathbf{k}$ via $\\mathbf{x} = A^{-1}\\mathbf{k}$ or Cramer’s rule.`,
  },
  {
    id: 'syllabus-math-s3-diffcalc',
    topicId: 'math-s3-diffcalc',
    isBuiltIn: true,
    title: 'Unit 3.1: Differential Calculus & Optimization',
    subject: 'addmaths',
    grade: 'SHS3',
    tags: ['SHS3', 'Add Maths', 'Differentiation', 'Chain Rule', 'Optimization'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Differential Calculus & Optimization

## Core Differentiation Rules
- **Product Rule:** $\\frac{d}{dx}(uv) = u\\frac{dv}{dx} + v\\frac{du}{dx}$
- **Quotient Rule:** $\\frac{d}{dx}\\left(\\frac{u}{v}\\right) = \\frac{v\\frac{du}{dx} - u\\frac{dv}{dx}}{v^2}$
- **Chain Rule:** $\\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx}$; implicit differentiation uses $\\frac{d}{dx}(y^n) = ny^{n-1}\\frac{dy}{dx}$.

## Tangents, Normals & Stationary Points
1. At stationary points, $\\frac{dy}{dx} = 0$.
2. Second derivative test: $\\frac{d^2y}{dx^2} < 0 \\implies$ **local maximum**; $\\frac{d^2y}{dx^2} > 0 \\implies$ **local minimum**; if $0$, check sign of $\\frac{dy}{dx}$ either side.
- Normal gradient at $x = x_0$: $m_N = -\\frac{1}{dy/dx}$. Related rates use $\\frac{dV}{dt} = \\frac{dV}{dr} \\cdot \\frac{dr}{dt}$.`,
  },
  {
    id: 'syllabus-math-s3-intcalc',
    topicId: 'math-s3-intcalc',
    isBuiltIn: true,
    title: 'Unit 3.2: Integral Calculus, Area & Volumes',
    subject: 'addmaths',
    grade: 'SHS3',
    tags: ['SHS3', 'Add Maths', 'Integration', 'Area', 'Volumes'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Integral Calculus, Area & Volumes

## Indefinite & Definite Integration
$$\\int x^n\\,dx = \\frac{x^{n+1}}{n+1} + C\\;(n \\neq -1), \\qquad \\int \\frac{f'(x)}{f(x)}\\,dx = \\ln|f(x)| + C$$
- Always include constant $+C$ for indefinite integrals (find $C$ using boundary points when recovering $y$ from $\\frac{dy}{dx}$).

## Area Bounded Between Curves & Solids of Revolution
- Area between upper curve $y_{\\text{top}}$ and lower curve $y_{\\text{bottom}}$ over $[a, b]$:
$$A = \\int_a^b (y_{\\text{top}} - y_{\\text{bottom}})\\,dx$$
- Volume rotated $360^\\circ$ ($2\\pi$ rad) around the $x$-axis:
$$V_x = \\pi \\int_a^b y^2\\,dx, \\qquad V_y = \\pi \\int_c^d x^2\\,dy$$
- **Worked Example:** Area between $y = 4 - x^2$ and $y = 0$ over $[-2, 2]$: $A = \\int_{-2}^{2}(4 - x^2)\\,dx = \\left[4x - \\frac{x^3}{3}\\right]_{-2}^{2} = \\frac{32}{3}\\text{ sq. units}$.`,
  },
  {
    id: 'syllabus-math-s3-stats',
    topicId: 'math-s3-stats',
    isBuiltIn: true,
    title: 'Unit 3.3: Permutations, Combinations & Probability',
    subject: 'addmaths',
    grade: 'SHS3',
    tags: ['SHS3', 'Add Maths', 'Permutations', 'Combinations', 'Binomial'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Permutations, Combinations & Probability

## Counting Techniques
- **Permutations (order matters):** $^nP_r = \\frac{n!}{(n-r)!}$; arrangements of $n$ items with $p, q$ identical copies $= \\frac{n!}{p!q!}$.
- **Combinations (order irrelevant):** $^nC_r = \\frac{n!}{r!(n-r)!}$.

## Probability Laws & Binomial Distribution
- Conditional probability: $P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}$. Events are independent iff $P(A \\cap B) = P(A)P(B)$.
- **Binomial Model $X \\sim B(n, p)$:**
$$P(X = k) = \\binom{n}{k} p^k (1 - p)^{n-k}, \\qquad \\mu = np, \\qquad \\sigma^2 = np(1 - p)$$
- Spearman’s rank correlation $\\rho = 1 - \\frac{6\\sum d^2}{n(n^2 - 1)}$ measures monotonic strength in $[-1, +1]$.
- **Examiner Tip:** In committee selection problems ("at least 2 girls"), sum disjoint combination cases cleanly or subtract the unwanted complement from $^N C_r$.`,
  },

  // ICT (SHS 1 - 3)
  {
    id: 'syllabus-ict-s1-hardware',
    topicId: 'ict-s1-hardware',
    isBuiltIn: true,
    title: 'Unit 1.1: Computer Architecture, Hardware & Binary Systems',
    subject: 'ict',
    grade: 'SHS1',
    tags: ['SHS1', 'ICT', 'CPU', 'Von Neumann', 'Binary'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Computer Architecture, Hardware & Binary Systems

## Von Neumann Architecture & Fetch–Decode–Execute Cycle
Data and program instructions share unified main memory. Key CPU components:
- **CU (Control Unit):** Coordinates clock timing and sends control signals over the control bus.
- **ALU:** Performs arithmetic ($+, -$) and bitwise logic ($\\text{AND, OR, shifts}$).
- **Special Registers:** **PC** (Program Counter holds next address), **MAR** (Memory Address Register), **MDR** (Memory Data Register), **CIR** (Current Instruction Register), and **ACC** (Accumulator).

## Memory Hierarchy & Data Representation
Speed rank: Registers $>$ L1/L2/L3 SRAM Cache $>$ DRAM Main Memory $>$ NVMe/SSD $>$ HDD.
- One byte $= 8\\text{ bits}$ ($2^8 = 256$ values); $1\\text{ KiB} = 1024\\text{ bytes}$.
- **Two’s Complement** represents signed integers cleanly in hardware without separate $+0$ and $-0$.`,
  },
  {
    id: 'syllabus-ict-s1-logic',
    topicId: 'ict-s1-logic',
    isBuiltIn: true,
    title: 'Unit 1.2: Boolean Logic & Digital Logic Gates',
    subject: 'ict',
    grade: 'SHS1',
    tags: ['SHS1', 'ICT', 'Logic Gates', 'Boolean Algebra', 'Truth Tables'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Boolean Logic & Digital Logic Gates

## Fundamental & Universal Gates
- **AND ($A \\cdot B$):** Output $1$ only if both inputs are $1$.
- **OR ($A + B$):** Output $1$ if at least one input is $1$.
- **NOT ($\\overline{A}$):** Inverts input ($0 \\leftrightarrow 1$).
- **XOR ($A \\oplus B = A\\overline{B} + \\overline{A}B$):** Output $1$ only when inputs differ.
- **Universal Gates:** Both **NAND** and **NOR** can construct every other Boolean gate!

## De Morgan’s Laws & Truth Tables
$$\\overline{A \\cdot B} = \\overline{A} + \\overline{B}, \\qquad \\overline{A + B} = \\overline{A} \\cdot \\overline{B}$$
- Always check $2^n$ rows for $n$ inputs (e.g., 3 sensors $T, H, M$ yield $2^3 = 8$ rows) and compute intermediate sub-expressions before the final gate.`,
  },
  {
    id: 'syllabus-ict-s1-os',
    topicId: 'ict-s1-os',
    isBuiltIn: true,
    title: 'Unit 1.3: Operating Systems, File Systems & Ethics',
    subject: 'ict',
    grade: 'SHS1',
    tags: ['SHS1', 'ICT', 'Operating Systems', 'Cybersecurity', 'Ethics'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Operating Systems, File Systems & Ethics

## Operating System Kernel Functions
The OS manages hardware and presents a user interface (CLI vs GUI):
1. **Process & CPU Scheduling:** Preemptive multitasking gives time slices to processes.
2. **Memory & Virtual Memory Management:** Uses **paging/swapping** onto secondary storage when RAM fills.
3. **Device Drivers & Interrupts:** Hardware interrupts signal urgent I/O events to the CPU.
4. **File & Access Control:** Directory trees, file extensions, and read/write/execute permissions.

## Cybersecurity, Encryption & Ghanaian Ethics
- **Threats:** Phishing emails, ransomware, SQL injection, social engineering, and keyloggers.
- **Cryptography:** **Symmetric (AES)** uses one shared key (fast); **Asymmetric (RSA/TLS)** pairs a public encryption key with a private decryption key.
- Ghana’s **Data Protection Act (Act 843)** requires consent, security safeguards, and lawful purpose for personal data.`,
  },
  {
    id: 'syllabus-ict-s2-networking',
    topicId: 'ict-s2-networking',
    isBuiltIn: true,
    title: 'Unit 2.1: Data Communication & Computer Networks',
    subject: 'ict',
    grade: 'SHS2',
    tags: ['SHS2', 'ICT', 'Networking', 'OSI Model', 'Topologies'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Data Communication & Computer Networks

## Network Topologies & Hardware Devices
- **Star Topology:** Devices link directly to a central **Layer-2 Switch** (single cable failure affects only one PC; uses MAC addresses to forward frames directly without broadcast flooding like a Hub).
- **Router:** Operates at Network Layer (Layer 3) using **IP addresses** to route packets across different subnets and WANs.
- **Mesh Topology:** Redundant paths give maximum fault tolerance.

## OSI 7-Layer Stack & Transmission Media
Application $\\rightarrow$ Presentation $\\rightarrow$ Session $\\rightarrow$ **Transport (TCP/UDP)** $\\rightarrow$ **Network (IP)** $\\rightarrow$ **Data Link (MAC)** $\\rightarrow$ Physical.
- **Cat6 UTP Copper:** Limited to $100\\text{ m}$ segments; susceptible to EMI.
- **Single-Mode Fiber Optic:** Transmits light pulses over kilometres immune to electromagnetic interference (EMI) with massive bandwidth.
$$\\text{Usable IPv4 Hosts} = 2^h - 2 \\quad \\text{(excluding network \\& broadcast addresses)}$$`,
  },
  {
    id: 'syllabus-ict-s2-web',
    topicId: 'ict-s2-web',
    isBuiltIn: true,
    title: 'Unit 2.2: Web Technologies: HTML5, CSS3 & HTTP',
    subject: 'ict',
    grade: 'SHS2',
    tags: ['SHS2', 'ICT', 'HTML5', 'CSS3', 'HTTP'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Web Technologies: HTML5, CSS3 & HTTP

## Semantic HTML5 & CSS Box Model
- Prefer semantic landmarks (\`<header>\`, \`<nav>\`, \`<main>\`, \`<article>\`, \`<footer>\`) and accessible labels (\`<label for="...">\`) over generic \`<div>\` tags.
- CSS **Box Model** outward order: \`Content\` $\\rightarrow$ \`Padding\` $\\rightarrow$ \`Border\` $\\rightarrow$ \`Margin\`. With \`box-sizing: border-box\`, declared \`width\` includes content, padding, and border.

## DNS Resolution & HTTP/HTTPS Protocol
1. Browser queries **DNS** to translate a domain name into an IPv4/IPv6 address.
2. **HTTPS** encrypts HTTP traffic over **TLS** to prevent eavesdropping and tampering.
3. Key HTTP Status Codes: \`200 OK\`, \`201 Created\`, \`301 Moved Permanently\`, \`400 Bad Request\`, \`401 Unauthorized\`, \`404 Not Found\`, \`500 Internal Server Error\`.`,
  },
  {
    id: 'syllabus-ict-s2-spreadsheets',
    topicId: 'ict-s2-spreadsheets',
    isBuiltIn: true,
    title: 'Unit 2.3: Spreadsheet Modeling & Data Analysis',
    subject: 'ict',
    grade: 'SHS2',
    tags: ['SHS2', 'ICT', 'Spreadsheets', 'Excel', 'VLOOKUP'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Spreadsheet Modeling & Data Analysis

## Cell Referencing & Core WASSCE Formulas
- **Relative (\`A2\`):** Adjusts dynamically when copied across rows/columns.
- **Absolute (\`\\$A\\$2\`):** Locks column and row using \`$\` (essential for tax rates or grade boundaries).
\`\`\`excel
=IF(B2>=80, "A1", IF(B2>=70, "B2", "C4"))
=COUNTIF(B2:B41, ">=75")
=VLOOKUP(A2, $F$2:$G$10, 2, FALSE)
\`\`\`

## Validation, Auditing & Chart Selection
- Avoid **circular references** (a cell formula referencing itself directly or indirectly), \`#DIV/0!\` (division by zero), and \`#NAME?\` (misspelled function name).
- **Bar/Column charts** compare discrete categories; **Line charts** show trends over continuous time; **Pie charts** show part-to-whole percentages.
- **Data Validation & Goal Seek:** Restrict cell entries cleanly (e.g., whole numbers $0–100$) or solve target outputs via *What-If Analysis*.`,
  },
  {
    id: 'syllabus-ict-s3-databases',
    topicId: 'ict-s3-databases',
    isBuiltIn: true,
    title: 'Unit 3.1: Relational Databases, Normalization & SQL',
    subject: 'ict',
    grade: 'SHS3',
    tags: ['SHS3', 'ICT', 'SQL', 'Normalization', '3NF'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Relational Databases, Normalization & SQL

## Keys & Normalization (1NF $\\rightarrow$ 3NF)
- **Primary Key:** Uniquely identifies every row in a table. **Foreign Key:** References a primary key in a parent table to enforce referential integrity.
- **1NF:** Atomic cell values, no repeating groups.
- **2NF:** In 1NF plus every non-key attribute depends on the **entire** composite key (no partial dependencies).
- **3NF:** In 2NF plus zero **transitive dependencies** between non-key attributes.

## Essential SQL Statements
\`\`\`sql
SELECT FullName, House, PhysicsScore
FROM Candidates
WHERE House = 'Aggrey' AND PhysicsScore >= 75
ORDER BY PhysicsScore DESC;

SELECT House, COUNT(*) AS TotalCandidates, AVG(PhysicsScore) AS MeanScore
FROM Candidates
GROUP BY House;
\`\`\``,
  },
  {
    id: 'syllabus-ict-s3-programming',
    topicId: 'ict-s3-programming',
    isBuiltIn: true,
    title: 'Unit 3.2: Algorithms, Flowcharts & Python Programming',
    subject: 'ict',
    grade: 'SHS3',
    tags: ['SHS3', 'ICT', 'Python', 'Algorithms', 'Trace Tables'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Algorithms, Flowcharts & Python Programming

## Flowcharts & Searching Complexity
- Flowchart symbols: **Oval** (Start/Stop), **Parallelogram** (Input/Output), **Rectangle** (Process), **Diamond** (Decision).
- **Linear Search ($O(n)$):** Works on unsorted lists. **Binary Search ($O(\\log_2 n)$):** Requires a sorted list and halves the search space each comparison.

## Modular Python Functions & Loops
\`\`\`python
def count_distinctions(scores):
    count = 0
    for s in scores:
        if s >= 80:
            count += 1
    return count
\`\`\`
- Always test loop boundaries with **dry-run trace tables** tracking every variable column step-by-step to catch off-by-one bugs.
- **Time Complexity Check:** For $1024$ sorted candidate IDs, Linear Search requires up to $1024$ checks whereas Binary Search guarantees a result in at most $\\log_2(1024) + 1 = 11$ comparisons.`,
  },
  {
    id: 'syllabus-ict-s3-sdlc',
    topicId: 'ict-s3-sdlc',
    isBuiltIn: true,
    title: 'Unit 3.3: System Development Life Cycle (SDLC) & Testing',
    subject: 'ict',
    grade: 'SHS3',
    tags: ['SHS3', 'ICT', 'SDLC', 'Testing', 'Changeover'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# System Development Life Cycle (SDLC) & Testing

## Seven Stages & Methodologies
1. Feasibility Study (TELOS: Technical, Economic, Legal, Operational, Schedule)
2. Investigation & Requirements Analysis (interviews, questionnaires, observation)
3. System Design (DFDs, UI wireframes, ERDs)
4. Implementation (coding & unit testing)
5. System Testing (black-box I/O tests, white-box path tests using normal, boundary, and erroneous data)
6. Deployment / Changeover
7. Maintenance (corrective, adaptive, perfective).

- **Waterfall:** Sequential stages suited to fixed requirements. **Agile:** Iterative sprints welcoming evolving user feedback.

## Four Deployment (Changeover) Strategies
- **Parallel:** Old and new run together (safest, highest cost).
- **Direct Cutover:** Immediate switch (cheapest, highest risk).
- **Pilot:** Tested at one branch/school first.
- **Phased:** Modules rolled out gradually.`,
  },
];
