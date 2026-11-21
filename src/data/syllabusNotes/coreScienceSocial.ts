import type { StudyNote } from '../../types';

const CREATED_AT = '2026-01-15T08:00:00.000Z';

export const CORE_SCIENCE_SOCIAL_SYLLABUS_NOTES: StudyNote[] = [
  // INTEGRATED SCIENCE (SHS 1 - 3)
  {
    id: 'syllabus-intsci-s1-matter',
    topicId: 'intsci-s1-matter',
    isBuiltIn: true,
    title: 'Unit 1.1: Diversity of Matter & Scientific Measurement',
    subject: 'integratedscience',
    grade: 'SHS1',
    tags: ['SHS1', 'Integrated Science', 'SI Units', 'Mixtures', 'Matter'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Diversity of Matter & Scientific Measurement

## Fundamental & Derived SI Quantities
Seven SI base units anchor all science: **metre (m)**, **kilogram (kg)**, **second (s)**, **ampere (A)**, **kelvin (K)**, **mole (mol)**, and **candela (cd)**.
$$\\rho = \\frac{m}{V}\\;(\\text{kg m}^{-3}), \\qquad P = \\frac{F}{A}\\;(\\text{Pa} = \\text{N m}^{-2})$$

## Compounds vs Mixtures & Separation Methods
- **Compounds** have fixed composition, chemical bonds, and properties distinct from their elements; **Mixtures** retain constituent properties and separate physically:
  - **Filtration:** Insoluble solid from liquid.
  - **Simple / Fractional Distillation:** Liquids with differing boiling points (e.g., ethanol & water).
  - **Separating Funnel:** Immiscible liquids (palm oil & water).
  - **Sublimation:** Volatile solid directly from non-subliming impurity (iodine, ammonium chloride, camphor).
  - **Chromatography:** Separating dissolved plant pigments or dyes.`,
  },
  {
    id: 'syllabus-intsci-s1-cells',
    topicId: 'intsci-s1-cells',
    isBuiltIn: true,
    title: 'Unit 1.2: Cell Organization, Diffusion & Photosynthesis',
    subject: 'integratedscience',
    grade: 'SHS1',
    tags: ['SHS1', 'Integrated Science', 'Cells', 'Osmosis', 'Photosynthesis'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Cell Organization, Diffusion & Photosynthesis

## Plant vs Animal Cell Comparison
- **Shared organelles:** Nucleus, cytoplasm, cell membrane, mitochondria, ribosomes.
- **Unique to Plant Cells:** Cellulose cell wall (prevents bursting), chloroplasts (chlorophyll), large permanent central vacuole, regular rigid shape.
- **Specialization Hierarchy:** Cell $\\rightarrow$ Tissue $\\rightarrow$ Organ $\\rightarrow$ Organ System $\\rightarrow$ Organism.

## Osmosis & Testing a Leaf for Starch
- **Plasmolysis:** Occurs when a plant cell loses water in a concentrated salt/sugar solution, pulling its cell membrane away from the cell wall.
- **Starch Leaf Test Steps:** (1) Boil in water to kill cells and stop enzymes $\\rightarrow$ (2) Boil in **ethanol in a water bath** (flammable! no naked flame) to decolorize chlorophyll $\\rightarrow$ (3) Rinse in warm water to soften $\\rightarrow$ (4) Add iodine (blue-black confirms starch).`,
  },
  {
    id: 'syllabus-intsci-s1-acidsbases',
    topicId: 'intsci-s1-acidsbases',
    isBuiltIn: true,
    title: 'Unit 1.3: Acids, Bases, Salts & Soap Making',
    subject: 'integratedscience',
    grade: 'SHS1',
    tags: ['SHS1', 'Integrated Science', 'Acids', 'Salts', 'Saponification'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Acids, Bases, Salts & Soap Making

## Properties & Neutralization Reactions
- **Acids ($\\text{pH} < 7$):** Turn blue litmus red; produce $\\text{H}^+$ in water; neutralize bases and liberate $\\text{H}_2$ with reactive metals ($\\text{Zn, Mg}$) or $\\text{CO}_2$ with carbonates.
$$\\text{Acid} + \\text{Base} \\rightarrow \\text{Salt} + \\text{Water}$$
- **Uses in daily life:** $\\text{Mg(OH)}_2$ / $\\text{NaHCO}_3$ relieves stomach acidity; agricultural lime ($\\text{CaO} / \\text{CaCO}_3$) neutralizes acidic soils.

## Saponification & Local *Alata Samina* Soap
$$\\text{Fat / Palm Oil (Ester)} + \\text{Alkali (KOH / NaOH)} \\xrightarrow{\\text{heat}} \\text{Soap (Fatty Acid Salt)} + \\text{Glycerol}$$
- In Ghana, roasted cocoa pod husks or plantain peels are leached with water to extract **potash ($\\text{K}_2\\text{CO}_3$)** alkali, boiled with palm kernel oil, and salted out if hard soap is desired.`,
  },
  {
    id: 'syllabus-intsci-s2-machines',
    topicId: 'intsci-s2-machines',
    isBuiltIn: true,
    title: 'Unit 2.1: Force, Energy & Simple Machines',
    subject: 'integratedscience',
    grade: 'SHS2',
    tags: ['SHS2', 'Integrated Science', 'Simple Machines', 'Levers', 'Efficiency'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Force, Energy & Simple Machines

## Mechanical Advantage, Velocity Ratio & Efficiency
$$MA = \\frac{\\text{Load}}{\\text{Effort}}, \\qquad VR = \\frac{\\text{Distance moved by Effort}}{\\text{Distance moved by Load}}, \\qquad \\eta = \\frac{MA}{VR} \\times 100\\%$$
- No real machine reaches $100\\%$ efficiency because part of the work input overcomes **friction** and lifts movable parts of the machine itself (lost as heat).

## Classes of Levers (Memory Aid: **PLE / 1-2-3**)
- **1st Class (Fulcrum in middle):** Scissors, crowbar, seesaw.
- **2nd Class (Load in middle):** Wheelbarrow, nutcracker, bottle opener (always $MA > 1$).
- **3rd Class (Effort in middle):** Human forearm, pair of tongs, fishing rod (magnifies speed/distance).
- For an **inclined plane** of length $l$ and vertical height $h$: $VR = l / h$.`,
  },
  {
    id: 'syllabus-intsci-s2-ecology',
    topicId: 'intsci-s2-ecology',
    isBuiltIn: true,
    title: 'Unit 2.2: Ecosystems, Soil Conservation & Nitrogen Cycle',
    subject: 'integratedscience',
    grade: 'SHS2',
    tags: ['SHS2', 'Integrated Science', 'Soil', 'Nitrogen Cycle', 'Conservation'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Ecosystems, Soil Conservation & Nitrogen Cycle

## Soil Fertility & the Nitrogen Cycle
$$\\text{N}_2 \\xrightarrow{\\text{Rhizobium}} \\text{NH}_4^+ \\xrightarrow{\\text{Nitrosomonas}} \\text{NO}_2^- \\xrightarrow{\\text{Nitrobacter}} \\text{NO}_3^-$$
- *Rhizobium* bacteria live symbiotically inside root nodules of cowpea and groundnut, converting atmospheric $\\text{N}_2$ into usable nitrogen compounds.
- **Soil pH:** Optimal for most crops between $6.0 - 7.5$; acidic soils reduce phosphorus uptake and are corrected by **liming**.

## Topsoil Conservation Practices
1. **Crop Rotation (with legumes):** Replenishes nitrates naturally and breaks pest life cycles.
2. **Mulching & Cover Cropping:** Shields bare soil from raindrop splash erosion, slows runoff, and retains soil moisture.
3. **Contour Ploughing & Terracing:** Ploughing across slopes rather than up-and-down reduces gully erosion.`,
  },
  {
    id: 'syllabus-intsci-s2-health',
    topicId: 'intsci-s2-health',
    isBuiltIn: true,
    title: 'Unit 2.3: Human Reproduction, Nutrition & Diseases',
    subject: 'integratedscience',
    grade: 'SHS2',
    tags: ['SHS2', 'Integrated Science', 'Nutrition', 'Immunity', 'Malaria'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Human Reproduction, Nutrition & Diseases

## Nutrition, Hormones & Menstrual Cycle
- Deficiency diseases: **Kwashiorkor** (protein), **Marasmus** (total calories/protein), **Rickets** (Vitamin D), **Goitre** (Iodine), **Anaemia** (Iron).
- **FSH** stimulates ovarian follicle maturation $\\rightarrow$ **Oestrogen** rebuilds uterine lining $\\rightarrow$ **LH surge** (Day 14) triggers ovulation $\\rightarrow$ **Progesterone** from corpus luteum maintains endometrium.

## Communicable Diseases & Immunity
- **Malaria:** Protozoan *Plasmodium* transmitted by **female *Anopheles* mosquito**; prevent via insecticide-treated nets (ITNs), draining stagnant water, and larviciding.
- **Active Immunity** occurs when the body synthesizes its own antibodies (infection or vaccination); **Passive Immunity** transfers ready-made antibodies (breastmilk, antivenom serum).`,
  },
  {
    id: 'syllabus-intsci-s3-electricity',
    topicId: 'intsci-s3-electricity',
    isBuiltIn: true,
    title: 'Unit 3.1: Electricity, Electronics & Domestic Safety',
    subject: 'integratedscience',
    grade: 'SHS3',
    tags: ['SHS3', 'Integrated Science', 'Electricity', 'Diodes', 'Safety'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Electricity, Electronics & Domestic Safety

## Domestic Billing (kWh) & Wiring Safety
$$E\\;(\\text{kWh}) = \\frac{P\\;(\\text{W}) \\times t\\;(\\text{hours})}{1000}, \\qquad I = \\frac{P}{V}$$
- **Ghanaian 3-Pin Plug Wiring:** **Live** (brown/red, carries $230\\text{ V}$, connected via **fuse & switch**), **Neutral** (blue/black, return path at $0\\text{ V}$), **Earth** (green/yellow, safely conducts fault current from metal casing to ground).
- Choose a fuse rated slightly above normal operating current (e.g., $13\\text{ A}$ for a $2.2\\text{ kW}$ kettle drawing $9.2\\text{ A}$).

## Semiconductor p-n Junction Diodes
Doping Silicon with Group 5 donor gives **n-type**; Group 3 acceptor gives **p-type**. Under **forward bias** ($p$ to $+$, $n$ to $-$), current conducts; under **reverse bias**, it blocks current—enabling AC-to-DC **rectification**.`,
  },
  {
    id: 'syllabus-intsci-s3-earth',
    topicId: 'intsci-s3-earth',
    isBuiltIn: true,
    title: 'Unit 3.2: Tectonic Forces, Weathering & Sanitation',
    subject: 'integratedscience',
    grade: 'SHS3',
    tags: ['SHS3', 'Integrated Science', 'Rocks', 'Weathering', 'Sanitation'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Tectonic Forces, Weathering & Sanitation

## The Rock Cycle & Weathering
- **Igneous** (cooled magma: granite, basalt), **Sedimentary** (compacted strata/fossils: limestone, sandstone), **Metamorphic** (heat/pressure altered: marble from limestone, slate from shale).
- **Physical Weathering:** Temperature exfoliation (onion-skin peeling) and root wedging fracture rock without changing chemistry.
- **Chemical Weathering:** Carbonation dissolves limestone caves:
$$\\text{CO}_2 + \\text{H}_2\\text{O} + \\text{CaCO}_3 \\rightarrow \\text{Ca(HCO}_3)_2\\;(\\text{soluble})$$

## Municipal Sanitation & Waste Management
Apply the **Reduce–Reuse–Recycle (3Rs)** hierarchy: compost organic waste, recycle plastics/metals, and isolate hazardous waste in engineered sanitary landfills lined with impermeable clay/geomembranes to protect groundwater.`,
  },
  {
    id: 'syllabus-intsci-s3-hydrocarbons',
    topicId: 'intsci-s3-hydrocarbons',
    isBuiltIn: true,
    title: 'Unit 3.3: Hydrocarbons, Fuels & Industrial Chemistry',
    subject: 'integratedscience',
    grade: 'SHS3',
    tags: ['SHS3', 'Integrated Science', 'Hydrocarbons', 'Petroleum', 'Polymers'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Hydrocarbons, Fuels & Industrial Chemistry

## Saturated vs Unsaturated Hydrocarbons
- **Alkanes ($\\text{C}_n\\text{H}_{2n+2}$):** Single $\\text{C-C}$ bonds only (methane, propane); unreactive with bromine water in darkness.
- **Alkenes ($\\text{C}_n\\text{H}_{2n}$):** Contain $\\text{C=C}$ double bond (ethene); **decolorize reddish-brown bromine water** via addition reaction.

## Fractional Distillation, Cracking & Biogas
- Crude oil separates by boiling point inside a fractionating column: Refinery gas (coolest top) $\\rightarrow$ Petrol $\\rightarrow$ Kerosene $\\rightarrow$ Diesel $\\rightarrow$ Fuel oil $\\rightarrow$ Bitumen (hottest bottom).
- **Cracking** breaks heavy low-demand fractions into high-demand petrol alkanes and alkenes for plastics (polythene).
- **Biogas** ($\\sim 60\\%\\text{ CH}_4$) is produced by anaerobic bacterial digestion of animal manure and crop waste.`,
  },

  // SOCIAL STUDIES (SHS 1 - 3)
  {
    id: 'syllabus-soc-s1-identity',
    topicId: 'soc-s1-identity',
    isBuiltIn: true,
    title: 'Unit 1.1: Self-Identity & Adolescent Development',
    subject: 'socialstudies',
    grade: 'SHS1',
    tags: ['SHS1', 'Social Studies', 'Self-Identity', 'Adolescence', 'Maslow'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Self-Identity & Adolescent Development

## Self-Concept, Self-Esteem & Maslow’s Hierarchy
- **Self-Concept:** How you perceive your abilities, personality, and strengths/weaknesses. **Self-Esteem:** The sense of value and dignity you attach to yourself.
- **Maslow’s Five Levels (Base $\\rightarrow$ Apex):** Physiological (food/water) $\\rightarrow$ Safety $\\rightarrow$ Love & Belonging $\\rightarrow$ Esteem $\\rightarrow$ **Self-Actualization** (realizing full potential).
- Overcoming inferiority complex: set realistic goals, surround yourself with supportive peers, and acquire skills.

## Adolescent Reproductive Health & Chastity
- Adolescence ($10 - 19$ years) brings rapid physical, emotional, and social transitions.
- **Chastity** helps students prevent unintended teenage pregnancy, school dropout, and STIs while cultivating self-discipline and academic focus.`,
  },
  {
    id: 'syllabus-soc-s1-culture',
    topicId: 'soc-s1-culture',
    isBuiltIn: true,
    title: 'Unit 1.2: Ghanaian Culture, Heritage & National Identity',
    subject: 'socialstudies',
    grade: 'SHS1',
    tags: ['SHS1', 'Social Studies', 'Culture', 'National Symbols', 'Heritage'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Ghanaian Culture, Heritage & National Identity

## Culture, Cultural Lag & Parallels
- **Culture** encompasses material artifacts (*Kente, stools, architecture*) and non-material values (*respect for elders, hospitality, festivals, proverbs*). Culture is dynamic and learned, never genetically inherited.
- **Cultural Lag:** Occurs when technological artifacts modernize faster than social beliefs/habits adapt.
- **Outmoded Practices to Abolish:** Female genital mutilation (FGM), *Trokosi*, dehumanizing widowhood rites, and child marriage.

## Symbols of Ghanaian National Unity
- **National Flag:** Red (blood of forebears), Gold (mineral wealth), Green (rich forests/agriculture), Black Star (lodestar of African freedom).
- **Festivals** (*Homowo, Odwira, Damba, Hogbetsotso*) promote reconciliation, home-town development fundraising, and cultural continuity across generations.`,
  },
  {
    id: 'syllabus-soc-s1-environment',
    topicId: 'soc-s1-environment',
    isBuiltIn: true,
    title: 'Unit 1.3: The Environment & Resource Conservation',
    subject: 'socialstudies',
    grade: 'SHS1',
    tags: ['SHS1', 'Social Studies', 'Environment', 'Galamsey', 'Sustainability'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# The Environment & Resource Conservation

## Environmental Threats in Ghana
- **Illegal Small-Scale Mining (*Galamsey*):** Pollutes major rivers (*Pra, Ankobra, Birim*) with mercury/cyanide and silt, destroying cocoa farms and raising Ghana Water Company treatment costs.
- **Deforestation & Bushfires:** Caused by illegal chainsaw logging, charcoal burning, and hunting/slash-and-burn farming—driving desertification and biodiversity loss.

## Sustainable Development & Remedies
**Sustainable development** meets present needs without compromising future generations’ capacity to meet theirs:
1. Enforce EPA, Forestry Commission, and Minerals Commission regulations strictly.
2. Promote community afforestation and clean cooking fuels (LPG/biogas).
3. Rehabilitate mined pits and cultivate responsible waste sorting in schools and markets.`,
  },
  {
    id: 'syllabus-soc-s2-family',
    topicId: 'soc-s2-family',
    isBuiltIn: true,
    title: 'Unit 2.1: Marriage, Family & Responsible Parenting',
    subject: 'socialstudies',
    grade: 'SHS2',
    tags: ['SHS2', 'Social Studies', 'Marriage', 'Family', 'PNDCL 111'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Marriage, Family & Responsible Parenting

## Forms of Marriage & Family Systems in Ghana
- **Three Legal Marriages:** **Customary** (potentially polygynous, sealed by bridewealth/drinks), **Ordinance** (Cap 127 — strictly monogamous, registered at court/church), and **Islamic** (Cap 129 — permits up to 4 wives if treated equitably).
- **Nuclear vs Extended Family:** Nuclear offers faster decision-making and focused resources; Extended provides kinship welfare, childcare support, and cultural preservation.

## Intestate Succession Law (PNDCL 111, 1985) & Parenting
- Protects the surviving spouse and children when someone dies without a will by guaranteeing them household chattels, one house, and major shares of residue estate.
- **Responsible Parenting** provides food, healthcare, shelter, moral guidance, and education, avoiding child neglect or streetism.`,
  },
  {
    id: 'syllabus-soc-s2-governance',
    topicId: 'soc-s2-governance',
    isBuiltIn: true,
    title: 'Unit 2.2: Democracy, Rule of Law & the 1992 Constitution',
    subject: 'socialstudies',
    grade: 'SHS2',
    tags: ['SHS2', 'Social Studies', 'Constitution', 'Democracy', 'Rule of Law'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Democracy, Rule of Law & the 1992 Constitution

## Separation of Powers & Checks and Balances
Ghana’s 1992 Constitution divides state authority to prevent tyranny:
- **Legislature (Parliament):** Enacts laws, vets ministerial/judicial nominees, and approves national budgets and loans.
- **Executive (President & Cabinet):** Implements laws and manages public administration.
- **Judiciary (led by Supreme Court):** Interprets laws and exercises **judicial review** to strike down unconstitutional statutes or executive acts.

## Pillars of Constitutional Democracy & Rule of Law
- **Rule of Law (A.V. Dicey):** Supremacy of regular law, equality of all citizens before the law, and protection of fundamental liberties.
- Key independent bodies: **Electoral Commission (EC)**, **CHRAJ** (human rights & anti-corruption), **NCCE** (civic education), and free independent media.`,
  },
  {
    id: 'syllabus-soc-s2-citizenship',
    topicId: 'soc-s2-citizenship',
    isBuiltIn: true,
    title: 'Unit 2.3: Citizenship, Rights & Civic Responsibilities',
    subject: 'socialstudies',
    grade: 'SHS2',
    tags: ['SHS2', 'Social Studies', 'Citizenship', 'Rights', 'Duties'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Citizenship, Rights & Civic Responsibilities

## Acquiring Ghanaian Citizenship (Chapter 3, 1992 Constitution)
1. **By Birth / Ancestry:** Born in or outside Ghana with at least one parent/grandparent who is a citizen.
2. **Foundling:** Child under 7 found in Ghana whose parents are unknown is presumed a citizen.
3. **Adoption:** Child under 16 legally adopted by a Ghanaian citizen.
4. **Registration:** Spouses married to Ghanaian citizens upon application.
5. **Naturalization:** Foreign adults meeting long-term residency, language, and good-character requirements.

## Constitutional Rights vs Civic Obligations
Rights (speech, assembly, fair trial, education) carry reciprocal civic duties: paying taxes honestly, obeying laws, voting responsibly, protecting state property, and reporting crime.`,
  },
  {
    id: 'syllabus-soc-s3-entrepreneurship',
    topicId: 'soc-s3-entrepreneurship',
    isBuiltIn: true,
    title: 'Unit 3.1: Socio-Economic Development & Entrepreneurship',
    subject: 'socialstudies',
    grade: 'SHS3',
    tags: ['SHS3', 'Social Studies', 'Entrepreneurship', 'Business', 'Development'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Socio-Economic Development & Entrepreneurship

## Enterprise Forms & Entrepreneurial Traits
- **Sole Proprietorship:** Easy startup, full profit retention, but suffers **unlimited personal liability** and weak continuity.
- **Limited Liability Company (Ltd):** Separate legal entity protecting owners’ personal assets and easing capital raising.
- Successful Ghanaian entrepreneurs exhibit calculated risk-taking, customer focus, financial record-keeping (separating personal and business cash), and perseverance.

## Productivity & Youth Employment Strategies
$$\\text{Productivity} = \\frac{\\text{Total Output Value}}{\\text{Resource Input}}$$
- Reduce graduate unemployment by promoting TVET vocational training, agro-processing startups, accessible SME credit, and digital skills.`,
  },
  {
    id: 'syllabus-soc-s3-scitech',
    topicId: 'soc-s3-scitech',
    isBuiltIn: true,
    title: 'Unit 3.2: Science, Technology & National Development',
    subject: 'socialstudies',
    grade: 'SHS3',
    tags: ['SHS3', 'Social Studies', 'Science', 'Technology', 'Innovation'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Science, Technology & National Development

## Science vs Technology & Value-Added Growth
- **Science** discovers systematic natural laws through observation and experimentation; **Technology** applies scientific principles into practical tools and processes.
- Investing in R&D (*CSIR, KNUST, UG*) transforms raw commodity exports (*cocoa beans, timber, bauxite*) into higher-value manufactured products, modernizes irrigation agriculture, and scales telemedicine.

## Bridging the Digital Divide & Appropriate Technology
- **Appropriate Technology** matches local skills, repairability, affordability, and environment (e.g., solar grain dryers, clean cookstoves).
- Challenges to address: inadequate R&D funding, unreliable power/broadband in rural areas, brain drain, and weak industry–university linkages.`,
  },
  {
    id: 'syllabus-soc-s3-peace',
    topicId: 'soc-s3-peace',
    isBuiltIn: true,
    title: 'Unit 3.3: Peace Building, Conflict Resolution & Global Cooperation',
    subject: 'socialstudies',
    grade: 'SHS3',
    tags: ['SHS3', 'Social Studies', 'Peace', 'Conflict', 'ECOWAS', 'UN'],
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    content: `# Peace Building, Conflict Resolution & Global Cooperation

## Sources & Peaceful Settlement of Conflicts
Common Ghanaian disputes stem from chieftaincy succession, land/boundary litigation, partisan intolerance, and unequal resource sharing.
- **Negotiation:** Disputing parties talk directly toward mutual compromise.
- **Mediation:** A neutral third party facilitates dialogue without forcing a verdict.
- **Arbitration:** A trusted third party hears evidence and issues a **binding decision**.
- **Peace Building** addresses root socio-economic grievances sustainably rather than merely halting violence temporarily.

## Ghana’s Regional & International Cooperation
- **ECOWAS:** Free movement of citizens, regional trade integration, and peacekeeping stability.
- **African Union (AU) & United Nations (UN):** Ghana contributes respected peacekeeping contingents and multilateral diplomacy.`,
  },
];
