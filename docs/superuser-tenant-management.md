# Superuser Tenant Management

This feature enables platform-level administrators (role: `super`) to manage tenants across the platform, including tenant creation, listing, basic updates, deletion (no cascading), and full management of a tenant’s payment history.

Contents
- Overview
- Roles & Access Control
- Backend API Contracts
- Frontend Pages & Routes
- Navigation & Visibility
- React Query Hooks
- UI Components
- Validation Rules
- Error Handling
- Manual QA Checklist
- Future Enhancements

---

## Overview

Superusers can:
- Create, list, edit, and delete tenants.
- Manage `paymentHistory` for any tenant (add/update/delete payments).

Tenant admins continue to access and update their own tenant via `GET/PUT /api/tenants/mytenant` with appropriate permissions.

---

## Roles & Access Control

- Only users with `user.role === 'super'` can access the Super Admin UI and routes.
- Implementation:
  - Dashboard routes are guarded with a `SuperGuard` wrapper built on `RoleBasedGuard`.
  - The navigation item is hidden for non-super users using the `roles: ['super']` flag in the nav config.

Code references:
- Routes: `src/routes/sections/dashboard.jsx:1`
- SuperGuard usage: `src/routes/sections/dashboard.jsx:1`
- Nav config entry: `src/layouts/config-nav-dashboard.jsx:1`
- Role filtering in nav: `src/components/nav-section/vertical/nav-list.jsx:1`

---

## Backend API Contracts

Base path: relative to `CONFIG.site.serverUrl`

Tenants (Superuser)
- Create tenant
  - `POST /api/tenants`
  - Body follows `entities/tenant/tenant.model.js` (e.g., `name`, `slug`, `address`, `contactDetails`, `legalInfo`, ...).

- List tenants
  - `GET /api/tenants?search=<text>&page=<n>&limit=<n>`
  - Response example:
    ```json
    {
      "tenants": [{ "_id": "...", "name": "...", "slug": "..." }],
      "total": 123,
      "page": 1,
      "limit": 10
    }
    ```

- Get tenant by id
  - `GET /api/tenants/:id`

- Update tenant (basic fields)
  - `PUT /api/tenants/:id`
  - Body: any subset of editable tenant fields

- Delete tenant
  - `DELETE /api/tenants/:id`
  - Note: No cascading delete is performed.

Payment History (Superuser)
- Add payment
  - `POST /api/tenants/:id/payments`
  - Body
    ```json
    {
      "amount": 12500,
      "paymentDate": "2025-01-10T10:00:00.000Z",
      "paymentMethod": "BankTransfer",
      "status": "PENDING",
      "notes": "Invoice 123 settlement"
    }
    ```

- Update payment
  - `PUT /api/tenants/:id/payments/:paymentId`
  - Body: any subset `{ amount, paymentDate, paymentMethod, status, notes }`

- Delete payment
  - `DELETE /api/tenants/:id/payments/:paymentId`

Validation rules (enforced client-side and expected server-side):
- `amount`: non‑negative number
- `paymentMethod` ∈ { `UPI`, `Card`, `BankTransfer`, `Cash` }
- `status` ∈ { `SUCCESS`, `FAILED`, `PENDING` }
- `paymentDate`: valid date (ISO string recommended)

---

## Frontend Pages & Routes

Routes (under `/dashboard/tenants`) guarded for role `super`:
- List: `/dashboard/tenants` (index) and `/dashboard/tenants/list`
- Details: `/dashboard/tenants/:id`
- New: `/dashboard/tenants/new`
- Edit: `/dashboard/tenants/:id/edit`

Path helpers:
- `src/routes/paths.js:1` → `paths.dashboard.tenants.*`

Route definitions:
- `src/routes/sections/dashboard.jsx:1` → lazy pages for Tenants List/New/Edit inside `tenants` branch wrapped with `SuperGuard`.

Pages:
- List: `src/pages/dashboard/tenants/list.jsx:1`
- Details: `src/pages/dashboard/tenants/details.jsx:1`
- New: `src/pages/dashboard/tenants/new.jsx:1`
- Edit: `src/pages/dashboard/tenants/edit.jsx:1`

---

## Navigation & Visibility

Sidebar item (visible only for `role = 'super'`):
- Group: “Super Admin”
- Item: “Tenants” → children “List” and “Create”
- Configured at `src/layouts/config-nav-dashboard.jsx:1` with `roles: ['super']`.

Nav role filtering occurs in `src/components/nav-section/vertical/nav-list.jsx:1` (checks `data.roles`).

---

## React Query Hooks

Location: `src/query/use-tenant-admin.js:1`

Provided hooks:
- `usePaginatedTenants(params)`
  - Params: `{ search?: string, page?: number, limit?: number }`
- `useTenantById(id)`
- `useCreateTenant()` → `{ createTenant }`
- `useUpdateTenantById()` → `{ updateTenantById }`
- `useDeleteTenant()` → `{ deleteTenant }`
- `useTenantPayments()` → `{ addPayment, updatePayment, deletePayment }`

Usage examples:
```js
// List
const { data, isLoading } = usePaginatedTenants({ search, page: 1, limit: 10 });

// Create
const { createTenant } = useCreateTenant();
await createTenant({ name: 'Acme', slug: 'acme' });

// Update
const { updateTenantById } = useUpdateTenantById();
await updateTenantById({ id: tenantId, data: { name: 'Acme Ltd.' } });

// Payments
const { addPayment, updatePayment, deletePayment } = useTenantPayments();
await addPayment({ tenantId, payment: { amount: 5000, paymentDate: new Date().toISOString(), paymentMethod: 'UPI' } });
```

---

## UI Components

List view:
- `src/sections/tenant-admin/tenant-admin-list-view.jsx:1`
  - Search + pagination; actions: Edit/Delete with confirmation.

Create view:
- `src/sections/tenant-admin/tenant-admin-create-view.jsx:1`
  - Form for `name`, `slug`, `address`, `contactDetails`, `legalInfo`.

Edit view:
- `src/sections/tenant-admin/tenant-admin-edit-view.jsx:1`
  - Two columns: left (Tenant form), right (Payment history manager).

Form component:
- `src/sections/tenant-admin/tenant-admin-form.jsx:1`
  - zod-validated; cleans empty optional fields.

Payments manager:
- `src/sections/tenant-admin/tenant-admin-payments.jsx:1`
  - Add/Edit dialog enforces validation; delete confirmation.

Tenant-scoped (unchanged):
- Settings page: `src/pages/dashboard/tenant/index.jsx:1` (links to `TenantEditView`)
- Payment history page: `src/pages/dashboard/payments/index.jsx:1`

---

## Validation Rules

Tenant (admin form):
- Requires `name` and `slug`.
- Optional nested objects cleaned to `undefined` when empty to avoid noisy updates.

Payment:
- `amount ≥ 0`, `paymentMethod` ∈ allowed set, `status` ∈ allowed set, valid `paymentDate`.
- Client-side validation via zod; server should enforce the same.

---

## Error Handling

- All mutations show toast notifications on success and error with server-provided `message` when available.
- Delete tenant shows a no-cascade warning in the confirmation dialog.

---

## Manual QA Checklist

Setup
- Ensure logged-in user has `role = 'super'`. Non-super users must not see the “Super Admin” group.

Navigation & Access
- Verify “Super Admin → Tenants” appears only for super users.
- Direct navigation to `/dashboard/tenants` denies access for non-super users.

Tenants CRUD
- Create a tenant with minimal fields (name, slug) succeeds.
- Listing shows search working across name/slug/address.
- Edit updates fields; re-fetch shows persisted values.
- Delete removes from listing and shows success toast.

Payments
- Add payment with each method and status; amount cannot be negative.
- Edit a payment; values update in-place.
- Delete a payment; list refreshes.

Regression
- Tenant admins can still view/update `mytenant` pages.

---

## Future Enhancements

- Extend superuser edit form to include theme, bank details, and integrations parity with tenant-scoped editor.
- Add receipt PDF download to the superuser payments manager (mirroring tenant-scoped Payments page).
- Bulk tenant import/export.
- Soft-delete with recovery window and optional cascading clean-up tooling.
