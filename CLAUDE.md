# CLAUDE.md — Daughter's Delight Frontend

**Daughter's Delight** is a home-kitchen food business. This frontend consumes the backend API (`NEXT_PUBLIC_API_URL`, default `http://localhost:8000/api/v1`).

## Business Context

- Home kitchen taking orders via Instagram DM and phone
- Two menus: **Menu of the Day** (1 item/weekday) and **Full Menu** (à la carte, min. 3/item)
- No customer accounts, no payment. Anonymous cart (localStorage), checkout via WhatsApp
- Admin panel: `owner` (full CRUD + delete + staff mgmt + settings) and `staff` (create/update only)

## Tech Stack

- **Framework:** Next.js (App Router), TypeScript, Tailwind CSS
- **Data:** native `fetch` + typed API client (`lib/api/`), RSC where practical
- **Forms:** react-hook-form + zod (mirror backend Pydantic constraints)
- **State:** Zustand (cart/favourites in localStorage, versioned keys `dd:cart:v1`, `dd:favourites:v1`)
- **Admin auth:** JWT in memory + short-lived cookie refresh (no third-party auth)
- **Icons:** lucide-react
- **Scroll:** Locomotive Scroll (smooth, fixed header)

## Routes

**Storefront (public):**
- `/` — home, `/about`, `/contact`, `/weekly-menu`, `/menu` (search + filters)
- `/food/[id]` — detail + add-to-cart
- `/cart`, `/favourites`, `/checkout` (order summary, WhatsApp/invoice handoff)
- `/custom-orders` — bespoke requests

**Admin (`/admin`):**
- `/login` — email/password
- `/categories`, `/foods`, `/addons` — CRUD (delete: owner only)
- `/orders`, `/staff`, `/settings` (owner only), `/contact-messages`

## Cart & Favourites (Client-Side Only)

- Entirely in browser, **never** synced to backend
- Cart line: `{foodId, name, unitPrice, quantity, notes?, addOns: [{addOnId, name, unitPrice, quantity}]}`
- Enforce `min_order_quantity` and `is_available` client-side, but always re-validate at checkout
- No session token needed (backend's Cart tables unused)

## API Client

Single `lib/api/client.ts`: base URL from env, attaches `Authorization: Bearer <token>` for admin calls, parses error envelope `{detail, code}`. One module per resource (`lib/api/menu.ts`, `lib/api/foods.ts`, etc.).

## Key Constraints

- Every menu item can appear twice (e.g., "Alfredo Pasta" as Thursday special AND House Favourites) — model as **separate Food rows**
- Advance order rule: `requested_date ≥ tomorrow` (Asia/Karachi time), **day-of-week specials** must match their day (if today is Monday, earliest Monday special date is next Monday)
- No mock-heavy testing; when tests touch cart/checkout, they must use real API calls or carefully scoped fixtures

## Build Status

✅ Scaffolding, read pages (home, about, menu, weekly-menu, food detail), cart/favourites UI, contact form
✅ Admin login, auth guard, role-aware nav, CRUD (categories, foods, add-ons, staff, settings, contact inbox)
⏳ Order creation (`POST /orders`), invoice PDF download
