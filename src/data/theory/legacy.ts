import type { TheoryQuestion } from '../../types';

export const LEGACY_THEORY_QUESTIONS: TheoryQuestion[] = [
  // PHYSICS (3 multi-part theory questions across SHS 1, 2, 3)
  {
    id: 'theo-phys-1',
    subject: 'physics',
    grade: 'SHS1',
    topicId: 'phys-s1-kinematics',
    topicTitle: 'Kinematics & Projectile Motion',
    yearTag: 'WASSCE Paper 2 · 2023',
    title: 'Projectile Launch & Momentum Conservation',
    contextPrompt:
      'A ball of mass $0.50\\text{ kg}$ is projected from level ground with an initial velocity of $30\\text{ m s}^{-1}$ at an angle of $60^\\circ$ above the horizontal. Take $g = 10\\text{ m s}^{-2}$ and ignore air resistance.',
    totalMarks: 10,
    parts: [
      {
        label: '(a)',
        prompt: 'Calculate the initial horizontal and vertical components of the ball’s velocity.',
        marks: 2,
        markingScheme:
          '$u_x = u\\cos 60^\\circ = 30 \\times 0.50 = 15.0\\text{ m s}^{-1}$ [1 mark].\n$u_y = u\\sin 60^\\circ = 30 \\times 0.866 = 25.98\\text{ m s}^{-1}$ (or $15\\sqrt{3}\\text{ m s}^{-1}$) [1 mark].',
        keyScoringPoints: [
          'Correct trigonometric decomposition for $u_x = 15.0\\text{ m s}^{-1}$ (1 mark)',
          'Correct vertical component $u_y \\approx 26.0\\text{ m s}^{-1}$ (1 mark)',
        ],
      },
      {
        label: '(b)(i)',
        prompt: 'Determine the total time of flight and the horizontal range covered before hitting the ground.',
        marks: 5,
        markingScheme:
          'Time of flight $T = \\frac{2u_y}{g} = \\frac{2 \\times 25.98}{10} = 5.20\\text{ s}$ [2 marks].\nHorizontal range $R = u_x \\times T = 15.0 \\times 5.20 = 77.94\\text{ m}$ (or $45\\sqrt{3}\\text{ m}$) [3 marks].',
        keyScoringPoints: [
          'Formula $T = 2u\\sin\\theta / g$ stated and substituted (1 mark)',
          'Time of flight $T = 5.20\\text{ s}$ with unit (1 mark)',
          'Range $R = u_x T$ (or $u^2\\sin 2\\theta / g$) correctly evaluated as $77.9\\text{ m}$ (3 marks)',
        ],
      },
      {
        label: '(b)(ii)',
        prompt: 'State the kinetic energy of the ball at the highest point of its trajectory.',
        marks: 3,
        markingScheme:
          'At maximum height, vertical velocity $v_y = 0$, so speed equals horizontal velocity $v = u_x = 15.0\\text{ m s}^{-1}$ [1 mark].\n$E_k = \\frac{1}{2}mv^2 = \\frac{1}{2}(0.50)(15.0)^2 = 56.25\\text{ J}$ [2 marks].',
        keyScoringPoints: [
          'Recognizes $v_y = 0$ so only $u_x = 15\\text{ m s}^{-1}$ remains at apex (1 mark)',
          'Correct substitution and unit $E_k = 56.25\\text{ J}$ (2 marks)',
        ],
      },
    ],
  },
  {
    id: 'theo-phys-2',
    subject: 'physics',
    grade: 'SHS2',
    topicId: 'phys-s2-optics',
    topicTitle: 'Geometrical Optics & Thin Lenses',
    yearTag: 'WASSCE Paper 2 · 2022',
    title: 'Thin Converging Lens Image Formation',
    contextPrompt:
      'An illuminated object $4.0\\text{ cm}$ tall is placed $24.0\\text{ cm}$ in front of a thin converging lens of focal length $16.0\\text{ cm}$.',
    totalMarks: 8,
    parts: [
      {
        label: '(a)',
        prompt: 'Calculate the image distance $v$ from the optical centre and state the nature of the image.',
        marks: 4,
        markingScheme:
          '$\\frac{1}{f} = \\frac{1}{u} + \\frac{1}{v} \\implies \\frac{1}{16} = \\frac{1}{24} + \\frac{1}{v} \\implies \\frac{1}{v} = \\frac{3 - 2}{48} = \\frac{1}{48} \\implies v = +48.0\\text{ cm}$ [3 marks].\nSince $v > 0$, the image is real and inverted [1 mark].',
        keyScoringPoints: [
          'Lens equation with correct sign convention (1 mark)',
          'Correct computation $v = 48.0\\text{ cm}$ (2 marks)',
          'Nature stated as real and inverted (1 mark)',
        ],
      },
      {
        label: '(b)(i)',
        prompt: 'Determine the height of the image formed.',
        marks: 2,
        markingScheme:
          'Magnification $m = \\frac{v}{u} = \\frac{48.0}{24.0} = 2.0$. Image height $h_i = m \\times h_o = 2.0 \\times 4.0 = 8.0\\text{ cm}$ [2 marks].',
        keyScoringPoints: [
          'Correct magnification $m = 2.0$ (1 mark)',
          'Image height $8.0\\text{ cm}$ (1 mark)',
        ],
      },
      {
        label: '(b)(ii)',
        prompt: 'Explain briefly what happens to the image if the lower half of the lens is covered with opaque black card.',
        marks: 2,
        markingScheme:
          'A complete inverted image is still formed at $v = 48.0\\text{ cm}$ because light rays from every point on the object still pass through the upper half [1 mark], but the image brightness/intensity is reduced by half [1 mark].',
        keyScoringPoints: [
          'Full image remains intact (1 mark)',
          'Image brightness/intensity decreases (1 mark)',
        ],
      },
    ],
  },
  {
    id: 'theo-phys-3',
    subject: 'physics',
    grade: 'SHS3',
    topicId: 'phys-s3-electricity',
    topicTitle: 'Current Electricity & Kirchhoff Circuits',
    yearTag: 'WASSCE Paper 2 · 2021',
    title: 'EMF, Internal Resistance & Circuit Power',
    contextPrompt:
      'A battery of EMF $E$ and internal resistance $r$ delivers a current of $0.80\\text{ A}$ when connected across a $5.0\\,\\Omega$ resistor, and $0.50\\text{ A}$ when connected across a $9.0\\,\\Omega$ resistor.',
    totalMarks: 9,
    parts: [
      {
        label: '(a)',
        prompt: 'Write two simultaneous equations relating $E, r$ and the external loads, and solve for $E$ and $r$.',
        marks: 5,
        markingScheme:
          '$E = 0.80(5.0 + r) = 4.0 + 0.80r$ and $E = 0.50(9.0 + r) = 4.5 + 0.50r$ [2 marks].\nEquating: $4.0 + 0.80r = 4.5 + 0.50r \\implies 0.30r = 0.50 \\implies r = 1.67\\,\\Omega$ [2 marks].\n$E = 4.0 + 0.80(1.67) = 5.33\\text{ V}$ [1 mark].',
        keyScoringPoints: [
          'Both circuit equations $E = I(R+r)$ correctly set up (2 marks)',
          'Internal resistance $r = 1.67\\,\\Omega$ (or $5/3\\,\\Omega$) (2 marks)',
          'EMF $E = 5.33\\text{ V}$ (or $16/3\\text{ V}$) (1 mark)',
        ],
      },
      {
        label: '(b)(i)',
        prompt: 'Calculate the power dissipated inside the battery itself when driving the $5.0\\,\\Omega$ load.',
        marks: 2,
        markingScheme:
          'Internal power loss $P_r = I^2 r = (0.80)^2 \\times 1.67 = 0.64 \\times 1.67 = 1.07\\text{ W}$ [2 marks].',
        keyScoringPoints: [
          'Formula $P = I^2 r$ applied (1 mark)',
          'Correct value $1.07\\text{ W}$ (1 mark)',
        ],
      },
      {
        label: '(b)(ii)',
        prompt: 'State the condition on external resistance $R$ for maximum power transfer from the battery.',
        marks: 2,
        markingScheme:
          'Maximum power is transferred to the external load when the load resistance equals the internal resistance of the cell ($R = r = 1.67\\,\\Omega$) [2 marks].',
        keyScoringPoints: [
          'Explicit condition $R = r$ stated (2 marks)',
        ],
      },
    ],
  },

  // CHEMISTRY (3 multi-part theory questions across SHS 1, 2, 3)
  {
    id: 'theo-chem-1',
    subject: 'chemistry',
    grade: 'SHS1',
    topicId: 'chem-s1-stoichiometry',
    topicTitle: 'Mole Concept & Stoichiometry',
    yearTag: 'WASSCE Paper 2 · 2023',
    title: 'Limiting Reagent & Gas Volume Stoichiometry',
    contextPrompt:
      '$10.6\\text{ g}$ of anhydrous sodium trioxocarbonate(IV), $\\text{Na}_2\\text{CO}_3$, is reacted with $150\\text{ cm}^3$ of $1.00\\text{ mol dm}^{-3}$ $\\text{HCl}$ according to: $\\text{Na}_2\\text{CO}_3 + 2\\text{HCl} \\rightarrow 2\\text{NaCl} + \\text{H}_2\\text{O} + \\text{CO}_2$. ($\\text{Na}=23, \\text{C}=12, \\text{O}=16$; molar gas volume at s.t.p $= 22.4\\text{ dm}^3$)',
    totalMarks: 9,
    parts: [
      {
        label: '(a)',
        prompt: 'Determine the number of moles of $\\text{Na}_2\\text{CO}_3$ and $\\text{HCl}$ initially present, and identify the limiting reagent.',
        marks: 4,
        markingScheme:
          '$M_r(\\text{Na}_2\\text{CO}_3) = 2(23) + 12 + 3(16) = 106\\text{ g mol}^{-1}$. Moles $\\text{Na}_2\\text{CO}_3 = 10.6 / 106 = 0.10\\text{ mol}$ [1 mark].\nMoles $\\text{HCl} = 1.00 \\times 0.150 = 0.15\\text{ mol}$ [1 mark].\n$0.10\\text{ mol}$ $\\text{Na}_2\\text{CO}_3$ needs $0.20\\text{ mol}$ $\\text{HCl}$; since only $0.15\\text{ mol}$ $\\text{HCl}$ is available, $\\text{HCl}$ is the limiting reagent [2 marks].',
        keyScoringPoints: [
          'Moles of $\\text{Na}_2\\text{CO}_3 = 0.10\\text{ mol}$ (1 mark)',
          'Moles of $\\text{HCl} = 0.15\\text{ mol}$ (1 mark)',
          'Identifies $\\text{HCl}$ as limiting reagent with stoichiometric proof (2 marks)',
        ],
      },
      {
        label: '(b)(i)',
        prompt: 'Calculate the volume of $\\text{CO}_2$ gas liberated at s.t.p.',
        marks: 3,
        markingScheme:
          'Mole ratio $\\text{HCl} : \\text{CO}_2 = 2 : 1$, so moles $\\text{CO}_2 = \\frac{0.15}{2} = 0.075\\text{ mol}$ [1.5 marks].\nVolume $= 0.075 \\times 22.4 = 1.68\\text{ dm}^3$ ($1680\\text{ cm}^3$) [1.5 marks].',
        keyScoringPoints: [
          'Uses limiting $\\text{HCl}$ to get $0.075\\text{ mol}$ $\\text{CO}_2$ (1.5 marks)',
          'Volume $= 1.68\\text{ dm}^3$ at s.t.p (1.5 marks)',
        ],
      },
      {
        label: '(b)(ii)',
        prompt: 'Calculate the mass of excess $\\text{Na}_2\\text{CO}_3$ remaining unreacted.',
        marks: 2,
        markingScheme:
          'Moles $\\text{Na}_2\\text{CO}_3$ reacted $= 0.075\\text{ mol}$. Excess moles $= 0.10 - 0.075 = 0.025\\text{ mol}$ [1 mark].\nExcess mass $= 0.025 \\times 106 = 2.65\\text{ g}$ [1 mark].',
        keyScoringPoints: [
          'Excess moles $= 0.025\\text{ mol}$ (1 mark)',
          'Excess mass $= 2.65\\text{ g}$ (1 mark)',
        ],
      },
    ],
  },
  {
    id: 'theo-chem-2',
    subject: 'chemistry',
    grade: 'SHS2',
    topicId: 'chem-s2-kinetics',
    topicTitle: 'Rates of Reaction & Chemical Equilibrium',
    yearTag: 'WASSCE Paper 2 · 2022',
    title: 'Equilibrium Constant $K_c$ & Le Chatelier Analysis',
    contextPrompt:
      'In a $2.0\\text{ dm}^3$ closed vessel at $450^\\circ\\text{C}$, $2.0\\text{ mol}$ of $\\text{HI}$ decomposes according to: $2\\text{HI}_{(g)} \\rightleftharpoons \\text{H}_{2(g)} + \\text{I}_{2(g)}\\;(\\Delta H = +10.4\\text{ kJ mol}^{-1})$. At equilibrium, $0.40\\text{ mol}$ of $\\text{I}_2$ is present.',
    totalMarks: 8,
    parts: [
      {
        label: '(a)',
        prompt: 'Calculate the equilibrium concentrations of $\\text{HI}, \\text{H}_2,$ and $\\text{I}_2$, and evaluate $K_c$.',
        marks: 5,
        markingScheme:
          'At eq: $n(\\text{I}_2) = 0.40\\text{ mol}$, $n(\\text{H}_2) = 0.40\\text{ mol}$, $n(\\text{HI}) = 2.0 - 2(0.40) = 1.20\\text{ mol}$ [2 marks].\nDividing by $2.0\\text{ dm}^3$: $[\\text{I}_2]=0.20, [\\text{H}_2]=0.20, [\\text{HI}]=0.60\\text{ mol dm}^{-3}$ [1 mark].\n$K_c = \\frac{[\\text{H}_2][\\text{I}_2]}{[\\text{HI}]^2} = \\frac{0.20 \\times 0.20}{0.60^2} = \\frac{0.04}{0.36} = 0.111$ (no units) [2 marks].',
        keyScoringPoints: [
          'ICE equilibrium moles $1.20, 0.40, 0.40$ (2 marks)',
          'Divided by $2.0\\text{ dm}^3$ for molarity (1 mark)',
          '$K_c = 0.111$ (or $1/9$) calculated correctly (2 marks)',
        ],
      },
      {
        label: '(b)(i)',
        prompt: 'State the effect of doubling the total pressure at constant temperature on the equilibrium position and on $K_c$.',
        marks: 3,
        markingScheme:
          'There are 2 moles of gas on both sides ($2\\text{HI} \\rightleftharpoons \\text{H}_2 + \\text{I}_2$), so doubling pressure has no effect on equilibrium position [2 marks]. $K_c$ depends only on temperature, so $K_c$ remains unchanged [1 mark].',
        keyScoringPoints: [
          'Equal gas moles (2 vs 2) means no shift in position (2 marks)',
          '$K_c$ remains unchanged because temperature is constant (1 mark)',
        ],
      },
    ],
  },
  {
    id: 'theo-chem-3',
    subject: 'chemistry',
    grade: 'SHS3',
    topicId: 'chem-s3-redox',
    topicTitle: 'Redox Reactions & Electrochemistry',
    yearTag: 'WASSCE Paper 2 · 2021',
    title: 'Electrochemical Cells & Standard Electrode Potentials',
    contextPrompt:
      'Given the standard reduction potentials: $\\text{Zn}^{2+}_{(aq)} + 2e^- \\rightarrow \\text{Zn}_{(s)}\\;(E^\\circ = -0.76\\text{ V})$ and $\\text{Ag}^+_{(aq)} + e^- \\rightarrow \\text{Ag}_{(s)}\\;(E^\\circ = +0.80\\text{ V})$.',
    totalMarks: 8,
    parts: [
      {
        label: '(a)',
        prompt: 'Write the overall balanced ionic equation for the spontaneous galvanic cell and write its standard cell notation.',
        marks: 4,
        markingScheme:
          'Overall equation: $\\text{Zn}_{(s)} + 2\\text{Ag}^+_{(aq)} \\rightarrow \\text{Zn}^{2+}_{(aq)} + 2\\text{Ag}_{(s)}$ [2 marks].\nCell diagram: $\\text{Zn}_{(s)} \\mid \\text{Zn}^{2+}_{(aq)} \\parallel \\text{Ag}^+_{(aq)} \\mid \\text{Ag}_{(s)}$ [2 marks].',
        keyScoringPoints: [
          'Balanced ionic equation with $2\\text{Ag}^+$ stoichiometry (2 marks)',
          'IUPAC cell notation with anode on left and salt bridge $\\parallel$ (2 marks)',
        ],
      },
      {
        label: '(b)(i)',
        prompt: 'Calculate the standard EMF ($E^\\circ_{\\text{cell}}$) of the cell.',
        marks: 2,
        markingScheme:
          '$E^\\circ_{\\text{cell}} = E^\\circ_{\\text{cathode}} - E^\\circ_{\\text{anode}} = (+0.80) - (-0.76) = +1.56\\text{ V}$ [2 marks].',
        keyScoringPoints: [
          'Formula $E^\\circ_{\\text{cathode}} - E^\\circ_{\\text{anode}}$ (1 mark)',
          'Result $+1.56\\text{ V}$ (1 mark)',
        ],
      },
      {
        label: '(b)(ii)',
        prompt: 'State the role of a potassium nitrate ($\\text{KNO}_3$) salt bridge in the cell.',
        marks: 2,
        markingScheme:
          'It completes the internal electrical circuit by allowing ion migration [1 mark] and maintains electrical neutrality in both half-cells without mixing the solutions [1 mark].',
        keyScoringPoints: [
          'Completes circuit via ion flow (1 mark)',
          'Maintains electrical neutrality in half-cells (1 mark)',
        ],
      },
    ],
  },

  // BIOLOGY (3 multi-part theory questions across SHS 1, 2, 3)
  {
    id: 'theo-bio-1',
    subject: 'biology',
    grade: 'SHS1',
    topicId: 'bio-s1-nutrition',
    topicTitle: 'Photosynthesis & Leaf Adaptations',
    yearTag: 'WASSCE Paper 2 · 2023',
    title: 'Leaf Structure & Factors Limiting Photosynthesis',
    contextPrompt:
      'A green terrestrial dicotyledonous leaf acts as a specialized solar organ balancing maximum light capture with minimal water loss.',
    totalMarks: 8,
    parts: [
      {
        label: '(a)',
        prompt: 'Explain three structural adaptations of the palisade mesophyll for high photosynthetic efficiency.',
        marks: 3,
        markingScheme:
          '1. Cells are elongated and arranged vertically right below the transparent upper epidermis to intercept maximum sunlight [1 mark].\n2. Packed with numerous chloroplasts that can move via cytoplasmic streaming [1 mark].\n3. Thin cell walls allow rapid diffusion of dissolved $\\text{CO}_2$ [1 mark].',
        keyScoringPoints: [
          'Position beneath transparent upper epidermis (1 mark)',
          'High density of chloroplasts (1 mark)',
          'Thin cell walls / large vacuole pushing chloroplasts to periphery (1 mark)',
        ],
      },
      {
        label: '(b)(i)',
        prompt: 'Explain the mechanism by which guard cells open stomata during bright daylight.',
        marks: 3,
        markingScheme:
          'In light, guard cells actively pump $\\text{K}^+$ ions inward (assisted by ATP from photosynthesis), lowering their water potential [1 mark]. Water enters from adjacent epidermal cells by osmosis, making guard cells turgid [1 mark]. Due to thicker inner cell walls, guard cells bow outward, opening the stomatal pore [1 mark].',
        keyScoringPoints: [
          'Active $\\text{K}^+$ uptake lowering water potential (1 mark)',
          'Osmotic water influx increasing turgidity (1 mark)',
          'Uneven wall thickness causing outward bowing (1 mark)',
        ],
      },
      {
        label: '(b)(ii)',
        prompt: 'Name the two main products of the light-dependent reactions used in the Calvin cycle.',
        marks: 2,
        markingScheme: 'ATP [1 mark] and reduced NADP (NADPH) [1 mark].',
        keyScoringPoints: ['ATP (1 mark)', 'NADPH / reduced NADP (1 mark)'],
      },
    ],
  },
  {
    id: 'theo-bio-2',
    subject: 'biology',
    grade: 'SHS2',
    topicId: 'bio-s2-homeostasis',
    topicTitle: 'Excretion, Nephron & Homeostasis',
    yearTag: 'WASSCE Paper 2 · 2022',
    title: 'Ultrafiltration & Blood Glucose Regulation',
    contextPrompt:
      'The mammalian kidney and pancreas cooperate to keep plasma osmolarity and blood glucose within narrow physiological limits.',
    totalMarks: 9,
    parts: [
      {
        label: '(a)',
        prompt: 'Explain how high hydrostatic pressure is generated in the glomerulus to drive ultrafiltration.',
        marks: 3,
        markingScheme:
          'The afferent arteriole entering Bowman’s capsule has a wider lumen diameter than the efferent arteriole leaving it [2 marks]. This creates high blood hydrostatic pressure forcing water, urea, glucose, and salts through the fenestrated endothelium and podocyte filtration slits [1 mark].',
        keyScoringPoints: [
          'Wider afferent arteriole than narrower efferent arteriole (2 marks)',
          'Forces small solutes across basement membrane/podocytes while retaining plasma proteins (1 mark)',
        ],
      },
      {
        label: '(b)(i)',
        prompt: 'Describe the hormonal response when blood glucose rises sharply after a carbohydrate meal.',
        marks: 4,
        markingScheme:
          'Beta cells in the Islets of Langerhans of the pancreas detect high blood glucose and secrete insulin into the blood [1 mark]. Insulin stimulates liver and muscle cells to increase glucose uptake [1 mark], activates glycogenesis (converting glucose to insoluble glycogen) [1 mark], and increases cellular respiration until blood glucose returns to normal [1 mark].',
        keyScoringPoints: [
          'Pancreatic $\\beta$-cells secrete insulin (1 mark)',
          'Increased cellular uptake of glucose (1 mark)',
          'Glycogenesis in liver/muscle (1 mark)',
          'Negative feedback restoration to set point (1 mark)',
        ],
      },
      {
        label: '(b)(ii)',
        prompt: 'Why is glucose normally absent from the urine of a healthy person?',
        marks: 2,
        markingScheme:
          'All filtered glucose is completely reabsorbed in the proximal convoluted tubule by active co-transport back into the blood [2 marks].',
        keyScoringPoints: [
          '100% selective reabsorption in the PCT via active transport (2 marks)',
        ],
      },
    ],
  },
  {
    id: 'theo-bio-3',
    subject: 'biology',
    grade: 'SHS3',
    topicId: 'bio-s3-genetics',
    topicTitle: 'Mendelian Genetics, Linkage & DNA Replication',
    yearTag: 'WASSCE Paper 2 · 2021',
    title: 'Sex-Linked Inheritance (Haemophilia)',
    contextPrompt:
      'Haemophilia is an X-linked recessive bleeding disorder ($X^H$ = normal allele, $X^h$ = haemophilia allele). A carrier female ($X^H X^h$) marries a normal male ($X^H Y$).',
    totalMarks: 8,
    parts: [
      {
        label: '(a)',
        prompt: 'Show a complete genetic diagram (cross) to determine the expected genotypes and phenotypes of their offspring.',
        marks: 5,
        markingScheme:
          'Parental genotypes: $X^H X^h \\times X^H Y$ [1 mark].\nGametes: $(X^H, X^h)$ and $(X^H, Y)$ [1 mark].\nOffspring genotypes: $X^H X^H, X^H X^h, X^H Y, X^h Y$ [2 marks].\nPhenotypes: 1 normal female, 1 carrier female, 1 normal male, 1 haemophiliac male (25% overall, or 50% of sons) [1 mark].',
        keyScoringPoints: [
          'Correct parental genotypes and gametes (2 marks)',
          'All 4 offspring genotypes correctly derived (2 marks)',
          'Accurate phenotypic ratio stated (1 mark)',
        ],
      },
      {
        label: '(b)(i)',
        prompt: 'Explain why X-linked recessive disorders occur much more frequently in males than in females.',
        marks: 3,
        markingScheme:
          'Males are hemizygous ($XY$), possessing only one X chromosome, so a single recessive allele $X^h$ is always expressed phenotypically [2 marks]. Females ($XX$) must inherit two recessive alleles ($X^h X^h$) to show the disorder, since one normal $X^H$ masks $X^h$ [1 mark].',
        keyScoringPoints: [
          'Males have only one X chromosome so single $X^h$ is expressed (2 marks)',
          'Females require homozygous $X^h X^h$ to manifest condition (1 mark)',
        ],
      },
    ],
  },

  // ADD MATHS (3 multi-part theory questions across SHS 1, 2, 3)
  {
    id: 'theo-math-1',
    subject: 'addmaths',
    grade: 'SHS1',
    topicId: 'math-s1-algebra',
    topicTitle: 'Surds, Indices, Logarithms & Polynomials',
    yearTag: 'WASSCE Paper 2 · 2023',
    title: 'Factor Theorem & Partial Fractions',
    contextPrompt: 'Consider the cubic polynomial $P(x) = x^3 - 4x^2 + x + 6$.',
    totalMarks: 9,
    parts: [
      {
        label: '(a)',
        prompt: 'Show that $(x + 1)$ is a factor of $P(x)$, and hence factorize $P(x)$ completely.',
        marks: 4,
        markingScheme:
          '$P(-1) = (-1)^3 - 4(-1)^2 + (-1) + 6 = -1 - 4 - 1 + 6 = 0$, hence $(x + 1)$ is a factor [1 mark].\nDividing by $(x+1)$ gives $x^2 - 5x + 6 = (x - 2)(x - 3)$ [2 marks].\nTherefore $P(x) = (x + 1)(x - 2)(x - 3)$ [1 mark].',
        keyScoringPoints: [
          'Evaluates $P(-1) = 0$ (1 mark)',
          'Obtains quadratic quotient $x^2 - 5x + 6$ (2 marks)',
          'Full linear factorization $(x+1)(x-2)(x-3)$ (1 mark)',
        ],
      },
      {
        label: '(b)(i)',
        prompt: 'Express $\\frac{5x - 1}{(x + 1)(x - 2)}$ in partial fractions.',
        marks: 5,
        markingScheme:
          'Let $\\frac{5x - 1}{(x + 1)(x - 2)} \\equiv \\frac{A}{x + 1} + \\frac{B}{x - 2} \\implies 5x - 1 = A(x - 2) + B(x + 1)$ [1 mark].\nSet $x = 2$: $9 = 3B \\implies B = 3$ [2 marks].\nSet $x = -1$: $-6 = -3A \\implies A = 2$ [1 mark].\nResult: $\\frac{2}{x + 1} + \\frac{3}{x - 2}$ [1 mark].',
        keyScoringPoints: [
          'Sets up $A/(x+1) + B/(x-2)$ identity (1 mark)',
          'Finds $A = 2$ and $B = 3$ accurately (3 marks)',
          'Writes final partial fraction sum (1 mark)',
        ],
      },
    ],
  },
  {
    id: 'theo-math-2',
    subject: 'addmaths',
    grade: 'SHS2',
    topicId: 'math-s2-coordgeo',
    topicTitle: 'Coordinate Geometry: Lines & Circles',
    yearTag: 'WASSCE Paper 2 · 2022',
    title: 'Equation of Circle & Tangent Line',
    contextPrompt:
      'A circle has equation $x^2 + y^2 - 4x + 2y - 20 = 0$. The point $P(5, 3)$ lies on the circumference of the circle.',
    totalMarks: 8,
    parts: [
      {
        label: '(a)',
        prompt: 'Determine the coordinates of the centre $C$ and the radius $r$ of the circle.',
        marks: 3,
        markingScheme:
          '$(x - 2)^2 - 4 + (y + 1)^2 - 1 - 20 = 0 \\implies (x - 2)^2 + (y + 1)^2 = 25$ [2 marks].\nCentre $C = (2, -1)$ and radius $r = 5$ [1 mark].',
        keyScoringPoints: [
          'Completes the square cleanly (2 marks)',
          'States $C(2, -1)$ and $r = 5$ (1 mark)',
        ],
      },
      {
        label: '(b)(i)',
        prompt: 'Find the equation of the tangent to the circle at the point $P(5, 3)$ in the form $ax + by + c = 0$.',
        marks: 5,
        markingScheme:
          'Gradient of radius $CP$: $m_{CP} = \\frac{3 - (-1)}{5 - 2} = \\frac{4}{3}$ [2 marks].\nTangent is perpendicular to radius, so $m_T = -\\frac{3}{4}$ [1 mark].\nEquation: $y - 3 = -\\frac{3}{4}(x - 5) \\implies 4y - 12 = -3x + 15 \\implies 3x + 4y - 27 = 0$ [2 marks].',
        keyScoringPoints: [
          'Gradient of normal $CP = 4/3$ (2 marks)',
          'Perpendicular gradient $m_T = -3/4$ (1 mark)',
          'Simplified tangent equation $3x + 4y - 27 = 0$ (2 marks)',
        ],
      },
    ],
  },
  {
    id: 'theo-math-3',
    subject: 'addmaths',
    grade: 'SHS3',
    topicId: 'math-s3-diffcalc',
    topicTitle: 'Differential Calculus & Optimization',
    yearTag: 'WASSCE Paper 2 · 2021',
    title: 'Area Enclosed Between Curve and Line',
    contextPrompt: 'Consider the parabola $y = x^2$ and the straight line $y = 2x + 3$.',
    totalMarks: 9,
    parts: [
      {
        label: '(a)',
        prompt: 'Find the coordinates of the points where the line intersects the curve.',
        marks: 3,
        markingScheme:
          '$x^2 = 2x + 3 \\implies x^2 - 2x - 3 = 0 \\implies (x - 3)(x + 1) = 0 \\implies x = -1, 3$ [2 marks].\nPoints are $(-1, 1)$ and $(3, 9)$ [1 mark].',
        keyScoringPoints: [
          'Solves $x^2 - 2x - 3 = 0$ to find $x = -1, 3$ (2 marks)',
          'Finds full coordinates $(-1, 1)$ and $(3, 9)$ (1 mark)',
        ],
      },
      {
        label: '(b)(i)',
        prompt: 'Calculate the exact finite area enclosed between the line and the curve.',
        marks: 6,
        markingScheme:
          'On $[-1, 3]$, the line lies above the parabola, so $A = \\int_{-1}^{3} (2x + 3 - x^2)\\,dx$ [2 marks].\n$= \\left[x^2 + 3x - \\frac{x^3}{3}\\right]_{-1}^{3}$ [2 marks].\n$= \\left(9 + 9 - 9\\right) - \\left(1 - 3 + \\frac{1}{3}\\right) = 9 - \\left(-\\frac{5}{3}\\right) = \\frac{32}{3}\\text{ sq. units}$ [2 marks].',
        keyScoringPoints: [
          'Correct definite integral setup with limits $-1$ to $3$ (2 marks)',
          'Accurate antiderivative (2 marks)',
          'Final exact area $32/3$ or $10\\frac{2}{3}$ sq. units (2 marks)',
        ],
      },
    ],
  },

  // ICT (3 multi-part theory questions across SHS 1, 2, 3)
  {
    id: 'theo-ict-1',
    subject: 'ict',
    grade: 'SHS1',
    topicId: 'ict-s1-logic',
    topicTitle: 'Boolean Logic & Digital Logic Gates',
    yearTag: 'WASSCE Paper 2 · 2023',
    title: 'Combinational Logic Circuit & Truth Table',
    contextPrompt:
      'An automated greenhouse alarm $Q$ triggers ($Q=1$) if Temperature sensor $T = 1$ AND Humidity sensor $H = 0$, OR if Manual Override $M = 1$.',
    totalMarks: 8,
    parts: [
      {
        label: '(a)',
        prompt: 'Write the Boolean algebra expression for output $Q$ in terms of $T, H,$ and $M$.',
        marks: 2,
        markingScheme: '$Q = (T \\cdot \\overline{H}) + M$ [2 marks].',
        keyScoringPoints: [
          'Correct NOT on $H$ combined via AND with $T$ (1 mark)',
          'Correct OR combination with $M$ (1 mark)',
        ],
      },
      {
        label: '(b)(i)',
        prompt: 'Construct the complete 8-row truth table for $Q$ across all combinations of $(T, H, M)$.',
        marks: 4,
        markingScheme:
          'Rows where $M=1$ always yield $Q=1$ (4 rows: 001, 011, 101, 111) [2 marks].\nWhen $M=0$: (000)->0, (010)->0, (100)->1, (110)->0 [2 marks].',
        keyScoringPoints: [
          'All 8 input combinations listed cleanly (1 mark)',
          'Correct intermediate $T \\cdot \\overline{H}$ evaluation (1 mark)',
          'All 8 final $Q$ output bits exact (2 marks)',
        ],
      },
      {
        label: '(b)(ii)',
        prompt: 'List the three basic logic gates needed to build this circuit.',
        marks: 2,
        markingScheme: 'One NOT gate (for $\\overline{H}$), one AND gate, and one OR gate [2 marks].',
        keyScoringPoints: ['NOT, AND, and OR gates named correctly (2 marks)'],
      },
    ],
  },
  {
    id: 'theo-ict-2',
    subject: 'ict',
    grade: 'SHS2',
    topicId: 'ict-s2-networking',
    topicTitle: 'Data Communication & Computer Networks',
    yearTag: 'WASSCE Paper 2 · 2022',
    title: 'School LAN Architecture & Transmission Media',
    contextPrompt:
      'A Senior High School is connecting a 40-PC ICT lab in Block A to the main administration server room $250\\text{ m}$ away in Block B.',
    totalMarks: 8,
    parts: [
      {
        label: '(a)',
        prompt: 'Explain why fiber-optic cable should be used for the $250\\text{ m}$ backbone link instead of standard Cat6 UTP copper cable.',
        marks: 4,
        markingScheme:
          '1. Standard Cat6 UTP has a maximum unrepeated segment limit of $100\\text{ m}$, whereas fiber spans kilometres without attenuation loss [2 marks].\n2. Fiber is immune to electromagnetic interference (EMI) from electrical lines and offers much higher bandwidth [2 marks].',
        keyScoringPoints: [
          'Identifies 100 m distance limitation of UTP copper vs long-haul fiber (2 marks)',
          'Explains EMI immunity and higher bandwidth capacity (2 marks)',
        ],
      },
      {
        label: '(b)(i)',
        prompt: 'Differentiate between a Star topology and a Bus topology regarding fault tolerance.',
        marks: 4,
        markingScheme:
          'In a Star topology, each workstation connects via a dedicated link to a central switch; if one cable breaks, only that PC goes offline while the rest keep running [2 marks]. In a Bus topology, a single break or faulty terminator on the shared backbone brings down the entire network [2 marks].',
        keyScoringPoints: [
          'Star isolates single-cable faults to one node (2 marks)',
          'Bus backbone break crashes the entire segment (2 marks)',
        ],
      },
    ],
  },
  {
    id: 'theo-ict-3',
    subject: 'ict',
    grade: 'SHS3',
    topicId: 'ict-s3-databases',
    topicTitle: 'Relational Databases, Normalization & SQL',
    yearTag: 'WASSCE Paper 2 · 2021',
    title: 'SQL Queries & Python List Processing',
    contextPrompt:
      'A database table `Candidates(CandidateID, FullName, House, PhysicsScore)` stores SHS 3 mock results.',
    totalMarks: 9,
    parts: [
      {
        label: '(a)',
        prompt: 'Write an SQL statement to display `FullName` and `PhysicsScore` of candidates in `"Aggrey"` house who scored at least $75$, ordered by highest score first.',
        marks: 4,
        markingScheme:
          '`SELECT FullName, PhysicsScore FROM Candidates WHERE House = \'Aggrey\' AND PhysicsScore >= 75 ORDER BY PhysicsScore DESC;` [4 marks].',
        keyScoringPoints: [
          'Correct `SELECT FullName, PhysicsScore FROM Candidates` (1 mark)',
          'Correct `WHERE` compound condition with `AND` (2 marks)',
          'Correct `ORDER BY PhysicsScore DESC` (1 mark)',
        ],
      },
      {
        label: '(b)(i)',
        prompt: 'Write a short Python function `count_distinctions(scores)` that accepts a list of integer scores and returns how many scores are $80$ or above.',
        marks: 5,
        markingScheme:
          '```python\ndef count_distinctions(scores):\n    count = 0\n    for s in scores:\n        if s >= 80:\n            count += 1\n    return count\n```',
        keyScoringPoints: [
          'Function signature `def count_distinctions(scores):` (1 mark)',
          'Accumulator initialized to 0 and loop over `scores` (2 marks)',
          'Condition `s >= 80` and `return count` (2 marks)',
        ],
      },
    ],
  },
  // CORE SUBJECTS THEORY (Core Maths, English, Integrated Science, Social Studies)
  {
    id: 'theo-coremath-1',
    subject: 'coremath',
    grade: 'SHS2',
    topicId: 'coremath-s2-bearings',
    topicTitle: 'Vectors, Bearings & Rigid Motion',
    yearTag: 'WASSCE Core Maths Paper 2 · 2023',
    title: 'Bearings & Cosine Rule Navigation',
    contextPrompt:
      'A cyclist rides $12\\text{ km}$ from town $P$ to town $Q$ on a bearing of $060^\\circ$, and then rides $15\\text{ km}$ from $Q$ to town $R$ on a bearing of $150^\\circ$.',
    totalMarks: 10,
    parts: [
      {
        label: '(a)',
        prompt: 'Show that $\\angle PQR = 90^\\circ$ and calculate the straight-line distance $|PR|$ to one decimal place.',
        marks: 6,
        markingScheme:
          'At $Q$, bearing from $Q$ back to $P$ is $060^\\circ + 180^\\circ = 240^\\circ$. Thus interior $\\angle PQR = 240^\\circ - 150^\\circ = 90^\\circ$ [3 marks].\nBy Pythagoras theorem: $|PR| = \\sqrt{12^2 + 15^2} = \\sqrt{144 + 225} = \\sqrt{369} \\approx 19.2\\text{ km}$ [3 marks].',
        keyScoringPoints: [
          'Back bearing of $P$ from $Q$ found as $240^\\circ$ (2 marks)',
          'Right angle $\\angle PQR = 90^\\circ$ deduced (1 mark)',
          'Pythagoras / Cosine rule gives $19.2\\text{ km}$ (3 marks)',
        ],
      },
      {
        label: '(b)',
        prompt: 'Find the three-figure bearing of town $R$ from town $P$ to the nearest degree.',
        marks: 4,
        markingScheme:
          '$\\tan(\\angle QPR) = \\frac{15}{12} = 1.25 \\implies \\angle QPR \\approx 51.3^\\circ$ [2 marks].\nBearing of $R$ from $P = 060^\\circ + 51^\\circ = 111^\\circ$ [2 marks].',
        keyScoringPoints: [
          'Trigonometric ratio $\\tan^{-1}(15/12) = 51^\\circ$ (2 marks)',
          'Correct clockwise addition from North: $111^\\circ$ (2 marks)',
        ],
      },
    ],
  },
  {
    id: 'theo-english-1',
    subject: 'english',
    grade: 'SHS1',
    topicId: 'english-s1-comprehension',
    topicTitle: 'Reading Comprehension & Summary Writing',
    yearTag: 'WASSCE English Paper 2 · 2023',
    title: 'Grammar Function & Concise Summary Practice',
    contextPrompt:
      'Read the sentence: "Although the rains arrived three weeks late, **farmers who adopted drought-tolerant maize varieties** harvested record yields across northern Ghana."',
    totalMarks: 8,
    parts: [
      {
        label: '(a)(i)',
        prompt: 'State the grammatical name and grammatical function of the bolded expression: "farmers who adopted drought-tolerant maize varieties".',
        marks: 4,
        markingScheme:
          'Grammatical name: **Noun phrase** [2 marks].\nGrammatical function: **Subject of the verb "harvested"** [2 marks].',
        keyScoringPoints: [
          'Identifies expression as a Noun Phrase (2 marks)',
          'States function accurately as Subject of the verb "harvested" (2 marks)',
        ],
      },
      {
        label: '(a)(ii)',
        prompt: 'Identify the grammatical name and function of "Although the rains arrived three weeks late".',
        marks: 4,
        markingScheme:
          'Grammatical name: **Adverbial clause of concession** [2 marks].\nGrammatical function: **Modifies the verb "harvested"** [2 marks].',
        keyScoringPoints: [
          'Adverbial clause (of concession) (2 marks)',
          'Modifies main-clause verb "harvested" (2 marks)',
        ],
      },
    ],
  },
  {
    id: 'theo-intsci-1',
    subject: 'integratedscience',
    grade: 'SHS2',
    topicId: 'intsci-s2-ecology',
    topicTitle: 'Ecosystems, Soil Conservation & Nitrogen Cycle',
    yearTag: 'WASSCE Int. Science Paper 2 · 2023',
    title: 'Nitrogen Cycle & Soil Fertility Conservation',
    contextPrompt:
      'A maize farmer in the Brong-Ahafo belt notices yellowing lower leaves and falling yields after five years of continuous monocropping.',
    totalMarks: 10,
    parts: [
      {
        label: '(a)',
        prompt: 'Explain two biological roles of Rhizobium and Nitrobacter bacteria in restoring soil nitrates.',
        marks: 5,
        markingScheme:
          '1. *Rhizobium* lives symbiotically in root nodules of leguminous plants (cowpea/groundnut) and fixes atmospheric $\\text{N}_2$ into ammonium ions [2.5 marks].\n2. *Nitrobacter* oxidizes nitrites ($\\text{NO}_2^-$) into soluble nitrates ($\\text{NO}_3^-$) ready for plant root absorption [2.5 marks].',
        keyScoringPoints: [
          'Rhizobium nitrogen fixation in legume root nodules (2.5 marks)',
          'Nitrobacter oxidation of nitrites to nitrates (2.5 marks)',
        ],
      },
      {
        label: '(b)',
        prompt: 'Recommend two agronomic practices the farmer should adopt alongside NPK fertilizer and state how each conserves topsoil.',
        marks: 5,
        markingScheme:
          '1. **Crop rotation with legumes**: Replenishes soil nitrogen naturally and disrupts pest cycles [2.5 marks].\n2. **Mulching / Cover cropping**: Protects topsoil from splash erosion, retains moisture, and adds organic humus [2.5 marks].',
        keyScoringPoints: [
          'Legume crop rotation explained (2.5 marks)',
          'Mulching or contour ploughing explained (2.5 marks)',
        ],
      },
    ],
  },
  {
    id: 'theo-soc-1',
    subject: 'socialstudies',
    grade: 'SHS2',
    topicId: 'soc-s2-governance',
    topicTitle: 'Democracy, Rule of Law & the 1992 Constitution',
    yearTag: 'WASSCE Social Studies Paper 2 · 2023',
    title: 'Separation of Powers & Constitutional Checks in Ghana',
    contextPrompt:
      'Ghana’s Fourth Republic operates under the 1992 Constitution, distributing authority among the Executive, Parliament (Legislature), and the Judiciary.',
    totalMarks: 12,
    parts: [
      {
        label: '(a)',
        prompt: 'Explain the principle of Separation of Powers and state two reasons why it prevents tyranny.',
        marks: 6,
        markingScheme:
          'Separation of powers divides law-making, policy execution, and judicial adjudication across distinct organs [2 marks].\n1. Prevents concentration of absolute authority in one person/office [2 marks].\n2. Enables mutual accountability and protection of citizen liberties [2 marks].',
        keyScoringPoints: [
          'Clear definition dividing Executive, Legislature, and Judiciary (2 marks)',
          'Two valid safeguards against tyranny/abuse of power (4 marks)',
        ],
      },
      {
        label: '(b)',
        prompt: 'Describe two constitutional checks exercised by Parliament and the Judiciary over the Executive in Ghana.',
        marks: 6,
        markingScheme:
          '1. **Parliamentary Vetting & Budget Control**: Parliament approves ministerial nominees, national budgets, and international loan agreements [3 marks].\n2. **Judicial Review**: The Supreme Court can declare unconstitutional executive actions or statutes null and void [3 marks].',
        keyScoringPoints: [
          'Parliamentary vetting, budget approval, or censure mechanism (3 marks)',
          'Judicial review by Supreme Court (3 marks)',
        ],
      },
    ],
  },
];

