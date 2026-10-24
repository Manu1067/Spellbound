-- ============================================================================
-- SPELLBOUND ACADEMY — ENHANCED RELATIONAL DATABASE SCHEMA (SQLite)
-- Seven Departments & Core Student Architecture
-- ============================================================================

-- 1. HOUSES OF SPELLBOUND (Traditional & Lore)
CREATE TABLE IF NOT EXISTS houses (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  motto TEXT NOT NULL,
  core_values TEXT NOT NULL, -- JSON string array
  points INTEGER NOT NULL DEFAULT 0,
  crest_color TEXT NOT NULL,
  accent_color TEXT NOT NULL,
  animal TEXT NOT NULL,
  gem TEXT NOT NULL,
  head_of_house TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. HOUSE POINTS LOG
CREATE TABLE IF NOT EXISTS house_points_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  house_id TEXT NOT NULL REFERENCES houses(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  awarded_by TEXT NOT NULL,
  awarded_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. STUDENT CLUBS (Literary & Debating, Music, Dance, Fine Arts)
CREATE TABLE IF NOT EXISTS clubs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  lead_coordinator TEXT NOT NULL,
  meeting_schedule TEXT NOT NULL,
  activities TEXT NOT NULL, -- JSON array
  icon_name TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. STUDENTS & ADEPT DOSSIERS
CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  house_id TEXT NOT NULL REFERENCES houses(id) ON DELETE RESTRICT,
  year TEXT NOT NULL,
  title TEXT NOT NULL,
  branch TEXT NOT NULL DEFAULT 'Computer Science & Arcana',
  languages TEXT NOT NULL DEFAULT '["English"]', -- JSON array
  hobbies TEXT NOT NULL DEFAULT '["Broom Flight"]', -- JSON array
  fields_of_interest TEXT NOT NULL DEFAULT '["Chronomancy"]', -- JSON array
  skills TEXT NOT NULL DEFAULT '["Spell Scripting"]', -- JSON array
  wand TEXT NOT NULL,
  patronus TEXT NOT NULL,
  fav_subject TEXT NOT NULL,
  bio TEXT NOT NULL,
  avatar_url TEXT,
  points_contributed INTEGER DEFAULT 0,
  academic_rank TEXT,
  is_current_user INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. LOCATIONS & CAMPUS CARTOGRAPHY (Academic Building, Girls' Hostel, Boys' Hostel, Mess, Cafeteria)
CREATE TABLE IF NOT EXISTS locations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  zone TEXT NOT NULL, -- 'Academic', 'Residential', 'Dining', 'Recreational', 'Restricted'
  description TEXT NOT NULL,
  highlights TEXT NOT NULL, -- JSON array
  danger_level TEXT NOT NULL,
  coord_x INTEGER NOT NULL,
  coord_y INTEGER NOT NULL,
  is_secret INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. CAMPUS PATHWAYS (Graph Edges for Dijkstra Routing)
CREATE TABLE IF NOT EXISTS pathways (
  id TEXT PRIMARY KEY,
  from_location_id TEXT NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  to_location_id TEXT NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  path_type TEXT NOT NULL DEFAULT 'Corridor',
  distance_meters INTEGER NOT NULL DEFAULT 100,
  is_unlocked INTEGER DEFAULT 1,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 7. LABORATORIES (Mechanical, Physics, C2S, Electronics, Computer)
CREATE TABLE IF NOT EXISTS laboratories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  location_id TEXT REFERENCES locations(id),
  faculty_in_charge TEXT NOT NULL,
  available_equipment TEXT NOT NULL, -- JSON array
  safety_guidelines TEXT NOT NULL, -- JSON array
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 8. LABORATORY RESOURCES & MANUALS
CREATE TABLE IF NOT EXISTS lab_resources (
  id TEXT PRIMARY KEY,
  lab_id TEXT NOT NULL REFERENCES laboratories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- 'Manuals', 'Experiment Guides', 'Reference Materials', 'Tutorials'
  description TEXT,
  file_size TEXT,
  download_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 9. COURSES & ACADEMIC SYLLABI
CREATE TABLE IF NOT EXISTS courses (
  code TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  instructor TEXT NOT NULL,
  term TEXT NOT NULL,
  credits INTEGER DEFAULT 3,
  description TEXT NOT NULL,
  location_id TEXT REFERENCES locations(id) ON DELETE SET NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 10. LEARNING RESOURCES & GRIMOIRES
CREATE TABLE IF NOT EXISTS learning_resources (
  id TEXT PRIMARY KEY,
  course_code TEXT NOT NULL REFERENCES courses(code) ON DELETE CASCADE,
  title TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  author TEXT NOT NULL,
  rarity TEXT DEFAULT 'Standard',
  content_snippet TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 11. CAMPUS EVENTS & GALAS
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  club_id TEXT REFERENCES clubs(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  date_time TEXT NOT NULL,
  location_id TEXT REFERENCES locations(id) ON DELETE SET NULL,
  location_name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  rsvp_count INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 12. EVENT REGISTRATIONS (RSVP)
CREATE TABLE IF NOT EXISTS event_registrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(event_id, student_id)
);

-- 13. SPORTS DISCIPLINES (Outdoor & Indoor)
CREATE TABLE IF NOT EXISTS sports_disciplines (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL, -- 'Outdoor' | 'Indoor'
  description TEXT NOT NULL,
  team_size TEXT NOT NULL,
  venue TEXT NOT NULL,
  equipment TEXT NOT NULL,
  rules_summary TEXT NOT NULL,
  icon_name TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 14. SPORTS TEAMS & CLUBS
CREATE TABLE IF NOT EXISTS sports_teams (
  id TEXT PRIMARY KEY,
  sport_id TEXT REFERENCES sports_disciplines(id),
  name TEXT NOT NULL UNIQUE,
  house_id TEXT REFERENCES houses(id) ON DELETE CASCADE,
  captain TEXT NOT NULL,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  goal_differential TEXT DEFAULT '+0',
  points INTEGER DEFAULT 0,
  crest_color TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 15. SPORTS MATCHES & FIXTURES
CREATE TABLE IF NOT EXISTS sports_matches (
  id TEXT PRIMARY KEY,
  sport_id TEXT REFERENCES sports_disciplines(id),
  home_team_id TEXT NOT NULL REFERENCES sports_teams(id) ON DELETE CASCADE,
  away_team_id TEXT NOT NULL REFERENCES sports_teams(id) ON DELETE CASCADE,
  match_date TEXT NOT NULL,
  venue TEXT NOT NULL DEFAULT 'Campus Sports Complex',
  status TEXT NOT NULL DEFAULT 'Scheduled',
  home_score INTEGER DEFAULT NULL,
  away_score INTEGER DEFAULT NULL,
  snitch_caught_by TEXT DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 16. SPORTS REGISTRATIONS / INTEREST
CREATE TABLE IF NOT EXISTS sports_registrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  sport_id TEXT NOT NULL REFERENCES sports_disciplines(id) ON DELETE CASCADE,
  experience_level TEXT NOT NULL, -- 'Beginner', 'Intermediate', 'Advanced', 'Varsity'
  preferred_role TEXT,
  contact_note TEXT,
  registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, sport_id)
);

-- 17. COMMUNITY NOTICES (COMMON ROOM HEARTH)
CREATE TABLE IF NOT EXISTS community_posts (
  id TEXT PRIMARY KEY,
  author_id TEXT REFERENCES students(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  house_id TEXT NOT NULL REFERENCES houses(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  signature_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 18. COMMUNITY POST SIGNATURES
CREATE TABLE IF NOT EXISTS community_signatures (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id TEXT NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  signed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(post_id, student_id)
);

-- 19. STUDENT COUNCIL DIRECTORY & ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS student_council (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL,
  student_name TEXT NOT NULL,
  branch TEXT NOT NULL,
  office_hours TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  avatar_url TEXT,
  announcements TEXT NOT NULL DEFAULT '[]', -- JSON array
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 20. COMPLAINTS (Department of Mysteries - Confidential Grievance Tracking)
CREATE TABLE IF NOT EXISTS complaints (
  id TEXT PRIMARY KEY, -- e.g. 'REF-MYST-1042'
  student_id TEXT REFERENCES students(id) ON DELETE SET NULL,
  category TEXT NOT NULL, -- 'Hostel', 'Mess/Food', 'Academics', 'Infrastructure', 'Library', 'Sports', 'General'
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'Routine', -- 'Routine', 'Urgent', 'Critical'
  status TEXT NOT NULL DEFAULT 'Under Review', -- 'Submitted', 'Under Review', 'Investigating', 'Resolved'
  is_confidential INTEGER NOT NULL DEFAULT 1,
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 21. CONFESSIONS (Department of Mysteries - Anonymous Moderated Forum)
CREATE TABLE IF NOT EXISTS confessions (
  id TEXT PRIMARY KEY,
  message TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  status TEXT NOT NULL DEFAULT 'Approved', -- 'Pending', 'Approved', 'Flagged'
  likes_count INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 22. FUTURE WARNINGS & OFFICIAL NOTICES (Department of Mysteries)
CREATE TABLE IF NOT EXISTS official_notices (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- 'Official Warning', 'Academic Deadline', 'Administrative Notice', 'Campus Directive'
  message TEXT NOT NULL,
  publication_date TEXT NOT NULL,
  expiry_date TEXT,
  priority TEXT NOT NULL DEFAULT 'Normal', -- 'Low', 'Normal', 'High', 'Urgent'
  issuing_authority TEXT NOT NULL,
  is_verified INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 23. MYSTERY PUZZLES & CIPHERS (Chronomancy Vault)
CREATE TABLE IF NOT EXISTS mystery_puzzles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  question TEXT NOT NULL,
  options TEXT NOT NULL, -- JSON array
  correct_index INTEGER NOT NULL,
  explanation TEXT NOT NULL,
  difficulty TEXT DEFAULT 'Adept',
  chamber TEXT DEFAULT 'Chronomancy Vault',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 24. MYSTERY RESOURCE RECORDS & ATTEMPTS
CREATE TABLE IF NOT EXISTS mystery_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  puzzle_id TEXT NOT NULL REFERENCES mystery_puzzles(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  selected_index INTEGER NOT NULL,
  is_correct INTEGER NOT NULL,
  attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 25. DAILY SCHEDULE
CREATE TABLE IF NOT EXISTS daily_schedules (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  time_slot TEXT NOT NULL,
  subject TEXT NOT NULL,
  instructor TEXT NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Upcoming',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 26. POTION INGREDIENTS (Experimental Brewing Lab)
CREATE TABLE IF NOT EXISTS potion_ingredients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  potency INTEGER NOT NULL,
  stability INTEGER NOT NULL,
  color TEXT NOT NULL,
  description TEXT
);

-- 27. OWL DISPATCH SYSTEM
CREATE TABLE IF NOT EXISTS owl_dispatches (
  id TEXT PRIMARY KEY,
  sender_id TEXT REFERENCES students(id) ON DELETE SET NULL,
  sender_name TEXT NOT NULL,
  recipient_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'Dispatched',
  dispatched_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_students_house ON students(house_id);
CREATE INDEX IF NOT EXISTS idx_students_branch ON students(branch);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date_time);
CREATE INDEX IF NOT EXISTS idx_locations_zone ON locations(zone);
CREATE INDEX IF NOT EXISTS idx_pathways_from ON pathways(from_location_id);
CREATE INDEX IF NOT EXISTS idx_pathways_to ON pathways(to_location_id);
CREATE INDEX IF NOT EXISTS idx_lab_resources_lab ON lab_resources(lab_id);
CREATE INDEX IF NOT EXISTS idx_sports_category ON sports_disciplines(category);
CREATE INDEX IF NOT EXISTS idx_complaints_student ON complaints(student_id);
CREATE INDEX IF NOT EXISTS idx_notices_priority ON official_notices(priority);
