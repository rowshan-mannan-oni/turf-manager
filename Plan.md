# Turf Football Manager — Project Plan

> A lightweight app for you and your friends to organize football/soccer games and
> tournaments on turfs: create teams, invite players, book pitches, and run
> tournaments with clear access control.

---

## 1. Overview

### 1.1 Problem
You and your friends play football on rented turfs. Today, organizing a game or a
tournament means juggling WhatsApp/group chats, spreadsheets, and manual invites.
There is no single place to:

- See who is coming to a match
- Form balanced teams
- Run a tournament bracket without paper/whiteboards
- Control who can edit what (captain vs. player vs. organizer)

### 1.2 Goals
- Provide one shared hub for a **group of friends** (not a commercial platform).
- Let any member **create a team and invite others**.
- Let organizers **generate tournaments** with brackets/fixtures automatically.
- Enforce a **clear, simple access-control model** so nobody can edit what they
  shouldn't.
- Keep it **free to run** on Vercel + Supabase free tiers.

### 1.3 Non-Goals (for now)
- Public matchmaking with strangers (no global public lobby).
- Payments/booking transactions through the app.
- Native mobile apps (start with a mobile-friendly web app / PWA).
- Complex club administration (multiple orgs, seasons, finances).

---

## 2. Target Users & Roles

| Role | Description |
|------|-------------|
| **Player** | Any signed-in user. Can view groups, join teams, RSVP to matches, see fixtures. |
| **Team Captain** | A player who created (or was promoted in) a team. Can invite/remove members, edit team details, enter match results. |
| **Tournament Organizer** | A user who created a tournament. Can configure format, generate fixtures, record results, advance the bracket. |
| **Group Admin** | (Optional) Owner of a "friend group" workspace. Can promote/demote captains and organizers. |

---

## 3. Functional Requirements

Priorities use **MoSCoW**: `M` = Must have (MVP), `S` = Should have, `C` = Could have,
`W` = Won't have now.

### 3.1 Authentication & Profiles

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-AUTH-01 | Users can sign up and sign in with email/password. | M |
| FR-AUTH-02 | Users can sign in with a Google account (OAuth). | C |
| FR-AUTH-03 | Users can reset their password via email link. | S |
| FR-AUTH-04 | Each user has a profile: display name, avatar, phone (optional). | M |
| FR-AUTH-05 | Users can edit their own display name and avatar. | M |
| FR-AUTH-06 | A user can be "friends" with other users (see Section 3.6). | S |

### 3.2 Friend Groups (Workspaces)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-GROUP-01 | A user can create a **group** and invite others by email/link. | M |
| FR-GROUP-02 | A user can belong to multiple groups. | M |
| FR-GROUP-03 | Group admins can remove members and promote others to admin. | S |
| FR-GROUP-04 | A group has a name, avatar, and member list. | M |
| FR-GROUP-05 | A tournament can include teams from **more than one group** (cross-group), provided the organizer belongs to those groups. | S |

### 3.3 Teams & Membership

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-TEAM-01 | A user can create a **team** inside a group, with a name and (optional) badge color/logo. | M |
| FR-TEAM-02 | The creator is automatically the **Team Captain**. | M |
| FR-TEAM-03 | The captain can **invite** group members to the team. | M |
| FR-TEAM-04 | Invited players receive a notification and can **accept / decline**. | M |
| FR-TEAM-05 | The captain can **remove** members and promote another member to captain. | S |
| FR-TEAM-06 | A player can request to join a team (subject to captain approval). | S |
| FR-TEAM-07 | A player can belong to multiple teams in the same group (for casual play). | C |
| FR-TEAM-08 | Teams have a roster list showing members and their role. | M |
| FR-TEAM-09 | A team has an optional max roster size; the app warns if the roster is too small/large for the chosen match size. | C |

### 3.4 Access Control (RBAC)

This is a core requirement. The model is **role-based, scoped to a resource**
(group, team, tournament, match).

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-ACL-01 | Access is enforced **server-side** via Supabase Row Level Security (RLS) policies, not just hidden in the UI. | M |
| FR-ACL-02 | Only the **Team Captain** (or group admin) can edit team details, invite, or remove members. | M |
| FR-ACL-03 | Only the **Tournament Organizer** (or group admin) can edit tournament settings and record results. | M |
| FR-ACL-04 | Only the **Group Admin** can delete the group or change member roles. | M |
| FR-ACL-05 | Players can always **view** teams, fixtures, and standings in their group. | M |
| FR-ACL-06 | Players can **only RSVP for themselves**, never for others. | M |
| FR-ACL-07 | Attempts to access forbidden resources return a clear "not authorized" state (and are blocked at the DB level). | M |

**Access Control Matrix**

| Action | Player | Team Captain | Organizer | Group Admin |
|--------|:------:|:------------:|:---------:|:-----------:|
| View group content | ✅ | ✅ | ✅ | ✅ |
| Create a team | ✅ | ✅ | ✅ | ✅ |
| Edit/delete own team | ❌ | ✅ (own team) | ❌ | ✅ |
| Invite/remove members | ❌ | ✅ (own team) | ❌ | ✅ |
| Create tournament | ✅ | ✅ | ✅ | ✅ |
| Edit tournament / record results | ❌ | ❌ | ✅ (own) | ✅ |
| RSVP to a match | ✅ (self) | ✅ (self) | ✅ (self) | ✅ (self) |
| Manage group roles / delete group | ❌ | ❌ | ❌ | ✅ |

### 3.5 Tournaments & Fixtures

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-TRN-01 | An organizer can create a tournament: name, teams (from one or more groups), start date, location. | M |
| FR-TRN-02 | The organizer selects a **format**: round-robin (league), single-elimination (knockout), or group stage + knockout. | M |
| FR-TRN-03 | The app **auto-generates fixtures/bracket** from the format and team list. | M |
| FR-TRN-04 | The organizer can re-generate or manually adjust fixtures if teams change. | S |
| FR-TRN-05 | Results are recorded per match (score, and winner). | M |
| FR-TRN-06 | **Standings** (points, W/D/L, goal difference) update automatically for round-robin. | M |
| FR-TRN-07 | Knockout brackets **advance automatically** when results are entered. | M |
| FR-TRN-08 | The organizer can pause/cancel a tournament. | S |
| FR-TRN-09 | Tournament supports odd team counts via **byes** in knockout. | S |
| FR-TRN-10 | The organizer selects the **match size** (5/7/11-a-side) when generating the tournament; it can be changed later and drives the target player count. | M |

### 3.6 Matches & Availability

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-MATCH-01 | A standalone "friendly" match can be created outside a tournament. | S |
| FR-MATCH-02 | Players can RSVP to a match: **Going / Not going / Maybe**. | M |
| FR-MATCH-03 | The match page shows the confirmed headcount. | M |
| FR-MATCH-04 | Matches have a date, time, turf/location, and duration. | M |
| FR-MATCH-05 | Captains/organizers can record the final score. | M |
| FR-MATCH-06 | A match has a selectable **match size** (5/7/11-a-side), which drives the target player count. | M |
| FR-MATCH-07 | Matches can be **pick-up**: instead of fixed teams, RSVP'd players are auto-split into balanced teams (organizer can shuffle before kickoff). | S |

### 3.7 Turfs & Bookings

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-TURF-01 | A user can add a turf (name, location, cost per hour, notes). | M |
| FR-TURF-02 | A match can be linked to a turf and a time slot. | M |
| FR-TURF-03 | The app tracks turf **bookings** (turf + date + time slot + duration) so organizers can see what is taken. | M |
| FR-TURF-04 | Show availability conflicts when a slot is already booked (the app only records the reservation; actual payment happens with the turf owner). | S |

### 3.8 Group Chat & Notices

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-CHAT-01 | Group members can post messages in the group chat. | S |
| FR-CHAT-02 | Messages are delivered near real-time to online members via Supabase Realtime. | S |
| FR-CHAT-03 | Chat history is persisted and scrollable with pagination (newest first). | S |
| FR-CHAT-04 | Only group members can read or post — enforced via RLS, not just UI. | M |
| FR-CHAT-05 | A user can edit/delete their own message; group admins can delete any message. | C |
| FR-CHAT-06 | Chat shows sender name/avatar, timestamp, and read receipt (optional). | C |
| FR-NTC-01 | Group admins/captains can post a **notice** (title + body) that is pinned/featured. | M |
| FR-NTC-02 | Notices appear prominently on the group home and can be marked as read. | M |
| FR-NTC-03 | Notices support an optional expiry date, after which they archive. | C |

### 3.9 Notifications & Real-time

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-NTF-01 | Users are notified when invited to a team/group or a match. | M |
| FR-NTF-02 | Match RSVPs and results update **live** for everyone viewing the page (Supabase Realtime). | S |
| FR-NTF-03 | Email reminders for upcoming matches (via Supabase + a cron). | C |

---

## 4. Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-01 | **Free-tier cost**: runs entirely within Vercel Hobby + Supabase Free limits (see Section 7). |
| NFR-02 | **Responsive**: usable on mobile browsers (primary) and desktop. |
| NFR-03 | **Fast**: initial page load < 3s on 4G; optimistic UI for RSVP and results. |
| NFR-04 | **Secure**: all data access gated by RLS; no secrets in client bundle. |
| NFR-05 | **Data integrity**: constraints to prevent duplicate RSVPs or invalid scores. |
| NFR-06 | **Offline tolerance**: read-only caching of fixtures where possible. |

---

## 5. Data Model (Core Entities)

```
users          id, email, display_name, avatar_url
profiles       id (FK users), phone
friendships    requester_id, addressee_id, status
groups         id, name, avatar_url, created_by
group_members  group_id, user_id, role (member | admin)
teams          id, group_id, name, color, logo_url, captain_id, max_players?
team_members   team_id, user_id, role (captain | player)
tournaments    id, primary_group_id?, name, format, match_size, created_by, status
tournament_teams  tournament_id, team_id, seed
matches        id, tournament_id?, group_id?, home_team_id?, away_team_id?,
               match_size, is_pickup, turf_id?, scheduled_at, home_score, away_score, status, round
rsvps          match_id, user_id, response (going | maybe | not_going)
turfs          id, group_id, name, location, cost_per_hour, notes
bookings       id, turf_id, group_id, booked_by, date, start_time, duration_min, match_id?
messages       id, group_id, author_id, body, created_at, edited_at, deleted_at
notices        id, group_id, author_id, title, body, is_pinned, expires_at
notifications  id, user_id, type, payload, read_at
```

> Note: `matches` is polymorphic (belongs to a tournament **or** is a standalone
> friendly). We'll model this with a nullable `tournament_id`.
>
> Note: `home_team_id`/`away_team_id` are nullable to support **pick-up** matches,
> where teams are assembled from RSVPs on the day rather than from fixed rosters.
> A tournament's teams can come from different groups (`tournament_teams.team_id`
> points at any team).

---

## 6. Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Frontend | **React 19 + TypeScript** | Requested; strong typing, large ecosystem. |
| Framework | **Next.js** (App Router) | SSR/SSG, API routes, first-class Vercel support. |
| Styling | **Tailwind CSS** | Fast UI iteration, mobile-friendly. |
| Forms/validation | **React Hook Form + Zod** | Shared validation types between client and server. |
| Data fetching | **TanStack Query** | Caching, optimistic updates, real-time invalidation. |
| Backend / DB | **Supabase** (Postgres + Auth + RLS + Realtime) | Requested; free tier, batteries included. |
| Hosting | **Vercel** (Hobby) | Requested; free, auto-deploys from Git. |
| State (client) | Light use of Zustand or React context | Auth session + current group context. |
| Linting/format | ESLint + Prettier | Code quality. |

---

## 7. Free-Tier Constraints & Mitigations

These limits matter because you want to run this for free.

| Constraint | Free limit | Mitigation |
|-----------|-----------|------------|
| Supabase DB size | ~500 MB | Fine for a friend group; no large media in DB. |
| Supabase Auth MAU | ~50k | More than enough for friends. |
| Supabase Realtime | ~200 concurrent, ~2M msg/mo | Chat + live RSVP/results for a friends group stay far under this. |
| Chat message storage | ~500 MB total DB | Plain text is ~200 bytes/msg; years of group chat is a few MB. |
| Supabase egress | ~5 GB/mo | Keep images small; use external avatar URLs (e.g., user-uploaded → Supabase Storage bucket with limits). |
| Supabase **project pause** | Free projects pause after ~1 week of inactivity | Run a keep-alive ping (e.g., Vercel Cron) if it becomes an issue. |
| Vercel Hobby | 100 GB bandwidth, serverless limits | No issue at this scale. |
| Vercel Serverless timeout | ~10s (Hobby) | Keep operations simple; heavy work in DB, not in functions. |
| Email (password reset) | Supabase rate-limits ~3/hr per user | Fine; add Google OAuth to reduce reliance on email. |

**Decision needed:** Supabase free tier now allows only a limited number of
organizations/projects — we'll use a single project with multiple `groups` as
tenants, not one project per group.

---

## 8. Proposed Architecture

```
[Browser: React + Next.js + Tailwind]
        │  TanStack Query
        ▼
[Next.js API Routes / Server Actions]  ──▶  [Supabase Postgres]
        │                                        │ RLS policies
        │                                        │ Auth (JWT)
        │                                        │ Realtime (changes)
        └── Supabase Client SDK ◀───────────────┘
```

- **Auth**: Supabase Auth issues a JWT; the Postgres RLS policies read the user's
  role from `group_members`/`team_members` and enforce access at the row level.
- **Access control**: enforced in the database via RLS, so even a modified client
  cannot bypass it. UI only *reflects* permissions.
- **Realtime**: subscribe to `rsvps`, `matches`, and `standings` views.

---

## 9. Roadmap

### Phase 0 — Setup (0.5–1 day)
- [x] Scaffold Next.js + TypeScript + Tailwind.
- [ ] Create Supabase project, wire env vars, add Auth + RLS migration.
  *(Client helpers and migration are ready; account setup is documented in README.md.)*
- [ ] Deploy empty app to Vercel to validate the pipeline.

### Phase 1 — MVP (core loop)
- Auth (email/password).
- Friend groups + membership.
- Teams: create, invite, accept/decline, roster.
- Friendly matches: create, RSVP, headcount.
- Group notices (announcements).
- Access control (RLS) for all of the above.

### Phase 2 — Tournaments & Booking
- Create tournament with selectable match size (5/7/11) and cross-group teams.
- Auto-generate fixtures / brackets (round-robin + knockout + group stage).
- Record results, auto standings + bracket advancement.
- Pick-up matches (auto-balance players who RSVP'd).
- Turfs + bookings (track time slots).

### Phase 3 — Polish & Real-time
- Supabase Realtime for live RSVP/results.
- Group chat (Realtime).
- Notifications (in-app, then email).
- Availability conflict warnings for turf bookings.
- PWA / add-to-home-screen for mobile.

### Phase 4 — Nice-to-haves
- Team stats / player stats.
- Standings tiebreakers and playoff logic.
- Import/export fixtures.
- Group chat or match comments.

---

## 10. Decisions & Remaining Questions

**Resolved** (now reflected in the requirements above):

1. **Match size** — variable; selected when generating a tournament or match (5/7/11-a-side).
2. **Teams vs. pick-up** — support both: fixed rosters AND per-match pick-up teams auto-balanced from who RSVP'd.
3. **Tournament formats** — round-robin, knockout, and group stage + knockout.
4. **Groups** — multiple groups; tournaments can pull teams from more than one group (cross-group).
5. **Login** — email/password first; Google OAuth deferred.
6. **Booking** — the app tracks turf bookings/time slots and flags conflicts.

**Still to decide:**

7. **Roster limits & substitutes** — should a team have a maximum number of players, and do you need to track who starts vs. who is a substitute?
   *Example:* a 5-a-side game has 5 on the field, but teams usually carry ~7–8 so people can rotate. "Substitutes" = tracking the extra bench players separately from the starting five.
   *Proposed default:* no hard limit for the MVP — just a warning when a roster is too small/large for the chosen match size. Starter-vs-sub tracking is deferred to a later phase. Confirm if this works.

---

## 11. Definition of Done (MVP)

The MVP is done when a friend can, without leaving the app:

1. Create an account and a group.
2. Invite friends and create a team.
3. Create a match (fixed teams or pick-up), have teammates RSVP, and see the headcount.
4. Create a round-robin or knockout tournament (choosing a match size) and watch fixtures + standings/bracket generate.
5. Post a group notice and send a group chat message that appears live to another member.
6. Confirm that a non-captain player **cannot** edit team details or record
   another player's result (access control works end-to-end).
