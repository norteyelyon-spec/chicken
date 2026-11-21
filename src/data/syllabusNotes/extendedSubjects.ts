import type { StudyNote } from '../../types/index.ts';

const SEED_TIME = '2026-01-25T08:30:00.000Z';

export const EXTENDED_SYLLABUS_NOTES: StudyNote[] = [
  {
    id: 'note-phys-s2-waves-optics-ext',
    title: 'Wave Optics: Reflection, Refraction, Snell’s Law & Lenses',
    subject: 'physics',
    grade: 'SHS2',
    topicId: 'phys-s2-waves',
    tags: ['SHS2', 'Physics', 'Optics', 'Snell-Law', 'Lenses'],
    isBuiltIn: true,
    createdAt: SEED_TIME,
    updatedAt: SEED_TIME,
    content: `# Wave Optics: Reflection, Refraction, Snell's Law & Lenses

## 1. Snell's Law & Critical Angle ($\\theta_c$)
- **Refraction** occurs because light changes speed ($v = c/n$) when crossing between optical media of different refractive indices $n_1, n_2$.

$$n_1 \\sin \\theta_1 = n_2 \\sin \\theta_2 \\qquad n = \\frac{\\text{real depth}}{\\text{apparent depth}} = \\frac{1}{\\sin c}$$

- **Total Internal Reflection (TIR)** happens only when light travels from a **denser to a less dense** medium ($n_1 > n_2$) and the angle of incidence exceeds the **critical angle $c$** ($\\theta_1 > c$).
- Applications: Optical fibres in Ghana's broadband cables, prisms in periscopes/binoculars, and diamond brilliance.

## 2. Thin Lens Equation & Sign Convention (Real-is-Positive)
$$\\frac{1}{f} = \\frac{1}{u} + \\frac{1}{v} \\qquad m = \\frac{h_i}{h_o} = \\frac{v}{u}$$

- **Converging (Convex) Lens ($f > 0$)**: Forms real inverted images when $u > f$, and virtual upright magnified images when $u < f$ (magnifying glass).
- **Diverging (Concave) Lens ($f < 0$)**: Always produces virtual, upright, diminished images regardless of object distance—used to correct **short-sightedness (myopia)**.
`,
  },
  {
    id: 'note-phys-s3-electromagnetism-ext',
    title: 'Electromagnetic Induction, Faraday’s & Lenz’s Laws & Transformers',
    subject: 'physics',
    grade: 'SHS3',
    topicId: 'phys-s3-em',
    tags: ['SHS3', 'Physics', 'Faraday', 'Transformers', 'WASSCE'],
    isBuiltIn: true,
    createdAt: SEED_TIME,
    updatedAt: SEED_TIME,
    content: `# Electromagnetic Induction, Faraday's & Lenz's Laws & Transformers

## 1. Magnetic Flux & Faraday's Law
- **Magnetic Flux** linking a coil of $N$ turns and area $A$ tilted at angle $\\theta$ to field normal is $\\Phi = B A \\cos\\theta$ (unit: Weber, $\\text{Wb}$).
- **Faraday's Law**: The induced e.m.f. is directly proportional to the rate of change of magnetic flux linkage:

$$\\mathcal{E} = -N \\frac{\\Delta \\Phi}{\\Delta t}$$

- **Lenz's Law**: The direction of the induced current always **opposes the change in magnetic flux** causing it—direct proof of **Conservation of Energy**.

## 2. Step-Up & Step-Down Transformers (Akosombo Grid Transmission)
$$\\frac{V_s}{V_p} = \\frac{N_s}{N_p} \\qquad \\eta = \\frac{V_s I_s}{V_p I_p} \\times 100\\%$$

- **Why High Voltage Transmission?** Because resistive power loss along pylon cables is $P_{\\text{loss}} = I^2 R$, stepping voltage UP reduces current $I$ dramatically and slashes $I^2 R$ heat losses.
- **Laminated Soft-Iron Core**: Thin insulated sheets suppress **eddy current** heating; thick low-resistance copper windings cut Joule heating.
`,
  },
  {
    id: 'note-chem-s2-acid-base-titration-ext',
    title: 'Volumetric Analysis: Acid–Base Titration & pH Calculations',
    subject: 'chemistry',
    grade: 'SHS2',
    topicId: 'chem-s2-acids',
    tags: ['SHS2', 'Chemistry', 'Titration', 'Paper-3', 'pH'],
    isBuiltIn: true,
    createdAt: SEED_TIME,
    updatedAt: SEED_TIME,
    content: `# Volumetric Analysis: Acid–Base Titration & pH Calculations

## 1. Fundamental Titration Formula & Burette Technique
$$\\frac{C_a V_a}{C_b V_b} = \\frac{n_a}{n_b} \\qquad \\text{pH} = -\\log_{10}[\\text{H}_3\\text{O}^+]$$

- **Burette Precision**: Record all burette readings to **2 decimal places** ending in $0$ or $5$ (e.g. $24.30\\text{ cm}^3$); discard rough titre and average concordant titres within $\\pm 0.20\\text{ cm}^3$.
- **Conical Flask Rule**: Rinse pipette with the solution it will measure, rinse conical flask only with **distilled water** (never with base, which would add unknown extra moles!).

## 2. Choosing WASSCE Titration Indicators
- **Strong Acid + Strong Base** ($\\text{HCl} + \\text{NaOH}$): Both **Methyl Orange** ($3.1 - 4.4$) and **Phenolphthalein** ($8.3 - 10.0$) work cleanly.
- **Strong Acid + Weak Base** ($\\text{HCl} + \\text{Na}_2\\text{CO}_3$ or $\\text{NH}_3$): Use **Methyl Orange** (yellow to pink-red/orange at $pH \\approx 3.7$).
- **Weak Acid + Strong Base** ($\\text{CH}_3\\text{COOH} + \\text{NaOH}$): Use **Phenolphthalein** (colourless to faint permanent pink).
`,
  },
  {
    id: 'note-bio-s2-transport-mammals-ext',
    title: 'Mammalian Transport: Heart Cycle, Blood Vessels & Immunity',
    subject: 'biology',
    grade: 'SHS2',
    topicId: 'bio-s2-nutrition',
    tags: ['SHS2', 'Biology', 'Circulation', 'Heart', 'Immunity'],
    isBuiltIn: true,
    createdAt: SEED_TIME,
    updatedAt: SEED_TIME,
    content: `# Mammalian Transport: Heart Cycle, Blood Vessels & Immunity

## 1. Double Circulation & Cardiac Structure
- **Double Circulation**: Blood passes twice through the heart per full circuit—the **pulmonary circuit** (right ventricle $\\rightarrow$ lungs $\\rightarrow$ left atrium) and the **systemic circuit** (left ventricle $\\rightarrow$ body $\\rightarrow$ right atrium).
- **Left Ventricle Wall Thickness**: The left ventricle has a much thicker muscular myocardium than the right ventricle because it must generate high hydrostatic pressure to pump oxygenated blood to every systemic organ.
- **Valves Prevent Backflow**: **Tricuspid** (right AV), **Bicuspid/Mitral** (left AV), and **Semilunar valves** in the aorta and pulmonary artery.

## 2. Comparing Arteries, Veins & Capillaries
- **Arteries**: Thick elastic and smooth-muscle walls, narrow lumen, high pressure, no valves (except pulmonary/aortic roots), carry blood *away* from the heart.
- **Veins**: Thinner walls, wide lumen, low pressure, contain **pocket semi-lunar valves** assisted by skeletal muscle squeezing to prevent backflow.
- **Capillaries**: One-cell-thick endothelium allowing rapid diffusion of $\\text{O}_2$, glucose, urea, and tissue fluid formation.
`,
  },
  {
    id: 'note-addmath-s1-quadratics-ext',
    title: 'Quadratic Equations, Discriminant Nature of Roots & Remainder Theorem',
    subject: 'addmaths',
    grade: 'SHS1',
    topicId: 'addmaths-s1-alg',
    tags: ['SHS1', 'AddMaths', 'Quadratics', 'Discriminant', 'Polynomials'],
    isBuiltIn: true,
    createdAt: SEED_TIME,
    updatedAt: SEED_TIME,
    content: `# Quadratic Equations, Discriminant & Remainder Theorem

## 1. Sum & Product of Roots ($\\alpha, \\beta$)
- For $ax^2 + bx + c = 0$ ($a \\neq 0$):

$$\\alpha + \\beta = -\\frac{b}{a}, \\qquad \\alpha\\beta = \\frac{c}{a}, \\qquad \\alpha^2 + \\beta^2 = (\\alpha + \\beta)^2 - 2\\alpha\\beta$$

- **Discriminant $\\Delta = b^2 - 4ac$**:
  - $\\Delta > 0$: Two distinct real roots.
  - $\\Delta = 0$: Equal (repeated) real roots — line is **tangent** to the parabola.
  - $\\Delta < 0$: No real roots (complex conjugates).

## 2. Remainder & Factor Theorems
- **Remainder Theorem**: When polynomial $f(x)$ is divided by $(ax - b)$, the remainder is $R = f\\!\\left(\\frac{b}{a}\\right)$.
- **Factor Theorem**: $(ax - b)$ is an exact factor of $f(x)$ **if and only if** $f\\!\\left(\\frac{b}{a}\\right) = 0$.
`,
  },
  {
    id: 'note-ict-s2-algorithms-python-ext',
    title: 'Algorithms, Pseudocode, Trace Tables & Python Control Flow',
    subject: 'ict',
    grade: 'SHS2',
    topicId: 'ict-s2-prog',
    tags: ['SHS2', 'ICT', 'Algorithms', 'Python', 'Trace-Tables'],
    isBuiltIn: true,
    createdAt: SEED_TIME,
    updatedAt: SEED_TIME,
    content: `# Algorithms, Pseudocode, Trace Tables & Python Control Flow

## 1. Properties of a Valid Algorithm
- **Input & Output**: Clearly defined inputs and deterministic output.
- **Definiteness & Finiteness**: Every step is unambiguous and terminates after a finite number of steps (never an infinite loop!).
- **Three Structured Constructs**: **Sequence** (top-to-bottom), **Selection** (\`if / elif / else\`), and **Iteration** (\`for\` count-controlled, \`while\` condition-controlled).

## 2. Worked WASSCE Trace Table Example
\`\`\`python
total = 0
for k in range(1, 5):
    if k % 2 == 0:
        total = total + k * 2
print(total)
\`\`\`
- Step trace: $k=1 \\rightarrow$ skip; $k=2 \\rightarrow \\text{total}=4$; $k=3 \\rightarrow$ skip; $k=4 \\rightarrow \\text{total}=4+8=12$. Output: **12**.
`,
  },
  {
    id: 'note-coremath-s3-vectors-bearing-ext',
    title: 'Vectors in 2D, Dot Product, Magnitude & Compass Bearings',
    subject: 'coremath',
    grade: 'SHS3',
    topicId: 'coremath-s3-vectors',
    tags: ['SHS3', 'CoreMath', 'Vectors', 'Bearings', 'Trigonometry'],
    isBuiltIn: true,
    createdAt: SEED_TIME,
    updatedAt: SEED_TIME,
    content: `# Vectors in 2D, Magnitude & Compass Bearings

## 1. Position Vectors & Parallel/Perpendicular Tests
- Given $\\vec{a} = \\begin{pmatrix} x_1 \\\\ y_1 \\end{pmatrix}$ and $\\vec{b} = \\begin{pmatrix} x_2 \\\\ y_2 \\end{pmatrix}$:

$$|\\vec{a}| = \\sqrt{x_1^2 + y_1^2}, \\qquad \\overrightarrow{AB} = \\overrightarrow{OB} - \\overrightarrow{OA}, \\qquad \\vec{a} \\cdot \\vec{b} = x_1 x_2 + y_1 y_2$$

- **Parallel**: $\\vec{a} = k\\vec{b}$ for scalar $k$. **Perpendicular (Orthogonal)**: $\\vec{a} \\cdot \\vec{b} = 0$.

## 2. Three-Figure Bearings Rule
- Bearings are ALWAYS measured **clockwise from True North ($000^\\circ$)** using 3 digits (e.g. $045^\\circ$, $215^\\circ$).
- **Back Bearing Rule**: If bearing of $B$ from $A$ is $\\theta$, bearing of $A$ from $B$ is $\\theta + 180^\\circ$ (if $\\theta < 180^\\circ$) or $\\theta - 180^\\circ$ (if $\\theta \\ge 180^\\circ$).
`,
  },
  {
    id: 'note-english-s2-essay-writing-ext',
    title: 'WASSCE Paper 1 Essay Writing: Formal Letters, Articles & Debates',
    subject: 'english',
    grade: 'SHS2',
    topicId: 'english-s2-essay',
    tags: ['SHS2', 'English', 'Paper-1', 'Formal-Letter', 'Essay'],
    isBuiltIn: true,
    createdAt: SEED_TIME,
    updatedAt: SEED_TIME,
    content: `# WASSCE Paper 1 Essay Writing: Formal Letters, Articles & Debates

## 1. The 4 Marking Pillars (Content, Organisation, Expression, Mechanical Accuracy)
- **Content (10 marks)**: Address every part of the prompt thoroughly (~450 words minimum).
- **Organisation (10 marks)**: Correct format, logical paragraphing (one central idea per paragraph), smooth discourse markers (*Furthermore, Consequently, Conversely*).
- **Expression (20 marks)**: Formal diction free of slang, contractions, or SMS abbreviations in formal genres.
- **Mechanical Accuracy (10 marks)**: Zero comma splices, zero spelling or subject-verb concord errors.

## 2. Formal Letter Layout Checklist
- **Writer's Address & Date** at top right (e.g. *P.O. Box 142, Kumasi* — punctuated consistently).
- **Recipient's Title & Address** on the left margin.
- **Salutation**: *Dear Sir,* or *Dear Madam,* (never *Dear Sir/Madam* if avoidable—pick one cleanly).
- **Underlined / Capitalized Heading** summarizing the subject concisely.
- **Subscription**: *Yours faithfully,* followed by signature and **Full Name** in capitals/parentheses.
`,
  },
  {
    id: 'note-intsci-s1-photosynthesis-respiration-ext',
    title: 'Integrated Science: Photosynthesis vs Cellular Respiration',
    subject: 'integratedscience',
    grade: 'SHS1',
    topicId: 'intsci-s1-matter',
    tags: ['SHS1', 'IntegratedScience', 'Photosynthesis', 'Respiration'],
    isBuiltIn: true,
    createdAt: SEED_TIME,
    updatedAt: SEED_TIME,
    content: `# Integrated Science: Photosynthesis vs Cellular Respiration

## 1. Balanced Chemical Equations
- **Photosynthesis** (chloroplast, absorbs light energy):

$$6\\text{CO}_2 + 6\\text{H}_2\\text{O} \\xrightarrow{\\text{Light, Chlorophyll}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2$$

- **Aerobic Cellular Respiration** (mitochondria, releases ATP energy):

$$\\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2 \\rightarrow 6\\text{CO}_2 + 6\\text{H}_2\\text{O} + \\text{Energy (ATP)}$$

## 2. Testing a Leaf for Starch (4 Exam Steps)
- **1. Boil in water ($1\\text{ min}$)**: Kills cells and breaks cell membranes.
- **2. Heat in ethanol (water bath—no direct flame!)**: Extracts green **chlorophyll** so colour changes remain visible.
- **3. Dip briefly in warm water**: Softens the brittle decolorized leaf.
- **4. Add Iodine solution**: Positive starch turns **blue-black**; starch-free regions stay yellowish-brown.
`,
  },
  {
    id: 'note-social-s3-ghana-economy-development-ext',
    title: 'Economic Development, Entrepreneurship & ECOWAS Integration',
    subject: 'socialstudies',
    grade: 'SHS3',
    topicId: 'social-s3-econ',
    tags: ['SHS3', 'SocialStudies', 'Economy', 'Entrepreneurship', 'ECOWAS'],
    isBuiltIn: true,
    createdAt: SEED_TIME,
    updatedAt: SEED_TIME,
    content: `# Economic Development, Entrepreneurship & ECOWAS Integration

## 1. Economic Growth vs Sustainable National Development
- **Economic Growth** is a quantitative rise in real **Gross Domestic Product (GDP)** over time.
- **Economic Development** combines growth with **structural transformation** and improved quality of life: higher literacy, healthcare access, potable water, lower infant mortality, and environmental protection (**Human Development Index, HDI**).

## 2. Role of Entrepreneurship & Value Addition in Ghana
- Moving beyond raw cocoa beans and crude gold export into **local agro-processing** (chocolate, shea butter, fruit concentrates) keeps higher profit margins and skilled jobs inside Ghana.
- Key barriers entrepreneurs overcome: startup capital access, business plan discipline, market research, and tax/regulatory compliance.

## 3. Ghana in ECOWAS & the African Continental Free Trade Area (AfCFTA)
- Accra hosts the **AfCFTA Secretariat**, advancing intra-African tariff reduction, cross-border transport corridors, and harmonized customs standards across West Africa and the continent.
`,
  },
];
