/**
 * Spellbound Academy - Centralized Frontend API Service
 * Connects UI components to the Express + SQLite backend (/api)
 * Provides resilient error handling, status checking, and fallback mechanisms.
 */

const BASE_URL = '/api';

/**
 * Generic fetch wrapper with JSON serialization and structured error handling
 */
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg = data?.error || `Request failed with status ${response.status}`;
      const err = new Error(errorMsg);
      err.status = response.status;
      err.details = data?.details;
      throw err;
    }

    return data;
  } catch (error) {
    console.warn(`[Spellbound API] Request to ${endpoint} failed:`, error.message);
    throw error;
  }
}

// ============================================================================
// 1. LOCATIONS & CAMPUS NAVIGATION (Explore Hogwarts)
// ============================================================================

export async function fetchLocations() {
  return request('/locations');
}

export async function fetchLocationById(id) {
  return request(`/locations/${id}`);
}

export async function fetchPathways() {
  return request('/locations/pathways');
}

export async function togglePathwayLock(pathwayId) {
  return request(`/locations/pathways/${pathwayId}/toggle`, {
    method: 'PATCH',
  });
}

// ============================================================================
// 2. STUDENTS DIRECTORY & DOSSIERS (People of the Wizarding World)
// ============================================================================

export async function fetchStudents(params = {}) {
  const query = new URLSearchParams();
  if (params.house) query.append('house', params.house);
  if (params.mentor) query.append('mentor', 'true');
  if (params.subject) query.append('subject', params.subject);
  if (params.skill) query.append('skill', params.skill);
  if (params.search) query.append('search', params.search);
  if (params.subject && params.subject !== 'All Subjects') query.append('subject', params.subject);
  if (params.topic && params.topic !== 'All Topics') query.append('topic', params.topic);
  if (params.resourceType && params.resourceType !== 'All Types') query.append('resourceType', params.resourceType);
  if (params.rarity && params.rarity !== 'All Rarities') query.append('rarity', params.rarity);

  const qs = query.toString() ? `?${query.toString()}` : '';
  return request(`/students${qs}`);
}

export async function fetchCurrentStudent() {
  return request('/students/current/dossier');
}

export async function fetchStudentById(id) {
  return request(`/students/${id}`);
}

export async function updateStudentProfile(id, updates) {
  return request(`/students/${id}`, {
    method: 'PUT',
    body: updates,
  });
}

// ============================================================================
// 3. SPORTS DEPARTMENT (Skyspire Broomstick League)
// ============================================================================

export async function fetchSportsStandings() {
  return request('/sports/standings');
}

export async function fetchSportsMatches(status) {
  const qs = status ? `?status=${encodeURIComponent(status)}` : '';
  return request(`/sports/matches${qs}`);
}

export async function fetchSportsTeams() {
  return request('/sports/teams');
}

export async function registerSportsTeam(teamData) {
  return request('/sports/teams', {
    method: 'POST',
    body: teamData,
  });
}

export async function updateMatchScore(matchId, scoreData) {
  return request(`/sports/matches/${matchId}/score`, {
    method: 'PATCH',
    body: scoreData,
  });
}

export async function simulateMatch(matchId) {
  return request(`/sports/matches/${matchId}/simulate`, {
    method: 'POST',
  });
}

export async function fetchTournamentBracket() {
  return request('/sports/bracket');
}

// ============================================================================
// 4. ACADEMICS & MAGICAL LABS
// ============================================================================

export async function fetchCourses() {
  return request('/courses');
}

export async function fetchCourseByCode(code) {
  return request(`/courses/${code}`);
}

export async function fetchLearningResources(params = {}) {
  const query = new URLSearchParams();
  if (params.courseId) query.append('courseId', params.courseId);
  if (params.rarity) query.append('rarity', params.rarity);
  if (params.search) query.append('search', params.search);
  if (params.subject && params.subject !== 'All Subjects') query.append('subject', params.subject);
  if (params.topic && params.topic !== 'All Topics') query.append('topic', params.topic);
  if (params.resourceType && params.resourceType !== 'All Types') query.append('resourceType', params.resourceType);
  if (params.rarity && params.rarity !== 'All Rarities') query.append('rarity', params.rarity);

  const qs = query.toString() ? `?${query.toString()}` : '';
  return request(`/courses/resources${qs}`);
}

export async function fetchPotionIngredients() {
  return request('/courses/potion-ingredients');
}

export async function brewPotion(brewData) {
  return request('/courses/brew-potion', {
    method: 'POST',
    body: brewData,
  });
}

export async function submitCourseQuiz(quizData) {
  return request('/courses/quizzes/submit', {
    method: 'POST',
    body: quizData,
  });
}

export async function fetchStudentAcademicProgress(studentId) {
  return request(`/courses/progress/${studentId}`);
}

// ============================================================================
// 5. COMMON ROOMS & WIZARDING SOCIAL NETWORK
// ============================================================================

export async function fetchCommunityPosts(category) {
  const qs = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
  return request(`/community/posts${qs}`);
}

export async function createCommunityPost(postData) {
  return request('/community/posts', {
    method: 'POST',
    body: postData,
  });
}

export async function signCommunityPost(postId, studentId = 'student-aris-thorne') {
  return request(`/community/posts/${postId}/sign`, {
    method: 'POST',
    body: { studentId },
  });
}

export async function fetchPostReplies(postId) {
  return request(`/community/posts/${postId}/replies`);
}

export async function createPostReply(postId, replyData) {
  return request(`/community/posts/${postId}/replies`, {
    method: 'POST',
    body: replyData,
  });
}

export async function reportCommunityPost(postId, reason = 'Violates Hogwarts decorum') {
  return request(`/community/posts/${postId}/report`, {
    method: 'POST',
    body: { reason },
  });
}

export async function fetchCommunities() {
  return request('/community/groups');
}

export async function toggleJoinCommunity(communityId) {
  return request(`/community/groups/${communityId}/join`, {
    method: 'POST',
  });
}

// ============================================================================
// 6. HOUSES & EVENTS
// ============================================================================

export async function fetchHouses() {
  return request('/houses');
}

export async function fetchHouseById(id) {
  return request(`/houses/${id}`);
}

export async function fetchPointsHistory(limit = 10) {
  return request(`/houses/history?limit=${limit}`);
}

export async function awardHousePoints(houseId, pointsData) {
  return request(`/houses/${houseId}/points`, {
    method: 'POST',
    body: pointsData,
  });
}

export async function submitSortingQuiz(answers) {
  return request('/houses/sorting-quiz', {
    method: 'POST',
    body: { answers },
  });
}

export async function fetchEvents(category) {
  const qs = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
  return request(`/events${qs}`);
}

export async function fetchEventById(id) {
  return request(`/events/${id}`);
}

export async function toggleEventRsvp(eventId, studentId = 'student-aris-thorne') {
  return request(`/events/${eventId}/rsvp`, {
    method: 'POST',
    body: { studentId },
  });
}

// ============================================================================
// 7. DEPARTMENT OF MYSTERIES
// ============================================================================

export async function fetchMysteryPuzzles() {
  return request('/mysteries/puzzles');
}

export async function verifyMysteryAnswer(puzzleId, answer, studentId = 'student-aris-thorne') {
  return request('/mysteries/verify', {
    method: 'POST',
    body: { puzzleId, selectedIndex: answer, studentId },
  });
}

export async function fetchMysteryArchives(params = {}) {
  const query = new URLSearchParams();
  if (params.chamber) query.append('chamber', params.chamber);
  if (params.difficulty) query.append('difficulty', params.difficulty);
  if (params.search) query.append('search', params.search);
  if (params.subject && params.subject !== 'All Subjects') query.append('subject', params.subject);
  if (params.topic && params.topic !== 'All Topics') query.append('topic', params.topic);
  if (params.resourceType && params.resourceType !== 'All Types') query.append('resourceType', params.resourceType);
  if (params.rarity && params.rarity !== 'All Rarities') query.append('rarity', params.rarity);

  const qs = query.toString() ? `?${query.toString()}` : '';
  return request(`/mysteries/archives${qs}`);
}

export async function fetchArchiveFilters() {
  return request('/mysteries/filters');
}

export async function fetchMysteryResourceById(id) {
  return request(`/mysteries/resources/${id}`);
}

export async function fetchMysteryRecommendations(studentId = 'student-aris-thorne') {
  return request(`/mysteries/recommendations?studentId=${studentId}`);
}

export async function askArchivalScribe(prompt) {
  return request('/mysteries/ask-scribe', {
    method: 'POST',
    body: { prompt },
  });
}

// ============================================================================
// 8. SCHEDULE, OWLS & SYSTEM HEALTH
// ============================================================================

export async function fetchDailySchedule() {
  return request('/schedule');
}

export async function toggleScheduleStatus(scheduleId) {
  return request(`/schedule/${scheduleId}/status`, {
    method: 'PATCH',
  });
}

export async function dispatchOwl(owlData) {
  return request('/owls', {
    method: 'POST',
    body: owlData,
  });
}

export async function fetchSystemHealth() {
  return request('/health');
}
