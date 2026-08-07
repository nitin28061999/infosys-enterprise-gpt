# Backend gaps

Verified against `backend/src/*/*_router.py` on the `main` branch. These are
the frontend features with no matching backend endpoint yet. The frontend
shows an honest "not available yet" state for each rather than calling a
route that doesn't exist.

| Feature | What's missing |
|---|---|
| Get current user (`/me`) | No `GET /api/auth/me`. Frontend decodes the JWT (`id`, `role`, `department`) and calls `GET /api/user/{id}` for name/email instead. |
| Forgot / reset password | No route under `/api/auth` for this at all. |
| Dashboard stats & activity feed | No dashboard-specific endpoints. Dashboard page now shows real profile info + (for Admins) the real analytics metrics, nothing fabricated. |
| Admin: roles summary | No concept of "roles" as a listable resource — `Role` is just an enum on `User`. |
| Admin: connectors | No connector/integration model on the backend at all. |
| Admin: audit log (view) | `src/audit/` exists (model + service) but has no router — it's used internally to log queries, not exposed via any endpoint. |
| Settings: update profile | `PATCH /api/user/{user_id}` exists but is **admin-only** — a user can't edit their own profile. |
| Settings: change password | No endpoint. |
| Settings: notification preferences | No endpoint, no `notification_preferences` field on `User`. |
| Settings: theme preference | No endpoint, no `theme` field on `User`. |
| Chat: message history | `POST /api/query/` answers one question at a time; there's no endpoint to list past messages/conversations. Chat state is in-memory only and resets on refresh. |

## Also worth knowing

- **`POST /api/auth/signup/admin` and `POST /api/auth/signup/knowledgeOwner` have no auth guard on the backend** — anyone can currently call them to create a privileged account. The frontend deliberately does not expose UI for these two routes, but this is a real backend security gap worth fixing (add an `admin_only` dependency, same pattern used elsewhere in `utils/rbac_util.py`).
- `POST /api/auth/signin` expects `OAuth2PasswordRequestForm` — a `application/x-www-form-urlencoded` body with fields `username` (the email) and `password`, not JSON. `authApi.signin` in `lib/api.ts` already handles this.
- Most endpoints wrap responses as `{ success, message, data }`; a few (`POST /api/query/`, `GET /api/analytics/`) return the raw object directly. `lib/api.ts` has two helpers — `requestEnvelope` and `requestPlain` — to handle both correctly per-endpoint.
