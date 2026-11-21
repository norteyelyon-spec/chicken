import type { StudyNote } from '../../types/index.ts';

const SEED_TIME = '2026-01-25T08:00:00.000Z';

export const CHEMISTRY_PDF_NOTES: StudyNote[] = [
  {
    id: 'note-chem-s1-daily-life-branches-pdf',
    title: 'Meaning, Branches of Chemistry & Impact in Daily Ghanaian Life',
    subject: 'chemistry',
    grade: 'SHS1',
    topicId: 'chem-s1-atoms',
    tags: ['SHS1', 'Chemistry-PDF', 'Branches', 'Ghana-Industries', 'Careers'],
    isBuiltIn: true,
    createdAt: SEED_TIME,
    updatedAt: SEED_TIME,
    content: `# Meaning, Branches of Chemistry & Impact in Daily Ghanaian Life

## 1. Meaning of Chemistry & Why It Is the Central Science
- **Chemistry** is the branch of science that studies the **composition, structure, properties, and transformations (reactions)** of matter and the energy changes that accompany them.
- **Misconception Alert**: Chemistry is *not* limited to dangerous factory poisons—clean drinking water, cooked food, herbal medicines, soil fertility, batteries, and textiles all depend on safe, controlled chemical processes.
- Chemistry connects Physics (atomic forces, thermodynamics, quantum mechanics) with Biology, Medicine, Agriculture, Geology, and Engineering, earning the title **The Central Science**.

## 2. Pure Chemistry vs Applied Chemistry
- **Pure Chemistry** investigates fundamental principles, atomic structure, bonding, and reaction laws to build scientific understanding:
  - **Physical Chemistry**: Studies energy changes, kinetics (rates), equilibrium, and thermodynamics ($\\Delta H$, $K_c$, electrochemistry).
  - **Organic Chemistry**: Studies carbon compounds—hydrocarbons, alcohols, polymers, fuels, pharmaceuticals, and biomolecules.
  - **Inorganic Chemistry**: Studies minerals, metals, salts, acids, bases, transition-metal catalysts, and non-carbon elements.
  - **Analytical Chemistry**: Identifies *what* is present (**qualitative**—e.g. flame tests, $\\text{AgNO}_3$) and *how much* (**quantitative**—titrations, spectroscopy).
- **Applied Chemistry** deploys chemical principles to manufacture useful goods, solve environmental challenges, and treat disease (Chemical Engineering, Pharmacy, Petrochemicals, Water Treatment, Metallurgy).

## 3. Importance of Chemistry in Ghana (Five Key Sectors)
- **Food & Safe Water**: Traditional preservation (drying cocoa/cassava, smoking fish, salting tilapia into *koobi*), food testing by the **Ghana Standards Authority (GSA)**, and water purification at **Ghana Water Company stations (Weija & Kpong)** using alum coagulation, rapid sand filtration, and chlorination.
- **Agriculture**: Balanced NPK fertilizer blending (e.g. **Glofert in Tema**), animal feed micronutrient fortification (**Koudijs**), soil pH testing, and safe nuclear-assisted crop research (**GAEC**).
- **Medicine & Pharmaceuticals**: Synthesis and quality control of analgesics, antimalarials, IV drips, and vaccines at Ghanaian manufacturers such as **Tobinco Pharmaceuticals**, **Ernest Chemist**, and **Intravenous Infusions (Koforidua)**.
- **Transportation & Lubricants**: Crude oil fractional distillation at **Tema Oil Refinery (TOR)** producing petrol, diesel, LPG, kerosene, and motor oils formulated by **GOIL**.
- **Energy & Materials**: Battery electrochemistry, solar cells, biodiesel conversion, and industrial chemical services (such as **Global Engineering & Drilling, East Legon**).

## 4. Career Pathways & Professional Institutions
- **Laboratory & Health Careers**: Pharmacist, Biochemist, Toxicologist, Clinical Chemist, Forensic Scientist.
- **Industrial & Environmental Careers**: Chemical Engineer, Petrochemical Analyst, Food Scientist, Environmental/Water Quality Chemist, Materials Scientist.
- **Regulatory & Research Bodies in Ghana**: FDA, EPA, GSA, Council for Scientific and Industrial Research (**CSIR**), and **GAEC**.
`,
  },
  {
    id: 'note-chem-s1-lab-safety-hazards-pdf',
    title: 'Chemistry Laboratory Safety Rules, Hazard Symbols & PPE',
    subject: 'chemistry',
    grade: 'SHS1',
    topicId: 'chem-s1-atoms',
    tags: ['SHS1', 'Chemistry-PDF', 'Lab-Safety', 'Hazard-Symbols', 'PPE'],
    isBuiltIn: true,
    createdAt: SEED_TIME,
    updatedAt: SEED_TIME,
    content: `# Chemistry Laboratory Safety Rules, Hazard Symbols & PPE

## 1. Twelve Essential Chemistry Laboratory Rules
- Never eat, drink, chew gum, or taste any chemical in the laboratory—even dilute solutions or glassware lookalikes.
- Never enter the laboratory barefoot or in open sandals; wear closed-toe leather or rubber safety shoes.
- Always wear a buttoned **lab coat**, chemical splash **goggles**, and appropriate **gloves** when handling acids, alkalis, or solvents.
- **Dilution Golden Rule**: Always add **concentrated acid slowly into cold water** while stirring gently—never pour water into concentrated acid (exothermic boiling causes acid splatter).
- Tie back long hair, avoid loose sleeves/jewelry near Bunsen burners, and point heated test tubes away from yourself and classmates.
- Use a **fume cupboard (fume chamber)** when working with volatile, toxic, or foul-smelling gases such as $\\text{Cl}_2$, $\\text{NH}_3$, $\\text{NO}_2$, or $\\text{H}_2\\text{S}$.
- Never smell a gas directly; **waft** vapours gently toward your nose with a cupped hand.
- Report broken glassware, chemical spills, burns, or eye splashes to the teacher/technician immediately and label all reagent bottles clearly.

## 2. GHS Hazard Pictograms & Laboratory Examples
| Hazard Symbol | Risk Meaning | Laboratory Examples & Precaution |
|---|---|---|
| **Corrosive** | Destroys living skin tissue & corrodes metals | Conc. $\\text{H}_2\\text{SO}_4$, $\\text{HNO}_3$, $\\text{NaOH}$, $\\text{KOH}$ — wear goggles & acid-resistant gloves |
| **Flammable** | Ignites easily at room or low temperatures | Ethanol, propanone (acetone), hexane, $\\text{H}_2$ gas — keep away from naked flames |
| **Oxidising** | Supplies oxygen & intensifies fires violently | $\\text{KMnO}_4$, $\\text{K}_2\\text{Cr}_2\\text{O}_7$, conc. $\\text{HNO}_3$, $\\text{H}_2\\text{O}_2$ — isolate from flammables |
| **Toxic (Skull)** | Poisonous by inhalation, ingestion, or skin entry | Cyanides, methanol, $\\text{HgCl}_2$, lead salts — use fume hood & gloves |
| **Explosive** | Can detonate from heat, shock, or friction | Picric acid, ammonium nitrate, organic peroxides — store cool, avoid impact |
| **Irritant / Harmful** | Causes skin/eye inflammation or moderate harm | Dilute ammonia, calcium chloride, $\\text{CuSO}_4$ — wash skin after contact |
| **Radioactive** | Emits ionizing $\\alpha, \\beta, \\gamma$ radiation | Cobalt-60, Uranium salts — lead shielding, limit exposure time |
| **Biohazard** | Infectious biological agents or clinical samples | Blood cultures, bacterial plates — autoclave before disposal |

## 3. Prohibition, First Aid & Personal Protective Equipment (PPE)
- **Prohibition Signs** (red circle with slash): *No Smoking*, *No Naked Flame*, *No Food or Drink*, and *Do Not Touch / High Voltage*.
- **First Aid Emergency Signs** (green background): **Safety Shower Station** (flush full-body acid/alkali splashes for 15+ minutes), **Eye Wash Station** (irrigate open eyes upward for 15 minutes), and **First Aid Kit Box**.
- **PPE Selection**: Safety goggles protect against splashes; **nitrile/neoprene gloves** protect against solvents/acids; **respirator masks** filter dust/fumes; **lab apron & closed boots** shield torso and feet.
`,
  },
  {
    id: 'note-chem-s1-storage-fire-control-pdf',
    title: 'Chemical Compatibility Storage & Laboratory Fire Control',
    subject: 'chemistry',
    grade: 'SHS1',
    topicId: 'chem-s1-atoms',
    tags: ['SHS1', 'Chemistry-PDF', 'Storage-Matrix', 'Fire-Control', 'PASS'],
    isBuiltIn: true,
    createdAt: SEED_TIME,
    updatedAt: SEED_TIME,
    content: `# Chemical Compatibility Storage & Laboratory Fire Control

## 1. Why Chemicals Are Stored by Compatibility (Not Alphabetically)
- Alphabetical shelving creates severe accident hazards: for example, **Acetic Acid** (acid) next to **Acetone** (flammable solvent), or **Potassium Permanganate** ($\\text{KMnO}_4$, strong oxidizer) near **Ethanol** or glycerine.
- If bottles crack or spill during handling, incompatible chemicals mix and trigger **violent exothermic fires, explosions, or lethal toxic gases** (e.g. acid reacting with cyanide releases $\\text{HCN}$; acid reacting with hypochlorite bleach releases $\\text{Cl}_2$ gas).
- Therefore, GES & international prep rooms separate chemicals into **compatible hazard cabinets** with secondary spill containment trays.

## 2. Chemical Incompatibility Storage Guide
- **Inorganic Acids** ($\\text{HCl}, \\text{H}_2\\text{SO}_4, \\text{H}_3\\text{PO}_4$): Store in dedicated corrosion-resistant acid cabinets. **Incompatible with**: Alkalis/bases, oxidizing acids, cyanides, sulfides, and water-reactive metals.
- **Oxidising Acids & Oxidizers** ($\\text{HNO}_3, \\text{HClO}_4, \\text{KMnO}_4, \\text{KClO}_3$): Isolate strictly from organic acids, organic solvents (ethanol, ether, acetone), and flammable solids.
- **Alkalis / Bases** ($\\text{NaOH}, \\text{KOH}, \\text{NH}_3\\text{(aq)}$): Store separately from *all* acids (neutralization generates intense heat) and aluminium/zinc powders.
- **Organic Solvents & Flammables** (ethanol, hexane, toluene, propanone): Store in grounded, ventilated flammable-liquid safety cabinets far from oxidizers and heat sources.
- **Water-Reactive Reagents** (sodium metal $\\text{Na}$, potassium $\\text{K}$, $\\text{CaC}_2$, alkali hydrides): Store under dry paraffin oil or desiccators—*never* under sprinkler heads or sinks.
- **Inorganic Poisons** (cyanides, arsenides): Lock in ventilated poison cupboards, far away from any acid shelf.

## 3. Laboratory Fire Blanket Procedure (5 Steps)
- **Step 1 — Alert & Turn Off Sources**: Shout to alert the teacher/class and switch off nearby gas taps if safe.
- **Step 2 — Pull Blanket Cleanly**: Grip the two quick-release cloth tabs and pull downward sharply.
- **Step 3 — Shield Hands**: Wrap the top edges of the fire blanket around your hands and forearms to avoid burns.
- **Step 4 — Smother (Do Not Throw)**: Approach gently and lay the blanket over a burning beaker, pan, or person's clothing to cut off oxygen (**Stop, Drop, and Roll** for clothing fires).
- **Step 5 — Cool Down**: Leave the blanket sealed until flames die completely and heat dissipates before lifting from the far side.

## 4. Using a Fire Extinguisher — The PASS Method
- Check the extinguisher class first: **$\text{CO}_2$ / Dry Powder** for electrical or flammable liquid fires; **never spray water** on burning oil, ethanol, sodium metal, or live electrical equipment!
- **P — Pull** the safety pin to break the tamper seal.
- **A — Aim** the nozzle low at the **base of the flames** (not the upper smoke), standing at a safe 2–3 metre distance with an exit behind you.
- **S — Squeeze** the top lever steadily to discharge the extinguishing agent.
- **S — Sweep** the nozzle smoothly from side to side across the base of the fire until completely extinguished, watching for re-ignition.
`,
  },
  {
    id: 'note-chem-s1-scientific-method-pdf',
    title: 'Scientific Method of Inquiry, Hypothesis, Theory & Variables',
    subject: 'chemistry',
    grade: 'SHS1',
    topicId: 'chem-s1-atoms',
    tags: ['SHS1', 'Chemistry-PDF', 'Scientific-Method', 'Variables', 'Inquiry'],
    isBuiltIn: true,
    createdAt: SEED_TIME,
    updatedAt: SEED_TIME,
    content: `# Scientific Method of Inquiry, Hypothesis, Theory & Variables

## 1. Seven Systematic Steps of Scientific Inquiry
- **1. Observation**: Detecting a pattern or problem carefully using senses or instruments (e.g. steel gates in coastal Cape Coast rust faster than gates in Tamale).
- **2. Formulate a Question**: Turning the observation into a testable question (*Does dissolved salt accelerate the corrosion rate of iron?*).
- **3. Develop a Hypothesis**: Proposing a **testable, falsifiable** statement (*Iron nails immersed in $3\\%\\ \\text{NaCl}$ brine will rust faster than nails in distilled water*).
- **4. Design & Conduct Controlled Experiments**: Varying only one factor at a time while keeping controls constant and taking repeat measurements.
- **5. Collect & Analyse Data**: Recording quantitative tables with SI units, calculating averages, plotting graphs, and spotting anomalies.
- **6. Draw Conclusions**: Determining objectively whether the evidence supports or refutes the hypothesis.
- **7. Communicate Results & Peer Review**: Publishing clear lab reports so independent scientists can replicate or refine the work.

## 2. Hypothesis vs Scientific Theory vs Scientific Law
| Scientific Term | Meaning | Key Chemistry Example |
|---|---|---|
| **Hypothesis** | A tentative, testable prediction before experimentation | Raising temperature increases marble-acid $\\text{CO}_2$ gas evolution rate |
| **Scientific Theory** | A well-tested **explanation of WHY** natural phenomena occur, backed by broad evidence | **Kinetic Molecular Theory** / **Collision Theory** explaining reaction rates |
| **Scientific Law** | A concise mathematical or verbal statement describing **WHAT consistently happens** under set conditions | **Law of Conservation of Mass** ($m_{\\text{reactants}} = m_{\\text{products}}$), **Boyle's Law** ($P_1 V_1 = P_2 V_2$) |

## 3. Controlling Experimental Variables (WASSCE Paper 2 & 3 Essential)
- **Independent Variable**: The single factor deliberately changed by the investigator (e.g. concentration of $\\text{HCl}$ in $\\text{mol dm}^{-3}$).
- **Dependent Variable**: The factor measured as the outcome (e.g. volume of $\\text{H}_2$ gas collected in $60\\text{ s}$).
- **Controlled Variables**: Factors kept strictly equal across all trials (mass & surface area of Mg ribbon, total acid volume, room temperature) so the comparison is fair and valid.

## 4. Worked School Inquiry Case Study
- Suppose a Ghanaian SHS wants to investigate why SHS 1 students score lower in mole-concept problems than lab safety items.
- **Method**: Formulate a hypothesis (e.g. daily worked calculation drills improve mole scores), compare two groups holding teacher time constant (experimental group uses guided drills, control continues passive reading), analyze pre/post scores objectively, and communicate findings to the Science Department.
`,
  },
  {
    id: 'note-chem-s1-quantum-orbitals-pdf',
    title: 'Bohr Model, Line Spectra, Quantum Numbers & Electron Configuration',
    subject: 'chemistry',
    grade: 'SHS1',
    topicId: 'chem-s1-atoms',
    tags: ['SHS1', 'Chemistry-PDF', 'Bohr', 'Quantum-Numbers', 'Aufbau'],
    isBuiltIn: true,
    createdAt: SEED_TIME,
    updatedAt: SEED_TIME,
    content: `# Bohr Model, Line Spectra, Quantum Numbers & Electron Configuration

## 1. Bohr's Six Postulates & Key Failures
- **Bohr's Core Idea (1913)**: Electrons orbit the nucleus in fixed **stationary energy shells ($n = 1, 2, 3, \\dots$)** without radiating energy while staying in one shell.
- **Energy Absorption & Emission**: Electrons absorb a discrete quantum $\\Delta E = hf$ to jump up to a higher shell, and emit a photon of exact wavelength $\\lambda = \\frac{hc}{\\Delta E}$ when falling back down.
- **Balmer Visible Hydrogen Lines**: Transitions ending at $n = 2$ produce crisp lines at **$656\\text{ nm}$ (red)**, **$486\\text{ nm}$ (blue-green)**, **$434\\text{ nm}$ (blue)**, and **$410\\text{ nm}$ (violet)**.
- **Continuous vs Line Spectrum**: White sunlight passed through a prism yields a continuous rainbow (no gaps); excited gaseous atoms emit sharp **coloured lines on a dark background**, serving as a unique atomic fingerprint.
- **Limitations of Bohr's Model**: Fails for multi-electron atoms, cannot explain **Zeeman splitting** (magnetic field), **Stark splitting** (electric field), and violates **Heisenberg's Uncertainty Principle** by assuming sharp circular paths.

## 2. Contribution of Wave-Mechanical Quantum Theory
- **Louis de Broglie (1924)**: Proposed wave-particle duality for electrons ($\\lambda = \\frac{h}{mv}$).
- **Werner Heisenberg (1927)**: Uncertainty Principle—position and momentum of an electron cannot both be known simultaneously with arbitrary precision.
- **Erwin Schrödinger (1926)**: Replaced flat orbits with 3D probability regions called **atomic orbitals**, governed by four quantum numbers.

## 3. Four Quantum Numbers & Orbital Shapes
- **Principal Quantum Number ($n = 1, 2, 3, \\dots$)**: Main shell energy and size ($K, L, M, N, O$ shells; max electrons per shell $= 2n^2$).
- **Azimuthal / Angular Momentum ($l = 0, 1, \\dots, n-1$)**: Subshell shape: $l=0 \\rightarrow s$ (**spherical**), $l=1 \\rightarrow p$ (**dumbbell**, 3 lobes $p_x, p_y, p_z$), $l=2 \\rightarrow d$ (**5 cloverleaf orbitals**), $l=3 \\rightarrow f$ (7 complex orbitals).
- **Magnetic Quantum Number ($m_l = -l \\dots +l$)**: Spatial orientation of an orbital within a subshell (e.g. $p$ has $m_l = -1, 0, +1$).
- **Spin Quantum Number ($m_s = +\\frac{1}{2}$ or $-\\frac{1}{2}$)**: Opposite intrinsic electron spins inside one orbital.

## 4. Aufbau, Pauli, Hund's Rule & Cr/Cu Anomalies
- **Aufbau Principle**: Fill lowest-energy subshells first: $1s < 2s < 2p < 3s < 3p < 4s < 3d < 4p$.
- **Pauli Exclusion Principle**: No two electrons in the same atom can have all four quantum numbers identical (maximum 2 opposite-spin electrons per orbital).
- **Hund's Rule**: Occupy degenerate orbitals ($p_x, p_y, p_z$) singly with **parallel spins** before pairing electrons.
- **Worked Ion Examples**:
  - $_{13}\\text{Al}^{3+}$ ($10\\ e^-$): $1s^2 2s^2 2p^6$ (notice $\\text{Al}^{3+}$ loses its three outer $3s^2 3p^1$ electrons).
  - $_{16}\\text{S}^{2-}$ ($18\\ e^-$): $1s^2 2s^2 2p^6 3s^2 3p^6$.
- **Extra Stability Exceptions**: Half-filled ($d^5$) and completely filled ($d^{10}$) $d$-subshells give lower total energy:
  - **Chromium ($_{24}\\text{Cr}$)**: $[\\text{Ar}]\\ 3d^5 4s^1$ (not $3d^4 4s^2$).
  - **Copper ($_{29}\\text{Cu}$)**: $[\\text{Ar}]\\ 3d^{10} 4s^1$ (not $3d^9 4s^2$).
`,
  },
  {
    id: 'note-chem-s1-mass-spec-isotopes-pdf',
    title: 'Mass Spectrometry, Isotopes & Relative Atomic Mass Calculations',
    subject: 'chemistry',
    grade: 'SHS1',
    topicId: 'chem-s1-atoms',
    tags: ['SHS1', 'Chemistry-PDF', 'Mass-Spectrometry', 'Isotopes', 'RAM'],
    isBuiltIn: true,
    createdAt: SEED_TIME,
    updatedAt: SEED_TIME,
    content: `# Mass Spectrometry, Isotopes & Relative Atomic Mass Calculations

## 1. Relative Atomic Mass ($A_r$) & Isotopes
- **Isotopes** are atoms of the same element (identical proton number $Z$) having different numbers of neutrons ($N$) and therefore different mass numbers ($A$). Examples: $^{12}_6\\text{C}, ^{13}_6\\text{C}, ^{14}_6\\text{C}$ and $^{35}_{17}\\text{Cl}, ^{37}_{17}\\text{Cl}$.
- **Relative Atomic Mass ($A_r$)** is the weighted average mass of one atom of an element compared to $\\frac{1}{12}$ of the mass of one Carbon-12 ($^{12}\\text{C}$) atom. It has **no units**.

$$A_r = \\frac{\\sum (\\text{Isotopic Mass} \\times \\text{Percentage Abundance})}{100} = \\sum (m_i \\times f_i)$$

## 2. Five Operating Stages of a Mass Spectrometer
- **1. Vaporisation**: Solid or liquid samples are heated into a gaseous stream inside a vacuum chamber (prevents ion collisions with air molecules).
- **2. Ionisation**: High-energy electrons from an electron gun knock valence electrons off gaseous atoms ($\\text{X}_{(g)} + e^- \\rightarrow \\text{X}^+_{(g)} + 2e^-$), forming positive ions.
- **3. Acceleration**: Charged parallel electric plates accelerate positive ions into a focused fast beam of uniform kinetic energy.
- **4. Magnetic Deflection**: An electromagnet bends positive ions into circular arcs according to their **mass-to-charge ratio ($m/z$)**. **Lightest ions with smallest $m/z$ deflect the most**; neutral species are not deflected or detected.
- **5. Detection**: Ions strike an ion detector/collector, generating an electric current proportional to their natural **relative abundance**.

## 3. Interpreting a Mass Spectrum ($m/z$ vs Relative Abundance)
- For **Chlorine ($\\text{Cl}$)**: Two atomic peaks appear at $m/z = 35$ ($75\\%$ height) and $m/z = 37$ ($25\\%$ height)—a **$3 : 1$ ratio**. Molecular $\\text{Cl}_2^+$ gives three peaks at $m/z = 70, 72, 74$ in a **$9 : 6 : 1$ ratio**!
- For **Zirconium ($\\text{Zr}$)**: Five peaks ($90, 91, 92, 94, 96$) reveal five naturally occurring isotopes.

## 4. Worked WASSCE Relative Atomic Mass Problems
- **Example 1 — Boron**: $^{10}\\text{B}$ ($19.9\\%$) and $^{11}\\text{B}$ ($80.1\\%$).

$$A_r(\\text{B}) = \\frac{(10 \\times 19.9) + (11 \\times 80.1)}{100} = \\frac{199 + 881.1}{100} = 10.80$$

- **Example 2 — Chlorine**: $^{35}\\text{Cl}$ ($75.5\\%$) and $^{37}\\text{Cl}$ ($24.5\\%$).

$$A_r(\\text{Cl}) = (35 \\times 0.755) + (37 \\times 0.245) = 26.425 + 9.065 = 35.49 \\approx 35.5$$

- **Example 3 — Bromine**: $^{79}\\text{Br}$ ($78.9183\\text{ amu}$, $50.69\\%$) and $^{81}\\text{Br}$ ($80.9163\\text{ amu}$, $49.31\\%$).

$$A_r(\\text{Br}) = (78.9183 \\times 0.5069) + (80.9163 \\times 0.4931) = 40.004 + 39.900 = 79.90$$

- **Example 4 — Reverse Percentage Abundance (Copper, $A_r = 63.55$)**: Let $^{63}\\text{Cu} = x$ and $^{65}\\text{Cu} = 1 - x$. Solving $63x + 65(1 - x) = 63.55$ gives $2x = 1.45 \\implies x = 72.5\\%\\ (^{63}\\text{Cu})$ and $27.5\\%\\ (^{65}\\text{Cu})$.
`,
  },
  {
    id: 'note-chem-s1-radioactivity-pdf',
    title: 'Radioactivity, Alpha-Beta-Gamma Decay, Half-Life & Nuclear Equations',
    subject: 'chemistry',
    grade: 'SHS1',
    topicId: 'chem-s1-atoms',
    tags: ['SHS1', 'Chemistry-PDF', 'Radioactivity', 'Half-Life', 'Nuclear'],
    isBuiltIn: true,
    createdAt: SEED_TIME,
    updatedAt: SEED_TIME,
    content: `# Radioactivity, Alpha-Beta-Gamma Decay, Half-Life & Nuclear Equations

## 1. Spontaneous Nuclear Decay & Nuclear vs Chemical Reactions
- **Radioactivity** is the spontaneous disintegration of an unstable atomic nucleus (an unbalanced neutron-to-proton **$n/p$ ratio** outside the stability belt) with emission of $\\alpha, \\beta$, or $\\gamma$ radiation and energy.
- **Nuclear vs Chemical Reactions**:
  - Chemical reactions involve only **valence electrons**; elements keep their identity; rates depend strongly on temperature, pressure, and catalysts; enthalpy changes are small ($\\text{kJ mol}^{-1}$).
  - Nuclear reactions alter **protons and neutrons in the nucleus**, transforming one element into another (**transmutation**); rates are strictly unaffected by temperature or catalysts; energy release is millions of times larger ($E = \\Delta m c^2$).

## 2. Comparing Alpha ($\\alpha$), Beta ($\\beta$) & Gamma ($\\gamma$) Radiation
| Property | Alpha ($\\alpha$) | Beta ($\\beta^-$) | Gamma ($\\gamma$) |
|---|---|---|---|
| **Nature / Symbol** | Helium-4 nucleus ($^4_2\\text{He}$) | Fast nuclear electron ($^0_{-1}e$) | High-frequency EM photon ($^0_0\\gamma$) |
| **Charge & Mass** | $+2$ charge, $4\\text{ amu}$ | $-1$ charge, negligible mass | $0$ charge, $0$ rest mass |
| **Ionising Power** | Highest (intense ionization) | Moderate | Weakest direct ionization |
| **Penetration & Shielding** | Stopped by **paper or skin** | Stopped by **$5\\text{ mm}$ Aluminium** | Reduced only by **thick Lead (Pb) or concrete** |
| **Decay Shift** | $A$ drops by $4$, $Z$ drops by $2$ | $A$ unchanged, $Z$ increases by $1$ | $A$ and $Z$ unchanged (energy drop) |

## 3. Balancing Nuclear Equations (Conserve Mass $A$ and Charge $Z$)
- Always ensure $\\sum A_{\\text{reactants}} = \\sum A_{\\text{products}}$ and $\\sum Z_{\\text{reactants}} = \\sum Z_{\\text{products}}$:
  - **Alpha decay**: $^{238}_{92}\\text{U} \\rightarrow ^{234}_{90}\\text{Th} + ^4_2\\text{He}$
  - **Beta-minus decay**: $^{234}_{90}\\text{Th} \\rightarrow ^{234}_{91}\\text{Pa} + ^0_{-1}e$
  - **Positron / Neutron check**: $^{14}_6\\text{C} \\rightarrow ^{14}_7\\text{N} + ^0_{-1}e$

## 4. Half-Life ($t_{1/2}$) Formula & Worked WASSCE Calculations
$$N(t) = N_0 \\left(\\frac{1}{2}\\right)^n \\qquad \\text{where } n = \\frac{t}{t_{1/2}} \\quad \\text{and} \\quad t_{1/2} = \\frac{0.693}{\\lambda}$$

- **Example 1**: $^{226}\\text{Ra}$ has $t_{1/2} = 1600\\text{ years}$. How much of $80\\text{ g}$ remains after $4800\\text{ years}$?
  - $n = 4800 / 1600 = 3$ half-lives $\\implies N = 80 \\times (1/2)^3 = 10\\text{ g}$.
- **Example 2**: $^{131}\\text{I}$ ($t_{1/2} = 8\\text{ days}$) starts at $64\\text{ mg}$. After $32\\text{ days}$, $n = 4 \\implies 64 / 16 = 4.0\\text{ mg}$ remains.
- **Medical, Agricultural & Geological Uses**: **Technetium-99m** (PET/CT organ imaging), **Iodine-131** (thyroid treatment), **Cobalt-60** (cancer radiotherapy & food irradiation), **Carbon-14** (archaeological dating up to ~50,000 yrs), and **Uranium-238** (rock dating).
- **Safety Precaution**: Store sources inside lead-lined vaults, handle with long forceps (inverse-square law), wear film badge dosimeters, and minimize exposure duration.
`,
  },
];
