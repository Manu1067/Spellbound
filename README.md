# SPELLBOUND — Academy Platform

> **"Your world of magic. Your universe of possibilities."**

Spellbound is an immersive magical-academy student platform combining the atmosphere, lore, and visual grandeur of a fantasy academy with real-world functional campus architecture.

---

## 🏛️ The Seven Departments & Campus Architecture

1. **Explore Hogwarts** (`/explore`):
   - **Five Core Facilities**: *Academic Building*, *Girls' Hostel*, *Boys' Hostel*, *Mess*, and *Cafeteria*.
   - **Interactive Ley-Line Map**: Animated parchment cartography with glowing pathway ley-lines, hotspot nodes, and zoom/selection details.
   - **Dijkstra Shortest-Path Navigation**: Live graph-based pathfinding computing total meters, step-by-step waypoint directions, and estimated walking minutes.
   - **Accessibility & Mobile Alternative**: One-click toggle to an Accessible List View.
   - **Cartography Notice**: Clearly labels coordinates, pathway geometries, and walking times as illustrative until physical survey verification.

2. **People of the Wizarding World** (`/people`):
   - **Rich Student Profiles**: Academic branch, languages spoken, hobbies, fields of interest, skills, wand, patronus, and bio.
   - **Multi-Attribute Filters & Search**: Real-time filtering by House, Branch, Language, Hobby, and Field of Interest.
   - **Deterministic Affinity Engine**: "Find Like-Minded Students" algorithm calculating compatibility scores and prominently highlighting shared attribute tags (interests: +3, hobbies: +2, languages: +2, branch: +2).
   - **Student Dossiers & Owl Dispatch**: Modal inspector and owl parchment messaging system.
   - **Consent-Based Privacy**: Clear disclosure that directory visibility is consent-based for peer collaboration, keeping private credentials confidential.

3. **Sports Department** (`/sports`):
   - **Outdoor Sports (6 Disciplines)**: *Volleyball*, *Kho-Kho*, *Kabaddi*, *Football*, *Throwball*, and *Badminton*.
   - **Indoor Sports (3 Disciplines)**: *Chess*, *Carroms*, and *Table Tennis*.
   - **Category Navigation**: Instant switching between All Sports, Outdoor Sports, and Indoor Sports.
   - **Rules & Specifications**: Regulation team size, official campus venues, and equipment guidelines.
   - **Trial & Squad Registration**: Form modal connecting students to House and Varsity squad trials.
   - **Tournament Standings & Fixtures**: Live Inter-House Championship standings and scheduled matches.
   - **Reflex Training Simulator**: Interactive reaction-time agility drill for court intercepts.

4. **Academics & Magical Labs** (`/academics`):
   - **Five Specialized Laboratories**:
     1. *Mechanical Lab* (`MECH-LAB`): UTM tensile testers, subsonic wind tunnels, and 4-axis CNC stations.
     2. *Physics Lab* (`PHYS-LAB`): Laser interferometers, diffraction spectrometers, and Hall effect probes.
     3. *C2S Lab* (`C2S-LAB`): Specialized Chips-to-Startup lab for FPGA VLSI synthesis, mixed-signal DSOs, and cleanroom soldering.
     4. *Electronics Lab* (`ELEC-LAB`): Waveform generators, microcontrollers (ESP32/STM32), and communication benches.
     5. *Computer Lab* (`COMP-LAB`): GPU-accelerated computing workstations, Linux clusters, and 10Gbps fiber uplinks.
   - **Lab Equipment & Safety Protocols**: Highlighting machine inventories and mandatory laboratory safety guidelines.
   - **Organized Learning Resources**: Practical manuals, experiment guides, reference materials, and tutorials with instant codex downloads.
   - **Alchemical Simulation Station**: Interactive Potion Cauldron testing reagent stability and reaction stoichiometry.

5. **Houses & Events** (`/houses-events`):
   - **The Four Great Houses**: *Gryffindor*, *Slytherin*, *Ravenclaw*, and *Hufflepuff*.
   - **Great Hall Hourglasses**: Enchanted glass cylinders filled with thousands of floating gems (Rubies, Emeralds, Sapphires, and Citrine Amber).
   - **Faculty Points Consignment Ledger**: Interactive points award system with reason logs.
   - **The Four Featured Student Clubs**:
     1. *Literary and Debating Club*
     2. *Music Club*
     3. *Dance Club*
     4. *Fine Arts Club*
   - **Campus Events Calendar**: Live assemblies and gala registrations with RSVP tracking.

6. **Wizarding Social Network** (`/common-room`):
   - **Hearthside Notice Board**: Pinned parchment scrolls across *Study Circle*, *Sports Gathering*, *Academic Collaboration*, and *Lost Artifact*.
   - **Inscribe a Notice**: Modal quill form to post announcements.
   - **Notice Endorsements**: Heart-signature counter for community support.

7. **Department of Mysteries** (`/mysteries`):
   - **Section A — Student Council**: Verified elected representatives, academic branches, office hours, and official announcements.
   - **Section B — Upcoming Events**: Centralized ceremonial calendar.
   - **Section C — Confidential Complaints & Tracker**: Structured grievance submission generating trackable reference IDs (`REF-MYST-XXXX`) and real-time query tool.
   - **Section D — Anonymous Confessions**: Moderated anonymous feed with like counters and community submission guidelines.
   - **Section E — Future Warnings & Official Decrees**: Prioritized administrative bulletins (Urgent, High, Normal) with issuing authorities.
   - **The Chronos Enigma**: Subterranean riddle cipher dial puzzle.

8. **Academy Hall Dashboard** (`/dashboard`):
   - Comprehensive cross-department integration: Welcome Banner with House Points and academic rank, 7 Department Shortcuts, 5 Campus Locations Quick Access, 5 Laboratories Quick Access, Recommended Like-Minded Peers, Urgent Administrative Decrees, Daily Curriculum Schedule, and Inter-House Standings.

---

## 🏗️ Technology Stack

- **Frontend**: React 18 + Vite 5 + JavaScript + CSS Custom Properties.
- **Backend**: Node.js + Express 4.
- **Database**: SQLite via Node.js built-in `node:sqlite` (`DatabaseSync` with WAL mode and foreign keys enabled). Zero external binary dependencies, high-performance, and native cross-platform compatibility.
- **Communication**: REST API using fetch with clean fallback mock data.
- **Development**: Frontend and backend run as independent, decoupled processes.
- **Licensing**: Permissive open-source stack (MIT, ISC, BSD-2-Clause, OFL).

---

## 📂 Project Structure

```
spellbound/
  server/
    data/
      spellbound.db          # SQLite database (auto-generated)
    src/
      config/                # Environment configuration loader
        index.js
      controllers/           # Request/response controllers
        clubsController.js
        communityController.js
        eventsController.js
        healthController.js
        housesController.js
        laboratoriesController.js
        locationsController.js
        mysteriesController.js
        owlsController.js
        scheduleController.js
        sportsController.js
        studentsController.js
      db/                    # Database connection, schema & seeds
        connection.js        # Native node:sqlite driver
        init.js              # Idempotent DB initialiser CLI
        schema.sql           # Complete 27-table relational schema
        seedData.js          # Canonical seed dataset
      middleware/            # Error handling & validation middleware
        errorHandler.js
        validate.js
      routes/                # Modular REST route definitions
        clubsRoutes.js
        communityRoutes.js
        eventsRoutes.js
        healthRoutes.js
        housesRoutes.js
        laboratoriesRoutes.js
        locationsRoutes.js
        mysteriesRoutes.js
        owlsRoutes.js
        scheduleRoutes.js
        sportsRoutes.js
        studentsRoutes.js
        index.js
      services/              # Parameterized SQL database access layer
        clubsService.js
        communityService.js
        eventsService.js
        healthService.js
        housesService.js
        laboratoriesService.js
        locationsService.js  # Dijkstra shortest-path algorithm
        mysteriesService.js
        owlsService.js
        scheduleService.js
        sportsService.js
        studentsService.js   # Deterministic like-minded matching algorithm
      utils/
        response.js          # Standardized JSON response envelope
      app.js                 # Express application & CORS configuration
      server.js              # Server entry point
    test/
      api.test.js            # Automated test suite (15 test suites)
    .env.example             # Environment variable template
    package.json             # Independent backend dependencies & scripts
  src/
    assets/                  # Department cards & branding imagery
    components/              # UI, layout & magical visual components
    data/                    # Initial frontend mock data & lore
    layouts/                 # AcademyLayout application shell
    pages/                   # Seven department views & dashboard
      Academics/
      CommonRoom/
      Dashboard/
      Explore/
      HousesEvents/
      Landing/
      Mysteries/
      People/
      Sports/
    services/
      api.js                 # REST client with robust mock fallback
    styles/                  # Design tokens, themes & animations
    App.jsx                  # React application routes
    main.jsx                 # Client entry point
  .gitignore                 # Repository ignore rules (DB, env, node_modules)
  package.json               # Independent frontend dependencies & scripts
  README.md
  vite.config.js
```

---

## 🚀 Running the Project

Frontend and backend run as independent processes in separate terminals.

### 1. Backend Server Setup

```bash
# Navigate to server directory
cd server

# Install dependencies (Express, CORS, dotenv)
npm install

# Initialize database schema and seed data (idempotent)
npm run db:init

# (Optional) Reset and re-seed database fresh
npm run db:reset

# Run backend automated tests (15 test suites / all passing)
npm test

# Start the backend server (default: http://localhost:5000)
npm start

# Or start in watch mode for development
npm run dev
```

### 2. Frontend Application Setup

```bash
# In the root repository directory
npm install

# Start the Vite local development server (default: http://localhost:5173)
npm run dev

# Build for production
npm run build
```

---

## 📡 Implemented API Endpoints

All responses follow a consistent JSON envelope: `{ "success": true, "data": ... }` or `{ "success": false, "error": { "code": ..., "message": ... } }`.

### System & Health
- `GET /api/health` — Academy server health, uptime, and database connectivity.

### Campus Cartography & Navigation (Explore Hogwarts)
- `GET /api/locations` — 5 required campus locations (`Academic Building`, `Girls' Hostel`, `Boys' Hostel`, `Mess`, `Cafeteria`) with zone filtering.
- `GET /api/locations/:id` — Location details with connected pathways and features.
- `GET /api/locations/directions?from=...&to=...` — Dijkstra shortest-path pathfinding returning distance, walking time, and step-by-step directions.

### Student Directory & Affinity (People of the Wizarding World)
- `GET /api/students` — Multi-filter student directory (by house, branch, language, hobby, interest, keyword).
- `GET /api/students/:id` — Individual student profile dossier.
- `GET /api/students/match?studentId=...` — Deterministic like-minded matching algorithm calculating compatibility scores and shared tags.
- `POST /api/owls` — Dispatch an enchanted owl message to any student.

### Sports Department (Outdoor & Indoor Leagues)
- `GET /api/sports/disciplines` — 9 sports disciplines (6 outdoor, 3 indoor).
- `POST /api/sports/register` — Register student interest / trial participation.
- `GET /api/sports/standings` — Inter-House sports championship standings.
- `GET /api/sports/matches` — Match fixtures and tournament schedules.

### Academics & Magical Labs
- `GET /api/laboratories` — The 5 required laboratories (`Mechanical Lab`, `Physics Lab`, `C2S Lab`, `Electronics Lab`, `Computer Lab`).
- `GET /api/laboratories/:id` — Laboratory equipment, safety guidelines, and practical manuals.

### Houses & Featured Student Clubs
- `GET /api/houses` — The Four Great Houses with points and gem statistics.
- `POST /api/houses/:id/points` — Faculty ledger endpoint to award/deduct points.
- `GET /api/clubs` — The 4 Featured Clubs (`Literary and Debating`, `Music`, `Dance`, `Fine Arts`).
- `GET /api/events` — Campus events calendar with RSVP counters.
- `POST /api/events/:id/rsvp` — Toggle RSVP registration for an event.

### Wizarding Social Network
- `GET /api/community/posts` — Hearthside notice board posts with category filter.
- `POST /api/community/posts` — Inscribe a new parchment notice.
- `POST /api/community/posts/:id/sign` — Endorse / sign a notice.

### Department of Mysteries
- `GET /api/mysteries/council` — Verified Student Council members, office hours, and announcements.
- `GET /api/mysteries/notices` — Prioritized administrative decrees and warnings.
- `POST /api/mysteries/complaints` — Submit confidential grievance and receive trackable `REF-MYST-XXXX` ID.
- `GET /api/mysteries/complaints/:refId` — Query resolution status by reference ID.
- `GET /api/mysteries/confessions` — Moderated anonymous thoughts and like counters.
- `POST /api/mysteries/confessions` — Submit anonymous thought.
- `POST /api/mysteries/confessions/:id/like` — Echo / like a confession.
- `GET /api/mysteries/puzzles` & `POST /api/mysteries/verify` — Interactive Chronos Enigma cipher verification.

---

## 🎨 Visual Identity & Design Tokens

```css
--midnight: #0B1020;
--deep-blue: #151D35;
--antique-gold: #D6B46A;
--parchment: #E9D9B7;
--emerald: #315C4A;
--burgundy: #6D3345;
--ivory: #F6F0E4;
```
