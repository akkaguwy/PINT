# PINT v4.1: Cloudflare/Firebase account integration

## Deployment state
The frontend is prepared for Firebase Google/email authentication. The separate `pint-api` Worker must be deployed manually in your Cloudflare account. **This repo cannot deploy it automatically with the current connection.** The existing shared PINT review service is left unchanged until a separate migration.

## Configure Cloudflare
1. Cloudflare > Workers & Pages > **pint-api** > Edit code.
2. Replace the Hello World code with the exact contents of `cloudflare/pint-api-worker.js` (from this repository). Deploy.
3. In Worker Settings > Bindings, check the D1 binding variable is **DB** pointing to **pint-db**.
4. Open https://pint-api.akkaguwy.workers.dev/api/health
   - Expected: `{"app":"PINT API","status":"online","accounts":"firebase","database":true}`.
5. Sign into PINT with Google or an email/password account. If you registered with email/password, click the verification email link first.
6. Profile should eventually say `Signed in · Cloudflare account verified.`. The initial non-verified message does not mean Cloudflare is broken; inspect the Worker deployment, Firebase email verification and API logs.
7. To confirm D1 state: Cloudflare > D1 > pint-db > Console:
   `SELECT id, display_name, created_at FROM users ORDER BY created_at DESC LIMIT 5;`
   (do not publish user email addresses).

## Critical distinctions
- Firebase handles login. Cloudflare Worker validates signed Firebase ID tokens against Google's current keys and project claims. Browser-provided user IDs are **never** trusted.
- The `users` table holds the stable authenticated Firebase UID and display name.
- Old reviews currently at `pint-live-data-akka.akkaguwy.chatgpt.site` are not migrated. They still use an unverified display name, and cannot be claimed based only on name.
- After API validation, implement server-enforced review posting/edit/delete, image storage migration and data export before changing `shared.js` to point at the new backend. Do not switch the live app to a new empty database.
- A Firebase client configuration key is public by design; **never put service-account JSON/private keys in GitHub Pages**.
- Google popup sign-in can fail on Safari installed web apps; email/password is available as a fallback. Before a public-style rollout, test on iPhone Safari and home-screen PWA.
- Auth JWT checks do not automatically check token revocation. For high-risk actions implement revocation or account-disabled checking and abuse prevention.
- Update browser caching and ensure the client loads the correct signed-in version. End-to-end tests are required before marking production readiness.
