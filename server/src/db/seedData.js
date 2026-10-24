/**
 * Seed Data for Spellbound Academy
 * Comprehensive lore, academic entities, and real campus functional models.
 */

export const houses = [
  {
    id: 'gryffindor',
    name: 'Gryffindor',
    motto: 'Valor Across the Winds of Peril',
    core_values: JSON.stringify(['Bravery', 'Aero-Flight', 'Honor', 'Dueling']),
    points: 1485,
    crest_color: '#7B1E28',
    accent_color: '#E9D9B7',
    animal: 'Golden Lion',
    gem: 'Spinel Ruby',
    head_of_house: 'Mistress Minerva Sterling'
  },
  {
    id: 'slytherin',
    name: 'Slytherin',
    motto: 'Subtlety Masters the Deepest Shadow',
    core_values: JSON.stringify(['Ambition', 'Potions', 'Shadow Arts', 'Resourcefulness']),
    points: 1460,
    crest_color: '#1F4734',
    accent_color: '#C0C0C0',
    animal: 'Emerald Serpent',
    gem: 'Deep Emerald',
    head_of_house: 'Professor Corvin Sallow'
  },
  {
    id: 'ravenclaw',
    name: 'Ravenclaw',
    motto: 'Wisdom through Starlit Inquiry',
    core_values: JSON.stringify(['Intellect', 'Astronomy', 'Rune Craft', 'Perception']),
    points: 1520,
    crest_color: '#15254A',
    accent_color: '#D6B46A',
    animal: 'Starlit Eagle',
    gem: 'Sapphire Dust',
    head_of_house: 'Arch-Magister Valerius'
  },
  {
    id: 'hufflepuff',
    name: 'Hufflepuff',
    motto: 'Steadfast as the Root, Warm as the Flame',
    core_values: JSON.stringify(['Loyalty', 'Herbology', 'Elemental Alchemy', 'Patience']),
    points: 1410,
    crest_color: '#8C6218',
    accent_color: '#F6F0E4',
    animal: 'Golden Badger',
    gem: 'Citrine Amber',
    head_of_house: 'Elder Rosemary Vance'
  },
  // Preserved alias houses for backward compatibility
  {
    id: 'ravencrest',
    name: 'Ravencrest',
    motto: 'Wisdom through Starlit Inquiry',
    core_values: JSON.stringify(['Intellect', 'Astronomy', 'Rune Craft', 'Perception']),
    points: 1520,
    crest_color: '#151D35',
    accent_color: '#D6B46A',
    animal: 'Gilded Raven',
    gem: 'Sapphire Dust',
    head_of_house: 'Arch-Magister Valerius'
  },
  {
    id: 'gryphonhart',
    name: 'Gryphonhart',
    motto: 'Valor Across the Winds of Peril',
    core_values: JSON.stringify(['Bravery', 'Aero-Flight', 'Honor', 'Dueling']),
    points: 1485,
    crest_color: '#6D3345',
    accent_color: '#E9D9B7',
    animal: 'Sky Gryphon',
    gem: 'Spinel Ruby',
    head_of_house: 'Mistress Helena Thorne'
  },
  {
    id: 'shadowvale',
    name: 'Shadowvale',
    motto: 'Subtlety Masters the Deepest Shadow',
    core_values: JSON.stringify(['Ambition', 'Potions', 'Shadow Arts', 'Resourcefulness']),
    points: 1460,
    crest_color: '#315C4A',
    accent_color: '#E9D9B7',
    animal: 'Emerald Serpent',
    gem: 'Deep Emerald',
    head_of_house: 'Professor Corvin Sallow'
  },
  {
    id: 'emberwyrm',
    name: 'Emberwyrm',
    motto: 'Steadfast as the Root, Warm as the Flame',
    core_values: JSON.stringify(['Loyalty', 'Herbology', 'Elemental Alchemy', 'Patience']),
    points: 1410,
    crest_color: '#82461D',
    accent_color: '#F6F0E4',
    animal: 'Fire Drake',
    gem: 'Citrine Amber',
    head_of_house: 'Elder Rosemary Vance'
  }
];

export const clubs = [
  {
    id: 'club-lit-debate',
    name: 'Literary and Debating Club',
    description: 'The premier society for parliamentary rhetoric, philosophy, runic translation, and competitive academic discourse.',
    lead_coordinator: 'Lyra Valerius (6th Year)',
    meeting_schedule: 'Tuesdays & Thursdays · 17:30 · East Scriptoria Hall',
    activities: JSON.stringify([
      'Weekly Parliamentary Debates',
      'The Great Lexicon Spoken Word Slam',
      'Philosophical Dialectics on Spell Ethics',
      'Manuscript Editing & Literary Journal Review'
    ]),
    icon_name: 'BookOpen'
  },
  {
    id: 'club-music',
    name: 'Music Club',
    description: 'Enchanted harmonies, orchestral instruments, acoustic reverberation charms, and solstice choral performances.',
    lead_coordinator: 'Julian Sterling (5th Year)',
    meeting_schedule: 'Mondays & Wednesdays · 18:00 · The Resonance Chamber',
    activities: JSON.stringify([
      'Enchanted String Quartets & Lute Ensemble',
      'Vocal Harmonization & Astral Hymns',
      'Contemporary Academy Band Showcase',
      'Acoustic Wave Modulation Workshops'
    ]),
    icon_name: 'Music'
  },
  {
    id: 'club-dance',
    name: 'Dance Club',
    description: 'Kinetic expression, celestial waltzes, ceremonial dances, and acrobatic tempo choreography.',
    lead_coordinator: 'Seraphina Vance (4th Year)',
    meeting_schedule: 'Wednesdays & Fridays · 18:30 · The Golden Ballroom Gallery',
    activities: JSON.stringify([
      'Solstice Gala Ceremonial Waltz Drills',
      'Contemporary Rhythmic Kinetic Movement',
      'Aerial Repulsion Flow Dance',
      'Inter-House Choreography Showcase'
    ]),
    icon_name: 'Sparkles'
  },
  {
    id: 'club-fine-arts',
    name: 'Fine Arts Club',
    description: 'Gilded painting, moving canvas portraits, sculpture, enchanted pottery, and botanical illustration.',
    lead_coordinator: 'Althea Moon (5th Year)',
    meeting_schedule: 'Saturdays · 14:00 · Sunlit Glasshouse Studio',
    activities: JSON.stringify([
      'Moving Portrait Pigment Formulation',
      'Clay & Repulsion Stone Sculpting',
      'Nocturnal Constellation Canvas Painting',
      'Botanical Field Sketching Expeditions'
    ]),
    icon_name: 'Palette'
  }
];

export const students = [
  {
    id: 'student-aris-thorne',
    name: 'Aris Thorne',
    house_id: 'ravenclaw',
    year: 'Fifth Year · Senior Adept',
    title: 'Scholar of Celestial Arithmancy',
    branch: 'Computer Science & Arcana',
    languages: JSON.stringify(['English', 'Hindi', 'French', 'Runic Eldorian']),
    hobbies: JSON.stringify(['Astrophotography', 'Chess', 'Broom Flight', 'Spell Scripting']),
    fields_of_interest: JSON.stringify(['Artificial Intelligence', 'Chronomancy', 'Quantum Arithmancy', 'Cyber Security']),
    skills: JSON.stringify(['Algorithm Design', 'Python & ArcanaScript', 'Temporal Modeling', 'React & Web Magic']),
    wand: '11¾ in · Black Walnut · Phoenix Feather Core',
    patronus: 'Obsidian Owl',
    fav_subject: 'Ancient Runes & Arithmancy',
    bio: 'Lead student researcher on astral ley lines, full-stack platform developer, and winner of the Silver Quill in runic translation.',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    points_contributed: 340,
    academic_rank: '4th in Class of 180',
    is_current_user: 1
  },
  {
    id: 'p-1',
    name: 'Lyra Valerius',
    house_id: 'ravenclaw',
    year: '6th Year · Prefect',
    title: 'Master of Runic Geometry',
    branch: 'Computer Science & Arcana',
    languages: JSON.stringify(['English', 'German', 'Ancient Latin', 'Hindi']),
    hobbies: JSON.stringify(['Debating', 'Chess', 'Reading', 'Stargazing']),
    fields_of_interest: JSON.stringify(['Artificial Intelligence', 'Cyber Security', 'Runic Linguistics', 'Quantum Arithmancy']),
    skills: JSON.stringify(['Public Speaking', 'System Architecture', 'Lexical Decryption', 'Logic Analysis']),
    wand: '12 in · Rowan · Unicorn Tail Hair',
    patronus: 'Silver Falcon',
    fav_subject: 'Ancient Runes',
    bio: 'President of the Literary & Debating Club, chief researcher of the Eldorian Astrolabe and author of three peer scrolls on celestial navigation.',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
    points_contributed: 290,
    academic_rank: '2nd in Class of 175',
    is_current_user: 0
  },
  {
    id: 'p-2',
    name: 'Cedric Blackthorn',
    house_id: 'gryffindor',
    year: '5th Year',
    title: 'Seeker & Aero-Captain',
    branch: 'Mechanical Alchemical Engineering',
    languages: JSON.stringify(['English', 'Hindi', 'Spanish']),
    hobbies: JSON.stringify(['Football', 'Volleyball', 'Broom Flight', 'Kinetic Tinkering']),
    fields_of_interest: JSON.stringify(['Robotics', 'Aero-Dynamics', 'Kinetic Mechanisms', 'Renewable Energy']),
    skills: JSON.stringify(['Aerodynamic Design', 'CAD & Runic Drafting', 'Team Leadership', 'High-Speed Reflexes']),
    wand: '11 in · English Oak · Dragon Heartstring',
    patronus: 'Snow Leopard',
    fav_subject: 'Aero-Tactics',
    bio: 'Captain of the outdoor sports brigade and record holder for the fastest flight navigation circuit across high-wind conditions.',
    avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=250&q=80',
    points_contributed: 310,
    academic_rank: '18th in Class of 180',
    is_current_user: 0
  },
  {
    id: 'p-3',
    name: 'Isolde Ravenshadow',
    house_id: 'slytherin',
    year: '7th Year',
    title: 'Alchemical Prodigy & C2S Lead',
    branch: 'Electronics & Optical Engineering',
    languages: JSON.stringify(['English', 'French', 'Japanese', 'Tamil']),
    hobbies: JSON.stringify(['Table Tennis', 'Badminton', 'Potion Brewing', 'Circuit Design']),
    fields_of_interest: JSON.stringify(['Semiconductors & C2S', 'Optoelectronics', 'Quantum Sensors', 'Nanotechnology']),
    skills: JSON.stringify(['Oscilloscope Analysis', 'VLSI Design', 'Catalyst Optimization', 'Cleanroom Protocol']),
    wand: '13 in · Yew · Thestral Hair Core',
    patronus: 'Viper of the Mist',
    fav_subject: 'Subterranean Potions & C2S Fab',
    bio: 'Lead adept researcher in the C2S Semiconductor Fab Lab, specializing in photon-stimulated wafer crystallization and memory extraction tonics.',
    avatar_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=250&q=80',
    points_contributed: 420,
    academic_rank: '1st in Class of 160',
    is_current_user: 0
  },
  {
    id: 'p-4',
    name: 'Thaddeus Thorne',
    house_id: 'hufflepuff',
    year: '4th Year',
    title: 'Keeper of Herbological Groves',
    branch: 'Civil & Sustainable Infrastructure',
    languages: JSON.stringify(['English', 'Hindi', 'Telugu']),
    hobbies: JSON.stringify(['Kho-Kho', 'Gardening', 'Carroms', 'Acoustic Guitar']),
    fields_of_interest: JSON.stringify(['Sustainable Magic', 'Bio-Architecture', 'Green Campus Design', 'Water Filtration']),
    skills: JSON.stringify(['Geotechnical Surveying', 'Plant Physiology', 'Structural Modeling', 'Music Production']),
    wand: '10½ in · Willow · Phoenix Plume',
    patronus: 'Golden Badger',
    fav_subject: 'Magical Botany',
    bio: 'Music Club active instrumentalist, manages the botanical greenhouses and developed the natural wetland water recycling system for the Mess.',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    points_contributed: 260,
    academic_rank: '12th in Class of 190',
    is_current_user: 0
  },
  {
    id: 'p-5',
    name: 'Elowen Frost',
    house_id: 'ravenclaw',
    year: '5th Year',
    title: 'Star-Weaver & Diviner',
    branch: 'Physics & Applied Celestial Mechanics',
    languages: JSON.stringify(['English', 'German', 'Russian']),
    hobbies: JSON.stringify(['Chess', 'Classical Dance', 'Telescope Building', 'Calligraphy']),
    fields_of_interest: JSON.stringify(['Astrophysics', 'Chronomancy', 'Gravitational Optics', 'Artificial Intelligence']),
    skills: JSON.stringify(['Spectroscopic Analysis', 'Mathematical Proofs', 'Choreography', 'Optics Assembly']),
    wand: '11¼ in · Silver Birch · Kelpie Mane',
    patronus: 'Luminescent Swan',
    fav_subject: 'Chronomancy & Astronomy',
    bio: 'Dance Club coordinator and observatory researcher plotting gravitational distortion vectors and solar eclipse harmonics.',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
    points_contributed: 285,
    academic_rank: '8th in Class of 180',
    is_current_user: 0
  },
  {
    id: 'p-6',
    name: 'Arch-Magister Valerius',
    house_id: 'ravenclaw',
    year: 'Faculty Head',
    title: 'Dean of Academics & Runic Linguistics',
    branch: 'Academic Directorate',
    languages: JSON.stringify(['English', 'Ancient Greek', 'Latin', 'Sanskrit', 'Eldorian Glyphs']),
    hobbies: JSON.stringify(['Chess', 'Archival Restoration', 'Tea Tasting']),
    fields_of_interest: JSON.stringify(['Quantum Arithmancy', 'Curricular Reform', 'Ancient Wards']),
    skills: JSON.stringify(['Institutional Leadership', 'Ancient Ward Craft', 'Mentorship']),
    wand: '14 in · Ancient Ebony · Phoenix Feather',
    patronus: 'Crown Raven',
    fav_subject: 'All Arcane Disciplines',
    bio: 'Over three centuries of dedicated scholarship deciphering lost tongues and upholding academic excellence.',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80',
    points_contributed: 1200,
    academic_rank: 'Dean Emeritus',
    is_current_user: 0
  }
];

export const locations = [
  {
    id: 'loc-academic',
    name: 'Academic Building',
    zone: 'Academic',
    description: 'The monumental intellectual epicenter of the campus, housing lecture halls, high-tech engineering classrooms, faculty chambers, and specialized department wings.',
    highlights: JSON.stringify([
      'Central Lecture Theatres I–VIII',
      'The Grand Atrium & Faculty Chambers',
      'Five Advanced Science & Engineering Labs',
      'High-Speed Wi-Fi & Enchanted Study Lounges'
    ]),
    danger_level: 'Peaceful / Academic',
    coord_x: 50,
    coord_y: 42,
    is_secret: 0
  },
  {
    id: 'loc-hostel-girls',
    name: "Girls' Hostel",
    zone: 'Residential',
    description: 'Safe, serene residential sanctuary surrounded by blooming courtyard gardens, equipped with private study alcoves, recreation rooms, and round-the-clock ward security.',
    highlights: JSON.stringify([
      'Courtyard Flower Terraces',
      'Quiet Study Rooms with Ward Protection',
      'Indoor Table Tennis & Yoga Deck',
      '24/7 Proctor Desk & Medical Response Call'
    ]),
    danger_level: 'Restricted Access (Authorized Only)',
    coord_x: 25,
    coord_y: 28,
    is_secret: 0
  },
  {
    id: 'loc-hostel-boys',
    name: "Boys' Hostel",
    zone: 'Residential',
    description: 'Vibrant quadrangle complex with multi-tier student dorms, fitness gymnasium, common media room, and easy pedestrian access to the sports fields.',
    highlights: JSON.stringify([
      'Central Quadrangle & Fitness Center',
      'Common Media & Carroms Room',
      'High-Speed Ethernet Nodes',
      'Direct Pathway to Skyspire Sports Pitch'
    ]),
    danger_level: 'Restricted Access (Authorized Only)',
    coord_x: 75,
    coord_y: 28,
    is_secret: 0
  },
  {
    id: 'loc-mess',
    name: 'Mess',
    zone: 'Dining',
    description: 'The grand student dining commons serving four hearty daily meals, featuring seasonal regional dishes, hygienic modern pantries, and ample seating for all scholars.',
    highlights: JSON.stringify([
      'Spacious Multi-Floor Seating (800+ Capacity)',
      'Hygienic Modern Kitchen & Steam Ovens',
      'Nutritious Vegetarian & Non-Veg Counters',
      'Fresh Herb Salad & Fruit Bar'
    ]),
    danger_level: 'Peaceful / Social',
    coord_x: 50,
    coord_y: 72,
    is_secret: 0
  },
  {
    id: 'loc-cafeteria',
    name: 'Cafeteria',
    zone: 'Dining',
    description: 'The lively social heartbeat for quick snacks, artisanal coffees, fresh juices, and evening group discussions beneath warm starlit lanterns.',
    highlights: JSON.stringify([
      'Espresso & Artisan Herbal Tea Bar',
      'Fresh Breads, Rolls & Evening Snacks',
      'Outdoor Shaded Veranda with Lawn Seating',
      'Acoustic Open Mic & Notice Board'
    ]),
    danger_level: 'Peaceful / Refreshment',
    coord_x: 32,
    coord_y: 62,
    is_secret: 0
  }
];

export const pathways = [
  {
    id: 'p-acad-gh',
    from_location_id: 'loc-academic',
    to_location_id: 'loc-hostel-girls',
    name: 'North-West Garden Promenade',
    path_type: 'Paved Walkway',
    distance_meters: 320,
    is_unlocked: 1,
    description: 'Scenic tree-lined brick walkway with solar lanterns connecting the Academic Building to the Girls Hostel.'
  },
  {
    id: 'p-acad-bh',
    from_location_id: 'loc-academic',
    to_location_id: 'loc-hostel-boys',
    name: 'North-East Pine Avenue',
    path_type: 'Paved Walkway',
    distance_meters: 340,
    is_unlocked: 1,
    description: 'Direct illuminated pathway through pine groves connecting the Academic Building to the Boys Hostel.'
  },
  {
    id: 'p-acad-mess',
    from_location_id: 'loc-academic',
    to_location_id: 'loc-mess',
    name: 'Central Clock-Tower Spine',
    path_type: 'Broad Avenue',
    distance_meters: 280,
    is_unlocked: 1,
    description: 'The main artery of the campus, bustling with students between lectures and meal breaks.'
  },
  {
    id: 'p-acad-cafe',
    from_location_id: 'loc-academic',
    to_location_id: 'loc-cafeteria',
    name: 'West Courtyard Arcade',
    path_type: 'Covered Colonnade',
    distance_meters: 210,
    is_unlocked: 1,
    description: 'Sheltered stone colonnade providing rain-protected access between classes and the Cafeteria.'
  },
  {
    id: 'p-gh-mess',
    from_location_id: 'loc-hostel-girls',
    to_location_id: 'loc-mess',
    name: 'South-West Residential Link',
    path_type: 'Illuminated Path',
    distance_meters: 390,
    is_unlocked: 1,
    description: 'Gentle winding pathway from the Girls Hostel directly to the dining commons.'
  },
  {
    id: 'p-bh-mess',
    from_location_id: 'loc-hostel-boys',
    to_location_id: 'loc-mess',
    name: 'South-East Residential Link',
    path_type: 'Illuminated Path',
    distance_meters: 410,
    is_unlocked: 1,
    description: 'Wide pedestrian trail connecting the Boys Hostel to the dining commons.'
  },
  {
    id: 'p-cafe-mess',
    from_location_id: 'loc-cafeteria',
    to_location_id: 'loc-mess',
    name: 'Culinary Terrace Connector',
    path_type: 'Paved Plaza',
    distance_meters: 160,
    is_unlocked: 1,
    description: 'Quick stone plaza link between the Cafeteria veranda and the central Mess.'
  },
  {
    id: 'p-gh-cafe',
    from_location_id: 'loc-hostel-girls',
    to_location_id: 'loc-cafeteria',
    name: 'West Lily-Pond Trail',
    path_type: 'Stone Pathway',
    distance_meters: 290,
    is_unlocked: 1,
    description: 'Quiet pathway bordering the lotus fountain between the Girls Hostel and the Cafeteria.'
  }
];

export const laboratories = [
  {
    id: 'lab-mech',
    name: 'Mechanical Lab',
    code: 'MECH-LAB',
    description: 'Hands-on engineering workshop featuring material testing machines, CNC lathes, thermodynamic flow benches, and aerodynamic wind tunnel apparatus.',
    location_id: 'loc-academic',
    faculty_in_charge: 'Prof. Viktor Stone',
    available_equipment: JSON.stringify([
      'Universal Testing Machine (UTM 100kN)',
      'Subsonic Closed-Circuit Wind Tunnel',
      'Computerized 4-Axis CNC Milling Station',
      'Thermal Conductivity & Heat Exchanger Bench',
      'Dynamic Balancing & Vibration Rigs'
    ]),
    safety_guidelines: JSON.stringify([
      'Safety goggles and steel-toe footwear required at all times.',
      'Tie back long hair and avoid loose sleeves near rotating spindles.',
      'Emergency stop switches are situated at every machine station.',
      'Report any hydraulic or pneumatic leaks immediately to lab proctors.'
    ])
  },
  {
    id: 'lab-physics',
    name: 'Physics Lab',
    code: 'PHYS-LAB',
    description: 'Precision experimental space for laser interferometry, optical spectrometer calibration, quantum hall effect apparatus, and electromagnetism experiments.',
    location_id: 'loc-academic',
    faculty_in_charge: 'Dr. Katherine Vance',
    available_equipment: JSON.stringify([
      'Helium-Neon Optical Laser Bench & Michelson Interferometers',
      'High-Resolution Diffraction Spectrometers',
      'Photoelectric Effect Calibration Kits',
      'Hall Effect & Magnetic Field Measurement Probes',
      'Cryogenic Resistance Testing Vessel'
    ]),
    safety_guidelines: JSON.stringify([
      'Never look directly into laser beams; keep laser paths at waist level.',
      'Handle optical lenses only by edges with lint-free microfiber.',
      'Wear insulated thermal gloves when operating cryogenic liquid nitrogen dewar.',
      'Ensure high-voltage power supplies are switched off before re-cabling.'
    ])
  },
  {
    id: 'lab-c2s',
    name: 'C2S Lab',
    code: 'C2S-LAB',
    description: 'Chips to Startup (C2S) specialized laboratory dedicated to VLSI design, semiconductor circuit emulation, ASIC prototyping, and hardware-software co-design.',
    location_id: 'loc-academic',
    faculty_in_charge: 'Dr. Arvind Sharma',
    available_equipment: JSON.stringify([
      'Xilinx UltraScale+ FPGA Development Stations',
      'Synopsys & Cadence Electronic Design Automation (EDA) Suite',
      'Keysight 4-Channel 1GHz Mixed-Signal Oscilloscopes',
      'Logic Analyzers & JTAG Hardware In-Circuit Emulators',
      'Clean Air Static-Free Soldering & Rework Stations'
    ]),
    safety_guidelines: JSON.stringify([
      'Always ground yourself using ESD wrist-straps before handling silicon boards.',
      'Do not apply voltages exceeding device datasheets onto exposed GPIO headers.',
      'Operate solder fume extractors whenever performing rework or testing.',
      'Save EDA project bitstreams to university network backup directories regularly.'
    ])
  },
  {
    id: 'lab-electronics',
    name: 'Electronics Lab',
    code: 'ELEC-LAB',
    description: 'Comprehensive analog and digital circuitry laboratory with dual-trace oscilloscopes, function generators, microcontrollers, and communication trainers.',
    location_id: 'loc-academic',
    faculty_in_charge: 'Prof. Corina Wells',
    available_equipment: JSON.stringify([
      'Arbitrary Waveform Generators (0–50MHz)',
      'Digital Storage Oscilloscopes (DSO 100MHz)',
      'Microcontroller Dev Boards (ESP32, STM32, Arduino ARM)',
      'Spectrum Analyzers & RF Modulation Trainer Benches',
      'Regulated Dual-Channel DC Power Supplies'
    ]),
    safety_guidelines: JSON.stringify([
      'Double check polarity on electrolytic capacitors before powering breadboards.',
      'Power down supply before modifying breadboard jumper connections.',
      'Keep liquids, beverages, and wet objects strictly away from test benches.',
      'Inspect multimeter probe leads for frayed insulation before use.'
    ])
  },
  {
    id: 'lab-computer',
    name: 'Computer Lab',
    code: 'COMP-LAB',
    description: 'High-performance computing cluster with GPU-accelerated workstations, gigabit networking, virtualization sandboxes, and modern software development tools.',
    location_id: 'loc-academic',
    faculty_in_charge: 'Master Aris Thorne (Instructor Lead)',
    available_equipment: JSON.stringify([
      '60x Dell Precision Workstations (64GB RAM, RTX 4080 GPUs)',
      'Dedicated High-Performance Linux Compute Cluster (Slurm scheduler)',
      'Dual-Monitor Ergonomic Programming Stations',
      'High-Speed Symmetrical 10Gbps Fiber Uplink',
      'Virtual Reality & Spatial Simulation Pods'
    ]),
    safety_guidelines: JSON.stringify([
      'Lock workstation screens whenever leaving your bench unattended.',
      'Do not tamper with rear server rack cabling or network patch bays.',
      'Adhere strictly to the University Acceptable Use Policy and Ethics Code.',
      'Report any electrical sparking or UPS alarm beeps immediately.'
    ])
  }
];

export const labResources = [
  {
    id: 'res-mech-1',
    lab_id: 'lab-mech',
    title: 'Tensile Strength Testing on Structural Alloys Manual',
    category: 'Manuals',
    description: 'Comprehensive protocol for specimen preparation, UTM load calibration, and stress-strain curve interpretation.',
    file_size: '3.4 MB',
    download_url: '/docs/labs/mech-tensile-manual.pdf'
  },
  {
    id: 'res-mech-2',
    lab_id: 'lab-mech',
    title: 'Wind Tunnel Aerodynamic Drag Coefficient Calculation Guide',
    category: 'Experiment Guides',
    description: 'Step-by-step instructions for pitot tube velocity calibration, pressure tap measurement, and drag coefficient calculation.',
    file_size: '2.8 MB',
    download_url: '/docs/labs/mech-aerodynamics-guide.pdf'
  },
  {
    id: 'res-phys-1',
    lab_id: 'lab-physics',
    title: 'Michelson Interferometer Laser Wavelength Calibration',
    category: 'Manuals',
    description: 'Procedure to observe optical fringe shifts and derive monochromatic laser beam wavelengths with sub-micron precision.',
    file_size: '2.1 MB',
    download_url: '/docs/labs/phys-laser-manual.pdf'
  },
  {
    id: 'res-phys-2',
    lab_id: 'lab-physics',
    title: 'Quantum Photoelectric Constant Derivation Guide',
    category: 'Experiment Guides',
    description: 'Experimental apparatus guide for determining Planck’s constant via stopping potential across distinct optical filter wavelengths.',
    file_size: '1.9 MB',
    download_url: '/docs/labs/phys-planck-guide.pdf'
  },
  {
    id: 'res-c2s-1',
    lab_id: 'lab-c2s',
    title: 'C2S FPGA Bitstream Synthesis & Verilog Implementation Guide',
    category: 'Tutorials',
    description: 'Complete hands-on tutorial on RTL coding in Verilog, behavioral simulation, constraint generation, and FPGA flashing.',
    file_size: '5.2 MB',
    download_url: '/docs/labs/c2s-fpga-tutorial.pdf'
  },
  {
    id: 'res-c2s-2',
    lab_id: 'lab-c2s',
    title: 'Semiconductor CMOS Layout Rules & DRC/LVS Verification',
    category: 'Reference Materials',
    description: 'Standard 45nm/28nm design rule reference charts, metal layer interconnect limits, and DRC clean criteria.',
    file_size: '4.6 MB',
    download_url: '/docs/labs/c2s-cmos-reference.pdf'
  },
  {
    id: 'res-elec-1',
    lab_id: 'lab-electronics',
    title: 'Operational Amplifier Active Filter Design & Frequency Analysis',
    category: 'Experiment Guides',
    description: 'Lab experiment sheet for Butterworth and Chebyshev second-order active low-pass and bandpass filters.',
    file_size: '2.5 MB',
    download_url: '/docs/labs/elec-opamp-filters.pdf'
  },
  {
    id: 'res-comp-1',
    lab_id: 'lab-computer',
    title: 'Distributed Systems & GPU Parallel Compute Onboarding Manual',
    category: 'Manuals',
    description: 'Guide for accessing the campus compute cluster, submitting Slurm batch jobs, and running PyTorch/CUDA workloads.',
    file_size: '3.9 MB',
    download_url: '/docs/labs/comp-gpu-manual.pdf'
  },
  {
    id: 'res-comp-2',
    lab_id: 'lab-computer',
    title: 'Full-Stack REST Architecture & Database Security Tutorial',
    category: 'Tutorials',
    description: 'Best practice guide on constructing parameterised queries, secure token sessions, and responsive frontend integrations.',
    file_size: '2.7 MB',
    download_url: '/docs/labs/comp-rest-tutorial.pdf'
  }
];

export const sportsDisciplines = [
  // 6 Outdoor Sports
  {
    id: 'sport-volleyball',
    name: 'Volleyball',
    category: 'Outdoor',
    description: 'High-energy team sport of tactical setting, spikes, and perimeter defense played on sand or hard courts.',
    team_size: '6 Players per side',
    venue: 'West Outdoor Sand & Hard Courts',
    equipment: 'Regulation Volleyball, High Net, Antennae',
    rules_summary: 'Best of 3 or 5 sets to 25 points with a 2-point lead. 3 touches maximum per side.',
    icon_name: 'Activity'
  },
  {
    id: 'sport-kho-kho',
    name: 'Kho-Kho',
    category: 'Outdoor',
    description: 'Traditional fast-paced tag sport demanding agility, quick direction changes, chasing strategy, and stamina.',
    team_size: '9 Chasers + 3 Runners per turn',
    venue: 'Central Athletics Oval - Court A',
    equipment: 'Kho-Kho Wooden Posts, Marked Rectangular Court',
    rules_summary: 'Chasers kneel in alternating directions; active chaser passes tag with vocal "Kho!" to touch defenders within time.',
    icon_name: 'Zap'
  },
  {
    id: 'sport-kabaddi',
    name: 'Kabaddi',
    category: 'Outdoor',
    description: 'Fierce contact team sport testing breath control, tactical raiding, and united defensive tackling.',
    team_size: '7 Players per team on mat',
    venue: 'South Sports Pavilion Mat Arena',
    equipment: 'Cushioned Kabaddi Mat, Corner Boundary Lines',
    rules_summary: 'Single raider enters opposing half chanting continuous cant, tagging defenders and crossing midline safely.',
    icon_name: 'Shield'
  },
  {
    id: 'sport-football',
    name: 'Football',
    category: 'Outdoor',
    description: 'The world’s most celebrated field game of passing, counter-attacks, wing sprints, and striking into goal.',
    team_size: '11 Players per side',
    venue: 'Skyspire Main Emerald Football Field',
    equipment: 'Size 5 Football, Full Goal Posts, Corner Flags',
    rules_summary: 'Two 45-minute halves; goals scored by propelling ball across line without using hands or arms.',
    icon_name: 'Circle'
  },
  {
    id: 'sport-throwball',
    name: 'Throwball',
    category: 'Outdoor',
    description: 'Rapid reflex non-contact ball game featuring overhead catches and instantaneous returns across high nets.',
    team_size: '7 Players per side',
    venue: 'East Multi-Purpose Outdoor Court',
    equipment: 'Throwball, High Tension Net',
    rules_summary: 'Ball caught with two hands and released with one hand within 3 seconds without touching net.',
    icon_name: 'Flame'
  },
  {
    id: 'sport-badminton',
    name: 'Badminton',
    category: 'Outdoor',
    description: 'Precision racquet sport featuring lightning smashes, drop shots, and shuttlecock rallies.',
    team_size: 'Singles or Doubles (1–2 Players)',
    venue: 'Outdoor Wind-Shielded Pavilion Courts',
    equipment: 'Feather/Nylon Shuttlecocks, Carbon Fiber Racquets, Net',
    rules_summary: 'Best of 3 games to 21 points; points scored on every rally regardless of server.',
    icon_name: 'Feather'
  },

  // 3 Indoor Sports
  {
    id: 'sport-chess',
    name: 'Chess',
    category: 'Indoor',
    description: 'The supreme game of intellect, foresight, opening theory, positional tactics, and checkmate execution.',
    team_size: 'Individual (1 vs 1)',
    venue: 'Grand Indoor Mind Games Room (Library North)',
    equipment: 'Tournament Staunton Wooden Pieces, Digital Clocks, Felt Boards',
    rules_summary: 'Standard FIDE blitz (5+3) and classical (60+30) time controls with touch-move rule.',
    icon_name: 'Award'
  },
  {
    id: 'sport-carroms',
    name: 'Carroms',
    category: 'Indoor',
    description: 'Classic tabletop strike-and-pocket game requiring rebound geometry, fine finger flicking, and pocketing the red queen.',
    team_size: 'Singles or Doubles (1–2 Players)',
    venue: 'Student Common Lounge & Recreation Room',
    equipment: 'Standard Plywood Carrom Board, Striker, Boric Powder, Carrom Men',
    rules_summary: 'White 10 pts, Black 5 pts, Queen 3 pts (must be covered by immediate next pocketing). First to 25 pts wins.',
    icon_name: 'Target'
  },
  {
    id: 'sport-table-tennis',
    name: 'Table Tennis',
    category: 'Indoor',
    description: 'High-velocity spin and reflex paddle sport with top-spin drives, loops, and rapid-fire rallies over the table.',
    team_size: 'Singles or Doubles (1–2 Players)',
    venue: 'Indoor Sports Arena - Hall B',
    equipment: 'ITTF Approved Tables, 3-Star Celluloid/Poly Balls, Rubber Paddles',
    rules_summary: 'Games to 11 points (must win by 2). Service alternates every 2 points.',
    icon_name: 'RotateCcw'
  }
];

export const sportsTeams = [
  {
    id: 'team-gryffindor-volleyball',
    sport_id: 'sport-volleyball',
    name: 'Gryffindor Strikers',
    house_id: 'gryffindor',
    captain: 'Cedric Blackthorn',
    wins: 4,
    losses: 1,
    goal_differential: '+45',
    points: 12,
    crest_color: '#7B1E28'
  },
  {
    id: 'team-ravenclaw-chess',
    sport_id: 'sport-chess',
    name: 'Ravenclaw Grandmasters',
    house_id: 'ravenclaw',
    captain: 'Lyra Valerius',
    wins: 5,
    losses: 0,
    goal_differential: '+18',
    points: 15,
    crest_color: '#15254A'
  },
  {
    id: 'team-slytherin-football',
    sport_id: 'sport-football',
    name: 'Slytherin Vipers FC',
    house_id: 'slytherin',
    captain: 'Damian Blackwood',
    wins: 3,
    losses: 2,
    goal_differential: '+8',
    points: 9,
    crest_color: '#1F4734'
  },
  {
    id: 'team-hufflepuff-khokho',
    sport_id: 'sport-kho-kho',
    name: 'Hufflepuff Badgers',
    house_id: 'hufflepuff',
    captain: 'Thaddeus Thorne',
    wins: 3,
    losses: 1,
    goal_differential: '+12',
    points: 10,
    crest_color: '#8C6218'
  }
];

export const sportsMatches = [
  {
    id: 'match-1',
    sport_id: 'sport-football',
    home_team_id: 'team-gryffindor-volleyball',
    away_team_id: 'team-slytherin-football',
    match_date: '2026-11-04T15:30:00Z',
    venue: 'Skyspire Main Emerald Football Field',
    status: 'Scheduled',
    home_score: null,
    away_score: null,
    snitch_caught_by: null
  },
  {
    id: 'match-2',
    sport_id: 'sport-chess',
    home_team_id: 'team-ravenclaw-chess',
    away_team_id: 'team-gryffindor-volleyball',
    match_date: '2026-10-22T17:00:00Z',
    venue: 'Grand Indoor Mind Games Room',
    status: 'Completed',
    home_score: 4,
    away_score: 1,
    snitch_caught_by: null
  },
  {
    id: 'match-3',
    sport_id: 'sport-kho-kho',
    home_team_id: 'team-hufflepuff-khokho',
    away_team_id: 'team-slytherin-football',
    match_date: '2026-10-20T16:00:00Z',
    venue: 'Central Athletics Oval',
    status: 'Completed',
    home_score: 18,
    away_score: 14,
    snitch_caught_by: null
  }
];

export const studentCouncil = [
  {
    id: 'c-pres',
    role: 'Student Council President',
    student_name: 'Rowan Vance',
    branch: 'Computer Science & Arcana (Year IV)',
    office_hours: 'Mon & Wed · 16:00 – 18:00',
    contact_email: 'council.president@spellbound.edu',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    announcements: JSON.stringify([
      'Campus Wi-Fi upgrade in both Hostels scheduled for completion by Friday.',
      'Open Student Forum on Mess Menu Improvements set for November 8th in Academic Auditorium.'
    ])
  },
  {
    id: 'c-vpres',
    role: 'Vice President & Welfare Secretary',
    student_name: 'Lyra Valerius',
    branch: 'Computer Science & Arcana (Year VI)',
    office_hours: 'Tue & Thu · 15:30 – 17:30',
    contact_email: 'council.welfare@spellbound.edu',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
    announcements: JSON.stringify([
      'Mental Health & Peer Support counseling circles now active every Wednesday in the Cafeteria private lounge.',
      'Emergency medicine dispatch protocol updated with Hospital Wing.'
    ])
  },
  {
    id: 'c-sports',
    role: 'Sports & Athletics Secretary',
    student_name: 'Cedric Blackthorn',
    branch: 'Mechanical Alchemical Engineering (Year V)',
    office_hours: 'Fridays · 16:00 – 18:30',
    contact_email: 'council.sports@spellbound.edu',
    avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=250&q=80',
    announcements: JSON.stringify([
      'Inter-House Autumn Sports Fest begins registration for Volleyball, Kho-Kho, and Chess this week!',
      'New equipment sets for Table Tennis and Badminton have arrived in the sports store.'
    ])
  },
  {
    id: 'c-cultural',
    role: 'Cultural & Clubs Secretary',
    student_name: 'Seraphina Vance',
    branch: 'Civil & Sustainable Infrastructure (Year IV)',
    office_hours: 'Thursdays · 16:30 – 18:30',
    contact_email: 'council.cultural@spellbound.edu',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
    announcements: JSON.stringify([
      'Auditions for the Solstice Gala Concert are open across all four featured clubs.',
      'Fine Arts gallery space allocated in the Academic Building central concourse.'
    ])
  }
];

export const complaints = [
  {
    id: 'REF-MYST-1042',
    student_id: 'student-aris-thorne',
    category: 'Hostel',
    subject: 'Intermittent Hot Water Pressure in West Wing',
    description: 'The solar heating pressure valve in West Wing Floor 3 has been dropping below required temperature between 06:30 and 07:30 AM.',
    priority: 'Routine',
    status: 'Under Review',
    is_confidential: 1
  },
  {
    id: 'REF-MYST-1088',
    student_id: 'student-aris-thorne',
    category: 'Academics',
    subject: 'Need Additional High-Spec Workstations in Computer Lab II',
    description: 'During peak CUDA and AI compiler laboratory hours, all 60 machines are occupied, leaving evening researchers in queues.',
    priority: 'Urgent',
    status: 'Investigating',
    is_confidential: 1
  }
];

export const confessions = [
  {
    id: 'conf-1',
    message: 'To the scholar in the Grand Library reading Runic Cryptography every Tuesday night: your quiet focus inspires everyone in Alcove 4.',
    category: 'Kindness & Admiration',
    status: 'Approved',
    likes_count: 42
  },
  {
    id: 'conf-2',
    message: 'I accidentally brewed Draught of Sleep instead of Draught of Focus right before the mid-term exam. Ended up having the most peaceful 12-hour nap of my life.',
    category: 'Humor & Campus Life',
    status: 'Approved',
    likes_count: 67
  },
  {
    id: 'conf-3',
    message: 'Shoutout to the Mess staff who make sure warm lemon-ginger tea is available late at night during exam weeks. You are the real guardians of Spellbound!',
    category: 'Appreciation',
    status: 'Approved',
    likes_count: 89
  }
];

export const officialNotices = [
  {
    id: 'notif-1',
    title: 'Mid-Semester Examination Schedule & Room Allocations',
    category: 'Academic Deadline',
    message: 'The official schedule for all Engineering and Arcana curricula has been posted. Hall tickets must be collected by Friday 17:00 from the Academic Registry.',
    publication_date: '2026-10-24T09:00:00Z',
    expiry_date: '2026-11-15T18:00:00Z',
    priority: 'Urgent',
    issuing_authority: 'Office of the Academic Dean',
    is_verified: 1
  },
  {
    id: 'notif-2',
    title: 'Autumn Weather Warning: Gale-Force Crosswinds on Skyways',
    category: 'Official Warning',
    message: 'Northern Chasm wind speeds are projected to hit 42 knots. The Skybridge to Skyspire Arena will require stabilizing ward activation. Walkways remain open.',
    publication_date: '2026-10-23T14:00:00Z',
    expiry_date: '2026-10-27T23:59:00Z',
    priority: 'High',
    issuing_authority: 'Campus Security & Ward Proctors',
    is_verified: 1
  },
  {
    id: 'notif-3',
    title: 'Mess Menu Revisions & Dietary Survey Announcement',
    category: 'Administrative Notice',
    message: 'The Student Council in coordination with the Dining Committee has introduced organic millets and gluten-free counters in the Mess starting Monday.',
    publication_date: '2026-10-22T11:00:00Z',
    expiry_date: '2026-11-05T20:00:00Z',
    priority: 'Normal',
    issuing_authority: 'Student Welfare & Mess Directorate',
    is_verified: 1
  },
  {
    id: 'notif-4',
    title: 'C2S Fab Lab Semiconductor Equipment Maintenance',
    category: 'Campus Directive',
    message: 'Cleanroom Station 3 in the C2S Lab will undergo scheduled ion-beam recalibration on Saturday from 08:00 to 14:00. Prior reservations will be rescheduled.',
    publication_date: '2026-10-21T16:00:00Z',
    expiry_date: '2026-10-26T14:00:00Z',
    priority: 'Normal',
    issuing_authority: 'C2S Laboratory Directorate',
    is_verified: 1
  }
];

export const courses = [
  {
    code: 'TRANS-501',
    title: 'Advanced Inanimate Transfiguration',
    instructor: 'Prof. Morgana Vance',
    term: 'Autumn Equinox',
    credits: 4,
    description: 'Molecular morphing of inanimate metals into organic crystalline matrices.',
    location_id: 'loc-academic'
  },
  {
    code: 'RUNE-404',
    title: 'Decryption of Eldorian Tablets',
    instructor: 'Arch-Magister Valerius',
    term: 'Autumn Equinox',
    credits: 3,
    description: 'Syntactic analysis of third-age astronomical glyphs carved in obsidian.',
    location_id: 'loc-academic'
  },
  {
    code: 'ALCH-520',
    title: 'Distillation of Twilight Essences',
    instructor: 'Mistress Belladonna',
    term: 'Autumn Equinox',
    credits: 4,
    description: 'Nocturnal reagent processing under waxing lunar illumination.',
    location_id: 'loc-academic'
  },
  {
    code: 'C2S-301',
    title: 'VLSI Digital Architecture & Silicon Fab',
    instructor: 'Dr. Arvind Sharma',
    term: 'Autumn Equinox',
    credits: 4,
    description: 'Verilog synthesis, RTL timing analysis, and ASIC prototyping in the C2S Laboratory.',
    location_id: 'loc-academic'
  },
  {
    code: 'AERO-201',
    title: 'High-Velocity Broom Maneuvers',
    instructor: 'Captain Torin Drake',
    term: 'Autumn Equinox',
    credits: 2,
    description: 'Tactical banking, slalom interception, and vortex handling in gusty skies.',
    location_id: 'loc-academic'
  }
];

export const learningResources = [
  {
    id: 'res-1',
    course_code: 'TRANS-501',
    title: 'Codex of Living Metamorphosis',
    resource_type: 'Grimoire',
    author: 'Arch-Mage Oakhaven',
    rarity: 'Rare',
    content_snippet: 'Chapter IV: Harmonic frequencies necessary to induce cellular life into unrefined copper.'
  },
  {
    id: 'res-2',
    course_code: 'RUNE-404',
    title: 'Eldorian Glyphs & Astronomical Stelae',
    resource_type: 'Scroll',
    author: 'Arch-Magister Valerius',
    rarity: 'Standard',
    content_snippet: 'A comprehensive lexicon translating the 72 constellations into functional phonemes.'
  },
  {
    id: 'res-3',
    course_code: 'C2S-301',
    title: 'FPGA Chip Synthesis & Clock Domain Crossing',
    resource_type: 'Technical Manual',
    author: 'Dr. Arvind Sharma',
    rarity: 'Standard',
    content_snippet: 'Detailed timing constraint guidelines for multi-asynchronous clock FIFO buffers.'
  }
];

export const events = [
  {
    id: 'evt-1',
    club_id: 'club-lit-debate',
    title: 'Celestial Solstice Gala & Debating Forum',
    date_time: '2026-12-21T19:00:00Z',
    location_id: 'loc-academic',
    location_name: 'Academic Central Auditorium',
    category: 'Gala & Debate',
    description: 'Annual winter gala featuring the final Inter-House Parliamentary Debate followed by banquet under levitating ice fixtures.',
    rsvp_count: 248,
    is_active: 1
  },
  {
    id: 'evt-2',
    club_id: 'club-music',
    title: 'Acoustic Reverberation Solstice Concert',
    date_time: '2026-11-15T18:30:00Z',
    location_id: 'loc-cafeteria',
    location_name: 'Cafeteria Open-Air Veranda',
    category: 'Live Music',
    description: 'Live performance by the Music Club string orchestra and contemporary academy bands, featuring enchanted lute harmonies.',
    rsvp_count: 185,
    is_active: 1
  },
  {
    id: 'evt-3',
    club_id: 'club-dance',
    title: 'Kinetic Movement & Choreography Workshop',
    date_time: '2026-11-20T17:00:00Z',
    location_id: 'loc-academic',
    location_name: 'Academic Studio Hall 3',
    category: 'Workshop',
    description: 'Intensive flow-arts and classical rhythm session hosted by the Dance Club for dancers of all skill tiers.',
    rsvp_count: 92,
    is_active: 1
  },
  {
    id: 'evt-4',
    club_id: 'club-fine-arts',
    title: 'Moving Portrait & Canvas Exhibition',
    date_time: '2026-11-28T14:00:00Z',
    location_id: 'loc-academic',
    location_name: 'Grand Concourse Gallery',
    category: 'Art Exhibition',
    description: 'Exhibition of student paintings, illuminated pigments, pottery sculptures, and botanical illustrations.',
    rsvp_count: 140,
    is_active: 1
  }
];

export const eventRegistrations = [
  {
    event_id: 'evt-1',
    student_id: 'student-aris-thorne'
  },
  {
    event_id: 'evt-2',
    student_id: 'student-aris-thorne'
  }
];

export const communityPosts = [
  {
    id: 'note-1',
    author_id: 'p-1',
    author_name: 'Lyra Valerius',
    house_id: 'ravenclaw',
    category: 'Study Circle',
    title: 'Ancient Runes & C2S Verilog Review Study Circle',
    body: 'Meeting tonight in the Academic Building East Alcove at 19:30. Bring your styluses and laptop stations. Herbal tea provided.',
    signature_count: 12,
    likes_count: 18,
    dislikes_count: 1
  },
  {
    id: 'note-2',
    author_id: 'p-2',
    author_name: 'Cedric Blackthorn',
    house_id: 'gryffindor',
    category: 'Sports Gathering',
    title: 'Inter-House Volleyball & Kho-Kho Practice Trials',
    body: 'Open tryouts for the Autumn Sports Fest on Saturday at 16:00 on the West Courts. All skill levels warmly welcomed!',
    signature_count: 24,
    likes_count: 32,
    dislikes_count: 2
  },
  {
    id: 'note-3',
    author_id: 'p-4',
    author_name: 'Thaddeus Thorne',
    house_id: 'hufflepuff',
    category: 'Collaboration',
    title: 'Sustainable Water Recycling System Project Squad',
    body: 'Looking for two electronics/mechanical adepts to automate the valve telemetry on our campus garden filtration unit.',
    signature_count: 9,
    likes_count: 14,
    dislikes_count: 0
  },
  {
    id: 'note-4',
    author_id: 'p-3',
    author_name: 'Isolde Ravenshadow',
    house_id: 'slytherin',
    category: 'Alchemical Trade',
    title: 'Exchanging Purified Copper Reagents for FPGA Dev Kits',
    body: 'Have 5 drams of spectroscopic reagent. Looking to test dual-clock FIFO modules in the C2S Lab with fellow designers.',
    signature_count: 8,
    likes_count: 11,
    dislikes_count: 1
  }
];

export const mysteryPuzzles = [
  {
    id: 'rid-1',
    title: 'The Enigma of the Three Celestial Spheres',
    question: 'When Saturn stands in the eye of the Raven and the Solstice candle burns black, which dial unlocks the Chronos Vault?',
    options: JSON.stringify(['The Silver Crescent Dial', 'The Sun-Gold Astrolabe', 'The Obsidian Hourglass', 'The Wand of Dawn']),
    correct_index: 2,
    explanation: 'Correct! The Obsidian Hourglass reverses entropy when aligned with the Saturnian eclipse.',
    difficulty: 'Adept',
    chamber: 'Chronomancy Vault'
  },
  {
    id: 'rid-2',
    title: 'The Resonance of the Acoustic Sanctum',
    question: 'Which Eldorian harmonic resonates through basalt stone without breaking the acoustic wards of the Academic Building?',
    options: JSON.stringify(['Vael-Thurn', 'Sil-Astra', 'Noct-Ombra', 'Ignis-Veritas']),
    correct_index: 1,
    explanation: 'Correct! Sil-Astra cancels vibration waveforms through resonance dampening.',
    difficulty: 'Arch-Mage',
    chamber: 'Acoustic Sanctum'
  }
];

export const dailySchedules = [
  {
    id: 'sched-1',
    student_id: 'student-aris-thorne',
    time_slot: '08:30 – 10:00',
    subject: 'Advanced Transfiguration & Materials',
    instructor: 'Prof. Morgana Vance',
    location: 'Academic Building (Room 302)',
    status: 'Completed',
    notes: 'Molecular transformation of crystalline copper alloys.'
  },
  {
    id: 'sched-2',
    student_id: 'student-aris-thorne',
    time_slot: '10:30 – 12:00',
    subject: 'C2S VLSI Hardware Design & Verilog',
    instructor: 'Dr. Arvind Sharma',
    location: 'C2S Laboratory (Floor II)',
    status: 'In Progress',
    notes: 'Bring your FPGA board and timing constraint files.'
  },
  {
    id: 'sched-3',
    student_id: 'student-aris-thorne',
    time_slot: '13:30 – 15:00',
    subject: 'Volleyball Squad Tactical Drills',
    instructor: 'Captain Cedric Blackthorn',
    location: 'West Outdoor Volleyball Courts',
    status: 'Upcoming',
    notes: 'Serving strategy and perimeter defensive positioning.'
  },
  {
    id: 'sched-4',
    student_id: 'student-aris-thorne',
    time_slot: '15:45 – 17:15',
    subject: 'Physics Lab: Laser Interferometry',
    instructor: 'Dr. Katherine Vance',
    location: 'Physics Laboratory (Floor I)',
    status: 'Upcoming',
    notes: 'Michelson fringe shift verification across multi-wavelength lasers.'
  }
];

export const potionIngredients = [
  { id: 'ing-1', name: 'Dragon Breath Ember', potency: 8, stability: -3, color: '#E05A47', description: 'Crystallized core of thermal drake flame breath.' },
  { id: 'ing-2', name: 'Crushed Moonstone', potency: 5, stability: 6, color: '#E3EEF9', description: 'Phosphorescent mineral ground during a full waxing moon.' },
  { id: 'ing-3', name: 'Silver Dewleaf', potency: 4, stability: 5, color: '#9BE0B5', description: 'Leaves harvested from the silver weeping willows of the garden.' },
  { id: 'ing-4', name: 'Mandrake Root Shavings', potency: 6, stability: -2, color: '#C49A6C', description: 'Dried acoustic mandrake root fibers.' },
  { id: 'ing-5', name: 'Phoenix Feather Ash', potency: 9, stability: -4, color: '#F7BE4D', description: 'Pure ashes left behind after a solar rebirth ignition.' },
  { id: 'ing-6', name: 'Shadowcap Spores', potency: 7, stability: -1, color: '#7A5BA3', description: 'Volatile dark-growth fungal dust that bends refraction.' }
];

export const housePointsLogs = [
  {
    house_id: 'ravenclaw',
    amount: 50,
    reason: 'First Place in Inter-House Runic Decoding Challenge',
    awarded_by: 'Arch-Magister Valerius'
  },
  {
    house_id: 'gryffindor',
    amount: 45,
    reason: 'Championship Victory in Inter-House Volleyball Tournament',
    awarded_by: 'Captain Cedric Blackthorn'
  },
  {
    house_id: 'slytherin',
    amount: 40,
    reason: 'Exemplary VLSI FPGA Circuit Prototyping in C2S Lab',
    awarded_by: 'Dr. Arvind Sharma'
  },
  {
    house_id: 'hufflepuff',
    amount: 35,
    reason: 'Successful Implementation of Mess Water Recycling Unit',
    awarded_by: 'Elder Rosemary Vance'
  }
];
