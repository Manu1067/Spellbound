import test, { describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';
import { initializeDatabase } from '../src/db/init.js';
import { closeDatabase } from '../src/db/connection.js';

let server;
let baseUrl;

before(async () => {
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
  });
});

describe('2. Campus Locations & Dijkstra Shortest Path', () => {
  test('GET /api/locations returns 5 required campus locations', async () => {
    const res = await fetch(`${baseUrl}/api/locations`);
    assert.equal(res.status, 200);

    const json = await res.json();
    assert.equal(json.success, true);
    assert.equal(json.data.length, 5);

    const names = json.data.map((l) => l.name);
    assert.ok(names.includes('Academic Building'));
    assert.ok(names.includes("Girls' Hostel"));
    assert.ok(names.includes("Boys' Hostel"));
    assert.ok(names.includes('Mess'));
    assert.ok(names.includes('Cafeteria'));
  });

  test('GET /api/locations/directions calculates shortest path via Dijkstra', async () => {
    // Route from Girls Hostel to Mess
    const res = await fetch(`${baseUrl}/api/locations/directions?from=loc-hostel-girls&to=loc-mess`);
    assert.equal(res.status, 200);

    const json = await res.json();
    assert.equal(json.success, true);
    assert.ok(Array.isArray(json.data.path));
    assert.ok(json.data.path.length >= 2);
    assert.equal(json.data.from.id, 'loc-hostel-girls');
    assert.equal(json.data.to.id, 'loc-mess');
    assert.ok(json.data.totalDistanceMeters > 0);
    assert.ok(json.data.estimatedWalkMinutes > 0);
    assert.ok(Array.isArray(json.data.instructions));
    assert.ok(json.data.instructions.length >= 1);
  });
});

describe('3. Student Directory & Like-Minded Discovery', () => {
  test('GET /api/students returns profiles with branch, languages, hobbies, and interests', async () => {
    const res = await fetch(`${baseUrl}/api/students`);
    assert.equal(res.status, 200);

    const json = await res.json();
    assert.equal(json.success, true);
    assert.ok(json.data.length >= 7);

    const first = json.data[0];
    assert.ok(first.branch);
    assert.ok(Array.isArray(first.languages));
    assert.ok(Array.isArray(first.hobbies));
    assert.ok(Array.isArray(first.fieldsOfInterest));
  });

  test('GET /api/students/match calculates like-minded matches with shared tags', async () => {
    const res = await fetch(`${baseUrl}/api/students/match?studentId=student-aris-thorne`);
    assert.equal(res.status, 200);

    const json = await res.json();
    assert.equal(json.success, true);
    assert.ok(json.data.matches.length > 0);

    const topMatch = json.data.matches[0];
    assert.ok(topMatch.score > 0);
    assert.ok(topMatch.matchPercentage > 0);
    assert.ok(Array.isArray(topMatch.sharedTags));
    assert.ok(topMatch.sharedTags.length > 0);
  });
});

describe('4. Academics: Five Required Laboratories & Resources', () => {
  test('GET /api/laboratories returns the 5 required labs', async () => {
    const res = await fetch(`${baseUrl}/api/laboratories`);
    assert.equal(res.status, 200);

    const json = await res.json();
    assert.equal(json.success, true);
    assert.equal(json.data.length, 5);

    const names = json.data.map((l) => l.name);
    assert.ok(names.includes('Mechanical Lab'));
    assert.ok(names.includes('Physics Lab'));
    assert.ok(names.includes('C2S Lab'));
    assert.ok(names.includes('Electronics Lab'));
    assert.ok(names.includes('Computer Lab'));
  });

  test('GET /api/laboratories/lab-c2s returns equipment and manuals', async () => {
    const res = await fetch(`${baseUrl}/api/laboratories/lab-c2s`);
    assert.equal(res.status, 200);

    const json = await res.json();
    assert.equal(json.success, true);
    assert.equal(json.data.code, 'C2S-LAB');
    assert.ok(Array.isArray(json.data.availableEquipment));
    assert.ok(Array.isArray(json.data.safetyGuidelines));
    assert.ok(Array.isArray(json.data.resources));
    assert.ok(json.data.resources.length >= 2);
  });
});

describe('5. Houses & Four Featured Student Clubs', () => {
  test('GET /api/houses returns traditional 4 house names', async () => {
    const res = await fetch(`${baseUrl}/api/houses`);
    assert.equal(res.status, 200);

    const json = await res.json();
    assert.equal(json.success, true);
    const names = json.data.map((h) => h.name);
    assert.ok(names.includes('Gryffindor'));
    assert.ok(names.includes('Slytherin'));
    assert.ok(names.includes('Ravenclaw'));
    assert.ok(names.includes('Hufflepuff'));
  });

  test('GET /api/clubs returns the 4 featured clubs', async () => {
    const res = await fetch(`${baseUrl}/api/clubs`);
    assert.equal(res.status, 200);

    const json = await res.json();
    assert.equal(json.success, true);
    assert.equal(json.data.length, 4);

    const names = json.data.map((c) => c.name);
    assert.ok(names.includes('Literary and Debating Club'));
    assert.ok(names.includes('Music Club'));
    assert.ok(names.includes('Dance Club'));
    assert.ok(names.includes('Fine Arts Club'));
  });
});

describe('6. Sports Department: Outdoor & Indoor Sports', () => {
  test('GET /api/sports/disciplines returns 6 outdoor and 3 indoor sports', async () => {
    const res = await fetch(`${baseUrl}/api/sports/disciplines`);
    assert.equal(res.status, 200);

    const json = await res.json();
    assert.equal(json.success, true);
    assert.equal(json.data.length, 9);

    const outdoor = json.data.filter((s) => s.category === 'Outdoor');
    const indoor = json.data.filter((s) => s.category === 'Indoor');

    assert.equal(outdoor.length, 6);
    assert.equal(indoor.length, 3);

    const outdoorNames = outdoor.map((s) => s.name);
    assert.ok(outdoorNames.includes('Volleyball'));
    assert.ok(outdoorNames.includes('Kho-Kho'));
    assert.ok(outdoorNames.includes('Kabaddi'));
    assert.ok(outdoorNames.includes('Football'));
    assert.ok(outdoorNames.includes('Throwball'));
    assert.ok(outdoorNames.includes('Badminton'));

    const indoorNames = indoor.map((s) => s.name);
    assert.ok(indoorNames.includes('Chess'));
    assert.ok(indoorNames.includes('Carroms'));
    assert.ok(indoorNames.includes('Table Tennis'));
  });

  test('POST /api/sports/register registers student interest', async () => {
    const res = await fetch(`${baseUrl}/api/sports/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: 'student-aris-thorne',
        sportId: 'sport-volleyball',
        experienceLevel: 'Intermediate',
        preferredRole: 'Setter'
      })
    });

    assert.equal(res.status, 201);
    const json = await res.json();
    assert.equal(json.success, true);
    assert.equal(json.data.sportName, 'Volleyball');
  });
});

describe('7. Department of Mysteries: 5 Sub-Modules', () => {
  test('A. Student Council returns verified members & announcements', async () => {
    const res = await fetch(`${baseUrl}/api/mysteries/council`);
    assert.equal(res.status, 200);

    const json = await res.json();
    assert.equal(json.success, true);
    assert.ok(json.data.length >= 4);
    assert.ok(json.data[0].role);
    assert.ok(Array.isArray(json.data[0].announcements));
  });

  test('B. Official Notices & Warnings returns prioritized notices', async () => {
    const res = await fetch(`${baseUrl}/api/mysteries/notices`);
    assert.equal(res.status, 200);

    const json = await res.json();
    assert.equal(json.success, true);
    assert.ok(json.data.length >= 4);
    assert.ok(json.data[0].priority);
    assert.ok(json.data[0].issuingAuthority);
  });

  test('C. Complaints Submission logs confidential complaint with reference ID', async () => {
    const res = await fetch(`${baseUrl}/api/mysteries/complaints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: 'student-aris-thorne',
        category: 'Hostel',
        subject: 'Room Heating Ward Flickering',
        description: 'Room 304 heating rune loses charge during midnight hours.',
        priority: 'Routine'
      })
    });

    assert.equal(res.status, 201);
    const json = await res.json();
    assert.equal(json.success, true);
    assert.ok(json.data.referenceId.startsWith('REF-MYST-'));
    assert.equal(json.data.isConfidential, true);

    // Track status by reference ID
    const trackRes = await fetch(`${baseUrl}/api/mysteries/complaints/${json.data.referenceId}`);
    assert.equal(trackRes.status, 200);
    const trackJson = await trackRes.json();
    assert.equal(trackJson.data.referenceId, json.data.referenceId);
  });

  test('D. Confessions creates anonymous post and supports likes', async () => {
    const createRes = await fetch(`${baseUrl}/api/mysteries/confessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'The sunset view from the Astronomy tower west arch is unforgettable.',
        category: 'Appreciation'
      })
    });

    assert.equal(createRes.status, 201);
    const createJson = await createRes.json();
    assert.equal(createJson.success, true);
    const id = createJson.data.id;

    // Like confession
    const likeRes = await fetch(`${baseUrl}/api/mysteries/confessions/${id}/like`, { method: 'POST' });
    assert.equal(likeRes.status, 200);
    const likeJson = await likeRes.json();
    assert.equal(likeJson.data.likesCount, 1);
  });
});
