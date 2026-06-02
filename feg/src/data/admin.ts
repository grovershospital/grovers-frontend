// ============================================================
// Admin data layer
// ============================================================
// Phase 1 = stubs. Phase 2 swaps each fetcher body for a real
// api.get(...) call against the backend. Same pattern as portal.ts.
// ============================================================

export type AdminUser = {
    firstName: string;
    lastName: string;
    email: string;
};

const STUB_ADMIN: AdminUser = {
    firstName: "Admin",
    lastName: "User",
    email: "admin@grovershospital.com.ng",
};

export async function fetchAdminUser(): Promise<AdminUser> {
    // TODO (backend): replace with api.get("/admin/me") once auth is wired up.
    return Promise.resolve(STUB_ADMIN);
}