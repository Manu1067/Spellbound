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
    // Listen on an ephemeral port (0) to avoid conflicts
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

after(() => {
  server.close();
  closeDatabase();
});

describe('1. Health Check Endpoint', () => {
  test('GET /api/health should return 200 with operational database', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.equal(res.status, 200);

    const json = await res.json();
    assert.equal(json.success, true);
    assert.equal(json.data.status, 'ok');
    assert.equal(json.data.database, 'connected');
    assert.equal(json.data.academy, 'Spellbound Wizarding Academy');
    assert.equal(typeof json.data.uptime, 'number');
  });
});

describe('2. Campus Events Endpoints', () => {
  test('GET /api/events should return array of active events', async () => {
    const res = await fetch(`${baseUrl}/api/events`);
    assert.equal(res.status, 200);

    const json = await res.json();
    assert.equal(json.success, true);
    assert.ok(Array.isArray(json.data));
    assert.ok(json.data.length >= 4);

    const first = json.data[0];
    assert.ok(first.id);
    assert.ok(first.title);
    assert.ok(first.locationName);
    assert.equal(typeof first.rsvpCount, 'number');
    assert.equal(typeof first.isRsvp, 'boolean');
  });

  test('GET /api/events/:id should return single event detail', async () => {
    const res = await fetch(`${baseUrl}/api/events/evt-1`);
    assert.equal(res.status, 200);

    const json = await res.json();
    assert.equal(json.success, true);
    assert.equal(json.data.id, 'evt-1');
    assert.equal(json.data.title, 'Celestial Solstice Ball');
    assert.equal(json.data.isRsvp, true);
  });

  test('POST /api/events/:id/rsvp toggles RSVP registration', async () => {
    // First toggle: existing RSVP on evt-1 should unregister
    const res1 = await fetch(`${baseUrl}/api/events/evt-1/rsvp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: 'student-aris-thorne' })
    });
    assert.equal(res1.status, 200);
    const json1 = await res1.json();
    assert.equal(json1.success, true);
    assert.equal(json1.data.isRsvp, false);

    // Second toggle: should re-register
    const res2 = await fetch(`${baseUrl}/api/events/evt-1/rsvp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: 'student-aris-thorne' })
    });
    assert.equal(res2.status, 200);
    const json2 = await res2.json();
    assert.equal(json2.success, true);
    assert.equal(json2.data.isRsvp, true);
  });
});

describe('3. Locations and Pathways Endpoints', () => {
  test('GET /api/locations should return campus cartography', async () => {
    const res = await fetch(`${baseUrl}/api/locations`);
    assert.equal(res.status, 200);

    const json = await res.json();
    assert.equal(json.success, true);
    assert.ok(Array.isArray(json.data));
    assert.ok(json.data.length >= 6);

    const greatHall = json.data.find((l) => l.id === 'loc-1');
    assert.ok(greatHall);
    assert.equal(greatHall.name, 'The Great Hall');
    assert.equal(greatHall.zone, 'Central Keep');
    assert.ok(Array.isArray(greatHall.highlights));
    assert.equal(greatHall.coords.x, 50);
    assert.equal(greatHall.coords.y, 56);
  });

  test('GET /api/locations/:id should include connected pathways', async () => {
    const res = await fetch(`${baseUrl}/api/locations/loc-1`);
    assert.equal(res.status, 200);

    const json = await res.json();
    assert.equal(json.success, true);
    assert.equal(json.data.id, 'loc-1');
    assert.ok(Array.isArray(json.data.pathways));
    assert.ok(json.data.pathways.length >= 2);
  });

  test('GET /api/locations/pathways should return ley-line corridors', async () => {
    const res = await fetch(`${baseUrl}/api/locations/pathways`);
    assert.equal(res.status, 200);

    const json = await res.json();
    assert.equal(json.success, true);
    assert.ok(Array.isArray(json.data));
    assert.ok(json.data.length >= 5);
  });
});

describe('4. Academics and Courses Endpoints', () => {
  test('GET /api/courses should return list of curricula', async () => {
    const res = await fetch(`${baseUrl}/api/courses`);
    assert.equal(res.status, 200);

    const json = await res.json();
    assert.equal(json.success, true);
    assert.ok(Array.isArray(json.data));
    assert.ok(json.data.length >= 5);

    const transfig = json.data.find((c) => c.code === 'TRANS-501');
    assert.ok(transfig);
    assert.equal(transfig.title, 'Advanced Inanimate Transfiguration');
    assert.equal(transfig.instructor, 'Prof. Morgana Vance');
  });

  test('GET /api/courses/:code should include course grimoires and resources', async () => {
    const res = await fetch(`${baseUrl}/api/courses/TRANS-501`);
    assert.equal(res.status, 200);

    const json = await res.json();
    assert.equal(json.success, true);
    assert.equal(json.data.code, 'TRANS-501');
    assert.ok(Array.isArray(json.data.resources));
    assert.ok(json.data.resources.length >= 1);
    assert.equal(json.data.resources[0].resourceType, 'Grimoire');
  });
});

describe('5. Students Directory & Dossiers', () => {
  test('GET /api/students should return all adepts and faculty', async () => {
    const res = await fetch(`${baseUrl}/api/students`);
    assert.equal(res.status, 200);

    const json = await res.json();
    assert.equal(json.success, true);
    assert.ok(Array.isArray(json.data));
    assert.ok(json.data.length >= 7);
  });

  test('GET /api/students?house=Ravencrest should filter by house', async () => {
    const res = await fetch(`${baseUrl}/api/students?house=Ravencrest`);
    assert.equal(res.status, 200);

    const json = await res.json();
    assert.equal(json.success, true);
    assert.ok(json.data.every((s) => s.house === 'Ravencrest'));
  });

  test('GET /api/students?search=Valerius should search by keyword', async () => {
    const res = await fetch(`${baseUrl}/api/students?search=Valerius`);
    assert.equal(res.status, 200);

    const json = await res.json();
    assert.equal(json.success, true);
    assert.ok(json.data.length >= 2);
  });

  test('GET /api/students/current/dossier should return active user profile', async () => {
    const res = await fetch(`${baseUrl}/api/students/current/dossier`);
    assert.equal(res.status, 200);

    const json = await res.json();
    assert.equal(json.success, true);
    assert.equal(json.data.id, 'student-aris-thorne');
    assert.equal(json.data.name, 'Aris Thorne');
    assert.equal(json.data.house, 'Ravencrest');
    assert.equal(json.data.isCurrentUser, true);
  });
});

describe('6. Houses and Points Ledger', () => {
  test('GET /api/houses should return all 4 Great Houses with parsed values', async () => {
    const res = await fetch(`${baseUrl}/api/houses`);
    assert.equal(res.status, 200);

    const json = await res.json();
    assert.equal(json.success, true);
    assert.equal(json.data.length, 4);

    const ravencrest = json.data.find((h) => h.id === 'ravencrest');
    assert.ok(ravencrest);
    assert.equal(ravencrest.name, 'Ravencrest');
    assert.ok(Array.isArray(ravencrest.values));
    assert.ok(ravencrest.values.includes('Intellect'));
  });

  test('POST /api/houses/:id/points awards points and creates ledger entry', async () => {
    const prevRes = await fetch(`${baseUrl}/api/houses/ravencrest`);
    const prevJson = await prevRes.json();
    const prevPoints = prevJson.data.points;

    const res = await fetch(`${baseUrl}/api/houses/ravencrest/points`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 50,
        reason: 'Masterwork celestial calculation',
        awardedBy: 'Arch-Magister Valerius'
      })
    });

    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.success, true);
    assert.equal(json.data.pointsAwarded, 50);
    assert.equal(json.data.totalPoints, prevPoints + 50);

    // Verify history recorded
    const historyRes = await fetch(`${baseUrl}/api/houses/history`);
    const historyJson = await historyRes.json();
    assert.equal(historyJson.success, true);
    assert.ok(historyJson.data.some((l) => l.reason === 'Masterwork celestial calculation'));
  });
});

describe('7. Sports & Skyspire Broomstick League', () => {
  test('GET /api/sports/standings returns ranked teams', async () => {
    const res = await fetch(`${baseUrl}/api/sports/standings`);
    assert.equal(res.status, 200);

    const json = await res.json();
    assert.equal(json.success, true);
    assert.equal(json.data.length, 4);
    assert.equal(json.data[0].rank, 1);
  });

  test('GET /api/sports/matches returns fixtures and results', async () => {
    const res = await fetch(`${baseUrl}/api/sports/matches`);
    assert.equal(res.status, 200);

    const json = await res.json();
    assert.equal(json.success, true);
    assert.ok(json.data.length >= 3);
  });
});

describe('8. Community Common Room Notices', () => {
  test('GET /api/community/posts returns notices', async () => {
    const res = await fetch(`${baseUrl}/api/community/posts`);
    assert.equal(res.status, 200);

    const json = await res.json();
    assert.equal(json.success, true);
    assert.ok(json.data.length >= 4);
  });

  test('POST /api/community/posts creates new parchment notice', async () => {
    const res = await fetch(`${baseUrl}/api/community/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        authorId: 'student-aris-thorne',
        authorName: 'Aris Thorne',
        houseId: 'ravencrest',
        category: 'Study Circle',
        title: 'Chronomancy Cipher Study Group',
        body: 'Convening at the Ravencrest Hearth to decode the third dial.'
      })
    });

    assert.equal(res.status, 201);
    const json = await res.json();
    assert.equal(json.success, true);
    assert.equal(json.data.title, 'Chronomancy Cipher Study Group');
    assert.equal(json.data.signatures, 1);
  });
});

describe('9. Department of Mysteries & Chronos Enigma', () => {
  test('GET /api/mysteries/puzzles returns riddles', async () => {
    const res = await fetch(`${baseUrl}/api/mysteries/puzzles`);
    assert.equal(res.status, 200);

    const json = await res.json();
    assert.equal(json.success, true);
    assert.ok(json.data.length >= 2);
    assert.ok(Array.isArray(json.data[0].options));
  });

  test('POST /api/mysteries/verify validates student answers', async () => {
    // Correct answer test (rid-1, index 2)
    const res1 = await fetch(`${baseUrl}/api/mysteries/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        puzzleId: 'rid-1',
        selectedIndex: 2
      })
    });
    assert.equal(res1.status, 200);
    const json1 = await res1.json();
    assert.equal(json1.data.isCorrect, true);

    // Incorrect answer test
    const res2 = await fetch(`${baseUrl}/api/mysteries/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        puzzleId: 'rid-1',
        selectedIndex: 0
      })
    });
    assert.equal(res2.status, 200);
    const json2 = await res2.json();
    assert.equal(json2.data.isCorrect, false);
  });
});

describe('10. Owl Dispatch System', () => {
  test('POST /api/owls dispatches a message to a student', async () => {
    const res = await fetch(`${baseUrl}/api/owls`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderId: 'student-aris-thorne',
        senderName: 'Aris Thorne',
        recipientId: 'p-1',
        message: 'Meet at the scriptoria before twilight.'
      })
    });

    assert.equal(res.status, 201);
    const json = await res.json();
    assert.equal(json.success, true);
    assert.equal(json.data.recipientName, 'Lyra Valerius');
    assert.equal(json.data.status, 'Dispatched');
  });
});

describe('11. Daily Schedule', () => {
  test('GET /api/schedule returns student timetable', async () => {
    const res = await fetch(`${baseUrl}/api/schedule`);
    assert.equal(res.status, 200);

    const json = await res.json();
    assert.equal(json.success, true);
    assert.equal(json.data.length, 4);
  });

  test('PATCH /api/schedule/:id/status toggles completed/upcoming', async () => {
    const res = await fetch(`${baseUrl}/api/schedule/sched-1/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: 'student-aris-thorne' })
    });

    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.success, true);
    assert.equal(json.data.status, 'Upcoming');
  });
});

describe('12. Validation and Safe Error Handling', () => {
  test('GET nonexistent route should return safe 404 JSON', async () => {
    const res = await fetch(`${baseUrl}/api/nonexistent-portal`);
    assert.equal(res.status, 404);

    const json = await res.json();
    assert.equal(json.success, false);
    assert.equal(json.error.code, 'NOT_FOUND');
    assert.ok(json.error.message.includes('Route not found'));
  });

  test('GET /api/events/invalid-id should return 404 with structured error', async () => {
    const res = await fetch(`${baseUrl}/api/events/non-existent-event-999`);
    assert.equal(res.status, 404);

    const json = await res.json();
    assert.equal(json.success, false);
    assert.equal(json.error.code, 'NOT_FOUND');
  });

  test('POST /api/houses/ravencrest/points with invalid amount should return 400', async () => {
    const res = await fetch(`${baseUrl}/api/houses/ravencrest/points`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 'invalid-number',
        reason: 'Test'
      })
    });

    assert.equal(res.status, 400);
    const json = await res.json();
    assert.equal(json.success, false);
    assert.equal(json.error.code, 'VALIDATION_ERROR');
  });

  test('POST /api/owls with missing recipient should return 400', async () => {
    const res = await fetch(`${baseUrl}/api/owls`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'No recipient'
      })
    });

    assert.equal(res.status, 400);
    const json = await res.json();
    assert.equal(json.success, false);
    assert.equal(json.error.code, 'VALIDATION_ERROR');
  });
});

describe('13. Phase 2B Department Extended Workflows', () => {
  test('PATCH /api/locations/pathways/:id/toggle closes and reopens pathway', async () => {
    const res = await fetch(`${baseUrl}/api/locations/pathways/path-1/toggle`, { method: 'PATCH' });
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.success, true);
    assert.equal(json.data.id, 'path-1');
    assert.equal(typeof json.data.isUnlocked, 'boolean');
  });

  test('PUT /api/students/:id updates student dossier with skills & bio', async () => {
    const res = await fetch(`${baseUrl}/api/students/student-aris-thorne`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Master of Celestial Runes',
        skills: ['Ancient Runes', 'Chronomancy', 'Aero-Tactics'],
        bio: 'Updated senior thesis on ley-line harmonic resonance.'
      })
    });
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.success, true);
    assert.equal(json.data.title, 'Master of Celestial Runes');
    assert.ok(json.data.skills.includes('Chronomancy'));
  });

  test('POST /api/sports/matches/:id/simulate simulates match deterministically', async () => {
    const res = await fetch(`${baseUrl}/api/sports/matches/match-3/simulate`, { method: 'POST' });
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.success, true);
    assert.ok(json.data.match);
    assert.equal(json.data.match.status, 'Completed');
    assert.equal(typeof json.data.match.homeScore, 'number');
  });

  test('POST /api/courses/brew-potion simulates deterministic brewing', async () => {
    const res = await fetch(`${baseUrl}/api/courses/brew-potion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ingredientIds: ['ing-2', 'ing-3'],
        heatLevel: 'Steady Flame',
        stirDirection: 'Clockwise'
      })
    });
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.success, true);
    assert.ok(json.data.potionName);
    assert.ok(json.data.disclaimer.includes('fictional wizarding simulation'));
  });

  test('POST /api/courses/quizzes/submit calculates score and awards house points', async () => {
    const res = await fetch(`${baseUrl}/api/courses/quizzes/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courseCode: 'TRANS-501',
        answers: { q1: 1, q2: 3, q3: 1 }
      })
    });
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.success, true);
    assert.equal(json.data.scorePercent, 100);
    assert.equal(json.data.passed, true);
    assert.equal(json.data.pointsAwarded, 25);
  });

  test('POST /api/houses/sorting-quiz provides transparent house affinity', async () => {
    const res = await fetch(`${baseUrl}/api/houses/sorting-quiz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        answers: { q1: 0, q2: 0, q3: 0, q4: 0 }
      })
    });
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.success, true);
    assert.equal(json.data.sortedHouse.id, 'ravencrest');
    assert.equal(json.data.breakdownPercentages.ravencrest, 100);
  });

  test('POST /api/mysteries/ask-scribe returns verified lore from archives', async () => {
    const res = await fetch(`${baseUrl}/api/mysteries/ask-scribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'What are the properties of crushed moonstone?'
      })
    });
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.success, true);
    assert.equal(json.data.status, 'Verified Lore');
    assert.ok(json.data.answer.includes('Moonstone'));
  });
});
