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
    is_current_user: 1
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
    is_current_user: 0
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
    is_current_user: 0
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
    is_current_user: 0
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
    is_current_user: 0
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
    is_current_user: 0
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
    is_current_user: 0
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
    is_unlocked: 1,
    description: 'Connects the Great Hall to the Grand Library; shifts orientation every half hour.'
  },
  {
    id: 'path-2',
    from_location_id: 'loc-2',
    to_location_id: 'loc-3',
    name: 'Spire Winding Spiral',
    path_type: 'Corridor',
    is_unlocked: 1,
    description: 'Ascends 400 stone steps from the Library scriptoria to the starry pinnacle.'
  },
  {
    id: 'path-3',
    from_location_id: 'loc-1',
    to_location_id: 'loc-5',
    name: 'Basalt Cellar Descent',
    path_type: 'Corridor',
    is_unlocked: 1,
    description: 'Chilly granite passageway leading to the potion dungeon vaults.'
  },
  {
    id: 'path-4',
    from_location_id: 'loc-1',
    to_location_id: 'loc-4',
    name: 'Gorge Suspension Skybridge',
    path_type: 'Skybridge',
    is_unlocked: 1,
    description: 'Arched stone bridge spanning the windy gorge to the Skyspire pitch.'
  },
  {
    id: 'path-5',
    from_location_id: 'loc-5',
    to_location_id: 'loc-7',
    name: 'Shadow Runic Vault Passage',
    path_type: 'Secret Passage',
    is_unlocked: 0,
    description: 'Hidden behind a tapestry of the Solstice Serpent, requiring the Chronos Cipher.'
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
    course_code: 'ALCH-520',
    title: 'The Alchemist’s Vade Mecum',
    resource_type: 'Potion Recipe',
    author: 'Mistress Belladonna',
    rarity: 'Restricted',
    content_snippet: 'Precision instructions for distilling volatile lunar extracts without cauldron rupture.'
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
    crest_color: 'var(--burgundy-light)'
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
    crest_color: 'var(--antique-gold)'
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
    crest_color: '#79C2A4'
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
    crest_color: '#D48C45'
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
