# SPELLBOUND — Academy Platform

> **"Your world of magic. Your universe of possibilities."**

Spellbound is an immersive magical-academy student platform inspired by the atmosphere, objects, and fictional systems of wizarding schools. 

---

## 🏛️ The Seven Departments

1. **Explore Hogwarts** (`/explore`): Interactive Ley-Line parchment map, clickable castle hotspots (Great Hall, Astronomy Spire, Grand Library, Alchemical Dungeons), and revealing charms.
2. **People of the Wizarding World** (`/people`): Gilded enchanted portrait directory, House filters, student dossiers (wands, patronuses), and working "Send Owl" dispatch system.
3. **Sports Department** (`/sports`): Skyspire Cup standings, pitch wind vector telemetry, fixture countdowns, and the Golden Nimbus flight reaction simulator.
4. **Academics & Magical Labs** (`/academics`): Course curricula, runic translation, and the interactive Bronze Cauldron Potion Brewing Laboratory.
5. **Wizarding Social Network** (`/common-room`): Crackling hearth fire lounge, pinned parchment notices, student signatures, and an interactive "Inscribe a Notice" quill form.
6. **Houses & Events** (`/houses-events`): The Four Great Houses (Ravencrest, Gryphonhart, Shadowvale, Emberwyrm), live jewel hourglasses, and an interactive faculty points awarding ledger.
7. **Department of Mysteries** (`/mysteries`): Restricted vault archives, the nocturnal constellation planetarium, and the interactive Chronos Enigma cipher.

---

## 🏗️ Technology Stack

- **Frontend**: React 18 + Vite 5 + JavaScript + CSS Custom Properties.
- **Backend**: Node.js + Express 4.
- **Database**: SQLite (embedded, zero-configuration engine with WAL mode and foreign key constraints enabled).
- **Communication**: REST API using JSON payloads.
- **Development**: Frontend and backend run as independent, decoupled processes.
- **Licensing**: All packages verify open-source permissive licensing (MIT, ISC, BSD-2-Clause, OFL).

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
        communityController.js
        coursesController.js
        eventsController.js
        healthController.js
        housesController.js
        locationsController.js
        mysteriesController.js
        owlsController.js
        scheduleController.js
        sportsController.js
        studentsController.js
      db/                    # Database connection, schema & seeds
        connection.js
        init.js
        schema.sql
        seedData.js
      middleware/            # Error handling & validation middleware
        errorHandler.js
        validate.js
      routes/                # Modular REST route definitions
        communityRoutes.js
        coursesRoutes.js
        eventsRoutes.js
        healthRoutes.js
        housesRoutes.js
        index.js
        locationsRoutes.js
        mysteriesRoutes.js
        owlsRoutes.js
        scheduleRoutes.js
        sportsRoutes.js
        studentsRoutes.js
      services/              # Parameterized SQL database access layer
        communityService.js
        coursesService.js
        eventsService.js
        healthService.js
        housesService.js
        locationsService.js
        mysteriesService.js
        owlsService.js
        scheduleService.js
        sportsService.js
        studentsService.js
      utils/
        response.js          # Standardized JSON response formatting
      app.js                 # Express application assembly & CORS
      server.js              # Server boot & graceful shutdown
    test/
      api.test.js            # Automated test suite (node:test)
    .env.example             # Environment variable template
    package.json             # Independent backend dependencies & scripts
  src/
    assets/                  # SVG crests & brand assets
    components/              # UI, layout & magical visual components
    data/                    # Initial frontend mock data & lore
    layouts/                 # AcademyLayout application shell
    pages/                   # Seven department views & dashboard
    styles/                  # Design tokens, themes & animations
    App.jsx                  # React application routes
    main.jsx                 # Client entry point
  .gitignore                 # Repository ignore rules (DB, env, dependencies)
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

# Initialize database schema and seed data
npm run db:init

# (Optional) Re-seed fresh database
npm run db:reset

# Run backend automated tests (28 test suites)
npm test

# Start the backend server (default: port 5000)
npm start

# Or start in watch mode for development
npm run dev
```

### 2. Frontend Application Setup

```bash
# In the root repository directory
npm install

# Start the Vite local development server (port 5173)
npm run dev

# Build for production
npm run build
```

---

## 📡 Implemented API Endpoints

All responses follow a consistent JSON envelope: `{ "success": true, "data": ... }` or `{ "success": false, "error": { "code": ..., "message": ... } }`.

### System & Health
- `GET /api/health` — Academy server health, uptime, and database connectivity.

### Campus Events
- `GET /api/events` — Retrieve campus events with student RSVP status (`?category=...`).
- `GET /api/events/:id` — Event details by ID.
- `POST /api/events/:id/rsvp` — Toggle registration / RSVP status.

### Locations & Cartography
- `GET /api/locations` — Campus map locations (`?zone=...&includeSecrets=true`).
- `GET /api/locations/:id` — Location details with connected pathways and secret passages.
- `GET /api/locations/pathways` — List all ley-line pathways and moving staircases.

### Academics & Curricula
- `GET /api/courses` — Academic syllabi (`?term=...`).
- `GET /api/courses/:code` — Course details including associated grimoires and scrolls.
- `GET /api/courses/:code/resources` — Learning resources by course code.

### Students & Dossiers
- `GET /api/students` — Student directory (`?house=...&search=...`).
- `GET /api/students/:id` — Individual student dossier (wand, patronus, bio).
- `GET /api/students/current/dossier` — Active student user profile (`Aris Thorne`).

### Houses & House Cup
- `GET /api/houses` — The Four Great Houses with current point standings and lore.
- `GET /api/houses/:id` — House details and recent point awards.
- `POST /api/houses/:id/points` — Faculty ledger endpoint to award/deduct points.
- `GET /api/houses/history` — Global point transaction history.

### Sports Department
- `GET /api/sports/standings` — Skyspire Cup broomstick league standings.
- `GET /api/sports/matches` — Match fixtures and tournament results.

### Common Room Notices
- `GET /api/community/posts` — Notice board parchments (`?category=...`).
- `POST /api/community/posts` — Inscribe a new notice.
- `POST /api/community/posts/:id/sign` — Sign / endorse a notice.

### Department of Mysteries
- `GET /api/mysteries/puzzles` — Active arcane puzzles and ciphers.
- `POST /api/mysteries/verify` — Validate answer submissions against the Chronos Vault.

### Owl Dispatch
- `POST /api/owls` — Dispatch an enchanted owl message to any student.
- `GET /api/owls/recent` — Recent owl communications.

### Daily Schedule
- `GET /api/schedule` — Daily student timetable.
- `PATCH /api/schedule/:id/status` — Toggle class completion status.

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
