-- ============================================================================
-- SPELLBOUND ACADEMY — DATABASE SCHEMA (SQLite)
-- Phase 2A: Backend, Database and API Foundation
-- ============================================================================

-- 1. HOUSES OF SPELLBOUND
CREATE TABLE IF NOT EXISTS houses (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  motto TEXT NOT NULL,
  core_values TEXT NOT NULL, -- JSON string array of core house values
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

-- 3. STUDENTS & ADEPT DOSSIERS
CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  house_id TEXT NOT NULL REFERENCES houses(id) ON DELETE RESTRICT,
  year TEXT NOT NULL,
  title TEXT NOT NULL,
  wand TEXT NOT NULL,
  patronus TEXT NOT NULL,
  fav_subject TEXT NOT NULL,
  bio TEXT NOT NULL,
  avatar_url TEXT,
  points_contributed INTEGER DEFAULT 0,
  academic_rank TEXT,
  is_current_user INTEGER DEFAULT 0,
  skills TEXT DEFAULT '[]', -- JSON string array of adept skills
  interests TEXT DEFAULT '[]', -- JSON string array of magical interests
  project_experience TEXT DEFAULT '', -- Description of past magical projects
  is_mentor INTEGER DEFAULT 0, -- 1 if qualified student mentor, 0 otherwise
  role TEXT DEFAULT 'Senior Adept', -- 'Senior Adept', 'Prefect', 'Researcher', 'Team Captain'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. LOCATIONS & CASTLE CARTOGRAPHY
CREATE TABLE IF NOT EXISTS locations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  zone TEXT NOT NULL,
  description TEXT NOT NULL,
  highlights TEXT NOT NULL, -- JSON string array of location highlights
  danger_level TEXT NOT NULL,
  coord_x INTEGER NOT NULL,
  coord_y INTEGER NOT NULL,
  is_secret INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. LEY-LINE PATHWAYS & CORRIDORS
CREATE TABLE IF NOT EXISTS pathways (
  id TEXT PRIMARY KEY,
  from_location_id TEXT NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  to_location_id TEXT NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  path_type TEXT NOT NULL DEFAULT 'Corridor', -- 'Corridor', 'Moving Staircase', 'Secret Passage', 'Skybridge'
  distance INTEGER DEFAULT 15, -- Distance in paces / transit cost
  is_unlocked INTEGER DEFAULT 1,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. COURSES & ACADEMIC SYLLABI
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

-- 7. LEARNING RESOURCES & GRIMOIRES
CREATE TABLE IF NOT EXISTS learning_resources (
  id TEXT PRIMARY KEY,
  course_code TEXT NOT NULL REFERENCES courses(code) ON DELETE CASCADE,
  title TEXT NOT NULL,
  resource_type TEXT NOT NULL, -- 'Scroll', 'Grimoire', 'Potion Recipe', 'Runic Tablet'
  author TEXT NOT NULL,
  rarity TEXT DEFAULT 'Standard', -- 'Standard', 'Rare', 'Restricted'
  content_snippet TEXT,
  subject TEXT,
  topic TEXT,
  difficulty TEXT DEFAULT 'Adept',
  study_notes TEXT,
  chamber TEXT DEFAULT 'Grand Scriptoria',
  citation TEXT,
  is_approved INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 8. CAMPUS EVENTS & GALAS
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  date_time TEXT NOT NULL,
  location_id TEXT REFERENCES locations(id) ON DELETE SET NULL,
  location_name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  rsvp_count INTEGER DEFAULT 0,
  capacity INTEGER DEFAULT 50, -- Max RSVP capacity
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 9. EVENT REGISTRATIONS (RSVP)
CREATE TABLE IF NOT EXISTS event_registrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(event_id, student_id)
);

-- 10. SPORTS TEAMS (SKYSPIRE BROOMSTICK LEAGUE)
CREATE TABLE IF NOT EXISTS sports_teams (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  house_id TEXT NOT NULL REFERENCES houses(id) ON DELETE CASCADE,
  captain TEXT NOT NULL,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  goal_differential TEXT DEFAULT '+0',
  points INTEGER DEFAULT 0,
  crest_color TEXT,
  roster TEXT DEFAULT '[]', -- JSON string array of players with positions & stats
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 11. SPORTS MATCHES & FIXTURES
CREATE TABLE IF NOT EXISTS sports_matches (
  id TEXT PRIMARY KEY,
  home_team_id TEXT NOT NULL REFERENCES sports_teams(id) ON DELETE CASCADE,
  away_team_id TEXT NOT NULL REFERENCES sports_teams(id) ON DELETE CASCADE,
  match_date TEXT NOT NULL,
  venue TEXT NOT NULL DEFAULT 'Skyspire Stadium',
  status TEXT NOT NULL DEFAULT 'Scheduled', -- 'Scheduled', 'In Progress', 'Completed'
  home_score INTEGER DEFAULT NULL,
  away_score INTEGER DEFAULT NULL,
  snitch_caught_by TEXT DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 12. COMMUNITY NOTICES (COMMON ROOM HEARTH)
CREATE TABLE IF NOT EXISTS community_posts (
  id TEXT PRIMARY KEY,
  author_id TEXT REFERENCES students(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  house_id TEXT NOT NULL REFERENCES houses(id) ON DELETE CASCADE,
  category TEXT NOT NULL, -- 'Study Circle', 'Sports Gathering', 'Lost Artifact', 'Alchemical Trade'
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  signature_count INTEGER DEFAULT 0,
  is_reported INTEGER DEFAULT 0, -- 1 if reported to Prefect/Moderator
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 13. COMMUNITY POST SIGNATURES
CREATE TABLE IF NOT EXISTS community_signatures (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id TEXT NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  signed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(post_id, student_id)
);

-- 13B. COMMUNITY DISCUSSION REPLIES (THREADED HEARTH TALK)
CREATE TABLE IF NOT EXISTS community_replies (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  author_id TEXT REFERENCES students(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  house_id TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 13C. COMMUNITY CIRCLES & SOCIETIES
CREATE TABLE IF NOT EXISTS communities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  house_id TEXT REFERENCES houses(id) ON DELETE SET NULL,
  member_count INTEGER DEFAULT 12,
  icon_name TEXT DEFAULT 'Flame',
  is_joined INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 13D. STUDENT QUIZ PROGRESS & MASTERY
CREATE TABLE IF NOT EXISTS student_quizzes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  quiz_id TEXT NOT NULL,
  course_code TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  passed INTEGER DEFAULT 1,
  completed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 13E. POTION LAB BREW JOURNAL
CREATE TABLE IF NOT EXISTS potion_brews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  potion_name TEXT NOT NULL,
  potency INTEGER NOT NULL,
  stability INTEGER NOT NULL,
  outcome TEXT NOT NULL,
  brewed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 14. MYSTERY PUZZLES & CIPHERS (DEPARTMENT OF MYSTERIES)
CREATE TABLE IF NOT EXISTS mystery_puzzles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  question TEXT NOT NULL,
  options TEXT NOT NULL, -- JSON string array
  correct_index INTEGER NOT NULL,
  explanation TEXT NOT NULL,
  difficulty TEXT DEFAULT 'Adept', -- 'Apprentice', 'Adept', 'Arch-Mage'
  chamber TEXT DEFAULT 'Chronomancy Vault',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 15. MYSTERY RESOURCE RECORDS & ATTEMPTS
CREATE TABLE IF NOT EXISTS mystery_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  puzzle_id TEXT NOT NULL REFERENCES mystery_puzzles(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  selected_index INTEGER NOT NULL,
  is_correct INTEGER NOT NULL,
  attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 16. DAILY SCHEDULE
CREATE TABLE IF NOT EXISTS daily_schedules (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  time_slot TEXT NOT NULL,
  subject TEXT NOT NULL,
  instructor TEXT NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Upcoming', -- 'Upcoming', 'In Progress', 'Completed'
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 17. POTION INGREDIENTS (ALCHEMICAL LAB)
CREATE TABLE IF NOT EXISTS potion_ingredients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  potency INTEGER NOT NULL,
  stability INTEGER NOT NULL,
  color TEXT NOT NULL,
  description TEXT
);

-- 18. OWL DISPATCH SYSTEM
CREATE TABLE IF NOT EXISTS owl_dispatches (
  id TEXT PRIMARY KEY,
  sender_id TEXT REFERENCES students(id) ON DELETE SET NULL,
  sender_name TEXT NOT NULL,
  recipient_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'Dispatched', -- 'Dispatched', 'Delivered'
  dispatched_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE AND FAST LOOKUPS
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_students_house ON students(house_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date_time);
CREATE INDEX IF NOT EXISTS idx_locations_zone ON locations(zone);
CREATE INDEX IF NOT EXISTS idx_community_posts_category ON community_posts(category);
CREATE INDEX IF NOT EXISTS idx_community_posts_house ON community_posts(house_id);
CREATE INDEX IF NOT EXISTS idx_pathways_from ON pathways(from_location_id);
CREATE INDEX IF NOT EXISTS idx_pathways_to ON pathways(to_location_id);
CREATE INDEX IF NOT EXISTS idx_daily_schedules_student ON daily_schedules(student_id);
CREATE INDEX IF NOT EXISTS idx_event_reg_event ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_reg_student ON event_registrations(student_id);
