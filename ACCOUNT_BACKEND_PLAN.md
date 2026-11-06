# PINT authenticated accounts — backend implementation contract

**Status: not deployed.** The GitHub Pages frontend is not an authentication authority. The current review API is separately hosted; its source, database schema, admin credentials, and deployment are not in this repository. Do not advertise user registration as implemented until the backend is changed and tested.

## Proposed account architecture

- Prefer provider-managed email magic links or passkeys, rather than writing bespoke password authentication. Only the server verifies identity and issues authenticated sessions; use secure, HttpOnly, SameSite cookies with CSRF protection or a verified short-lived access token where appropriate.
- Server-generated opaque user IDs, unique normalized handles and optional display name/avatar. Allow display names to change without losing review attribution.
- Protect POST /api/reviews and all edit/delete operations by verifying authenticated user ID server-side; ignore any client-supplied author/userId as authority.
- Add GET /api/me (returns profile, review IDs) and GET /api/users/:publicId (public-safe profile), and authenticated endpoints for profile updates and one's own review deletion/editing. Passwords/tokens/secret API keys must never appear in static GitHub Pages assets.
- Associate each new review with an authenticated user ID in the database, preserving snapshot name only as historical display information. Rate-limit submissions per user and IP, validate content/photos, and implement report and moderation flows.
- **Migration:** Existing anonymous reviews remain attributed to an *unverified historic display name*. Never assign previous posts to a new account solely because the text names match. Allow optional ownership claims only through evidence you actually control (e.g. previously securely recorded author token), not guesswork.
- Privacy controls: a review author can edit/delete their content; define retention of uploads and account deletion, provide basic privacy disclosure. Ensure private email addresses are not exposed in public reviews.
- Reliability: paginated activity feed, consistent createdAt/timestamps, deterministic review ordering, authorization tests, account-recovery testing, audit logs and backup/restore plans.
- Keep existing unauthenticated GET review data reachable during migration. Introduce versioned endpoints/compatible migrations and deploy backend before enabling sign-up UI.

## Required handoff

Backend repository or management connection, hosting configuration, schema, secrets manager and a staging environment. Test two separate devices against the actual deployment before launch.

## Current implementation

PINT v4.0 provides a **device profile only**, local display-name preferences and a locally tracked list of review IDs submitted from that browser. It is *not* a real account and should never be represented as preventing impersonation or syncing identity across devices.
