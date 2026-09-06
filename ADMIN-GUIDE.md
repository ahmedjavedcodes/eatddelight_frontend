# Admin Panel Guide 🔐

## Quick Start

### Access the Admin Panel
- **Login Page:** `http://localhost:3000/admin/login` (or `http://localhost:3001/admin/login`)
- **Admin Link:** Click "Admin" link in the website footer

### Current Branch
Make sure you're on the **`admin`** branch:
```bash
git checkout admin
npm run dev
```

> ⚠️ Admin routes are only available on the `admin` branch, not on `intermediate` or `main`.

---

## Authentication

### Login Credentials
You need a backend admin user to login. The backend will seed a default owner account from environment variables:
- Set `OWNER_EMAIL` and `OWNER_PASSWORD` in backend `.env`
- Run backend migrations to create the owner account
- Use these credentials to login via `/admin/login`

### Authentication Flow
1. User enters email/password on `/admin/login`
2. Frontend calls `POST /api/v1/admin/auth/login`
3. Backend returns JWT access token + user info
4. Token stored in localStorage (Zustand store)
5. All admin API requests include `Authorization: Bearer <token>` header
6. Token auto-included in Authorization header for admin endpoints

---

## Admin Panel Routes

### Public Routes (No Auth Required)
| Route | Purpose |
|-------|---------|
| `/admin/login` | Staff/Owner login page |

### Protected Routes (Auth Required - All Users)
| Route | Purpose | Permissions |
|-------|---------|-------------|
| `/admin/dashboard` | Overview & statistics | All authenticated users |
| `/admin/products` | Manage food items | Create/Update: All; Delete: Owner only |
| `/admin/categories` | Manage categories | Create/Update: All; Delete: Owner only |

### Protected Routes (Auth Required - Owner Only)
| Route | Purpose | Permissions |
|-------|---------|-------------|
| `/admin/staff` | Manage team members | Owner only |

---

## Features by Role

### 👤 Staff Role
- ✅ View dashboard
- ✅ Create new products
- ✅ Update existing products
- ✅ Create new categories
- ✅ Update existing categories
- ❌ Cannot delete products/categories
- ❌ Cannot access staff management

### 👑 Owner Role
- ✅ Full access to all admin features
- ✅ Create/Update/Delete products
- ✅ Create/Update/Delete categories
- ✅ Add new staff members
- ✅ Manage staff permissions
- ✅ Activate/Deactivate staff accounts

---

## API Endpoints (Backend Required)

### Authentication
```
POST /api/v1/admin/auth/login
POST /api/v1/admin/auth/refresh
```

### Products Management
```
GET /api/v1/admin/foods
POST /api/v1/admin/foods
PUT /api/v1/admin/foods/{id}
DELETE /api/v1/admin/foods/{id}  [Owner only]
```

### Categories Management
```
GET /api/v1/admin/categories
POST /api/v1/admin/categories
PUT /api/v1/admin/categories/{id}
DELETE /api/v1/admin/categories/{id}  [Owner only]
```

### Staff Management
```
GET /api/v1/admin/staff  [Owner only]
POST /api/v1/admin/staff  [Owner only]
PATCH /api/v1/admin/staff/{id}  [Owner only]
```

> All requests must include JWT token in Authorization header: `Authorization: Bearer <token>`

---

## Frontend Components

### Pages
- `app/admin/login/page.tsx` - Authentication page
- `app/admin/dashboard/page.tsx` - Dashboard with stats
- `app/admin/products/page.tsx` - Product CRUD interface
- `app/admin/categories/page.tsx` - Category management
- `app/admin/staff/page.tsx` - Staff management
- `app/admin/layout.tsx` - Main admin layout with sidebar navigation

### Forms
- `components/admin/ProductForm.tsx` - Create/Edit products
- `components/admin/CategoryForm.tsx` - Create/Edit categories
- `components/admin/StaffForm.tsx` - Create staff members

### API Clients
- `lib/api/admin.ts` - CRUD operations for products, categories, staff
- `lib/api/auth.ts` - Authentication endpoints
- `lib/store/auth.ts` - Zustand store for JWT tokens and user state

---

## Backend Integration Status

### ✅ Frontend Complete
- Admin panel UI with all pages
- Authentication flow (frontend)
- Form validation
- API client setup
- Role-based access control
- Error handling and user feedback

### ⏳ Backend Implementation Needed
The following backend features need to be implemented (see backend CLAUDE.md Phase 7-8):
1. Admin authentication endpoints (`/admin/auth/login`, `/admin/auth/refresh`)
2. Admin user model and JWT implementation
3. CRUD endpoints for products, categories, add-ons
4. Role-based permission checks on backend
5. Staff management endpoints
6. Database seeding with owner account

---

## Development Notes

### Environment Variables
Make sure these are set in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### Local Testing Without Backend
Currently, the frontend will fail API calls because the backend endpoints don't exist yet. You can:
1. Mock the API responses using Mock Service Worker (MSW)
2. Wait for backend implementation
3. Use browser DevTools to see the expected API calls

### Build
```bash
npm run build
```

### Type Safety
All admin operations are fully typed with TypeScript. API responses are validated against the defined schemas in `lib/api/types.ts`.

---

## Troubleshooting

### Admin Routes Showing 404
**Problem:** Seeing "Page not found" when accessing admin routes
**Solution:** Make sure you're on the `admin` branch
```bash
git status  # Should show "On branch admin"
git checkout admin  # If not on admin branch
```

### Redirected to Login
**Problem:** Being redirected to login on every page
**Solution:** Backend is not running or returning invalid responses
1. Check backend is running: `python -m uvicorn app.main:app --reload`
2. Verify `NEXT_PUBLIC_API_URL` environment variable
3. Check browser console for API errors

### Login Not Working
**Problem:** Login fails with "Invalid credentials"
**Solution:** Backend owner account not seeded
1. Run backend migrations: `alembic upgrade head`
2. Check backend `.env` has `OWNER_EMAIL` and `OWNER_PASSWORD`
3. Verify you're using the correct credentials

---

## Git Branch Management

### Current Setup
- `admin` - Contains admin panel implementation ← **Use this branch**
- `intermediate` - Previous state without admin panel
- `main` - Production/stable branch

### How to Merge Admin to Main
When admin panel backend integration is complete:
```bash
git checkout main
git pull origin main
git merge admin
git push origin main
```

---

## Next Steps

1. **Implement Backend API** (see backend CLAUDE.md Phase 7)
   - Admin authentication with JWT
   - CRUD endpoints for products, categories
   - Role-based permission checks

2. **Test Admin Panel** (once backend is ready)
   - Test login/logout flow
   - Test product CRUD operations
   - Test staff management
   - Test role-based access control

3. **Merge to Main** (when integration complete)
   - Merge `admin` branch to `main`
   - Deploy to production

---

## Support

For issues or questions:
1. Check this guide first
2. Review browser console for errors
3. Check backend API responses
4. Verify environment variables
5. Ensure you're on the correct git branch

---

**Last Updated:** September 7, 2026
**Admin Panel Status:** Frontend Complete ✅ | Backend Pending ⏳
