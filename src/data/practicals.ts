import type { PracticalExperiment } from '../types';

export const PRACTICAL_EXPERIMENTS: PracticalExperiment[] = [
  {
    id: 'prac-phys-projectile',
    subject: 'physics',
    grade: 'SHS1',
    title: '3D Projectile Kinematics: Range, Apex Height & Launch Angle Optimization',
    aim: 'To determine in 3D space how launch angle $\\theta$, initial velocity $u$, and gravity $g$ govern horizontal range $R$, maximum height $H$, and flight time $T$.',
    apparatus: [
      'Precision Brass Spring Launcher with calibrated protractor arc',
      'Chrome steel projectile sphere ($m = 25\\text{ g}$)',
      'Graduated distance range field and photogate timer',
    ],
    imageUrl: '/src/assets/images/lab_physics_optics_micrometer_1794870231725.webp',
    imageCaption: 'Precision Physics Metrology & Trajectory Apparatus',
    svgDiagramType: 'optics-micrometer',
    simulatorKind: 'projectile-3d',
    is3D: true,
    phetUrl: 'https://phet.colorado.edu/sims/html/projectile-motion/latest/projectile-motion_en.html',
    phetTitle: 'PhET: Projectile Motion Lab',
    procedureSteps: [
      'Set initial launch speed $u = 20\\text{ m/s}$ and angle $\\theta = 30^\\circ$, then orbit the 3D field to observe trajectory curvature.',
      'Compare $\\theta = 30^\\circ$ and $\\theta = 60^\\circ$ to confirm complementary angles achieve equal horizontal range on level ground.',
      'Adjust $\\theta = 45^\\circ$ and verify maximum range $R_{\\max} = u^2 / g$.',
    ],
    readingsTable: [
      {
        id: 'proj-1',
        parameter: 'Range at u = 20 m/s, θ = 45° (g = 9.81 m/s²)',
        unit: 'm',
        expectedValue: '40.77',
        hint: 'R = u² sin(2θ) / g.',
      },
      {
        id: 'proj-2',
        parameter: 'Max Height at u = 20 m/s, θ = 45°',
        unit: 'm',
        expectedValue: '10.19',
        hint: 'H = u² sin²(θ) / (2g).',
      },
    ],
    questions: [
      {
        id: 'pq-proj-1',
        prompt: 'Why do launch angles of $30^\\circ$ and $60^\\circ$ yield identical horizontal ranges for the same initial speed on level ground?',
        marks: 2,
        explainedAnswer:
          'From $R = \\frac{u^2 \\sin(2\\theta)}{g}$, $\\sin(60^\\circ) = \\sin(120^\\circ) = \\frac{\\sqrt{3}}{2}$. However, $60^\\circ$ spends longer in flight and reaches a higher apex.',
      },
    ],
    precautions: [
      'Clamp the launcher base firmly so recoil does not alter the launch angle.',
      'Take three trials per angle and average the horizontal range.',
    ],
  },
  {
    id: 'prac-phys-pendulum',
    subject: 'physics',
    grade: 'SHS1',
    title: '3D Simple Pendulum: Determination of Acceleration Due to Gravity (g)',
    aim: 'To investigate Simple Harmonic Motion ($T = 2\\pi\\sqrt{L/g}$) in 3D and verify how period $T$ varies with effective pendulum length $L$.',
    apparatus: [
      'Cast-iron retort stand, bosshead clamp, and cantilever arm',
      'Inextensible suspension thread and lathe-turned brass bob',
      'Protractor scale and digital stopwatch',
    ],
    imageUrl: '/src/assets/images/lab_physics_optics_micrometer_1794870231725.webp',
    imageCaption: 'Retort Stand & Simple Pendulum Oscillation Rig',
    svgDiagramType: 'optics-micrometer',
    simulatorKind: 'pendulum-3d',
    is3D: true,
    phetUrl: 'https://phet.colorado.edu/sims/html/pendulum-lab/latest/pendulum-lab_en.html',
    phetTitle: 'PhET: Pendulum Lab',
    procedureSteps: [
      'Set effective length $L = 1.00\\text{ m}$ and displace the brass bob by a small angle ($\\theta_0 \\le 15^\\circ$).',
      'Measure the time for 20 complete oscillations and compute $T = t / 20$.',
      'Vary $L$ from $0.40\\text{ m}$ to $2.00\\text{ m}$ and observe that $T^2 \\propto L$.',
    ],
    readingsTable: [
      {
        id: 'pend-1',
        parameter: 'Period T at L = 1.00 m (g = 9.81 m/s²)',
        unit: 's',
        expectedValue: '2.01',
        hint: 'Use T = 2π √(L / g).',
      },
      {
        id: 'pend-2',
        parameter: 'T² at L = 1.00 m',
        unit: 's²',
        expectedValue: '4.03',
        hint: 'Square the period T.',
      },
    ],
    questions: [
      {
        id: 'pq-pend-1',
        prompt: 'Why must the angular amplitude $\\theta_0$ remain small (typically $< 15^\\circ$) during a simple pendulum experiment?',
        marks: 2,
        explainedAnswer:
          'Simple Harmonic Motion relies on the small-angle approximation $\\sin\\theta \\approx \\theta$ (in radians). At larger angles, the restoring torque is non-linear and period increases slightly.',
      },
    ],
    precautions: [
      'Keep oscillations in a single vertical plane without conical wobbling.',
      'Count oscillations past the vertical equilibrium mark using a fiducial pointer.',
    ],
  },
  {
    id: 'prac-phys-optics',
    subject: 'physics',
    grade: 'SHS2',
    title: '3D Optical Bench: Converging Thin Lens & Real/Virtual Image Formation',
    aim: 'To verify the thin lens equation $\\frac{1}{f} = \\frac{1}{u} + \\frac{1}{v}$ and ray diagrams for a convex glass lens across real and virtual regimes.',
    apparatus: [
      'Graduated anodized aluminum optical bench rail',
      'Illuminated arrow object emitter and movable white projection screen',
      'Biconvex crown-glass lens ($n \\approx 1.52$) in brass mount',
    ],
    imageUrl: '/src/assets/images/lab_physics_optics_micrometer_1794870231725.webp',
    imageCaption: 'Optical Bench Converging Lens & Principal Rays',
    svgDiagramType: 'optics-micrometer',
    simulatorKind: 'optics-3d',
    is3D: true,
    phetUrl: 'https://phet.colorado.edu/sims/html/geometric-optics/latest/geometric-optics_en.html',
    phetTitle: 'PhET: Geometric Optics',
    procedureSteps: [
      'Set focal length $f = 15\\text{ cm}$ and place the illuminated object at $u = 30\\text{ cm}$ ($2F$).',
      'Inspect the three principal rays in 3D: parallel ray refracting through $F_2$ and central ray passing undeviated.',
      'Move $u < f$ (e.g., $u = 10\\text{ cm}$) to verify the transition to an upright, magnified virtual image.',
    ],
    readingsTable: [
      {
        id: 'opt-1',
        parameter: 'Image distance v when u = 30 cm, f = 15 cm',
        unit: 'cm',
        expectedValue: '30.00',
        hint: '1/v = 1/f - 1/u.',
      },
      {
        id: 'opt-2',
        parameter: 'Linear Magnification M at u = 2f',
        unit: '×',
        expectedValue: '1.00',
        hint: 'M = |v / u|.',
      },
    ],
    questions: [
      {
        id: 'pq-opt-1',
        prompt: 'What happens to the focused real image when the lower half of the converging lens is covered with black card?',
        marks: 2,
        explainedAnswer:
          'The complete inverted image remains visible on the screen because light from every point on the object still passes through the upper half of the lens, though image brightness is reduced by half.',
      },
    ],
    precautions: [
      'Align the optical centers of object, lens, and screen along the same horizontal axis.',
      'Perform sharp focusing in a dimmed laboratory room for high contrast.',
    ],
  },
  {
    id: 'prac-phys-micrometer',
    subject: 'physics',
    grade: 'SHS1',
    title: '3D Precision Metrology: Micrometer Screw Gauge & Zero Error Correction',
    aim: 'To measure small cylindrical diameters to $0.01\\text{ mm}$ precision using a 3D micrometer screw gauge and apply positive/negative zero error corrections.',
    apparatus: [
      '0–25 mm Micrometer Screw Gauge (0.5 mm pitch, 50 thimble divisions)',
      'Calibrated brass cylindrical test specimen',
      'Standard feeler / zero-check reference rod',
    ],
    imageUrl: '/src/assets/images/lab_physics_optics_micrometer_1794870231725.webp',
    imageCaption: 'Precision Micrometer Screw Gauge Sleeve & Thimble Assembly',
    svgDiagramType: 'optics-micrometer',
    simulatorKind: 'micrometer-3d',
    is3D: true,
    procedureSteps: [
      'Rotate the specimen diameter slider and inspect how the spindle advances $0.50\\text{ mm}$ per full thimble revolution.',
      'Read the main sleeve scale (to the nearest $0.5\\text{ mm}$) plus the coinciding thimble division $\\times 0.01\\text{ mm}$.',
      'Introduce a $+0.04\\text{ mm}$ zero error and verify $\\text{Corrected Reading} = \\text{Observed} - (+\\text{Zero Error})$.',
    ],
    readingsTable: [
      {
        id: 'mic-1',
        parameter: 'Least Count of standard 50-div micrometer (0.5 mm pitch)',
        unit: 'mm',
        expectedValue: '0.01',
        hint: 'Least Count = Pitch / Number of thimble divisions.',
      },
      {
        id: 'mic-2',
        parameter: 'Corrected diameter if raw = 6.32 mm and zero error = +0.04 mm',
        unit: 'mm',
        expectedValue: '6.28',
        hint: 'Subtract positive zero error from raw reading.',
      },
    ],
    questions: [
      {
        id: 'pq-mic-1',
        prompt: 'Why must the ratchet knob be used rather than the main thimble when tightening onto a soft metal specimen?',
        marks: 2,
        explainedAnswer:
          'The friction ratchet slips once uniform contact pressure is reached, preventing over-tightening that could deform the specimen or damage the precision screw threads.',
      },
    ],
    precautions: [
      'Wipe the anvil and spindle faces clean before checking the zero reading.',
      'Use only the ratchet stop for final contact closure.',
    ],
  },
  {
    id: 'prac-phys-ohms',
    subject: 'physics',
    grade: 'SHS3',
    title: 'Verification of Ohm’s Law & Series/Parallel Equivalent Resistance',
    aim: 'To investigate the relationship between potential difference $V$ across metallic conductors and electric current $I$, and verify series vs parallel resistance combinations.',
    apparatus: [
      'DC Power Supply / Accumulator (0–24 V)',
      'Two standard resistors ($R_1, R_2$)',
      'Digital Ammeter (0–5 A) & Voltmeter (0–24 V)',
      'Connecting leads, key switch, and rheostat',
    ],
    imageUrl: '/src/assets/images/lab_physics_optics_micrometer_1794870231725.webp',
    imageCaption: 'Physics Apparatus Setup: Electrical Resistance & Metrology Reference',
    svgDiagramType: 'optics-micrometer',
    simulatorKind: 'ohms-law',
    phetUrl: 'https://phet.colorado.edu/sims/html/circuit-construction-kit-dc/latest/circuit-construction-kit-dc_en.html',
    phetTitle: 'PhET: Circuit Construction Kit (DC)',
    procedureSteps: [
      'Connect the battery, ammeter in series with resistors $R_1$ and $R_2$, and voltmeter in parallel across the load.',
      'Set the EMF to $12.0\\text{ V}$, $R_1 = 4.0\\,\\Omega$, and $R_2 = 2.0\\,\\Omega$ in Series mode and record total current $I$.',
      'Switch the circuit topology to Parallel and compare the equivalent resistance $R_{\\text{eq}}$.',
    ],
    readingsTable: [
      {
        id: 'ohm-1',
        parameter: 'Series Total Resistance (R1=4Ω, R2=2Ω)',
        unit: 'Ω',
        expectedValue: '6.0',
        hint: 'Add R1 + R2 directly in series.',
      },
      {
        id: 'ohm-2',
        parameter: 'Series Current at V = 12 V',
        unit: 'A',
        expectedValue: '2.00',
        hint: 'Use I = V / R_total.',
      },
      {
        id: 'ohm-3',
        parameter: 'Parallel Total Resistance (R1=6Ω, R2=6Ω)',
        unit: 'Ω',
        expectedValue: '3.0',
        hint: 'Use (R1 × R2) / (R1 + R2).',
      },
    ],
    questions: [
      {
        id: 'pq-ohm-1',
        prompt: 'Explain why an ammeter must always be connected in series while a voltmeter is connected in parallel.',
        marks: 3,
        explainedAnswer:
          'An ammeter has very low internal resistance so placing it in series allows the full circuit current to pass without altering total resistance. A voltmeter has very high internal resistance so placing it in parallel draws negligible current while measuring potential difference across the component.',
      },
    ],
    precautions: [
      'Open the switch between readings to prevent Joule heating from changing resistance.',
      'Ensure all terminal connections are tight to avoid contact resistance.',
    ],
  },
  {
    id: 'prac-phys-waves',
    subject: 'physics',
    grade: 'SHS2',
    title: 'Standing Waves on a Stretched String: Harmonics, Tension & Resonance',
    aim: 'To study transverse standing waves on a vibrating sonometer wire and verify $f_n = \\frac{n}{2L}\\sqrt{\\frac{T}{\\mu}}$.',
    apparatus: [
      'Hollow wooden sonometer box with movable bridges',
      'Steel wire of known linear mass density ($\\mu = 0.0025\\text{ kg m}^{-1}$)',
      'Slotted hanger masses ($T = mg$) and variable-frequency vibrator',
    ],
    imageUrl: '/src/assets/images/lab_physics_optics_micrometer_1794870231725.webp',
    imageCaption: 'Wave Optics & Resonance Harmonic Measurement Rig',
    svgDiagramType: 'optics-micrometer',
    simulatorKind: 'wave-standing',
    phetUrl: 'https://phet.colorado.edu/sims/html/wave-on-a-string/latest/wave-on-a-string_en.html',
    phetTitle: 'PhET: Wave on a String',
    procedureSteps: [
      'Fix wire length $L = 1.0\\text{ m}$ and tension $T = 100\\text{ N}$ to obtain fundamental speed $v = 200\\text{ m/s}$.',
      'Step through harmonics $n = 1, 2, 3, 4$ and count the stationary nodes ($n+1$) and antinodes ($n$).',
      'Verify that increasing tension by $4\\times$ doubles the resonant frequency.',
    ],
    readingsTable: [
      {
        id: 'wav-1',
        parameter: 'Nodes present in the 3rd harmonic (n = 3)',
        unit: 'Nodes',
        expectedValue: '4',
        hint: 'A string fixed at both ends has n + 1 nodes.',
      },
      {
        id: 'wav-2',
        parameter: 'Wavelength λ for L = 1.2 m at 2nd harmonic (n = 2)',
        unit: 'm',
        expectedValue: '1.200',
        hint: 'Use λ = 2L / n.',
      },
    ],
    questions: [
      {
        id: 'pq-wav-1',
        prompt: 'Distinguish between a node and an antinode on a stationary wave.',
        marks: 2,
        explainedAnswer:
          'A node is a point of permanent zero displacement caused by destructive interference, whereas an antinode is a point oscillating with maximum amplitude caused by constructive interference.',
      },
    ],
    precautions: [
      'Ensure the pulley rotates smoothly without friction so hanging weight equals wire tension.',
      'Strike or drive the string gently so amplitude stays within linear elasticity.',
    ],
  },
  {
    id: 'prac-chem-titration',
    subject: 'chemistry',
    grade: 'SHS2',
    title: 'Volumetric Analysis: Acid–Base Titration of HCl against Standard NaOH',
    aim: 'To determine the exact molar concentration of hydrochloric acid ($\\text{HCl}$) by titrating $25.0\\text{ cm}^3$ aliquots against $0.100\\text{ mol dm}^{-3}$ $\\text{NaOH}$ using phenolphthalein.',
    apparatus: [
      '50 cm³ Burette mounted vertically on a retort stand',
      '25.0 cm³ Volumetric pipette and pipette filler',
      '250 cm³ Conical flask on a white porcelain tile',
      'Phenolphthalein indicator, wash bottle with distilled water',
    ],
    imageUrl: '/src/assets/images/lab_chemistry_titration_1794870231040.webp',
    imageCaption: 'WASSCE Chemistry Titration Assembly: 50 mL Burette, Conical Flask & White Tile',
    svgDiagramType: 'titration-setup',
    simulatorKind: 'titration',
    phetUrl: 'https://phet.colorado.edu/sims/html/acid-base-solutions/latest/acid-base-solutions_en.html',
    phetTitle: 'PhET: Acid-Base Solutions',
    procedureSteps: [
      'Rinse the burette with $\\text{NaOH}$ solution and fill above the $0.00\\text{ cm}^3$ mark; expel air bubbles from the jet.',
      'Pipette $25.0\\text{ cm}^3$ of $\\text{HCl}$ into a clean conical flask and add 2–3 drops of phenolphthalein.',
      'Add $\\text{NaOH}$ slowly over a white tile until a permanent pale pink color persists.',
    ],
    readingsTable: [
      {
        id: 'tit-1',
        parameter: 'Equivalence Volume of 0.10 M NaOH for 25.0 cm³ 0.10 M HCl',
        unit: 'cm³',
        expectedValue: '25.00',
        hint: '1:1 mole ratio between HCl and NaOH.',
      },
      {
        id: 'tit-2',
        parameter: 'pH at exact Equivalence Point',
        unit: 'pH',
        expectedValue: '7.00',
        hint: 'Strong acid + strong base yields neutral NaCl(aq).',
      },
    ],
    questions: [
      {
        id: 'pq-tit-1',
        prompt: 'Why is the conical flask rinsed only with distilled water before pipetting the acid, whereas the burette is rinsed with the titrant?',
        marks: 3,
        explainedAnswer:
          'Rinsing the flask with analyte acid adds extra unmeasured moles of acid and inflates the titre. Distilled water does not change the pipetted moles. Conversely, rinsing the burette with water dilutes the titrant $\\text{NaOH}$.',
      },
    ],
    precautions: [
      'Remove the funnel from the burette before taking initial readings.',
      'Read the bottom of the meniscus at eye level to eliminate parallax error.',
    ],
  },
  {
    id: 'prac-chem-gas',
    subject: 'chemistry',
    grade: 'SHS2',
    title: 'Kinetic Theory & Ideal Gas Laws: Boyle’s & Charles’ Law Verification',
    aim: 'To verify the inverse relationship between pressure and volume at constant temperature ($P_1V_1 = P_2V_2$) and kinetic collision speed dependence on $T$.',
    apparatus: [
      'Graduated airtight glass syringe / piston cylinder',
      'Bourdon pressure gauge ($\\text{kPa}$) and digital thermometer',
      'Controlled water bath / thermal jacket ($200\\text{ K}$–$600\\text{ K}$)',
    ],
    imageUrl: '/src/assets/images/lab_chemistry_titration_1794870231040.webp',
    imageCaption: 'Thermodynamic Piston Chamber & Stoichiometric Gas Analysis',
    svgDiagramType: 'titration-setup',
    simulatorKind: 'gas-laws',
    phetUrl: 'https://phet.colorado.edu/sims/html/gas-properties/latest/gas-properties_en.html',
    phetTitle: 'PhET: Gas Properties',
    procedureSteps: [
      'Hold temperature constant at $T = 300\\text{ K}$ and compress cylinder volume from $16.0\\text{ L}$ down to $4.0\\text{ L}$.',
      'Observe how halving volume doubles gas pressure while keeping the product $PV$ constant.',
      'Increase temperature to $600\\text{ K}$ at fixed volume and observe faster molecular wall collisions.',
    ],
    readingsTable: [
      {
        id: 'gas-1',
        parameter: 'Pressure of 1.0 mol gas at V = 8.0 L, T = 300 K',
        unit: 'kPa',
        expectedValue: '311.8',
        hint: 'Use P = nRT / V with R = 8.314 kPa·L/(mol·K).',
      },
      {
        id: 'gas-2',
        parameter: 'Constant PV product at T = 300 K (n = 1.0 mol)',
        unit: 'kPa·L',
        expectedValue: '2494.2',
        hint: 'PV = nRT.',
      },
    ],
    questions: [
      {
        id: 'pq-gas-1',
        prompt: 'Explain in terms of kinetic molecular theory why gas pressure rises when cylinder volume is halved at constant temperature.',
        marks: 3,
        explainedAnswer:
          'At constant temperature, average molecular kinetic energy and speed remain unchanged. Halving the volume doubles the number density of molecules per unit volume, doubling the frequency of elastic collisions per unit area of the cylinder walls.',
      },
    ],
    precautions: [
      'Wait for thermal equilibrium after each compression step before reading pressure.',
      'Lubricate the piston seal lightly so friction does not bias pressure readings.',
    ],
  },
  {
    id: 'prac-chem-thomson-crt',
    subject: 'chemistry',
    grade: 'SHS1',
    title: 'J.J. Thomson Cathode Ray Tube: Specific Charge (e/m) & Crossed E/B Fields',
    aim: 'To investigate how electric and magnetic fields deflect cathode rays and verify Thomson’s determination of electron charge-to-mass ratio ($e/m = 1.76 \\times 10^{11}\\text{ C kg}^{-1}$) independent of cathode tube gas.',
    apparatus: [
      'Evacuated glass cathode ray discharge tube with perforated anode collimator',
      'Parallel electrostatic deflection plates ($0\\text{–}400\\text{ V}$, separation $d = 2\\text{ cm}$)',
      'Crossed Helmholtz electromagnet coils ($0\\text{–}3.5\\text{ mT}$) & ZnS fluorescent screen',
      'Interchangeable low-pressure discharge gases ($\\text{H}_2$, $\\text{Ne}$, $\\text{Ar}$)',
    ],
    imageUrl: '/src/assets/images/lab_chemistry_titration_1794870231040.webp',
    imageCaption: 'J.J. Thomson Crossed Electric & Magnetic Deflection Tube',
    svgDiagramType: 'titration-setup',
    simulatorKind: 'thomson-crt',
    procedureSteps: [
      'Set Plate Voltage $V_p = +250\\text{ V}$ with magnetic field $B = 0\\text{ mT}$ and observe the beam deflecting toward the positive plate (proving negative charge).',
      'Increase the Helmholtz magnetic field $B$ until the opposing Lorentz force ($evB = eE$) restores the beam straight to $0\\text{ mm}$.',
      'Switch tube gas between $\\text{H}_2$, $\\text{Ne}$, and $\\text{Ar}$ to verify that $e/m$ remains constant across all elements.',
    ],
    readingsTable: [
      {
        id: 'crt-1',
        parameter: 'Universal electron specific charge (e/m)',
        unit: 'C kg⁻¹',
        expectedValue: '1.76e11',
        hint: 'Constant regardless of cathode metal or gas.',
      },
      {
        id: 'crt-2',
        parameter: 'Plate electric field at Vp = 250 V (d = 0.02 m)',
        unit: 'V m⁻¹',
        expectedValue: '12500',
        hint: 'Use E = V / d.',
      },
    ],
    questions: [
      {
        id: 'pq-crt-1',
        prompt: 'Why did obtaining the exact same $e/m$ ratio for different cathode metals and gases lead J.J. Thomson to conclude electrons are universal subatomic particles?',
        marks: 3,
        explainedAnswer:
          'If cathode rays had been ionized gas atoms or evaporated metal atoms, $e/m$ would have varied with the atomic mass of each gas or electrode. Because $e/m = 1.76 \\times 10^{11}\\text{ C kg}^{-1}$ remained identical across $\\text{H}_2$, $\\text{Ne}$, $\\text{Ar}$, and every metal, Thomson proved the electron is a fundamental constituent of all matter.',
      },
    ],
    precautions: [
      'Maintain low gas pressure ($\\approx 10^{-3}\\text{ mmHg}$) inside the discharge tube so electrons do not lose energy to excessive collisions.',
      'Use crossed orthogonal $E$ and $B$ fields so electrostatic and magnetic forces act along the same axis in opposite directions.',
    ],
  },
  {
    id: 'prac-chem-rutherford',
    subject: 'chemistry',
    grade: 'SHS1',
    title: 'Rutherford–Geiger–Marsden Gold Foil Experiment: Nuclear Scattering',
    aim: 'To contrast Rutherford’s nuclear scattering model against Thomson’s Plum Pudding model by observing how fast $\\alpha$-particles interact with ultra-thin gold ($Z=79$) vs aluminium ($Z=13$) foils.',
    apparatus: [
      'Lead-shielded $^{214}\\text{Bi}$ / $^{226}\\text{Ra}$ $\\alpha$-particle collimator source',
      'Ultra-thin hammered Gold foil ($Z = 79$) and Aluminium foil ($Z = 13$)',
      'Rotatable Zinc Sulphide (ZnS) scintillation detector screen & microscope',
    ],
    imageUrl: '/src/assets/images/lab_chemistry_titration_1794870231040.webp',
    imageCaption: 'Geiger–Marsden Alpha Particle Scattering & ZnS Scintillation Ring',
    svgDiagramType: 'titration-setup',
    simulatorKind: 'rutherford-scattering',
    procedureSteps: [
      'Run the simulator in Rutherford Nuclear mode with Gold foil ($Z = 79$) at $5.0\\text{ MeV}$ and count straight-through ($<2^\\circ$) vs wide-angle ($>90^\\circ$) scintillations.',
      'Toggle to Thomson Plum Pudding mode and observe why $0\\%$ backscattering occurs when positive charge is spread diffusely.',
      'Switch foil to Aluminium ($Z = 13$) or raise $\\alpha$-energy to $8.0\\text{ MeV}$ to see how closest approach $d_{\\min}$ and backscattering fraction decrease.',
    ],
    readingsTable: [
      {
        id: 'ruth-1',
        parameter: 'Distance of closest approach d_min for 5.0 MeV α on Au (Z=79)',
        unit: 'fm',
        expectedValue: '45.5',
        hint: 'd_min = (2 × Z × 1.44) / E_alpha.',
      },
      {
        id: 'ruth-2',
        parameter: 'Thomson Plum Pudding predicted backscatter (>90°)',
        unit: '%',
        expectedValue: '0',
        hint: 'Diffuse positive pudding exerts negligible peak repulsion.',
      },
    ],
    questions: [
      {
        id: 'pq-ruth-1',
        prompt: 'State the three observations of Rutherford’s gold foil experiment and the atomic deduction drawn from each.',
        marks: 4,
        explainedAnswer:
          '1) Most $\\alpha$-particles passed straight through undeflected $\\rightarrow$ most of the atom is empty space. 2) A few deflected through small angles $\\rightarrow$ positive charge repels incoming $\\alpha^{2+}$ ions. 3) Very few ($\\approx 1$ in $8000\\text{–}20000$) bounced back $>90^\\circ$ $\\rightarrow$ almost all atomic mass and positive charge is concentrated in a tiny, dense central nucleus.',
      },
    ],
    precautions: [
      'Evacuate the scattering chamber to vacuum so air molecules do not scatter or absorb $\\alpha$-particles before hitting the foil.',
      'Use ultra-thin hammered gold foil (a few hundred atoms thick) to minimize multiple sequential collisions.',
    ],
  },
  {
    id: 'prac-bio-enzyme',
    subject: 'biology',
    grade: 'SHS2',
    title: 'Biochemical Catalysis: Effect of Temperature & pH on Enzyme Activity',
    aim: 'To investigate how temperature ($5^\\circ\\text{C}$–$70^\\circ\\text{C}$) and buffer pH govern enzyme–substrate reaction rate and thermal denaturation, alongside anatomical organ plates.',
    apparatus: [
      'Salivary amylase / catalase extract and 1% starch substrate',
      'Thermostatically controlled water baths and pH buffer solutions',
      'Iodine spotting tile, stopwatch, and histological anatomy plates',
    ],
    imageUrl: '/src/assets/images/lab_biology_heart_leaf_1794870231965.webp',
    imageCaption: 'Biology Practical Plate: Mammalian Physiology & Cellular Microscopy Reference',
    svgDiagramType: 'heart-leaf',
    simulatorKind: 'enzyme-rate',
    procedureSteps: [
      'Measure reaction rate at pH 7.0 across temperatures $15^\\circ\\text{C}, 37^\\circ\\text{C},$ and $60^\\circ\\text{C}$.',
      'Identify the optimum physiological catalysis temperature ($37^\\circ\\text{C}$) where collision energy peaks without breaking hydrogen bonds.',
      'Heat above $52^\\circ\\text{C}$ or shift pH below $3.0$ to observe irreversible active-site denaturation.',
    ],
    readingsTable: [
      {
        id: 'enz-1',
        parameter: 'Optimum physiological temperature for mammalian amylase',
        unit: '°C',
        expectedValue: '37',
        hint: 'Matches human core body temperature.',
      },
      {
        id: 'enz-2',
        parameter: 'Relative rate when denatured at 65°C',
        unit: '%',
        expectedValue: '0',
        hint: 'High heat permanently distorts the active site.',
      },
    ],
    questions: [
      {
        id: 'pq-enz-1',
        prompt: 'Why does an enzyme lose catalytic activity permanently at $65^\\circ\\text{C}$ whereas activity recovers after warming from $5^\\circ\\text{C}$?',
        marks: 3,
        explainedAnswer:
          'At $5^\\circ\\text{C}$ the enzyme is merely inactivated due to low kinetic energy; its tertiary structure remains intact. At $65^\\circ\\text{C}$ excessive thermal vibration breaks hydrogen and ionic bonds maintaining the 3D active site, causing irreversible denaturation.',
      },
    ],
    precautions: [
      'Equilibrate enzyme and substrate tubes separately in the water bath before mixing.',
      'Use clean droppers for each pH buffer to avoid cross-contamination.',
    ],
  },
  {
    id: 'prac-ict-logic-network',
    subject: 'ict',
    grade: 'SHS2',
    title: 'Digital Logic Gates & Enterprise Star-Hybrid Network Topology Lab',
    aim: 'To verify Boolean truth tables using combinational digital logic gates and analyze fault tolerance in an enterprise star-hybrid topology.',
    apparatus: [
      'Digital Logic Gate Breadboard / Interactive Gate Simulator',
      'Layer-3 Core Switch, Gateway Router/Firewall, Cat6 & Optical Fiber links',
      'Workstations and Server Rack schematic',
    ],
    imageUrl: '/src/assets/images/lab_ict_network_topology_1794870232816.webp',
    imageCaption: 'Enterprise Star & Hybrid Network Topology with Core L3 Switch and Fiber Links',
    svgDiagramType: 'network-topology',
    simulatorKind: 'logic-gate',
    procedureSteps: [
      'Select each logic gate (`AND`, `OR`, `NAND`, `NOR`, `XOR`) in the interactive digital logic bench.',
      'Toggle Input A and Input B across all four binary combinations (`00`, `01`, `10`, `11`) and verify the output LED against the truth table.',
      'Inspect the network topology schematic: trace the fiber uplink from the Gateway Router to the Core L3 Switch and departmental access switches.',
    ],
    readingsTable: [
      {
        id: 'ict-1',
        parameter: 'XOR Output when A = 1, B = 1',
        unit: 'Bit',
        expectedValue: '0',
        hint: 'Exclusive OR outputs 1 only when inputs differ.',
      },
      {
        id: 'ict-2',
        parameter: 'NAND Output when A = 1, B = 1',
        unit: 'Bit',
        expectedValue: '0',
        hint: 'NAND is inverted AND.',
      },
    ],
    questions: [
      {
        id: 'pq-ict-1',
        prompt: 'In the Star-Hybrid topology diagram, what happens if one departmental access switch fails, versus if the Core L3 Switch fails?',
        marks: 3,
        explainedAnswer:
          'If a single local access switch fails, only workstations in that department lose connectivity while other departments continue operating normally. However, because the Core L3 Switch acts as the central aggregation point, its failure creates a single point of failure unless a redundant core switch is configured.',
      },
    ],
    precautions: [
      'Verify common ground references and TTL voltage levels (5 V / 0 V) in physical logic trainers.',
      'Label Cat6 and fiber patch cords at both termination ends during structured cabling.',
    ],
  },
  {
    id: 'prac-math-calculus',
    subject: 'addmaths',
    grade: 'SHS3',
    title: 'Interactive Function Plotter: Tangents, Derivatives (dy/dx) & Definite Integrals',
    aim: 'To visualize instantaneous gradient (derivative $f\'(x)$) via moving tangent lines and definite integral area $\\int_a^b f(x)\\,dx$ across polynomial and trigonometric functions.',
    apparatus: [
      'Dynamic Function & Riemann Partition Plotter',
      'Sliding Tangent Gradient Probe ($x \\in [-2.5, 4.5]$)',
      'Adjustable Lower & Upper Integration Bounds ($a, b$)',
    ],
    imageUrl: '/src/assets/images/hub_add_maths_1794871857254.webp',
    imageCaption: 'Elective Mathematics Calculus Tangent & Definite Integral Curve',
    svgDiagramType: 'optics-micrometer',
    simulatorKind: 'math-function-calc',
    procedureSteps: [
      'Select the Quadratic curve $f(x) = 0.5x^2 - 2x + 1$ and slide probe $x$ to $x = 2.0$ to verify stationary minimum gradient $\\frac{dy}{dx} = 0$.',
      'Adjust integration bounds $[a, b]$ from $0.5$ to $4.0$ and inspect the shaded signed area under the curve.',
      'Switch to Cubic and $2\\sin(x)$ curves to observe turning points and inflection behavior.',
    ],
    readingsTable: [
      {
        id: 'calc-1',
        parameter: 'Derivative dy/dx of f(x) = 0.5x² − 2x + 1 at x = 3.0',
        unit: 'slope',
        expectedValue: '1.00',
        hint: 'f\'(x) = x − 2, so f\'(3) = 1.',
      },
      {
        id: 'calc-2',
        parameter: 'Stationary minimum x-coordinate of 0.5x² − 2x + 1',
        unit: 'x',
        expectedValue: '2.0',
        hint: 'Set dy/dx = x − 2 = 0.',
      },
    ],
    questions: [
      {
        id: 'pq-calc-1',
        prompt: 'What happens to the definite integral $\\int_a^b f(x)\\,dx$ when a curve dips below the $x$-axis?',
        marks: 2,
        explainedAnswer:
          'Regions below the $x$-axis contribute negative signed area to the definite integral, whereas geometric total area requires taking $|f(x)|$ and integrating positive and negative sub-intervals separately.',
      },
    ],
    precautions: [
      'Always split definite integrals at $x$-intercept roots when asked for total enclosed geometric area.',
      'Verify second derivative $f\'\'(x) > 0$ for minimum and $f\'\'(x) < 0$ for maximum turning points.',
    ],
  },
  {
    id: 'prac-phys-radioactive-decay',
    subject: 'physics',
    grade: 'SHS3',
    title: 'Nuclear Physics & Radiochemistry: Half-Life ($T_{1/2}$) & Exponential Decay Law',
    aim: 'To investigate stochastic radioactive decay ($N(t) = N_0 e^{-\\lambda t} = N_0(1/2)^{t/T_{1/2}}$) and verify the inverse relationship between half-life $T_{1/2}$ and decay constant $\\lambda$.',
    apparatus: [
      'Simulated Radioisotope Sample Array ($N_0 = 100\\text{–}400$ nuclei)',
      'Geiger–Müller Activity Counter & Chronometer',
      'Live Exponential Decay Curve Plotter',
    ],
    imageUrl: '/src/assets/images/lab_physics_optics_micrometer_1794870231725.webp',
    imageCaption: 'Nuclear Decay Kinetics & Half-Life Activity Curve',
    svgDiagramType: 'optics-micrometer',
    simulatorKind: 'radioactive-decay',
    procedureSteps: [
      'Initialize sample size $N_0 = 400$ nuclei with half-life $T_{1/2} = 2.0\\text{ hours}$.',
      'Advance elapsed time $t$ to $2.0\\text{ h}, 4.0\\text{ h},$ and $6.0\\text{ h}$ to observe activity dropping from $50\\% \\rightarrow 25\\% \\rightarrow 12.5\\%$.',
      'Verify that $\\lambda \\cdot T_{1/2} = \\ln 2 \\approx 0.6931$.',
    ],
    readingsTable: [
      {
        id: 'nuc-1',
        parameter: 'Remaining nuclei from N₀ = 400 after 2 half-lives',
        unit: 'nuclei',
        expectedValue: '100',
        hint: '400 × (1/2)² = 100.',
      },
      {
        id: 'nuc-2',
        parameter: 'Decay constant λ when T½ = 2.0 hours',
        unit: 'h⁻¹',
        expectedValue: '0.3466',
        hint: 'λ = ln(2) / T½.',
      },
    ],
    questions: [
      {
        id: 'pq-nuc-1',
        prompt: 'Why is radioactive decay unaffected by external laboratory temperature, pressure, or chemical bonding?',
        marks: 2,
        explainedAnswer:
          'Radioactive decay originates inside the atomic nucleus, where nuclear binding energies (MeV) are millions of times greater than chemical valence or thermal kinetic energies (eV).',
      },
    ],
    precautions: [
      'Record background radiation count first and subtract it from every GM counter reading.',
      'Handle laboratory radioisotopes strictly with long tongs and lead shielding.',
    ],
  },
  {
    id: 'prac-bio-osmosis-photosynthesis',
    subject: 'biology',
    grade: 'SHS1',
    title: 'Plant Cell Osmosis (Turgidity vs Plasmolysis) & Photosynthesis Limiting Factors',
    aim: 'To observe plant cell membrane shrinkage/swelling across hypotonic, isotonic, and hypertonic solutions, and test Blackman’s Law of Limiting Factors using light intensity and $\\text{CO}_2$.',
    apparatus: [
      'Onion Epidermal Strip & Microscope Chamber',
      'Graduated Sucrose Baths ($0\\%\\text{–}6\\%$; Cell sap $\\approx 2.0\\%$)',
      'Pondweed (*Elodea*) Lamp & $\\text{NaHCO}_3$ $\\text{CO}_2$ Supply',
    ],
    imageUrl: '/src/assets/images/lab_biology_heart_leaf_1794870231965.webp',
    imageCaption: 'Cellular Osmoregulation & Leaf Photosynthesis Physiology',
    svgDiagramType: 'heart-leaf',
    simulatorKind: 'osmosis-cell',
    procedureSteps: [
      'Lower external sucrose concentration to $0.5\\%$ (hypotonic) and observe water entering the vacuole to create a **turgid** cell.',
      'Raise external sucrose above $3.0\\%$ (hypertonic) and observe cytoplasm pulling away from the cellulose wall (**plasmolysis**).',
      'Vary light intensity and $\\text{CO}_2$ percentage to identify the active limiting factor governing oxygen bubble evolution.',
    ],
    readingsTable: [
      {
        id: 'osm-1',
        parameter: 'Cell condition in 0.5% external sucrose (sap = 2.0%)',
        unit: 'state',
        expectedValue: 'Turgid',
        hint: 'Water enters down water potential gradient into vacuole.',
      },
      {
        id: 'osm-2',
        parameter: 'Cell condition in 5.0% external sucrose',
        unit: 'state',
        expectedValue: 'Plasmolysed',
        hint: 'Hypertonic bath draws water out of cell sap.',
      },
    ],
    questions: [
      {
        id: 'pq-osm-1',
        prompt: 'Why does a plant cell become turgid rather than bursting in pure distilled water, whereas a red blood cell bursts (haemolysis)?',
        marks: 3,
        explainedAnswer:
          'A plant cell is surrounded by a rigid, inelastic cellulose cell wall that exerts inward wall pressure equal to turgor pressure, halting excess water entry. An animal red blood cell lacks a cell wall and swells until the plasma membrane ruptures.',
      },
    ],
    precautions: [
      'Equilibrate epidermal tissue strips in each sucrose bath for at least 10 minutes before observing.',
      'Use a heat screen or LED lamp so water bath temperature stays constant during light-intensity trials.',
    ],
  },
  {
    id: 'prac-intsci-machines',
    subject: 'integratedscience',
    grade: 'SHS2',
    title: 'Simple Machines Workbench: Mechanical Advantage, Velocity Ratio & Efficiency',
    aim: 'To measure Mechanical Advantage ($MA = L/E$), Velocity Ratio ($VR = 1/\\sin\\theta$), and Percentage Efficiency ($\\eta = \\frac{MA}{VR}\\times 100\\%$) on an inclined plane machine.',
    apparatus: [
      'Adjustable Inclined Plane Ramp ($10^\\circ\\text{–}45^\\circ$)',
      'Standard Slotted Load Block ($100\\text{–}800\\text{ N}$)',
      'Spring Balance Effort Dynamometer ($50\\text{–}400\\text{ N}$)',
    ],
    imageUrl: '/src/assets/images/hub_integrated_sci_1794871855201.webp',
    imageCaption: 'Integrated Science Simple Machines & Energy Efficiency Workbench',
    svgDiagramType: 'optics-micrometer',
    simulatorKind: 'simple-machines',
    procedureSteps: [
      'Set Load $L = 400\\text{ N}$, Effort $E = 140\\text{ N}$, and slope angle $\\theta = 20^\\circ$.',
      'Read Velocity Ratio $VR = 1/\\sin(20^\\circ) = 2.92$ and compute $MA = L/E = 2.86$.',
      'Increase slope angle $\\theta$ and compare how $VR$ decreases while required effort increases.',
    ],
    readingsTable: [
      {
        id: 'mac-1',
        parameter: 'Ideal Velocity Ratio at slope angle θ = 30°',
        unit: 'ratio',
        expectedValue: '2.00',
        hint: 'VR = 1 / sin(30°) = 1 / 0.5.',
      },
      {
        id: 'mac-2',
        parameter: 'Efficiency η when MA = 1.60 and VR = 2.00',
        unit: '%',
        expectedValue: '80.0',
        hint: 'η = (MA / VR) × 100%.',
      },
    ],
    questions: [
      {
        id: 'pq-mac-1',
        prompt: 'Why can the efficiency of any practical simple machine never reach or exceed 100%?',
        marks: 2,
        explainedAnswer:
          'Part of the input effort work is always expended overcoming friction between moving parts and lifting the machine’s own moving weight, so useful work output is always less than total work input.',
      },
    ],
    precautions: [
      'Pull the spring balance strictly parallel to the inclined plane surface at steady uniform speed.',
      'Lubricate rolling wheels or contact surfaces to minimize kinetic friction losses.',
    ],
  },
  {
    id: 'prac-phys-kinematics-shs1',
    subject: 'physics',
    grade: 'SHS1',
    title: 'Linear Kinematics Workbench: Velocity–Time Graphs & Uniform Acceleration',
    aim: 'To verify the equations of uniformly accelerated motion ($v = u + at$ and $s = ut + \\frac{1}{2}at^2$) and interpret area under a velocity–time graph.',
    apparatus: [
      'Air-track dynamics trolley & ticker-tape / photogate timer',
      'Slotted accelerating weights and digital stopwatch',
    ],
    imageUrl: '/src/assets/images/lab_physics_optics_micrometer_1794870231725.webp',
    imageCaption: 'Grade 10 Kinematics Trolley & Velocity-Time Track',
    svgDiagramType: 'optics-micrometer',
    simulatorKind: 'kinematics-motion',
    procedureSteps: [
      'Set initial speed $u = 4\\text{ m/s}$ and constant acceleration $a = 2.0\\text{ m/s}^2$.',
      'Advance time to $t = 6.0\\text{ s}$ and compare the trapezium area under the $v\\text{–}t$ graph with $s = ut + \\frac{1}{2}at^2$.',
    ],
    readingsTable: [
      {
        id: 'kin-1',
        parameter: 'Final velocity at u=4 m/s, a=2.0 m/s², t=6.0 s',
        unit: 'm/s',
        expectedValue: '16.00',
        hint: 'v = u + at = 4 + 2(6).',
      },
      {
        id: 'kin-2',
        parameter: 'Total displacement covered in 6.0 s',
        unit: 'm',
        expectedValue: '60.00',
        hint: 'Area of trapezium = 0.5(4 + 16)(6).',
      },
    ],
    questions: [
      {
        id: 'pq-kin-1',
        prompt: 'What physical quantity does the gradient of a velocity–time graph represent?',
        marks: 2,
        explainedAnswer: 'The gradient $\\frac{\\Delta v}{\\Delta t}$ equals instantaneous acceleration ($\\text{m s}^{-2}$).',
      },
    ],
    precautions: [
      'Compensate the runway incline slightly to offset rolling friction before timing.',
    ],
  },
  {
    id: 'prac-chem-calorimetry-shs1',
    subject: 'chemistry',
    grade: 'SHS1',
    title: 'Thermal Calorimetry: Specific Heat Capacity & Method of Mixtures',
    aim: 'To verify conservation of thermal energy ($m_m c_m \\Delta T_m = m_w c_w \\Delta T_w$) when a heated metal block enters cool water in a lagged calorimeter.',
    apparatus: [
      'Polystyrene-lagged copper calorimeter & stirrer',
      'Immersion thermometer ($0\\text{–}120^\\circ\\text{C}$) & brass/copper specimen',
    ],
    imageUrl: '/src/assets/images/lab_chemistry_titration_1794870231040.webp',
    imageCaption: 'Grade 10 Calorimetry Thermal Equilibrium Apparatus',
    svgDiagramType: 'titration-setup',
    simulatorKind: 'thermal-calorimetry',
    procedureSteps: [
      'Set metal mass $0.50\\text{ kg}$ ($c = 390\\text{ J kg}^{-1}\\text{K}^{-1}$) at $100^\\circ\\text{C}$ and water mass $0.40\\text{ kg}$ at $25^\\circ\\text{C}$.',
      'Observe how heat lost by the hot metal equals heat gained by water at thermal equilibrium.',
    ],
    readingsTable: [
      {
        id: 'cal-1',
        parameter: 'Equilibrium temperature (0.5 kg Cu at 100°C in 0.4 kg H2O at 25°C)',
        unit: '°C',
        expectedValue: '32.81',
        hint: 'Balance m_m c_m (100 - T) = m_w (4200)(T - 25).',
      },
    ],
    questions: [
      {
        id: 'pq-cal-1',
        prompt: 'Why is a calorimeter enclosed in an insulating lagging jacket during mixtures experiments?',
        marks: 2,
        explainedAnswer: 'Lagging minimizes conductive and convective heat loss to the room air, ensuring heat lost by the hot solid goes solely into warming the water and inner vessel.',
      },
    ],
    precautions: [
      'Transfer the hot metal swiftly without splashing water and stir gently before reading peak equilibrium temperature.',
    ],
  },
  {
    id: 'prac-math-bearings-shs2',
    subject: 'coremath',
    grade: 'SHS2',
    title: 'Three-Figure Bearings & Trigonometric Component Lab',
    aim: 'To resolve compass journeys measured clockwise from True North into Easting ($d\\sin\\theta$) and Northing ($d\\cos\\theta$) vectors and verify return bearings.',
    apparatus: [
      'Digital Compass Rose & Vector Component Grid',
      'Graduated Azimuth Ruler',
    ],
    imageUrl: '/src/assets/images/hub_add_maths_1794871857254.webp',
    imageCaption: 'Grade 11 Bearings & Trigonometric Vector Resolution',
    svgDiagramType: 'optics-micrometer',
    simulatorKind: 'bearings-trig',
    procedureSteps: [
      'Set bearing to $090^\\circ$ and verify Easting equals full distance while Northing is $0$.',
      'Set bearing to $030^\\circ$, distance $10\\text{ km}$, and verify back bearing equals $210^\\circ$.',
    ],
    readingsTable: [
      {
        id: 'brg-1',
        parameter: 'Return bearing when forward bearing is 055°',
        unit: '°',
        expectedValue: '235',
        hint: 'Add 180° when forward bearing < 180°.',
      },
    ],
    questions: [
      {
        id: 'pq-brg-1',
        prompt: 'State the general rule for finding the back bearing from a forward bearing $\\theta$.',
        marks: 2,
        explainedAnswer: 'If $\\theta < 180^\\circ$, add $180^\\circ$; if $\\theta \\ge 180^\\circ$, subtract $180^\\circ$.',
      },
    ],
    precautions: [
      'Measure all three-figure bearings strictly clockwise starting from True North ($000^\\circ$).',
    ],
  },
  {
    id: 'prac-phys-electrostatics-shs2',
    subject: 'physics',
    grade: 'SHS2',
    title: 'Electrostatics Lab: Coulomb Inverse-Square Law & Charge Interaction',
    aim: 'To verify Coulomb’s Law ($F = \\frac{k|q_1 q_2|}{r^2}$) between two point charges and distinguish attraction from repulsion.',
    apparatus: [
      'Calibrated Torsion Force Scale & Insulated Charged Spheres ($q_1, q_2$)',
      'Centimeter Vernier Separation Track',
    ],
    imageUrl: '/src/assets/images/lab_physics_optics_micrometer_1794870231725.webp',
    imageCaption: 'Grade 11 Electrostatic Force & Coulomb Distance Probe',
    svgDiagramType: 'optics-micrometer',
    simulatorKind: 'electrostatics-field',
    procedureSteps: [
      'Compare force magnitude when separation $r$ is doubled from $10\\text{ cm}$ to $20\\text{ cm}$.',
      'Flip the sign of $q_2$ to switch between electrostatic repulsion and attraction.',
    ],
    readingsTable: [
      {
        id: 'elc-1',
        parameter: 'Force factor change when distance doubles (r -> 2r)',
        unit: 'ratio',
        expectedValue: '0.25',
        hint: 'F is proportional to 1 / r².',
      },
    ],
    questions: [
      {
        id: 'pq-elc-1',
        prompt: 'What happens to the electrostatic force between two point charges if separation is halved?',
        marks: 2,
        explainedAnswer: 'Because $F \\propto 1/r^2$, halving $r$ increases electrostatic force by $2^2 = 4$ times.',
      },
    ],
    precautions: [
      'Perform electrostatics experiments in dry air so humidity does not discharge the insulated spheres.',
    ],
  },
  {
    id: 'prac-phys-transformer-shs3',
    subject: 'physics',
    grade: 'SHS3',
    title: 'Electromagnetic Induction: AC Step-Up / Step-Down Transformer Lab',
    aim: 'To verify the transformer turns equation $\\frac{V_s}{V_p} = \\frac{N_s}{N_p}$ and power conservation $V_p I_p \\approx V_s I_s$ across step-up and step-down coils.',
    apparatus: [
      'Laminated soft-iron transformer core',
      'Interchangeable primary and secondary copper coil windings & AC meters',
    ],
    imageUrl: '/src/assets/images/lab_physics_optics_micrometer_1794870231725.webp',
    imageCaption: 'Grade 12 Mutual Induction & AC Transformer Coil Rig',
    svgDiagramType: 'optics-micrometer',
    simulatorKind: 'ac-transformer-3d',
    procedureSteps: [
      'Set $V_p = 240\\text{ V}$, $N_p = 400$, and $N_s = 100$ for a Step-Down configuration ($V_s = 60\\text{ V}$).',
      'Increase $N_s = 800$ to demonstrate Step-Up voltage transformation ($V_s = 480\\text{ V}$).',
    ],
    readingsTable: [
      {
        id: 'tx-1',
        parameter: 'Secondary voltage when Vp=240 V, Np=400, Ns=100',
        unit: 'V',
        expectedValue: '60.0',
        hint: 'Vs = Vp × (Ns / Np).',
      },
    ],
    questions: [
      {
        id: 'pq-tx-1',
        prompt: 'Why must transformer cores be laminated into thin insulated iron sheets rather than cast as one solid iron block?',
        marks: 2,
        explainedAnswer: 'Lamination increases electrical resistance perpendicular to eddy currents, drastically reducing $I^2R$ eddy-current heating losses.',
      },
    ],
    precautions: [
      'Never connect a transformer primary coil to a steady DC battery as zero changing flux will cause excessive current.',
    ],
  },
  {
    id: 'prac-bio-genetics-shs3',
    subject: 'biology',
    grade: 'SHS3',
    title: 'Mendelian Genetics: Monohybrid Inheritance & Punnett Ratio Lab',
    aim: 'To predict offspring genotype ($1:2:1$) and phenotype ($3:1$) probabilities across dominant and recessive parental crosses.',
    apparatus: [
      'Interactive Gamete Segregation Matrix ($AA, Aa, aa$)',
      'Phenotype Probability Analyzer',
    ],
    imageUrl: '/src/assets/images/lab_biology_heart_leaf_1794870231965.webp',
    imageCaption: 'Grade 12 Mendelian Segregation & Allele Cross Workbench',
    svgDiagramType: 'heart-leaf',
    simulatorKind: 'genetics-punnett',
    procedureSteps: [
      'Cross two heterozygous parents ($Aa \\times Aa$) and verify the classic $3:1$ dominant-to-recessive phenotype ratio.',
      'Perform a test cross ($Aa \\times aa$) to confirm $50\\%$ dominant and $50\\%$ recessive offspring.',
    ],
    readingsTable: [
      {
        id: 'gen-1',
        parameter: 'Dominant phenotype % from heterozygous cross (Aa × Aa)',
        unit: '%',
        expectedValue: '75',
        hint: 'AA, Aa, Aa show dominant trait (3 of 4).',
      },
    ],
    questions: [
      {
        id: 'pq-gen-1',
        prompt: 'Why is a test cross carried out with a homozygous recessive organism ($aa$)?',
        marks: 2,
        explainedAnswer: 'A homozygous recessive individual contributes only recessive $a$ alleles, so offspring phenotypes directly reveal the unknown parent’s genotype ($AA$ vs $Aa$).',
      },
    ],
    precautions: [
      'Analyze large offspring sample sizes so random gamete assortment approaches theoretical Mendelian ratios.',
    ],
  },
];


