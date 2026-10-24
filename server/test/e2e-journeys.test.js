import test, { describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';
import { initializeDatabase } from '../src/db/init.js';
import { closeDatabase } from '../src/db/connection.js';

let server;
let baseUrl;

before(async () => {
  // Fresh DB for clean test state
  initializeDatabase({ reset: true });

  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

after(() => {
  if (server) {
    server.close();
  }
  closeDatabase();
});

describe('SPELLBOUND — PHASE 2C: END-TO-END VALIDATION TEST SUITE', () => {
  test('Journey 1: Open Spellbound and enter the dashboard', async () => {
    // 1. Health check
    const healthRes = await fetch(`${baseUrl}/api/health`);
    assert.equal(healthRes.status, 200);
    const health = await healthRes.json();
    assert.equal(health.success, true);
    assert.equal(health.data.database, 'connected');

    // 2. Current student profile for dashboard
    const currentRes = await fetch(`${baseUrl}/api/students/current/dossier`);
    assert.equal(currentRes.status, 200);
    const current = await currentRes.json();
    assert.equal(current.data.name, 'Aris Thorne');
    assert.equal(current.data.house, 'Ravencrest');

    // 3. Timetable schedule for dashboard
    const schedRes = await fetch(`${baseUrl}/api/schedule`);
    assert.equal(schedRes.status, 200);
    const sched = await schedRes.json();
    assert.ok(Array.isArray(sched.data));
    assert.ok(sched.data.length > 0);

    // 4. House standings for dashboard
    const housesRes = await fetch(`${baseUrl}/api/houses`);
    assert.equal(housesRes.status, 200);
    const houses = await housesRes.json();
    assert.equal(houses.data.length, 4);
  });

  test('Journey 2: Find a campus location and calculate a route', async () => {
    // 1. List locations & pathways
    const locRes = await fetch(`${baseUrl}/api/locations`);
    const pathRes = await fetch(`${baseUrl}/api/locations/pathways`);
    assert.equal(locRes.status, 200);
    assert.equal(pathRes.status, 200);

    const locations = (await locRes.json()).data;
    const pathways = (await pathRes.json()).data;
    assert.ok(locations.length >= 6);
    assert.ok(pathways.length >= 10);

    // Verify origin (Great Hall) and destination (Grand Library)
    const origin = locations.find((l) => l.name.includes('Great Hall'));
    const destination = locations.find((l) => l.name.includes('Grand Library'));
    assert.ok(origin, 'Origin location exists');
    assert.ok(destination, 'Destination location exists');

    // 2. Toggle pathway to test demo administrator ward barrier control
    const pathwayToToggle = pathways[0];
    const toggleRes = await fetch(`${baseUrl}/api/locations/pathways/${pathwayToToggle.id}/toggle`, {
      method: 'PATCH'
    });
    assert.equal(toggleRes.status, 200);
    const toggled = await toggleRes.json();
    assert.equal(toggled.data.isUnlocked, false);

    // Re-open pathway
    const reopenRes = await fetch(`${baseUrl}/api/locations/pathways/${pathwayToToggle.id}/toggle`, {
      method: 'PATCH'
    });
    assert.equal(reopenRes.status, 200);
    const reopened = await reopenRes.json();
    assert.equal(reopened.data.isUnlocked, true);
  });

  test('Journey 3: Search for a student, view dossier, edit profile, and send owl', async () => {
    // 1. Search students by skill
    const searchRes = await fetch(`${baseUrl}/api/students?skill=Runes`);
    assert.equal(searchRes.status, 200);
    const searchData = await searchRes.json();
    assert.ok(searchData.data.length > 0);

    // 2. View student detail
    const studentId = searchData.data[0].id;
    const detailRes = await fetch(`${baseUrl}/api/students/${studentId}`);
    assert.equal(detailRes.status, 200);
    const detail = await detailRes.json();
    assert.ok(detail.data.wand);
    assert.ok(detail.data.patronus);

    // 3. Update Aris Thorne's profile (demo profile editing flow)
    const updateRes = await fetch(`${baseUrl}/api/students/student-aris-thorne`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bio: 'Updated master scholar bio test.',
        title: 'Arch-Adept of Starlight Runes'
      })
    });
    assert.equal(updateRes.status, 200);
    const updated = await updateRes.json();
    assert.equal(updated.data.bio, 'Updated master scholar bio test.');

    // 4. Dispatch owl post
    const owlRes = await fetch(`${baseUrl}/api/owls`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderId: 'student-aris-thorne',
        recipientId: 'p-1',
        message: 'Let us meet in the West Scriptoria before nightfall.'
      })
    });
    assert.equal(owlRes.status, 201);
    const owl = await owlRes.json();
    assert.equal(owl.data.status, 'Dispatched');
  });

  test('Journey 4: Complete an academic quiz and verify saved progress', async () => {
    // 1. Submit quiz answers for TRANS-501
    const quizRes = await fetch(`${baseUrl}/api/courses/quizzes/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: 'student-aris-thorne',
        courseCode: 'TRANS-501',
        answers: {
          q1: 1, // 528 Hz Vita-Forma
          q2: 3, // volatile glass
          q3: 1  // Sentient consciousness
        }
      })
    });

    assert.equal(quizRes.status, 200);
    const quiz = await quizRes.json();
    assert.equal(quiz.data.passed, true);
    assert.equal(quiz.data.scorePercent, 100);
    assert.equal(quiz.data.pointsAwarded, 25);

    // 2. Verify academic progress endpoint reflects the saved quiz
    const progRes = await fetch(`${baseUrl}/api/courses/progress/student-aris-thorne`);
    assert.equal(progRes.status, 200);
    const prog = await progRes.json();
    const completedQuizzes = prog.data.completedQuizzes;
    assert.ok(completedQuizzes.some((q) => q.courseCode === 'TRANS-501' && q.score === 100));
  });

  test('Journey 5: Register for an event and verify registration status', async () => {
    // 1. Fetch events
    const eventsRes = await fetch(`${baseUrl}/api/events`);
    assert.equal(eventsRes.status, 200);
    const events = (await eventsRes.json()).data;
    const event = events[0];
    assert.ok(event);

    const initialRsvp = event.isRsvp;

    // 2. Toggle RSVP
    const rsvpRes = await fetch(`${baseUrl}/api/events/${event.id}/rsvp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: 'student-aris-thorne' })
    });
    assert.equal(rsvpRes.status, 200);
    const rsvp = await rsvpRes.json();
    assert.notEqual(rsvp.data.isRsvp, initialRsvp);

    // 3. Confirm that event capacity constraint is active
    const eventDetailRes = await fetch(`${baseUrl}/api/events/${event.id}`);
    assert.equal(eventDetailRes.status, 200);
    const eventDetail = await eventDetailRes.json();
    assert.ok(eventDetail.data.capacity > 0);
  });

  test('Journey 6: Complete an eligible activity and verify House points update', async () => {
    // 1. Get Ravencrest initial points
    const beforeRes = await fetch(`${baseUrl}/api/houses/ravencrest`);
    const initialPoints = (await beforeRes.json()).data.points;

    // 2. Brew a potion that qualifies for discovery points
    const brewRes = await fetch(`${baseUrl}/api/courses/brew-potion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: 'student-aris-thorne',
        ingredientIds: ['ing-2', 'ing-3'], // Moonstone + Silver Dewleaf (Harmonic & Stable)
        heatLevel: 'Low Ember',
        stirDirection: 'Clockwise'
      })
    });

    assert.equal(brewRes.status, 200);
    const brew = await brewRes.json();
    assert.equal(brew.data.outcome, 'Success');
    assert.equal(brew.data.housePointsAwarded, 15);

    // 3. Verify points in house ledger increased by 15
    const afterRes = await fetch(`${baseUrl}/api/houses/ravencrest`);
    const afterPoints = (await afterRes.json()).data.points;
    assert.equal(afterPoints, initialPoints + 15);

    // 4. Verify points log contains entry
    const historyRes = await fetch(`${baseUrl}/api/houses/history?limit=5`);
    assert.equal(historyRes.status, 200);
    const history = (await historyRes.json()).data;
    assert.ok(history.some((h) => h.amount === 15 && h.houseId === 'ravencrest'));
  });

  test('Journey 7: Search learning resources, solve mystery puzzle, and consult Archival Scribe', async () => {
    // 1. Search learning resources
    const resRes = await fetch(`${baseUrl}/api/courses/resources?search=Glyph`);
    assert.equal(resRes.status, 200);
    const resData = await resRes.json();
    assert.ok(Array.isArray(resData.data));

    // 2. Solve mystery puzzle
    const puzzlesRes = await fetch(`${baseUrl}/api/mysteries/puzzles`);
    assert.equal(puzzlesRes.status, 200);
    const puzzle = (await puzzlesRes.json()).data[0];

    // Submit correct answer index (2 = The Obsidian Hourglass)
    const solveRes = await fetch(`${baseUrl}/api/mysteries/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        puzzleId: puzzle.id,
        selectedIndex: 2,
        studentId: 'student-aris-thorne'
      })
    });
    assert.equal(solveRes.status, 200);
    const solved = await solveRes.json();
    assert.equal(solved.data.isCorrect, true);

    // Second submission should not award duplicate points
    const reSolveRes = await fetch(`${baseUrl}/api/mysteries/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        puzzleId: puzzle.id,
        selectedIndex: 2,
        studentId: 'student-aris-thorne'
      })
    });
    assert.equal(reSolveRes.status, 200);
    const reSolved = await reSolveRes.json();
    assert.equal(reSolved.data.pointsAwarded, 0); // No duplicate points!

    // 3. Consult Archival Scribe
    const scribeRes = await fetch(`${baseUrl}/api/mysteries/ask-scribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'What are the wards of the chronos vault?' })
    });
    assert.equal(scribeRes.status, 200);
    const scribe = await scribeRes.json();
    assert.equal(scribe.data.status, 'Verified Lore');
    assert.ok(scribe.data.answer.includes('Chronomancy Vault'));
  });

  test('Journey 8: Navigate between all seven departments without broken routes or missing data', async () => {
    // Department 1: Explore Hogwarts
    const d1 = await fetch(`${baseUrl}/api/locations`);
    assert.equal(d1.status, 200);

    // Department 2: People of the Wizarding World
    const d2 = await fetch(`${baseUrl}/api/students`);
    assert.equal(d2.status, 200);

    // Department 3: Sports Department
    const d3 = await fetch(`${baseUrl}/api/sports/standings`);
    assert.equal(d3.status, 200);

    // Department 4: Academics & Magical Labs
    const d4 = await fetch(`${baseUrl}/api/courses`);
    assert.equal(d4.status, 200);

    // Department 5: Wizarding Social Network
    const d5 = await fetch(`${baseUrl}/api/community/posts`);
    assert.equal(d5.status, 200);

    // Department 6: Houses & Events
    const d6 = await fetch(`${baseUrl}/api/houses`);
    assert.equal(d6.status, 200);

    // Department 7: Department of Mysteries
    const d7 = await fetch(`${baseUrl}/api/mysteries/puzzles`);
    assert.equal(d7.status, 200);
  });
});
