import {api} from '../lib/api'
import {formatDateLong, formatDateShort, formatMonthYear, formatRelative} from "../lib/format.ts";

;

export type AdminUser = {
    firstName: string;
    lastName: string;
    email: string;
};


type AdminMeResponse = {
    id: number;
    fullName: string;
    email: string;
    role: string;
};

export async function fetchAdminUser(): Promise<AdminUser> {
    const data = await api.get<AdminMeResponse>("/admin/me");
    // Backend returns fullName as a single string; split it pragmatically for
    // the "Hi {firstName}!" greeting and sidebar profile. Multi-token last
    // names are joined back together.
    const tokens = data.fullName.trim().split(/\s+/);
    const firstName = tokens[0] ?? "";
    const lastName = tokens.slice(1).join(" ");
    return {firstName, lastName, email: data.email};
}

// ─── Dashboard summary ───────────────────────────────────────

export type AdminDashboardSummary = {
    pendingAppointments: number;
    pendingProfileUpdates: number;
    unreadFeedback: number;
    articleDrafts: number;
};

type AdminDashboardStatsResponse = {
    unreadFeedback: number;
    pendingAppointments: number;
    profileUpdatesPending: number;
    articleDrafts: number;
};

export async function fetchAdminDashboardSummary(): Promise<AdminDashboardSummary> {
    const data = await api.get<AdminDashboardStatsResponse>(
        "/admin/dashboard/stats",
    );
    return {
        pendingAppointments: data.pendingAppointments,
        pendingProfileUpdates: data.profileUpdatesPending,
        unreadFeedback: data.unreadFeedback,
        articleDrafts: data.articleDrafts,
    };
}

// ─── Recent activity (shared types used by full section pages later) ──

export type AdminAppointmentStatus =
    | "Pending"
    | "Confirmed"
    | "Cancelled"
    | "Completed";

export type AdminAppointmentSummary = {
    id: string;
    patientName: string;
    department: string;
    date: string;      // display format e.g. "15th May"
    time: string;      // display format e.g. "2pm"
    status: AdminAppointmentStatus;
};

export type AdminFeedbackType =
    | "Compliment"
    | "Complaint"
    | "Suggestion"
    | "General feedback";


// ─── Shared admin booking response shape ────────────────────

type AdminBookingResponse = {
    id: number;
    bookingType: "CONSULTATION" | "PACKAGE" | "SCREENING";
    status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
    preferredDate: string;
    patientId: number;
    patientFirstName: string;
    patientLastName: string;
    patientEmail: string;
    patientPhone: string;
    departmentId: number | null;
    departmentName: string | null;
    packageId: number | null;
    packageName: string | null;
    packageTierId: number | null;
    packageTierName: string | null;
    notes: string | null;
    adminNotes: string | null;
    createdAt: string;
    updatedAt: string;
};

type AdminPageResponse<T> = {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
};

// FIX: Combined onto a properly formatted Record<K, V> syntax
const ADMIN_BOOKING_STATUS_MAP: Record<
    AdminBookingResponse["status"],
    AdminAppointmentStatus
> = {
    PENDING: "Pending",
    CONFIRMED: "Confirmed",
    CANCELLED: "Cancelled",
    COMPLETED: "Completed",
};

function toAdminAppointmentSummary(
    b: AdminBookingResponse,
): AdminAppointmentSummary {
    return {
        id: String(b.id),
        patientName: `${b.patientFirstName} ${b.patientLastName}`.trim() || "—",
        department:
            b.departmentName ??
            b.packageName ??
            "Booking",
        date: formatDateShort(b.preferredDate),
        time: "—", // no time field on booking
        status: ADMIN_BOOKING_STATUS_MAP[b.status],
    };
}

export async function fetchRecentAdminAppointments(): Promise<
    AdminAppointmentSummary[]
> {
    const data = await api.get<AdminPageResponse<AdminBookingResponse>>(
        "/admin/bookings?page=0&size=5",
    );
    return data.content.map(toAdminAppointmentSummary);
}


// ─── Feedback (admin) ────────────────────────────────────────

export type AdminFeedbackStatus =
    | "Pending"
    | "Under review"
    | "Reviewed"
    | "Response sent";

export type AdminContactMethod = "Email" | "Phone" | "WhatsApp" | "Any";

const STATUS_TO_BACKEND: Record<AdminFeedbackStatus, string> = {
    Pending: "PENDING",
    "Under review": "UNDER_REVIEW",
    Reviewed: "REVIEWED",
    "Response sent": "RESPONSE_SENT",
};

const STATUS_FROM_BACKEND: Record<string, AdminFeedbackStatus> = {
    NEW: "Pending",            // backend sometimes uses NEW as initial state
    PENDING: "Pending",
    UNDER_REVIEW: "Under review",
    REVIEWED: "Reviewed",
    RESPONSE_SENT: "Response sent",
};

const TYPE_FROM_BACKEND: Record<string, AdminFeedbackType> = {
    COMPLIMENT: "Compliment",
    COMPLAINT: "Complaint",
    SUGGESTION: "Suggestion",
    GENERAL: "General feedback",
};

const TYPE_TO_BACKEND: Record<AdminFeedbackType, string> = {
    Compliment: "COMPLIMENT",
    Complaint: "COMPLAINT",
    Suggestion: "SUGGESTION",
    "General feedback": "GENERAL",
};

const CONTACT_FROM_BACKEND: Record<string, AdminContactMethod> = {
    EMAIL: "Email",
    PHONE: "Phone",
    WHATSAPP: "WhatsApp",
    ANY: "Any",
};

export type AdminFeedbackEntry = {
    id: string;
    patientName: string;
    patientEmail: string | null;
    patientPhone: string | null;
    type: AdminFeedbackType;
    subject: string;
    message: string;
    rating: number | null;
    wantsResponse: boolean;
    contactMethod: AdminContactMethod | null;
    status: AdminFeedbackStatus;
    isRead: boolean;
    adminInternalNotes: string;
    createdAt: string;
    createdAtDisplay: string;
};

export type AdminFeedbackFilters = {
    search?: string;
    type?: AdminFeedbackType | "all";
    status?: AdminFeedbackStatus | "all";
    readState?: "all" | "unread" | "read";
};

export type AdminFeedbackPage = {
    entries: AdminFeedbackEntry[];
    total: number;
    page: number;
    pageSize: number;
};

type AdminFeedbackListResponse = {
    id: number;
    name: string | null;
    email: string | null;
    subject: string | null;
    message: string;
    source: "HOMEPAGE" | "PORTAL";
    type: keyof typeof TYPE_FROM_BACKEND;
    rating: number | null;
    responseWanted: boolean;
    preferredContactMethod: keyof typeof CONTACT_FROM_BACKEND | null;
    status: string;
    isRead: boolean;
    patientId: number | null;
    createdAt: string;
};

type AdminFeedbackDetailResponse = AdminFeedbackListResponse & {
    adminInternalNotes: string | null;
    // Detail endpoint includes patient identity fields when source = PORTAL.
    // Field names assumed; adjust mapping below if backend uses different keys.
    patientFirstName?: string | null;
    patientLastName?: string | null;
    patientPhone?: string | null;
};

// Recent feedback card on the admin dashboard. Fetches the latest 5 portal
// feedback entries, sorted newest-first. Same shape as AdminFeedbackEntry but
// only the summary fields the card renders.
export type AdminFeedbackSummary = {
    id: string;
    patientName: string;
    type: AdminFeedbackType;
    excerpt: string;
    status: AdminFeedbackStatus;
    createdAt: string;
};

export async function fetchRecentAdminFeedback(): Promise<AdminFeedbackSummary[]> {
    const data = await api.get<AdminPageResponseShape<AdminFeedbackListResponse>>(
        "/admin/feedback/filtered?source=PORTAL&page=0&size=5",
    );

    return data.content.map((f) => {
        const excerpt =
            f.message.length > 80 ? `${f.message.slice(0, 80).trim()}…` : f.message;

        return {
            id: String(f.id),
            patientName: f.patientId ? `Patient #${f.patientId}` : "Anonymous",
            type: TYPE_FROM_BACKEND[f.type] ?? "General feedback",
            excerpt,
            status: STATUS_FROM_BACKEND[f.status] ?? "Pending",
            createdAt: formatRelative(f.createdAt),
        };
    });
}

function patientNameFromResponse(
    f: AdminFeedbackListResponse | AdminFeedbackDetailResponse,
): string {
    // PORTAL feedback: backend should have patient identity. Detail endpoint
    // gives us firstName/lastName if available.
    if ("patientFirstName" in f && f.patientFirstName) {
        return `${f.patientFirstName} ${f.patientLastName ?? ""}`.trim();
    }
    // List endpoint doesn't include name; show patient id placeholder.
    if (f.patientId) return `Patient #${f.patientId}`;
    return "Anonymous";
}

function toFeedbackEntry(
    f: AdminFeedbackListResponse | AdminFeedbackDetailResponse,
): AdminFeedbackEntry {
    return {
        id: String(f.id),
        patientName: patientNameFromResponse(f),
        patientEmail: f.email,
        patientPhone:
            "patientPhone" in f ? f.patientPhone ?? null : null,
        type: TYPE_FROM_BACKEND[f.type] ?? "General feedback",
        subject: f.subject ?? "",
        message: f.message,
        rating: f.rating,
        wantsResponse: f.responseWanted,
        contactMethod: f.preferredContactMethod
            ? CONTACT_FROM_BACKEND[f.preferredContactMethod]
            : null,
        status: STATUS_FROM_BACKEND[f.status] ?? "Pending",
        isRead: f.isRead,
        adminInternalNotes:
            "adminInternalNotes" in f ? f.adminInternalNotes ?? "" : "",
        createdAt: f.createdAt,
        createdAtDisplay: formatRelative(f.createdAt),
    };
}

type AdminPageResponseShape<T> = {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
};

export async function fetchAdminFeedback(
    filters: AdminFeedbackFilters,
    page: number,
    pageSize: number,
): Promise<AdminFeedbackPage> {
    const params = new URLSearchParams();
    params.set("source", "PORTAL");
    params.set("page", String(page - 1));        // backend is 0-indexed
    params.set("size", String(pageSize));
    if (filters.status && filters.status !== "all") {
        params.set("status", STATUS_TO_BACKEND[filters.status]);
    }
    if (filters.type && filters.type !== "all") {
        params.set("type", TYPE_TO_BACKEND[filters.type]);
    }
    if (filters.readState === "unread") params.set("isRead", "false");
    if (filters.readState === "read") params.set("isRead", "true");

    const data = await api.get<AdminPageResponseShape<AdminFeedbackListResponse>>(
        `/admin/feedback/filtered?${params.toString()}`,
    );

    let entries = data.content.map(toFeedbackEntry);

    // Backend search isn't a parameter on /filtered; do it client-side.
    if (filters.search) {
        const q = filters.search.toLowerCase();
        entries = entries.filter((e) => {
            const hay = `${e.patientName} ${e.subject} ${e.message}`.toLowerCase();
            return hay.includes(q);
        });
    }

    return {
        entries,
        total: data.totalElements,
        page,
        pageSize,
    };
}

export async function fetchAdminFeedbackDetail(
    id: string,
): Promise<AdminFeedbackEntry> {
    const data = await api.get<AdminFeedbackDetailResponse>(
        `/admin/feedback/${id}/detail`,
    );
    return toFeedbackEntry(data);
}

export async function markFeedbackRead(id: string): Promise<void> {
    await api.patch<unknown>(`/admin/feedback/${id}/read`);
}

export async function updateFeedbackStatus(
    id: string,
    status: AdminFeedbackStatus,
    adminInternalNotes: string,
): Promise<AdminFeedbackEntry> {
    const data = await api.put<AdminFeedbackDetailResponse>(
        `/admin/feedback/${id}/status`,
        {
            status: STATUS_TO_BACKEND[status],
            adminInternalNotes: adminInternalNotes || undefined,
        },
    );
    return toFeedbackEntry(data);
}

// ─── Bookings (admin) ────────────────────────────────────────

export type AdminBookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export type AdminBookingType = "Consultation" | "Screening" | "Package";

export type AdminBookingActivity = {
    id: string;
    description: string;          // "Confirmed by Admin User" / "Status changed to Cancelled" etc.
    createdAtDisplay: string;
};

export type AdminBookingSummary = {
    id: string;                   // full id
    shortId: string;              // last 6 chars, for the list view
    patientName: string;
    patientId: string;
    department: string;
    type: AdminBookingType;
    preferredDate: string;        // e.g. "15th May 2026"
    status: AdminBookingStatus;
    createdAtDisplay: string;     // when booking was made
};

export type AdminBookingDetail = AdminBookingSummary & {
    patientEmail: string;
    patientPhone: string;
    patientNotes: string | null;
    adminNotes: string;
};

const BOOKING_TYPE_FROM_BACKEND: Record<
    AdminBookingResponse["bookingType"],
    AdminBookingType
> = {
    CONSULTATION: "Consultation",
    SCREENING: "Screening",
    PACKAGE: "Package",
};

const BOOKING_STATUS_TO_BACKEND: Record<
    AdminBookingStatus,
    AdminBookingResponse["status"]
> = {
    Pending: "PENDING",
    Confirmed: "CONFIRMED",
    Cancelled: "CANCELLED",
    Completed: "COMPLETED",
};

function shortIdFor(id: number): string {
    return String(id).padStart(6, "0").slice(-6);
}

function toAdminBookingSummary(b: AdminBookingResponse): AdminBookingSummary {
    return {
        id: String(b.id),
        shortId: shortIdFor(b.id),
        patientName: `${b.patientFirstName} ${b.patientLastName}`.trim() || "—",
        patientId: String(b.patientId),
        department: b.departmentName ?? b.packageName ?? "—",
        type: BOOKING_TYPE_FROM_BACKEND[b.bookingType],
        preferredDate: formatDateShort(b.preferredDate),
        status: ADMIN_BOOKING_STATUS_MAP[b.status],
        createdAtDisplay: formatRelative(b.createdAt),
    };
}

function toAdminBookingDetail(b: AdminBookingResponse): AdminBookingDetail {
    return {
        ...toAdminBookingSummary(b),
        patientEmail: b.patientEmail,
        patientPhone: b.patientPhone,
        patientNotes: b.notes,
        adminNotes: b.adminNotes ?? "",
    };
}

export type AdminBookingFilters = {
    search?: string;
    status?: AdminBookingStatus | "all";
    type?: AdminBookingType | "all";
};

export type AdminBookingPage = {
    entries: AdminBookingSummary[];
    total: number;
    page: number;
    pageSize: number;
};

export async function fetchAdminBookings(
    filters: AdminBookingFilters,
    page: number,
    pageSize: number,
): Promise<AdminBookingPage> {
    const params = new URLSearchParams();
    params.set("page", String(page - 1));          // backend is 0-indexed
    params.set("size", String(pageSize));
    if (filters.status && filters.status !== "all") {
        params.set("status", BOOKING_STATUS_TO_BACKEND[filters.status]);
    }
    // NOTE (backend): /admin/bookings only supports `status` server-side.
    // Type and search filtering happen client-side on the returned page —
    // this will under-count when those filters are active across many pages.
    // Add `type` and `search` query params on the backend when convenient.

    const data = await api.get<AdminPageResponse<AdminBookingResponse>>(
        `/admin/bookings?${params.toString()}`,
    );

    let entries = data.content.map(toAdminBookingSummary);

    if (filters.type && filters.type !== "all") {
        entries = entries.filter((b) => b.type === filters.type);
    }
    if (filters.search) {
        const q = filters.search.toLowerCase();
        entries = entries.filter((b) => b.patientName.toLowerCase().includes(q));
    }

    return {
        entries,
        total: data.totalElements,
        page,
        pageSize,
    };
}

export async function fetchAdminBookingDetail(id: string): Promise<AdminBookingDetail> {
    const data = await api.get<AdminBookingResponse>(`/admin/bookings/${id}`);
    return toAdminBookingDetail(data);
}

export type BookingStatusUpdate = {
    status: AdminBookingStatus;
    adminNotes?: string;
};

export type BookingStatusUpdateResult = {
    booking: AdminBookingDetail;
    visitId?: string;     // present only when status transitioned to Completed
};

export async function updateBookingStatus(
    id: string,
    update: BookingStatusUpdate,
): Promise<BookingStatusUpdateResult> {
    const data = await api.put<AdminBookingResponse>(
        `/admin/bookings/${id}/status`,
        {
            status: BOOKING_STATUS_TO_BACKEND[update.status],
            adminNotes: update.adminNotes,
        },
    );

    const result: BookingStatusUpdateResult = {booking: toAdminBookingDetail(data)};

    // Backend auto-creates a visit stub when status flips to COMPLETED.
    // Chase its id so AdminBookingDetail can deep-link into the visit edit form.
    if (update.status === "Completed") {
        try {
            const visit = await api.get<{ id: number }>(`/admin/bookings/${id}/visit`);
            result.visitId = String(visit.id);
        } catch {
            // Don't fail the status update if the visit lookup fails — admin
            // can still reach the new visit via the patient's Visits tab.
        }
    }

    return result;
}

export async function updateBookingNotes(
    id: string,
    adminNotes: string,
): Promise<AdminBookingDetail> {
    const data = await api.put<AdminBookingResponse>(
        `/admin/bookings/${id}/notes`,
        {adminNotes},
    );
    return toAdminBookingDetail(data);
}

export async function fetchAdminBookingActivity(
    _id: string,
): Promise<AdminBookingActivity[]> {
    // TODO (backend): no activity log endpoint yet. Returning empty so the
    // Activity card renders an empty state without erroring.
    return Promise.resolve([]);
}

function toSummary(b: AdminBookingDetail): AdminBookingSummary {
    return {
        id: b.id,
        shortId: b.shortId,
        patientName: b.patientName,
        patientId: b.patientId,
        department: b.department,
        type: b.type,
        preferredDate: b.preferredDate,
        status: b.status,
        createdAtDisplay: b.createdAtDisplay,
    };
}

// ─── Patients ────────────────────────────────────────────────

export type AdminPatientGender = "Male" | "Female" | "Other" | "Not specified";

export type AdminPatientSummary = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    memberSinceDisplay: string;
};

export type AdminPatientProfile = AdminPatientSummary & {
    dateOfBirth: string;
    dateOfBirthIso: string;
    gender: AdminPatientGender
    whatsapp: string | null;
};

export type BloodGroup =
    | "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"
    | "Unknown";

export type Genotype = "AA" | "AS" | "AC" | "SS" | "SC" | "Unknown";

type AdminPatientResponse = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    whatsappNumber: string | null;
    dateOfBirth: string | null;   // YYYY-MM-DD
    gender: string | null;        // backend stores as uppercase enum string
    isActive: boolean;
    createdAt: string;            // ISO timestamp
};

function mapGenderFromBackend(raw: string | null): AdminPatientGender {
    if (!raw) return "Not specified";
    const normalized = raw.toUpperCase();
    if (normalized === "MALE") return "Male";
    if (normalized === "FEMALE") return "Female";
    if (normalized === "OTHER") return "Other";
    return "Not specified";
}

function mapGenderToBackend(g: AdminPatientGender): string | null {
    if (g === "Not specified") return null;
    return g.toUpperCase();
}

function toAdminPatientSummary(p: AdminPatientResponse): AdminPatientSummary {
    return {
        id: String(p.id),
        firstName: p.firstName,
        lastName: p.lastName,
        email: p.email,
        phone: p.phone,
        memberSinceDisplay: formatMonthYear(p.createdAt),
    };
}

function toAdminPatientProfile(p: AdminPatientResponse): AdminPatientProfile {
    return {
        ...toAdminPatientSummary(p),
        dateOfBirth: p.dateOfBirth ? formatDateLong(p.dateOfBirth) : "—",
        dateOfBirthIso: p.dateOfBirth ?? "",
        gender: mapGenderFromBackend(p.gender),
        whatsapp: p.whatsappNumber,
    };
}

export type AdminHealthProfile = {
    patientId: string;
    bloodGroup: BloodGroup;
    genotype: Genotype;
    heightCm: string;           // string-typed for empty-input handling, parsed on submit
    weightKg: string;
    allergies: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    emergencyContactRelationship: string;
    clinicalNotes: string;
};

const BLOOD_GROUP_VALUES: readonly BloodGroup[] = [
    "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown",
];

const GENOTYPE_VALUES: readonly Genotype[] = ["AA", "AS", "AC", "SS", "SC", "Unknown"];

function mapBloodGroupFromBackend(raw: string | null): BloodGroup {
    if (!raw) return "Unknown";
    return BLOOD_GROUP_VALUES.includes(raw as BloodGroup)
        ? (raw as BloodGroup)
        : "Unknown";
}

function mapGenotypeFromBackend(raw: string | null): Genotype {
    if (!raw) return "Unknown";
    return GENOTYPE_VALUES.includes(raw as Genotype)
        ? (raw as Genotype)
        : "Unknown";
}

// "Unknown" maps to empty string on the wire — backend treats both as unset.
function mapBloodGroupToBackend(g: BloodGroup): string {
    return g === "Unknown" ? "" : g;
}

function mapGenotypeToBackend(g: Genotype): string {
    return g === "Unknown" ? "" : g;
}

type AdminHealthProfileResponse = {
    id: number;
    patientId: number;
    patientName: string;
    patientEmail: string;
    bloodGroup: string | null;
    genotype: string | null;
    allergies: string | null;
    clinicalNotes: string | null;
    heightCm: number;
    weightKg: number;
    emergencyContactName: string | null;
    emergencyContactRelationship: string | null;
    emergencyContactPhone: string | null;
    createdAt: string;
    updatedAt: string;
};

function toAdminHealthProfile(
    patientId: string,
    r: AdminHealthProfileResponse,
): AdminHealthProfile {
    return {
        patientId,
        bloodGroup: mapBloodGroupFromBackend(r.bloodGroup),
        genotype: mapGenotypeFromBackend(r.genotype),
        // Treat 0 as unset on read; empty string keeps the input empty in the form.
        heightCm: r.heightCm ? String(r.heightCm) : "",
        weightKg: r.weightKg ? String(r.weightKg) : "",
        allergies: r.allergies ?? "",
        emergencyContactName: r.emergencyContactName ?? "",
        emergencyContactRelationship: r.emergencyContactRelationship ?? "",
        emergencyContactPhone: r.emergencyContactPhone ?? "",
        clinicalNotes: r.clinicalNotes ?? "",
    };
}

export async function fetchAdminHealthProfile(
    patientId: string,
): Promise<AdminHealthProfile> {
    // Backend auto-creates an empty profile on first GET — never 404s.
    const data = await api.get<AdminHealthProfileResponse>(
        `/admin/patients/${patientId}/health-profile`,
    );
    return toAdminHealthProfile(patientId, data);
}

export type AdminPatientPage = {
    entries: AdminPatientSummary[];
    total: number;
    page: number;
    pageSize: number;
};

export async function fetchAdminPatients(
    search: string,
    page: number,
    pageSize: number,
): Promise<AdminPatientPage> {
    const params = new URLSearchParams();
    params.set("page", String(page - 1));
    params.set("size", String(pageSize));
    if (search.trim()) params.set("search", search.trim());

    const data = await api.get<AdminPageResponse<AdminPatientResponse>>(
        `/admin/patients?${params.toString()}`,
    );

    return {
        entries: data.content.map(toAdminPatientSummary),
        total: data.totalElements,
        page,
        pageSize,
    };
}

export async function fetchAdminPatient(id: string): Promise<AdminPatientProfile> {
    const data = await api.get<AdminPatientResponse>(`/admin/patients/${id}`);
    return toAdminPatientProfile(data);
}

export type AdminPatientUpdateInput = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    whatsapp: string;             // empty string clears
    dateOfBirthIso: string;       // YYYY-MM-DD; empty string clears
    gender: AdminPatientGender;
};

export async function updateAdminPatient(
    id: string,
    input: AdminPatientUpdateInput,
): Promise<AdminPatientProfile> {
    const body = {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone,
        whatsappNumber: input.whatsapp || null,
        dateOfBirth: input.dateOfBirthIso || null,
        gender: mapGenderToBackend(input.gender),
    };
    const data = await api.put<AdminPatientResponse>(`/admin/patients/${id}`, body);
    return toAdminPatientProfile(data);
}


export async function updateAdminHealthProfile(
    patientId: string,
    profile: AdminHealthProfile,
): Promise<AdminHealthProfile> {
    const body = {
        bloodGroup: mapBloodGroupToBackend(profile.bloodGroup),
        genotype: mapGenotypeToBackend(profile.genotype),
        allergies: profile.allergies,
        clinicalNotes: profile.clinicalNotes,
        heightCm: profile.heightCm ? Number(profile.heightCm) : 0,
        weightKg: profile.weightKg ? Number(profile.weightKg) : 0,
        emergencyContactName: profile.emergencyContactName,
        emergencyContactRelationship: profile.emergencyContactRelationship,
        emergencyContactPhone: profile.emergencyContactPhone,
    };
    const data = await api.put<AdminHealthProfileResponse>(
        `/admin/patients/${patientId}/health-profile`,
        body,
    );
    return toAdminHealthProfile(patientId, data);
}

function toPatientSummary(p: AdminPatientProfile): AdminPatientSummary {
    return {
        id: p.id,
        firstName: p.firstName,
        lastName: p.lastName,
        email: p.email,
        phone: p.phone,
        memberSinceDisplay: p.memberSinceDisplay,
    };
}

// ─── Medications & Conditions ────────────────────────────────

export type AdminMedication = {
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    startedOn: string;          // display e.g. "15th Mar 2026"
    startDateIso: string;       // YYYY-MM-DD for date input
    endedOn: string;            // display string, empty if ongoing
    endDateIso: string;         // YYYY-MM-DD, empty if ongoing
    isActive: boolean;
    prescribedByText: string;
    notes: string;
};

export type MedicationInput = {
    name: string;
    dosage: string;
    frequency: string;
    startDateIso: string;       // required
    endDateIso: string;         // empty string = no end date
    isActive: boolean;
    prescribedByText: string;
    notes: string;
};

type AdminMedicationResponse = {
    id: number;
    name: string;
    dosage: string | null;
    frequency: string | null;
    startDate: string | null;
    endDate: string | null;
    isActive: boolean;
    notes: string | null;
    prescribedById: number | null;
    prescribedByName: string | null;
    createdAt: string;
    updatedAt: string;
};

function toAdminMedication(m: AdminMedicationResponse): AdminMedication {
    return {
        id: String(m.id),
        name: m.name,
        dosage: m.dosage ?? "",
        frequency: m.frequency ?? "",
        startedOn: m.startDate ? formatDateShort(m.startDate) : "",
        startDateIso: m.startDate ?? "",
        endedOn: m.endDate ? formatDateShort(m.endDate) : "",
        endDateIso: m.endDate ?? "",
        isActive: m.isActive,
        // Backend resolves prescribedByName from id when a doctor is linked,
        // otherwise we'll surface whatever free text was stored. Doctor picker
        // is deferred — for now we always send via prescribedByText.
        prescribedByText: m.prescribedByName ?? "",
        notes: m.notes ?? "",
    };
}

function medicationInputToBody(input: MedicationInput) {
    return {
        name: input.name,
        dosage: input.dosage,
        frequency: input.frequency,
        startDate: input.startDateIso || null,
        endDate: input.endDateIso || null,
        isActive: input.isActive,
        notes: input.notes,
        prescribedById: null,             // doctor picker deferred
        prescribedByText: input.prescribedByText,
    };
}

export type ChronicConditionStatus = "Active" | "Managed" | "In remission";

export type AdminCondition = {
    id: string;
    name: string;
    diagnosedDate: string;          // display e.g. "15th Mar 2024"
    diagnosedDateIso: string;       // YYYY-MM-DD for date input
    status: ChronicConditionStatus;
    managingDoctorText: string;
    notes: string;
};


export type ConditionInput = {
    name: string;
    diagnosedDateIso: string;
    status: ChronicConditionStatus;
    managingDoctorText: string;
    notes: string;
};

type ConditionBackendStatus = "ACTIVE" | "MANAGED" | "IN_REMISSION";

const CONDITION_STATUS_FROM_BACKEND: Record<
    ConditionBackendStatus,
    ChronicConditionStatus
> = {
    ACTIVE: "Active",
    MANAGED: "Managed",
    IN_REMISSION: "In remission",
};

const CONDITION_STATUS_TO_BACKEND: Record<
    ChronicConditionStatus,
    ConditionBackendStatus
> = {
    Active: "ACTIVE",
    Managed: "MANAGED",
    "In remission": "IN_REMISSION",
};

type AdminConditionResponse = {
    id: number;
    name: string;
    diagnosedDate: string | null;
    status: string;
    notes: string | null;
    managingDoctorId: number | null;
    managingDoctorName: string | null;
    createdAt: string;
    updatedAt: string;
};

function toAdminCondition(c: AdminConditionResponse): AdminCondition {
    return {
        id: String(c.id),
        name: c.name,
        diagnosedDate: c.diagnosedDate ? formatDateShort(c.diagnosedDate) : "",
        diagnosedDateIso: c.diagnosedDate ?? "",
        status:
            CONDITION_STATUS_FROM_BACKEND[c.status as ConditionBackendStatus] ??
            "Active",
        managingDoctorText: c.managingDoctorName ?? "",
        notes: c.notes ?? "",
    };
}

function conditionInputToBody(input: ConditionInput) {
    return {
        name: input.name,
        diagnosedDate: input.diagnosedDateIso || null,
        status: CONDITION_STATUS_TO_BACKEND[input.status],
        notes: input.notes,
        managingDoctorId: null,        // doctor picker deferred
        managingDoctorText: input.managingDoctorText,
    };
}

export async function fetchAdminConditions(
    patientId: string,
): Promise<AdminCondition[]> {
    const data = await api.get<AdminConditionResponse[]>(
        `/admin/patients/${patientId}/conditions`,
    );
    return data.map(toAdminCondition);
}

export async function createAdminCondition(
    patientId: string,
    input: ConditionInput,
): Promise<AdminCondition> {
    const data = await api.post<AdminConditionResponse>(
        `/admin/patients/${patientId}/conditions`,
        conditionInputToBody(input),
    );
    return toAdminCondition(data);
}

export async function updateAdminCondition(
    conditionId: string,
    input: ConditionInput,
): Promise<AdminCondition> {
    const data = await api.put<AdminConditionResponse>(
        `/admin/conditions/${conditionId}`,
        conditionInputToBody(input),
    );
    return toAdminCondition(data);
}

export async function deleteAdminCondition(conditionId: string): Promise<void> {
    await api.delete<unknown>(`/admin/conditions/${conditionId}`);
}

// --- Medications fetchers ---

export async function fetchAdminMedications(
    patientId: string,
): Promise<AdminMedication[]> {
    const data = await api.get<AdminMedicationResponse[]>(
        `/admin/patients/${patientId}/medications`,
    );
    return data.map(toAdminMedication);
}

export async function createAdminMedication(
    patientId: string,
    input: MedicationInput,
): Promise<AdminMedication> {
    const data = await api.post<AdminMedicationResponse>(
        `/admin/patients/${patientId}/medications`,
        medicationInputToBody(input),
    );
    return toAdminMedication(data);
}

export async function updateAdminMedication(
    medicationId: string,
    input: MedicationInput,
): Promise<AdminMedication> {
    const data = await api.put<AdminMedicationResponse>(
        `/admin/medications/${medicationId}`,
        medicationInputToBody(input),
    );
    return toAdminMedication(data);
}

export async function deleteAdminMedication(medicationId: string): Promise<void> {
    await api.delete<unknown>(`/admin/medications/${medicationId}`);
}

// ─── Visits ──────────────────────────────────────────────────

export type VisitStatus = "Draft" | "Completed";

export type AdminVisitSummary = {
    id: string;
    patientId: string;
    visitDate: string;          // display e.g. "12th May 2026"
    department: string;
    attendingDoctorText: string;
    chiefComplaint: string;     // may be empty if Draft
    status: VisitStatus;
    bookingShortId: string | null;
};

export type AdminVisitDetail = AdminVisitSummary & {
    visitDateIso: string;       // YYYY-MM-DD — read-only in UI, sent back on PUT
    diagnosis: string;
    treatment: string;
    clinicalNotes: string;
    followUpRequired: boolean;
    followUpDate: string;       // display, empty if no date set
    followUpDateIso: string;    // YYYY-MM-DD for date picker
};

export type VisitUpdateInput = {
    visitDateIso: string;       // carried through; not user-editable
    attendingDoctorText: string;
    chiefComplaint: string;
    diagnosis: string;
    treatment: string;
    clinicalNotes: string;
    followUpRequired: boolean;
    followUpDateIso: string;
};

type AdminVisitResponse = {
    id: number;
    bookingId: number | null;
    patientId: number;
    patientName: string;
    visitDate: string;
    chiefComplaint: string | null;
    diagnosis: string | null;
    treatment: string | null;
    clinicalNotes: string | null;
    followUpRequired: boolean;
    followUpDate: string | null;
    attendingDoctorId: number | null;
    attendingDoctorName: string | null;
    createdAt: string;
    updatedAt: string;
};

function deriveVisitStatus(v: AdminVisitResponse): VisitStatus {
    const hasDiagnosis = (v.diagnosis ?? "").trim().length > 0;
    const hasTreatment = (v.treatment ?? "").trim().length > 0;
    return hasDiagnosis && hasTreatment ? "Completed" : "Draft";
}

async function fetchVisitDepartment(bookingId: number | null): Promise<string> {
    if (!bookingId) return "—";
    try {
        const booking = await api.get<AdminBookingResponse>(
            `/admin/bookings/${bookingId}`,
        );
        return booking.departmentName ?? booking.packageName ?? "—";
    } catch {
        // Booking lookup is best-effort — never block the visit list/detail
        // on a missing or unauthorized booking record.
        return "—";
    }
}

async function toAdminVisitSummary(
    v: AdminVisitResponse,
): Promise<AdminVisitSummary> {
    const department = await fetchVisitDepartment(v.bookingId);
    return {
        id: String(v.id),
        patientId: String(v.patientId),
        visitDate: formatDateLong(v.visitDate),
        department,
        attendingDoctorText: v.attendingDoctorName ?? "",
        chiefComplaint: v.chiefComplaint ?? "",
        status: deriveVisitStatus(v),
        bookingShortId: v.bookingId ? shortIdFor(v.bookingId) : null,
    };
}

async function toAdminVisitDetail(
    v: AdminVisitResponse,
): Promise<AdminVisitDetail> {
    const summary = await toAdminVisitSummary(v);
    return {
        ...summary,
        visitDateIso: v.visitDate,
        diagnosis: v.diagnosis ?? "",
        treatment: v.treatment ?? "",
        clinicalNotes: v.clinicalNotes ?? "",
        followUpRequired: v.followUpRequired,
        followUpDate: v.followUpDate ? formatDateLong(v.followUpDate) : "",
        followUpDateIso: v.followUpDate ?? "",
    };
}

export async function fetchAdminVisits(
    patientId: string,
): Promise<AdminVisitSummary[]> {
    const data = await api.get<AdminVisitResponse[]>(
        `/admin/patients/${patientId}/visits`,
    );
    // Parallel booking lookups so the department column resolves quickly even
    // when the patient has many visits across different bookings.
    return Promise.all(data.map(toAdminVisitSummary));
}

export async function fetchAdminVisit(visitId: string): Promise<AdminVisitDetail> {
    const data = await api.get<AdminVisitResponse>(`/admin/visits/${visitId}`);
    return toAdminVisitDetail(data);
}

export async function updateAdminVisit(
    visitId: string,
    input: VisitUpdateInput,
): Promise<AdminVisitDetail> {
    const body = {
        visitDate: input.visitDateIso,
        chiefComplaint: input.chiefComplaint,
        diagnosis: input.diagnosis,
        treatment: input.treatment,
        clinicalNotes: input.clinicalNotes,
        followUpRequired: input.followUpRequired,
        followUpDate:
            input.followUpRequired && input.followUpDateIso
                ? input.followUpDateIso
                : null,
        attendingDoctorId: null,         // doctor picker deferred
        attendingDoctorText: input.attendingDoctorText,
    };
    const data = await api.put<AdminVisitResponse>(`/admin/visits/${visitId}`, body);
    return toAdminVisitDetail(data);
}

// ─── Lab Results (admin) ─────────────────────────────────────

export type AdminLabResultStatus = "Pending" | "Ready to view";

export type AdminLabComponentFlag = "Normal" | "High" | "Low" | "Critical low" | "Critical high" | "Abnormal";

export type AdminLabComponent = {
    id: string;
    name: string;
    value: string;
    unit: string;
    referenceRange: string;
    flag: AdminLabComponentFlag;
};

export type AdminLabResultFile = {
    id: string;
    originalFileName: string;
    contentType: string;
    sizeBytes: number;
};

export type AdminLabResultSummary = {
    id: string;
    patientId: string;
    title: string;
    testDate: string;             // display, from createdAt
    bookingShortId: string | null;
    status: AdminLabResultStatus;
    isNotified: boolean;
    fileCount: number;
};

export type AdminLabResultDetail = AdminLabResultSummary & {
    description: string;
    patientName: string;
    patientEmail: string;
    uploadedByName: string;
    files: AdminLabResultFile[];
};

type AdminLabResultResponse = {
    id: number;
    title: string;
    description: string | null;
    status: "PENDING" | "AVAILABLE";
    isNotified: boolean;
    patientId: number;
    patientName: string;
    patientEmail: string;
    uploadedById: number | null;
    uploadedByName: string | null;
    bookingId: number | null;
    files: Array<{
        id: number;
        originalFileName: string;
        contentType: string;
        fileSize: number;
    }>;
    createdAt: string;
    updatedAt: string;
};

export type LabComponentInput = Omit<AdminLabComponent, "id">;

const LAB_STATUS_FROM_BACKEND: Record<
AdminLabResultResponse["status"],
    AdminLabResultStatus
    > = {
        PENDING: "Pending",
        AVAILABLE: "Ready to view",
    };

// --- Lab Result list/detail fetchers ---

function toAdminLabResultFile(f: AdminLabResultResponse["files"][number]): AdminLabResultFile {
    return {
        id: String(f.id),
        originalFileName: f.originalFileName,
        contentType: f.contentType,
        sizeBytes: f.fileSize,
    };
}

function toAdminLabResultSummary(r: AdminLabResultResponse): AdminLabResultSummary {
    return {
        id: String(r.id),
        patientId: String(r.patientId),
        title: r.title,
        testDate: formatDateLong(r.createdAt),
        bookingShortId: r.bookingId ? shortIdFor(r.bookingId) : null,
        status: LAB_STATUS_FROM_BACKEND[r.status],
        isNotified: r.isNotified,
        fileCount: r.files.length,
    };
}

function toAdminLabResultDetail(r: AdminLabResultResponse): AdminLabResultDetail {
    return {
        ...toAdminLabResultSummary(r),
        description: r.description ?? "",
        patientName: r.patientName,
        patientEmail: r.patientEmail,
        uploadedByName: r.uploadedByName ?? "—",
        files: r.files.map(toAdminLabResultFile),
    };
}

export type LabResultCreateInput = {
    patientId: string;
    title: string;
    description: string;
    bookingId?: string;
    files: File[];
};

export async function fetchAdminLabResults(
    patientId: string,
): Promise<AdminLabResultSummary[]> {
    // Single page large enough for any realistic patient — no UI paginator on
    // the per-patient tab. Bump if you hit the cap.
    const data = await api.get<AdminPageResponse<AdminLabResultResponse>>(
        `/admin/patients/${patientId}/results?page=0&size=100`,
    );
    return data.content.map(toAdminLabResultSummary);
}

export async function fetchAdminLabResult(
    resultId: string,
): Promise<AdminLabResultDetail> {
    const data = await api.get<AdminLabResultResponse>(`/admin/results/${resultId}`);
    return toAdminLabResultDetail(data);
}

export async function createAdminLabResult(
    input: LabResultCreateInput,
): Promise<AdminLabResultDetail> {
    const fd = new FormData();
    const metadata = {
        patientId: Number(input.patientId),
        title: input.title,
        description: input.description,
        bookingId: input.bookingId ? Number(input.bookingId) : null,
    };
    fd.append(
        "metadata",
        new Blob([JSON.stringify(metadata)], { type: "application/json" }),
    );
    for (const file of input.files) {
        fd.append("files", file);
    }

    const data = await api.uploadForm<AdminLabResultResponse>(`/admin/results`, fd);
    return toAdminLabResultDetail(data);
}

export async function notifyLabResult(
    resultId: string,
): Promise<AdminLabResultDetail> {
    const data = await api.post<AdminLabResultResponse>(
        `/admin/results/${resultId}/notify`,
    );
    return toAdminLabResultDetail(data);
}

export async function downloadLabResultFile(
    resultId: string,
    fileId: string,
    filename: string,
): Promise<void> {
    await api.downloadFile(
        `/admin/results/${resultId}/files/${fileId}/download`,
        filename,
    );
}

export async function deleteAdminLabResult(resultId: string): Promise<void> {
    await api.delete<unknown>(`/admin/results/${resultId}`);
}

// --- Component fetchers ---

// export async function addLabComponent(
//     resultId: string,
//     input: LabComponentInput,
// ): Promise<AdminLabComponent> {
//     // TODO (backend): api.post(`/admin/results/${resultId}/components`, input)
//     const created: AdminLabComponent = {id: `cm_${Date.now()}`, ...input};
//     await mutateLabResult(resultId, (r) => ({
//         ...r,
//         components: [...r.components, created],
//         componentCount: r.components.length + 1,
//     }));
//     return Promise.resolve(created);
// }



// ─── Documents ───────────────────────────────────────────────

export type DocumentCategory =
    | "INSURANCE"
    | "EXTERNAL_REPORT"
    | "REFERRAL"
    | "PRESCRIPTION"
    | "IDENTIFICATION"
    | "CONSENT_FORM"
    | "OTHER";

export const DOCUMENT_CATEGORIES: ReadonlyArray<DocumentCategory> = [
    "INSURANCE",
    "EXTERNAL_REPORT",
    "REFERRAL",
    "PRESCRIPTION",
    "IDENTIFICATION",
    "CONSENT_FORM",
    "OTHER",
];

export const CATEGORY_LABEL: Record<DocumentCategory, string> = {
    INSURANCE: "Insurance",
    EXTERNAL_REPORT: "External report",
    REFERRAL: "Referral",
    PRESCRIPTION: "Prescription",
    IDENTIFICATION: "Identification",
    CONSENT_FORM: "Consent form",
    OTHER: "Other",
};

export type DocumentUploaderType = "PATIENT" | "ADMIN";

export type AdminDocument = {
    id: string;
    patientId: string;
    title: string;
    description: string;
    category: DocumentCategory;
    uploaderType: DocumentUploaderType;
    uploadedByName: string;
    originalFileName: string;
    contentType: string;
    sizeBytes: number;
    uploadedAtDisplay: string;
};

type AdminDocumentResponse = {
    id: number;
    patientId: number;
    uploaderType: DocumentUploaderType;
    uploadedByName: string | null;
    category: DocumentCategory;
    title: string;
    description: string | null;
    originalFileName: string;
    contentType: string;
    fileSize: number;
    createdAt: string;
};


export type DocumentUploadInput = {
    title: string;
    description?: string;
    category: DocumentCategory;
    file: File;
};

function toAdminDocument(d: AdminDocumentResponse): AdminDocument {
    return {
        id: String(d.id),
        patientId: String(d.patientId),
        title: d.title,
        description: d.description ?? "",
        category: d.category,
        uploaderType: d.uploaderType,
        uploadedByName: d.uploadedByName ?? "—",
        originalFileName: d.originalFileName,
        contentType: d.contentType,
        sizeBytes: d.fileSize,
        uploadedAtDisplay: formatRelative(d.createdAt),
    };
}

export async function fetchAdminDocuments(
    patientId: string,
): Promise<AdminDocument[]> {
    const data = await api.get<AdminDocumentResponse[]>(
        `/admin/patients/${patientId}/documents`,
    );
    return data.map(toAdminDocument);
}

export async function uploadAdminDocument(
    patientId: string,
    input: DocumentUploadInput,
): Promise<AdminDocument> {
    // Backend takes metadata (title/category/description) as query params and
    // the file alone in the multipart body. Use `api.upload` with the
    // pre-built querystring on the path.
    const params = new URLSearchParams();
    params.set("category", input.category);
    params.set("title", input.title || input.file.name);
    if (input.description) params.set("description", input.description);

    const data = await api.upload<AdminDocumentResponse>(
        `/admin/patients/${patientId}/documents?${params.toString()}`,
        input.file,
    );
    return toAdminDocument(data);
}

export async function downloadAdminDocument(
    documentId: string,
    filename: string,
): Promise<void> {
    await api.downloadFile(`/admin/documents/${documentId}/download`, filename);
}

export async function deleteAdminDocument(documentId: string): Promise<void> {
    await api.delete<unknown>(`/admin/documents/${documentId}`);
}

// ─── Lab Results (cross-patient view) ────────────────────────

export type AdminCrossPatientLabResult = {
    id: string;
    patientId: string;
    patientName: string;
    title: string;
    status: AdminLabResultStatus;
    fileCount: number;
    uploadedAtDisplay: string;
};

export type CrossPatientLabPage = {
    entries: AdminCrossPatientLabResult[];
    total: number;
    page: number;
    pageSize: number;
};
export type CrossPatientLabFilters = {
    search?: string;
    status?: AdminLabResultStatus | "all";
};

function toCrossPatientLabResult(
    r: AdminLabResultResponse,
): AdminCrossPatientLabResult {
    return {
        id: String(r.id),
        patientId: String(r.patientId),
        patientName: r.patientName,
        title: r.title,
        status: LAB_STATUS_FROM_BACKEND[r.status],
        fileCount: r.files.length,
        uploadedAtDisplay: formatRelative(r.createdAt),
    };
}

export async function fetchCrossPatientLabResults(
    page: number,
    pageSize: number,
): Promise<CrossPatientLabPage> {
    const params = new URLSearchParams();
    params.set("page", String(page - 1));     // backend is 0-indexed
    params.set("size", String(pageSize));

    const data = await api.get<AdminPageResponse<AdminLabResultResponse>>(
        `/admin/results?${params.toString()}`,
    );

    return {
        entries: data.content.map(toCrossPatientLabResult),
        total: data.totalElements,
        page,
        pageSize,
    };
}

// ─── Profile Update Requests ─────────────────────────────────

export type ProfileUpdateField =
    | "BLOOD_GROUP"
    | "GENOTYPE"
    | "ALLERGIES"
    | "OTHER";

export const PROFILE_FIELD_LABEL: Record<ProfileUpdateField, string> = {
    BLOOD_GROUP: "Blood group",
    GENOTYPE: "Genotype",
    ALLERGIES: "Allergies",
    OTHER: "Other",
};

export type ProfileUpdateStatus = "Pending" | "Approved" | "Rejected";

export type ProfileUpdateRequest = {
    id: string;
    patientId: string;
    patientName: string;
    field: ProfileUpdateField;
    currentValue: string;
    proposedValue: string;
    patientNote: string;
    status: ProfileUpdateStatus;
    submittedAtDisplay: string;
    adminResponse: string | null;
    decidedAtDisplay: string | null;
    decidedByName: string | null;
};

type ProfileUpdateBackendStatus = "PENDING" | "APPROVED" | "REJECTED";

const PROFILE_UPDATE_STATUS_FROM_BACKEND: Record<
ProfileUpdateBackendStatus,
    ProfileUpdateStatus
    > = {
        PENDING: "Pending",
        APPROVED: "Approved",
        REJECTED: "Rejected",
    };

const PROFILE_UPDATE_STATUS_TO_BACKEND: Record<
ProfileUpdateStatus,
    ProfileUpdateBackendStatus
    > = {
        Pending: "PENDING",
        Approved: "APPROVED",
        Rejected: "REJECTED",
    };

type ProfileUpdateRequestResponse = {
    id: number;
    patientId: number;
    patientName: string;
    targetField: ProfileUpdateField;
    otherFieldDescription: string | null;
    currentValue: string | null;
    proposedValue: string | null;
    patientNote: string | null;
    status: ProfileUpdateBackendStatus;
    reviewedByAdminId: number | null;
    reviewedByAdminName: string | null;
    reviewedAt: string | null;
    adminResponse: string | null;
    createdAt: string;
    updatedAt: string;
};

function toProfileUpdateRequest(
    r: ProfileUpdateRequestResponse,
): ProfileUpdateRequest {
    // For OTHER requests the patient submits free text in
    // otherFieldDescription; surface that as the proposed value so the
    // existing UI block ("Patient's request") shows the right content.
    const proposedValue =
        r.targetField === "OTHER"
            ? r.otherFieldDescription ?? ""
            : r.proposedValue ?? "";

    return {
        id: String(r.id),
        patientId: String(r.patientId),
        patientName: r.patientName,
        field: r.targetField,
        currentValue: r.currentValue ?? "",
        proposedValue,
        patientNote: r.patientNote ?? "",
        status: PROFILE_UPDATE_STATUS_FROM_BACKEND[r.status],
        submittedAtDisplay: formatRelative(r.createdAt),
        adminResponse: r.adminResponse,
        decidedAtDisplay: r.reviewedAt ? formatRelative(r.reviewedAt) : null,
        decidedByName: r.reviewedByAdminName,
    };
}

export type ProfileUpdateFilters = {
    status?: ProfileUpdateStatus | "all";
};

export type ProfileUpdatePage = {
    entries: ProfileUpdateRequest[];
    total: number;
    page: number;
    pageSize: number;
};

export async function fetchProfileUpdateRequests(
    filters: ProfileUpdateFilters,
    page: number,
    pageSize: number,
): Promise<ProfileUpdatePage> {
    const params = new URLSearchParams();
    params.set("page", String(page - 1));     // backend is 0-indexed
    params.set("size", String(pageSize));
    if (filters.status && filters.status !== "all") {
        params.set("status", PROFILE_UPDATE_STATUS_TO_BACKEND[filters.status]);
    }

    const data = await api.get<AdminPageResponse<ProfileUpdateRequestResponse>>(
        `/admin/profile-update-requests?${params.toString()}`,
    );

    return {
        entries: data.content.map(toProfileUpdateRequest),
        total: data.totalElements,
        page,
        pageSize,
    };
}

export async function fetchProfileUpdateRequest(
    id: string,
): Promise<ProfileUpdateRequest> {
    const data = await api.get<ProfileUpdateRequestResponse>(
        `/admin/profile-update-requests/${id}`,
    );
    return toProfileUpdateRequest(data);
}

export async function approveProfileUpdateRequest(
    id: string,
    adminResponse: string,
): Promise<ProfileUpdateRequest> {
    const data = await api.post<ProfileUpdateRequestResponse>(
        `/admin/profile-update-requests/${id}/approve`,
        adminResponse ? { adminResponse } : undefined,
    );
    return toProfileUpdateRequest(data);
}

export async function rejectProfileUpdateRequest(
    id: string,
    adminResponse: string,
): Promise<ProfileUpdateRequest> {
    const data = await api.post<ProfileUpdateRequestResponse>(
        `/admin/profile-update-requests/${id}/reject`,
        adminResponse ? { adminResponse } : undefined,
    );
    return toProfileUpdateRequest(data);
}

// ─── Blog Posts (admin) ──────────────────────────────────────

export type BlogPostStatus = "Draft" | "Published";

export type BlogPostCategory =
    | "Lifestyle Diseases"
    | "Screening and Packages"
    | "General Health";

export const BLOG_POST_CATEGORIES: ReadonlyArray<BlogPostCategory> = [
    "Lifestyle Diseases",
    "Screening and Packages",
    "General Health",
];

export type AdminBlogPostSummary = {
    id: string;
    slug: string;
    title: string;
    category: BlogPostCategory;
    status: BlogPostStatus;
    featured: boolean;
    readTimeMinutes: number;
    updatedAtDisplay: string;
};

export type AdminBlogPost = AdminBlogPostSummary & {
    excerpt: string;
    body: string;                 // markdown
    heroImageUrl: string | null;
};

const STUB_BLOG_POSTS: AdminBlogPost[] = [
    {
        id: "bp_001",
        slug: "managing-hypertension-day-to-day",
        title: "Managing hypertension day-to-day",
        category: "Lifestyle Diseases",
        status: "Published",
        featured: true,
        readTimeMinutes: 6,
        updatedAtDisplay: "2 days ago",
        excerpt:
            "Practical tips for keeping blood pressure under control between visits — diet, movement, and the warning signs that mean it's time to call us.",
        body: "## Why daily habits matter\n\nHypertension is a marathon, not a sprint…",
        heroImageUrl: null,
    },
    {
        id: "bp_002",
        slug: "what-to-expect-annual-wellness",
        title: "What to expect at your Annual Wellness screening",
        category: "Screening and Packages",
        status: "Published",
        featured: false,
        readTimeMinutes: 4,
        updatedAtDisplay: "1 week ago",
        excerpt:
            "Walking you through the visit — from check-in to results — so you can plan your day and know what to bring.",
        body: "## Before your visit\n\nFasting is required for some of the bloodwork…",
        heroImageUrl: null,
    },
    {
        id: "bp_003",
        slug: "draft-anaemia-symptoms",
        title: "Anaemia: symptoms women often miss",
        category: "General Health",
        status: "Draft",
        featured: false,
        readTimeMinutes: 5,
        updatedAtDisplay: "Yesterday",
        excerpt: "",
        body: "## Draft notes\n\nNeed to finish the section on iron-rich foods…",
        heroImageUrl: null,
    },
];

export type AdminBlogPostFilters = {
    search?: string;
    category?: BlogPostCategory | "all";
    status?: BlogPostStatus | "all";
};

export type AdminBlogPostPage = {
    entries: AdminBlogPostSummary[];
    total: number;
    page: number;
    pageSize: number;
};

export type BlogPostInput = {
    slug: string;
    title: string;
    category: BlogPostCategory;
    excerpt: string;
    body: string;
    heroImageUrl: string | null;
    status: BlogPostStatus;
    featured: boolean;
    readTimeMinutes: number;
};

// --- Fetchers ---

export async function fetchAdminBlogPosts(
    filters: AdminBlogPostFilters,
    page: number,
    pageSize: number,
): Promise<AdminBlogPostPage> {
    // TODO (backend): api.get("/admin/blog-posts", { params: { ...filters, page, size: pageSize } })
    const filtered = STUB_BLOG_POSTS.filter((p) => {
        if (filters.category && filters.category !== "all" && p.category !== filters.category)
            return false;
        if (filters.status && filters.status !== "all" && p.status !== filters.status)
            return false;
        if (filters.search) {
            const q = filters.search.toLowerCase();
            if (!p.title.toLowerCase().includes(q)) return false;
        }
        return true;
    });

    const start = (page - 1) * pageSize;
    const entries = filtered.slice(start, start + pageSize).map(toBlogPostSummary);

    return Promise.resolve({entries, total: filtered.length, page, pageSize});
}

export async function fetchAdminBlogPost(slug: string): Promise<AdminBlogPost> {
    // TODO (backend): api.get(`/admin/blog-posts/${slug}`)
    const post = STUB_BLOG_POSTS.find((p) => p.slug === slug);
    if (!post) return Promise.reject(new Error("Blog post not found"));
    return Promise.resolve(post);
}

export async function createAdminBlogPost(input: BlogPostInput): Promise<AdminBlogPost> {
    // TODO (backend): api.post("/admin/blog-posts", input)
    if (STUB_BLOG_POSTS.some((p) => p.slug === input.slug)) {
        return Promise.reject(new Error("A post with this slug already exists."));
    }
    const created: AdminBlogPost = {
        id: `bp_${Date.now()}`,
        ...input,
        updatedAtDisplay: "Just now",
    };
    STUB_BLOG_POSTS.unshift(created);
    return Promise.resolve(created);
}

export async function updateAdminBlogPost(
    slug: string,
    input: BlogPostInput,
): Promise<AdminBlogPost> {
    // TODO (backend): api.put(`/admin/blog-posts/${slug}`, input)
    const idx = STUB_BLOG_POSTS.findIndex((p) => p.slug === slug);
    if (idx < 0) return Promise.reject(new Error("Blog post not found"));

    // If slug changed, check uniqueness.
    if (input.slug !== slug && STUB_BLOG_POSTS.some((p) => p.slug === input.slug)) {
        return Promise.reject(new Error("A post with this slug already exists."));
    }

    const updated: AdminBlogPost = {
        ...STUB_BLOG_POSTS[idx],
        ...input,
        updatedAtDisplay: "Just now",
    };
    STUB_BLOG_POSTS[idx] = updated;
    return Promise.resolve(updated);
}

export async function deleteAdminBlogPost(slug: string): Promise<void> {
    // TODO (backend): api.delete(`/admin/blog-posts/${slug}`)
    const idx = STUB_BLOG_POSTS.findIndex((p) => p.slug === slug);
    if (idx >= 0) STUB_BLOG_POSTS.splice(idx, 1);
    return Promise.resolve();
}

export async function uploadBlogPostImage(file: File): Promise<{ url: string }> {
    // TODO (backend): multipart POST to /admin/blog-posts/images
    //   Backend returns the public URL of the uploaded image.
    console.log("uploadBlogPostImage stub:", file.name);
    // Use object URL as a stub — works for preview in the editor, won't survive reload.
    const url = URL.createObjectURL(file);
    return Promise.resolve({url});
}

function toBlogPostSummary(p: AdminBlogPost): AdminBlogPostSummary {
    return {
        id: p.id,
        slug: p.slug,
        title: p.title,
        category: p.category,
        status: p.status,
        featured: p.featured,
        readTimeMinutes: p.readTimeMinutes,
        updatedAtDisplay: p.updatedAtDisplay,
    };
}