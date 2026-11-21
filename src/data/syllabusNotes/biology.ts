import type { StudyNote } from '../../types';

const CREATED_AT = '2026-01-15T08:00:00.000Z';

export const BIOLOGY_SYLLABUS_NOTES: StudyNote[] = [
  // Deep SHS Year 1 PDF Masterclass 1: Introduction to Biology
  {
    id: 'note-bio-s1-intro-pdf',
    topicId: 'bio-s1-cell',
    isBuiltIn: true,
    title: 'SHS Year 1 PDF: Introduction to Biology, Scientific Method, Symmetry & Drawings',
    subject: 'biology',
    grade: 'SHS1',
    tags: ['SHS1', 'Biology', 'PDF Masterclass', 'Scientific Method', 'Symmetry', 'Drawings'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Section 1: Introduction to Biology, Scientific Method, Orientation & Drawings

## Meaning & Major Branches of Biology
**Biology** is the branch of natural science that studies living things, their structure, function, and interaction with the environment.
- **Three Core Branches:** **Botany** (plants), **Zoology** (animals), and **Microbiology** (microscopic organisms).
- **Specialized Disciplines:** **Ecology** (organism–environment interactions), **Mycology** (fungi), **Cytology** (cells), **Histology** (tissues), **Genetics** (heredity & variation), **Evolution** (gradual change in heritable traits over time), **Anatomy**, **Physiology**, **Morphology**, **Paleontology**, **Virology**, **Bacteriology**, and **Ornithology**.

## Six Everyday Importances & Career Fields
1. **Food Production:** Honey from beekeeping; microbial fermentation making bread, **kenkey** (fermented corn dough), cheese, local Ghanaian cheese (**wagashi**), **palm wine**, and **pito**; salt dehydration in salted tilapia (**koobi**) creates unfavourable conditions against spoilage microbes.
2. **Gardening:** Composting kitchen waste/animal droppings and tilling to aerate soil for root and microbial respiration.
3. **Home Hygiene:** Handwashing with soap, washing produce with brine/vinegar, and disinfecting floors to remove pathogens.
4. **Human & Animal Health (One Health):** Diagnosing, preventing, and treating malaria, cholera, and anthrax.
5. **Conservation of Natural Resources:** Afforestation, crop rotation, cover cropping, forestry, fisheries, and wildlife management.
6. **Plant Health:** Curbing air/water/land degradation (such as illegal *galamsey* ponds) and reducing synthetic pesticides.
- **Workplaces:** Hospitals, Industries (breweries, cocoa processing, bakeries), Agricultural Farms, Educational Institutions, Markets (drying, freezing, smoking perishables), and Homes.

## The Scientific Method (7 Steps) & Logical Reasoning
1. **Identifying the Problem** via observation, fishbone diagrams, mind maps, and flowcharts.
2. **Reading Around the Problem** using scientific literature.
3. **Formulating a Hypothesis** — a testable "educated guess" relating variables.
4. **Experimentation** under controlled conditions.
5. **Collecting & Analysing Data** using tables, bar charts, histograms, pie charts, and ogives.
6. **Concluding** from empirical evidence so results can be replicated.
7. **Communicating Findings** in journals and scientific reports.

- **Inductive Reasoning (Bottom-Up, Specific → General):** Moves from specific observations to a broad rule (e.g., *Davi Dzifa is a grandmother and has gray hair; therefore grandmothers have gray hair*). Fast to form hypotheses, but less certain.
- **Deductive Reasoning (Top-Down, General → Specific):** Applies a verified general law to a specific case (e.g., *All mammals give birth to live young; sheep are mammals; therefore sheep give birth to live young*). Conclusion must hold if premises are true.

## Body Symmetry, Orientation & Sectioning
- **Bilateral Symmetry:** Divisible along a **single vertical plane** into mirror halves (humans, tilapia, toad, butterfly, *Drosophila*, lobster, mango, cashew nut).
- **Radial Symmetry:** Divisible along **more than one plane** through the central axis (jellyfish, starfish, sea urchin, hibiscus flower, orange, okra, tomato, pawpaw).
- **Asymmetry:** No plane produces identical halves (sponges, land snail, fiddler crab, narwhal).
- **Five Views (Orientations):** **Anterior** (head/front), **Posterior** (tail/rear), **Dorsal** (upper/back), **Ventral** (underside/belly), **Lateral** (side view).
- **Three Section Planes:** **Longitudinal Section (L.S.)** cut along length/long axis; **Transverse Section (T.S.)** cross-cut perpendicular to long axis; **Vertical Section (V.S.)** cut perpendicular to horizontal plane (e.g., skin or heart).

## Ten Mandatory Biological Drawing Rules (WASSCE Practical)
1. Include an underlined heading/title above or below the diagram.
2. Cover at least **two-thirds ($2/3$)** of the provided space (or exact $10 - 12\\text{ cm}$ range if specified).
3. **No arrowheads** on guidelines.
4. Rule guidelines cleanly with a straight edge; **lines must never cross**.
5. Each guideline must touch the exact structure cleanly—not hanging or exceeding.
6. Draw thin, firm, continuous outlines (never woolly, feathery, or broken).
7. Write magnification at the bottom-right corner (e.g., $\\times 2$).
8. One label per guideline.
9. Write all labels **horizontally** in clear block or neat script.
10. Use a sharp **HB pencil** and clean eraser (tools: long HB pencil, eraser, ruler).`,
  },

  // Deep SHS Year 1 PDF Masterclass 2: Microscopes
  {
    id: 'note-bio-s1-microscopes-pdf',
    topicId: 'bio-s1-cell',
    isBuiltIn: true,
    title: 'SHS Year 1 PDF: Optical & Electron Microscopes, Care & Wet Mount Slides',
    subject: 'biology',
    grade: 'SHS1',
    tags: ['SHS1', 'Biology', 'PDF Masterclass', 'Microscopes', 'Wet Mount'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Microscopes (New Curricular Year 1)

## Types of Microscopes & Magnification Math
A microscope reveals specimens too small for the unaided eye (viruses, bacteria, cells).
- **Optical (Light) Microscopes:** Use visible light ($400 - 700\\text{ nm}$) and glass lenses. Divided into **Simple Microscopes** (single short-focal-length convex magnifying lens forming a virtual image) and **Compound Microscopes** (two or more lenses: eyepiece $\\times$ objective).
- **Electron Microscopes:** Use electron beams focused by electromagnets in vacuum: **TEM** (2D internal ultrastructure), **SEM** (3D-like surface scans), and **STEM**.
$$\\text{Total Magnification} = \\text{Eyepiece (e.g. } \\times 10\\text{)} \\times \\text{Objective (}\\times 4, \\times 10, \\times 40\\text{)}$$

## 13 Parts of the Compound Light Microscope
1. **Eyepiece (Ocular) Lens:** Monocular or binocular lens ($\\times 10$ or $\\times 15$) at the top.
2. **Body Tube:** Connects eyepiece lens to objective turret.
3. **Objective Lenses:** Low ($\\times 4$), medium ($\\times 10$), high ($\\times 40$); always begin focusing with low power!
4. **Arm:** Supports tube and stage; held with one hand while carrying.
5. **Revolving Nosepiece:** Rotates smoothly to click objective lenses into optical alignment.
6. **Coarse Adjustment Knob:** Moves stage/tube significantly for initial low-power focusing.
7. **Fine Adjustment Knob:** Sharpens fine detail under medium/high power without hitting the slide.
8. **Stage:** Firm flat platform supporting the glass slide.
9. **Stage Clips:** Secure the slide in position.
10. **Aperture:** Stage opening transmitting light onto the specimen.
11. **Condenser:** Lenses beneath the stage that focus light beams onto the specimen.
12. **Illuminator:** Electric lamp or adjustable mirror (**never direct sunlight!**).
13. **Iris Diaphragm:** Controls light intensity entering the specimen for optimal contrast.

## Optical vs Electron Microscopes (9-Criteria Comparison)
| Criteria | Light / Optical Microscopes | Electron Microscopes |
| :--- | :--- | :--- |
| **Size & Cost** | Compact, portable, less expensive | Very large, heavy, very expensive |
| **Radiation** | Visible light ($400 - 700\\text{ nm}$) | Beam of electrons ($\\approx 1\\text{ nm}$) |
| **Focusing** | Glass optical lenses | Electromagnets |
| **Resolution & Magnification** | Lower ($200\\text{ nm}$, up to $\\times 2,000$) | Very high ($1\\text{ nm}$, up to $\\times 1,000,000$) |
| **2D/3D Depth & Thickness** | 2D focusable planes; thin sections | TEM 2D ultra-thin; SEM 3D surface |
| **Color** | Natural colors or wet-mount stains | Monochrome grayscale (often false-colored) |

## Care Rules & Preparing a 45° Wet Mount Slide
- **Care:** Carry with **both hands** (arm + base); clean lenses with **lens tissue only**; cool electric bulbs before packing; store lenses in a **silica-gel desiccator** to prevent mould; cover and box after use.
- **Wet Mount Steps ($75 \\times 26\\text{ mm}$ slide):** Clean slide & coverslip $\\rightarrow$ place onion epidermis in a drop of water $\\rightarrow$ rest one coverslip edge and gently lower at **$\\sim 45^\\circ$** with a probe to prevent **air bubbles** $\\rightarrow$ add stain (**iodine, eosin, or methylene blue** — poisonous, handle safely) $\\rightarrow$ wick excess liquid gently using **blotting paper** $\\rightarrow$ optionally seal with clear nail polish $\\rightarrow$ label and observe under low power first.`,
  },

  // Standard 9 Biology Unit Notes
  {
    id: 'syllabus-bio-s1-cell',
    topicId: 'bio-s1-cell',
    isBuiltIn: true,
    title: 'Unit 1.1: Cell Structure, Microscopy & Membrane Transport',
    subject: 'biology',
    grade: 'SHS1',
    tags: ['SHS1', 'Biology', 'Cells', 'Osmosis', 'Active Transport'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Cell Structure, Microscopy & Membrane Transport

## Prokaryotic vs Eukaryotic Ultrastructure
- **Prokaryotes (Bacteria):** Lack a membrane-bound nucleus ($70\\text{S}$ ribosomes, circular plasmid DNA, peptidoglycan cell wall).
- **Eukaryotes (Plants, Animals, Fungi):** True nucleus, $80\\text{S}$ ribosomes, mitochondria (ATP), Golgi apparatus (packaging), smooth/rough ER. Plants uniquely possess cellulose cell walls, chloroplasts, and a large central vacuole.
$$\\text{Magnification} = \\frac{\\text{Observed Image Size}}{\\text{Actual Specimen Size}} \\quad (1\\text{ mm} = 1000\\,\\mu\\text{m})$$

## Membrane Transport Mechanisms (Fluid Mosaic Model)
1. **Simple & Facilitated Diffusion:** Passive net movement down a concentration gradient (no ATP).
2. **Osmosis:** Net diffusion of water molecules from high water potential ($\\Psi$) to lower water potential across a selectively permeable membrane.
   - *Hypotonic solution:* Animal cells lyse (burst); plant cells become **turgid**.
   - *Hypertonic solution:* Plant cytoplasm shrinks from cell wall (**plasmolysis**).
3. **Active Transport:** Movement against a concentration gradient using carrier proteins and **ATP** (e.g., mineral ion uptake in root hair cells).`,
  },
  {
    id: 'syllabus-bio-s1-nutrition',
    topicId: 'bio-s1-nutrition',
    isBuiltIn: true,
    title: 'Unit 1.2: Photosynthesis & Leaf Adaptations',
    subject: 'biology',
    grade: 'SHS1',
    tags: ['SHS1', 'Biology', 'Photosynthesis', 'Calvin Cycle', 'Stomata'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Photosynthesis & Leaf Adaptations

## Two-Stage Biochemical Pathway
$$6\\text{CO}_2 + 6\\text{H}_2\\text{O} \\xrightarrow{\\text{light, chlorophyll}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2$$
1. **Light-Dependent Reactions (Thylakoid Membranes):** Chlorophyll absorbs photons; photolysis splits $\\text{H}_2\\text{O}$ releasing $\\text{O}_2$ gas while generating **ATP** and **NADPH** ($\\text{NADP}$ reduced).
2. **Calvin Cycle / Light-Independent Stage (Stroma):** Enzyme **RuBisCO** fixes $\\text{CO}_2$ into 5-carbon RuBP using ATP and NADPH to synthesize triose phosphates and glucose.

## Leaf Structural Adaptations & Stomatal Control
- **Palisade Mesophyll:** Tightly packed vertical columns right under the transparent upper epidermis with numerous chloroplasts and thin cell walls.
- **Guard Cells:** Active uptake of $\\text{K}^+$ ions in sunlight lowers water potential $\\rightarrow$ osmotic water entry $\\rightarrow$ thicker inner cell walls bend outward to open the stoma.

## Limiting Factors (Blackman’s Law)
At low light, light intensity limits rate; once plateaued, either **$\\text{CO}_2$ concentration** or **temperature** (enzyme kinetics up to $\\sim 35 - 40^\\circ\\text{C}$) limits the rate.`,
  },
  {
    id: 'syllabus-bio-s1-enzymes',
    topicId: 'bio-s1-enzymes',
    isBuiltIn: true,
    title: 'Unit 1.3: Biological Molecules & Enzyme Kinetics',
    subject: 'biology',
    grade: 'SHS1',
    tags: ['SHS1', 'Biology', 'Biomolecules', 'Food Tests', 'Enzymes'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Biological Molecules & Enzyme Kinetics

## Biomolecules & WASSCE Diagnostic Food Tests
| Nutrient | Reagent Test | Positive Result |
| :--- | :--- | :--- |
| **Starch** | Iodine solution | Yellow-brown $\\rightarrow$ **Blue-black** |
| **Reducing Sugar** | Benedict’s + heat | Blue $\\rightarrow$ Green $\\rightarrow$ Orange $\\rightarrow$ **Brick-red** |
| **Protein** | Biuret ($\\text{NaOH} + \\text{CuSO}_4$) | Light blue $\\rightarrow$ **Violet / Purple** |
| **Lipid** | Ethanol emulsion / Sudan III | Milky white emulsion / Red layer |

## Enzyme Catalysis & Inhibition
Enzymes are globular protein catalysts that lower **activation energy ($E_a$)** via complementary active sites (**Induced Fit Model**):
$$E + S \\rightleftharpoons ES \\rightarrow E + P$$
- **Temperature & pH:** Activity peaks at optimum conditions; extreme heat or pH breaks hydrogen/ionic bonds causing irreversible **denaturation**.
- **Competitive Inhibitors:** Bind the active site; overcome by raising substrate concentration ($V_{\\max}$ unchanged).
- **Non-Competitive Inhibitors:** Bind an allosteric site, distorting active site shape and permanently lowering $V_{\\max}$.`,
  },
  {
    id: 'syllabus-bio-s2-transport',
    topicId: 'bio-s2-transport',
    isBuiltIn: true,
    title: 'Unit 2.1: Transport in Mammals & Plants',
    subject: 'biology',
    grade: 'SHS2',
    tags: ['SHS2', 'Biology', 'Heart', 'Xylem', 'Phloem'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Transport in Mammals & Plants

## Mammalian Double Circulation & Cardiac Cycle
Mammals separate oxygenated and deoxygenated blood across pulmonary and systemic circuits:
- **Left Ventricle:** Thickest muscular wall to pump blood at high pressure through the aorta to the entire body.
- **SAN (Pacemaker) $\\rightarrow$ AVN $\\rightarrow$ Bundle of His $\\rightarrow$ Purkinje Fibres** coordinates atrial and ventricular systole.
$$\\text{Cardiac Output} = \\text{Heart Rate} \\times \\text{Stroke Volume}$$
- **Bohr Effect:** High $\\text{CO}_2$ lowers blood pH in active tissues, shifting hemoglobin’s oxygen dissociation curve to the right to unload more $\\text{O}_2$.

## Plant Vascular Transport
- **Xylem (Cohesion-Tension Theory):** Transpiration evaporation creates negative pressure (tension) pulling continuous hydrogen-bonded water columns upward through lignified dead vessels.
- **Phloem (Mass Flow Hypothesis):** Companion cells actively load sucrose into sieve tubes at sources, drawing water in by osmosis to drive turgor-pressure translocation toward sinks.`,
  },
  {
    id: 'syllabus-bio-s2-respiration',
    topicId: 'bio-s2-respiration',
    isBuiltIn: true,
    title: 'Unit 2.2: Cellular Respiration & Gaseous Exchange',
    subject: 'biology',
    grade: 'SHS2',
    tags: ['SHS2', 'Biology', 'ATP', 'Respiration', 'Alveoli'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Cellular Respiration & Gaseous Exchange

## Aerobic vs Anaerobic Respiration
1. **Glycolysis (Cytoplasm):** Glucose ($6\\text{C}$) splits into 2 Pyruvate ($3\\text{C}$), netting $2\\text{ ATP}$ and $2\\text{ NADH}$ (no $\\text{O}_2$ needed).
2. **Link Reaction & Krebs Cycle (Mitochondrial Matrix):** Releases $\\text{CO}_2$ and loads $\\text{NADH}$ / $\\text{FADH}_2$.
3. **Oxidative Phosphorylation (Inner Cristae):** $\\text{O}_2$ acts as the **terminal electron acceptor** yielding $\\sim 32\\text{ ATP}$ total per glucose.
- **Anaerobic:** Animals form **lactic acid** (oxygen debt); yeast plants form **ethanol + $\\text{CO}_2$**.
$$\\text{RQ} = \\frac{\\text{Volume of CO}_2\\text{ produced}}{\\text{Volume of O}_2\\text{ consumed}} \\quad (\\text{Carbohydrate } \\approx 1.0,\\; \\text{Lipid } \\approx 0.7)$$

## Ventilation Mechanics & Alveoli
- **Inhalation:** External intercostals contract (ribs move up/out) and diaphragm flattens $\\rightarrow$ thoracic volume rises $\\rightarrow$ intrapulmonary pressure drops below atmospheric pressure.
- Alveoli maximize Fick’s Law rate via huge surface area, one-cell-thick squamous walls, moist surfactant lining, and dense capillary steep gradients.`,
  },
  {
    id: 'syllabus-bio-s2-homeostasis',
    topicId: 'bio-s2-homeostasis',
    isBuiltIn: true,
    title: 'Unit 2.3: Excretion, Nephron & Homeostasis',
    subject: 'biology',
    grade: 'SHS2',
    tags: ['SHS2', 'Biology', 'Nephron', 'ADH', 'Homeostasis'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Excretion, Nephron & Homeostasis

## Ultrafiltration & Selective Reabsorption
- **Glomerular Ultrafiltration:** Wider **afferent arteriole** than **efferent arteriole** generates high hydrostatic pressure forcing water, urea, salts, and glucose through podocyte slits while retaining large plasma proteins and RBCs.
- **Proximal Convoluted Tubule (PCT):** $100\\%$ of glucose and amino acids are actively co-transported back into peritubular capillaries via microvilli.
- **Loop of Henle:** Counter-current multiplier establishes a hypertonic renal medulla gradient for water recovery.

## Osmoregulation (ADH) & Blood Glucose Feedback
- **ADH Action:** Osmoreceptors in the hypothalamus detect concentrated plasma and signal the posterior pituitary to release **ADH**, inserting **aquaporins** into the collecting duct for concentrated urine.
- **Glucose Homeostasis:** Islets of Langerhans secrete **insulin** ($\\beta$-cells $\\rightarrow$ glycogenesis) when glucose is high, and **glucagon** ($\\alpha$-cells $\\rightarrow$ glycogenolysis) when blood glucose drops.`,
  },
  {
    id: 'syllabus-bio-s3-genetics',
    topicId: 'bio-s3-genetics',
    isBuiltIn: true,
    title: 'Unit 3.1: Mendelian Genetics, Linkage & DNA Replication',
    subject: 'biology',
    grade: 'SHS3',
    tags: ['SHS3', 'Biology', 'Genetics', 'Sex-Linkage', 'DNA'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Mendelian Genetics, Linkage & DNA Replication

## Inheritance Patterns & Crosses
- **Monohybrid $F_2$ (heterozygous $\\times$ heterozygous):** $3:1$ phenotypic ratio. **Dihybrid $F_2$** (unlinked genes): $9:3:3:1$.
- **Codominance & Multiple Alleles:** Human ABO blood groups ($I^A, I^B$ codominant; $I^O$ recessive).
- **X-Linked Recessive Traits (e.g., Haemophilia, Red-Green Color Blindness):** Males ($XY$) are hemizygous and express the condition from a single $X^h$ allele inherited from a carrier mother ($X^H X^h$).

## Mitosis, Meiosis & Central Dogma
- **Meiosis:** Homologous crossing-over (Prophase I) and independent assortment (Metaphase I) generate genetic variation in haploid ($n$) gametes.
- **Semi-Conservative Replication:** DNA helicase unzips strands; DNA polymerase joins complementary nucleotides ($A=T, G\\equiv C$).
- **Protein Synthesis:** **Transcription** builds mRNA inside the nucleus; **Translation** pairs mRNA codons with tRNA anticodons on ribosomes to assemble polypeptide chains.`,
  },
  {
    id: 'syllabus-bio-s3-ecology',
    topicId: 'bio-s3-ecology',
    isBuiltIn: true,
    title: 'Unit 3.2: Ecology, Population Dynamics & Conservation',
    subject: 'biology',
    grade: 'SHS3',
    tags: ['SHS3', 'Biology', 'Ecology', 'Nitrogen Cycle', 'Lincoln Index'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Ecology, Population Dynamics & Conservation

## Energy Flow & Population Sampling
Only $\\sim 10\\%$ of energy passes between trophic levels due to cellular respiration heat loss, undigested faeces, and unconsumed parts (pyramids of energy are always upright).
$$\\text{Lincoln Index Population Estimate: } N = \\frac{n_1 \\times n_2}{m_2}$$
where $n_1$ = marked & released first sample, $n_2$ = total second catch, $m_2$ = marked recaptures. Quadrats sample sessile plants; transects track distribution across abiotic gradients.

## Nitrogen Cycle & Eutrophication
1. **Nitrogen Fixation:** *Rhizobium* in legume root nodules and *Azotobacter* convert $\\text{N}_2 \\rightarrow \\text{NH}_4^+$.
2. **Nitrification:** *Nitrosomonas* ($\\text{NH}_4^+ \\rightarrow \\text{NO}_2^-$) and *Nitrobacter* ($\\text{NO}_2^- \\rightarrow \\text{NO}_3^-$).
3. **Denitrification:** Anaerobic *Pseudomonas* reduces soil nitrates back to atmospheric $\\text{N}_2$ in waterlogged soils.
- Fertilizer runoff triggers **eutrophication**: algal bloom $\\rightarrow$ shaded aquatic plants die $\\rightarrow$ aerobic bacteria deplete dissolved $\\text{O}_2$ $\\rightarrow$ fish kills.`,
  },
  {
    id: 'syllabus-bio-s3-evolution',
    topicId: 'bio-s3-evolution',
    isBuiltIn: true,
    title: 'Unit 3.3: Evolution, Adaptation & Biotechnology',
    subject: 'biology',
    grade: 'SHS3',
    tags: ['SHS3', 'Biology', 'Evolution', 'Hardy-Weinberg', 'Biotechnology'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Evolution, Adaptation & Biotechnology

## Natural Selection & Speciation
Random mutations create phenotypic variation; environmental selection pressures allow better-adapted individuals to survive, reproduce, and pass advantageous alleles to offspring.
- **Allopatric Speciation:** Physical/geographical barrier isolates subpopulations until reproductive isolation evolves.
- **Homologous vs Analogous Structures:** Pentadactyl vertebrate limbs share a common ancestor (**divergent evolution**), whereas insect and bird wings evolved independently (**convergent evolution**).

## Hardy-Weinberg Equilibrium & Genetic Engineering
Under random mating, large population size, and no mutation, migration, or selection:
$$p + q = 1, \\qquad p^2 + 2pq + q^2 = 1$$
where $q^2$ = homozygous recessive genotype frequency and $2pq$ = heterozygous carrier frequency.
- **Recombinant DNA:** Restriction endonucleases cut human insulin gene and bacterial plasmid with sticky ends; **DNA ligase** seals them to transform *E. coli* for mass insulin synthesis.`,
  },
];
