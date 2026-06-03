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

// ─── Dashboard summary ───────────────────────────────────────

export type AdminDashboardSummary = {
    pendingAppointments: number;
    pendingLabResults: number;
    unreadFeedback: number;
    articleDrafts: number;
};

const STUB_SUMMARY: AdminDashboardSummary = {
    pendingAppointments: 7,
    pendingLabResults: 3,
    unreadFeedback: 12,
    articleDrafts: 2,
};

export async function fetchAdminDashboardSummary(): Promise<AdminDashboardSummary> {
    // TODO (backend): replace with api.get("/admin/dashboard/summary")
    //   If the backend doesn't have an aggregate endpoint, compose this from:
    //     - GET /admin/appointments?status=PENDING&count=true
    //     - GET /admin/results?status=PENDING&count=true
    //     - GET /admin/feedback?status=NEW&count=true
    //     - GET /admin/articles?status=DRAFT&count=true
    //   and return the four numbers.
    return Promise.resolve(STUB_SUMMARY);
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

export type AdminFeedbackStatus = "New" | "Actioned";

export type AdminFeedbackSummary = {
    id: string;
    patientName: string;        // "Anonymous" if patient opted out of response
    type: AdminFeedbackType;
    excerpt: string;            // first ~80 chars of the message
    status: AdminFeedbackStatus;
    createdAt: string;          // display format e.g. "2 hours ago"
};

const STUB_RECENT_APPOINTMENTS: AdminAppointmentSummary[] = [
    { id: "ap1", patientName: "Jesse Okache", department: "General Surgery", date: "15th May", time: "2pm", status: "Pending" },
    { id: "ap2", patientName: "Amina Bello", department: "OB/GYN", date: "15th May", time: "11am", status: "Confirmed" },
    { id: "ap3", patientName: "Tunde Adekunle", department: "Cardiology", date: "14th May", time: "9am", status: "Pending" },
    { id: "ap4", patientName: "Chiamaka Eze", department: "Paediatrics", date: "14th May", time: "3pm", status: "Confirmed" },
    { id: "ap5", patientName: "Femi Adesanya", department: "ENT", date: "13th May", time: "10am", status: "Cancelled" },
];

const STUB_RECENT_FEEDBACK: AdminFeedbackSummary[] = [
    { id: "fb1", patientName: "Anonymous", type: "Complaint", excerpt: "Waited over an hour past my appointment time without any update from the front desk…", status: "New", createdAt: "2 hours ago" },
    { id: "fb2", patientName: "Amina Bello", type: "Compliment", excerpt: "Dr. Okafor was incredibly thorough and made my mother feel at ease throughout…", status: "New", createdAt: "5 hours ago" },
    { id: "fb3", patientName: "Tunde Adekunle", type: "Suggestion", excerpt: "It would help if the appointment booking flow showed available slots in a calendar…", status: "New", createdAt: "Yesterday" },
    { id: "fb4", patientName: "Anonymous", type: "General feedback", excerpt: "Clean facility, friendly staff. The parking situation could be improved…", status: "Actioned", createdAt: "Yesterday" },
    { id: "fb5", patientName: "Chiamaka Eze", type: "Compliment", excerpt: "Thank you for the quick lab results turnaround. Made follow-up planning much easier…", status: "Actioned", createdAt: "2 days ago" },
];

export async function fetchRecentAdminAppointments(): Promise<AdminAppointmentSummary[]> {
    // TODO (backend): replace with api.get("/admin/appointments?limit=5&sort=-createdAt")
    return Promise.resolve(STUB_RECENT_APPOINTMENTS);
}

export async function fetchRecentAdminFeedback(): Promise<AdminFeedbackSummary[]> {
    // TODO (backend): replace with api.get("/admin/feedback?limit=5&sort=-createdAt")
    return Promise.resolve(STUB_RECENT_FEEDBACK);
}

// ─── Feedback (full entries for the section page) ────────────

export type AdminContactMethod = "None" | "Email" | "Phone" | "WhatsApp";

export type AdminFeedbackEntry = {
    id: string;
    patientName: string;        // "Anonymous" when wantsResponse is false
    patientEmail: string | null;
    patientPhone: string | null;
    patientWhatsapp: string | null;
    type: AdminFeedbackType;
    message: string;            // full text, not the excerpt used on the dashboard
    department: string;
    wantsResponse: boolean;
    contactMethod: AdminContactMethod;
    rating: number;
    status: AdminFeedbackStatus;
    createdAt: string;          // ISO timestamp
    createdAtDisplay: string;   // pre-formatted display string e.g. "2 hours ago"
};

const STUB_ALL_FEEDBACK: AdminFeedbackEntry[] = [
    {
        id: "fb1",
        patientName: "Anonymous",
        patientEmail: null,
        patientPhone: null,
        patientWhatsapp: null,
        type: "Complaint",
        message:
            "Waited over an hour past my appointment time without any update from the front desk. The waiting area was full and nobody communicated about the delay. When I finally saw the doctor the consultation itself was fine, but the experience getting there left a bad impression.",
        department: "General Surgery",
        wantsResponse: false,
        contactMethod: "None",
        rating: 2,
        status: "New",
        createdAt: "2026-06-03T15:30:00Z",
        createdAtDisplay: "2 hours ago",
    },
    {
        id: "fb2",
        patientName: "Amina Bello",
        patientEmail: "amina.bello@example.com",
        patientPhone: "+2348012345678",
        patientWhatsapp: "+2348012345678",
        type: "Compliment",
        message:
            "Dr. Okafor was incredibly thorough and made my mother feel at ease throughout her visit. She explained every step of the examination and answered all our questions patiently. We left feeling well cared for and informed about next steps. Thank you to the entire OB/GYN team.",
        department: "OB/GYN",
        wantsResponse: true,
        contactMethod: "Email",
        rating: 5,
        status: "New",
        createdAt: "2026-06-03T12:30:00Z",
        createdAtDisplay: "5 hours ago",
    },
    {
        id: "fb3",
        patientName: "Tunde Adekunle",
        patientEmail: "tunde.a@example.com",
        patientPhone: "+2348098765432",
        patientWhatsapp: null,
        type: "Suggestion",
        message:
            "It would help if the appointment booking flow showed available slots in a calendar view instead of just a time picker. Right now I have to guess at times and find out which are available — a calendar with the open slots highlighted would be much faster.",
        department: "Cardiology",
        wantsResponse: true,
        contactMethod: "Phone",
        rating: 4,
        status: "New",
        createdAt: "2026-06-02T17:30:00Z",
        createdAtDisplay: "Yesterday",
    },
    {
        id: "fb4",
        patientName: "Anonymous",
        patientEmail: null,
        patientPhone: null,
        patientWhatsapp: null,
        type: "General feedback",
        message:
            "Clean facility, friendly staff. The parking situation could be improved — it took 15 minutes to find a spot on a Tuesday morning. Otherwise no complaints.",
        department: "Family Medicine",
        wantsResponse: false,
        contactMethod: "None",
        rating: 4,
        status: "Actioned",
        createdAt: "2026-06-02T10:30:00Z",
        createdAtDisplay: "Yesterday",
    },
    {
        id: "fb5",
        patientName: "Chiamaka Eze",
        patientEmail: "chiamaka.e@example.com",
        patientPhone: "+2348055556666",
        patientWhatsapp: "+2348055556666",
        type: "Compliment",
        message:
            "Thank you for the quick lab results turnaround. Made follow-up planning much easier. The notification email was clear and the portal made it easy to download the PDF.",
        department: "Internal Medicine",
        wantsResponse: false,
        contactMethod: "None",
        rating: 5,
        status: "Actioned",
        createdAt: "2026-06-01T14:30:00Z",
        createdAtDisplay: "2 days ago",
    },
    {
        id: "fb6",
        patientName: "Femi Adesanya",
        patientEmail: "femi.a@example.com",
        patientPhone: "+2348011112222",
        patientWhatsapp: null,
        type: "Complaint",
        message:
            "The reception staff was dismissive when I asked to reschedule. I understand it's busy but a more patient tone would help.",
        department: "ENT",
        wantsResponse: true,
        contactMethod: "WhatsApp",
        rating: 2,
        status: "New",
        createdAt: "2026-06-01T09:00:00Z",
        createdAtDisplay: "2 days ago",
    },
];

export type AdminFeedbackFilters = {
    search?: string;
    type?: AdminFeedbackType | "all";
    status?: AdminFeedbackStatus | "all";
    contactMethod?: AdminContactMethod | "all";
};

export type AdminFeedbackPage = {
    entries: AdminFeedbackEntry[];
    total: number;          // total matching the filters, not page size
    page: number;           // 1-indexed
    pageSize: number;
};

export async function fetchAdminFeedback(
    filters: AdminFeedbackFilters,
    page: number,
    pageSize: number,
): Promise<AdminFeedbackPage> {
    // TODO (backend): replace with api.get("/admin/feedback", { params: { ...filters, page, pageSize } })
    // For now we filter + paginate client-side over the stub.
    const filtered = STUB_ALL_FEEDBACK.filter((f) => {
        if (filters.type && filters.type !== "all" && f.type !== filters.type) return false;
        if (filters.status && filters.status !== "all" && f.status !== filters.status) return false;
        if (
            filters.contactMethod &&
            filters.contactMethod !== "all" &&
            f.contactMethod !== filters.contactMethod
        )
            return false;
        if (filters.search) {
            const q = filters.search.toLowerCase();
            const haystack = `${f.patientName} ${f.message} ${f.department}`.toLowerCase();
            if (!haystack.includes(q)) return false;
        }
        return true;
    });

    const start = (page - 1) * pageSize;
    const entries = filtered.slice(start, start + pageSize);

    return Promise.resolve({
        entries,
        total: filtered.length,
        page,
        pageSize,
    });
}

export async function markFeedbackActioned(id: string): Promise<void> {
    // TODO (backend): replace with api.patch(`/admin/feedback/${id}`, { status: "ACTIONED" })
    console.log("markFeedbackActioned stub:", id);
    return Promise.resolve();
}