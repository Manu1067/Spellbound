/**
 * Spellbound Academy REST API Client
 * Seamlessly interfaces with http://localhost:5000/api with robust local mock fallbacks.
 */

import * as mockData from '../data/mockData';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

async function apiFetch(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error?.message || `HTTP error ${res.status}`);
    }

    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn(`[Spellbound API] Falling back for ${endpoint}:`, err.message);
    throw err;
  }
}

// 1. Health
export async function getHealth() {
  return apiFetch('/health').catch(() => ({ status: 'mock', academy: 'Spellbound Academy' }));
}

// 2. Locations & Campus Cartography
export async function getCampusLocations(zone) {
  const query = zone && zone !== 'All' ? `?zone=${encodeURIComponent(zone)}` : '';
  return apiFetch(`/locations${query}`).catch(() => {
    if (!zone || zone === 'All') return mockData.campusLocations;
    return mockData.campusLocations.filter((l) => l.zone === zone);
  });
}

export async function getLocationDirections(fromId, toId) {
  return apiFetch(`/locations/directions?from=${fromId}&to=${toId}`).catch(() => {
    // Local Dijkstra fallback
    return calculateLocalDijkstra(fromId, toId);
  });
}

// Local Dijkstra implementation for fallback resilience
function calculateLocalDijkstra(fromId, toId) {
  const locMap = new Map(mockData.campusLocations.map((l) => [l.id, l]));
  const from = locMap.get(fromId);
  const to = locMap.get(toId);

  if (!from || !to) throw new Error('Location not found');
  if (fromId === toId) {
    return {
      from,
      to,
      path: [from],
      totalDistanceMeters: 0,
      estimatedWalkMinutes: 0,
      instructions: ['You are already at your destination.']
    };
  }

  const pathways = mockData.campusPathways;
  const graph = new Map();
  for (const l of mockData.campusLocations) graph.set(l.id, []);

  for (const p of pathways) {
    graph.get(p.fromId)?.push({ neighbor: p.toId, weight: p.distanceMeters, name: p.name, type: p.pathType });
    graph.get(p.toId)?.push({ neighbor: p.fromId, weight: p.distanceMeters, name: p.name, type: p.pathType });
  }

  const distances = new Map();
  const previous = new Map();
  const unvisited = new Set(mockData.campusLocations.map((l) => l.id));

  for (const l of mockData.campusLocations) distances.set(l.id, Infinity);
  distances.set(fromId, 0);

  while (unvisited.size > 0) {
    let current = null;
    let min = Infinity;
    for (const node of unvisited) {
      if (distances.get(node) < min) {
        min = distances.get(node);
        current = node;
      }
    }
    if (!current || min === Infinity || current === toId) break;
    unvisited.delete(current);

    for (const edge of graph.get(current) || []) {
      if (!unvisited.has(edge.neighbor)) continue;
      const alt = distances.get(current) + edge.weight;
      if (alt < distances.get(edge.neighbor)) {
        distances.set(edge.neighbor, alt);
        previous.set(edge.neighbor, { from: current, edge });
      }
    }
  }

  const pathIds = [];
  const legs = [];
  let curr = toId;
  while (curr !== fromId) {
    pathIds.unshift(curr);
    const prev = previous.get(curr);
    if (!prev) break;
    legs.unshift({
      fromName: locMap.get(prev.from).name,
      toName: locMap.get(curr).name,
      pathwayName: prev.edge.name,
      pathType: prev.edge.type,
      distanceMeters: prev.edge.weight
    });
    curr = prev.from;
  }
  pathIds.unshift(fromId);

  const totalDist = distances.get(toId);
  return {
    from,
    to,
    path: pathIds.map((id) => locMap.get(id)),
    totalDistanceMeters: totalDist,
    estimatedWalkMinutes: Math.max(1, Math.round(totalDist / 75)),
    legs,
    instructions: legs.map((leg, i) => `Step ${i + 1}: Depart ${leg.fromName} via ${leg.pathwayName} (${leg.distanceMeters}m) toward ${leg.toName}.`),
    illustrativeNotice: 'Coordinates, distances, and route geometry are illustrative for navigation prototyping until verified against physical survey.'
  };
}

// 3. Students & Like-Minded Discovery
export async function getStudents(filters = {}) {
  const params = new URLSearchParams();
  if (filters.house && filters.house !== 'All Houses') params.set('house', filters.house);
  if (filters.branch && filters.branch !== 'All') params.set('branch', filters.branch);
  if (filters.language && filters.language !== 'All') params.set('language', filters.language);
  if (filters.hobby && filters.hobby !== 'All') params.set('hobby', filters.hobby);
  if (filters.interest && filters.interest !== 'All') params.set('interest', filters.interest);
  if (filters.search) params.set('search', filters.search);

  const qs = params.toString() ? `?${params.toString()}` : '';
  return apiFetch(`/students${qs}`).catch(() => {
    return mockData.studentDirectory.filter((s) => {
      if (filters.house && filters.house !== 'All Houses' && s.house !== filters.house) return false;
      if (filters.branch && filters.branch !== 'All' && s.branch !== filters.branch) return false;
      if (filters.language && filters.language !== 'All' && !s.languages.includes(filters.language)) return false;
      if (filters.hobby && filters.hobby !== 'All' && !s.hobbies.includes(filters.hobby)) return false;
      if (filters.interest && filters.interest !== 'All' && !s.fieldsOfInterest.includes(filters.interest)) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        return s.name.toLowerCase().includes(q) || s.branch.toLowerCase().includes(q) || s.bio.toLowerCase().includes(q);
      }
      return true;
    });
  });
}

export async function getLikeMindedStudents(studentId = 'student-aris-thorne') {
  return apiFetch(`/students/match?studentId=${studentId}`).catch(() => {
    // Local deterministic matching
    const current = mockData.currentUser;
    const matches = mockData.studentDirectory
      .filter((s) => s.id !== current.id)
      .map((candidate) => {
        let score = 0;
        const sharedInterests = candidate.fieldsOfInterest.filter((f) => current.fieldsOfInterest.includes(f));
        const sharedHobbies = candidate.hobbies.filter((h) => current.hobbies.includes(h));
        const sharedLanguages = candidate.languages.filter((l) => current.languages.includes(l));
        const sameBranch = candidate.branch === current.branch;

        score += sharedInterests.length * 3;
        score += sharedHobbies.length * 2;
        score += sharedLanguages.length * 2;
        if (sameBranch) score += 2;

        const sharedTags = [
          ...sharedInterests.map((t) => ({ label: t, category: 'Interest' })),
          ...sharedHobbies.map((t) => ({ label: t, category: 'Hobby' })),
          ...sharedLanguages.map((t) => ({ label: t, category: 'Language' })),
          ...(sameBranch ? [{ label: candidate.branch, category: 'Branch' }] : [])
        ];

        return {
          student: candidate,
          score,
          matchPercentage: Math.min(98, Math.round((score / 16) * 100)),
          sharedTags,
          matchSummary: `${sharedTags.length} common attributes with ${current.name}`
        };
      })
      .sort((a, b) => b.score - a.score);

    return { sourceStudent: current, totalMatches: matches.length, matches };
  });
}

export async function dispatchOwl(recipientId, message) {
  return apiFetch('/owls', {
    method: 'POST',
    body: JSON.stringify({
      recipientId,
      message,
      senderId: mockData.currentUser.id,
      senderName: mockData.currentUser.name
    })
  }).catch(() => ({
    status: 'Dispatched',
    senderName: mockData.currentUser.name,
    dispatchedAt: new Date().toISOString()
  }));
}

// 4. Laboratories & Academics
export async function getLaboratories() {
  return apiFetch('/laboratories').catch(() => mockData.laboratoriesData);
}

export async function getLaboratoryById(id) {
  return apiFetch(`/laboratories/${id}`).catch(() => {
    return mockData.laboratoriesData.find((l) => l.id === id || l.code.toLowerCase() === id.toLowerCase()) || null;
  });
}

// 5. Houses & Featured Clubs
export async function getHouses() {
  return apiFetch('/houses').catch(() => mockData.housesData);
}

export async function awardHousePoints(houseId, amount, reason) {
  return apiFetch(`/houses/${houseId}/points`, {
    method: 'POST',
    body: JSON.stringify({ amount, reason, awardedBy: 'Faculty Committee' })
  }).catch(() => ({
    houseId,
    pointsAwarded: amount,
    totalPoints: 1550,
    reason
  }));
}

export async function getFeaturedClubs() {
  return apiFetch('/clubs').catch(() => mockData.studentClubs);
}

// 6. Events & Registration
export async function getEvents() {
  return apiFetch('/events').catch(() => mockData.campusEvents);
}

export async function toggleEventRsvp(eventId) {
  return apiFetch(`/events/${eventId}/rsvp`, {
    method: 'POST',
    body: JSON.stringify({ studentId: mockData.currentUser.id })
  }).catch(() => ({
    eventId,
    isRsvp: true,
    rsvpCount: 250
  }));
}

// 7. Sports Department
export async function getSportsDisciplines(category) {
  const query = category && category !== 'All' ? `?category=${category}` : '';
  return apiFetch(`/sports/disciplines${query}`).catch(() => {
    if (!category || category === 'All') return mockData.sportsDisciplinesData;
    return mockData.sportsDisciplinesData.filter((s) => s.category === category);
  });
}

export async function registerSportInterest(sportId, experienceLevel, preferredRole) {
  return apiFetch('/sports/register', {
    method: 'POST',
    body: JSON.stringify({
      sportId,
      experienceLevel,
      preferredRole,
      studentId: mockData.currentUser.id
    })
  }).catch(() => ({
    sportId,
    status: 'Registered',
    registeredAt: new Date().toISOString()
  }));
}

export async function getSportsStandings() {
  return apiFetch('/sports/standings').catch(() => [
    { rank: 1, team: "Ravenclaw Grandmasters", wins: 5, losses: 0, points: 15, color: "#15254A" },
    { rank: 2, team: "Gryffindor Strikers", wins: 4, losses: 1, points: 12, color: "#7B1E28" },
    { rank: 3, team: "Hufflepuff Badgers", wins: 3, losses: 1, points: 10, color: "#8C6218" },
    { rank: 4, team: "Slytherin Vipers FC", wins: 3, losses: 2, points: 9, color: "#1F4734" }
  ]);
}

// 8. Wizarding Social Network
export async function getCommunityPosts(category) {
  const query = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
  return apiFetch(`/community/posts${query}`).catch(() => [
    {
      id: "note-1",
      author: "Lyra Valerius",
      house: "Ravenclaw",
      category: "Study Circle",
      title: "Ancient Runes & C2S Verilog Review Study Circle",
      body: "Meeting tonight in the Academic Building East Alcove at 19:30. Bring your styluses and laptop stations. Herbal tea provided.",
      signatures: 12,
      likes: 18,
      dislikes: 1,
      isSigned: false,
      userReaction: "like",
      createdAt: "1 hour ago"
    },
    {
      id: "note-2",
      author: "Cedric Blackthorn",
      house: "Gryffindor",
      category: "Sports Gathering",
      title: "Inter-House Volleyball & Kho-Kho Practice Trials",
      body: "Open tryouts for the Autumn Sports Fest on Saturday at 16:00 on the West Courts. All skill levels warmly welcomed!",
      signatures: 24,
      likes: 32,
      dislikes: 2,
      isSigned: true,
      userReaction: null,
      createdAt: "3 hours ago"
    },
    {
      id: "note-3",
      author: "Thaddeus Thorne",
      house: "Hufflepuff",
      category: "Academic Collaboration",
      title: "Sustainable Water Recycling System Project Squad",
      body: "Looking for two electronics/mechanical adepts to automate valve telemetry on our campus garden filtration unit.",
      signatures: 9,
      likes: 14,
      dislikes: 0,
      isSigned: false,
      userReaction: null,
      createdAt: "5 hours ago"
    },
    {
      id: "note-4",
      author: "Isolde Ravenshadow",
      house: "Slytherin",
      category: "Academic Collaboration",
      title: "Exchanging Purified Copper Reagents for FPGA Dev Kits",
      body: "Have 5 drams of spectroscopic reagent. Looking to test dual-clock FIFO modules in the C2S Lab with fellow designers.",
      signatures: 8,
      likes: 11,
      dislikes: 1,
      isSigned: false,
      userReaction: null,
      createdAt: "Yesterday"
    }
  ]);
}

export async function createCommunityPost(title, body, category) {
  return apiFetch('/community/posts', {
    method: 'POST',
    body: JSON.stringify({
      title,
      body,
      category,
      authorId: mockData.currentUser.id,
      authorName: mockData.currentUser.name,
      houseId: mockData.currentUser.house.toLowerCase()
    })
  }).catch(() => ({
    id: `note-${Date.now()}`,
    title,
    body,
    category,
    author: mockData.currentUser.name,
    house: mockData.currentUser.house,
    signatures: 1,
    likes: 1,
    dislikes: 0,
    isSigned: true,
    userReaction: "like",
    createdAt: "Just now"
  }));
}

export async function reactToCommunityPost(postId, reactionType) {
  return apiFetch(`/community/posts/${postId}/react`, {
    method: 'POST',
    body: JSON.stringify({
      studentId: mockData.currentUser.id,
      reactionType
    })
  }).catch(() => ({
    postId,
    reactionType,
    success: true
  }));
}

export async function signCommunityPost(postId) {
  return apiFetch(`/community/posts/${postId}/sign`, {
    method: 'POST',
    body: JSON.stringify({ studentId: mockData.currentUser.id })
  }).catch(() => ({ postId, isSigned: true, signatures: 15 }));
}

// 9. Department of Mysteries
export async function getStudentCouncil() {
  return apiFetch('/mysteries/council').catch(() => mockData.studentCouncilData);
}

export async function getOfficialNotices(priority) {
  const query = priority && priority !== 'All' ? `?priority=${priority}` : '';
  return apiFetch(`/mysteries/notices${query}`).catch(() => {
    if (!priority || priority === 'All') return mockData.officialNoticesData;
    return mockData.officialNoticesData.filter((n) => n.priority === priority);
  });
}

export async function getConfessions() {
  return apiFetch('/mysteries/confessions').catch(() => [
    { id: "c-1", message: "To the scholar in the Grand Library reading Runic Cryptography every Tuesday night: your quiet focus inspires everyone in Alcove 4.", category: "Kindness", likesCount: 42 },
    { id: "c-2", message: "I accidentally brewed Draught of Sleep instead of Draught of Focus right before the mid-term exam. Most peaceful nap ever.", category: "Humor", likesCount: 67 }
  ]);
}

export async function submitConfession(message, category) {
  return apiFetch('/mysteries/confessions', {
    method: 'POST',
    body: JSON.stringify({ message, category })
  }).catch(() => ({
    id: `conf-${Date.now()}`,
    message,
    category,
    likesCount: 0,
    status: 'Approved'
  }));
}

export async function likeConfession(id) {
  return apiFetch(`/mysteries/confessions/${id}/like`, { method: 'POST' }).catch(() => ({ id, likesCount: 43 }));
}

export async function submitComplaint(data) {
  return apiFetch('/mysteries/complaints', {
    method: 'POST',
    body: JSON.stringify({ ...data, studentId: mockData.currentUser.id })
  }).catch(() => ({
    referenceId: `REF-MYST-${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'Submitted',
    category: data.category,
    subject: data.subject,
    submittedAt: new Date().toISOString()
  }));
}

export async function getComplaintStatus(refId) {
  return apiFetch(`/mysteries/complaints/${refId}`).catch(() => ({
    referenceId: refId,
    status: 'Under Review',
    subject: 'Reported Facility Maintenance',
    category: 'Hostel'
  }));
}
