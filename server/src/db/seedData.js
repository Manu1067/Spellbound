/**
 * Seed Data for Spellbound Academy
 * Idempotently seeds initial lore, houses, students, courses, locations, and events.
 */

export const houses = [
  {
    id: 'ravencrest',
    name: 'Ravencrest',
    motto: 'Wisdom through Starlit Inquiry',
    core_values: JSON.stringify(['Intellect', 'Astronomy', 'Rune Craft', 'Perception']),
    points: 1420,
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
    points: 1385,
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
    points: 1410,
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
    points: 1320,
    crest_color: '#82461D',
    accent_color: '#F6F0E4',
    animal: 'Fire Drake',
    gem: 'Citrine Amber',
    head_of_house: 'Elder Rosemary Vance'
  }
];

export const students = [
  {
    id: 'student-aris-thorne',
    name: 'Aris Thorne',
    house_id: 'ravencrest',
    year: 'Fifth Year · Senior Adept',
    title: 'Scholar of Celestial Arithmancy',
    wand: '11¾ in · Black Walnut · Phoenix Feather Core',
    patronus: 'Obsidian Owl',
    fav_subject: 'Ancient Runes & Arithmancy',
    bio: 'Lead researcher on astral ley lines and winner of the Silver Quill in runic translation.',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    points_contributed: 340,
    academic_rank: '4th in Class of 180',
    is_current_user: 1,
    skills: JSON.stringify(['Ancient Runes', 'Celestial Geometry', 'Ward Scripting', 'Arithmancy']),
    interests: JSON.stringify(['Astrolabe Calibration', 'Library Archiving', 'Star-Weaving']),
    project_experience: 'Constructed the miniature bronze Orrery of Eldoria, translating 14th-century parchment scripts into orbital brass gears.',
    is_mentor: 1,
    role: 'Senior Adept & Peer Mentor'
  },
  {
    id: 'p-1',
    name: 'Lyra Valerius',
    house_id: 'ravencrest',
    year: '6th Year · Prefect',
    title: 'Master of Runic Geometry',
    wand: '12 in · Rowan · Unicorn Tail Hair',
    patronus: 'Silver Falcon',
    fav_subject: 'Ancient Runes',
    bio: 'Chief researcher of the Eldorian Astrolabe and author of three peer scrolls on celestial navigation.',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
    points_contributed: 290,
    academic_rank: '2nd in Class of 175',
    is_current_user: 0,
    skills: JSON.stringify(['Runic Translation', 'Harmonic Resonance', 'Astral Cartography']),
    interests: JSON.stringify(['Ancient Manuscripts', 'Ward Breaking', 'Observatory Studies']),
    project_experience: 'Cataloged the 12 Forbidden Folios in the East Alcove scriptorium.',
    is_mentor: 1,
    role: 'Prefect & Senior Researcher'
  },
  {
    id: 'p-2',
    name: 'Cedric Blackthorn',
    house_id: 'gryphonhart',
    year: '5th Year',
    title: 'Seeker & Skyspire Captain',
    wand: '11 in · English Oak · Dragon Heartstring',
    patronus: 'Snow Leopard',
    fav_subject: 'Aero-Tactics',
    bio: 'Record holder for the fastest Snitch capture at 3 minutes and 14 seconds across misty gust conditions.',
    avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=250&q=80',
    points_contributed: 310,
    academic_rank: '18th in Class of 180',
    is_current_user: 0,
    skills: JSON.stringify(['High-Speed Slalom', 'Crosswind Evasions', 'Broom Aerodynamics']),
    interests: JSON.stringify(['Skyspire Derby', 'Aerial Strategy', 'Storm Chasing']),
    project_experience: 'Engineered aerodynamic tail-braces for Thunderstrike broomsticks.',
    is_mentor: 0,
    role: 'Team Captain & Seeker'
  },
  {
    id: 'p-3',
    name: 'Isolde Ravenshadow',
    house_id: 'shadowvale',
    year: '7th Year',
    title: 'Alchemical Prodigy',
    wand: '13 in · Yew · Thestral Hair Core',
    patronus: 'Viper of the Mist',
    fav_subject: 'Subterranean Potions',
    bio: 'Apprentice to Mistress Belladonna, specializing in memory extraction and nocturnal botanical catalysts.',
    avatar_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=250&q=80',
    points_contributed: 420,
    academic_rank: '1st in Class of 160',
    is_current_user: 0,
    skills: JSON.stringify(['Subterranean Distillation', 'Philtre Stabilization', 'Memory Extraction']),
    interests: JSON.stringify(['Nocturnal Botany', 'Shadow Cauldrons', 'Elixir Preservation']),
    project_experience: 'Synthesized the first non-corrosive Draught of Twilight Luminescence.',
    is_mentor: 1,
    role: 'Master Alchemist Adept'
  },
  {
    id: 'p-4',
    name: 'Thaddeus Thorne',
    house_id: 'emberwyrm',
    year: '4th Year',
    title: 'Keeper of Herbological Groves',
    wand: '10½ in · Willow · Phoenix Plume',
    patronus: 'Golden Badger',
    fav_subject: 'Magical Botany',
    bio: 'Curates the carnivorous orchid greenhouse and crafts medicinal tonics for the hospital wing.',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    points_contributed: 260,
    academic_rank: '12th in Class of 190',
    is_current_user: 0,
    skills: JSON.stringify(['Mandrake Propagation', 'Greenhouse Care', 'Soil Geodesic Balancing']),
    interests: JSON.stringify(['Rare Orchids', 'Herbal Tonics', 'Feral Flora']),
    project_experience: 'Cultivated acoustic-dampening moss around Greenhouse 4.',
    is_mentor: 0,
    role: 'Herbological Keeper'
  },
  {
    id: 'p-5',
    name: 'Elowen Frost',
    house_id: 'ravencrest',
    year: '5th Year',
    title: 'Star-Weaver & Diviner',
    wand: '11¼ in · Silver Birch · Kelpie Mane',
    patronus: 'Luminescent Swan',
    fav_subject: 'Chronomancy & Astronomy',
    bio: 'Spends nocturnal hours plotting lunar eclipses and mapping rogue meteors through brass astrolabes.',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
    points_contributed: 285,
    academic_rank: '8th in Class of 180',
    is_current_user: 0,
    skills: JSON.stringify(['Lunar Astrometry', 'Star-Weaving', 'Divination Glyphs']),
    interests: JSON.stringify(['Constellation Mapping', 'Celestial Equinoxes', 'Starlight Prisms']),
    project_experience: 'Mapped the retrograde trajectory of the Comet of Cassiopeia.',
    is_mentor: 0,
    role: 'Observatory Adept'
  },
  {
    id: 'p-6',
    name: 'Arch-Magister Valerius',
    house_id: 'ravencrest',
    year: 'Faculty Head',
    title: 'Dean of Runic Linguistics',
    wand: '14 in · Ancient Ebony · Phoenix Feather',
    patronus: 'Crown Raven',
    fav_subject: 'All Arcane Disciplines',
    bio: 'Over three centuries of dedicated scholarship deciphering lost magical tongues and ancient academy wards.',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80',
    points_contributed: 1200,
    academic_rank: 'Dean Emeritus',
    is_current_user: 0,
    skills: JSON.stringify(['Ancient Languages', 'Grand Castle Wards', 'High Chronomancy']),
    interests: JSON.stringify(['Academy History', 'Arcane Preservation', 'Adept Guidance']),
    project_experience: 'Re-anchored the living castle ley lines during the Great Shifting of 1884.',
    is_mentor: 1,
    role: 'Faculty Dean & Mentor'
  },
  {
    id: 'p-7',
    name: 'Rowan Vance',
    house_id: 'gryphonhart',
    year: '4th Year',
    title: 'Chaser & Wind Tactician',
    wand: '10¾ in · Ash · Dragon Tendon',
    patronus: 'Peregrine Falcon',
    fav_subject: 'Aero-Tactics',
    bio: 'Agile Skyspire chaser known for steep reverse dives and team coordination.',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    points_contributed: 240,
    academic_rank: '22nd in Class of 190',
    is_current_user: 0,
    skills: JSON.stringify(['Aerial Formations', 'Broom Tuning', 'Reflex Agility']),
    interests: JSON.stringify(['Wind Vectors', 'Tournament Scrims', 'Gale Flight']),
    project_experience: 'Co-authored the Skyspire Offensive Playbook for high-wind conditions.',
    is_mentor: 0,
    role: 'Junior Chaser'
  },
  {
    id: 'p-8',
    name: 'Sylvia Sunstrider',
    house_id: 'emberwyrm',
    year: '6th Year · Senior Adept',
    title: 'Elemental Catalyst Researcher',
    wand: '12½ in · Cypress · Phoenix Feather',
    patronus: 'Golden Badger',
    fav_subject: 'Elemental Alchemy',
    bio: 'Senior research adept researching heat transfer in dragon-scale crucibles.',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80',
    points_contributed: 380,
    academic_rank: '5th in Class of 175',
    is_current_user: 0,
    skills: JSON.stringify(['Thermal Transmutation', 'Catalyst Synthesis', 'Rune Inscription']),
    interests: JSON.stringify(['Crucible Metallurgy', 'Flame Enchantments', 'Safety Wards']),
    project_experience: 'Designed the ember-resistant gloves used in all beginner lab stations.',
    is_mentor: 1,
    role: 'Lab Teaching Assistant'
  }
];

export const locations = [
  {
    id: 'loc-1',
    name: 'The Great Hall',
    zone: 'Central Keep',
    description: 'The grand ceremonial heart of the castle, sheltered beneath an enchanted ceiling reflecting the nocturnal sky and warmed by four roaring hearths.',
    highlights: JSON.stringify(['Enchanted Starry Ceiling', 'House Hourglasses', 'High Table of Masters', 'Floating Candelabras']),
    danger_level: 'Peaceful',
    coord_x: 50,
    coord_y: 56,
    is_secret: 0
  },
  {
    id: 'loc-2',
    name: 'The Grand Library & Scriptoria',
    zone: 'North Wing',
    description: 'A labyrinth of towering mahogany shelves containing 200,000 levitating grimoires, self-transcribing quills, and whisper-warded study carrels.',
    highlights: JSON.stringify(['The Restricted Vault', 'Self-Returning Tomes', 'Whispering Gallery', 'Manuscript Restorers']),
    danger_level: 'Mild Caution',
    coord_x: 38,
    coord_y: 35,
    is_secret: 0
  },
  {
    id: 'loc-3',
    name: 'Astronomy Spire Pinnacle',
    zone: 'Sky Pinnacles',
    description: 'The highest tower in the castle, piercing the night clouds. Hosts monumental brass armillary spheres and lenses aimed at deep celestial matrices.',
    highlights: JSON.stringify(['The Great Brass Armillary', 'Constellation Viewers', 'Wind-Ward Platforms', 'Meteor Sundials']),
    danger_level: 'High Altitude',
    coord_x: 65,
    coord_y: 22,
    is_secret: 0
  },
  {
    id: 'loc-4',
    name: 'Skyspire Aerial Arena',
    zone: 'South Chasm',
    description: 'Suspended over a deep mountain gorge, featuring emerald turf floating on repulsion runes and three towering golden ring goals.',
    highlights: JSON.stringify(['Hovering Goal Rings', 'Spectator Turrets', 'Wind-Vector Flags', 'Broomstick Launching Bay']),
    danger_level: 'Acrobatic Thrill',
    coord_x: 78,
    coord_y: 70,
    is_secret: 0
  },
  {
    id: 'loc-5',
    name: 'Alchemical Dungeons',
    zone: 'Subterranean Vaults',
    description: 'Vaulted stone cellars carved directly into mountain basalt, cool and echoing with the bubbling of pewter cauldrons and pungent herb fumes.',
    highlights: JSON.stringify(['Simmering Cauldrons', 'Rare Specimen Vaults', 'Distillation Stills', 'Flame-Tempered Desks']),
    danger_level: 'Volatile Chemicals',
    coord_x: 32,
    coord_y: 75,
    is_secret: 0
  },
  {
    id: 'loc-6',
    name: 'The Forbidden Woods Fringe',
    zone: 'Outer Periphery',
    description: 'Ancient dense canopy of silver fir and weeping willow where wild magic pools in mossy hollows, guarded by mystical guardians.',
    highlights: JSON.stringify(['Luminescent Mushrooms', 'Silver Springs', 'Unicorn Clearings', 'Ancient Boundary Stones']),
    danger_level: 'Strictly Restricted After Dusk',
    coord_x: 18,
    coord_y: 48,
    is_secret: 0
  },
  {
    id: 'loc-7',
    name: 'The Restricted Vault of Chronomancy',
    zone: 'Subterranean Vaults',
    description: 'Hidden beneath three concentric ward circles, this vault preserves temporal hourglasses and oscillating astral chronometers.',
    highlights: JSON.stringify(['Pendulum of Eternity', 'Obsidian Hourglass', 'Temporal Mirror', 'Archival Cipher Steles']),
    danger_level: 'Extreme Arcane Hazard',
    coord_x: 42,
    coord_y: 88,
    is_secret: 1
  }
];

export const pathways = [
  {
    id: 'path-1',
    from_location_id: 'loc-1',
    to_location_id: 'loc-2',
    name: 'Marble Grand Staircase',
    path_type: 'Moving Staircase',
    distance: 14,
    is_unlocked: 1,
    description: 'Connects the Great Hall to the Grand Library; shifts orientation every half hour.'
  },
  {
    id: 'path-2',
    from_location_id: 'loc-2',
    to_location_id: 'loc-3',
    name: 'Spire Winding Spiral',
    path_type: 'Corridor',
    distance: 12,
    is_unlocked: 1,
    description: 'Ascends 400 stone steps from the Library scriptoria to the starry pinnacle.'
  },
  {
    id: 'path-3',
    from_location_id: 'loc-1',
    to_location_id: 'loc-5',
    name: 'Basalt Cellar Descent',
    path_type: 'Corridor',
    distance: 16,
    is_unlocked: 1,
    description: 'Chilly granite passageway leading to the potion dungeon vaults.'
  },
  {
    id: 'path-4',
    from_location_id: 'loc-1',
    to_location_id: 'loc-4',
    name: 'Gorge Suspension Skybridge',
    path_type: 'Skybridge',
    distance: 22,
    is_unlocked: 1,
    description: 'Arched stone bridge spanning the windy gorge to the Skyspire pitch.'
  },
  {
    id: 'path-5',
    from_location_id: 'loc-5',
    to_location_id: 'loc-7',
    name: 'Shadow Runic Vault Passage',
    path_type: 'Secret Passage',
    distance: 18,
    is_unlocked: 1,
    description: 'Hidden behind a tapestry of the Solstice Serpent, requiring the Chronos Cipher.'
  },
  {
    id: 'path-6',
    from_location_id: 'loc-2',
    to_location_id: 'loc-5',
    name: 'Secret Scholars Flue',
    path_type: 'Secret Passage',
    distance: 15,
    is_unlocked: 1,
    description: 'Concealed spiral chute between the Restricted Archives and Potions Dungeons.'
  },
  {
    id: 'path-7',
    from_location_id: 'loc-1',
    to_location_id: 'loc-6',
    name: 'South Cloister Walk',
    path_type: 'Corridor',
    distance: 14,
    is_unlocked: 1,
    description: 'Covered gothic archway skirting the outer castle walls toward the botanical fringe.'
  },
  {
    id: 'path-8',
    from_location_id: 'loc-6',
    to_location_id: 'loc-4',
    name: 'Periphery Forest Bridleway',
    path_type: 'Corridor',
    distance: 20,
    is_unlocked: 1,
    description: 'Winding gravel path connecting the wild woods fringe directly to the Skyspire arena.'
  },
  {
    id: 'path-9',
    from_location_id: 'loc-3',
    to_location_id: 'loc-4',
    name: 'Skyward Aerodrome Viaduct',
    path_type: 'Skybridge',
    distance: 26,
    is_unlocked: 1,
    description: 'High-altitude stone viaduct connecting the Astronomy Spire to the upper spectator stands.'
  },
  {
    id: 'path-10',
    from_location_id: 'loc-6',
    to_location_id: 'loc-5',
    name: 'Root Cellar Conduit',
    path_type: 'Corridor',
    distance: 17,
    is_unlocked: 1,
    description: 'Subterranean conduit for transporting freshly harvested botanical catalysts to the stills.'
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
    location_id: 'loc-1'
  },
  {
    code: 'RUNE-404',
    title: 'Decryption of Eldorian Tablets',
    instructor: 'Arch-Magister Valerius',
    term: 'Autumn Equinox',
    credits: 3,
    description: 'Syntactic analysis of third-age astronomical glyphs carved in obsidian.',
    location_id: 'loc-2'
  },
  {
    code: 'ALCH-520',
    title: 'Distillation of Twilight Essences',
    instructor: 'Mistress Belladonna',
    term: 'Autumn Equinox',
    credits: 4,
    description: 'Nocturnal reagent processing under waxing lunar illumination.',
    location_id: 'loc-5'
  },
  {
    code: 'ASTR-308',
    title: 'Planetary Ley-Line Dynamics',
    instructor: 'Master Elowen Frost',
    term: 'Autumn Equinox',
    credits: 3,
    description: 'Gravitational distortion of spell trajectories during astral conjunctions.',
    location_id: 'loc-3'
  },
  {
    code: 'AERO-201',
    title: 'High-Velocity Broom Maneuvers',
    instructor: 'Captain Torin Drake',
    term: 'Autumn Equinox',
    credits: 2,
    description: 'Tactical banking, slalom interception, and vortex handling in gusty skies.',
    location_id: 'loc-4'
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
    subject: 'Transfiguration',
    topic: 'Molecular Morphology',
    difficulty: 'Adept',
    chamber: 'Subterranean Vaults',
    citation: 'Grand Library, Restricted Alcove IV, Folio 112',
    content_snippet: 'Harmonic frequencies and cellular animus equations necessary to induce biological transmutation into unrefined copper.',
    study_notes: 'To stabilize living metal without spontaneous degradation, harmonize the transfigurative incantation at 432 Hz while visualizing the mineral crystalline lattice. Requires mastery of inanimate animus reversal charm.',
    is_approved: 1
  },
  {
    id: 'res-2',
    course_code: 'RUNE-404',
    title: 'Eldorian Glyphs & Astronomical Stelae',
    resource_type: 'Parchment Scroll',
    author: 'Arch-Magister Valerius',
    rarity: 'Standard',
    subject: 'Ancient Runes',
    topic: 'Eldorian Decryption',
    difficulty: 'Apprentice',
    chamber: 'Grand Scriptoria',
    citation: 'Department of Mysteries Inscription Archives, Stela VII',
    content_snippet: 'A comprehensive translation lexicon converting the 72 northern constellations into functional spellcraft phonemes.',
    study_notes: 'Eldorian runes function as celestial waveguides. When incising onto basalt or obsidian, use electrum styluses to avoid electrostatic feedback during solstice conjunctions. Tri-corner glyphs consistently symbolize northern navigational vectors.',
    is_approved: 1
  },
  {
    id: 'res-3',
    course_code: 'ALCH-520',
    title: 'The Alchemist’s Vade Mecum',
    resource_type: 'Potion Recipe',
    author: 'Mistress Belladonna',
    rarity: 'Restricted',
    subject: 'Potions & Alchemy',
    topic: 'Lunar Stabilization',
    difficulty: 'Arch-Mage',
    chamber: 'Subterranean Vaults',
    citation: 'Dungeon Distillation Stills, Curator Folio #42',
    content_snippet: 'Precision instructions for distilling volatile lunar extracts and mitigating thermal runaways with crushed moonstone.',
    study_notes: 'Crushed Moonstone exhibits high stabilizing qualities (+6 stability) and steady illumination potency (+5). Adding crushed moonstone before dragon breath embers buffers crucible expansion and prevents cauldron rupture.',
    is_approved: 1
  },
  {
    id: 'res-4',
    course_code: 'RUNE-404',
    title: 'Chronomancy Fragment IX: The Divergence of Echoes',
    resource_type: 'Research Folio',
    author: 'Arch-Mage Chronis',
    rarity: 'Restricted',
    subject: 'Chronomancy',
    topic: 'Temporal Stasis',
    difficulty: 'Adept',
    chamber: 'Chronomancy Vault',
    citation: 'Chronomancy Vault, Stasis Pedestal 9',
    content_snippet: 'Observations on temporal resonance anomalies observed when multiple hourglasses are oscillated simultaneously.',
    study_notes: 'The Chronomancy Vault is anchored by three concentric ward rings. To traverse without tripping the temporal stasis trap, one must align the Obsidian Hourglass with the Saturnian eclipse.',
    is_approved: 1
  },
  {
    id: 'res-5',
    course_code: 'RUNE-404',
    title: 'Acoustic Wards and Basalt Harmonization',
    resource_type: 'Research Folio',
    author: 'Mistress Sonya Gale',
    rarity: 'Restricted',
    subject: 'Defense & Wards',
    topic: 'Acoustic Wards',
    difficulty: 'Arch-Mage',
    chamber: 'Acoustic Sanctum',
    citation: 'Acoustic Sanctum, Sound-Baffle Codex #3',
    content_snippet: 'Calculations for damping ultrasonic reverberations through basalt stone without disturbing sleeping spectral guardians.',
    study_notes: 'The harmonic frequency Sil-Astra cancels vibration waveforms through destructive resonance dampening, allowing silent ward penetration through dense granite.',
    is_approved: 1
  },
  {
    id: 'res-6',
    course_code: 'ASTR-308',
    title: 'Astrolabe Alignments of the Northern Crown',
    resource_type: 'Parchment Scroll',
    author: 'Master Elowen Frost',
    rarity: 'Standard',
    subject: 'Astronomy',
    topic: 'Planetary Ley Lines',
    difficulty: 'Apprentice',
    chamber: 'Stellar Observatory',
    citation: 'Astronomy Spire Pinnacle, Observation Logbook IV',
    content_snippet: 'Beginner guide for calibrating brass astrolabe latitude rings during retrograde motion of celestial constellations.',
    study_notes: 'When the Corona Noctis (The Crown Raven) reaches zenith at the autumn solstice, set the latitude dial to 54° North. This anchors magical conduits to the northern boundary wards.',
    is_approved: 1
  },
  {
    id: 'res-7',
    course_code: 'TRANS-501',
    title: 'The Solstice Serpent: Runes of Memory Inversion',
    resource_type: 'Runic Tablet',
    author: 'Elder Adept Vane',
    rarity: 'Restricted',
    subject: 'Transfiguration',
    topic: 'Memory Inversion',
    difficulty: 'Arch-Mage',
    chamber: 'Subterranean Vaults',
    citation: 'Subterranean Vaults, Black Ribbon Cabinet 12',
    content_snippet: 'Tapestry translation detailing the preservation and reversal of lost thoughts inside crystallized moonstone matrixes.',
    study_notes: 'Memory matrices can be preserved indefinitely in quartz and moonstone if shielded from psychic friction. Reversal requires counter-clockwise wand revolutions under lunar light.',
    is_approved: 1
  },
  {
    id: 'res-8',
    course_code: 'AERO-201',
    title: 'Principles of Aero-Vortex Dissipation',
    resource_type: 'Study Guide',
    author: 'Captain Torin Drake',
    rarity: 'Standard',
    subject: 'Aero-Tactics',
    topic: 'Vortex Handling',
    difficulty: 'Apprentice',
    chamber: 'Grand Scriptoria',
    citation: 'Skyspire Training Bay, Locker Room Archive',
    content_snippet: 'Fluid dynamic guidelines for countering turbulence eddies generated behind bludger trajectories and Nimbus wakes.',
    study_notes: 'A 15-degree lateral bank into an incoming tail-vortex reduces drag coefficient by 35%. Always maintain a two-hand grip on ash or oak shafts during crosswind gusts exceeding 40 knots.',
    is_approved: 1
  },
  {
    id: 'res-9',
    course_code: 'ALCH-520',
    title: 'Crucible Metallurgy & Dragonscale Thermal Retention',
    resource_type: 'Grimoire',
    author: 'Sylvia Sunstrider',
    rarity: 'Rare',
    subject: 'Potions & Alchemy',
    topic: 'Thermal Metallurgy',
    difficulty: 'Adept',
    chamber: 'Subterranean Vaults',
    citation: 'Alchemical Dungeons, Crucible Station 4',
    content_snippet: 'Experimental documentation on regulating high-heat transmutation reactions using enchanted dragon-scale crucibles.',
    study_notes: 'Dragon scales distribute thermal flux isotropically, preventing localized hotspots that destabilize volatile salamander blood potions.',
    is_approved: 1
  },
  {
    id: 'res-10',
    course_code: 'ASTR-308',
    title: 'Harmonic Resonance of Armillary Spheres',
    resource_type: 'Research Folio',
    author: 'Master Elowen Frost',
    rarity: 'Standard',
    subject: 'Astronomy',
    topic: 'Celestial Harmonics',
    difficulty: 'Adept',
    chamber: 'Stellar Observatory',
    citation: 'Grand Observatory Armillary Chamber, Folio 88',
    content_snippet: 'Acoustic calibration of concentric brass rings to harmonize with lunar tides and planetary ley line oscillations.',
    study_notes: 'Concentric brass rings vibrating in sympathy with celestial alignments amplify scrying clarity by up to 250%.',
    is_approved: 1
  }
];

export const events = [
  {
    id: 'evt-1',
    title: 'Celestial Solstice Ball',
    date_time: '2026-12-21T19:00:00Z',
    location_id: 'loc-1',
    location_name: 'The Grand Starry Hall',
    category: 'Gala & Feast',
    description: 'Annual gala celebrating the winter solstice under levitating ice sculptures and enchanted choral melodies.',
    rsvp_count: 248,
    capacity: 300,
    is_active: 1
  },
  {
    id: 'evt-2',
    title: 'Inter-House Aero-Broom Derby',
    date_time: '2026-11-04T14:00:00Z',
    location_id: 'loc-4',
    location_name: 'Skyspire Stadium',
    category: 'Championship',
    description: 'Ravencrest vs. Gryphonhart in the Autumn season final. Expect aerial tactical speed maneuvers.',
    rsvp_count: 312,
    capacity: 350,
    is_active: 1
  },
  {
    id: 'evt-3',
    title: 'Midnight Observatory Astral Conjunction',
    date_time: '2026-11-12T23:30:00Z',
    location_id: 'loc-3',
    location_name: 'Astronomy Spire Pinnacle',
    category: 'Academic',
    description: 'Planetary alignment of Saturn and Orion. Rare opportunity to observe astral ley line pulses.',
    rsvp_count: 89,
    capacity: 100,
    is_active: 1
  },
  {
    id: 'evt-4',
    title: 'Herbological Nocturnal Bloom Gathering',
    date_time: '2026-11-20T21:00:00Z',
    location_id: 'loc-6',
    location_name: 'Forbidden Woods Fringe',
    category: 'Expedition',
    description: 'Botanical expedition to harvest bioluminescent nightshade spores at peak potency.',
    rsvp_count: 45,
    capacity: 50,
    is_active: 1
  }
];

export const eventRegistrations = [
  {
    event_id: 'evt-1',
    student_id: 'student-aris-thorne'
  },
  {
    event_id: 'evt-3',
    student_id: 'student-aris-thorne'
  }
];

export const sportsTeams = [
  {
    id: 'team-gryphonhart',
    name: 'Gryphonhart Lions',
    house_id: 'gryphonhart',
    captain: 'Cedric Blackthorn',
    wins: 5,
    losses: 1,
    goal_differential: '+180',
    points: 15,
    crest_color: 'var(--burgundy-light)',
    roster: JSON.stringify([
      { name: 'Cedric Blackthorn', position: 'Seeker', broom: 'Firebolt Apex', speedRating: 98 },
      { name: 'Rowan Vance', position: 'Chaser', broom: 'Nimbus 3000', speedRating: 92 },
      { name: 'Garrick Stone', position: 'Chaser', broom: 'Cleansweep X', speedRating: 88 },
      { name: 'Julian Pike', position: 'Chaser', broom: 'Comet 290', speedRating: 87 },
      { name: 'Bartholomew Kane', position: 'Beater', broom: 'Ironwood Mark IV', speedRating: 85 },
      { name: 'Marcus Flint', position: 'Beater', broom: 'Ironwood Mark IV', speedRating: 84 },
      { name: 'Cassian Drake', position: 'Keeper', broom: 'Silver Arrow', speedRating: 90 }
    ])
  },
  {
    id: 'team-ravencrest',
    name: 'Ravencrest Skyhawks',
    house_id: 'ravencrest',
    captain: 'Rowan Vance',
    wins: 4,
    losses: 2,
    goal_differential: '+120',
    points: 12,
    crest_color: 'var(--antique-gold)',
    roster: JSON.stringify([
      { name: 'Rowan Vance', position: 'Seeker', broom: 'Silver Arrow II', speedRating: 96 },
      { name: 'Lyra Valerius', position: 'Chaser', broom: 'Nimbus 3000', speedRating: 91 },
      { name: 'Morrigan Gale', position: 'Chaser', broom: 'Starflyer 500', speedRating: 89 },
      { name: 'Kaelen Ward', position: 'Chaser', broom: 'Comet 290', speedRating: 86 },
      { name: 'Titus Vane', position: 'Beater', broom: 'Thunderstrike', speedRating: 88 },
      { name: 'Arthur Pendelton', position: 'Beater', broom: 'Thunderstrike', speedRating: 87 },
      { name: 'Helena Starling', position: 'Keeper', broom: 'Aegis Broomcraft', speedRating: 93 }
    ])
  },
  {
    id: 'team-shadowvale',
    name: 'Shadowvale Serpents',
    house_id: 'shadowvale',
    captain: 'Damian Blackwood',
    wins: 3,
    losses: 3,
    goal_differential: '+40',
    points: 9,
    crest_color: '#79C2A4',
    roster: JSON.stringify([
      { name: 'Damian Blackwood', position: 'Seeker', broom: 'Nightshade X', speedRating: 95 },
      { name: 'Isolde Ravenshadow', position: 'Chaser', broom: 'Vipera S', speedRating: 90 },
      { name: 'Valen Cross', position: 'Chaser', broom: 'Vipera S', speedRating: 88 },
      { name: 'Draco Malfoy Jr', position: 'Chaser', broom: 'Silver Arrow', speedRating: 86 },
      { name: 'Giles Thorne', position: 'Beater', broom: 'Ironwood Heavy', speedRating: 86 },
      { name: 'Corvus Grim', position: 'Beater', broom: 'Ironwood Heavy', speedRating: 85 },
      { name: 'Seraphina Bell', position: 'Keeper', broom: 'Shadowveil 4', speedRating: 89 }
    ])
  },
  {
    id: 'team-emberwyrm',
    name: 'Emberwyrm Drakes',
    house_id: 'emberwyrm',
    captain: 'Alistair Thorne',
    wins: 0,
    losses: 6,
    goal_differential: '-340',
    points: 0,
    crest_color: '#D48C45',
    roster: JSON.stringify([
      { name: 'Alistair Thorne', position: 'Seeker', broom: 'Oakleaf Pro', speedRating: 91 },
      { name: 'Thaddeus Thorne', position: 'Chaser', broom: 'Cleansweep Eleven', speedRating: 85 },
      { name: 'Bramwell Root', position: 'Chaser', broom: 'Cleansweep Eleven', speedRating: 84 },
      { name: 'Maeve Oakhaven', position: 'Chaser', broom: 'Comet 260', speedRating: 83 },
      { name: 'Orson Drake', position: 'Beater', broom: 'Broadwood V', speedRating: 87 },
      { name: 'Tobias Finch', position: 'Beater', broom: 'Broadwood V', speedRating: 85 },
      { name: 'Phoebe Vance', position: 'Keeper', broom: 'Earthwarden 2', speedRating: 88 }
    ])
  }
];

export const sportsMatches = [
  {
    id: 'match-1',
    home_team_id: 'team-gryphonhart',
    away_team_id: 'team-emberwyrm',
    match_date: '2026-10-18T14:00:00Z',
    venue: 'Skyspire Stadium',
    status: 'Completed',
    home_score: 240,
    away_score: 60,
    snitch_caught_by: 'Cedric Blackthorn'
  },
  {
    id: 'match-2',
    home_team_id: 'team-ravencrest',
    away_team_id: 'team-shadowvale',
    match_date: '2026-10-21T15:00:00Z',
    venue: 'Skyspire Stadium',
    status: 'Completed',
    home_score: 190,
    away_score: 130,
    snitch_caught_by: 'Rowan Vance'
  },
  {
    id: 'match-3',
    home_team_id: 'team-ravencrest',
    away_team_id: 'team-gryphonhart',
    match_date: '2026-11-04T14:00:00Z',
    venue: 'Skyspire Stadium',
    status: 'Scheduled',
    home_score: null,
    away_score: null,
    snitch_caught_by: null
  }
];

export const communityPosts = [
  {
    id: 'note-1',
    author_id: 'p-1',
    author_name: 'Lyra Valerius',
    house_id: 'ravencrest',
    category: 'Study Circle',
    title: 'Ancient Runes Review for Eldoria Exam',
    body: 'Meeting tonight in the West Alcove at 20:00. Bring your copper translation styluses. Herbal tea provided.',
    signature_count: 8
  },
  {
    id: 'note-2',
    author_id: 'p-2',
    author_name: 'Cedric Blackthorn',
    house_id: 'gryphonhart',
    category: 'Sports Gathering',
    title: 'Skyspire Slalom Practice Squad',
    body: 'Looking for two Chasers to practice crosswind evasions before Thursday’s gale storm. High speed guaranteed.',
    signature_count: 14
  },
  {
    id: 'note-3',
    author_id: 'p-4',
    author_name: 'Thaddeus Thorne',
    house_id: 'emberwyrm',
    category: 'Lost Artifact',
    title: 'Missing: Brass Armillary Lens',
    body: 'Misplaced near the Greenhouse 4 fountain. It whispers when pointed toward Orion. Generous reward of mandrake tea.',
    signature_count: 5
  },
  {
    id: 'note-4',
    author_id: 'p-3',
    author_name: 'Isolde Ravenshadow',
    house_id: 'shadowvale',
    category: 'Alchemical Trade',
    title: 'Trading Crushed Moonstone for Phoenix Ash',
    body: 'Have 3 drams of purified lunar dust. Looking to exchange for fresh pyrotechnic feather embers for potion finals.',
    signature_count: 7
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
    title: 'The Rune of the Whispering Shadow',
    question: 'Which Eldorian harmonic resonates through basalt stone without breaking the acoustic wards of the Grand Library?',
    options: JSON.stringify(['Vael-Thurn', 'Sil-Astra', 'Noct-Ombra', 'Ignis-Veritas']),
    correct_index: 1,
    explanation: 'Correct! Sil-Astra cancels vibration waveforms through resonance dampening.',
    difficulty: 'Arch-Mage',
    chamber: 'Acoustic Sanctum'
  },
  {
    id: 'rid-3',
    title: 'The Alignment of the Northern Crown',
    question: 'At which latitude must the brass armillary ring be fixed when Corona Noctis attains its autumn zenith?',
    options: JSON.stringify(['32° North', '45° North', '54° North', '72° North']),
    correct_index: 2,
    explanation: 'Correct! Setting the latitude dial to 54° North aligns the Spire conduit with the northern boundary wards.',
    difficulty: 'Apprentice',
    chamber: 'Stellar Observatory'
  },
  {
    id: 'rid-4',
    title: 'The Alchemical Equation of the Solstice',
    question: 'Which mineral reagent safely buffers crucible expansion when volatile dragon fire reagents are introduced?',
    options: JSON.stringify(['Crushed Moonstone', 'Shadowcap Spores', 'Mandrake Shavings', 'Silver Dewleaf']),
    correct_index: 0,
    explanation: 'Correct! Crushed Moonstone has a stability rating of +6, preventing cauldron thermal ruptures.',
    difficulty: 'Adept',
    chamber: 'Subterranean Vaults'
  }
];

export const dailySchedules = [
  {
    id: 'sched-1',
    student_id: 'student-aris-thorne',
    time_slot: '08:30 – 10:00',
    subject: 'Advanced Transfiguration',
    instructor: 'Prof. Morgana Vance',
    location: 'Tower of Shifting Stones (Floor IV)',
    status: 'Completed',
    notes: 'Mastered inanimate animus reversal charm.'
  },
  {
    id: 'sched-2',
    student_id: 'student-aris-thorne',
    time_slot: '10:30 – 12:00',
    subject: 'Ancient Runic Glyphs',
    instructor: 'Arch-Magister Valerius',
    location: 'East Scriptoria Alcove 9',
    status: 'In Progress',
    notes: 'Bring your Eldorian translation stylus.'
  },
  {
    id: 'sched-3',
    student_id: 'student-aris-thorne',
    time_slot: '13:30 – 15:00',
    subject: 'Aero-Broom Tactical Drills',
    instructor: 'Captain Torin Drake',
    location: 'Skyspire Aerial Pitch',
    status: 'Upcoming',
    notes: 'High crosswind training; weather gear required.'
  },
  {
    id: 'sched-4',
    student_id: 'student-aris-thorne',
    time_slot: '15:45 – 17:15',
    subject: 'Volatile Potion Distillation',
    instructor: 'Mistress Belladonna',
    location: 'Subterranean Alchemical Dungeon III',
    status: 'Upcoming',
    notes: 'Preparation for Draught of the Twilight Seer.'
  }
];

export const potionIngredients = [
  { id: 'ing-1', name: 'Dragon Breath Ember', potency: 8, stability: -3, color: '#E05A47', description: 'Crystallized core of fire drake flame breath.' },
  { id: 'ing-2', name: 'Crushed Moonstone', potency: 5, stability: 6, color: '#E3EEF9', description: 'Phosphorescent mineral ground during a full waxing moon.' },
  { id: 'ing-3', name: 'Silver Dewleaf', potency: 4, stability: 5, color: '#9BE0B5', description: 'Leaves harvested from the silver weeping willows of the fringe.' },
  { id: 'ing-4', name: 'Mandrake Root Shavings', potency: 6, stability: -2, color: '#C49A6C', description: 'Dried shavings of acoustic mandrake root fibers.' },
  { id: 'ing-5', name: 'Phoenix Feather Ash', potency: 9, stability: -4, color: '#F7BE4D', description: 'Pure ashes left behind after a solar rebirth ignition.' },
  { id: 'ing-6', name: 'Shadowcap Spores', potency: 7, stability: -1, color: '#7A5BA3', description: 'Volatile dark-growth fungal dust that bends refraction.' }
];

export const housePointsLogs = [
  {
    house_id: 'ravencrest',
    amount: 25,
    reason: 'Successful stabilization of Draught of Luminescence',
    awarded_by: 'Mistress Belladonna'
  },
  {
    house_id: 'gryphonhart',
    amount: 30,
    reason: 'Outstanding aerial maneuver in gale-force winds',
    awarded_by: 'Captain Torin Drake'
  },
  {
    house_id: 'shadowvale',
    amount: 20,
    reason: 'Exemplary deciphering of ancient ward scripts',
    awarded_by: 'Arch-Magister Valerius'
  },
  {
    house_id: 'emberwyrm',
    amount: 15,
    reason: 'Harvesting rare lunar nightshade without injury',
    awarded_by: 'Elder Rosemary Vance'
  }
];

export const communities = [
  {
    id: 'comm-1',
    name: 'The Arithmancy & Runic Circle',
    description: 'Scholarly guild dedicated to deciphering pre-Eldorian glyphs and astral geometric projections.',
    category: 'Study Circle',
    house_id: 'ravencrest',
    member_count: 28,
    icon_name: 'BookOpen',
    is_joined: 1
  },
  {
    id: 'comm-2',
    name: 'Skyspire Aero-Tactics League',
    description: 'Competitive aeromancers and broom racers analyzing wind shear vectors and high-speed maneuvers.',
    category: 'Aero-Athletics',
    house_id: 'gryphonhart',
    member_count: 42,
    icon_name: 'Trophy',
    is_joined: 0
  },
  {
    id: 'comm-3',
    name: 'Nocturnal Alchemical Brewers Guild',
    description: 'Experimental potioneers testing lunar distillation, crucible heat regulation, and philtre stability.',
    category: 'Potion Craft',
    house_id: 'shadowvale',
    member_count: 31,
    icon_name: 'Sparkles',
    is_joined: 0
  },
  {
    id: 'comm-4',
    name: 'Botanical & Symbiosis Society',
    description: 'Wardens of the carnivorous greenhouses, mandrake propagation, and rare bioluminescent fungi.',
    category: 'Herbology',
    house_id: 'emberwyrm',
    member_count: 24,
    icon_name: 'Flame',
    is_joined: 0
  },
  {
    id: 'comm-5',
    name: 'Order of the Golden Quill',
    description: 'Inter-house philosophical debate, enchanted parchment chronicles, and legal wizarding treaties.',
    category: 'Scholarly Debate',
    house_id: null,
    member_count: 36,
    icon_name: 'Shield',
    is_joined: 1
  }
];

export const communityReplies = [
  {
    id: 'rep-1',
    post_id: 'note-1',
    author_id: 'student-aris-thorne',
    author_name: 'Aris Thorne',
    house_id: 'ravencrest',
    body: 'I will bring the obsidian astrolabe lens to compare with the glyph table.'
  },
  {
    id: 'rep-2',
    post_id: 'note-1',
    author_id: 'p-5',
    author_name: 'Elowen Frost',
    house_id: 'ravencrest',
    body: 'Save a seat near the brazier for me; I have notes on the 3rd stela from yesterday.'
  },
  {
    id: 'rep-3',
    post_id: 'note-2',
    author_id: 'p-7',
    author_name: 'Rowan Vance',
    house_id: 'gryphonhart',
    body: 'Count me in for Thursday slalom drills. Let us test the Hawk-wing 360 formation.'
  }
];

