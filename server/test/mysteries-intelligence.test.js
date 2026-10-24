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
  if (server) {
    server.close();
  }
  closeDatabase();
});

describe('SPELLBOUND — PHASE 3A: DEPARTMENT OF MYSTERIES INTELLIGENCE HUB', () => {
  test('1. Filters Endpoint: GET /api/mysteries/filters returns faceted metadata', async () => {
    const res = await fetch(`${baseUrl}/api/mysteries/filters`);
    assert.equal(res.status, 200);
    const json = await res.json();

    assert.equal(json.success, true);
    assert.ok(Array.isArray(json.data.subjects));
    assert.ok(Array.isArray(json.data.topics));
    assert.ok(Array.isArray(json.data.difficulties));
    assert.ok(Array.isArray(json.data.resourceTypes));
    assert.ok(Array.isArray(json.data.chambers));
    assert.ok(json.data.subjects.includes('Transfiguration'));
    assert.ok(json.data.subjects.includes('Ancient Runes'));
    assert.ok(json.data.difficulties.includes('Arch-Mage'));
  });

  test('2. Collection Search: GET /api/mysteries/archives returns approved records with search & filters', async () => {
    // 2a. All approved records
    const allRes = await fetch(`${baseUrl}/api/mysteries/archives`);
    assert.equal(allRes.status, 200);
    const allJson = await allRes.json();
    assert.equal(allJson.success, true);
    assert.ok(allJson.data.length >= 10);

    // 2b. Filter by subject
    const subjRes = await fetch(`${baseUrl}/api/mysteries/archives?subject=Transfiguration`);
    assert.equal(subjRes.status, 200);
    const subjJson = await subjRes.json();
    assert.ok(subjJson.data.length >= 2);
    for (const r of subjJson.data) {
      assert.equal(r.subject.toLowerCase(), 'transfiguration');
    }

    // 2c. Filter by difficulty
    const diffRes = await fetch(`${baseUrl}/api/mysteries/archives?difficulty=Arch-Mage`);
    assert.equal(diffRes.status, 200);
    const diffJson = await diffRes.json();
    assert.ok(diffJson.data.length >= 2);
    for (const r of diffJson.data) {
      assert.equal(r.difficulty, 'Arch-Mage');
    }

    // 2d. Search keyword "moonstone"
    const searchRes = await fetch(`${baseUrl}/api/mysteries/archives?search=moonstone`);
    assert.equal(searchRes.status, 200);
    const searchJson = await searchRes.json();
    assert.ok(searchJson.data.length >= 1);
    const matched = searchJson.data.some(r => r.title.includes('Alchemist') || r.title.includes('Solstice Serpent'));
    assert.ok(matched);

    // 2e. Empty search results
    const emptyRes = await fetch(`${baseUrl}/api/mysteries/archives?search=nonexistentterm12345`);
    assert.equal(emptyRes.status, 200);
    const emptyJson = await emptyRes.json();
    assert.equal(emptyJson.data.length, 0);
  });

  test('3. Single Resource Lookup: GET /api/mysteries/resources/:id returns full folios & handles missing items', async () => {
    // 3a. Valid resource
    const res = await fetch(`${baseUrl}/api/mysteries/resources/res-1`);
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.success, true);
    assert.equal(json.data.id, 'res-1');
    assert.equal(json.data.title, 'Codex of Living Metamorphosis');
    assert.equal(json.data.courseCode, 'TRANS-501');
    assert.ok(json.data.studyNotes.length > 20);
    assert.ok(json.data.citation.includes('Grand Library'));

    // 3b. Missing resource returns 404
    const notFoundRes = await fetch(`${baseUrl}/api/mysteries/resources/res-invalid-999`);
    assert.equal(notFoundRes.status, 404);
    const notFoundJson = await notFoundRes.json();
    assert.equal(notFoundJson.success, false);
    assert.equal(notFoundJson.error.code, 'NOT_FOUND');
  });

  test('4. Interactive Mystery Challenges: Solves, validates, awards points, and blocks duplicates', async () => {
    // Get puzzles
    const puzRes = await fetch(`${baseUrl}/api/mysteries/puzzles`);
    assert.equal(puzRes.status, 200);
    const puzJson = await puzRes.json();
    assert.ok(puzJson.data.length >= 4);

    // Solve riddle 4 (Alchemical Equation)
    const solveRes = await fetch(`${baseUrl}/api/mysteries/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        puzzleId: 'rid-4',
        selectedIndex: 0, // Crushed Moonstone
        studentId: 'student-aris-thorne'
      })
    });
    assert.equal(solveRes.status, 200);
    const solveJson = await solveRes.json();
    assert.equal(solveJson.success, true);
    assert.equal(solveJson.data.isCorrect, true);
    assert.equal(solveJson.data.pointsAwarded, 25);
    assert.ok(solveJson.data.explanation.includes('Crushed Moonstone'));

    // Repeat solve should award 0 duplicate points
    const repeatRes = await fetch(`${baseUrl}/api/mysteries/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        puzzleId: 'rid-4',
        selectedIndex: 0,
        studentId: 'student-aris-thorne'
      })
    });
    assert.equal(repeatRes.status, 200);
    const repeatJson = await repeatRes.json();
    assert.equal(repeatJson.data.pointsAwarded, 0);

    // Invalid answer
    const wrongRes = await fetch(`${baseUrl}/api/mysteries/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        puzzleId: 'rid-4',
        selectedIndex: 2,
        studentId: 'student-aris-thorne'
      })
    });
    assert.equal(wrongRes.status, 200);
    const wrongJson = await wrongRes.json();
    assert.equal(wrongJson.data.isCorrect, false);
    assert.equal(wrongJson.data.pointsAwarded, 0);
  });

  test('5. Personalised Recommendations: Grounded in student profile and progress', async () => {
    const recRes = await fetch(`${baseUrl}/api/mysteries/recommendations?studentId=student-aris-thorne`);
    assert.equal(recRes.status, 200);
    const recJson = await recRes.json();

    assert.equal(recJson.success, true);
    assert.equal(recJson.data.isDeterministic, true);
    assert.ok(recJson.data.recommendedResources.length >= 1);
    assert.ok(recJson.data.recommendedCommunities.length >= 1);
    assert.ok(recJson.data.recommendedEnigma.title);
    assert.ok(recJson.data.recentProgressSummary);
  });

  test('6. Archival Scribe (Compliant Grounded Intelligence): Handles relevant, unrelated, and empty queries', async () => {
    // 6a. Relevant question: Moonstone properties
    const relRes = await fetch(`${baseUrl}/api/mysteries/ask-scribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'What are the properties of crushed moonstone in potion brewing?' })
    });
    assert.equal(relRes.status, 200);
    const relJson = await relRes.json();
    assert.equal(relJson.data.status, 'Verified Lore');
    assert.ok(relJson.data.isGrounded);
    assert.ok(relJson.data.answer.includes('Moonstone'));
    assert.ok(relJson.data.source.includes('Grimoire of Subterranean Reagents'));
    assert.equal(relJson.data.courseCode, 'ALCH-520');

    // 6b. Relevant question: Acoustic wards
    const wardRes = await fetch(`${baseUrl}/api/mysteries/ask-scribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'How do acoustic wards harmonize through basalt stone?' })
    });
    assert.equal(wardRes.status, 200);
    const wardJson = await wardRes.json();
    assert.equal(wardJson.data.status, 'Verified Lore');
    assert.ok(wardJson.data.answer.includes('Sil-Astra') || wardJson.data.answer.includes('damping') || wardJson.data.answer.includes('resonance'));

    // 6c. Unrelated / out-of-domain question: Modern technology
    const outRes = await fetch(`${baseUrl}/api/mysteries/ask-scribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'How do I build a mobile smartphone app with React Native?' })
    });
    assert.equal(outRes.status, 200);
    const outJson = await outRes.json();
    assert.equal(outJson.data.status, 'Archival Boundary Notice');
    assert.equal(outJson.data.isGrounded, false);
    assert.ok(outJson.data.suggestedQueries.length >= 3);

    // 6d. Empty search / validation failure: 400 Bad Request
    const emptyRes = await fetch(`${baseUrl}/api/mysteries/ask-scribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: '   ' })
    });
    assert.equal(emptyRes.status, 400);
    const emptyJson = await emptyRes.json();
    assert.equal(emptyJson.success, false);
    assert.equal(emptyJson.error.code, 'VALIDATION_ERROR');
  });
});
