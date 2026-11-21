import type { StudyNote } from '../../types';

const CREATED_AT = '2026-02-01T08:00:00.000Z';

/**
 * Complete additions & intuitive Math-Antics style breakdowns audited directly
 * against GES_SHS_1-3_Complete_Master_Study_Guide across all 8 PDF subjects
 * (Physics, English Language, Core Mathematics, Additional Mathematics,
 * Chemistry, Biology, Social Studies, and ICT) strictly separated by SHS 1–3.
 */
export const MASTER_GUIDE_ADDITION_NOTES: StudyNote[] = [
  // =========================================================================
  // PART 1: PHYSICS (SHS 1–3)
  // =========================================================================
  {
    id: 'note-mg-phys-s1-units-thermometry',
    topicId: 'phys-s1-measurement',
    isBuiltIn: true,
    title: '7 SI Base Quantities, SUVAT v² = u² + 2as Derivation & Thermometry Scales',
    subject: 'physics',
    grade: 'SHS1',
    tags: ['SHS1', 'Physics', 'SI Units', 'Candela', 'SUVAT', 'Thermometry'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# 7 SI Base Quantities, SUVAT Derivation & Thermometry (SHS 1)

## 1. The Big Idea: Why 7 Base Units Rules Everything
Think of the **7 SI Base Quantities** as the primary LEGO bricks of the universe. Every complex measurement—force, voltage, pressure, brightness—is built by snapping these seven bricks together.

| Fundamental Quantity | SI Unit Name | Symbol | Dimension |
| :--- | :--- | :--- | :--- |
| Length | metre | $\\text{m}$ | $[L]$ |
| Mass | kilogram | $\\text{kg}$ | $[M]$ |
| Time | second | $\\text{s}$ | $[T]$ |
| Electric Current | ampere | $\\text{A}$ | $[I]$ |
| Thermodynamic Temperature | kelvin | $\\text{K}$ | $[\\Theta]$ |
| Amount of Substance | mole | $\\text{mol}$ | $[N]$ |
| Luminous Intensity | candela | $\\text{cd}$ | $[J]$ |

- **Random vs Systematic Errors**: Random errors scatter readings unpredictably up and down (reduce by repeating and averaging). Systematic errors push every reading in one fixed direction (e.g., parallax or instrument zero error on a **vernier caliper** $0.01\\text{ cm}$ or **micrometer screw gauge** $0.001\\text{ cm}$).
$$\\text{Corrected Reading} = \\text{Observed Reading} - \\text{Zero Error}$$

## 2. Step-by-Step Derivation of $v^2 = u^2 + 2as$
Notice how SUVAT's third equation simply eliminates time $t$ by mixing the first and fourth equations!
1. Start with velocity-time relation: $v = u + at \\implies t = \\frac{v - u}{a}$.
2. Recall average-velocity displacement: $s = \\frac{1}{2}(u + v)t$.
3. Substitute $t = \\frac{v - u}{a}$ into displacement:
$$s = \\frac{1}{2}(u + v)\\left(\\frac{v - u}{a}\\right) = \\frac{v^2 - u^2}{2a}$$
4. Multiply both sides by $2a$ and rearrange:
$$v^2 = u^2 + 2as$$
- **Graph Golden Rules**: Gradient of $s\\text{–}t$ graph = velocity; gradient of $v\\text{–}t$ graph = acceleration; area under $v\\text{–}t$ graph = displacement.

## 3. Thermometry & Four Thermometric Properties
Temperature measures **average particle kinetic energy** and dictates heat flow direction; heat is thermal energy transferred due to a temperature difference.
- **Four Regular Thermometric Properties**:
  1. Thermal expansion of a liquid column (mercury/alcohol-in-glass thermometer).
  2. Electrical resistance of a pure metal wire (platinum resistance thermometer).
  3. Thermoelectric EMF across two dissimilar metal junctions (thermocouple).
  4. Pressure of a fixed mass of gas at constant volume (constant-volume gas thermometer).
$$T(\\text{K}) = \\theta(^\\circ\\text{C}) + 273.15, \\qquad T(^\\circ\\text{F}) = \\frac{9}{5}\\theta(^\\circ\\text{C}) + 32$$`,
  },
  {
    id: 'note-mg-phys-s1-optics-fibers',
    topicId: 'phys-s1-kinematics',
    isBuiltIn: true,
    title: 'Plane & Inclined Mirrors, Cartesian Formula & Fiber Optics (TIR)',
    subject: 'physics',
    grade: 'SHS1',
    tags: ['SHS1', 'Physics', 'Mirrors', 'Snell Law', 'Optical Fibers', 'TIR'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Reflection, Refraction, Inclined Mirrors & Optical Fibers (SHS 1)

## 1. Plane Mirrors & Inclined Mirror Multiple Images
- **Laws of Reflection**: Incident ray, reflected ray, and normal lie in the same plane, and $\\theta_i = \\theta_r$.
- **Plane Mirror Image Traits**: Always **virtual**, **upright**, **laterally inverted**, same size as object, and as far behind the mirror as the object is in front.
- **Inclined Mirrors Formula**: When two plane mirrors meet at angle $\\theta$ (in degrees), the number of images formed is approximately:
$$N = \\frac{360^\\circ}{\\theta} - 1$$
  - Example: At $\\theta = 60^\\circ$, $N = \\frac{360^\\circ}{60^\\circ} - 1 = 5$ images (like a kaleidoscope!).

## 2. Spherical Mirror Equation & Cartesian Sign Convention
For spherical mirrors with radius of curvature $R = 2f$:
$$\\frac{1}{f} = \\frac{1}{u} + \\frac{1}{v}, \\qquad m = \\frac{h_i}{h_o} = -\\frac{v}{u}$$
- Remember: $u$ is object distance, $v$ is image distance, and $f$ is focal length. Real images ($v > 0$) are inverted ($m < 0$).

## 3. Snell's Law, Real/Apparent Depth & Optical Fibers
$$n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2, \\qquad n = \\frac{c}{v} = \\frac{\\text{Real Depth}}{\\text{Apparent Depth}}$$
- **Critical Angle ($c$)** from an optically denser medium ($n_1$) to a rarer medium ($n_2$, where $n_1 > n_2$):
$$\\sin c = \\frac{n_2}{n_1}$$
- **Total Internal Reflection (TIR) in Optical Fibers**: Light entering a high-index glass core strikes the lower-index cladding at an angle greater than the critical angle ($\\theta_i > c$), bouncing cleanly down miles of fiber optic internet cable with almost zero signal loss!`,
  },
  {
    id: 'note-mg-phys-s2-instruments-bjt',
    topicId: 'phys-s2-optics',
    isBuiltIn: true,
    title: 'Optical Instruments (Microscopes & Telescopes), Polarization & BJT Transistors',
    subject: 'physics',
    grade: 'SHS2',
    tags: ['SHS2', 'Physics', 'Microscope', 'Telescope', 'Polarization', 'BJT', 'Waves'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Optical Instruments, Wave Polarization & BJT Transistors (SHS 2)

## 1. Thin Lenses & Compound Optical Instruments
- **Converging (Convex) Lenses** have positive focal length ($+f$) and bend parallel rays to a real focus; **Diverging (Concave) Lenses** have negative focal length ($-f$).
- **Two-Lens Teamwork**:
  - **Compound Microscope**: Pairs a short-focal-length objective lens (forming a magnified real inverted intermediate image) with an eyepiece lens acting as a simple magnifier for huge angular magnification of tiny cells.
  - **Astronomical Telescope**: Pairs a long-focal-length objective lens (gathering parallel starlight) with a short-focal-length eyepiece lens; in normal adjustment, $M = \\frac{f_o}{f_e}$ and tube length $L = f_o + f_e$.

## 2. Five Wave Behaviors & Why Polarization Proves Light is Transverse
$$v = f\\lambda, \\qquad T = \\frac{1}{f}$$
- All waves undergo **reflection**, **refraction**, **diffraction**, and **interference**, **EXCEPT Polarization**, which happens **ONLY in transverse waves** (oscillations perpendicular to travel, e.g., light) and **NEVER** in longitudinal sound waves!
- **Standing Waves on a String** of length $L$ fixed at both ends:
$$\\lambda_n = \\frac{2L}{n}, \\qquad f_n = \\frac{nv}{2L} \\quad (n = 1, 2, 3\\dots)$$
- **Speed of Sound Ranking**: $\\text{Solids (fastest)} > \\text{Liquids} > \\text{Gases (slowest)}$ because closely packed stiff bonds transmit vibrations faster.

## 3. Bipolar Junction Transistors (NPN / PNP)
Think of a **BJT transistor** as an electronic water valve: a tiny trickle of Base current ($I_B$) unlocks a huge Collector current ($I_C$), combining at the Emitter:
$$I_E = I_B + I_C$$
- **Two Core WASSCE Roles**: Works as an **electronic switch** (cut-off vs saturation in digital logic) or a **current/signal amplifier** (small base changes produce large collector swings).`,
  },
  {
    id: 'note-mg-phys-s3-satellites-conduction-transformers',
    topicId: 'phys-s3-electromagnetism',
    isBuiltIn: true,
    title: 'Satellite Orbits (Kepler T²), Heat Conduction & Transformer Loss Engineering',
    subject: 'physics',
    grade: 'SHS3',
    tags: ['SHS3', 'Physics', 'Satellites', 'Conduction', 'Transformers', 'Eddy Currents'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Circular Satellite Orbits, Steady-State Conduction & Transformer Losses (SHS 3)

## 1. Satellite Orbital Speed & Kepler's Third Law
Gravity supplies the exact centripetal force keeping a satellite of mass $m$ in a circular orbit of radius $r$ around planet mass $M$:
$$\\frac{GMm}{r^2} = \\frac{mv^2}{r} \\implies v_{\\text{orb}} = \\sqrt{\\frac{GM}{r}}$$
Substituting $v_{\\text{orb}} = \\frac{2\\pi r}{T}$ yields Kepler's orbital period law:
$$T^2 = \\frac{4\\pi^2 r^3}{GM}$$
Notice satellite mass $m$ cancels out completely—the International Space Station and a dropped wrench at the same altitude orbit at the exact same speed!

## 2. Steady-State Thermal Conduction, Black Bodies & EM Spectrum
- **Thermal Conduction Rate** through a slab of thermal conductivity $k$, area $A$, thickness $d$, and temperature gap $(T_1 - T_2)$:
$$\\frac{Q}{t} = \\frac{kA(T_1 - T_2)}{d}$$
- **Convection** carries heat via fluid buoyancy/density currents; **Radiation** transmits infrared EM waves through vacuum (**black bodies** are ideal absorbers and emitters).
- **Electromagnetic Spectrum (Longest $\\lambda$ $\\to$ Shortest $\\lambda$)**: Radio $\\to$ Microwaves $\\to$ Infrared $\\to$ Visible $\\to$ Ultraviolet $\\to$ X-rays $\\to$ Gamma rays (all travel at $c \\approx 3.0 \\times 10^8\\text{ m s}^{-1}$ in vacuum).

## 3. Four Transformer Energy Losses & Engineering Fixes
For an ideal transformer, $\\frac{V_s}{V_p} = \\frac{N_s}{N_p} = \\frac{I_p}{I_s}$. Real transformers suffer **four energy losses**:
1. **Winding Resistance (Copper/$I^2 R$) Loss**: Reduced using thick, low-resistance copper wire coils.
2. **Eddy Current Loss**: Swirling currents induced inside the solid iron core waste heat—minimized by **laminating** the core into thin insulated sheets.
3. **Hysteresis Loss**: Energy wasted flipping magnetic domains 50 times a second—minimized by using a **soft-iron core** that magnetizes and demagnetizes easily.
4. **Flux Leakage**: Magnetic field lines escaping the core—minimized by winding primary and secondary coils closely on the same closed core.`,
  },
  {
    id: 'note-mg-phys-s3-nuclear-logic',
    topicId: 'phys-s3-nuclear',
    isBuiltIn: true,
    title: 'Nuclear Binding Energy (1 u = 931.5 MeV), Decay Kinetics & Logic Gates Truth Table',
    subject: 'physics',
    grade: 'SHS3',
    tags: ['SHS3', 'Physics', 'Nuclear Physics', 'Binding Energy', 'Logic Gates', 'NAND', 'NOR'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Nuclear Binding Energy, Radioactive Decay & Digital Logic Gates (SHS 3)

## 1. Mass Defect & Nuclear Binding Energy
When protons and neutrons lock into a nucleus $^A_Z X$, the assembled nucleus actually weighs slightly **less** than its separate parts! That missing mass $\\Delta m$ turned into pure **Binding Energy**:
$$E_b = \\Delta m\\,c^2, \\qquad 1\\text{ u} \\approx 931.5\\text{ MeV}/c^2$$
- **Alpha Decay ($^4_2\\text{He}$)**: Mass number $A$ drops by $4$, proton number $Z$ drops by $2$.
- **Beta-Minus Decay ($^0_{-1}e$)**: A neutron turns into a proton—$Z$ increases by $1$ while $A$ stays constant.
- **Gamma Emission ($\\gamma$)**: High-energy photon released; neither $A$ nor $Z$ changes.

## 2. Exponential Decay & Activity Laws
$$N(t) = N_0 e^{-\\lambda t}, \\qquad A = \\lambda N, \\qquad t_{1/2} = \\frac{\\ln 2}{\\lambda} \\approx \\frac{0.693}{\\lambda}$$
- **Nuclear Fission** splits heavy nuclei (e.g., $^{235}\\text{U}$); **Nuclear Fusion** merges light nuclei (hydrogen into helium inside stars).

## 3. Master Digital Logic Gates Truth Table (NOT, AND, OR, NAND, NOR)
Every microchip runs on binary $0$ (LOW) and $1$ (HIGH) using these five essential gates:

| Input A | Input B | NOT A | AND ($A\\cdot B$) | OR ($A+B$) | NAND ($\\overline{A\\cdot B}$) | NOR ($\\overline{A+B}$) |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| $0$ | $0$ | $1$ | $0$ | $0$ | $1$ | $1$ |
| $0$ | $1$ | $1$ | $0$ | $1$ | $1$ | $0$ |
| $1$ | $0$ | $0$ | $0$ | $1$ | $1$ | $0$ |
| $1$ | $1$ | $0$ | $1$ | $1$ | $0$ | $0$ |

- **Shortcut Memory Trick**: **NAND** is just **AND** flipped upside down (only $0$ when BOTH inputs are $1$). **NOR** is **OR** flipped upside down (only $1$ when BOTH inputs are $0$).`,
  },

  // =========================================================================
  // PART 2: ENGLISH LANGUAGE (SHS 1–3)
  // =========================================================================
  {
    id: 'note-mg-eng-s1-letters-grammar',
    topicId: 'english-s1-concord',
    isBuiltIn: true,
    title: 'Informal Letters, Word Subclasses & Intervening Phrase Concord',
    subject: 'english',
    grade: 'SHS1',
    tags: ['SHS1', 'English', 'Informal Letter', 'Concord', 'Parts of Speech'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Informal Letters, Word Subclasses & Concord Traps (SHS 1)

## 1. Nouns, Pronouns & Verbs Precision Check
- **Nouns**: Countable (*books*) vs uncountable (*information*, *furniture* — never add *-s*!), concrete vs abstract (*courage*), collective (*committee*).
- **Pronouns**: Personal (*they*), relative (*who, which, that*), demonstrative (*those*), indefinite (*everyone, somebody* — always singular!), reflexive (*herself*).
- **Verbs**: Transitive (takes an object: *She kicked the ball*) vs intransitive (*He slept*), finite (shows tense/number) vs non-finite (*to run, running*), and modal auxiliaries (*must, might, should*).

## 2. The "Intervening Phrase" Concord Trap
In WASSCE Paper 1, examiners insert a long phrase between the head subject and the verb to trick your ear:
- Intervening expressions like **along with**, **as well as**, **together with**, **accompanied by**, and **in addition to** **DO NOT** make a singular subject plural!
  - **Correct**: *The headmaster, **along with** the science teachers, **is** attending the assembly.*
  - Think mentally by crossing out the bracketed phrase: *The headmaster ... **is** attending.*

## 3. WASSCE Informal Letter Format Checklist
Informal letters are written to friends, siblings, parents, or close relatives:
1. **Writer's Address & Date**: Top-right corner ONLY (no recipient address!).
2. **Salutation**: Warm and direct — e.g., \`Dear Kwame,\` or \`Dear Sister Ama,\`.
3. **Tone & Style**: Conversational, friendly, contracted forms allowed (*I've*, *won't*), vivid narrative/sensory details, and clean paragraph unity.
4. **Complimentary Close**: \`Yours sincerely,\` followed by your **first name only** (e.g., \`Kofi\`).`,
  },
  {
    id: 'note-mg-eng-s2-conditionals-summary-letters',
    topicId: 'english-s2-formalwriting',
    isBuiltIn: true,
    title: 'Conditional Sentences (Types 0–3), Summary Discipline & Semi-Formal Letters',
    subject: 'english',
    grade: 'SHS2',
    tags: ['SHS2', 'English', 'Conditionals', 'Summary Writing', 'Semi-Formal Letter'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Conditionals (Types 0–3), Summary Rules & Formal/Semi-Formal Letters (SHS 2)

## 1. The Four Conditional Structures (Zero Error Pattern)
| Type | Meaning & Probability | Exact Grammatical Pattern | Example |
| :--- | :--- | :--- | :--- |
| **Type 0** | Scientific / universal truth | $\\text{If} + \\text{Present Simple},\\; \\text{Present Simple}$ | If water reaches $100^\\circ\\text{C}$, it boils. |
| **Type 1** | Likely / real future event | $\\text{If} + \\text{Present Simple},\\; \\text{will} + \\text{base verb}$ | If she studies hard, she will pass. |
| **Type 2** | Unreal / hypothetical present | $\\text{If} + \\text{Past Simple},\\; \\text{would} + \\text{base verb}$ | If I were you, I would check the units. |
| **Type 3** | Impossible past regret | $\\text{If} + \\text{Past Perfect},\\; \\text{would have} + \\text{past participle}$ | If he had revised, he would have passed. |

- **Modifier Traps**: Never leave a participle dangling! Incorrect: *Walking down the street, the school bell rang.* Correct: *Walking down the street, **we heard** the school bell ring.*

## 2. WASSCE Summary Writing Golden Discipline
Summary marks are won by precision and ruthlessly cutting fluff:
- **Zero Verbatim Lifting**: Rephrase ideas cleanly in your own concise words instead of copying whole chunks of the passage.
- **Complete Grammatical Sentences**: Every answer point must be a full sentence starting with a capital letter and ending with a period (unless the prompt specifies a preamble).
- **Zero Illustrations or Repetition**: Strip out examples, statistics, metaphors, and introductory preambles (*"According to the passage..."* wastes words and earns zero marks).

## 3. Formal vs Semi-Formal Letter Blueprint
- **Formal Letter** (officials, editors, principals): **Two addresses** (sender top-right, recipient top-left below date), \`Dear Sir/Madam,\`, **underlined or UPPERCASE Subject Heading**, objective formal register (no slang/contractions), and \`Yours faithfully,\` + signature + full name.
- **Semi-Formal Letter** (family elders, adult acquaintances, teachers): **One address** (sender top-right + date), polite salutation \`Dear Mr. Mensah,\` or \`Dear Aunt Akua,\`, respectful warm tone, and \`Yours sincerely,\` + full name.`,
  },
  {
    id: 'note-mg-eng-s3-devices-tags-reports',
    topicId: 'english-s3-literature',
    isBuiltIn: true,
    title: 'Figurative Devices (Litotes & Euphemism), Question Tags & Investigative Reports',
    subject: 'english',
    grade: 'SHS3',
    tags: ['SHS3', 'English', 'Litotes', 'Euphemism', 'Question Tags', 'Reports'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Rhetorical Devices, Question Tags & Formal Reports (SHS 3)

## 1. High-Yield Figurative & Rhetorical Devices
- **Simile / Metaphor**: Direct comparison using *like/as* (simile) vs implied identity (metaphor).
- **Personification**: Giving human actions/emotions to inanimate objects or ideas (*Justice wept*).
- **Irony vs Sarcasm**: **Irony** highlights a stark contrast between appearance and reality (verbal, situational, dramatic); **sarcasm** uses sharp mocking praise meant to wound.
- **Hyperbole**: Deliberate exaggeration for emphasis (*I waited an eternity*).
- **Euphemism**: Polite, gentle phrasing substituting for harsh or taboo reality (*passed away* instead of *died*).
- **Litotes**: Intentional understatement using a **double negative** to affirm a strong positive (*She is **no ordinary** sprinter* = she is extraordinary; *not bad* = very good).
- **Alliteration**: Repetition of initial consonant sounds in neighboring words (*bold boys bounded*).

## 2. Question Tag Polarity Rule
Remember the battery polarity rule—opposites attract!
- **Positive Statement $\\to$ Negative Tag**: *Kofi **won** the debate, **didn't he**?*
- **Negative Statement $\\to$ Positive Tag** (watch words like *seldom, hardly, rarely, never* which count as negative!): *They **seldom** arrive late, **do they**?*

## 3. Report Writing & Comprehension Function Mastery
- **Investigative Report Structure**: Title, **Terms of Reference** (who commissioned it and why), **Procedure/Methodology**, **Findings** (numbered factual discoveries), **Conclusions**, and **Recommendations**, signed with designation and date.
- **Comprehension Word Substitution Rule**: Your replacement word or phrase MUST match the exact **part of speech** and tense/plurality of the underlined word in context!`,
  },

  // =========================================================================
  // PART 3: CORE MATHEMATICS (SHS 1–3)
  // =========================================================================
  {
    id: 'note-mg-coremath-s1-financial-venn',
    topicId: 'coremath-s1-sets',
    isBuiltIn: true,
    title: 'Compound Interest A = P(1 + r/100)^n, Variation & 3-Set Venn Diagrams',
    subject: 'coremath',
    grade: 'SHS1',
    tags: ['SHS1', 'Core Maths', 'Compound Interest', 'Variation', 'Venn Diagram'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Financial Maths (Compound Interest), Variation & 3-Set Venn Diagrams (SHS 1)

## 1. Simple Interest vs Compound Interest
- **Simple Interest ($I$)**: Earned only on the original principal $P$:
$$I = \\frac{PRT}{100}, \\qquad A = P + I$$
- **Compound Interest**: Interest earns new interest each year! Amount $A$ after $n$ years at annual rate $r\\%$:
$$A = P\\left(1 + \\frac{r}{100}\\right)^n, \\qquad \\text{Compound Interest} = A - P$$
  - *Quick Example*: Invest $\\text{GH₵}\\,2,000$ at $10\\%$ p.a. compound interest for $2$ years: $A = 2000(1.1)^2 = 2000(1.21) = \\text{GH₵}\\,2,420$ (interest $= \\text{GH₵}\\,420$).
- **Profit, Loss & Discount**: $\\%\\text{Profit} = \\frac{\\text{SP} - \\text{CP}}{\\text{CP}} \\times 100\\%$; Discount $= \\text{Marked Price} - \\text{Selling Price}$.

## 2. Direct & Inverse Variation
- **Direct Variation ($y \\propto x$)**: $y = kx$ (doubling $x$ doubles $y$).
- **Inverse Variation ($y \\propto \\frac{1}{x}$)**: $y = \\frac{k}{x}$ (doubling $x$ halves $y$; e.g., more workers take fewer days).

## 3. Two-Set & Three-Set Venn Diagrams
- **Two-Set Identity**: $n(A \\cup B) = n(A) + n(B) - n(A \\cap B)$.
- **Three-Set Strategy (Always Fill Inside-Out!)**:
  1. Start with the center triple intersection $n(A \\cap B \\cap C)$.
  2. Fill the three two-way overlaps by **subtracting** the center triple intersection from each pair total!
  3. Fill the "only A", "only B", and "only C" outer crescents, then check that all 8 regions sum to the Universal set $n(\\mathcal{U})$.`,
  },
  {
    id: 'note-mg-coremath-s2-polygons-bearings',
    topicId: 'coremath-s2-bearings',
    isBuiltIn: true,
    title: 'Polygon Interior Angles (n-2)×180°, SOH-CAH-TOA & Three-Figure Bearings',
    subject: 'coremath',
    grade: 'SHS2',
    tags: ['SHS2', 'Core Maths', 'Polygons', 'SOH-CAH-TOA', 'Bearings'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Polygons, Right-Angled Trigonometry & Three-Figure Bearings (SHS 2)

## 1. Regular & Irregular Polygon Angle Laws
Split any $n$-sided polygon from one vertex into $(n - 2)$ triangles! Since each triangle has $180^\\circ$:
$$\\text{Sum of Interior Angles} = (n - 2) \\times 180^\\circ$$
$$\\text{Sum of Exterior Angles (any convex polygon)} = 360^\\circ$$
- For a **regular polygon**: Each exterior angle $= \\frac{360^\\circ}{n}$, and $\\text{Interior} + \\text{Exterior} = 180^\\circ$.

## 2. SOH-CAH-TOA & Angles of Elevation / Depression
In a right-angled triangle relative to acute angle $\\theta$:
$$\\sin\\theta = \\frac{\\text{Opposite}}{\\text{Hypotenuse}}, \\qquad \\cos\\theta = \\frac{\\text{Adjacent}}{\\text{Hypotenuse}}, \\qquad \\tan\\theta = \\frac{\\text{Opposite}}{\\text{Adjacent}}$$
- By alternate interior angles between parallel horizontal sightlines: **Angle of Elevation** from A to B equals **Angle of Depression** from B to A!

## 3. Three-Figure Bearings ($000^\\circ\\text{–}360^\\circ$)
1. Always draw a North arrow directly at the **"FROM"** station.
2. Measure the angle **clockwise from North** using **three digits** (e.g., $045^\\circ$, not $45^\\circ$).
3. **Back-Bearing Rule**: If the bearing from $A$ to $B$ is $\\theta$, the return bearing from $B$ to $A$ is $\\theta + 180^\\circ$ (if $\\theta < 180^\\circ$) or $\\theta - 180^\\circ$ (if $\\theta \\ge 180^\\circ$).`,
  },
  {
    id: 'note-mg-coremath-s3-stats-enlargement',
    topicId: 'coremath-s3-statistics',
    isBuiltIn: true,
    title: 'Grouped Statistics, Interquartile Range (IQR), Probability & Enlargement Area Scaling (k²)',
    subject: 'coremath',
    grade: 'SHS3',
    tags: ['SHS3', 'Core Maths', 'IQR', 'Ogive', 'Enlargement', 'Probability'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Statistics (IQR & Ogives), Probability & Enlargement k² Scaling (SHS 3)

## 1. Grouped Mean, Quartiles & Interquartile Range (IQR)
- **Grouped Mean**: $\\bar{x} = \\frac{\\sum fx}{\\sum f}$ using class midpoints $x$.
- **Cumulative Frequency Curve (Ogive)**: Plot cumulative frequency against **upper class boundaries**:
  - **Lower Quartile ($Q_1$)**: Read $x$ at $25\\%$ of $\\sum f$.
  - **Median ($Q_2$)**: Read $x$ at $50\\%$ of $\\sum f$.
  - **Upper Quartile ($Q_3$)**: Read $x$ at $75\\%$ of $\\sum f$.
  - **Interquartile Range (IQR)**: Measures middle-$50\\%$ spread safely ignoring extreme outliers:
$$\\text{IQR} = Q_3 - Q_1, \\qquad \\text{Semi-IQR} = \\frac{Q_3 - Q_1}{2}$$

## 2. Probability Combination Rules
$$P(E) = \\frac{n(E)}{n(S)}$$
- **Mutually Exclusive Events** (cannot happen together): $P(A \\cup B) = P(A) + P(B)$.
- **Independent Events** (one doesn't affect the other): $P(A \\cap B) = P(A) \\cdot P(B)$.

## 3. Enlargement Transformation & Area Scaling ($k^2$)
Under an enlargement of linear scale factor $k$ about origin $(0,0)$, vector $\\begin{pmatrix} x \\\\ y \\end{pmatrix} \\mapsto \\begin{pmatrix} kx \\\\ ky \\end{pmatrix}$.
- **Crucial WASSCE Exam Fact**: While lengths scale by $|k|$, **areas scale by $k^2$** and **volumes scale by $|k|^3$**!
$$\\text{Image Area} = k^2 \\times \\text{Object Area}$$
  - Example: Enlarging a $12\\text{ cm}^2$ triangle by scale factor $k = 3$ produces an image of area $3^2 \\times 12 = 108\\text{ cm}^2$.`,
  },

  // =========================================================================
  // PART 4: ADDITIONAL / ELECTIVE MATHEMATICS (SHS 2–3)
  // =========================================================================
  {
    id: 'note-mg-addmath-s2-series-binomial',
    topicId: 'math-s2-trig',
    isBuiltIn: true,
    title: 'Geometric Sum to Infinity S∞ = a/(1-r), Binomial General Term Tr+1 & Double-Angle Identities',
    subject: 'addmaths',
    grade: 'SHS2',
    tags: ['SHS2', 'Elective Maths', 'Sum to Infinity', 'Binomial Theorem', 'Trig Identities'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Series Sum to Infinity, Binomial General Term & Trig Identities (SHS 2)

## 1. Arithmetic & Geometric Series Including Sum to Infinity
- **Arithmetic Progression (AP)**: Common difference $d$:
$$T_n = a + (n - 1)d, \\qquad S_n = \\frac{n}{2}\\left[2a + (n - 1)d\\right]$$
- **Geometric Progression (GP)**: Common ratio $r$:
$$T_n = ar^{n-1}, \\qquad S_n = \\frac{a(1 - r^n)}{1 - r} \\quad (r \\neq 1)$$
- **Sum to Infinity ($|r| < 1$)**: When $|r| < 1$, $r^n \\to 0$ as $n \\to \\infty$, collapsing the series to:
$$S_\\infty = \\frac{a}{1 - r} \\qquad (|r| < 1)$$

## 2. Binomial Theorem & General Term $T_{r+1}$
For any positive integer $n$:
$$(a + b)^n = \\sum_{r=0}^n \\binom{n}{r} a^{n-r} b^r, \\qquad T_{r+1} = \\binom{n}{r} a^{n-r} b^r$$
- To find the **term independent of $x$** in $\\left(2x + \\frac{1}{x^2}\\right)^9$, write $T_{r+1}$, collect total exponent of $x$, set it equal to $0$, solve for $r$, and evaluate!

## 3. Radians, Pythagorean & Double-Angle Trig Identities
- **Radian Measure**: $\\pi\\text{ rad} = 180^\\circ$, arc length $s = r\\theta$, sector area $A = \\frac{1}{2}r^2\\theta$.
- **Three Pythagorean Identities**:
$$\\sin^2\\theta + \\cos^2\\theta = 1, \\qquad 1 + \\tan^2\\theta = \\sec^2\\theta, \\qquad 1 + \\cot^2\\theta = \\csc^2\\theta$$
- **Compound & Double-Angle Formulas**:
$$\\sin(A \\pm B) = \\sin A\\cos B \\pm \\cos A\\sin B$$
$$\\cos(2A) = \\cos^2 A - \\sin^2 A = 2\\cos^2 A - 1 = 1 - 2\\sin^2 A$$`,
  },
  {
    id: 'note-mg-addmath-s3-binomial-dist',
    topicId: 'math-s3-stats',
    isBuiltIn: true,
    title: 'Binomial Probability Distribution P(X=k), Mean np & Variance np(1-p)',
    subject: 'addmaths',
    grade: 'SHS3',
    tags: ['SHS3', 'Elective Maths', 'Binomial Distribution', 'Variance', 'Combinatorics'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Combinatorics & Binomial Probability Distribution (SHS 3)

## 1. Permutations ($^nP_r$) vs Combinations ($^nC_r$)
- **Permutations (Order Matters)**: $^nP_r = \\frac{n!}{(n - r)!}$
- **Combinations (Order Does Not Matter)**: $^nC_r = \\binom{n}{r} = \\frac{n!}{r!(n - r)!}$

## 2. Binomial Distribution $X \\sim B(n, p)$
Applies when we repeat $n$ **independent** trials, each with only **two outcomes** (Success probability $p$, Failure $q = 1 - p$):
$$P(X = k) = \\binom{n}{k} p^k (1 - p)^{n-k}$$
- **Expected Mean**: $\\mu = E(X) = np$
- **Variance**: $\\sigma^2 = \\text{Var}(X) = np(1 - p) = npq$
- **Standard Deviation**: $\\sigma = \\sqrt{np(1 - p)}$
- *Worked Check*: Toss a fair coin ($p = 0.5$) $100$ times $\\implies \\mu = 100(0.5) = 50$, $\\text{Var}(X) = 100(0.5)(0.5) = 25$, $\\sigma = 5$.`,
  },

  // =========================================================================
  // PART 5: CHEMISTRY (SHS 1–3)
  // =========================================================================
  {
    id: 'note-mg-chem-s1-separation-stp',
    topicId: 'chem-s1-stoichiometry',
    isBuiltIn: true,
    title: 'Mixture Separation Techniques & Molar Gas Volume (22.4 dm³ at STP)',
    subject: 'chemistry',
    grade: 'SHS1',
    tags: ['SHS1', 'Chemistry', 'Separation Techniques', 'Solvent Extraction', 'STP', '22.4 dm3'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Mixture Separation Techniques & STP Gas Stoichiometry (SHS 1)

## 1. Choosing the Right Physical Separation Technique
Think of separation as matching the right tool to a physical property difference:

| Method | Physical Property Difference | Classic WASSCE Example |
| :--- | :--- | :--- |
| **Filtration** | Insoluble solid vs liquid (particle size) | Sand + water |
| **Evaporation / Crystallization** | Dissolved heat-stable vs heat-sensitive solid | Table salt vs $\\text{CuSO}_4\\cdot 5\\text{H}_2\\text{O}$ crystals |
| **Simple Distillation** | Liquid vs dissolved solid (wide boiling point gap) | Pure water from seawater |
| **Fractional Distillation** | Miscible liquids with close boiling points | Ethanol ($78^\\circ\\text{C}$) + water ($100^\\circ\\text{C}$); crude oil |
| **Chromatography** | Differential solubility & adsorption rate | Ink pigments, plant chlorophyll |
| **Solvent Extraction** | Differential solubility in two immiscible solvents | Extracting iodine from water using hexane |

## 2. Mole Concept & $22.4\\text{ dm}^3$ Molar Gas Volume at STP
At **Standard Temperature and Pressure (STP: $273\\text{ K}$, $1\\text{ atm}$)**, **one mole of ANY ideal gas occupies $22.4\\text{ dm}^3$** ($22,400\\text{ cm}^3$):
$$n = \\frac{m}{M} = \\frac{N}{N_A} = \\frac{V}{22.4\\text{ dm}^3} \\qquad (N_A \\approx 6.02 \\times 10^{23}\\text{ mol}^{-1})$$
- **Empirical vs Molecular Formula**: Empirical formula is the simplest whole-number mole ratio (e.g., $\\text{CH}_2\\text{O}$); Molecular formula is an integer multiple $k \\times \\text{Empirical Formula}$ where $k = \\frac{\\text{Molar Mass}}{\\text{Empirical Formula Mass}}$.`,
  },
  {
    id: 'note-mg-chem-s2-cells-faraday',
    topicId: 'chem-s3-redox',
    isBuiltIn: true,
    title: 'Redox (OIL RIG), Galvanic vs Electrolytic Cells & Faraday’s First Law (m ∝ It)',
    subject: 'chemistry',
    grade: 'SHS2',
    tags: ['SHS2', 'Chemistry', 'Redox', 'Galvanic', 'Electrolytic', 'Faraday Law'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Redox (OIL RIG), Electrochemical Cells & Faraday's First Law (SHS 2)

## 1. OIL RIG & Galvanic vs Electrolytic Cells
- **OIL RIG**: **O**xidation **I**s **L**oss of electrons (oxidation number rises); **R**eduction **I**s **G**ain of electrons (oxidation number drops).
- In **ALL cells**: Oxidation **always** happens at the **Anode** (**An Ox**), and Reduction **always** happens at the **Cathode** (**Red Cat**)!

| Feature | Galvanic (Voltaic) Cell | Electrolytic Cell |
| :--- | :--- | :--- |
| Energy Conversion | Spontaneous Chemical $\\to$ Electrical | Electrical $\\to$ Non-spontaneous Chemical |
| Anode Polarity | **Negative ($-$)** | **Positive ($+$)** |
| Cathode Polarity | **Positive ($+$)** | **Negative ($-$)** |
| Salt Bridge | Required to balance ion flow | Not required (single electrolyte) |

## 2. Faraday's First Law of Electrolysis ($m \\propto Q = It$)
The mass $m$ of substance liberated at an electrode is directly proportional to total electric charge $Q$ passed:
$$Q = I\\,t, \\qquad m = \\frac{M\\,I\\,t}{z\\,F} \\qquad (F \\approx 96,500\\text{ C mol}^{-1})$$
- *Worked Check*: Pass $I = 2\\text{ A}$ through $\\text{CuSO}_4$ ($z = 2, M = 63.5$) for $965\\text{ s}$: $Q = 1930\\text{ C} = 0.02\\text{ F} \\implies n(\\text{Cu}) = 0.01\\text{ mol} \\implies m = 0.635\\text{ g}$.`,
  },
  {
    id: 'note-mg-chem-s3-processes-environment',
    topicId: 'chem-s3-qualitative',
    isBuiltIn: true,
    title: 'Contact & Haber Processes, Halogens, Organic Series & Environmental Chemistry',
    subject: 'chemistry',
    grade: 'SHS3',
    tags: ['SHS3', 'Chemistry', 'Contact Process', 'Haber Process', 'Halogens', 'Ozone Depletion'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Inorganic Processes, Organic Homologous Series & Environmental Chemistry (SHS 3)

## 1. Industrial Inorganic Processes & Halogen Reactivity
- **Halogens (Group 17) Oxidizing Power**: $\\text{F}_2 > \\text{Cl}_2 > \\text{Br}_2 > \\text{I}_2$ (a higher halogen displaces a lower halide ion from solution).
- **Contact Process ($\text{H}_2\\text{SO}_4$)**: Sulfur $\\to \\text{SO}_2$; catalytic oxidation $2\\text{SO}_2 + \\text{O}_2 \\rightleftharpoons 2\\text{SO}_3$ using $\\text{V}_2\\text{O}_5$ catalyst at $450^\\circ\\text{C}$; absorbed in conc. $\\text{H}_2\\text{SO}_4$ to form oleum ($\\text{H}_2\\text{S}_2\\text{O}_7$), then diluted safely.
- **Haber Process ($\text{NH}_3$)**: $\\text{N}_2 + 3\\text{H}_2 \\rightleftharpoons 2\\text{NH}_3$ using finely divided **Fe catalyst**, $450^\\circ\\text{C}$, and $200\\text{ atm}$.
- **Transition Metals**: Characterized by variable oxidation states, colored aqueous ions, catalytic activity, and complex ion formation.

## 2. Organic Homologous Series Quick Map
- **Alkanes ($C_nH_{2n+2}$)**: Saturated single bonds; free-radical substitution & combustion.
- **Alkenes ($C_nH_{2n}$)** & **Alkynes ($C_nH_{2n-2}$)**: Unsaturated; electrophilic addition (decolorizes $\\text{Br}_2$ water) & polymerization.
- **Alkanols ($-\\text{OH}$)**, **Alkanals ($-\\text{CHO}$)**, **Alkanones ($-\\text{CO}-$)**, **Alkanoic Acids ($-\\text{COOH}$)**, **Esters ($-\\text{COO}-$ via esterification)**, and **Amines/Amides**; exhibiting structural and stereoisomerism.

## 3. Environmental Chemistry Threats & Green Controls
- **Acid Rain**: Caused by dissolved $\\text{SO}_2$ and $\\text{NO}_x$ lowering rain pH below $5.6$, corroding limestone and leaching soil nutrients.
- **Stratospheric Ozone Depletion**: CFCs release chlorine radicals ($\\text{Cl}\\cdot$) under UV light that catalytically destroy $\\text{O}_3$ shields.
- **Enhanced Greenhouse Effect**: Rising $\\text{CO}_2$, $\\text{CH}_4$, and $\\text{N}_2\\text{O}$ trap outgoing infrared radiation, driving global warming.`,
  },

  // =========================================================================
  // PART 6: BIOLOGY (SHS 1 & SHS 3)
  // =========================================================================
  {
    id: 'note-mg-bio-s1-nutrition-villi',
    topicId: 'bio-s1-nutrition',
    isBuiltIn: true,
    title: 'Magnification Math, Digestive Enzymes & Small Intestine Villi Assimilation',
    subject: 'biology',
    grade: 'SHS1',
    tags: ['SHS1', 'Biology', 'Magnification', 'Digestion', 'Villi', 'Assimilation'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Magnification Formula, Digestive Enzymes & Villi Absorption (SHS 1)

## 1. Taxonomic Hierarchy & Magnification Calculation
- **Classification Hierarchy**: $\\text{Kingdom} \\to \\text{Phylum} \\to \\text{Class} \\to \\text{Order} \\to \\text{Family} \\to \\text{Genus} \\to \\text{Species}$ (*King Philip Came Over For Good Soup*).
- **Microscope & Biological Drawing Magnification** (convert both measurements to the SAME unit first, usually $\\text{mm}$ or $\\mu\\text{m}$!):
$$\\text{Magnification} = \\frac{\\text{Image Size}}{\\text{Actual Specimen Size}}$$

## 2. Human Digestion, Absorption via Villi, Assimilation & Egestion
| Nutrient Class | Main Enzymes | End Products Absorbed |
| :--- | :--- | :--- |
| Carbohydrates (starch) | Salivary & pancreatic **amylases**, maltase | Monosaccharides (**glucose**) |
| Proteins | **Proteases** (pepsin, trypsin, peptidases) | **Amino acids** |
| Lipids (fats & oils) | Bile emulsification + **lipases** | **Fatty acids + glycerol** (via lacteals) |

- **How Intestinal Villi Supercharge Absorption**: Finger-like **villi** and **microvilli** create an enormous surface area, thin one-cell-thick epithelium for short diffusion distance, dense blood capillaries (for glucose/amino acids), and central **lacteal** lymphatic vessels (for fats).
- **Assimilation vs Egestion**: **Assimilation** is body cells actively utilizing absorbed glucose/amino acids; **Egestion** is expelling undigested cellulose/feces through the anus (never confuse egestion with metabolic excretion!).`,
  },
  {
    id: 'note-mg-bio-s3-trophic-energy',
    topicId: 'bio-s3-ecology',
    isBuiltIn: true,
    title: 'Ecosystem Energy Flow (~10% Rule), Carbon & Nitrogen Cycles & Conservation',
    subject: 'biology',
    grade: 'SHS3',
    tags: ['SHS3', 'Biology', 'Trophic Levels', '10% Rule', 'Nitrogen Cycle', 'Ecology'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Trophic Energy Flow (~10% Law), Carbon & Nitrogen Cycles (SHS 3)

## 1. Why Food Chains Rarely Exceed 4–5 Trophic Levels (~10% Rule)
Imagine producers capture $10,000\\text{ kJ}$ of sunlight energy:
- **About $90\\%$ is lost at every step** as respiratory heat, movement, undigested parts, and metabolic waste.
- Only **about $10\\%$ passes cleanly upward** to the next trophic level:
$$\\text{Producers } (10,000\\text{ kJ}) \\to \\text{Primary Consumers } (1,000\\text{ kJ}) \\to \\text{Secondary Consumers } (100\\text{ kJ}) \\to \\text{Tertiary } (10\\text{ kJ})$$
That steep energy pyramid explains why lions and eagles are always far rarer than grasshoppers and antelopes!

## 2. Carbon & Nitrogen Biogeochemical Cycles
- **Carbon Cycle**: Photosynthesis locks atmospheric $\\text{CO}_2$ into biomass; respiration, decomposition, and fossil-fuel combustion return $\\text{CO}_2$ to air.
- **Nitrogen Cycle**: Nitrogen fixation (*Rhizobium* in legume root nodules / lightning) turns $\\text{N}_2$ into nitrates ($\\text{NO}_3^-$); **Nitrification** (*Nitrosomonas*, *Nitrobacter*) oxidizes $\\text{NH}_4^+ \\to \\text{NO}_2^- \\to \\text{NO}_3^-$; **Denitrification** (*Pseudomonas* in waterlogged soils) returns $\\text{N}_2$ gas.

## 3. Evolution, Speciation & Biodiversity Conservation
- **Natural Selection**: Overproduction + heritable variation $\\implies$ differential survival and reproduction $\\implies$ adaptation and **speciation** over generations.
- **Conservation**: Protecting wildlife habitats (Mole National Park, Kakum), reforestation, and anti-poaching enforcement preserve biodiversity.`,
  },

  // =========================================================================
  // PART 7: SOCIAL STUDIES (SHS 1)
  // =========================================================================
  {
    id: 'note-mg-soc-s1-symbols-socialization',
    topicId: 'soc-s1-culture',
    isBuiltIn: true,
    title: 'Ghana’s National Identity Symbols (Flag, Coat of Arms, Anthem, Pledge) & Socialization',
    subject: 'socialstudies',
    grade: 'SHS1',
    tags: ['SHS1', 'Social Studies', 'Coat of Arms', 'National Flag', 'Socialization'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# National Identity Symbols, Ghanaian Heritage & Socialization (SHS 1)

## 1. Ghana's Four Core National Identity Symbols
Every Ghanaian citizen should understand the exact meaning carried by our national emblems:
1. **The National Flag** (designed by Mrs. Theodosia Okoh):
   - **Red**: Blood shed by forefathers during the independence struggle.
   - **Gold / Yellow**: Rich mineral wealth and prosperity of Ghana.
   - **Green**: Lush forests, agriculture, and natural vegetation.
   - **Five-Pointed Black Star**: Lodestar of African Freedom and Pan-African unity.
2. **The Coat of Arms** (designed by Amon Kotei):
   - Shield divided into four quarters showing chieftaincy/state sword & staff, Osu Castle by the sea, cocoa tree, and mine shaft; supported by two golden eagles with Black Stars and the motto ***"Freedom and Justice"***.
3. **The National Anthem**: *"God Bless Our Homeland Ghana"* — inspires patriotism, humility, honesty, and fearless defense of liberty.
4. **The National Pledge**: Solemn civic oath committing citizens to loyalty, service, and defending the good name of Ghana.

## 2. Cultural Heritage, Reforming Harmful Customs & Socialization
- **Celebrating vs Reforming Culture**: Preserve positive heritage (festivals like *Homowo*, *Hogbetsotso*, *Aboakyer*, chieftaincy, hospitality), while **reforming harmful customs** (female genital mutilation, widowhood rites, child marriage, *trokosi*).
- **Primary vs Secondary Socialization**: **Primary socialization** happens inside the **family** (early language, values, trust); **Secondary socialization** continues via **schools, peer groups, religious institutions, and mass media**.`,
  },

  // =========================================================================
  // PART 8: INFORMATION & COMMUNICATIONS TECHNOLOGY (SHS 1–2)
  // =========================================================================
  {
    id: 'note-mg-ict-s1-info-processing',
    topicId: 'ict-s1-hardware',
    isBuiltIn: true,
    title: 'Information Processing Cycle (IPSO), CPU Units & File Extensions Guide',
    subject: 'ict',
    grade: 'SHS1',
    tags: ['SHS1', 'ICT', 'Information Processing Cycle', 'CPU', 'RAM', 'File Extensions'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Information Processing Cycle, Hardware & File Organization (SHS 1)

## 1. The Information Processing Cycle (IPSO)
Every computer transforms raw data into useful information through four continuous stages:
$$\\text{Input} \\longrightarrow \\text{Process} \\longrightarrow \\text{Storage} \\longrightarrow \\text{Output}$$
- **Central Processing Unit (CPU)**:
  - **Control Unit (CU)**: Directs data traffic and decodes program instructions (like a traffic officer).
  - **Arithmetic & Logic Unit (ALU)**: Executes all arithmetic ($+, -, \\times, \\div$) and logical comparisons ($>, <, =$ ).
- **Primary vs Secondary Storage**: **RAM** is fast but **volatile** (erased on power off); **ROM** is **non-volatile** (holds startup BIOS firmware); **HDD, SSD, and flash drives** provide persistent secondary storage.

## 2. Operating Systems, Utilities & Common File Extensions
- **Operating Systems**: Windows, Linux, Android, macOS manage hardware, memory, and user interfaces; **Utility Software** maintains system health (antivirus, backup, file compression).
- **Essential File Extensions**:

| Extension | File Category | Typical Application |
| :--- | :--- | :--- |
| \`.docx\` | Word Processing Document | Microsoft Word / LibreOffice Writer |
| \`.xlsx\` | Electronic Spreadsheet | Microsoft Excel / Calc |
| \`.pptx\` | Slide Presentation | PowerPoint |
| \`.pdf\` | Portable Document Format | Read-only cross-device publishing |
| \`.jpg\` | Compressed Raster Image | Digital photography |
| \`.py\` | Python Source Code | Algorithm & programming scripts |`,
  },
  {
    id: 'note-mg-ict-s2-spreadsheets-cybersecurity',
    topicId: 'ict-s2-spreadsheets',
    isBuiltIn: true,
    title: 'Relative (A1) vs Absolute ($A$1) References, Networking & Cybersecurity',
    subject: 'ict',
    grade: 'SHS2',
    tags: ['SHS2', 'ICT', 'Absolute Reference', '$A$1', '2FA', 'Phishing', 'Netiquette'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Spreadsheets ($A$1 vs A1), Networks & Cybersecurity Hygiene (SHS 2)

## 1. Relative (\`A1\`) vs Absolute (\`$A$1\`) Cell Referencing
- **Relative Reference (\`A1\`)**: Shifts automatically when you drag-fill a formula across rows or columns (e.g., \`=B2*C2\` becomes \`=B3*C3\` on row 3).
- **Absolute Reference (\`$A$1\`)**: Locks the column and/or row with dollar signs (\`$\`) so a fixed rate (like a tax rate in \`$F$1\`) **never shifts** when copied!
- **Essential Exam Functions**: \`SUM()\`, \`AVERAGE()\`, \`COUNT()\`, \`MIN()\`, \`MAX()\`, and logical \`=IF(A2>=50, "Pass", "Fail")\`.

## 2. Networks, Protocols & Relational Databases
- **Relational Databases**: Store data in **tables** made of **rows (records)** and **columns (fields)**, uniquely identified by a **Primary Key** and filtered using **queries**.
- **Network Essentials**: **LAN** (local school lab) vs **WAN** (internet-wide); **Switches** connect LAN devices via MAC addresses while **Routers** link separate IP networks; **DNS** translates human domain names into **IP addresses**; **HTTPS** encrypts web traffic over TLS unlike plain **HTTP**.

## 3. Cybersecurity & Digital Citizenship
- **Strong Passwords & 2FA**: Two-Factor Authentication (**2FA**) pairs something you *know* (password) with something you *have* (OTP code/authenticator), stopping stolen-password logins.
- **Phishing & Malware Defense**: Never click deceptive links spoofing banks or school portals; keep antivirus and OS security patches current.
- **Copyright, Plagiarism & Netiquette**: Always credit original creators, avoid copying unattributed text, and communicate respectfully online.`,
  },
];
