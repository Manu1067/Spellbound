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
      DROP TABLE IF EXISTS owl_dispatches;
      DROP TABLE IF EXISTS potion_ingredients;
      DROP TABLE IF EXISTS daily_schedules;
      DROP TABLE IF EXISTS mystery_records;
      DROP TABLE IF EXISTS mystery_puzzles;
      DROP TABLE IF EXISTS official_notices;
      DROP TABLE IF EXISTS confessions;
      DROP TABLE IF EXISTS complaints;
      DROP TABLE IF EXISTS student_council;
      DROP TABLE IF EXISTS community_reactions;
      DROP TABLE IF EXISTS community_signatures;
      DROP TABLE IF EXISTS community_posts;
      DROP TABLE IF EXISTS sports_registrations;
      DROP TABLE IF EXISTS sports_matches;
      DROP TABLE IF EXISTS sports_teams;
      DROP TABLE IF EXISTS sports_disciplines;
      DROP TABLE IF EXISTS event_registrations;
      DROP TABLE IF EXISTS events;
      DROP TABLE IF EXISTS learning_resources;
      DROP TABLE IF EXISTS courses;
      DROP TABLE IF EXISTS lab_resources;
      DROP TABLE IF EXISTS laboratories;
      DROP TABLE IF EXISTS pathways;
      DROP TABLE IF EXISTS students;
      DROP TABLE IF EXISTS clubs;
      DROP TABLE IF EXISTS locations;
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

    // 3. Campus Locations (Foundational for Labs, Pathways, Events)
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

    // 4. Clubs
    const insertClub = db.prepare(`
      INSERT OR IGNORE INTO clubs (
        id, name, description, lead_coordinator, meeting_schedule, activities, icon_name
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    for (const c of seedData.clubs) {
      insertClub.run(c.id, c.name, c.description, c.lead_coordinator, c.meeting_schedule, c.activities, c.icon_name);
    }

    // 5. Pathways
    const insertPathway = db.prepare(`
      INSERT OR IGNORE INTO pathways (
        id, from_location_id, to_location_id, name, path_type, distance_meters, is_unlocked, description
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const p of seedData.pathways) {
      insertPathway.run(
        p.id, p.from_location_id, p.to_location_id, p.name,
        p.path_type, p.distance_meters, p.is_unlocked, p.description
      );
    }

    // 6. Laboratories
    const insertLab = db.prepare(`
      INSERT OR IGNORE INTO laboratories (
        id, name, code, description, location_id, faculty_in_charge, available_equipment, safety_guidelines
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const lab of seedData.laboratories) {
      insertLab.run(
        lab.id, lab.name, lab.code, lab.description,
        lab.location_id, lab.faculty_in_charge, lab.available_equipment, lab.safety_guidelines
      );
    }

    // 7. Laboratory Resources
    const insertLabRes = db.prepare(`
      INSERT OR IGNORE INTO lab_resources (
        id, lab_id, title, category, description, file_size, download_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    for (const lr of seedData.labResources) {
      insertLabRes.run(
        lr.id, lr.lab_id, lr.title, lr.category, lr.description, lr.file_size, lr.download_url
      );
    }

    // 8. Students
    const insertStudent = db.prepare(`
      INSERT OR IGNORE INTO students (
        id, name, house_id, year, title, branch, languages, hobbies, fields_of_interest, skills,
        wand, patronus, fav_subject, bio, avatar_url, points_contributed, academic_rank, is_current_user
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const s of seedData.students) {
      insertStudent.run(
        s.id, s.name, s.house_id, s.year, s.title, s.branch, s.languages, s.hobbies, s.fields_of_interest, s.skills,
        s.wand, s.patronus, s.fav_subject, s.bio, s.avatar_url, s.points_contributed, s.academic_rank, s.is_current_user
      );
    }

    // 9. Courses
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

    // 10. Learning Resources
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

    // 11. Events
    const insertEvent = db.prepare(`
      INSERT OR IGNORE INTO events (
        id, club_id, title, date_time, location_id, location_name, category, description, rsvp_count, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const e of seedData.events) {
      insertEvent.run(
        e.id, e.club_id, e.title, e.date_time, e.location_id, e.location_name,
        e.category, e.description, e.rsvp_count, e.is_active
      );
    }

    // 12. Event Registrations
    const insertReg = db.prepare(`
      INSERT OR IGNORE INTO event_registrations (event_id, student_id)
      VALUES (?, ?)
    `);
    for (const reg of seedData.eventRegistrations) {
      insertReg.run(reg.event_id, reg.student_id);
    }

    // 13. Sports Disciplines
    const insertSport = db.prepare(`
      INSERT OR IGNORE INTO sports_disciplines (
        id, name, category, description, team_size, venue, equipment, rules_summary, icon_name
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const sp of seedData.sportsDisciplines) {
      insertSport.run(
        sp.id, sp.name, sp.category, sp.description, sp.team_size,
        sp.venue, sp.equipment, sp.rules_summary, sp.icon_name
      );
    }

    // 14. Sports Teams
    const insertTeam = db.prepare(`
      INSERT OR IGNORE INTO sports_teams (
        id, sport_id, name, house_id, captain, wins, losses, goal_differential, points, crest_color
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const t of seedData.sportsTeams) {
      insertTeam.run(
        t.id, t.sport_id, t.name, t.house_id, t.captain, t.wins,
        t.losses, t.goal_differential, t.points, t.crest_color
      );
    }

    // 15. Sports Matches
    const insertMatch = db.prepare(`
      INSERT OR IGNORE INTO sports_matches (
        id, sport_id, home_team_id, away_team_id, match_date, venue, status, home_score, away_score, snitch_caught_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const m of seedData.sportsMatches) {
      insertMatch.run(
        m.id, m.sport_id, m.home_team_id, m.away_team_id, m.match_date,
        m.venue, m.status, m.home_score, m.away_score, m.snitch_caught_by
      );
    }

    // 16. Community Posts
    const insertPost = db.prepare(`
      INSERT OR IGNORE INTO community_posts (
        id, author_id, author_name, house_id, category, title, body, signature_count, likes_count, dislikes_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const cp of seedData.communityPosts) {
      insertPost.run(
        cp.id, cp.author_id, cp.author_name, cp.house_id,
        cp.category, cp.title, cp.body, cp.signature_count,
        cp.likes_count || 0, cp.dislikes_count || 0
      );
    }

    // 16B. Initial Community Post Reactions
    const insertReaction = db.prepare(`
      INSERT OR IGNORE INTO community_reactions (post_id, student_id, reaction_type)
      VALUES (?, ?, ?)
    `);
    insertReaction.run('note-1', 'student-aris-thorne', 'like');
    insertReaction.run('note-2', 'student-aris-thorne', 'like');

    // 17. Student Council
    const insertCouncil = db.prepare(`
      INSERT OR IGNORE INTO student_council (
        id, role, student_name, branch, office_hours, contact_email, avatar_url, announcements
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const sc of seedData.studentCouncil) {
      insertCouncil.run(
        sc.id, sc.role, sc.student_name, sc.branch,
        sc.office_hours, sc.contact_email, sc.avatar_url, sc.announcements
      );
    }

    // 18. Complaints
    const insertComplaint = db.prepare(`
      INSERT OR IGNORE INTO complaints (
        id, student_id, category, subject, description, priority, status, is_confidential
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const comp of seedData.complaints) {
      insertComplaint.run(
        comp.id, comp.student_id, comp.category, comp.subject,
        comp.description, comp.priority, comp.status, comp.is_confidential
      );
    }

    // 19. Confessions
    const insertConfession = db.prepare(`
      INSERT OR IGNORE INTO confessions (
        id, message, category, status, likes_count
      ) VALUES (?, ?, ?, ?, ?)
    `);
    for (const conf of seedData.confessions) {
      insertConfession.run(
        conf.id, conf.message, conf.category, conf.status, conf.likes_count
      );
    }

    // 20. Official Notices
    const insertNotice = db.prepare(`
      INSERT OR IGNORE INTO official_notices (
        id, title, category, message, publication_date, expiry_date, priority, issuing_authority, is_verified
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const n of seedData.officialNotices) {
      insertNotice.run(
        n.id, n.title, n.category, n.message, n.publication_date,
        n.expiry_date, n.priority, n.issuing_authority, n.is_verified
      );
    }

    // 21. Mystery Puzzles
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

    // 22. Daily Schedules
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

    // 23. Potion Ingredients
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
    'locations',
    'clubs',
    'pathways',
    'laboratories',
    'lab_resources',
    'students',
    'courses',
    'sports_disciplines',
    'sports_teams',
    'sports_matches',
    'student_council',
    'complaints',
    'confessions',
    'official_notices',
    'community_posts',
    'events',
    'daily_schedules'
  ];

  console.log('[Database] Table statistics:');
  for (const table of tables) {
    const row = db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get();
    console.log(`  - ${table}: ${row.count} records`);
  }
};

// Direct CLI execution
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
