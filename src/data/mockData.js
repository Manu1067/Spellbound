// Centralized Lore & Demo Data for Spellbound

export const currentUser = {
  id: "student-aris-thorne",
  name: "Aris Thorne",
  title: "Scholar of Celestial Arithmancy",
  house: "Ravencrest",
  houseColor: "var(--deep-blue)",
  houseAccent: "var(--antique-gold)",
  year: "Fifth Year · Senior Adept",
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
    description: "Navigate the living castle through enchanted parchment maps, secret corridors, and celestial spires.",
    iconName: "Compass",
    accentColor: "#D6B46A",
    bannerSnippet: "Parchment maps, golden pathways & compass guidance",
    tag: "Campus Cartography"
  },
  {
    id: "people",
    title: "People of the Wizarding World",
    slug: "/people",
    description: "Discover fellow adepts, revered arch-magisters, and notable wizards through ornate enchanted portraits.",
    iconName: "Users",
    accentColor: "#79C2A4",
    bannerSnippet: "Gilded portraits, lineage records & magical companions",
    tag: "Student Directory"
  },
  {
    id: "sports",
    title: "Sports Department",
    slug: "/sports",
    description: "Track aerial broomstick leagues, arena tournament standings, flight wind vectors, and match fixtures.",
    iconName: "Trophy",
    accentColor: "#E288A1",
    bannerSnippet: "Skyspire tournaments, speed telemetry & flight drills",
    tag: "Aero-Athletics"
  },
  {
    id: "academics",
    title: "Academics & Magical Labs",
    slug: "/academics",
    description: "Master the ancient curricula, brew volatile potion elixirs in the lab, and decipher runic glyphs.",
    iconName: "BookOpen",
    accentColor: "#4E8A71",
    bannerSnippet: "Grimoires, alchemical cauldrons & rune translation",
    tag: "Curriculum & Labs"
  },
  {
    id: "common-room",
    title: "Wizarding Social Network",
    slug: "/common-room",
    description: "Gather by the crackling hearth fire, post parchment notices, find study circles, and converse with peers.",
    iconName: "Flame",
    accentColor: "#D48C45",
    bannerSnippet: "Hearthside fellowship, quill notices & study circles",
    tag: "Community Hearth"
  },
  {
    id: "houses-events",
    title: "Houses & Events",
    slug: "/houses-events",
    description: "Witness the jewel hourglasses of the Four Great Houses, ceremonial balls, and seasonal festivals.",
    iconName: "Shield",
    accentColor: "#AA8438",
    bannerSnippet: "House points hourglasses, crest banners & campus galas",
    tag: "House Cup & Galas"
  },
  {
    id: "mysteries",
    title: "Department of Mysteries",
    slug: "/mysteries",
    description: "Delve into the subterranean archives, decipher chronomancy enigmas, and map the constellations.",
    iconName: "Sparkles",
    accentColor: "#9B4D64",
    bannerSnippet: "Chronomancy dials, stellar spheres & arcane riddles",
    tag: "Restricted Vault"
  }
];

export const housesData = [
  {
    id: "ravencrest",
    name: "Ravencrest",
    motto: "Wisdom through Starlit Inquiry",
    values: ["Intellect", "Astronomy", "Rune Craft", "Perception"],
    points: 1420,
    crestColor: "#151D35",
    accentColor: "#D6B46A",
    animal: "Gilded Raven",
    gem: "Sapphire Dust",
    headOfHouse: "Arch-Magister Valerius"
  },
  {
    id: "gryphonhart",
    name: "Gryphonhart",
    motto: "Valor Across the Winds of Peril",
    values: ["Bravery", "Aero-Flight", "Honor", "Dueling"],
    points: 1385,
    crestColor: "#6D3345",
    accentColor: "#E9D9B7",
    animal: "Sky Gryphon",
    gem: "Spinel Ruby",
    headOfHouse: "Mistress Helena Thorne"
  },
  {
    id: "shadowvale",
    name: "Shadowvale",
    motto: "Subtlety Masters the Deepest Shadow",
    values: ["Ambition", "Potions", "Shadow Arts", "Resourcefulness"],
    points: 1410,
    crestColor: "#315C4A",
    accentColor: "#E9D9B7",
    animal: "Emerald Serpent",
    gem: "Deep Emerald",
    headOfHouse: "Professor Corvin Sallow"
  },
  {
    id: "emberwyrm",
    name: "Emberwyrm",
    motto: "Steadfast as the Root, Warm as the Flame",
    values: ["Loyalty", "Herbology", "Elemental Alchemy", "Patience"],
    points: 1320,
    crestColor: "#82461D",
    accentColor: "#F6F0E4",
    animal: "Fire Drake",
    gem: "Citrine Amber",
    headOfHouse: "Elder Rosemary Vance"
  }
];

export const dailySchedule = [
  {
    id: "sched-1",
    time: "08:30 – 10:00",
    subject: "Advanced Transfiguration",
    instructor: "Prof. Morgana Vance",
    location: "Tower of Shifting Stones (Floor IV)",
    status: "Completed",
    notes: "Mastered inanimate animus reversal charm."
  },
  {
    id: "sched-2",
    time: "10:30 – 12:00",
    subject: "Ancient Runic Glyphs",
    instructor: "Arch-Magister Valerius",
    location: "East Scriptoria Alcove 9",
    status: "In Progress",
    notes: "Bring your Eldorian translation stylus."
  },
  {
    id: "sched-3",
    time: "13:30 – 15:00",
    subject: "Aero-Broom Tactical Drills",
    instructor: "Captain Torin Drake",
    location: "Skyspire Aerial Pitch",
    status: "Upcoming",
    notes: "High crosswind training; weather gear required."
  },
  {
    id: "sched-4",
    time: "15:45 – 17:15",
    subject: "Volatile Potion Distillation",
    instructor: "Mistress Belladonna",
    location: "Subterranean Alchemical Dungeon III",
    status: "Upcoming",
    notes: "Preparation for Draught of the Twilight Seer."
  }
];

export const campusEvents = [
  {
    id: "evt-1",
    title: "Celestial Solstice Ball",
    date: "Dec 21 · 19:00",
    location: "The Grand Starry Hall",
    category: "Gala & Feast",
    rsvpCount: 248,
    isRsvp: true,
    description: "Annual gala celebrating the winter solstice under levitating ice sculptures and enchanted choral melodies."
  },
  {
    id: "evt-2",
    title: "Inter-House Aero-Broom Derby",
    date: "Nov 04 · 14:00",
    location: "Skyspire Stadium",
    category: "Championship",
    rsvpCount: 312,
    isRsvp: false,
    description: "Ravencrest vs. Gryphonhart in the Autumn season final. Expect aerial tactical speed maneuvers."
  },
  {
    id: "evt-3",
    title: "Midnight Observatory Astral Conjunction",
    date: "Nov 12 · 23:30",
    location: "Astronomy Spire Pinnacle",
    category: "Academic",
    rsvpCount: 89,
    isRsvp: true,
    description: "Planetary alignment of Saturn and Orion. Rare opportunity to observe astral ley line pulses."
  }
];

export const studentDirectory = [
  {
    id: "p-1",
    name: "Lyra Valerius",
    house: "Ravencrest",
    year: "6th Year · Prefect",
    title: "Master of Runic Geometry",
    wand: "12 in · Rowan · Unicorn Tail Hair",
    patronus: "Silver Falcon",
    favSubject: "Ancient Runes",
    bio: "Chief researcher of the Eldorian Astrolabe and author of three peer scrolls on celestial navigation."
  },
  {
    id: "p-2",
    name: "Cedric Blackthorn",
    house: "Gryphonhart",
    year: "5th Year",
    title: "Seeker & Skyspire Captain",
    wand: "11 in · English Oak · Dragon Heartstring",
    patronus: "Snow Leopard",
    favSubject: "Aero-Tactics",
    bio: "Record holder for the fastest Snitch capture at 3 minutes and 14 seconds across misty gust conditions."
  },
  {
    id: "p-3",
    name: "Isolde Ravenshadow",
    house: "Shadowvale",
    year: "7th Year",
    title: "Alchemical Prodigy",
    wand: "13 in · Yew · Thestral Hair Core",
    patronus: "Viper of the Mist",
    favSubject: "Subterranean Potions",
    bio: "Apprentice to Mistress Belladonna, specializing in memory extraction and nocturnal botanical catalysts."
  },
  {
    id: "p-4",
    name: "Thaddeus Thorne",
    house: "Emberwyrm",
    year: "4th Year",
    title: "Keeper of Herbological Groves",
    wand: "10½ in · Willow · Phoenix Plume",
    patronus: "Golden Badger",
    favSubject: "Magical Botany",
    bio: "Curates the carnivorous orchid greenhouse and crafts medicinal tonics for the hospital wing."
  },
  {
    id: "p-5",
    name: "Elowen Frost",
    house: "Ravencrest",
    year: "5th Year",
    title: "Star-Weaver & Diviner",
    wand: "11¼ in · Silver Birch · Kelpie Mane",
    patronus: "Luminescent Swan",
    favSubject: "Chronomancy & Astronomy",
    bio: "Spends nocturnal hours plotting lunar eclipses and mapping rogue meteors through brass astrolabes."
  },
  {
    id: "p-6",
    name: "Arch-Magister Valerius",
    house: "Ravencrest",
    year: "Faculty Head",
    title: "Dean of Runic Linguistics",
    wand: "14 in · Ancient Ebony · Phoenix Feather",
    patronus: "Crown Raven",
    favSubject: "All Arcane Disciplines",
    bio: "Over three centuries of dedicated scholarship deciphering lost magical tongues and ancient academy wards."
  }
];

export const campusLocations = [
  {
    id: "loc-1",
    name: "The Great Hall",
    zone: "Central Keep",
    description: "The grand ceremonial heart of the castle, sheltered beneath an enchanted ceiling reflecting the nocturnal sky and warmed by four roaring hearths.",
    highlights: ["Enchanted Starry Ceiling", "House Hourglasses", "High Table of Masters", "Floating Candelabras"],
    dangerLevel: "Peaceful",
    coords: { x: 50, y: 56 }
  },
  {
    id: "loc-2",
    name: "The Grand Library & Scriptoria",
    zone: "North Wing",
    description: "A labyrinth of towering mahogany shelves containing 200,000 levitating grimoires, self-transcribing quills, and whisper-warded study carrels.",
    highlights: ["The Restricted Vault", "Self-Returning Tomes", "Whispering Gallery", "Manuscript Restorers"],
    dangerLevel: "Mild Caution",
    coords: { x: 38, y: 35 }
  },
  {
    id: "loc-3",
    name: "Astronomy Spire Pinnacle",
    zone: "Sky Pinnacles",
    description: "The highest tower in the castle, piercing the night clouds. Hosts monumental brass armillary spheres and lenses aimed at deep celestial matrices.",
    highlights: ["The Great Brass Armillary", "Constellation Viewers", "Wind-Ward Platforms", "Meteor Sundials"],
    dangerLevel: "High Altitude",
    coords: { x: 65, y: 22 }
  },
  {
    id: "loc-4",
    name: "Skyspire Aerial Arena",
    zone: "South Chasm",
    description: "Suspended over a deep mountain gorge, featuring emerald turf floating on repulsion runes and three towering golden ring goals.",
    highlights: ["Hovering Goal Rings", "Spectator Turrets", "Wind-Vector Flags", "Broomstick Launching Bay"],
    dangerLevel: "Acrobatic Thrill",
    coords: { x: 78, y: 70 }
  },
  {
    id: "loc-5",
    name: "Alchemical Dungeons",
    zone: "Subterranean Vaults",
    description: "Vaulted stone cellars carved directly into mountain basalt, cool and echoing with the bubbling of pewter cauldrons and pungent herb fumes.",
    highlights: ["Simmering Cauldrons", "Rare Specimen Vaults", "Distillation Stills", "Flame-Tempered Desks"],
    dangerLevel: "Volatile Chemicals",
    coords: { x: 32, y: 75 }
  },
  {
    id: "loc-6",
    name: "The Forbidden Woods Fringe",
    zone: "Outer Periphery",
    description: "Ancient dense canopy of silver fir and weeping willow where wild magic pools in mossy hollows, guarded by mystical guardians.",
    highlights: ["Luminescent Mushrooms", "Silver Springs", "Unicorn Clearings", "Ancient Boundary Stones"],
    dangerLevel: "Strictly Restricted After Dusk",
    coords: { x: 18, y: 48 }
  }
];

export const notificationsList = [
  {
    id: "notif-1",
    title: "Restricted Vault Maintenance",
    source: "Grand Library Scribe",
    time: "20 min ago",
    read: false,
    content: "The Seventh Aisle of Chronomancy is sealed tonight for ward calibration. Inquiries should be sent to Master Valerius."
  },
  {
    id: "notif-2",
    title: "Wind Warning for Aerial Drills",
    source: "Aero-Sports Dept",
    time: "1 hour ago",
    read: false,
    content: "Gusts from the Northern Chasm have reached 38 knots. Lightweight brooms must engage stabilizer charms."
  },
  {
    id: "notif-3",
    title: "House Points Awarded (+25)",
    source: "Potions Guild",
    time: "3 hours ago",
    read: true,
    content: "Aris Thorne successfully stabilized the Draught of Luminescence, contributing 25 points to Ravencrest."
  },
  {
    id: "notif-4",
    title: "Celestial Ball Invitations Dispatched",
    source: "Office of Ceremonies",
    time: "Yesterday",
    read: true,
    content: "Gala passes for the Winter Solstice Ball have materialized in student dormitories."
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
