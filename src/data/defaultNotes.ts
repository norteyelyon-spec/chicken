import type { ExamAttempt, MistakeEntry, StreakData, StudyNote } from '../types';
import { getOffsetLocalDateKey } from '../utils/studyReminders';

export const NOTE_TEMPLATES: { id: string; label: string; content: string }[] = [
  {
    id: 'formula-sheet',
    label: 'Formula Sheet',
    content: `# Topic Formula Sheet

## Core Equations
$$v = u + at$$
$$s = ut + \\frac{1}{2}at^2$$

## Variable Definitions & Units
- **$u$**: Initial velocity ($\\text{m s}^{-1}$)
- **$v$**: Final velocity ($\\text{m s}^{-1}$)
- **$a$**: Uniform acceleration ($\\text{m s}^{-2}$)

## WASSCE Exam Pitfalls
- Always convert $\\text{cm}$ or $\\text{km/h}$ to SI units before substituting.`,
  },
  {
    id: 'lab-report',
    label: 'Lab Report',
    content: `# Paper 3 Practical Lab Report

## Aim
To determine the exact relationship between the measured variables and verify theoretical gradient.

## Apparatus & Setup
- List apparatus with least counts (e.g., burette $\\pm 0.05\\text{ cm}^3$).

## Observations & Calculations
$$\\text{Slope } m = \\frac{\\Delta y}{\\Delta x}$$

## Key Precautions
- Avoid parallax error by reading scales perpendicularly at eye level.
- Take concordant/repeated readings and compute the arithmetic mean.`,
  },
  {
    id: 'topic-summary',
    label: 'Topic Summary',
    content: `# GES Syllabus Topic Summary

## Key Concepts
- Summarize core definitions accurately using WASSCE examiner keywords.

## Worked Example
Write out a step-by-step solved problem with units highlighted.

## Quick Self-Check
- Can I explain this concept without looking at my textbook?`,
  },
  {
    id: 'ict-code',
    label: 'ICT Code Snippet',
    content: `# Algorithm & SQL Revision

## Python Implementation
\`\`\`python
def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1
\`\`\`

## SQL Query Pattern
\`\`\`sql
SELECT FullName, Score
FROM Results
WHERE Score >= 75
ORDER BY Score DESC;
\`\`\``,
  },
];

export const INITIAL_NOTES: StudyNote[] = [
  {
    id: 'note-chem-atomic-shs1',
    title: 'Atomic Theory (SHS 1): Dalton, Subatomic Particles & Mass Spectrometry',
    subject: 'chemistry',
    grade: 'SHS1',
    tags: ['Chemistry', 'Atomic Theory', 'Dalton', 'Isotopes', 'Mass Spectrometer'],
    updatedAt: '2026-11-18T08:30:00Z',
    createdAt: '2026-11-18T08:00:00Z',
    content: `# Atomic Theory Foundations: Dalton, Subatomic Particles & Isotopes (SHS 1)

## 1. Particulate Nature of Matter & Dalton’s Atomic Theory (1808)
Matter is composed of tiny, discrete particles: **atoms**, **molecules**, and **ions**.

### John Dalton’s Five Postulates
- **Indivisibility**: All matter consists of tiny, indivisible particles called atoms.
- **Identity**: Atoms of the same element are identical in mass and chemical properties, whereas atoms of different elements differ in mass and properties.
- **Conservation**: Atoms can neither be created nor destroyed in chemical reactions (explains the **Law of Conservation of Mass**).
- **Simple Whole-Number Ratios**: Atoms combine in simple whole-number ratios to form compounds (explains the **Law of Definite Proportions** and **Law of Multiple Proportions**).

### Modifications to Dalton’s Theory (Modern Atomic Theory)
1. **Atoms are divisible**: Atoms contain subatomic particles (protons, neutrons, electrons).
2. **Isotopes exist**: Same element, different neutron counts and masses (e.g., $^{12}\\text{C}$ and $^{14}\\text{C}$).
3. **Isobars exist**: Different elements sharing the same mass number (e.g., $^{40}_{18}\\text{Ar}$ and $^{40}_{20}\\text{Ca}$).
4. **Nuclear reactions**: Atoms can transform or split during nuclear fission and fusion.
5. **Complex organic ratios**: Macromolecules like starch, proteins, and polymers combine in large, complex ratios.

## 2. Subatomic Particles & Nuclide Notation
| Particle | Symbol | Relative Mass ($\text{amu}$) | Relative Charge | Location |
| --- | --- | --- | --- | --- |
| Proton | $p^+$ | $1$ ($1.0073$) | $+1$ | Nucleus |
| Neutron | $n^0$ | $1$ ($1.0087$) | $0$ | Nucleus |
| Electron | $e^-$ | $\\frac{1}{1840} \\approx 0$ | $-1$ | Energy Levels / Orbitals |

### Standard Nuclide Notation: $^A_Z X$
- **Atomic Number ($Z$)**: Number of protons in the nucleus (equals $e^-$ in a neutral atom).
- **Mass Number ($A$)**: Total nucleons (protons + neutrons):
$$A = Z + N \\implies N = A - Z$$
- **Ions**: **Cations** ($X^{n+}$) form by losing electrons; **Anions** ($X^{n-}$) form by gaining electrons.

## 3. Isotopes, Mass Spectrometry & Relative Atomic Mass ($A_r$)
**Isotopes** have identical proton counts ($Z$) and identical chemical properties, but different neutron counts ($N$) and physical properties (density, boiling point, diffusion rate).

### Five Stages of the Mass Spectrometer
1. **Vaporization**: Sample is turned into a gas.
2. **Ionization**: High-energy electron beam knocks out electrons: $X_{(g)} + e^- \\rightarrow X^+_{(g)} + 2e^-$.
3. **Acceleration**: Electric field accelerates positive ions into a focused beam.
4. **Deflection**: Magnetic field deflects ions according to mass-to-charge ratio ($m/z$); **lighter ions deflect more**.
5. **Detection**: Ion current generates a mass spectrum of relative abundance vs $m/z$.

### Worked WASSCE Calculation ($^{35}\\text{Cl}$ 75%, $^{37}\\text{Cl}$ 25%)
$$A_r = \\frac{\\sum (\\text{Isotopic Mass} \\times \\text{Abundance})}{100} = \\frac{(35 \\times 75) + (37 \\times 25)}{100} = 35.5$$`,
  },
  {
    id: 'note-chem-atomic-shs2',
    title: 'Atomic Theory (SHS 2): Thomson, Millikan, Rutherford, Chadwick & Bohr Models',
    subject: 'chemistry',
    grade: 'SHS2',
    tags: ['Chemistry', 'Atomic Theory', 'Thomson', 'Rutherford', 'Bohr'],
    updatedAt: '2026-11-18T08:35:00Z',
    createdAt: '2026-11-18T08:05:00Z',
    content: `# Evolution of Atomic Models & Key WASSCE Experiments (SHS 2)

## 1. J.J. Thomson (1897) – Cathode Ray Tube & Plum Pudding Model
- **Experiment**: High-voltage discharge through low-pressure gas in a **Cathode Ray Tube (CRT)** with electric and magnetic fields.
- **Key Observations**: Rays travelled in straight lines from cathode to anode, deflected toward the **positive electric plate**, rotated a light paddle wheel, and produced the same charge-to-mass ratio regardless of gas or electrode metal:
$$\\frac{e}{m} = 1.76 \\times 10^{11}\\text{ C kg}^{-1}$$
- **Plum Pudding Model (1904)**: Thomson proposed the atom is a uniform sphere of positive charge with negatively charged electrons embedded inside like plums in a pudding.

## 2. Robert Millikan (1909) – Oil Drop Experiment
By balancing downward gravity ($mg$) against upward electrostatic force ($qE$) on charged oil droplets, Millikan measured the elementary electron charge:
$$e = -1.602 \\times 10^{-19}\\text{ C} \\implies m_e = 9.11 \\times 10^{-31}\\text{ kg}$$

## 3. Ernest Rutherford (1911) – Gold Foil $\\alpha$-Scattering Experiment
Bombarded ultra-thin gold foil ($\\sim 10^{-7}\\text{ m}$) with positively charged $\\alpha$-particles ($^4_2\\text{He}^{2+}$) observed on a rotatable $\\text{ZnS}$ fluorescent screen:
- **Most $\\alpha$-particles passed straight through** $\\implies$ Most of the atom is **empty space**.
- **A few deflected at small angles** $\\implies$ Repelled by a tiny, **positively charged** center.
- **About 1 in 8,000 bounced back ($>90^\\circ$)** $\\implies$ Almost all atomic mass is concentrated in an ultra-dense **nucleus**.
- **Limitation**: Classical electrodynamics predicted accelerating orbiting electrons would radiate energy and spiral into the nucleus.

## 4. James Chadwick (1932) – Discovery of the Neutron
Bombarding beryllium with $\\alpha$-particles emitted uncharged, penetrating particles of mass equal to the proton ($^9_4\\text{Be} + ^4_2\\text{He} \\rightarrow ^{12}_6\\text{C} + ^1_0n$), explaining nuclear mass discrepancies.

## 5. Niels Bohr (1913) – Quantized Shell Model
- Electrons revolve only in **discrete stationary orbits** ($K, L, M, N$; $n = 1, 2, 3, 4$) without radiating energy.
- Energy is absorbed or emitted as a photon only when an electron jumps between shells:
$$\\Delta E = E_{\\text{upper}} - E_{\\text{lower}} = hf = \\frac{hc}{\\lambda}$$
- Successfully explained the **Hydrogen atomic line emission spectrum** (Lyman, Balmer, Paschen series), though it fails for multi-electron atoms.`,
  },
  {
    id: 'note-chem-atomic-shs3',
    title: 'Atomic Theory (SHS 3): Quantum Model, Quantum Numbers & Orbitals (Z=1–30)',
    subject: 'chemistry',
    grade: 'SHS3',
    tags: ['Chemistry', 'Atomic Theory', 'Quantum Numbers', 'Aufbau', 'Orbitals'],
    updatedAt: '2026-11-18T08:40:00Z',
    createdAt: '2026-11-18T08:10:00Z',
    content: `# Quantum Mechanical Model, Quantum Numbers & Electronic Configuration (SHS 3)

## 1. Wave-Particle Duality & Orbitals
- **Louis de Broglie (1924)**: Electrons exhibit wave properties with wavelength $\\lambda = \\frac{h}{mv}$.
- **Heisenberg Uncertainty Principle (1927)**: It is impossible to determine simultaneously the exact position and exact momentum of an electron: $\\Delta x \\cdot \\Delta p \\ge \\frac{h}{4\\pi}$.
- **Erwin Schrödinger (1926)**: Replaced fixed Bohr orbits with **atomic orbitals** — 3D regions of high probability ($|\\psi|^2$) of finding an electron.

## 2. The Four Quantum Numbers
| Quantum Number | Symbol | Permitted Values | Physical Meaning |
| --- | --- | --- | --- |
| Principal | $n$ | $1, 2, 3, 4\\dots$ | Main energy shell & orbital size (max $2n^2$ electrons) |
| Azimuthal (Angular) | $l$ | $0$ to $n-1$ ($s=0, p=1, d=2, f=3$) | Subshell energy & 3D orbital shape |
| Magnetic | $m_l$ | $-l \\dots 0 \\dots +l$ | 3D spatial orientation ($p_x, p_y, p_z$) |
| Spin | $m_s$ | $+\\frac{1}{2}$ or $-\\frac{1}{2}$ | Intrinsic electron spin direction |

## 3. Three Electron-Filling Rules
1. **Aufbau Principle**: Fill lowest-energy orbitals first: $1s < 2s < 2p < 3s < 3p < 4s < 3d < 4p$.
2. **Pauli Exclusion Principle**: No two electrons in the same atom can share all four quantum numbers; an orbital holds max 2 electrons with **opposite spins**.
3. **Hund’s Rule**: Degenerate orbitals ($p_x, p_y, p_z$ or five $3d$ orbitals) are filled singly with **parallel spins** before pairing.

## 4. WASSCE Exceptions & Transition Metal Ions ($Z = 1\\text{–}30$)
Extra stability of **half-filled ($3d^5$)** and **completely filled ($3d^{10}$)** subshells causes two key anomalies:
- **Chromium ($_{24}\\text{Cr}$)**: $[\\text{Ar}]\\,3d^5\\,4s^1$ *(NOT $3d^4\\,4s^2$)*
- **Copper ($_{29}\\text{Cu}$)**: $[\\text{Ar}]\\,3d^{10}\\,4s^1$ *(NOT $3d^9\\,4s^2$)*
- **Cation Ionization Rule**: When transition metals form cations (e.g., $\\text{Fe}^{2+}$), **$4s$ electrons are removed BEFORE $3d$ electrons**: $\\text{Fe}^{2+} = [\\text{Ar}]\\,3d^6$.`,
  },
  {
    id: 'note-phys-dimensions',
    title: 'Physics: Dimensions & Dimensional Analysis',
    subject: 'physics',
    grade: 'SHS1',
    tags: ['Physics', 'Dimensions', 'Dimensional Analysis', 'Homogeneity'],
    updatedAt: '2026-11-16T15:30:00Z',
    createdAt: '2026-11-16T15:00:00Z',
    content: `# Dimensions & Dimensional Analysis (GES SHS 1–3 Physics)

## 1. Fundamental and Derived Quantities
In physics, all measurable physical quantities fall into two categories:
- **Fundamental (Base) Quantities**: Independent quantities that cannot be defined in terms of other physical quantities. In mechanics, the three base dimensions are **Mass ($M$)**, **Length ($L$)**, and **Time ($T$)**. In thermodynamics and electromagnetism, **Electric Current ($I$)** and **Thermodynamic Temperature ($\\Theta$)** are also included.
- **Derived Quantities**: Quantities formed by multiplying, dividing, or combining fundamental quantities (e.g., Velocity, Acceleration, Force, Work, Power, and Pressure).

## 2. Dimensional Formula and Notation
The **dimensions** of a physical quantity are the powers (exponents) to which the fundamental base quantities ($M, L, T$) must be raised to represent that quantity. Dimensional notation is enclosed in square brackets $[X]$:
$$[X] = [M^a L^b T^c]$$
where $a, b,$ and $c$ are integers or fractions representing the exponents of Mass, Length, and Time respectively.

### Exhaustive Table of Physical Quantities & Dimensions
| Physical Quantity | Defining Equation / Formula | SI Unit | Dimensional Formula |
| --- | --- | --- | --- |
| Displacement / Radius / Height | Length from origin | $\\text{m}$ | $[M^0 L^1 T^0]$ or $[L]$ |
| Velocity / Speed | $\\text{Displacement} / \\text{Time}$ | $\\text{m s}^{-1}$ | $[M^0 L^1 T^{-1}]$ |
| Acceleration | $\\text{Change in Velocity} / \\text{Time}$ | $\\text{m s}^{-2}$ | $[M^0 L^1 T^{-2}]$ |
| Force / Tension / Weight | $\\text{Mass} \\times \\text{Acceleration}$ | $\\text{kg m s}^{-2}\\text{ (N)}$ | $[M^1 L^1 T^{-2}]$ |
| Momentum | $\\text{Mass} \\times \\text{Velocity}$ | $\\text{kg m s}^{-1}$ | $[M^1 L^1 T^{-1}]$ |
| Work / Energy / Heat / Torque | $\\text{Force} \\times \\text{Displacement}$ | $\\text{kg m}^2\\text{s}^{-2}\\text{ (J)}$ | $[M^1 L^2 T^{-2}]$ |
| Power | $\\text{Work} / \\text{Time}$ | $\\text{J s}^{-1}\\text{ (W)}$ | $[M^1 L^2 T^{-3}]$ |
| Pressure / Stress | $\\text{Force} / \\text{Area}$ | $\\text{N m}^{-2}\\text{ (Pa)}$ | $[M^1 L^{-1} T^{-2}]$ |
| Density | $\\text{Mass} / \\text{Volume}$ | $\\text{kg m}^{-3}$ | $[M^1 L^{-3} T^0]$ |
| Frequency | $1 / \\text{Period}$ | $\\text{s}^{-1}\\text{ (Hz)}$ | $[M^0 L^0 T^{-1}]$ |
| Impulse | $\\text{Force} \\times \\text{Time}$ | $\\text{N s}$ | $[M^1 L^1 T^{-1}]$ |
| Surface Tension | $\\text{Force} / \\text{Length}$ | $\\text{N m}^{-1}$ | $[M^1 L^0 T^{-2}]$ |
| Coefficient of Viscosity ($\\eta$) | $\\frac{\\text{Force}}{\\text{Area} \\times \\text{Velocity Gradient}}$ | $\\text{Pa s}$ or $\\text{kg m}^{-1}\\text{s}^{-1}$ | $[M^1 L^{-1} T^{-1}]$ |
| Gravitational Constant ($G$) | $\\frac{\\text{Force} \\times \\text{Distance}^2}{\\text{Mass}_1 \\times \\text{Mass}_2}$ | $\\text{N m}^2\\text{ kg}^{-2}$ | $[M^{-1} L^3 T^{-2}]$ |

## 3. The Principle of Homogeneity of Dimensions
An equation is dimensionally valid **if and only if** every additive term on the left-hand side (LHS) has the exact same dimensions as every term on the right-hand side (RHS).
- **Core Rule**: Only physical quantities with identical dimensions can be added, subtracted, or equated (you cannot add velocity to mass).

### Example Proof: $s = ut + \\frac{1}{2}at^2$
- **LHS ($s$ — Displacement)**: $[L]$
- **First RHS Term ($ut$)**: $[u][t] = [L T^{-1}][T] = [L]$
- **Second RHS Term ($\\frac{1}{2}at^2$)**: $\\left[\\frac{1}{2}\\right][a][t^2] = [1][L T^{-2}][T^2] = [L]$
$$[s] = [ut] = \\left[\\frac{1}{2}at^2\\right] = [L]$$
Since every term reduces to $[L]$ (and $\\frac{1}{2}$ is dimensionless), the equation is dimensionally homogeneous.

## 4. The Four Major Uses of Dimensional Analysis
### Use 1: Checking Dimensional Correctness of an Equation
Verify Stokes' Law for viscous drag force: $F = 6\\pi \\eta r v$
- **LHS**: $[F] = [M L T^{-2}]$
- **RHS**: $[6\\pi] = [1]$, $[\\eta] = [M L^{-1} T^{-1}]$, $[r] = [L]$, $[v] = [L T^{-1}]$
$$\\text{RHS} = [M L^{-1} T^{-1}] \\cdot [L] \\cdot [L T^{-1}] = [M L T^{-2}] = \\text{LHS}$$

### Use 2: Deriving Physical Relationships
Derive centripetal force $F$ assuming it depends on mass $m$, speed $v$, and radius $r$: $F = k\\,m^x v^y r^z$.
$$[M^1 L^1 T^{-2}] = [M]^x [L T^{-1}]^y [L]^z = [M^x L^{y+z} T^{-y}]$$
- Equating exponents: $x = 1$, $-y = -2 \\implies y = 2$, and $y + z = 1 \\implies z = -1$.
$$F = k\\,m^1 v^2 r^{-1} = \\frac{k m v^2}{r} \\quad (k = 1 \\text{ experimentally})$$

### Use 3: Converting Units Between Systems (SI $\\leftrightarrow$ CGS)
Using $n_2 = n_1 \\left(\\frac{M_1}{M_2}\\right)^a \\left(\\frac{L_1}{L_2}\\right)^b \\left(\\frac{T_1}{T_2}\\right)^c$, convert $1\\text{ N}$ into dynes ($[F] = [M^1 L^1 T^{-2}]$):
$$n_2 = 1 \\times \\left(\\frac{1000\\text{ g}}{1\\text{ g}}\\right)^1 \\left(\\frac{100\\text{ cm}}{1\\text{ cm}}\\right)^1 \\left(\\frac{1\\text{ s}}{1\\text{ s}}\\right)^{-2} = 10^5\\text{ dynes}$$

### Use 4: Determining Dimensions of Unknown Constants
Find the dimensions and SI unit of Planck's constant $h$ from $E = hf \\implies h = \\frac{E}{f}$:
$$[h] = \\frac{[M L^2 T^{-2}]}{[T^{-1}]} = [M L^2 T^{-1}] \\quad (\\text{SI Unit: kg m}^2\\text{s}^{-1} \\text{ or J s})$$

## 5. Limitations of Dimensional Analysis
- **Dimensionless Constants**: Cannot determine numerical factors such as $k, \\pi, 2,$ or $\\frac{1}{2}$.
- **Trig, Log & Exponential Functions**: Cannot derive formulas containing $\\sin\\theta, \\cos\\theta, \\ln x,$ or $e^x$ because their arguments and outputs are dimensionless.
- **Multi-Term Equations**: Cannot derive equations containing sums or differences of multiple dimensional terms (like $s = ut + \\frac{1}{2}at^2$) without extra physical assumptions.`,
  },
  {
    id: 'note-phys-kinematics',
    title: 'Projectile Motion & SUVAT Master Formulas',
    subject: 'physics',
    grade: 'SHS1',
    tags: ['Kinematics', 'Formulas', 'Paper 2'],
    updatedAt: '2026-11-15T14:20:00Z',
    createdAt: '2026-11-12T09:00:00Z',
    content: `# Projectile Motion Master Sheet

## Horizontal & Vertical Independence
For a projectile launched at speed $u$ and angle $\\theta$:
$$u_x = u\\cos\\theta, \\qquad u_y = u\\sin\\theta$$

## Key WASSCE Derivations
- **Time of Flight**: $T = \\frac{2u\\sin\\theta}{g}$
- **Maximum Height**: $H = \\frac{u^2\\sin^2\\theta}{2g}$
- **Horizontal Range**: $R = \\frac{u^2\\sin(2\\theta)}{g}$

Remember that maximum horizontal range on level ground occurs at $\\theta = 45^\\circ$, and complementary angles ($30^\\circ$ and $60^\\circ$) produce identical ranges.`,
  },
  {
    id: 'note-chem-titration',
    title: 'Volumetric Titration & Indicator Selection',
    subject: 'chemistry',
    grade: 'SHS2',
    tags: ['Titration', 'Paper 3', 'Stoichiometry'],
    updatedAt: '2026-11-14T18:10:00Z',
    createdAt: '2026-11-10T11:30:00Z',
    content: `# Acid-Base Titration Revision

## Stoichiometric Formula
$$\\frac{C_a V_a}{C_b V_b} = \\frac{n_a}{n_b}$$

## Indicator Choice Matrix
- **Strong Acid + Strong Base**: Methyl orange or Phenolphthalein ($\\text{pH } 7$ equivalence)
- **Strong Acid + Weak Base** (e.g., $\\text{HCl} + \\text{Na}_2\\text{CO}_3$): **Methyl Orange** (yellow to orange/pink, $\\text{pH } 3.1 - 4.4$)
- **Weak Acid + Strong Base** (e.g., $\\text{CH}_3\\text{COOH} + \\text{NaOH}$): **Phenolphthalein** (colorless to pale pink, $\\text{pH } 8.2 - 10.0$)`,
  },
  {
    id: 'note-ict-sql-python',
    title: 'ICT Paper 2: SQL & Python Quick Reference',
    subject: 'ict',
    grade: 'SHS3',
    tags: ['SQL', 'Python', 'Databases'],
    updatedAt: '2026-11-16T08:45:00Z',
    createdAt: '2026-11-11T16:00:00Z',
    content: `# SQL & Python Exam Patterns

## Relational SQL Query Structure
\`\`\`sql
SELECT StudentID, FullName, AVG(Score) AS MeanScore
FROM ExaminationScores
WHERE Subject = 'ICT'
GROUP BY StudentID, FullName
HAVING AVG(Score) >= 75
ORDER BY MeanScore DESC;
\`\`\`

## Python Linear Search
\`\`\`python
def find_student(names, target):
    for index in range(len(names)):
        if names[index] == target:
            return index
    return -1
\`\`\``,
  },
  {
    id: 'note-math-calculus',
    title: 'Differential & Integral Calculus Rules',
    subject: 'addmaths',
    grade: 'SHS3',
    tags: ['Calculus', 'Formulas'],
    updatedAt: '2026-11-13T10:15:00Z',
    createdAt: '2026-11-09T10:15:00Z',
    content: `# Calculus Quick Sheet

## Differentiation Rules
- **Product Rule**: $\\frac{d}{dx}(uv) = u\\frac{dv}{dx} + v\\frac{du}{dx}$
- **Quotient Rule**: $\\frac{d}{dx}\\left(\\frac{u}{v}\\right) = \\frac{v\\frac{du}{dx} - u\\frac{dv}{dx}}{v^2}$

## Volume of Revolution (x-axis)
$$V = \\pi \\int_a^b y^2\\,dx$$`,
  },
];

export const INITIAL_ATTEMPTS: ExamAttempt[] = [
  {
    id: 'seed-att-1',
    timestamp: '2026-11-11T15:30:00Z',
    subject: 'physics',
    gradeFilter: 'SHS1',
    paperType: 'mcq',
    mode: 'study',
    topicTitles: ['Kinematics & Projectile Motion'],
    totalQuestions: 5,
    score: 3,
    maxScore: 5,
    percentage: 60,
    durationSeconds: 240,
  },
  {
    id: 'seed-att-2',
    subject: 'chemistry',
    timestamp: '2026-11-13T17:10:00Z',
    gradeFilter: 'SHS2',
    paperType: 'mcq',
    mode: 'exam',
    topicTitles: ['Rates of Reaction & Chemical Equilibrium', 'Acids, Bases, pH & Solubility Equilibria'],
    totalQuestions: 5,
    score: 4,
    maxScore: 5,
    percentage: 80,
    durationSeconds: 290,
  },
  {
    id: 'seed-att-3',
    timestamp: '2026-11-14T19:00:00Z',
    subject: 'biology',
    gradeFilter: 'SHS3',
    paperType: 'mcq',
    mode: 'study',
    topicTitles: ['Mendelian Genetics, Linkage & DNA Replication'],
    totalQuestions: 5,
    score: 4,
    maxScore: 5,
    percentage: 80,
    durationSeconds: 210,
  },
  {
    id: 'seed-att-4',
    timestamp: '2026-11-15T16:45:00Z',
    subject: 'addmaths',
    gradeFilter: 'SHS2',
    paperType: 'mcq',
    mode: 'exam',
    topicTitles: ['Coordinate Geometry: Lines & Circles', 'Trigonometric Identities & Equations'],
    totalQuestions: 5,
    score: 3,
    maxScore: 5,
    percentage: 60,
    durationSeconds: 360,
  },
  {
    id: 'seed-att-5',
    timestamp: '2026-11-16T09:15:00Z',
    subject: 'ict',
    gradeFilter: 'SHS3',
    paperType: 'mcq',
    mode: 'study',
    topicTitles: ['Relational Databases, Normalization & SQL', 'Algorithms, Flowcharts & Python Programming'],
    totalQuestions: 5,
    score: 5,
    maxScore: 5,
    percentage: 100,
    durationSeconds: 195,
  },
];

export const INITIAL_MISTAKES: MistakeEntry[] = [
  {
    questionId: 'phys-q3',
    subject: 'physics',
    grade: 'SHS1',
    topicId: 'phys-s1-kinematics',
    wrongCount: 1,
    lastMissedAt: '2026-11-11T15:30:00Z',
    lastSelectedIndex: 2,
    mastered: false,
  },
  {
    questionId: 'math-q7',
    subject: 'addmaths',
    grade: 'SHS2',
    topicId: 'math-s2-trig',
    wrongCount: 1,
    lastMissedAt: '2026-11-15T16:45:00Z',
    lastSelectedIndex: 1,
    mastered: false,
  },
];

export const INITIAL_STREAK: StreakData = {
  currentStreak: 4,
  longestStreak: 5,
  lastActiveDate: getOffsetLocalDateKey(-1),
  questionsSolvedToday: 0,
  totalStudyMinutes: 85,
};
