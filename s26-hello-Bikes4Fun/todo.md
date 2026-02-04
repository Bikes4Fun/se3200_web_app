# SE-3200 Semester Plan

## Timeline

| Due | Assignment | Portal Feature |
|-----|------------|----------------|
| Done | Project 1: Hello JS | Dashboard |
| Done | Project 2: Random Generation | Demo Data Generator |
| Feb 23 | Project 3: Message Log | Medication Dose Log |
| Mar 25 | Project 4: Resourceful | Calendar CRUD |
| Apr 8 | Deployment | Deploy with partner |
| Apr 22 | Project 5: Authentication | User login + protected calendar |

---

## Current State (as of Feb 2025)

**Running the app:** Open `client/index.html` in a browser (file://) or serve `client/` (e.g. `python -m http.server 8000` from repo root → http://localhost:8000/client/). No backend required.

**What’s built:**
- **Dashboard** (`client/index.html`) — intro, photos (client/img/), Ideas list
- **User Profile** (`client/user-profile.html`) — "Generate random user" button; displays calendar events + medications as cards; exports `user-profile-generated.json`
- **Settings** (`client/settings.html`) — display preferences (contrast, text size, layout, colors); saves to localStorage + demo user profile
- **Demo user flow** — Single load point in `app.js` (getCurrentUserId, getCurrentUserProfile). Demo user identified and profile loaded from sessionStorage; profile + random generator live in `demo_user/demo_user.js`. Medications from openFDA (brand as display name, generic in parens, selected dose, side effects, drug interactions). Full FDA details in exported JSON; UI truncates for cards.

**Planned next:** Project 3 (Medication Dose Log), then Project 4 (Calendar CRUD + backend).

---

## Issue 1: Project 2 Demo Data Generator — DONE

**Feature:** Demo Data Generator - creates random appointments and medications for TV app testing

**Integration:** Generates test data matching Dementia TV's `calendar_events` schema; medications from openFDA with full label details

**What it does:**
- Generate random appointments (title, start_time, end_time, location, driver_name, pickup_time, leave_time)
- Generate random medications via openFDA API (brand display name, generic in parens, selected dose, schedules)
- Fetch random placeholder photos (picsum.photos) for cards
- Display generated data as styled cards on User Profile page
- Export JSON (user-profile-generated.json) with full medication details

**Requirements Checklist:**
- [x] DOM querying — generate button, output containers (profile-events, profile-medications)
- [x] DOM manipulation — loading state, card count / status message
- [x] DOM insertion — createElement + appendChild for event and medication cards
- [x] Events — "Generate random user" button creates new random appointments + medications
- [x] Randomness — Math.random(), pick/pickN for titles, locations, drivers, schedules, doses
- [x] Data — arrays of titles, locations, drivers, MED_LIST, SCHEDULE_TIMES as templates
- [x] Ajax — fetch picsum.photos for card images; fetch openFDA API (server/search-medications.js)
- [x] Exceed — multiple items, styled cards, export JSON download
- [x] Professional styling — appointment and medication cards with date/time, dose, truncation on front

**TV Integration Fields:**
- `title`, `start_time`, `end_time`, `location`, `driver_name`, `pickup_time`, `leave_time` — as specified
- Medications: display_name (brand), generic in parens, selected_dose, schedule, full fda in JSON

**Files:** `client/user-profile.html`, `client/app.js` (nav, DataService, profile grid + user-loader block), `demo_user/demo_user.js` (profile store + random generator), `server/search-medications.js` (openFDA, client-side)

---

## Issue 2: Project 3 Message Log, Feb 23

**Feature:** Medication Dose Log — track when medications are taken

**What it does:**
- Display patient's medications as clickable buttons (with photos/icons)
- Log dose with optional notes
- Show dose history list

**Requirements Checklist:**
- [ ] `POST /messages` — append dose log to `doses.json`, return 201 Created
- [ ] `GET /messages` — read `doses.json`, return JSON array + 200 OK
- [ ] CORS — `Access-Control-Allow-Origin: *` header on all responses
- [ ] 404 — return error page/JSON for undefined routes
- [ ] Client medication buttons — load from `meds.json`, display with photos/icons
- [ ] Client form — click med button + optional notes field to log dose
- [ ] Client list — display dose history (med name, time, who logged, notes)
- [ ] Refresh after submit — re-fetch GET after successful POST
- [ ] Ajax — all requests via `fetch()`, no page reloads
- [ ] Professional styling — clean form, readable dose list

**Files:** `medications.html`, `medications.js`, `meds.json`, `server/app.py`, `server/doses.json`

---

## Issue 3: Project 4 Resourceful, Mar 25

**Resource:** Calendar Events

**Integration:** Shares database with Dementia TV app (`dementia_tv.db`)

**Schema:** (matches TV's `calendar_events` table)
```sql
CREATE TABLE IF NOT EXISTS calendar_events (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    location TEXT,
    driver_name TEXT,
    driver_contact_id TEXT,
    pickup_time TEXT,
    leave_time TEXT
);
```

**Requirements Checklist:**
- [ ] 5+ attributes — title, start_time, end_time, location, description, driver_name, pickup_time, leave_time (8 total)
- [ ] SQLite database — shared `dementia_tv.db` (symlink or config path)
- [ ] `user_id` — hardcode `'default_user'` for now; tie to auth in Project 5
- [ ] Database class — `CalendarEventsDB` class with methods for each CRUD op
- [ ] `GET /events` — return all rows as JSON array, 200
- [ ] `GET /events/:id` — return single row or 404
- [ ] `POST /events` — insert row, return new record + 201
- [ ] `PUT /events/:id` — update row or 404, return updated + 200
- [ ] `DELETE /events/:id` — delete row or 404, return 204
- [ ] CORS + OPTIONS — handle preflight for PUT/DELETE requests
- [ ] 404 — invalid routes and nonexistent IDs return proper error
- [ ] Client list — table/cards showing title, date, location, driver
- [ ] Client form — single form for create/edit, pre-fill fields when editing
- [ ] Delete — button per row, `confirm()` before sending DELETE
- [ ] README.md — document resource name, attributes, schema, all endpoints
- [ ] Professional styling — clean calendar-style UI

**Files:** `server/app.py`, `server/database.py`, `calendar.html`, `calendar.js`, `README.md`

---

## Issue 4: Deployment, Apr 8

**Integration:** Configure shared database path for TV connection

**Requirements Checklist:**
- [ ] Public repo — create new repo or make existing public
- [ ] GitHub Discussions — enable in repo settings
- [ ] Add collaborator — invite `nachofree` (instructor)
- [ ] Fetch URL variable — `const API_URL = '...'` at top of JS files
- [ ] `app.run(host='0.0.0.0')` — allow external connections
- [ ] `requirements.txt` — list Flask + any dependencies
- [ ] Partner communication — intro post in Discussions, respond to questions

**Shared Database Setup:**
- [ ] Environment variable `DB_PATH` in Flask app (defaults to local `dementia_tv.db`)
- [ ] Dev: symlink or relative path to `../senior_project/dementia_tv_python/lib/dementia_tv.db`
- [ ] Prod: configure path based on deployment environment

---

## Issue 5: Project 5 Authentication, Apr 22

**Feature:** User accounts + protected calendar

**User Schema:**
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
);
```

**Requirements Checklist:**

*Registration:*
- [ ] User resource — first_name, last_name, email, password_hash in schema
- [ ] `POST /users` — hash with `werkzeug.security`, store hash only
- [ ] Email uniqueness — query DB first, return 409 Conflict if exists
- [ ] Registration UI — form with validation, show success/error message

*Authentication:*
- [ ] `POST /auth` — lookup by email, `check_password_hash()`, return user or 401
- [ ] Login UI — form with error feedback on failed login
- [ ] Session store — save `{userId, email, loggedIn}` to localStorage
- [ ] User preferences — save theme/settings to localStorage, persist across sessions

*Authorization:*
- [ ] Protected calendar — check session before showing UI
- [ ] Server auth check — verify session token/header, return 401 if missing
- [ ] Hide UI — calendar page redirects to login if not authenticated
- [ ] Equal access — no role-based restrictions (all users same permissions)

*General:*
- [ ] UsersDB class — encapsulate user CRUD in database.py
- [ ] REST + status codes — 201 created, 401 unauthorized, 409 conflict
- [ ] CORS — allow credentials if using cookies
- [ ] README.md — document both resources, schemas, endpoints, hashing method (werkzeug)

**Files:** `server/app.py`, `server/database.py`, `login.html`, `register.html`, `auth.js`

---

## Future Ideas (Post-Course)
- [ ] Push notifications for medication reminders
- [ ] FaceTime/video call integration
- [ ] Family education portal with dementia care resources
- [ ] Professional contacts directory (doctors, pharmacies)
- [ ] Print functionality for medical info
- [ ] Multi-patient support (for care facilities)

---

## File Structure (current)

```
se3200_web_app/
  client/
    index.html, user-profile.html, settings.html
    app.js, settings.js, style.css
    img/
      mom_dad_landon.JPG, mom_sisto.JPG
  demo_user/
    demo_user.js          # profile store + random generator (appointments + meds)
    random-user-generator.js   # (optional; generator also in demo_user.js)
  server/
    search-medications.js     # openFDA API (runs in browser)
  todo.md, create_issues.sh

# Planned (Project 3+):
# client/medications.html, medications.js; server/app.py, database.py, doses.json
# client/calendar.html, calendar.js; login.html, register.html, auth.js
# Shared database (Project 4+): ../senior_project/dementia_tv_python/lib/dementia_tv.db
```
