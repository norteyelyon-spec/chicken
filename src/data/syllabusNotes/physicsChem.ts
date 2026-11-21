import type { StudyNote } from '../../types';

const CREATED_AT = '2026-01-15T08:00:00.000Z';

export const PHYSICS_CHEM_SYLLABUS_NOTES: StudyNote[] = [
  // PHYSICS (SHS 1 - 3)
  {
    id: 'syllabus-phys-s1-measurement',
    topicId: 'phys-s1-measurement',
    isBuiltIn: true,
    title: 'Unit 1.1: Physical Quantities, Dimensions & Precision Measurement',
    subject: 'physics',
    grade: 'SHS1',
    tags: ['SHS1', 'Physics', 'Dimensions', 'Vernier', 'Micrometer'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Physical Quantities, Dimensions & Precision Measurement

## Fundamental vs Derived Quantities
In mechanics, **Mass ($M$)**, **Length ($L$)**, and **Time ($T$)** are fundamental base quantities alongside electric current ($I$), thermodynamic temperature ($\\Theta$), amount of substance ($N$), and luminous intensity ($J$). Derived quantities combine base quantities via multiplication or division:
$$[X] = [M^a L^b T^c]$$

## Standard Dimensional Formulas
- **Velocity ($v = s/t$):** $[L^1 T^{-1}]$ with SI unit $\\text{m s}^{-1}$
- **Acceleration ($a = \\Delta v / t$):** $[L^1 T^{-2}]$ with SI unit $\\text{m s}^{-2}$
- **Force ($F = ma$):** $[M^1 L^1 T^{-2}]$ with SI unit $\\text{N}$
- **Work / Energy ($W = Fd$):** $[M^1 L^2 T^{-2}]$ with SI unit $\\text{J}$
- **Power ($P = W/t$):** $[M^1 L^2 T^{-3}]$ with SI unit $\\text{W}$
- **Universal Gravitation ($G = Fr^2 / m_1 m_2$):** $[M^{-1} L^3 T^{-2}]$

## Principle of Homogeneity & Precision Gauges
Every valid physical equation must share identical dimensions across all added or equated terms (e.g., $s = ut + \\frac{1}{2}at^2$ checks as $[L] = [L] + [L]$). Note that dimensionless constants ($\\frac{1}{2}, 2\\pi$) cannot be found by dimensional analysis.
$$\\text{Micrometer Reading} = \\text{MSR} + (\\text{Thimble Division} \\times 0.01\\text{ mm}) - \\text{Zero Error}$$
- **Vernier Calipers:** Least count $= 0.01\\text{ cm}$ ($0.1\\text{ mm}$).
- **Micrometer Screw Gauge:** Least count $= 0.01\\text{ mm}$; always tighten using the ratchet knob to avoid crushing soft wires.`,
  },
  {
    id: 'syllabus-phys-s1-kinematics',
    topicId: 'phys-s1-kinematics',
    isBuiltIn: true,
    title: 'Unit 1.2: Kinematics & Projectile Motion',
    subject: 'physics',
    grade: 'SHS1',
    tags: ['SHS1', 'Physics', 'Kinematics', 'Projectiles', 'SUVAT'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Kinematics & Projectile Motion

## Equations of Uniformly Accelerated Motion (SUVAT)
For motion in a straight line with constant acceleration $a$:
$$v = u + at, \\qquad s = ut + \\frac{1}{2}at^2, \\qquad v^2 = u^2 + 2as$$
- On a **velocity-time ($v$-$t$) graph**, the gradient gives instantaneous acceleration $a$ and the area beneath the curve equals displacement $s$.

## 2D Projectile Motion
When a particle is launched at speed $u$ and angle $\\theta$ above level horizontal ground (ignoring air resistance):
- **Horizontal component:** Constant velocity $u_x = u\\cos\\theta$, acceleration $a_x = 0$.
- **Vertical component:** $u_y = u\\sin\\theta$, constant downward acceleration $a_y = -g$.
$$T = \\frac{2u\\sin\\theta}{g}, \\qquad H_{\\max} = \\frac{u^2\\sin^2\\theta}{2g}, \\qquad R = \\frac{u^2\\sin(2\\theta)}{g}$$

## WASSCE Exam Insights
- Maximum horizontal range on level ground occurs at $\\theta = 45^\\circ$, giving $R_{\\max} = u^2 / g$.
- At the highest point of flight, vertical velocity $v_y = 0$, but horizontal speed $v_x = u\\cos\\theta$ remains non-zero so kinetic energy $E_k = \\frac{1}{2}m(u\\cos\\theta)^2$.`,
  },
  {
    id: 'syllabus-phys-s1-dynamics',
    topicId: 'phys-s1-dynamics',
    isBuiltIn: true,
    title: 'Unit 1.3: Forces, Momentum & Work-Energy',
    subject: 'physics',
    grade: 'SHS1',
    tags: ['SHS1', 'Physics', 'Newton', 'Momentum', 'Energy'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Forces, Momentum & Work-Energy

## Newton’s Laws & Linear Momentum
Newton’s Second Law defines net force as the rate of change of linear momentum $p = mv$:
$$F = \\frac{\\Delta p}{\\Delta t} = ma, \\qquad \\text{Impulse } J = F\\Delta t = m(v - u)$$
- **Conservation of Momentum:** In an isolated system with zero external net force, total momentum before collision equals total momentum after collision: $m_1 u_1 + m_2 u_2 = m_1 v_1 + m_2 v_2$.
- **Elastic vs Inelastic:** Both conserve momentum and total energy, whereas only **elastic collisions** conserve kinetic energy ($E_k$).

## Work, Energy & Mechanical Power
Work done by a force $F$ acting at angle $\\theta$ over displacement $d$ is:
$$W = Fd\\cos\\theta, \\qquad E_k = \\frac{1}{2}mv^2, \\qquad E_p = mgh, \\qquad P = \\frac{W}{t} = Fv$$

## Equilibrium & Friction Checklist
- Limiting static friction $F_s = \\mu_s R$ opposes impending sliding and depends on normal reaction $R$, not contact area.
- A rigid body in equilibrium satisfies $\\sum F = 0$ and $\\sum \\tau = 0$ (sum of clockwise moments equals sum of anticlockwise moments).`,
  },
  {
    id: 'syllabus-phys-s2-thermal',
    topicId: 'phys-s2-thermal',
    isBuiltIn: true,
    title: 'Unit 2.1: Thermal Physics & Ideal Gases',
    subject: 'physics',
    grade: 'SHS2',
    tags: ['SHS2', 'Physics', 'Calorimetry', 'Latent Heat', 'Gas Laws'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Thermal Physics & Ideal Gases

## Specific Heat Capacity & Latent Heat
When heat $Q$ changes temperature without a phase transition, $Q = mc\\Delta T$. During melting or boiling at constant temperature, latent heat breaks intermolecular bonds:
$$Q = mL_f \\quad \\text{(fusion)}, \\qquad Q = mL_v \\quad \\text{(vaporization)}$$
- By energy conservation in a well-lagged calorimeter: $\\text{Heat lost by hot body} = \\text{Heat gained by water + calorimeter}$.

## Ideal Gas Laws & Kinetic Theory
For a fixed mass of ideal gas with Kelvin temperature $T(\\text{K}) = T(^\\circ\\text{C}) + 273.15$:
$$\\frac{p_1 V_1}{T_1} = \\frac{p_2 V_2}{T_2}, \\qquad pV = nRT$$
- **Boyle’s Law** (constant $T$): $p \\propto 1/V$.
- **Charles’ Law** (constant $p$): $V \\propto T$.
- Mean translational kinetic energy of gas molecules depends solely on absolute temperature: $\\frac{1}{2}m\\overline{c^2} = \\frac{3}{2}k_B T$.`,
  },
  {
    id: 'syllabus-phys-s2-waves',
    topicId: 'phys-s2-waves',
    isBuiltIn: true,
    title: 'Unit 2.2: Waves, Sound & Resonance',
    subject: 'physics',
    grade: 'SHS2',
    tags: ['SHS2', 'Physics', 'Waves', 'Resonance', 'Doppler'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Waves, Sound & Resonance

## Progressive Wave Equations & Properties
All mechanical and electromagnetic waves obey $v = f\\lambda$. A transverse travelling wave moving in the $+x$ direction is described by:
$$y = A\\sin\\left(\\omega t - kx\\right) = A\\sin\\left(2\\pi ft - \\frac{2\\pi x}{\\lambda}\\right)$$
- **Phase difference:** $\\Delta \\phi = \\frac{2\\pi \\Delta x}{\\lambda}$.
- **Polarization** proves waves are transverse (light can be polarized; longitudinal sound waves cannot).

## Standing Waves & Air Column Resonance
Adjacent nodes ($N$) are separated by $\\frac{\\lambda}{2}$; distance from a node to the nearest antinode ($A$) is $\\frac{\\lambda}{4}$.
- **Closed pipe (1 end closed):** Odd harmonics only: $f_n = \\frac{nv}{4L}$ for $n = 1, 3, 5$. Fundamental $L + c = \\frac{\\lambda}{4}$.
- **Open pipe / Stretched string:** All harmonics present: $f_0 = \\frac{1}{2L}\\sqrt{\\frac{T}{\\mu}}$.

## Refraction, Diffraction & Doppler Effect
Sound diffracts noticeably around doorways because its wavelength ($\\sim 0.1 - 1\\text{ m}$) matches everyday apertures. Under the Doppler effect, pitch rises ($f' > f$) as source and observer approach each other.`,
  },
  {
    id: 'syllabus-phys-s2-optics',
    topicId: 'phys-s2-optics',
    isBuiltIn: true,
    title: 'Unit 2.3: Geometrical Optics & Thin Lenses',
    subject: 'physics',
    grade: 'SHS2',
    tags: ['SHS2', 'Physics', 'Optics', 'Lenses', 'Refraction'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Geometrical Optics & Thin Lenses

## Snell’s Law & Total Internal Reflection (TIR)
When light crosses a boundary from medium $1$ to medium $2$:
$$n_1 \\sin i = n_2 \\sin r, \\qquad n = \\frac{\\text{Real Depth}}{\\text{Apparent Depth}} = \\frac{c}{v}$$
- **Total Internal Reflection** requires two conditions: (1) light travels from optically denser to less dense medium ($n_1 > n_2$), and (2) angle of incidence exceeds critical angle $c = \\sin^{-1}(n_2 / n_1)$.

## Thin Lens Equation & Magnification
Using the real-is-positive sign convention ($f > 0$ converging, $f < 0$ diverging, $v < 0$ virtual):
$$\\frac{1}{f} = \\frac{1}{u} + \\frac{1}{v}, \\qquad m = \\frac{h_i}{h_o} = \\frac{|v|}{u}, \\qquad P(\\text{dioptres}) = \\frac{1}{f(\\text{m})}$$

## Optical Defects & Instruments
- **Myopia (short-sightedness):** Distant rays focus in front of retina; corrected with a **diverging (concave) lens**.
- **Hypermetropia (long-sightedness):** Near rays focus behind retina; corrected with a **converging (convex) lens**.`,
  },
  {
    id: 'syllabus-phys-s3-electricity',
    topicId: 'phys-s3-electricity',
    isBuiltIn: true,
    title: 'Unit 3.1: Current Electricity & Kirchhoff Circuits',
    subject: 'physics',
    grade: 'SHS3',
    tags: ['SHS3', 'Physics', 'Circuits', 'Kirchhoff', 'Internal Resistance'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Current Electricity & Kirchhoff Circuits

## Resistance, EMF & Internal Resistance
Wire resistance scales with length $L$ and inversely with cross-sectional area $A$: $R = \\rho L / A$. A real cell with EMF $E$ and internal resistance $r$ obeys:
$$E = I(R + r) = V_{\\text{terminal}} + Ir, \\qquad V_{\\text{terminal}} = E - Ir$$
- Maximum external power transfer occurs when load resistance matches internal resistance ($R = r$).

## Kirchhoff’s Laws & Null Bridges
- **Junction Law (KCL):** $\\sum I_{\\text{in}} = \\sum I_{\\text{out}}$ (conservation of charge).
- **Loop Law (KVL):** $\\sum E = \\sum IR$ around any closed loop (conservation of energy).
- **Wheatstone / Metre Bridge balance:** $\\frac{R_1}{R_2} = \\frac{l_1}{100 - l_1}$. A **potentiometer** measures true EMF because zero current flows from the test cell at balance point.`,
  },
  {
    id: 'syllabus-phys-s3-electromagnetism',
    topicId: 'phys-s3-electromagnetism',
    isBuiltIn: true,
    title: 'Unit 3.2: Electromagnetic Induction & AC Circuits',
    subject: 'physics',
    grade: 'SHS3',
    tags: ['SHS3', 'Physics', 'Faraday', 'Transformers', 'AC RLC'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Electromagnetic Induction & AC Circuits

## Faraday’s & Lenz’s Laws
Magnetic flux linkage $\\Phi = NBA\\cos\\theta$. Induced EMF opposes the change in flux producing it (conservation of energy):
$$\\mathcal{E} = -N\\frac{d\\Phi}{dt}, \\qquad \\frac{V_s}{V_p} = \\frac{N_s}{N_p}$$
- **Transformers** step AC voltages up for grid transmission ($P_{\\text{loss}} = I^2 R$ drops sharply when current $I$ is reduced) and use laminated soft-iron cores to minimize eddy currents.

## Alternating Current & Series RLC Resonance
Root-mean-square values relate to peak amplitude via $I_{\\text{rms}} = I_0 / \\sqrt{2}$ and $V_{\\text{rms}} = V_0 / \\sqrt{2}$. Reactances are $X_L = 2\\pi f L$ and $X_C = \\frac{1}{2\\pi f C}$:
$$Z = \\sqrt{R^2 + (X_L - X_C)^2}, \\qquad f_r = \\frac{1}{2\\pi\\sqrt{LC}}$$
At resonance ($X_L = X_C$), impedance is minimum ($Z = R$), current peaks, and power factor $\\cos\\phi = R/Z = 1$.`,
  },
  {
    id: 'syllabus-phys-s3-nuclear',
    topicId: 'phys-s3-nuclear',
    isBuiltIn: true,
    title: 'Unit 3.3: Photoelectric Effect & Nuclear Physics',
    subject: 'physics',
    grade: 'SHS3',
    tags: ['SHS3', 'Physics', 'Photoelectric', 'Nuclear', 'Half-Life'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Photoelectric Effect & Nuclear Physics

## Einstein’s Photoelectric Equation
Light delivers energy in discrete photons $E = hf = hc/\\lambda$. Electrons are emitted from a metal surface only if incident frequency $f \\ge f_0$ (threshold frequency), regardless of intensity:
$$hf = \\Phi_0 + E_{k,\\max} = hf_0 + eV_s$$
- Increasing light **intensity** (for $f > f_0$) increases photoelectron current; increasing **frequency** increases stopping potential $V_s$ and $E_{k,\\max}$.

## Radioactive Decay & Binding Energy
$$N = N_0 e^{-\\lambda t} = N_0\\left(\\frac{1}{2}\\right)^{t / t_{1/2}}, \\qquad t_{1/2} = \\frac{\\ln 2}{\\lambda}$$
- **Alpha decay ($^4_2\\text{He}$):** Mass number $A$ decreases by 4, atomic number $Z$ decreases by 2.
- **Beta-minus decay ($^0_{-1}e$):** $A$ unchanged, $Z$ increases by 1 ($n \\rightarrow p + e^- + \\bar{\\nu}_e$).
- **Mass-Energy Equivalence:** $\\Delta E = (\\Delta m)c^2$; nuclei with highest binding energy per nucleon (near $^{56}\\text{Fe}$) are most stable.`,
  },

  // CHEMISTRY (SHS 1 - 3)
  {
    id: 'syllabus-chem-s1-atoms',
    topicId: 'chem-s1-atoms',
    isBuiltIn: true,
    title: 'Unit 1.1: Atomic Theory, Models & Periodic Trends',
    subject: 'chemistry',
    grade: 'SHS1',
    tags: ['SHS1', 'Chemistry', 'Atomic Theory', 'Orbitals', 'Periodic Trends'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Atomic Theory, Models & Periodic Trends

## Evolution of Atomic Models
1. **Dalton (1808):** Atoms are indivisible; modified after subatomic particles ($p^+, n^0, e^-$) and isotopes were discovered.
2. **Thomson Plum Pudding (1904):** Measured electron $e/m = 1.76 \\times 10^{11}\\text{ C kg}^{-1}$ and proposed negative electrons embedded in a uniform positive sphere.
3. **Rutherford Nuclear (1911):** Gold-foil $\\alpha$-scattering showed most space is empty with a tiny, dense positive nucleus ($\\sim 10^{-15}\\text{ m}$).
4. **Bohr (1913) & Quantum Mechanics:** Quantized stationary shells ($\\Delta E = hf$) evolved into 3D probability orbitals shaped by quantum numbers $(n, l, m_l, m_s)$.

## Mass Spectrometry & Electron Configuration
$$A = Z + N, \\qquad A_r = \\sum (m_i \\times \\text{fractional abundance}_i)$$
- **Mass Spectrometer Stages:** Vaporization $\\rightarrow$ Ionization $\\rightarrow$ Acceleration $\\rightarrow$ Magnetic Deflection (lightest $m/z$ bends most) $\\rightarrow$ Detection.
- **Rules:** Aufbau, Pauli Exclusion, and Hund’s rule. Note WASSCE exceptions: $_{24}\\text{Cr} = [\\text{Ar}]\\,3d^5 4s^1$ and $_{29}\\text{Cu} = [\\text{Ar}]\\,3d^{10} 4s^1$.

## Periodic Trends Across Period 3 & Groups
- Across a period: Nuclear charge rises with constant shielding, so atomic radius decreases while first ionization energy and electronegativity generally increase.`,
  },
  {
    id: 'syllabus-chem-s1-bonding',
    topicId: 'chem-s1-bonding',
    isBuiltIn: true,
    title: 'Unit 1.2: Chemical Bonding & Molecular Geometry',
    subject: 'chemistry',
    grade: 'SHS1',
    tags: ['SHS1', 'Chemistry', 'VSEPR', 'Hybridization', 'Intermolecular Forces'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Chemical Bonding & Molecular Geometry

## Primary Chemical Bonds
- **Ionic (Electrovalent):** Complete electron transfer between electropositive metals and electronegative non-metals forming giant 3D crystal lattices (high melting point, conduct only when molten or aqueous).
- **Covalent & Coordinate (Dative):** Shared electron pairs between non-metals; in coordinate bonds (e.g., $\\text{NH}_4^+, \\text{H}_3\\text{O}^+$), both shared electrons originate from one donor atom.
- **Metallic:** Positive metal kernels immersed in a sea of delocalized valence electrons, explaining malleability and electrical conductivity.

## VSEPR Shapes & Hybridization
Lone-pair–lone-pair repulsion $>$ lone-pair–bond-pair $>$ bond-pair–bond-pair:
| Molecule | Regions ($sp$ type) | Lone Pairs | Geometry | Bond Angle |
| :--- | :--- | :--- | :--- | :--- |
| $\\text{BeCl}_2 / \\text{CO}_2$ | 2 ($sp$) | 0 | Linear | $180^\\circ$ |
| $\\text{BF}_3$ | 3 ($sp^2$) | 0 | Trigonal Planar | $120^\\circ$ |
| $\\text{CH}_4$ | 4 ($sp^3$) | 0 | Tetrahedral | $109.5^\\circ$ |
| $\\text{NH}_3$ | 4 ($sp^3$) | 1 | Trigonal Pyramidal | $107^\\circ$ |
| $\\text{H}_2\\text{O}$ | 4 ($sp^3$) | 2 | Bent / V-shaped | $104.5^\\circ$ |

## Intermolecular Forces
Strength order: Hydrogen bonding ($\\text{H}$ bonded to $\\text{F, O, N}$) $>$ Permanent dipole–dipole $>$ London dispersion forces. This explains why $\\text{H}_2\\text{O}$ boils at $100^\\circ\\text{C}$ while $\\text{H}_2\\text{S}$ is a gas.`,
  },
  {
    id: 'syllabus-chem-s1-stoichiometry',
    topicId: 'chem-s1-stoichiometry',
    isBuiltIn: true,
    title: 'Unit 1.3: Mole Concept & Stoichiometry',
    subject: 'chemistry',
    grade: 'SHS1',
    tags: ['SHS1', 'Chemistry', 'Mole', 'Titration', 'Limiting Reagent'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Mole Concept & Stoichiometry

## Mole Relationships
One mole contains Avogadro’s constant $N_A = 6.02 \\times 10^{23}$ particles and occupies $22.4\\text{ dm}^3$ at s.t.p.:
$$n = \\frac{m}{M} = C \\times V(\\text{dm}^3) = \\frac{V_{\\text{gas}}}{22.4\\text{ dm}^3}$$

## Empirical Formula, Limiting Reagent & Yield
1. Divide mass or percentage of each element by $A_r$, divide all results by the smallest mole ratio, and multiply to obtain whole integers.
2. Always identify the **limiting reagent** before computing product mass or gas volume; percentage yield $= \\frac{\\text{Actual Yield}}{\\text{Theoretical Yield}} \\times 100\\%$.

## Volumetric Titration Calculations
For acid $A$ reacting with base $B$ in stoichiometric ratio $n_a : n_b$:
$$\\frac{C_a V_a}{C_b V_b} = \\frac{n_a}{n_b}$$
- **Methyl orange** (red in acid, yellow in alkali) works best for strong acid + weak base (e.g., $\\text{HCl}$ vs $\\text{Na}_2\\text{CO}_3$); **phenolphthalein** works for weak acid + strong base ($\\text{CH}_3\\text{COOH}$ vs $\\text{NaOH}$).`,
  },
  {
    id: 'syllabus-chem-s2-energetics',
    topicId: 'chem-s2-energetics',
    isBuiltIn: true,
    title: 'Unit 2.1: Chemical Energetics & Hess’s Law',
    subject: 'chemistry',
    grade: 'SHS2',
    tags: ['SHS2', 'Chemistry', 'Enthalpy', 'Hess Law', 'Gibbs Energy'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Chemical Energetics & Hess’s Law

## Exothermic vs Endothermic Enthalpy Changes
- **Exothermic ($\\Delta H < 0$):** Heat released to surroundings (combustion, neutralization); products sit lower on an energy profile diagram.
- **Endothermic ($\\Delta H > 0$):** Heat absorbed from surroundings (thermal decomposition). Activation energy $E_a$ is lowered by catalysts without altering $\\Delta H$.

## Hess’s Law & Bond Enthalpy Cycles
Total enthalpy change is independent of the pathway taken between initial and final states:
$$\\Delta H_{\\text{rxn}} = \\sum \\Delta H_f^\\circ(\\text{products}) - \\sum \\Delta H_f^\\circ(\\text{reactants}) = \\sum E(\\text{bonds broken}) - \\sum E(\\text{bonds formed})$$

## Entropy & Gibbs Free Energy
Entropy $S$ measures disorder ($S_{\\text{gas}} > S_{\\text{liquid}} > S_{\\text{solid}}$). A process is thermodynamically feasible (spontaneous) when:
$$\\Delta G = \\Delta H - T\\Delta S < 0$$`,
  },
  {
    id: 'syllabus-chem-s2-kinetics',
    topicId: 'chem-s2-kinetics',
    isBuiltIn: true,
    title: 'Unit 2.2: Rates of Reaction & Chemical Equilibrium',
    subject: 'chemistry',
    grade: 'SHS2',
    tags: ['SHS2', 'Chemistry', 'Kinetics', 'Le Chatelier', 'Equilibrium'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Rates of Reaction & Chemical Equilibrium

## Collision Theory & Rate Laws
Rate increases with temperature (more molecules exceed $E_a$ on the Maxwell-Boltzmann distribution), concentration/pressure, surface area, and positive catalysts:
$$\\text{Rate} = k[A]^m[B]^n, \\qquad \\text{Overall Order} = m + n$$

## Dynamic Equilibrium & $K_c / K_p$
For $aA + bB \\rightleftharpoons cC + dD$:
$$K_c = \\frac{[C]^c [D]^d}{[A]^a [B]^b}$$
- **Crucial WASSCE Rule:** Only **temperature** changes the numerical value of $K_c$ or $K_p$. Concentration, pressure, and catalysts leave $K_c$ unchanged!

## Le Chatelier’s Principle
- Raising pressure shifts equilibrium toward the side with **fewer moles of gas**.
- Raising temperature shifts equilibrium in the **endothermic ($\\Delta H > 0$) direction**.
- Adding a catalyst speeds up forward and reverse rates equally—equilibrium is reached faster without shifting yield.`,
  },
  {
    id: 'syllabus-chem-s2-acids',
    topicId: 'chem-s2-acids',
    isBuiltIn: true,
    title: 'Unit 2.3: Acids, Bases, pH & Solubility Equilibria',
    subject: 'chemistry',
    grade: 'SHS2',
    tags: ['SHS2', 'Chemistry', 'Acids', 'pH', 'Buffers', 'Ksp'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Acids, Bases, pH & Solubility Equilibria

## Brønsted-Lowry & Lewis Definitions
- **Brønsted-Lowry:** Acid is a proton ($\\text{H}^+$) donor; base is a proton acceptor forming conjugate acid–base pairs (e.g., $\\text{NH}_3 / \\text{NH}_4^+$).
- **Lewis:** Acid is an electron-pair acceptor ($\\text{BF}_3, \\text{AlCl}_3$); base is an electron-pair donor.

## pH, $K_a$, $K_w$ & Buffers
$$\\text{pH} = -\\log_{10}[\\text{H}^+], \\qquad \\text{pH} + \\text{pOH} = 14\\;(25^\\circ\\text{C}), \\qquad [\\text{H}^+]_{\\text{weak}} = \\sqrt{K_a C}$$
- **Buffer Solution:** Resists pH change upon adding small acid/base; acidic buffers pair a weak acid with its conjugate salt ($\\text{CH}_3\\text{COOH} + \\text{CH}_3\\text{COONa}$): $\\text{pH} = \\text{p}K_a + \\log\\frac{[\\text{Salt}]}{[\\text{Acid}]}$.

## Solubility Product ($K_{sp}$) & Common Ion Effect
For $\\text{AgCl}_{(s)} \\rightleftharpoons \\text{Ag}^+ + \\text{Cl}^-$, $K_{sp} = [\\text{Ag}^+][\\text{Cl}^-]$. Precipitation occurs whenever ionic product $Q_{sp} > K_{sp}$. Adding a common ion reduces solubility without altering $K_{sp}$.`,
  },
  {
    id: 'syllabus-chem-s3-redox',
    topicId: 'chem-s3-redox',
    isBuiltIn: true,
    title: 'Unit 3.1: Redox Reactions & Electrochemistry',
    subject: 'chemistry',
    grade: 'SHS3',
    tags: ['SHS3', 'Chemistry', 'Redox', 'Electrochemistry', 'Faraday'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Redox Reactions & Electrochemistry

## Oxidation, Reduction & Galvanic Cells
- **OIL RIG:** Oxidation Is Loss of electrons (increase in oxidation number); Reduction Is Gain.
- In any cell (galvanic or electrolytic), **oxidation occurs at the Anode** and **reduction occurs at the Cathode** ("An Ox, Red Cat").
$$E^\\circ_{\\text{cell}} = E^\\circ_{\\text{cathode}} - E^\\circ_{\\text{anode}}$$
A reaction is spontaneous under standard conditions if $E^\\circ_{\\text{cell}} > 0$. The salt bridge ($\\text{KNO}_3$) completes the circuit and preserves electrical neutrality.

## Electrolysis & Faraday’s Laws
1 Faraday $= 96,500\\text{ C mol}^{-1}$. Mass $m$ deposited by current $I$ over time $t$ (seconds) for ion charge $z$:
$$Q = It, \\qquad m = \\frac{M I t}{z F}$$
- Selective discharge depends on standard electrode potential $E^\\circ$, ion concentration (high $[\\text{Cl}^-]$ favors $\\text{Cl}_2$ over $\\text{O}_2$ in brine), and electrode nature (active vs inert).`,
  },
  {
    id: 'syllabus-chem-s3-organic',
    topicId: 'chem-s3-organic',
    isBuiltIn: true,
    title: 'Unit 3.2: Organic Chemistry & Functional Groups',
    subject: 'chemistry',
    grade: 'SHS3',
    tags: ['SHS3', 'Chemistry', 'Organic', 'IUPAC', 'Esterification'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Organic Chemistry & Functional Groups

## Homologous Series & Isomerism
Members of a homologous series share the same general formula, functional group, and chemical properties while differing by $-\\text{CH}_2-$ ($14\\text{ g mol}^{-1}$).
- **Alkanes ($\\text{C}_n\\text{H}_{2n+2}$):** Saturated; undergo UV free-radical substitution.
- **Alkenes ($\\text{C}_n\\text{H}_{2n}$):** Unsaturated ($\\text{C=C}$); decolorize bromine water and $\\text{KMnO}_4$; follow **Markovnikov’s rule** ($\\text{H}$ adds to carbon with more $\\text{H}$ atoms).

## Alkanols, Alkanoic Acids & Esters
- **Oxidation with acidified $\\text{K}_2\\text{Cr}_2\\text{O}_7$:** Primary alcohols $\\rightarrow$ alkanals $\\rightarrow$ alkanoic acids (orange turns green); secondary alcohols $\\rightarrow$ alkanones; tertiary alcohols resist oxidation.
$$\\text{RCOOH} + \\text{R'OH} \\xrightleftharpoons{\\text{conc. H}_2\\text{SO}_4} \\text{RCOOR'} + \\text{H}_2\\text{O}$$
- **Saponification:** Alkaline hydrolysis of esters/fats with $\\text{NaOH}$ yields soap (carboxylate salt) and glycerol.`,
  },
  {
    id: 'syllabus-chem-s3-qualitative',
    topicId: 'chem-s3-qualitative',
    isBuiltIn: true,
    title: 'Unit 3.3: Qualitative Analysis & Industrial Chemistry',
    subject: 'chemistry',
    grade: 'SHS3',
    tags: ['SHS3', 'Chemistry', 'Qualitative Analysis', 'Haber', 'Contact'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Qualitative Analysis & Industrial Chemistry

## Cation Identification ($\text{NaOH}$ & $\\text{NH}_3$ Tests)
| Cation | + Dropwise $\\text{NaOH}$ | Excess $\\text{NaOH}$ | + Excess $\\text{NH}_3$ |
| :--- | :--- | :--- | :--- |
| $\\text{Ca}^{2+}$ | White ppt | Insoluble | No ppt |
| $\\text{Zn}^{2+}$ | White gelatinous ppt | Soluble (colorless) | Soluble (colorless) |
| $\\text{Al}^{3+} / \\text{Pb}^{2+}$ | White ppt | Soluble (colorless) | Insoluble (white ppt) |
| $\\text{Cu}^{2+}$ | Blue ppt | Insoluble | Deep royal-blue solution |
| $\\text{Fe}^{2+} / \\text{Fe}^{3+}$ | Green / Red-brown ppt | Insoluble | Insoluble |

## Anion Tests & Major Industrial Processes
- **Halides** (acidified $\\text{HNO}_3 + \\text{AgNO}_3$): $\\text{Cl}^-$ white ppt (soluble in $\\text{NH}_3$), $\\text{Br}^-$ cream ppt, $\\text{I}^-$ pale-yellow ppt (insoluble).
- **Sulfate ($\\text{SO}_4^{2-}$):** White $\\text{BaSO}_4$ ppt insoluble in dilute $\\text{HCl}$.
- **Haber Process:** $\\text{N}_2 + 3\\text{H}_2 \\rightleftharpoons 2\\text{NH}_3$ ($450^\\circ\\text{C}, 200\\text{ atm}$, Finely divided $\\text{Fe}$ catalyst).
- **Contact Process:** $2\\text{SO}_2 + \\text{O}_2 \\rightleftharpoons 2\\text{SO}_3$ using $\\text{V}_2\\text{O}_5$ catalyst.`,
  },
];
