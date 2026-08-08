# Backend gaps

Verified directly against `backend/src/*/*_router.py` on `main`. These are
frontend features with no matching backend endpoint yet — the frontend shows
an honest "not available yet" state for each instead of calling a route that
doesn't exist.

| Feature | What's missing |
|---|---|
| Get current user (`/me`) | No `GET /api/auth/me`. Frontend decodes the JWT (`id`, `role`, `department`) and calls `GET /api/user/{id}` for name/email instead. |
| Forgot / reset password | No route under `/api/auth` for this. |
| Dashboard stats & activity feed | No dashboard-specific endpoints. Dashboard shows real profile info + (Admins only) real analytics metrics. |
| Admin: roles / connectors / audit log | No such resources exist on the backend at all. |
| Settings: update profile | `PATCH /api/user/{user_id}` exists but is admin-only — a user can't edit their own profile. |
| Settings: change password / notifications / theme | No endpoints for any of these. |
| Chat: message history | `POST /api/query/` answers one question at a time; no endpoint lists past messages. Chat state is in-memory, resets on refresh. |

## Also worth knowing

- `POST /api/auth/signup/admin` and `POST /api/auth/signup/knowledgeOwner` have **no auth guard** on the backend — anyone can call them directly to create a privileged account right now. Not exposed in the frontend UI, but worth fixing server-side (add `admin_only`, same pattern as `utils/rbac_util.py` elsewhere).
- `POST /api/auth/signin` expects `OAuth2PasswordRequestForm` — form-urlencoded body with `username` (email) + `password`, not JSON. Handled correctly in `lib/api.ts`.
- Most endpoints wrap responses as `{ success, message, data }`; `POST /api/query/` and `GET /api/analytics/` return the raw object directly. `lib/api.ts` has `requestEnvelope` vs `requestPlain` to handle both correctly.

## About the 401 errors

No bug found in the backend auth code itself (hashing is consistent via
`pwdlib`, JWT encode/decode matches, DB wiring is standard). Likely causes:
1. Testing `/api/auth/signin` before ever successfully calling
   `/api/auth/signup` against the same database.
2. In Swagger UI, pasting a token without using the Authorize button (no
   `Bearer ` prefix gets sent).
3. `DATABASE_URL` / `SECRET_KEY` misconfigured or backend restarted with a
   different `SECRET_KEY` than when a token was issued.
