// Centralized Lore & Demo Data for Spellbound Academy
// Enhanced with Real Campus Functional Architecture

export const currentUser = {
  id: "student-aris-thorne",
  name: "Aris Thorne",
  title: "Scholar of Celestial Arithmancy",
  house: "Ravenclaw",
  houseColor: "#15254A",
  houseAccent: "#D6B46A",
  year: "Fifth Year · Senior Adept",
  branch: "Computer Science & Arcana",
  languages: ["English", "Hindi", "French", "Runic Eldorian"],
  hobbies: ["Astrophotography", "Chess", "Broom Flight", "Spell Scripting"],
  fieldsOfInterest: ["Artificial Intelligence", "Chronomancy", "Quantum Arithmancy", "Cyber Security"],
  skills: ["Algorithm Design", "Python & ArcanaScript", "Temporal Modeling", "React & Web Magic"],
  wand: "11¾ in · Black Walnut · Phoenix Feather Core",
  patronus: "Obsidian Owl",
  pointsContributed: 340,
  academicRank: "4th in Class of 180",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
  term: "Autumn Equinox · Term III",
  astralPhase: "Waxing Crescent · Moon in Cassiopeia"
};

export const sevenDepartments = [
  {
    id: "explore",
    title: "Explore Hogwarts",
    slug: "/explore",
    description: "Navigate the campus map across the Academic Building, Hostels, Mess, and Cafeteria with Dijkstra pathfinding.",
    iconName: "Compass",
    accentColor: "#D6B46A",
    bannerSnippet: "Parchment maps, golden pathways & compass guidance",
    tag: "Campus Cartography",
    image: "/assets/departments/dept-explore.jpg"
  },
  {
    id: "people",
    title: "People of the Wizarding World",
    slug: "/people",
    description: "Discover fellow adepts, filter by branch, language, and interests, and connect with like-minded peers.",
    iconName: "Users",
    accentColor: "#79C2A4",
    bannerSnippet: "Gilded portraits, peer discovery & owl dispatches",
    tag: "Student Directory",
    image: "/assets/departments/dept-people.jpg"
  },
  {
    id: "sports",
    title: "Sports Department",
    slug: "/sports",
    description: "Outdoor sports (Volleyball, Kho-Kho, Football...) and Indoor sports (Chess, Carroms, Table Tennis).",
    iconName: "Trophy",
    accentColor: "#E288A1",
    bannerSnippet: "Outdoor & indoor leagues, fixtures & trial registrations",
    tag: "Athletics & Games",
    image: "/assets/departments/dept-sports.jpg"
  },
  {
    id: "academics",
    title: "Academics & Magical Labs",
    slug: "/academics",
    description: "Explore five specialized laboratories: Mechanical, Physics, C2S, Electronics, and Computer Labs.",
    iconName: "BookOpen",
    accentColor: "#4E8A71",
    bannerSnippet: "Lab equipment, practical experiment manuals & potion lab",
    tag: "Curriculum & Labs",
    image: "/assets/departments/dept-academics.jpg"
  },
  {
    id: "common-room",
    title: "Wizarding Social Network",
    slug: "/common-room",
    description: "Gather by the hearth fire lounge, post parchment notices, find study circles, and converse with peers.",
    iconName: "Flame",
    accentColor: "#D48C45",
    bannerSnippet: "Hearthside fellowship, quill notices & study circles",
    tag: "Community Hearth",
    image: "/assets/departments/dept-social.jpg"
  },
  {
    id: "houses-events",
    title: "Houses & Events",
    slug: "/houses-events",
    description: "The Four Great Houses (Gryffindor, Slytherin, Ravenclaw, Hufflepuff) and Four Featured Clubs.",
    iconName: "Shield",
    accentColor: "#AA8438",
    bannerSnippet: "Four Houses, four student clubs & House Cup hourglasses",
    tag: "House Cup & Clubs",
    image: "/assets/departments/dept-houses.jpg"
  },
  {
    id: "mysteries",
    title: "Department of Mysteries",
    slug: "/mysteries",
    description: "Central communications hub: Student Council updates, confidential complaints, confessions, and official notices.",
    iconName: "Sparkles",
    accentColor: "#9B4D64",
    bannerSnippet: "Student Council, complaints, confessions & notices",
    tag: "Central Hub",
    image: "/assets/departments/dept-mysteries.jpg"
  }
];

export const housesData = [
  {
    id: "gryffindor",
    name: "Gryffindor",
    motto: "Valor Across the Winds of Peril",
    values: ["Bravery", "Aero-Flight", "Honor", "Dueling"],
    points: 1485,
    crestColor: "#7B1E28",
    accentColor: "#E9D9B7",
    animal: "Golden Lion",
    gem: "Spinel Ruby",
    headOfHouse: "Mistress Minerva Sterling"
  },
  {
    id: "slytherin",
    name: "Slytherin",
    motto: "Subtlety Masters the Deepest Shadow",
    values: ["Ambition", "Potions", "Shadow Arts", "Resourcefulness"],
    points: 1460,
    crestColor: "#1F4734",
    accentColor: "#C0C0C0",
    animal: "Emerald Serpent",
    gem: "Deep Emerald",
    headOfHouse: "Professor Corvin Sallow"
  },
  {
    id: "ravenclaw",
    name: "Ravenclaw",
    motto: "Wisdom through Starlit Inquiry",
    values: ["Intellect", "Astronomy", "Rune Craft", "Perception"],
    points: 1520,
    crestColor: "#15254A",
    accentColor: "#D6B46A",
    animal: "Starlit Eagle",
    gem: "Sapphire Dust",
    headOfHouse: "Arch-Magister Valerius"
  },
  {
    id: "hufflepuff",
    name: "Hufflepuff",
    motto: "Steadfast as the Root, Warm as the Flame",
    values: ["Loyalty", "Herbology", "Elemental Alchemy", "Patience"],
    points: 1410,
    crestColor: "#8C6218",
    accentColor: "#F6F0E4",
    animal: "Golden Badger",
    gem: "Citrine Amber",
    headOfHouse: "Elder Rosemary Vance"
  }
];

export const studentClubs = [
  {
    id: "club-lit-debate",
    name: "Literary and Debating Club",
    description: "The premier society for parliamentary rhetoric, philosophy, runic translation, and competitive academic discourse.",
    leadCoordinator: "Lyra Valerius (6th Year)",
    meetingSchedule: "Tuesdays & Thursdays · 17:30 · East Scriptoria Hall",
    activities: [
      "Weekly Parliamentary Debates",
      "The Great Lexicon Spoken Word Slam",
      "Philosophical Dialectics on Spell Ethics",
      "Manuscript Editing & Literary Journal Review"
    ],
    iconName: "BookOpen"
  },
  {
    id: "club-music",
    name: "Music Club",
    description: "Enchanted harmonies, orchestral instruments, acoustic reverberation charms, and solstice choral performances.",
    leadCoordinator: "Julian Sterling (5th Year)",
    meetingSchedule: "Mondays & Wednesdays · 18:00 · The Resonance Chamber",
    activities: [
      "Enchanted String Quartets & Lute Ensemble",
      "Vocal Harmonization & Astral Hymns",
      "Contemporary Academy Band Showcase",
      "Acoustic Wave Modulation Workshops"
    ],
    iconName: "Music"
  },
  {
    id: "club-dance",
    name: "Dance Club",
    description: "Kinetic expression, celestial waltzes, ceremonial dances, and acrobatic tempo choreography.",
    leadCoordinator: "Seraphina Vance (4th Year)",
    meetingSchedule: "Wednesdays & Fridays · 18:30 · The Golden Ballroom Gallery",
    activities: [
      "Solstice Gala Ceremonial Waltz Drills",
      "Contemporary Rhythmic Kinetic Movement",
      "Aerial Repulsion Flow Dance",
      "Inter-House Choreography Showcase"
    ],
    iconName: "Sparkles"
  },
  {
    id: "club-fine-arts",
    name: "Fine Arts Club",
    description: "Gilded painting, moving canvas portraits, sculpture, enchanted pottery, and botanical illustration.",
    leadCoordinator: "Althea Moon (5th Year)",
    meetingSchedule: "Saturdays · 14:00 · Sunlit Glasshouse Studio",
    activities: [
      "Moving Portrait Pigment Formulation",
      "Clay & Repulsion Stone Sculpting",
      "Nocturnal Constellation Canvas Painting",
      "Botanical Field Sketching Expeditions"
    ],
    iconName: "Palette"
  }
];

export const campusLocations = [
  {
    id: "loc-academic",
    name: "Academic Building",
    zone: "Academic",
    description: "The monumental intellectual epicenter of the campus, housing lecture halls, high-tech engineering classrooms, faculty chambers, and five specialized laboratories.",
    highlights: [
      "Central Lecture Theatres I–VIII",
      "The Grand Atrium & Faculty Chambers",
      "Five Advanced Science & Engineering Labs",
      "High-Speed Wi-Fi & Enchanted Study Lounges"
    ],
    dangerLevel: "Peaceful / Academic",
    coords: { x: 50, y: 42 }
  },
  {
    id: "loc-hostel-girls",
    name: "Girls' Hostel",
    zone: "Residential",
    description: "Safe, serene residential sanctuary surrounded by blooming courtyard gardens, equipped with private study alcoves, recreation rooms, and round-the-clock ward security.",
    highlights: [
      "Courtyard Flower Terraces",
      "Quiet Study Rooms with Ward Protection",
      "Indoor Table Tennis & Yoga Deck",
      "24/7 Proctor Desk & Medical Response Call"
    ],
    dangerLevel: "Restricted Access (Authorized Only)",
    coords: { x: 25, y: 28 }
  },
  {
    id: "loc-hostel-boys",
    name: "Boys' Hostel",
    zone: "Residential",
    description: "Vibrant quadrangle complex with multi-tier student dorms, fitness gymnasium, common media room, and easy pedestrian access to the sports fields.",
    highlights: [
      "Central Quadrangle & Fitness Center",
      "Common Media & Carroms Room",
      "High-Speed Ethernet Nodes",
      "Direct Pathway to Skyspire Sports Pitch"
    ],
    dangerLevel: "Restricted Access (Authorized Only)",
    coords: { x: 75, y: 28 }
  },
  {
    id: "loc-mess",
    name: "Mess",
    zone: "Dining",
    description: "The grand student dining commons serving four hearty daily meals, featuring seasonal regional dishes, hygienic modern pantries, and ample seating for all scholars.",
    highlights: [
      "Spacious Multi-Floor Seating (800+ Capacity)",
      "Hygienic Modern Kitchen & Steam Ovens",
      "Nutritious Vegetarian & Non-Veg Counters",
      "Fresh Herb Salad & Fruit Bar"
    ],
    dangerLevel: "Peaceful / Social",
    coords: { x: 50, y: 72 }
  },
  {
    id: "loc-cafeteria",
    name: "Cafeteria",
    zone: "Dining",
    description: "The lively social heartbeat for quick snacks, artisanal coffees, fresh juices, and evening group discussions beneath warm starlit lanterns.",
    highlights: [
      "Espresso & Artisan Herbal Tea Bar",
      "Fresh Breads, Rolls & Evening Snacks",
      "Outdoor Shaded Veranda with Lawn Seating",
      "Acoustic Open Mic & Notice Board"
    ],
    dangerLevel: "Peaceful / Refreshment",
    coords: { x: 32, y: 62 }
  }
];

export const campusPathways = [
  { id: "p-acad-gh", fromId: "loc-academic", toId: "loc-hostel-girls", name: "North-West Garden Promenade", distanceMeters: 320, pathType: "Paved Walkway" },
  { id: "p-acad-bh", fromId: "loc-academic", toId: "loc-hostel-boys", name: "North-East Pine Avenue", distanceMeters: 340, pathType: "Paved Walkway" },
  { id: "p-acad-mess", fromId: "loc-academic", toId: "loc-mess", name: "Central Clock-Tower Spine", distanceMeters: 280, pathType: "Broad Avenue" },
  { id: "p-acad-cafe", fromId: "loc-academic", toId: "loc-cafeteria", name: "West Courtyard Arcade", distanceMeters: 210, pathType: "Covered Colonnade" },
  { id: "p-gh-mess", fromId: "loc-hostel-girls", toId: "loc-mess", name: "South-West Residential Link", distanceMeters: 390, pathType: "Illuminated Path" },
  { id: "p-bh-mess", fromId: "loc-hostel-boys", toId: "loc-mess", name: "South-East Residential Link", distanceMeters: 410, pathType: "Illuminated Path" },
  { id: "p-cafe-mess", fromId: "loc-cafeteria", toId: "loc-mess", name: "Culinary Terrace Connector", distanceMeters: 160, pathType: "Paved Plaza" },
  { id: "p-gh-cafe", fromId: "loc-hostel-girls", toId: "loc-cafeteria", name: "West Lily-Pond Trail", distanceMeters: 290, pathType: "Stone Pathway" }
];

export const laboratoriesData = [
  {
    id: "lab-mech",
    name: "Mechanical Lab",
    code: "MECH-LAB",
    description: "Hands-on engineering workshop featuring material testing machines, CNC lathes, thermodynamic flow benches, and aerodynamic wind tunnel apparatus.",
    facultyInCharge: "Prof. Viktor Stone",
    availableEquipment: [
      "Universal Testing Machine (UTM 100kN)",
      "Subsonic Closed-Circuit Wind Tunnel",
      "Computerized 4-Axis CNC Milling Station",
      "Thermal Conductivity & Heat Exchanger Bench",
      "Dynamic Balancing & Vibration Rigs"
    ],
    safetyGuidelines: [
      "Safety goggles and steel-toe footwear required at all times.",
      "Tie back long hair and avoid loose sleeves near rotating spindles.",
      "Emergency stop switches are situated at every machine station.",
      "Report any hydraulic or pneumatic leaks immediately to lab proctors."
    ],
    resources: [
      { id: "res-m1", title: "Tensile Strength Testing on Structural Alloys Manual", category: "Manuals", size: "3.4 MB" },
      { id: "res-m2", title: "Wind Tunnel Aerodynamic Drag Calculation Guide", category: "Experiment Guides", size: "2.8 MB" }
    ]
  },
  {
    id: "lab-physics",
    name: "Physics Lab",
    code: "PHYS-LAB",
    description: "Precision experimental space for laser interferometry, optical spectrometer calibration, quantum hall effect apparatus, and electromagnetism experiments.",
    facultyInCharge: "Dr. Katherine Vance",
    availableEquipment: [
      "Helium-Neon Optical Laser Bench & Michelson Interferometers",
      "High-Resolution Diffraction Spectrometers",
      "Photoelectric Effect Calibration Kits",
      "Hall Effect & Magnetic Field Measurement Probes",
      "Cryogenic Resistance Testing Vessel"
    ],
    safetyGuidelines: [
      "Never look directly into laser beams; keep laser paths at waist level.",
      "Handle optical lenses only by edges with lint-free microfiber.",
      "Wear insulated thermal gloves when operating cryogenic liquid nitrogen dewar.",
      "Ensure high-voltage power supplies are switched off before re-cabling."
    ],
    resources: [
      { id: "res-p1", title: "Michelson Interferometer Laser Wavelength Calibration", category: "Manuals", size: "2.1 MB" },
      { id: "res-p2", title: "Quantum Photoelectric Constant Derivation Guide", category: "Experiment Guides", size: "1.9 MB" }
    ]
  },
  {
    id: "lab-c2s",
    name: "C2S Lab",
    code: "C2S-LAB",
    description: "Chips to Startup (C2S) specialized laboratory dedicated to VLSI design, semiconductor circuit emulation, ASIC prototyping, and hardware-software co-design.",
    facultyInCharge: "Dr. Arvind Sharma",
    availableEquipment: [
      "Xilinx UltraScale+ FPGA Development Stations",
      "Synopsys & Cadence Electronic Design Automation (EDA) Suite",
      "Keysight 4-Channel 1GHz Mixed-Signal Oscilloscopes",
      "Logic Analyzers & JTAG Hardware In-Circuit Emulators",
      "Clean Air Static-Free Soldering & Rework Stations"
    ],
    safetyGuidelines: [
      "Always ground yourself using ESD wrist-straps before handling silicon boards.",
      "Do not apply voltages exceeding device datasheets onto exposed GPIO headers.",
      "Operate solder fume extractors whenever performing rework or testing.",
      "Save EDA project bitstreams to university network backup directories regularly."
    ],
    resources: [
      { id: "res-c1", title: "C2S FPGA Bitstream Synthesis & Verilog Implementation Guide", category: "Tutorials", size: "5.2 MB" },
      { id: "res-c2", title: "Semiconductor CMOS Layout Rules & DRC/LVS Verification", category: "Reference Materials", size: "4.6 MB" }
    ]
  },
  {
    id: "lab-electronics",
    name: "Electronics Lab",
    code: "ELEC-LAB",
    description: "Comprehensive analog and digital circuitry laboratory with dual-trace oscilloscopes, function generators, microcontrollers, and communication trainers.",
    facultyInCharge: "Prof. Corina Wells",
    availableEquipment: [
      "Arbitrary Waveform Generators (0–50MHz)",
      "Digital Storage Oscilloscopes (DSO 100MHz)",
      "Microcontroller Dev Boards (ESP32, STM32, Arduino ARM)",
      "Spectrum Analyzers & RF Modulation Trainer Benches",
      "Regulated Dual-Channel DC Power Supplies"
    ],
    safetyGuidelines: [
      "Double check polarity on electrolytic capacitors before powering breadboards.",
      "Power down supply before modifying breadboard jumper connections.",
      "Keep liquids, beverages, and wet objects strictly away from test benches.",
      "Inspect multimeter probe leads for frayed insulation before use."
    ],
    resources: [
      { id: "res-e1", title: "Operational Amplifier Active Filter Design & Frequency Analysis", category: "Experiment Guides", size: "2.5 MB" }
    ]
  },
  {
    id: "lab-computer",
    name: "Computer Lab",
    code: "COMP-LAB",
    description: "High-performance computing cluster with GPU-accelerated workstations, gigabit networking, virtualization sandboxes, and modern software development tools.",
    facultyInCharge: "Master Aris Thorne (Instructor Lead)",
    availableEquipment: [
      "60x Dell Precision Workstations (64GB RAM, RTX 4080 GPUs)",
      "Dedicated High-Performance Linux Compute Cluster (Slurm scheduler)",
      "Dual-Monitor Ergonomic Programming Stations",
      "High-Speed Symmetrical 10Gbps Fiber Uplink",
      "Virtual Reality & Spatial Simulation Pods"
    ],
    safetyGuidelines: [
      "Lock workstation screens whenever leaving your bench unattended.",
      "Do not tamper with rear server rack cabling or network patch bays.",
      "Adhere strictly to the University Acceptable Use Policy and Ethics Code.",
      "Report any electrical sparking or UPS alarm beeps immediately."
    ],
    resources: [
      { id: "res-comp1", title: "Distributed Systems & GPU Parallel Compute Onboarding Manual", category: "Manuals", size: "3.9 MB" },
      { id: "res-comp2", title: "Full-Stack REST Architecture & Database Security Tutorial", category: "Tutorials", size: "2.7 MB" }
    ]
  }
];

export const studentDirectory = [
  {
    id: "student-aris-thorne",
    name: "Aris Thorne",
    house: "Ravenclaw",
    year: "5th Year · Senior Adept",
    branch: "Computer Science & Arcana",
    languages: ["English", "Hindi", "French", "Runic Eldorian"],
    hobbies: ["Astrophotography", "Chess", "Broom Flight", "Spell Scripting"],
    fieldsOfInterest: ["Artificial Intelligence", "Chronomancy", "Quantum Arithmancy", "Cyber Security"],
    skills: ["Algorithm Design", "Python & ArcanaScript", "Temporal Modeling", "React & Web Magic"],
    title: "Scholar of Celestial Arithmancy",
    wand: "11¾ in · Black Walnut · Phoenix Feather Core",
    patronus: "Obsidian Owl",
    favSubject: "Ancient Runes & Arithmancy",
    bio: "Lead student researcher on astral ley lines, full-stack platform developer, and winner of the Silver Quill in runic translation.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"
  },
  {
    id: "p-1",
    name: "Lyra Valerius",
    house: "Ravenclaw",
    year: "6th Year · Prefect",
    branch: "Computer Science & Arcana",
    languages: ["English", "German", "Ancient Latin", "Hindi"],
    hobbies: ["Debating", "Chess", "Reading", "Stargazing"],
    fieldsOfInterest: ["Artificial Intelligence", "Cyber Security", "Runic Linguistics", "Quantum Arithmancy"],
    skills: ["Public Speaking", "System Architecture", "Lexical Decryption", "Logic Analysis"],
    title: "Master of Runic Geometry",
    wand: "12 in · Rowan · Unicorn Tail Hair",
    patronus: "Silver Falcon",
    favSubject: "Ancient Runes",
    bio: "President of the Literary & Debating Club, chief researcher of the Eldorian Astrolabe and author of three peer scrolls on celestial navigation.",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80"
  },
  {
    id: "p-2",
    name: "Cedric Blackthorn",
    house: "Gryffindor",
    year: "5th Year",
    branch: "Mechanical Alchemical Engineering",
    languages: ["English", "Hindi", "Spanish"],
    hobbies: ["Football", "Volleyball", "Broom Flight", "Kinetic Tinkering"],
    fieldsOfInterest: ["Robotics", "Aero-Dynamics", "Kinetic Mechanisms", "Renewable Energy"],
    skills: ["Aerodynamic Design", "CAD & Runic Drafting", "Team Leadership", "High-Speed Reflexes"],
    title: "Seeker & Aero-Captain",
    wand: "11 in · English Oak · Dragon Heartstring",
    patronus: "Snow Leopard",
    favSubject: "Aero-Tactics",
    bio: "Captain of the outdoor sports brigade and record holder for the fastest flight navigation circuit across high-wind conditions.",
    avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=250&q=80"
  },
  {
    id: "p-3",
    name: "Isolde Ravenshadow",
    house: "Slytherin",
    year: "7th Year",
    branch: "Electronics & Optical Engineering",
    languages: ["English", "French", "Japanese", "Tamil"],
    hobbies: ["Table Tennis", "Badminton", "Potion Brewing", "Circuit Design"],
    fieldsOfInterest: ["Semiconductors & C2S", "Optoelectronics", "Quantum Sensors", "Nanotechnology"],
    skills: ["Oscilloscope Analysis", "VLSI Design", "Catalyst Optimization", "Cleanroom Protocol"],
    title: "Alchemical Prodigy & C2S Lead",
    wand: "13 in · Yew · Thestral Hair Core",
    patronus: "Viper of the Mist",
    favSubject: "Subterranean Potions & C2S Fab",
    bio: "Lead adept researcher in the C2S Semiconductor Fab Lab, specializing in photon-stimulated wafer crystallization and memory extraction tonics.",
    avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=250&q=80"
  },
  {
    id: "p-4",
    name: "Thaddeus Thorne",
    house: "Hufflepuff",
    year: "4th Year",
    branch: "Civil & Sustainable Infrastructure",
    languages: ["English", "Hindi", "Telugu"],
    hobbies: ["Kho-Kho", "Gardening", "Carroms", "Acoustic Guitar"],
    fieldsOfInterest: ["Sustainable Magic", "Bio-Architecture", "Green Campus Design", "Water Filtration"],
    skills: ["Geotechnical Surveying", "Plant Physiology", "Structural Modeling", "Music Production"],
    title: "Keeper of Herbological Groves",
    wand: "10½ in · Willow · Phoenix Plume",
    patronus: "Golden Badger",
    favSubject: "Magical Botany",
    bio: "Music Club active instrumentalist, manages the botanical greenhouses and developed the natural wetland water recycling system for the Mess.",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80"
  },
  {
    id: "p-5",
    name: "Elowen Frost",
    house: "Ravenclaw",
    year: "5th Year",
    branch: "Physics & Applied Celestial Mechanics",
    languages: ["English", "German", "Russian"],
    hobbies: ["Chess", "Classical Dance", "Telescope Building", "Calligraphy"],
    fieldsOfInterest: ["Astrophysics", "Chronomancy", "Gravitational Optics", "Artificial Intelligence"],
    skills: ["Spectroscopic Analysis", "Mathematical Proofs", "Choreography", "Optics Assembly"],
    title: "Star-Weaver & Diviner",
    wand: "11¼ in · Silver Birch · Kelpie Mane",
    patronus: "Luminescent Swan",
    favSubject: "Chronomancy & Astronomy",
    bio: "Dance Club coordinator and observatory researcher plotting gravitational distortion vectors and solar eclipse harmonics.",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80"
  },
  {
    id: "p-6",
    name: "Arch-Magister Valerius",
    house: "Ravenclaw",
    year: "Faculty Head",
    branch: "Academic Directorate",
    languages: ["English", "Ancient Greek", "Latin", "Sanskrit", "Eldorian Glyphs"],
    hobbies: ["Chess", "Archival Restoration", "Tea Tasting"],
    fieldsOfInterest: ["Quantum Arithmancy", "Curricular Reform", "Ancient Wards"],
    skills: ["Institutional Leadership", "Ancient Ward Craft", "Mentorship"],
    title: "Dean of Academics & Runic Linguistics",
    wand: "14 in · Ancient Ebony · Phoenix Feather",
    patronus: "Crown Raven",
    favSubject: "All Arcane Disciplines",
    bio: "Over three centuries of dedicated scholarship deciphering lost magical tongues and ancient academy wards.",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80"
  }
];

export const sportsDisciplinesData = [
  // 6 Outdoor Sports
  { id: "sport-volleyball", name: "Volleyball", category: "Outdoor", teamSize: "6 Players", venue: "West Outdoor Courts", iconName: "Activity", description: "Tactical setting, spikes, and perimeter defense on regulation sand and hard courts." },
  { id: "sport-kho-kho", name: "Kho-Kho", category: "Outdoor", teamSize: "9 Chasers / 3 Runners", venue: "Central Athletics Oval", iconName: "Zap", description: "High-speed traditional tag sport demanding agility, quick direction shifts, and chasing stamina." },
  { id: "sport-kabaddi", name: "Kabaddi", category: "Outdoor", teamSize: "7 Players", venue: "South Pavilion Mat Arena", iconName: "Shield", description: "Intense contact raid-and-tackle sport testing continuous breath cant, agility, and defensive union." },
  { id: "sport-football", name: "Football", category: "Outdoor", teamSize: "11 Players", venue: "Skyspire Emerald Football Field", iconName: "Circle", description: "The premier outdoor field sport of wing sprints, tactical passing, and scoring goals." },
  { id: "sport-throwball", name: "Throwball", category: "Outdoor", teamSize: "7 Players", venue: "East Multi-Purpose Court", iconName: "Flame", description: "Fast-reflex overhead catch-and-throw sport played across high-tension nets." },
  { id: "sport-badminton", name: "Badminton", category: "Outdoor", teamSize: "Singles / Doubles", venue: "Pavilion Wind-Shielded Courts", iconName: "Feather", description: "High-speed racquet rallies, smashes, and delicate drops across the net." },

  // 3 Indoor Sports
  { id: "sport-chess", name: "Chess", category: "Indoor", teamSize: "1 vs 1", venue: "Library Mind Games Hall", iconName: "Award", description: "The supreme game of foresight, strategic maneuvering, positional pawn structures, and checkmate." },
  { id: "sport-carroms", name: "Carroms", category: "Indoor", teamSize: "Singles / Doubles", venue: "Common Recreation Lounge", iconName: "Target", description: "Classic tabletop striker game testing rebound geometry, smooth finger flicking, and pocketing the red queen." },
  { id: "sport-table-tennis", name: "Table Tennis", category: "Indoor", teamSize: "Singles / Doubles", venue: "Indoor Sports Hall B", iconName: "RotateCcw", description: "Lightning reflex paddle exchanges, top-spin loops, and rapid-fire table rallies." }
];

export const studentCouncilData = [
  {
    id: "c-pres",
    role: "Student Council President",
    name: "Rowan Vance",
    branch: "Computer Science & Arcana (Year IV)",
    officeHours: "Mon & Wed · 16:00 – 18:00",
    email: "council.president@spellbound.edu",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
    announcements: [
      "Campus Wi-Fi upgrade in both Hostels scheduled for completion by Friday.",
      "Open Student Forum on Mess Menu Improvements set for November 8th in Academic Auditorium."
    ]
  },
  {
    id: "c-vpres",
    role: "Vice President & Welfare Secretary",
    name: "Lyra Valerius",
    branch: "Computer Science & Arcana (Year VI)",
    officeHours: "Tue & Thu · 15:30 – 17:30",
    email: "council.welfare@spellbound.edu",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80",
    announcements: [
      "Mental Health & Peer Support counseling circles now active every Wednesday in the Cafeteria private lounge.",
      "Emergency medicine dispatch protocol updated with Hospital Wing."
    ]
  },
  {
    id: "c-sports",
    role: "Sports & Athletics Secretary",
    name: "Cedric Blackthorn",
    branch: "Mechanical Alchemical Engineering (Year V)",
    officeHours: "Fridays · 16:00 – 18:30",
    email: "council.sports@spellbound.edu",
    avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=250&q=80",
    announcements: [
      "Inter-House Autumn Sports Fest begins registration for Volleyball, Kho-Kho, and Chess this week!",
      "New equipment sets for Table Tennis and Badminton have arrived in the sports store."
    ]
  },
  {
    id: "c-cultural",
    role: "Cultural & Clubs Secretary",
    name: "Seraphina Vance",
    branch: "Civil & Sustainable Infrastructure (Year IV)",
    officeHours: "Thursdays · 16:30 – 18:30",
    email: "council.cultural@spellbound.edu",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80",
    announcements: [
      "Auditions for the Solstice Gala Concert are open across all four featured clubs.",
      "Fine Arts gallery space allocated in the Academic Building central concourse."
    ]
  }
];

export const officialNoticesData = [
  {
    id: "notif-1",
    title: "Mid-Semester Examination Schedule & Room Allocations",
    category: "Academic Deadline",
    message: "The official schedule for all Engineering and Arcana curricula has been posted. Hall tickets must be collected by Friday 17:00 from the Academic Registry.",
    publicationDate: "2026-10-24T09:00:00Z",
    priority: "Urgent",
    issuingAuthority: "Office of the Academic Dean"
  },
  {
    id: "notif-2",
    title: "Autumn Weather Warning: Gale-Force Crosswinds on Skyways",
    category: "Official Warning",
    message: "Northern Chasm wind speeds are projected to hit 42 knots. The Skybridge to Skyspire Arena will require stabilizing ward activation. Walkways remain open.",
    publicationDate: "2026-10-23T14:00:00Z",
    priority: "High",
    issuingAuthority: "Campus Security & Ward Proctors"
  },
  {
    id: "notif-3",
    title: "Mess Menu Revisions & Dietary Survey Announcement",
    category: "Administrative Notice",
    message: "The Student Council in coordination with the Dining Committee has introduced organic millets and gluten-free counters in the Mess starting Monday.",
    publicationDate: "2026-10-22T11:00:00Z",
    priority: "Normal",
    issuingAuthority: "Student Welfare & Mess Directorate"
  },
  {
    id: "notif-4",
    title: "C2S Fab Lab Semiconductor Equipment Maintenance",
    category: "Campus Directive",
    message: "Cleanroom Station 3 in the C2S Lab will undergo scheduled ion-beam recalibration on Saturday from 08:00 to 14:00. Prior reservations will be rescheduled.",
    publicationDate: "2026-10-21T16:00:00Z",
    priority: "Normal",
    issuingAuthority: "C2S Laboratory Directorate"
  }
];

export const campusEvents = [
  {
    id: "evt-1",
    title: "Celestial Solstice Gala & Debating Forum",
    date: "Dec 21 · 19:00",
    location: "Academic Central Auditorium",
    category: "Gala & Feast",
    rsvpCount: 248,
    isRsvp: true,
    club: "Literary and Debating Club",
    description: "Annual winter gala celebrating the winter solstice with the final Inter-House Parliamentary Debate under enchanted floating ice candelabras."
  },
  {
    id: "evt-2",
    title: "Acoustic Reverberation Solstice Concert",
    date: "Nov 15 · 18:30",
    location: "Cafeteria Open-Air Veranda",
    category: "Live Music",
    rsvpCount: 185,
    isRsvp: true,
    club: "Music Club",
    description: "Live performance by the Music Club string ensemble and contemporary academy band, featuring enchanted lute harmonies."
  },
  {
    id: "evt-3",
    title: "Kinetic Movement & Choreography Workshop",
    date: "Nov 20 · 17:00",
    location: "Academic Studio Hall 3",
    category: "Workshop",
    rsvpCount: 92,
    isRsvp: false,
    club: "Dance Club",
    description: "Intensive flow-arts and classical rhythm session hosted by the Dance Club for dancers of all skill tiers."
  },
  {
    id: "evt-4",
    title: "Moving Portrait & Canvas Exhibition",
    date: "Nov 28 · 14:00",
    location: "Grand Concourse Gallery",
    category: "Exhibition",
    rsvpCount: 140,
    isRsvp: false,
    club: "Fine Arts Club",
    description: "Exhibition of student paintings, illuminated pigments, pottery sculptures, and botanical illustrations."
  }
];

export const dailySchedule = [
  {
    id: "sched-1",
    time: "08:30 – 10:00",
    subject: "Advanced Transfiguration & Materials",
    instructor: "Prof. Morgana Vance",
    location: "Academic Building (Room 302)",
    status: "Completed",
    notes: "Molecular transformation of crystalline copper alloys."
  },
  {
    id: "sched-2",
    time: "10:30 – 12:00",
    subject: "C2S VLSI Hardware Design & Verilog",
    instructor: "Dr. Arvind Sharma",
    location: "C2S Laboratory (Floor II)",
    status: "In Progress",
    notes: "Bring your FPGA board and timing constraint files."
  },
  {
    id: "sched-3",
    time: "13:30 – 15:00",
    subject: "Volleyball Squad Tactical Drills",
    instructor: "Captain Cedric Blackthorn",
    location: "West Outdoor Volleyball Courts",
    status: "Upcoming",
    notes: "Serving strategy and perimeter defensive positioning."
  },
  {
    id: "sched-4",
    time: "15:45 – 17:15",
    subject: "Physics Lab: Laser Interferometry",
    instructor: "Dr. Katherine Vance",
    location: "Physics Laboratory (Floor I)",
    status: "Upcoming",
    notes: "Michelson fringe shift verification across multi-wavelength lasers."
  }
];

export const potionIngredients = [
  { id: "ing-1", name: "Dragon Breath Ember", potency: 8, stability: -3, color: "#E05A47" },
  { id: "ing-2", name: "Crushed Moonstone", potency: 5, stability: 6, color: "#E3EEF9" },
  { id: "ing-3", name: "Silver Dewleaf", potency: 4, stability: 5, color: "#9BE0B5" },
  { id: "ing-4", name: "Mandrake Root Shavings", potency: 6, stability: -2, color: "#C49A6C" },
  { id: "ing-5", name: "Phoenix Feather Ash", potency: 9, stability: -4, color: "#F7BE4D" },
  { id: "ing-6", name: "Shadowcap Spores", potency: 7, stability: -1, color: "#7A5BA3" }
];

export const mysteriesRiddles = [
  {
    id: "rid-1",
    title: "The Enigma of the Three Celestial Spheres",
    question: "When Saturn stands in the eye of the Raven and the Solstice candle burns black, which dial unlocks the Chronos Vault?",
    options: ["The Silver Crescent Dial", "The Sun-Gold Astrolabe", "The Obsidian Hourglass", "The Wand of Dawn"],
    correctIndex: 2,
    explanation: "Correct! The Obsidian Hourglass reverses entropy when aligned with the Saturnian eclipse."
  }
];

export const notificationsList = [
  {
    id: "notif-1",
    title: "House Cup Points Ledger Updated",
    text: "+25 points consigned to Ravenclaw for exemplary laboratory research.",
    time: "10m ago",
    read: false,
    type: "points"
  },
  {
    id: "notif-2",
    title: "C2S Lab Experiment Scheduled",
    text: "Your session for FPGA VLSI Bitstream testing commences at 10:30 in C2S Lab.",
    time: "1h ago",
    read: false,
    type: "academics"
  },
  {
    id: "notif-3",
    title: "New Parchment Dispatch (Owl)",
    text: "Lyra Valerius sent a study circle inquiry for Ancient Runes & Verilog.",
    time: "2h ago",
    read: true,
    type: "owl"
  },
  {
    id: "notif-4",
    title: "Campus Safety Ward Notice",
    text: "Routine ward tuning tonight between 01:00 and 03:00 around the North Quad.",
    time: "Yesterday",
    read: true,
    type: "safety"
  }
];
