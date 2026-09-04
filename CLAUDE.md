# CLAUDE.md — Daughter's Delight (eatddelight) Frontend

This file gives Claude Code full context to build the frontend for **Daughter's Delight** (Instagram: `@eatddelight`), a home-kitchen food business. It consumes the backend documented in [`../backend/CLAUDE.md`](../backend/CLAUDE.md) and [`../backend/specs/00-overview.md`](../backend/specs/00-overview.md) — read both before writing code. There are two apps in this one frontend: a public **storefront** and an **admin panel**, sharing the same API client and design tokens but otherwise separate route groups.

## 1. Business Context

Daughter's Delight is a home kitchen run by the client's mother, currently taking orders via Instagram DM and phone (`0312-2252915`). No customer accounts, no online payment. A visitor browses two catalogs — a fixed **Menu of the Day** (one dish per weekday) and a larger **Full Menu** (à la carte, min. 3 per item) — builds a cart or submits a custom/bespoke request, reviews a plain order summary, then either downloads a PDF invoice or is handed off to WhatsApp with the order pre-filled. The owner and staff manage the catalog, orders, and site content through the admin panel.

Do not deviate from these without checking in: no login/accounts for customers, no payment gateway, cart/favourites are anonymous and **client-side only** (see Section 4).

## 2. Relationship to the Backend

- Backend status per `backend/specs/00-overview.md`: `public-complete` — catalog read APIs are live (`/menu`, `/weekly-menu`, `/categories`, `/foods`, `/foods/{id}`, `/settings`, `/contact`). Admin auth/RBAC/CRUD and contact inbox are also live.
- **Not yet built:** `POST /orders`, order lookup, invoice PDF, and the WhatsApp URL builder (backend plan 04, pending). Build the storefront's browsing/cart/favourites experience first; checkout wiring follows once those endpoints exist — stub the checkout screen behind a clear TODO rather than inventing an API shape.
- Error envelope from every endpoint: `{"detail": <str|list>, "code": <stable_snake_case>}`. Handle both string and validation-array `detail`.
- Money fields arrive as JSON numbers/strings from `Decimal` — treat as strings where precision matters (display formatting), never do float arithmetic on totals; if the API sends numeric JSON, format with a currency formatter rather than re-adding line items unless the API doesn't already total them.
- Public endpoints require no auth. Admin endpoints require a JWT bearer token. No endpoint yet requires `X-Session-Token` since cart/favourites are frontend-only (Section 4) — don't send one until an order/cart endpoint actually asks for it.

## 3. Tech Stack

- **Framework:** Next.js (App Router), TypeScript
- **Styling:** Tailwind CSS
- **Data fetching:** native `fetch` wrapped in a small typed API client (`lib/api/`), React Server Components for storefront reads where practical; TanStack Query for client-side mutations/cache (cart badge, favourites, admin tables) where server components aren't a fit
- **Forms/validation:** `react-hook-form` + `zod`, mirroring backend Pydantic constraints (min order qty, advance-date rule) so bad input never round-trips to the API for basic checks
- **Admin auth:** JWT access token in memory + refresh token in an httpOnly-equivalent (or short-lived cookie set by a Next.js route handler, since this is a pure SPA-style admin, not NextAuth) — keep it simple, no third-party auth provider
- **Icons/UI primitives:** pick one lightweight set (e.g. `lucide-react`) and shadcn/ui-style unstyled primitives if a component library is wanted; don't pull in a heavy admin dashboard template
- **Lint/format:** ESLint + Prettier, TypeScript strict mode
- **Testing:** Vitest + React Testing Library for components/hooks; Playwright for the golden-path e2e flows (browse → cart → checkout stub; admin login → CRUD) if time allows — not a hard requirement for v1
- **Package manager:** npm (match whatever's already used elsewhere in this repo; no strong preference otherwise)

## 4. State Management — Cart & Favourites (client-side only)

Confirmed with the client: cart and favourites live entirely in the browser, **not** on the backend (backend's `Cart`/`CartItem`/`Favourite` tables exist but are unused — see backend CLAUDE.md Section 6).

- Persist both in `localStorage` under versioned keys (e.g. `dd:cart:v1`, `dd:favourites:v1`), read/write through a small typed store (Zustand or a plain context + reducer — Zustand is simpler for this size).
- Cart line shape mirrors what checkout will eventually submit: `{ foodId, name, unitPrice, quantity, notes?, addOns: [{addOnId, name, unitPrice, quantity}] }`. Snapshot `name`/`unitPrice` at add-to-cart time for display, but always re-validate availability/price against a fresh `GET /foods/{id}` at checkout time before building the order (prices/availability can drift between add-to-cart and checkout).
- Enforce `min_order_quantity` and `is_available` client-side at add-to-cart time (mirrors backend Section 7 rules 3–4), but don't treat client-side enforcement as sufficient — the eventual `POST /orders` call is the source of truth and can reject a stale cart line.
- No cross-device sync, no expiry logic — it's just a browser-local bucket, don't build session-token plumbing for it (that's an unused backend concept for now).

## 5. Storefront — Pages & Routes

Route group `app/(storefront)/`. Public, no auth.

| Route | Purpose | Backend endpoint(s) |
|---|---|---|
| `/` (home) | Hero, brand blurb, today's special teaser, CTAs to menu/weekly-menu | `GET /settings`, `GET /weekly-menu` (today only) |
| `/about` | About text, hours, socials | `GET /settings` |
| `/contact` | Contact form | `POST /contact` |
| `/weekly-menu` | 5 daily specials grouped by weekday | `GET /weekly-menu` |
| `/menu` | Full à la carte catalog, grouped by category, search + category filter | `GET /menu`, `GET /foods?search=&category_id=&available=true` |
| `/menu/[categorySlug]` (optional, or client-side filter on `/menu`) | Category-scoped view | `GET /categories/{id}/foods` |
| `/food/[id]` | Food detail with resolved add-ons, add-to-cart | `GET /foods/{id}` |
| `/cart` | Cart review, quantity/add-on edits, min-qty warnings | client-side store only |
| `/favourites` | Saved foods | client-side store only |
| `/checkout` | Order summary, custom-request form, WhatsApp/invoice handoff | **not yet available** — build the UI, stub the submit action with a TODO pointing at backend plan 04/05 |

Custom/bespoke order requests: a form reachable from `/checkout` (or its own `/custom-order` route) collecting `custom_description` (required) plus optional `servings`, `budget_range`, `occasion`, `event_date` — matches the resolved backend schema in Section 4/14 of the backend doc. Same "not yet available" caveat applies until `POST /orders` exists.

## 6. Admin Panel — Pages & Routes

Route group `app/admin/` (or a separate `app/(admin)/` group), gated by a login page and an auth guard layout. JWT required for everything except `/admin/login`.

| Route | Purpose | Role gate |
|---|---|---|
| `/admin/login` | Email/password login | none |
| `/admin` (dashboard) | Order queue summary, unread contact messages count | owner + staff |
| `/admin/categories` | List/create/update categories; delete button hidden/disabled for staff | owner + staff (delete: owner only) |
| `/admin/foods` | List/create/update foods; delete owner only | owner + staff (delete: owner only) |
| `/admin/addons` | List/create/update add-ons; delete owner only | owner + staff (delete: owner only) |
| `/admin/orders` | Order list/filter, status transitions, custom-order quoting | owner + staff |
| `/admin/staff` | Manage staff accounts (create/deactivate) | owner only — route itself 403s for staff |
| `/admin/settings` | Edit `SiteSettings` | owner only — staff should not even see this nav item, and the route must still enforce it server-side (never trust hiding a nav link) |
| `/admin/contact-messages` | Inbox, mark read | owner + staff |

UI must reflect role at every layer: hide owner-only actions/nav for `staff`, but always treat a 403 response as authoritative — don't assume hiding the button is sufficient, since a staff user could hit the route directly.

Order status UI must enforce the same forward-only transitions as the backend (`pending → confirmed → completed`, `cancelled` from any non-terminal state) — grey out invalid transitions rather than letting the user pick one and eat a 409.

## 7. API Client Conventions

- Single `lib/api/client.ts`: base URL from `NEXT_PUBLIC_API_URL` (default `http://localhost:8000/api/v1` in dev), attaches `Authorization: Bearer <token>` for admin calls, parses the `{"detail","code"}` envelope on error into a typed `ApiError`.
- One module per resource (`lib/api/menu.ts`, `lib/api/foods.ts`, `lib/api/settings.ts`, `lib/api/contact.ts`, `lib/api/admin/*.ts`) exporting typed functions, not raw fetch calls scattered through components.
- Mirror backend Pydantic response shapes with generated-by-hand TypeScript types in `lib/api/types.ts` (or generate from OpenAPI later if it's worth the setup — not required for v1).
- Every mutation (contact form, future orders, all admin writes) surfaces the API's `code` field to the user where it's meaningful (e.g. `slug_conflict`, `invalid_status_transition`), not just a generic "something went wrong."

## 8. Design / Branding

Business name "Daughter's Delight", tagline "Homemade Made with Love". No existing design system yet — if the client later shares brand photos/flyers, use the `design-extract` skill to derive a palette/type system before building UI, rather than guessing. Until then, keep it warm/homemade-feeling (not a generic SaaS look) but don't over-invest in visual design before the core flows work.

## 9. Project Structure

```
frontend/
  app/
    (storefront)/
      page.tsx                # home
      about/page.tsx
      contact/page.tsx
      weekly-menu/page.tsx
      menu/page.tsx
      food/[id]/page.tsx
      cart/page.tsx
      favourites/page.tsx
      checkout/page.tsx
      layout.tsx
    admin/
      login/page.tsx
      (dashboard)/
        page.tsx
        categories/page.tsx
        foods/page.tsx
        addons/page.tsx
        orders/page.tsx
        staff/page.tsx
        settings/page.tsx
        contact-messages/page.tsx
        layout.tsx             # auth guard + role-aware nav
  components/
    storefront/
    admin/
    ui/                        # shared primitives
  lib/
    api/
      client.ts
      menu.ts
      foods.ts
      settings.ts
      contact.ts
      admin/
      types.ts
    store/
      cart.ts                  # Zustand store, localStorage-persisted
      favourites.ts
    auth/
      admin-auth.ts            # token storage, refresh flow
  hooks/
  tests/
  public/
  .env.example
  next.config.ts
  tsconfig.json
  package.json
```

## 10. Build Plan (execute in this order)

1. **Scaffolding:** `create-next-app` (TypeScript, App Router, Tailwind), ESLint/Prettier config, `.env.example` (`NEXT_PUBLIC_API_URL`), base layout, `lib/api/client.ts` with error envelope parsing.
2. **Storefront read pages:** home, about, weekly-menu, menu (+ search/filter), food detail — all backed by the live public API.
3. **Cart & favourites (client-side):** Zustand stores, localStorage persistence, cart/favourites UI, min-qty/availability enforcement.
4. **Contact form:** wired to `POST /contact`, success/error states.
5. **Checkout UI (stubbed submit):** order summary screen, custom-request form, WhatsApp/invoice buttons rendered but disabled/TODO'd until backend plan 04 ships — don't invent the order API shape.
6. **Admin auth:** login page, token storage/refresh, route-guard layout, role-aware nav.
7. **Admin CRUD:** categories, foods, add-ons (create/update all roles, delete owner-only with disabled state for staff).
8. **Admin orders & staff & settings & contact inbox:** order list/status transitions, staff management (owner-only route), settings form (owner-only route), contact message inbox.
9. **Wire real checkout:** once backend plan 04/05 ship `POST /orders`, `GET /orders/{id}`, `GET /orders/{id}/invoice` — replace the Section 5 stub with real submission, WhatsApp URL handoff, invoice download.
10. **Polish/hardening:** loading/empty/error states everywhere, responsive pass, basic accessibility (form labels, focus management, color contrast), Playwright golden-path tests if time allows.

## 11. Open Questions (flag, don't guess silently)

- Exact visual/brand direction — no design system supplied yet; ask before investing heavily in visual polish, or run `design-extract` if brand photos become available.
- Whether admin needs to be mobile-responsive or is desktop-only (owner/staff usage pattern unknown) — ask before spending time on admin responsive design.
- Whether the storefront needs SEO/SSR investment (Next.js App Router gives this by default, but confirm if the business cares about search visibility) — default to letting Server Components handle it without extra work unless told otherwise.
