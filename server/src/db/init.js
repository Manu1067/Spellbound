import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDatabase, closeDatabase } from './connection.js';
import * as seedData from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const initializeDatabase = ({ reset = false } = {}) => {
  console.log(`[Database] Initializing database (reset=${reset})...`);
  const db = getDatabase();

  // If reset requested, drop all tables in reverse foreign key order
  if (reset) {
    console.log('[Database] Resetting existing tables...');
    db.exec(`
      PRAGMA foreign_keys = OFF;
      DROP TABLE IF EXISTS potion_brews;
      DROP TABLE IF EXISTS student_quizzes;
      DROP TABLE IF EXISTS community_replies;
      DROP TABLE IF EXISTS communities;
      DROP TABLE IF EXISTS owl_dispatches;
      DROP TABLE IF EXISTS potion_ingredients;
      DROP TABLE IF EXISTS daily_schedules;
      DROP TABLE IF EXISTS mystery_records;
      DROP TABLE IF EXISTS mystery_puzzles;
      DROP TABLE IF EXISTS community_signatures;
      DROP TABLE IF EXISTS community_posts;
      DROP TABLE IF EXISTS sports_matches;
      DROP TABLE IF EXISTS sports_teams;
      DROP TABLE IF EXISTS event_registrations;
      DROP TABLE IF EXISTS events;
      DROP TABLE IF EXISTS learning_resources;
      DROP TABLE IF EXISTS courses;
      DROP TABLE IF EXISTS pathways;
      DROP TABLE IF EXISTS locations;
      DROP TABLE IF EXISTS students;
      DROP TABLE IF EXISTS house_points_log;
      DROP TABLE IF EXISTS houses;
      PRAGMA foreign_keys = ON;
    `);
    console.log('[Database] Old tables dropped.');
  }

  // Read and execute schema
  const schemaPath = path.resolve(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schemaSql);
  console.log('[Database] Schema applied successfully.');

  // Idempotently seed data using transaction
  const seedTransaction = db.transaction(() => {
    // 1. Houses
    const insertHouse = db.prepare(`
      INSERT OR IGNORE INTO houses (
        id, name, motto, core_values, points, crest_color, accent_color, animal, gem, head_of_house
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const h of seedData.houses) {
      insertHouse.run(
        h.id, h.name, h.motto, h.core_values, h.points,
        h.crest_color, h.accent_color, h.animal, h.gem, h.head_of_house
      );
    }

    // 2. House Points Log
    const checkLog = db.prepare('SELECT COUNT(*) as count FROM house_points_log').get();
    if (checkLog.count === 0) {
      const insertPointLog = db.prepare(`
        INSERT INTO house_points_log (house_id, amount, reason, awarded_by)
        VALUES (?, ?, ?, ?)
      `);
      for (const pl of seedData.housePointsLogs) {
        insertPointLog.run(pl.house_id, pl.amount, pl.reason, pl.awarded_by);
      }
    }

    // 3. Students
    const insertStudent = db.prepare(`
      INSERT OR IGNORE INTO students (
        id, name, house_id, year, title, wand, patronus, fav_subject, bio, avatar_url, points_contributed, academic_rank, is_current_user,
        skills, interests, project_experience, is_mentor, role
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const s of seedData.students) {
      insertStudent.run(
        s.id, s.name, s.house_id, s.year, s.title, s.wand, s.patronus,
        s.fav_subject, s.bio, s.avatar_url, s.points_contributed, s.academic_rank, s.is_current_user,
        s.skills || '[]', s.interests || '[]', s.project_experience || '', s.is_mentor || 0, s.role || 'Senior Adept'
      );
    }

    // 4. Locations
    const insertLocation = db.prepare(`
      INSERT OR IGNORE INTO locations (
        id, name, zone, description, highlights, danger_level, coord_x, coord_y, is_secret
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const l of seedData.locations) {
      insertLocation.run(
        l.id, l.name, l.zone, l.description, l.highlights,
        l.danger_level, l.coord_x, l.coord_y, l.is_secret
      );
    }

    // 5. Pathways
    const insertPathway = db.prepare(`
      INSERT OR IGNORE INTO pathways (
        id, from_location_id, to_location_id, name, path_type, distance, is_unlocked, description
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const p of seedData.pathways) {
      insertPathway.run(
        p.id, p.from_location_id, p.to_location_id, p.name,
        p.path_type, p.distance || 15, p.is_unlocked, p.description
      );
    }

    // 6. Courses
    const insertCourse = db.prepare(`
      INSERT OR IGNORE INTO courses (
        code, title, instructor, term, credits, description, location_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    for (const c of seedData.courses) {
      insertCourse.run(
        c.code, c.title, c.instructor, c.term,
        c.credits, c.description, c.location_id
      );
    }

    // 7. Learning Resources
    const insertResource = db.prepare(`
      INSERT OR IGNORE INTO learning_resources (
        id, course_code, title, resource_type, author, rarity, content_snippet
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    for (const r of seedData.learningResources) {
      insertResource.run(
        r.id, r.course_code, r.title, r.resource_type,
        r.author, r.rarity, r.content_snippet
      );
    }

    // 8. Events
    const insertEvent = db.prepare(`
      INSERT OR IGNORE INTO events (
        id, title, date_time, location_id, location_name, category, description, rsvp_count, capacity, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const e of seedData.events) {
      insertEvent.run(
        e.id, e.title, e.date_time, e.location_id, e.location_name,
        e.category, e.description, e.rsvp_count, e.capacity || 50, e.is_active
      );
    }

    // 9. Event Registrations
    const insertReg = db.prepare(`
      INSERT OR IGNORE INTO event_registrations (event_id, student_id)
      VALUES (?, ?)
    `);
    for (const reg of seedData.eventRegistrations) {
      insertReg.run(reg.event_id, reg.student_id);
    }

    // 10. Sports Teams
    const insertTeam = db.prepare(`
      INSERT OR IGNORE INTO sports_teams (
        id, name, house_id, captain, wins, losses, goal_differential, points, crest_color, roster
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const t of seedData.sportsTeams) {
      insertTeam.run(
        t.id, t.name, t.house_id, t.captain, t.wins,
        t.losses, t.goal_differential, t.points, t.crest_color, t.roster || '[]'
      );
    }

    // 11. Sports Matches
    const insertMatch = db.prepare(`
      INSERT OR IGNORE INTO sports_matches (
        id, home_team_id, away_team_id, match_date, venue, status, home_score, away_score, snitch_caught_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const m of seedData.sportsMatches) {
      insertMatch.run(
        m.id, m.home_team_id, m.away_team_id, m.match_date,
        m.venue, m.status, m.home_score, m.away_score, m.snitch_caught_by
      );
    }

    // 12. Community Posts
    const insertPost = db.prepare(`
      INSERT OR IGNORE INTO community_posts (
        id, author_id, author_name, house_id, category, title, body, signature_count, is_reported
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const cp of seedData.communityPosts) {
      insertPost.run(
        cp.id, cp.author_id, cp.author_name, cp.house_id,
        cp.category, cp.title, cp.body, cp.signature_count, cp.is_reported || 0
      );
    }

    // 12B. Communities
    if (seedData.communities) {
      const insertComm = db.prepare(`
        INSERT OR IGNORE INTO communities (
          id, name, description, category, house_id, member_count, icon_name, is_joined
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const comm of seedData.communities) {
        insertComm.run(
          comm.id, comm.name, comm.description, comm.category,
          comm.house_id, comm.member_count, comm.icon_name || 'Flame', comm.is_joined || 0
        );
      }
    }

    // 12C. Community Discussion Replies
    if (seedData.communityReplies) {
      const insertReply = db.prepare(`
        INSERT OR IGNORE INTO community_replies (
          id, post_id, author_id, author_name, house_id, body
        ) VALUES (?, ?, ?, ?, ?, ?)
      `);
      for (const rep of seedData.communityReplies) {
        insertReply.run(
          rep.id, rep.post_id, rep.author_id, rep.author_name, rep.house_id, rep.body
        );
      }
    }

    // 13. Mystery Puzzles
    const insertPuzzle = db.prepare(`
      INSERT OR IGNORE INTO mystery_puzzles (
        id, title, question, options, correct_index, explanation, difficulty, chamber
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const mp of seedData.mysteryPuzzles) {
      insertPuzzle.run(
        mp.id, mp.title, mp.question, mp.options,
        mp.correct_index, mp.explanation, mp.difficulty, mp.chamber
      );
    }

    // 14. Daily Schedules
    const insertSchedule = db.prepare(`
      INSERT OR IGNORE INTO daily_schedules (
        id, student_id, time_slot, subject, instructor, location, status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const ds of seedData.dailySchedules) {
      insertSchedule.run(
        ds.id, ds.student_id, ds.time_slot, ds.subject,
        ds.instructor, ds.location, ds.status, ds.notes
      );
    }

    // 15. Potion Ingredients
    const insertIngredient = db.prepare(`
      INSERT OR IGNORE INTO potion_ingredients (
        id, name, potency, stability, color, description
      ) VALUES (?, ?, ?, ?, ?, ?)
    `);
    for (const pi of seedData.potionIngredients) {
      insertIngredient.run(
        pi.id, pi.name, pi.potency, pi.stability, pi.color, pi.description
      );
    }
  });

  seedTransaction();
  console.log('[Database] Seed data verified and loaded successfully.');

  // Print summary counts
  const tables = [
    'houses',
    'students',
    'locations',
    'pathways',
    'courses',
    'learning_resources',
    'events',
    'event_registrations',
    'sports_teams',
    'sports_matches',
    'community_posts',
    'communities',
    'community_replies',
    'mystery_puzzles',
    'daily_schedules',
    'potion_ingredients'
  ];

  console.log('[Database] Table statistics:');
  for (const table of tables) {
    const row = db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get();
    console.log(`  - ${table}: ${row.count} records`);
  }
};

// Allow direct CLI execution
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const resetFlag = process.argv.includes('--reset');
  try {
    initializeDatabase({ reset: resetFlag });
    closeDatabase();
    process.exit(0);
  } catch (err) {
    console.error('[Database] Initialization error:', err);
    process.exit(1);
  }
}
