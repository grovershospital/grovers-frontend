// ============================================================
// Patient portal data layer
// ============================================================
// Wired to the real backend. Backend types are converted to frontend
// types at this boundary — components stay unaware of the API shape.
//
// Conventions:
//   - IDs: backend returns numbers; we stringify to keep component types as `string`
//   - Dates: backend returns ISO; we format via src/lib/format.ts before returning
//   - Enums: backend uppercase (PENDING); frontend title case (Pending) via lookup
// ============================================================

import {api} from "../lib/api";
import {
    formatDateLong,
    formatDateShort,
    formatMonthYear,
    formatRelative,
} from "../lib/format";

// ─── User / Profile ──────────────────────────────────────────

export type PortalUser = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    memberSince: string;
};

export type PortalProfile = PortalUser & {
    dateOfBirth: string;
    gender: string;
    whatsapp: string;
};

type PortalProfileResponse = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    whatsappNumber: string | null;
    gender: string | null;
    memberSince: string;
};

function toPortalProfile(r: PortalProfileResponse): PortalProfile {
    return {
        firstName: r.firstName,
        lastName: r.lastName,
        email: r.email,
        phone: r.phone,
        memberSince: formatMonthYear(r.memberSince),
        dateOfBirth: formatDateLong(r.dateOfBirth),
        gender: r.gender ?? "Not specified",
        whatsapp: r.whatsappNumber ?? "",
    };
}

export async function fetchPortalUser(): Promise<PortalUser> {
    const data = await api.get<PortalProfileResponse>("/portal/profile");
    const profile = toPortalProfile(data);
    return {
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone,
        memberSince: profile.memberSince,
    };
}

export async function fetchPortalProfile(): Promise<PortalProfile> {
    const data = await api.get<PortalProfileResponse>("/portal/profile");
    return toPortalProfile(data);
}

export type ContactDetailsInput = {
    email: string;
    phone: string;
    whatsapp: string;
};

export async function updateContactDetails(
    input: ContactDetailsInput,
): Promise<PortalProfile> {
    // TODO (integration blocker): The backend's UpdateProfileRequest fields are
    // not yet confirmed. Once the DTO is shared, swap this to a real
    // `api.put("/portal/profile", { ...fields the DTO accepts })` call. Until
    // then, this throws so callers surface a clear error rather than silently
    // pretending to save.
    console.warn("updateContactDetails not wired yet", input);
    throw new Error(
        "Profile updates aren't available yet. Please contact the front desk.",
    );
}

export type PasswordUpdateInput = {
    currentPassword: string;
    newPassword: string;
};

export async function updatePassword(input: PasswordUpdateInput): Promise<void> {
    await api.put<unknown>("/portal/profile/password", input);
}

// ─── Notifications ───────────────────────────────────────────

export type NotificationType =
    | "lab-ready"
    | "appointment-reminder"
    | "appointment-confirmed"
    | "appointment-cancelled"
    | "medical-history"
    | "feedback"
    | "other";

export type PortalNotification = {
    id: string;
    type: NotificationType;
    message: string;
    read: boolean;
    href: string;
    createdAt: string;
};

// Backend's notification type enum is broader than we knew. Mapping conservatively;
// unrecognized values fall through to "other" rather than crashing.
const NOTIFICATION_TYPE_MAP: Record<string, NotificationType> = {
    BOOKING_RECEIVED: "appointment-reminder",
    BOOKING_CONFIRMED: "appointment-confirmed",
    BOOKING_CANCELLED: "appointment-cancelled",
    BOOKING_REMINDER: "appointment-reminder",
    LAB_RESULT_READY: "lab-ready",
    MEDICAL_HISTORY_UPDATED: "medical-history",
    FEEDBACK_RECEIVED: "feedback",
};

// For each notification type, where clicking it should take the patient.
const NOTIFICATION_HREF: Record<NotificationType, string> = {
    "lab-ready": "/patient-portal/lab-results",
    "appointment-reminder": "/patient-portal/appointments",
    "appointment-confirmed": "/patient-portal/appointments",
    "appointment-cancelled": "/patient-portal/appointments",
    "medical-history": "/patient-portal/profile",
    feedback: "/patient-portal/feedback",
    other: "/patient-portal/dashboard",
};

type NotificationResponse = {
    id: number;
    type: string;
    message: string;
    isRead: boolean;
    createdAt: string;
};

type PageResponse<T> = {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
};

export async function markNotificationRead(id: string): Promise<void> {
    await api.patch<unknown>(`/portal/notifications/${id}/read`);
}

export async function markAllNotificationsRead(): Promise<void> {
    await api.patch<unknown>("/portal/notifications/read-all");
}

function toNotification(r: NotificationResponse): PortalNotification {
    const type = NOTIFICATION_TYPE_MAP[r.type] ?? "other";
    return {
        id: String(r.id),
        type,
        message: r.message,
        read: r.isRead,
        href: NOTIFICATION_HREF[type],
        createdAt: formatRelative(r.createdAt),
    };
}

export async function fetchNotifications(): Promise<PortalNotification[]> {
    const data = await api.get<PageResponse<NotificationResponse>>(
        "/portal/notifications?size=20&sort=createdAt,desc",
    );
    return data.content.map(toNotification);
}

// ─── Appointments / Bookings ─────────────────────────────────

export type AppointmentStatus =
    | "Confirmed"
    | "Pending"
    | "Cancelled"
    | "Completed";

const STATUS_MAP: Record<string, AppointmentStatus> = {
    PENDING: "Pending",
    CONFIRMED: "Confirmed",
    CANCELLED: "Cancelled",
    COMPLETED: "Completed",
};

export type Appointment = {
    id: string;
    date: string;
    preferredDateIso: string;
    department: string;
    departmentId: string | null;
    status: AppointmentStatus;
    notes: string;
};

// Departments — kept for the booking form's dropdown. TODO (integration):
// fetch from /portal/departments or /public/departments instead of hardcoding,
// once admin can manage them.

export type Department = {
    id: string;
    name: string;
    slug: string
};

type DepartmentResponse = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    iconUrl: string | null;
    displayOrder: number;
};

let departmentsCache: Department[] | null = null;

export async function fetchDepartments(): Promise<Department[]> {
    if (departmentsCache) return departmentsCache;
    const data = await api.get<DepartmentResponse[]>("/departments");
    const departments = data
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((d) => ({id: String(d.id), name: d.name, slug: d.slug}));
    departmentsCache = departments;
    return departments;
}

export function clearDepartmentsCache(): void {
    departmentsCache = null;
}

type BookingResponse = {
    id: number;
    bookingType: "CONSULTATION" | "PACKAGE" | "SCREENING";
    status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
    preferredDate: string;
    departmentId: number | null;
    departmentName: string | null;
    packageId: number | null;
    packageName: string | null;
    packageTierId: number | null;
    packageTierName: string | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
    rescheduleCount: number;
    lastRescheduledAt: string | null;
};

function toAppointment(b: BookingResponse): Appointment {
    return {
        id: String(b.id),
        date: formatDateShort(b.preferredDate),
        preferredDateIso: b.preferredDate,
        // Backend has no time field on bookings. We display blank until admin
        // confirms with a specific time. When that flow exists, swap this for
        // the confirmed time field.
        department:
            b.departmentName ??
            b.packageName ??
            "Booking",
        departmentId: b.departmentId ? String(b.departmentId) : null,
        status: STATUS_MAP[b.status] ?? "Pending",
        notes: b.notes ?? ""
    };
}

async function fetchAllBookings(): Promise<BookingResponse[]> {
    const data = await api.get<PageResponse<BookingResponse>>(
        "/portal/bookings?size=100&sort=preferredDate,desc",
    );
    return data.content;
}

function isUpcoming(b: BookingResponse): boolean {
    // Upcoming = anything not yet cancelled or completed.
    return b.status === "PENDING" || b.status === "CONFIRMED";
}

export async function fetchUpcomingAppointments(): Promise<Appointment[]> {
    const all = await fetchAllBookings();
    return all.filter(isUpcoming).map(toAppointment);
}

export async function fetchPastAppointments(): Promise<ReadonlyArray<Appointment>> {
    const all = await fetchAllBookings();
    return all.filter((b) => !isUpcoming(b)).map(toAppointment);
}

// Booking input — note: the form currently sends `department` as a string
// from a hardcoded list. To wire create-booking properly we need departmentId
// (numeric, from a fetched departments list). The fetcher below works for
// consultations once the form is updated to provide departmentId in part two.

export type BookingType = "CONSULTATION" | "PACKAGE";

export type BookAppointmentInput = {
    bookingType: BookingType;
    /** Required when bookingType === "CONSULTATION" */
    departmentId?: string;
    /** Required when bookingType === "PACKAGE" */
    packageId?: string;
    /** Optional when bookingType === "PACKAGE" */
    packageTierId?: string;
    /** ISO date "YYYY-MM-DD". Must be in the future. */
    preferredDate: string;
    notes?: string;
};


export async function bookAppointment(
    input: BookAppointmentInput,
): Promise<Appointment> {
    const body: Record<string, unknown> = {
        bookingType: input.bookingType,
        preferredDate: input.preferredDate,
    };
    if (input.bookingType === "CONSULTATION") {
        if (!input.departmentId) {
            throw new Error("Please choose a department.");
        }
        body.departmentId = Number(input.departmentId);
    } else {
        if (!input.packageId) {
            throw new Error("Please choose a package.");
        }
        body.packageId = Number(input.packageId);
        if (input.packageTierId) {
            body.packageTierId = Number(input.packageTierId);
        }
    }
    if (input.notes) {
        body.notes = input.notes;
    }

    const created = await api.post<BookingResponse>("/portal/bookings", body);
    return toAppointment(created);
}

export async function cancelAppointment(id: string): Promise<void> {
    await api.put<unknown>(`/portal/bookings/${id}/cancel`);
}

export async function rescheduleAppointment(
    _id: string,
    _date: string,
    _time: string,
): Promise<Appointment> {
    // No backend endpoint yet. Patient reschedule is a parked feature.
    throw new Error("Reschedule isn't available yet.");
}

// ─── Lab Results ─────────────────────────────────────────────

export type LabResultStatus = "Ready to view" | "Pending";

const LAB_STATUS_MAP: Record<string, LabResultStatus> = {
    PENDING: "Pending",
    AVAILABLE: "Ready to view"
};

export type LabResult = {
    id: string;
    date: string;
    test: string;
    status: LabResultStatus;
};

type LabResultFileResponse = {
    id: number;
    originalFileName: string;
    contentType: string;
    fileSize: number;
};

type LabResultResponse = {
    id: number;
    title: string;
    description: string | null;
    status: string;
    bookingId: number | null;
    files: LabResultFileResponse[];
    createdAt: string;
};

function toLabResult(r: LabResultResponse): LabResult {
    return {
        id: String(r.id),
        date: formatDateShort(r.createdAt),
        test: r.title,
        status: LAB_STATUS_MAP[r.status] ?? "Pending",
    };
}

export async function fetchRecentLabResults(): Promise<LabResult[]> {
    const data = await api.get<PageResponse<LabResultResponse>>(
        "/portal/results?size=20&sort=createdAt,desc",
    );
    return data.content.map(toLabResult);
}

// ─── Lab Result Detail ───────────────────────────────────────

export type LabResultFlag = "Normal" | "High" | "Low";

export type LabComponent = {
    name: string;
    value: string;
    unit: string;
    referenceRange: string;
    flag: LabResultFlag;
};

const FLAG_MAP: Record<string, LabResultFlag> = {
    NORMAL: "Normal",
    HIGH: "High",
    LOW: "Low",
    CRITICAL_LOW: "Low",       // collapsed; UI doesn't distinguish criticality
    CRITICAL_HIGH: "High",
    ABNORMAL: "High",           // closest fit; backend "Abnormal" surfaces as High
};

type ComponentResponse = {
    id: number;
    name: string;
    value: string;
    unit: string | null;
    referenceRange: string | null;
    flag: string;
};

export type LabResultDetail = LabResult & {
    dateFull: string;
    components: LabComponent[];
};

export async function fetchLabResultDetail(id: string): Promise<LabResultDetail> {
    // Components endpoint may 404 if the result has no structured components
    // (e.g. PDF-only results). Treat that as "no components" rather than
    // failing the whole fetch.
    const meta = await api.get<LabResultResponse>(`/portal/results/${id}`);

    let componentsRaw: ComponentResponse[] = [];
    try {
        componentsRaw = await api.get<ComponentResponse[]>(
            `/portal/results/${id}/components`,
        );
    } catch {
        // No components for this result; that's fine.
    }

    return {
        id: String(meta.id),
        date: formatDateShort(meta.createdAt),
        dateFull: formatDateLong(meta.createdAt),
        test: meta.title,
        status: LAB_STATUS_MAP[meta.status] ?? "Pending",
        components: componentsRaw.map((c) => ({
            name: c.name,
            value: c.value,
            unit: c.unit ?? "",
            referenceRange: c.referenceRange ?? "",
            flag: FLAG_MAP[c.flag] ?? "Normal",
        })),
    };
}

/**
 * Downloads the first file attached to a lab result as a PDF.
 *
 * Current UI assumes one file per result. Backend supports multiple — we
 * fetch the result metadata first to pick the first file, then download by
 * its specific fileId. If the patient lab page eventually shows multiple files
 * per result, we'll need a different signature that takes (resultId, fileId).
 */
export async function downloadLabResultPDF(id: string): Promise<void> {
    const meta = await api.get<LabResultResponse>(`/portal/results/${id}`);
    if (meta.files.length === 0) {
        throw new Error("No file is attached to this result yet.");
    }
    const file = meta.files[0];
    await api.downloadFile(
        `/portal/results/${id}/files/${file.id}/download`,
        file.originalFileName,
    );
}

// ─── Feedback ────────────────────────────────────────────────

export type FeedbackType = "Compliment" | "Complaint" | "Suggestion" | "General feedback";

export const FEEDBACK_TYPES: ReadonlyArray<FeedbackType> = [
    "Compliment",
    "Complaint",
    "Suggestion",
    "General feedback",
];

const FEEDBACK_TYPE_TO_BACKEND: Record<FeedbackType, string> = {
    Compliment: "COMPLIMENT",
    Complaint: "COMPLAINT",
    Suggestion: "SUGGESTION",
    "General feedback": "GENERAL",
};

export type ContactMethod = "None" | "Email" | "Phone" | "WhatsApp";

export const CONTACT_METHODS: ReadonlyArray<ContactMethod> = [
    "None", "Email", "Phone", "WhatsApp",
];

const CONTACT_METHOD_TO_BACKEND: Record<Exclude<ContactMethod, "None">, string> = {
    Email: "EMAIL",
    Phone: "PHONE",
    WhatsApp: "WHATSAPP",
};

export type FeedbackInput = {
    type: FeedbackType;
    message: string;
    wantsResponse: boolean;
    contactMethod: ContactMethod;
    rating: number;
};

export async function submitFeedback(input: FeedbackInput): Promise<void> {
    const body: Record<string, unknown> = {
        message: input.message,
        type: FEEDBACK_TYPE_TO_BACKEND[input.type],
        responseWanted: input.wantsResponse,
    };

    if (input.rating > 0) {
        body.rating = input.rating;
    }

    if (input.wantsResponse && input.contactMethod !== "None") {
        body.preferredContactMethod = CONTACT_METHOD_TO_BACKEND[input.contactMethod];
    }

    // TODO (form): backend supports optional `subject` field — surface it on
    // the form in part two. For now we omit it.

    await api.post<unknown>("/portal/feedback", body);
}

// ─── Account ─────────────────────────────────────────────────

export async function requestDataDownload(): Promise<void> {
    await api.post<unknown>("/portal/account/export-data");
}

export type AccountDeletionStatus = {
    pending: boolean;
    deletionDate: string | null;     // pre-formatted display string when pending
};

type DeletionStatusResponse = {
    pending: boolean;
    deletionDate: string | null;
};

export async function fetchAccountDeletionStatus(): Promise<AccountDeletionStatus> {
    const data = await api.get<DeletionStatusResponse>(
        "/portal/account/delete-status",
    );
    return {
        pending: data.pending,
        deletionDate: data.deletionDate ? formatDateLong(data.deletionDate) : null,
    };
}

export async function requestAccountDeletion(
    password: string,
    reason?: string,
): Promise<void> {
    await api.post<unknown>("/portal/account/delete-request", {
        password,
        ...(reason ? {reason} : {}),
    });
}

export async function cancelAccountDeletion(password: string): Promise<void> {
    await api.post<unknown>("/portal/account/cancel-deletion", {password});
}

// ─── Profile Update Requests ─────────────────────────────────

export type ProfileUpdateField =
    | "BLOOD_GROUP"
    | "GENOTYPE"
    | "ALLERGIES"
    | "OTHER";

export const PROFILE_UPDATE_FIELD_LABEL: Record<ProfileUpdateField, string> = {
    BLOOD_GROUP: "Blood group",
    GENOTYPE: "Genotype",
    ALLERGIES: "Allergies",
    OTHER: "Other",
};

export type ProfileUpdateRequestStatus = "Pending" | "Approved" | "Rejected";

const PROFILE_UPDATE_STATUS_MAP: Record<string, ProfileUpdateRequestStatus> = {
    PENDING: "Pending",
    APPROVED: "Approved",
    REJECTED: "Rejected",
};

export type PortalProfileUpdateRequest = {
    id: string;
    field: ProfileUpdateField;
    fieldLabel: string;            // user-friendly label, OTHER replaced by description
    currentValue: string;
    proposedValue: string;
    patientNote: string;
    status: ProfileUpdateRequestStatus;
    submittedAtDisplay: string;
    decidedAtDisplay: string | null;
    adminResponse: string | null;
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
    status: string;
    reviewedByAdminId: number | null;
    reviewedByAdminName: string | null;
    reviewedAt: string | null;
    adminResponse: string | null;
    createdAt: string;
    updatedAt: string;
};

function toPortalProfileUpdateRequest(
    r: ProfileUpdateRequestResponse,
): PortalProfileUpdateRequest {
    const fieldLabel =
        r.targetField === "OTHER"
            ? r.otherFieldDescription || "Other"
            : PROFILE_UPDATE_FIELD_LABEL[r.targetField];

    return {
        id: String(r.id),
        field: r.targetField,
        fieldLabel,
        currentValue: r.currentValue ?? "",
        proposedValue: r.proposedValue ?? "",
        patientNote: r.patientNote ?? "",
        status: PROFILE_UPDATE_STATUS_MAP[r.status] ?? "Pending",
        submittedAtDisplay: formatRelative(r.createdAt),
        decidedAtDisplay: r.reviewedAt ? formatRelative(r.reviewedAt) : null,
        adminResponse: r.adminResponse,
    };
}

export type ProfileUpdateRequestInput = {
    targetField: ProfileUpdateField;
    otherFieldDescription?: string;
    proposedValue: string;
    patientNote?: string;
};

export async function fetchMyProfileUpdateRequests(): Promise<
PortalProfileUpdateRequest[]
> {
    const data = await api.get<ProfileUpdateRequestResponse[]>(
        "/portal/profile-update-requests",
    );
    return data.map(toPortalProfileUpdateRequest);
}

export async function createProfileUpdateRequest(
    input: ProfileUpdateRequestInput,
): Promise<PortalProfileUpdateRequest> {
    const body: Record<string, unknown> = {
        targetField: input.targetField,
        proposedValue: input.proposedValue,
    };
    if (input.targetField === "OTHER" && input.otherFieldDescription) {
        body.otherFieldDescription = input.otherFieldDescription;
    }
    if (input.patientNote) {
        body.patientNote = input.patientNote;
    }
    const data = await api.post<ProfileUpdateRequestResponse>(
        "/portal/profile-update-requests",
        body,
    );
    return toPortalProfileUpdateRequest(data);
}


// ─── Public Packages ─────────────────────────────────────────

export type PublicPackageTone = "GREEN" | "RED" | "BLUE" | "DARK";

export type InclusionCellStatus = "INCLUDED" | "EXCLUDED" | "CONDITIONAL";

export type PublicPackageTier = {
    id: string;
    name: string;
    priceMaleDisplay: string;       // e.g. "₦50,000"
    priceFemaleDisplay: string;
    notes: string;
};

export type PublicPackageInclusion = {
    id: string;
    label: string;
    description: string;
};

export type PublicPackageCell = {
    tierId: string;
    inclusionId: string;
    status: InclusionCellStatus;
    note: string;
};

export type PublicPackage = {
    id: string;
    slug: string;
    name: string;
    headline: string;
    description: string;            // markdown
    targetAudience: string;
    headingTone: PublicPackageTone;
    pricingTone: PublicPackageTone;
    displayOrder: number;
    tiers: PublicPackageTier[];
    inclusions: PublicPackageInclusion[];
    cells: PublicPackageCell[];
};

type PublicPackageResponse = {
    id: number;
    slug: string;
    name: string;
    headline: string | null;
    description: string | null;
    targetAudience: string | null;
    departmentId: number | null;
    departmentName: string | null;
    displayOrder: number;
    isActive: boolean;
    headingTone: PublicPackageTone;
    pricingTone: PublicPackageTone;
    tiers: Array<{
        id: number;
        name: string;
        inclusions: string;
        priceMale: number;
        priceFemale: number;
        notes: string | null;
        displayOrder: number;
    }>;
    inclusions: Array<{
        id: number;
        label: string;
        description: string | null;
        displayOrder: number;
    }>;
    cells: Array<{
        tierId: number;
        inclusionId: number;
        status: InclusionCellStatus;
        note: string | null;
    }>;
};

// Format Naira amounts without trailing decimals when whole.
function formatNaira(amount: number): string {
    return `₦${amount.toLocaleString("en-NG")}`;
}

function toPublicPackage(p: PublicPackageResponse): PublicPackage {
    const tiers = p.tiers
        .slice()
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map<PublicPackageTier>((t) => ({
            id: String(t.id),
            name: t.name,
            priceMaleDisplay: formatNaira(t.priceMale),
            priceFemaleDisplay: formatNaira(t.priceFemale),
            notes: t.notes ?? "",
        }));

    const inclusions = p.inclusions
        .slice()
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map<PublicPackageInclusion>((i) => ({
            id: String(i.id),
            label: i.label,
            description: i.description ?? "",
        }));

    const cells = p.cells.map<PublicPackageCell>((c) => ({
        tierId: String(c.tierId),
        inclusionId: String(c.inclusionId),
        status: c.status,
        note: c.note ?? "",
    }));

    return {
        id: String(p.id),
        slug: p.slug,
        name: p.name,
        headline: p.headline ?? p.name,
        description: p.description ?? "",
        targetAudience: p.targetAudience ?? "",
        headingTone: p.headingTone,
        pricingTone: p.pricingTone,
        displayOrder: p.displayOrder,
        tiers,
        inclusions,
        cells,
    };
}

export async function fetchPublicPackages(): Promise<PublicPackage[]> {
    const data = await api.get<PublicPackageResponse[]>("/packages");
    return data
        .filter((p) => p.isActive)
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map(toPublicPackage);
}

export async function fetchPublicPackage(slug: string): Promise<PublicPackage> {
    const data = await api.get<PublicPackageResponse>(`/packages/${slug}`);
    return toPublicPackage(data);
}