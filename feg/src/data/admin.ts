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

// ─── Bookings (admin) ────────────────────────────────────────

export type AdminBookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export type AdminBookingType = "Consultation" | "Screening" | "Package";

export type AdminBookingNote = {
    id: string;
    note: string;
    authorName: string;          // admin who wrote it
    createdAtDisplay: string;
};

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
    preferredTime: string;        // e.g. "2pm"
    status: AdminBookingStatus;
    createdAtDisplay: string;     // when booking was made
};

export type AdminBookingDetail = AdminBookingSummary & {
    patientEmail: string;
    patientPhone: string;
    reason: string | null;
    additionalNotes: string | null;
    notes: AdminBookingNote[];
    activity: AdminBookingActivity[];
};

const STUB_BOOKINGS: AdminBookingDetail[] = [
    {
        id: "bk_a1b2c3d4e5f6",
        shortId: "d4e5f6",
        patientName: "Jesse Okache",
        patientId: "pt_001",
        patientEmail: "jesse.okache@example.com",
        patientPhone: "+2347168909864",
        department: "General Surgery",
        type: "Consultation",
        preferredDate: "15th May 2026",
        preferredTime: "2pm",
        status: "Pending",
        createdAtDisplay: "2 hours ago",
        reason: "Persistent abdominal pain for the past two weeks",
        additionalNotes: "Prefer morning slots if anything opens up earlier.",
        notes: [],
        activity: [
            { id: "ac1", description: "Booking created by patient", createdAtDisplay: "2 hours ago" },
        ],
    },
    {
        id: "bk_b2c3d4e5f6g7",
        shortId: "e5f6g7",
        patientName: "Amina Bello",
        patientId: "pt_002",
        patientEmail: "amina.bello@example.com",
        patientPhone: "+2348012345678",
        department: "OB/GYN",
        type: "Consultation",
        preferredDate: "15th May 2026",
        preferredTime: "11am",
        status: "Confirmed",
        createdAtDisplay: "Yesterday",
        reason: "Routine prenatal check-up",
        additionalNotes: null,
        notes: [
            {
                id: "nt1",
                note: "Confirmed via phone — patient will arrive 15 minutes early.",
                authorName: "Admin User",
                createdAtDisplay: "Yesterday",
            },
        ],
        activity: [
            { id: "ac1", description: "Booking created by patient", createdAtDisplay: "Yesterday" },
            { id: "ac2", description: "Confirmed by Admin User", createdAtDisplay: "Yesterday" },
        ],
    },
    {
        id: "bk_c3d4e5f6g7h8",
        shortId: "f6g7h8",
        patientName: "Tunde Adekunle",
        patientId: "pt_003",
        patientEmail: "tunde.a@example.com",
        patientPhone: "+2348098765432",
        department: "Cardiology",
        type: "Screening",
        preferredDate: "14th May 2026",
        preferredTime: "9am",
        status: "Pending",
        createdAtDisplay: "Yesterday",
        reason: "Annual heart screening",
        additionalNotes: null,
        notes: [],
        activity: [
            { id: "ac1", description: "Booking created by patient", createdAtDisplay: "Yesterday" },
        ],
    },
    {
        id: "bk_d4e5f6g7h8i9",
        shortId: "g7h8i9",
        patientName: "Chiamaka Eze",
        patientId: "pt_004",
        patientEmail: "chiamaka.e@example.com",
        patientPhone: "+2348055556666",
        department: "Paediatrics",
        type: "Consultation",
        preferredDate: "14th May 2026",
        preferredTime: "3pm",
        status: "Confirmed",
        createdAtDisplay: "2 days ago",
        reason: "Child's persistent cough",
        additionalNotes: "Patient is 4 years old.",
        notes: [],
        activity: [
            { id: "ac1", description: "Booking created by patient", createdAtDisplay: "2 days ago" },
            { id: "ac2", description: "Confirmed by Admin User", createdAtDisplay: "Yesterday" },
        ],
    },
    {
        id: "bk_e5f6g7h8i9j0",
        shortId: "h8i9j0",
        patientName: "Femi Adesanya",
        patientId: "pt_005",
        patientEmail: "femi.a@example.com",
        patientPhone: "+2348011112222",
        department: "ENT",
        type: "Consultation",
        preferredDate: "13th May 2026",
        preferredTime: "10am",
        status: "Cancelled",
        createdAtDisplay: "3 days ago",
        reason: "Ear discomfort",
        additionalNotes: null,
        notes: [
            {
                id: "nt1",
                note: "Patient called to cancel — will rebook next week.",
                authorName: "Admin User",
                createdAtDisplay: "2 days ago",
            },
        ],
        activity: [
            { id: "ac1", description: "Booking created by patient", createdAtDisplay: "3 days ago" },
            { id: "ac2", description: "Cancelled by Admin User", createdAtDisplay: "2 days ago" },
        ],
    },
    {
        id: "bk_f6g7h8i9j0k1",
        shortId: "i9j0k1",
        patientName: "Blessing Okonkwo",
        patientId: "pt_006",
        patientEmail: "blessing.o@example.com",
        patientPhone: "+2348033334444",
        department: "Annual Wellness",
        type: "Package",
        preferredDate: "12th May 2026",
        preferredTime: "8am",
        status: "Completed",
        createdAtDisplay: "5 days ago",
        reason: null,
        additionalNotes: "Annual Wellness Package — Standard tier.",
        notes: [],
        activity: [
            { id: "ac1", description: "Booking created by patient", createdAtDisplay: "5 days ago" },
            { id: "ac2", description: "Confirmed by Admin User", createdAtDisplay: "4 days ago" },
            { id: "ac3", description: "Marked Completed by Admin User — Visit stub created", createdAtDisplay: "3 days ago" },
        ],
    },
];

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
    // TODO (backend): api.get("/admin/bookings", { params: { ...filters, page, size: pageSize } })
    const filtered = STUB_BOOKINGS.filter((b) => {
        if (filters.status && filters.status !== "all" && b.status !== filters.status) return false;
        if (filters.type && filters.type !== "all" && b.type !== filters.type) return false;
        if (filters.search) {
            const q = filters.search.toLowerCase();
            if (!b.patientName.toLowerCase().includes(q)) return false;
        }
        return true;
    });

    const start = (page - 1) * pageSize;
    const entries = filtered.slice(start, start + pageSize).map(toSummary);

    return Promise.resolve({
        entries,
        total: filtered.length,
        page,
        pageSize,
    });
}

export async function fetchAdminBookingDetail(id: string): Promise<AdminBookingDetail> {
    // TODO (backend): api.get(`/admin/bookings/${id}`)
    const booking = STUB_BOOKINGS.find((b) => b.id === id);
    if (!booking) return Promise.reject(new Error("Booking not found"));
    return Promise.resolve(booking);
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
    // TODO (backend): api.put(`/admin/bookings/${id}/status`, update)
    //   On COMPLETED, backend auto-creates a Visit and returns the visitId
    //   in the response. Frontend then navigates to /admin/visits/{visitId}/edit.
    console.log("updateBookingStatus stub:", id, update);

    const booking = STUB_BOOKINGS.find((b) => b.id === id);
    if (!booking) return Promise.reject(new Error("Booking not found"));

    const updated: AdminBookingDetail = {
        ...booking,
        status: update.status,
        notes: update.adminNotes
            ? [
                ...booking.notes,
                {
                    id: `nt_${Date.now()}`,
                    note: update.adminNotes,
                    authorName: "Admin User",
                    createdAtDisplay: "Just now",
                },
            ]
            : booking.notes,
        activity: [
            ...booking.activity,
            {
                id: `ac_${Date.now()}`,
                description: `Status changed to ${update.status} by Admin User`,
                createdAtDisplay: "Just now",
            },
        ],
    };

    // Persist the booking change back into the stub array so subsequent reads
    // see the new status (and don't show stale Pending after a reload).
    const idx = STUB_BOOKINGS.findIndex((b) => b.id === id);
    STUB_BOOKINGS[idx] = updated;

    // When transitioning to Completed, mimic the backend's auto-stub Visit
    // creation so the deep-link navigation lands on a real record.
    let visitId: string | undefined;
    if (update.status === "Completed") {
        visitId = `vs_${Date.now()}`;
        const newVisit: AdminVisitDetail = {
            id: visitId,
            patientId: booking.patientId,
            visitDate: booking.preferredDate,
            department: booking.department,
            attendingDoctorText: "",
            chiefComplaint: "",
            status: "Draft",
            bookingShortId: booking.shortId,
            diagnosis: "",
            treatment: "",
            clinicalNotes: "",
            followUpRequired: false,
            followUpDate: "",
            followUpInstructions: "",
        };
        STUB_VISITS[booking.patientId] = [
            ...(STUB_VISITS[booking.patientId] ?? []),
            newVisit,
        ];
    }

    return Promise.resolve({ booking: updated, visitId });
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
        preferredTime: b.preferredTime,
        status: b.status,
        createdAtDisplay: b.createdAtDisplay,
    };
}

// ─── Patients ────────────────────────────────────────────────

export type AdminPatientSummary = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    memberSinceDisplay: string;
    bookingCount: number;
};

export type AdminPatientProfile = AdminPatientSummary & {
    dateOfBirth: string;        // display e.g. "19th April 1987"
    gender: "Male" | "Female" | "Other" | "Not specified";
    whatsapp: string | null;
    address: string | null;
};

export type BloodGroup =
    | "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"
    | "Unknown";

export type Genotype = "AA" | "AS" | "AC" | "SS" | "SC" | "Unknown";

export type AdminHealthProfile = {
    patientId: string;
    bloodGroup: BloodGroup;
    genotype: Genotype;
    heightCm: string;           // string-typed for empty-input handling, parsed on submit
    weightKg: string;
    allergies: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    clinicalNotes: string;
};

const STUB_PATIENTS: AdminPatientProfile[] = [
    {
        id: "pt_001",
        firstName: "Jesse",
        lastName: "Okache",
        email: "jesse.okache@example.com",
        phone: "+2347168909864",
        memberSinceDisplay: "June 2026",
        bookingCount: 4,
        dateOfBirth: "19th April 1987",
        gender: "Male",
        whatsapp: "+2347168909864",
        address: "12 Adetola Street, Surulere, Lagos",
    },
    {
        id: "pt_002",
        firstName: "Amina",
        lastName: "Bello",
        email: "amina.bello@example.com",
        phone: "+2348012345678",
        memberSinceDisplay: "March 2026",
        bookingCount: 8,
        dateOfBirth: "3rd September 1992",
        gender: "Female",
        whatsapp: "+2348012345678",
        address: "44 Bourdillon Road, Ikoyi, Lagos",
    },
    {
        id: "pt_003",
        firstName: "Tunde",
        lastName: "Adekunle",
        email: "tunde.a@example.com",
        phone: "+2348098765432",
        memberSinceDisplay: "January 2026",
        bookingCount: 12,
        dateOfBirth: "11th February 1975",
        gender: "Male",
        whatsapp: null,
        address: "8 Bishop Street, Yaba, Lagos",
    },
    {
        id: "pt_004",
        firstName: "Chiamaka",
        lastName: "Eze",
        email: "chiamaka.e@example.com",
        phone: "+2348055556666",
        memberSinceDisplay: "April 2026",
        bookingCount: 3,
        dateOfBirth: "28th December 1988",
        gender: "Female",
        whatsapp: "+2348055556666",
        address: null,
    },
    {
        id: "pt_005",
        firstName: "Femi",
        lastName: "Adesanya",
        email: "femi.a@example.com",
        phone: "+2348011112222",
        memberSinceDisplay: "May 2026",
        bookingCount: 2,
        dateOfBirth: "5th October 1990",
        gender: "Male",
        whatsapp: null,
        address: "23 Allen Avenue, Ikeja, Lagos",
    },
];

const STUB_HEALTH_PROFILES: Record<string, AdminHealthProfile> = {
    pt_001: {
        patientId: "pt_001",
        bloodGroup: "O+",
        genotype: "AA",
        heightCm: "178",
        weightKg: "82",
        allergies: "Penicillin (mild rash). No known food allergies.",
        emergencyContactName: "Adaeze Okache",
        emergencyContactPhone: "+2348022223333",
        clinicalNotes:
            "Generally healthy. Mild hypertension noted in last annual check-up — under observation, no medication yet.",
    },
    pt_002: {
        patientId: "pt_002",
        bloodGroup: "A+",
        genotype: "AS",
        heightCm: "165",
        weightKg: "62",
        allergies: "None known.",
        emergencyContactName: "Yusuf Bello",
        emergencyContactPhone: "+2348044445555",
        clinicalNotes: "",
    },
};

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
    // TODO (backend): api.get("/admin/patients", { params: { search, page, size: pageSize } })
    const q = search.trim().toLowerCase();
    const filtered = q
        ? STUB_PATIENTS.filter((p) => {
            const haystack =
                `${p.firstName} ${p.lastName} ${p.email} ${p.phone}`.toLowerCase();
            return haystack.includes(q);
        })
        : STUB_PATIENTS;

    const start = (page - 1) * pageSize;
    const entries = filtered.slice(start, start + pageSize).map(toPatientSummary);

    return Promise.resolve({ entries, total: filtered.length, page, pageSize });
}

export async function fetchAdminPatient(id: string): Promise<AdminPatientProfile> {
    // TODO (backend): api.get(`/admin/patients/${id}`)
    const patient = STUB_PATIENTS.find((p) => p.id === id);
    if (!patient) return Promise.reject(new Error("Patient not found"));
    return Promise.resolve(patient);
}

export async function fetchAdminHealthProfile(
    patientId: string,
): Promise<AdminHealthProfile> {
    // TODO (backend): api.get(`/admin/patients/${patientId}/health-profile`)
    //   Backend auto-creates an empty profile on first GET — never 404s.
    const profile = STUB_HEALTH_PROFILES[patientId];
    if (profile) return Promise.resolve(profile);
    // Empty profile fallback (mimics backend's auto-create behavior).
    return Promise.resolve({
        patientId,
        bloodGroup: "Unknown",
        genotype: "Unknown",
        heightCm: "",
        weightKg: "",
        allergies: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        clinicalNotes: "",
    });
}

export async function updateAdminHealthProfile(
    patientId: string,
    profile: AdminHealthProfile,
): Promise<AdminHealthProfile> {
    // TODO (backend): api.put(`/admin/patients/${patientId}/health-profile`, profile)
    console.log("updateAdminHealthProfile stub:", patientId, profile);
    STUB_HEALTH_PROFILES[patientId] = profile;
    return Promise.resolve(profile);
}

function toPatientSummary(p: AdminPatientProfile): AdminPatientSummary {
    return {
        id: p.id,
        firstName: p.firstName,
        lastName: p.lastName,
        email: p.email,
        phone: p.phone,
        memberSinceDisplay: p.memberSinceDisplay,
        bookingCount: p.bookingCount,
    };
}

// ─── Medications & Conditions ────────────────────────────────

export type AdminMedication = {
    id: string;
    name: string;
    dosage: string;          // e.g. "10mg"
    frequency: string;       // e.g. "Twice daily"
    startedOn: string;       // display date e.g. "May 2026"
    prescribedByText: string;
    notes: string;
};

export type ChronicConditionStatus = "Active" | "Managed" | "In remission";

export type AdminCondition = {
    id: string;
    name: string;
    diagnosedDate: string;   // display date e.g. "April 2024"
    status: ChronicConditionStatus;
    managingDoctorText: string;
    notes: string;
};

const STUB_MEDICATIONS: Record<string, AdminMedication[]> = {
    pt_001: [
        {
            id: "med_001",
            name: "Lisinopril",
            dosage: "10mg",
            frequency: "Once daily",
            startedOn: "March 2026",
            prescribedByText: "Dr. Adewale Okafor",
            notes: "For mild hypertension. Monitor BP monthly.",
        },
        {
            id: "med_002",
            name: "Vitamin D3",
            dosage: "2000 IU",
            frequency: "Once daily",
            startedOn: "January 2026",
            prescribedByText: "",
            notes: "Supplement.",
        },
    ],
    pt_002: [],
};

const STUB_CONDITIONS: Record<string, AdminCondition[]> = {
    pt_001: [
        {
            id: "cond_001",
            name: "Hypertension",
            diagnosedDate: "March 2026",
            status: "Managed",
            managingDoctorText: "Dr. Adewale Okafor",
            notes: "Mild. On Lisinopril, BP under control.",
        },
    ],
    pt_002: [],
};

// --- Medications fetchers ---

export async function fetchAdminMedications(
    patientId: string,
): Promise<AdminMedication[]> {
    // TODO (backend): api.get(`/admin/patients/${patientId}/medications`)
    return Promise.resolve(STUB_MEDICATIONS[patientId] ?? []);
}

export type MedicationInput = Omit<AdminMedication, "id">;

export async function createAdminMedication(
    patientId: string,
    input: MedicationInput,
): Promise<AdminMedication> {
    // TODO (backend): api.post(`/admin/patients/${patientId}/medications`, input)
    const created: AdminMedication = { id: `med_${Date.now()}`, ...input };
    STUB_MEDICATIONS[patientId] = [...(STUB_MEDICATIONS[patientId] ?? []), created];
    return Promise.resolve(created);
}

export async function updateAdminMedication(
    medicationId: string,
    input: MedicationInput,
): Promise<AdminMedication> {
    // TODO (backend): api.put(`/admin/medications/${medicationId}`, input)
    for (const patientId of Object.keys(STUB_MEDICATIONS)) {
        const list = STUB_MEDICATIONS[patientId];
        const idx = list.findIndex((m) => m.id === medicationId);
        if (idx >= 0) {
            const updated = { id: medicationId, ...input };
            STUB_MEDICATIONS[patientId] = [
                ...list.slice(0, idx),
                updated,
                ...list.slice(idx + 1),
            ];
            return Promise.resolve(updated);
        }
    }
    return Promise.reject(new Error("Medication not found"));
}

export async function deleteAdminMedication(medicationId: string): Promise<void> {
    // TODO (backend): api.delete(`/admin/medications/${medicationId}`)
    for (const patientId of Object.keys(STUB_MEDICATIONS)) {
        STUB_MEDICATIONS[patientId] = STUB_MEDICATIONS[patientId].filter(
            (m) => m.id !== medicationId,
        );
    }
    return Promise.resolve();
}

// --- Conditions fetchers ---

export async function fetchAdminConditions(
    patientId: string,
): Promise<AdminCondition[]> {
    // TODO (backend): api.get(`/admin/patients/${patientId}/conditions`)
    return Promise.resolve(STUB_CONDITIONS[patientId] ?? []);
}

export type ConditionInput = Omit<AdminCondition, "id">;

export async function createAdminCondition(
    patientId: string,
    input: ConditionInput,
): Promise<AdminCondition> {
    // TODO (backend): api.post(`/admin/patients/${patientId}/conditions`, input)
    const created: AdminCondition = { id: `cond_${Date.now()}`, ...input };
    STUB_CONDITIONS[patientId] = [...(STUB_CONDITIONS[patientId] ?? []), created];
    return Promise.resolve(created);
}

export async function updateAdminCondition(
    conditionId: string,
    input: ConditionInput,
): Promise<AdminCondition> {
    // TODO (backend): api.put(`/admin/conditions/${conditionId}`, input)
    for (const patientId of Object.keys(STUB_CONDITIONS)) {
        const list = STUB_CONDITIONS[patientId];
        const idx = list.findIndex((c) => c.id === conditionId);
        if (idx >= 0) {
            const updated = { id: conditionId, ...input };
            STUB_CONDITIONS[patientId] = [
                ...list.slice(0, idx),
                updated,
                ...list.slice(idx + 1),
            ];
            return Promise.resolve(updated);
        }
    }
    return Promise.reject(new Error("Condition not found"));
}

export async function deleteAdminCondition(conditionId: string): Promise<void> {
    // TODO (backend): api.delete(`/admin/conditions/${conditionId}`)
    for (const patientId of Object.keys(STUB_CONDITIONS)) {
        STUB_CONDITIONS[patientId] = STUB_CONDITIONS[patientId].filter(
            (c) => c.id !== conditionId,
        );
    }
    return Promise.resolve();
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
    diagnosis: string;
    treatment: string;
    clinicalNotes: string;
    followUpRequired: boolean;
    followUpDate: string;       // display string, blank when not required
    followUpInstructions: string;
};

const STUB_VISITS: Record<string, AdminVisitDetail[]> = {
    pt_001: [
        {
            id: "vs_001",
            patientId: "pt_001",
            visitDate: "12th May 2026",
            department: "Annual Wellness",
            attendingDoctorText: "Dr. Adewale Okafor",
            chiefComplaint: "Routine annual physical",
            status: "Completed",
            bookingShortId: "i9j0k1",
            diagnosis: "All vitals within normal range. No acute concerns.",
            treatment:
                "Continue current medications. Recommended dietary adjustments — reduce sodium intake.",
            clinicalNotes:
                "Patient reports occasional headaches, likely stress-related. Will revisit if persistent.",
            followUpRequired: true,
            followUpDate: "12th November 2026",
            followUpInstructions: "Routine 6-month check-up.",
        },
        {
            id: "vs_002",
            patientId: "pt_001",
            visitDate: "3rd April 2026",
            department: "General Surgery",
            attendingDoctorText: "",
            chiefComplaint: "",
            status: "Draft",
            bookingShortId: "f6g7h8",
            diagnosis: "",
            treatment: "",
            clinicalNotes: "",
            followUpRequired: false,
            followUpDate: "",
            followUpInstructions: "",
        },
    ],
    pt_002: [],
};

export async function fetchAdminVisits(patientId: string): Promise<AdminVisitSummary[]> {
    // TODO (backend): api.get(`/admin/patients/${patientId}/visits`)
    const list = STUB_VISITS[patientId] ?? [];
    return Promise.resolve(list.map(toVisitSummary));
}

export async function fetchAdminVisit(visitId: string): Promise<AdminVisitDetail> {
    // TODO (backend): api.get(`/admin/visits/${visitId}`)
    for (const patientId of Object.keys(STUB_VISITS)) {
        const visit = STUB_VISITS[patientId].find((v) => v.id === visitId);
        if (visit) return Promise.resolve(visit);
    }
    return Promise.reject(new Error("Visit not found"));
}

export type VisitUpdateInput = Omit<AdminVisitDetail, "id" | "patientId" | "visitDate" | "department" | "bookingShortId">;

export async function updateAdminVisit(
    visitId: string,
    input: VisitUpdateInput,
): Promise<AdminVisitDetail> {
    // TODO (backend): api.put(`/admin/visits/${visitId}`, input)
    for (const patientId of Object.keys(STUB_VISITS)) {
        const list = STUB_VISITS[patientId];
        const idx = list.findIndex((v) => v.id === visitId);
        if (idx >= 0) {
            const updated: AdminVisitDetail = { ...list[idx], ...input };
            STUB_VISITS[patientId] = [
                ...list.slice(0, idx),
                updated,
                ...list.slice(idx + 1),
            ];
            return Promise.resolve(updated);
        }
    }
    return Promise.reject(new Error("Visit not found"));
}

function toVisitSummary(v: AdminVisitDetail): AdminVisitSummary {
    return {
        id: v.id,
        patientId: v.patientId,
        visitDate: v.visitDate,
        department: v.department,
        attendingDoctorText: v.attendingDoctorText,
        chiefComplaint: v.chiefComplaint,
        status: v.status,
        bookingShortId: v.bookingShortId,
    };
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
    fileName: string;
    contentType: string;
    sizeBytes: number;
    uploadedAtDisplay: string;
};

export type AdminLabResultSummary = {
    id: string;
    patientId: string;
    title: string;            // e.g. "Annual Wellness Test"
    testDate: string;         // display e.g. "12th May 2026"
    bookingShortId: string | null;
    status: AdminLabResultStatus;
    componentCount: number;
    fileCount: number;
};

export type AdminLabResultDetail = AdminLabResultSummary & {
    description: string;
    components: AdminLabComponent[];
    files: AdminLabResultFile[];
};

const STUB_LAB_RESULTS: Record<string, AdminLabResultDetail[]> = {
    pt_001: [
        {
            id: "lr_001",
            patientId: "pt_001",
            title: "Annual Wellness Test",
            testDate: "12th May 2026",
            bookingShortId: "i9j0k1",
            status: "Ready to view",
            description: "Standard annual blood panel. Patient fasted overnight.",
            componentCount: 3,
            fileCount: 1,
            components: [
                {
                    id: "cm_001",
                    name: "Haemoglobin",
                    value: "13.8",
                    unit: "g/dL",
                    referenceRange: "12.0 – 15.5",
                    flag: "Normal",
                },
                {
                    id: "cm_002",
                    name: "Total Cholesterol",
                    value: "245",
                    unit: "mg/dL",
                    referenceRange: "< 200",
                    flag: "High",
                },
                {
                    id: "cm_003",
                    name: "Fasting Glucose",
                    value: "68",
                    unit: "mg/dL",
                    referenceRange: "70 – 99",
                    flag: "Low",
                },
            ],
            files: [
                {
                    id: "fl_001",
                    fileName: "annual_wellness_2026_05.pdf",
                    contentType: "application/pdf",
                    sizeBytes: 248_320,
                    uploadedAtDisplay: "12th May 2026",
                },
            ],
        },
    ],
    pt_002: [],
};

export type LabResultCreateInput = {
    title: string;
    description: string;
    testDate: string;
    bookingShortId?: string;
};

export type LabComponentInput = Omit<AdminLabComponent, "id">;

// --- Lab Result list/detail fetchers ---

export async function fetchAdminLabResults(
    patientId: string,
): Promise<AdminLabResultSummary[]> {
    // TODO (backend): api.get(`/admin/patients/${patientId}/results`)
    const list = STUB_LAB_RESULTS[patientId] ?? [];
    return Promise.resolve(list.map(toLabResultSummary));
}

export async function fetchAdminLabResult(
    resultId: string,
): Promise<AdminLabResultDetail> {
    // TODO (backend): api.get(`/admin/results/${resultId}`)
    for (const patientId of Object.keys(STUB_LAB_RESULTS)) {
        const found = STUB_LAB_RESULTS[patientId].find((r) => r.id === resultId);
        if (found) return Promise.resolve(found);
    }
    return Promise.reject(new Error("Lab result not found"));
}

export async function createAdminLabResult(
    patientId: string,
    input: LabResultCreateInput,
): Promise<AdminLabResultDetail> {
    // TODO (backend): api.post(`/admin/patients/${patientId}/results`, input)
    const created: AdminLabResultDetail = {
        id: `lr_${Date.now()}`,
        patientId,
        title: input.title,
        description: input.description,
        testDate: input.testDate,
        bookingShortId: input.bookingShortId ?? null,
        status: "Pending",
        components: [],
        files: [],
        componentCount: 0,
        fileCount: 0,
    };
    STUB_LAB_RESULTS[patientId] = [...(STUB_LAB_RESULTS[patientId] ?? []), created];
    return Promise.resolve(created);
}

export async function updateLabResultStatus(
    resultId: string,
    status: AdminLabResultStatus,
): Promise<AdminLabResultDetail> {
    // TODO (backend): api.put(`/admin/results/${resultId}/status`, { status })
    const result = await mutateLabResult(resultId, (r) => ({ ...r, status }));
    return result;
}

export async function deleteAdminLabResult(resultId: string): Promise<void> {
    // TODO (backend): api.delete(`/admin/results/${resultId}`)
    for (const patientId of Object.keys(STUB_LAB_RESULTS)) {
        STUB_LAB_RESULTS[patientId] = STUB_LAB_RESULTS[patientId].filter(
            (r) => r.id !== resultId,
        );
    }
    return Promise.resolve();
}

// --- Component fetchers ---

export async function addLabComponent(
    resultId: string,
    input: LabComponentInput,
): Promise<AdminLabComponent> {
    // TODO (backend): api.post(`/admin/results/${resultId}/components`, input)
    const created: AdminLabComponent = { id: `cm_${Date.now()}`, ...input };
    await mutateLabResult(resultId, (r) => ({
        ...r,
        components: [...r.components, created],
        componentCount: r.components.length + 1,
    }));
    return Promise.resolve(created);
}

export async function bulkReplaceLabComponents(
    resultId: string,
    inputs: LabComponentInput[],
): Promise<AdminLabComponent[]> {
    // TODO (backend): api.put(`/admin/results/${resultId}/components/bulk`, inputs)
    const replaced: AdminLabComponent[] = inputs.map((input, i) => ({
        id: `cm_${Date.now()}_${i}`,
        ...input,
    }));
    await mutateLabResult(resultId, (r) => ({
        ...r,
        components: replaced,
        componentCount: replaced.length,
    }));
    return Promise.resolve(replaced);
}

export async function updateLabComponent(
    componentId: string,
    input: LabComponentInput,
): Promise<AdminLabComponent> {
    // TODO (backend): api.put(`/admin/components/${componentId}`, input)
    let updated: AdminLabComponent | null = null;
    for (const patientId of Object.keys(STUB_LAB_RESULTS)) {
        for (let ri = 0; ri < STUB_LAB_RESULTS[patientId].length; ri++) {
            const result = STUB_LAB_RESULTS[patientId][ri];
            const ci = result.components.findIndex((c) => c.id === componentId);
            if (ci >= 0) {
                updated = { id: componentId, ...input };
                const newComponents = [
                    ...result.components.slice(0, ci),
                    updated,
                    ...result.components.slice(ci + 1),
                ];
                STUB_LAB_RESULTS[patientId][ri] = {
                    ...result,
                    components: newComponents,
                };
                return Promise.resolve(updated);
            }
        }
    }
    return Promise.reject(new Error("Component not found"));
}

export async function deleteLabComponent(componentId: string): Promise<void> {
    // TODO (backend): api.delete(`/admin/components/${componentId}`)
    for (const patientId of Object.keys(STUB_LAB_RESULTS)) {
        for (let ri = 0; ri < STUB_LAB_RESULTS[patientId].length; ri++) {
            const result = STUB_LAB_RESULTS[patientId][ri];
            const newComponents = result.components.filter((c) => c.id !== componentId);
            if (newComponents.length !== result.components.length) {
                STUB_LAB_RESULTS[patientId][ri] = {
                    ...result,
                    components: newComponents,
                    componentCount: newComponents.length,
                };
                return Promise.resolve();
            }
        }
    }
    return Promise.resolve();
}

// --- File fetchers ---

export async function uploadLabResultFile(
    resultId: string,
    file: File,
): Promise<AdminLabResultFile> {
    // TODO (backend): api.upload(`/admin/results/${resultId}/files`, file)
    const created: AdminLabResultFile = {
        id: `fl_${Date.now()}`,
        fileName: file.name,
        contentType: file.type,
        sizeBytes: file.size,
        uploadedAtDisplay: "Just now",
    };
    await mutateLabResult(resultId, (r) => ({
        ...r,
        files: [...r.files, created],
        fileCount: r.files.length + 1,
    }));
    return Promise.resolve(created);
}

export async function deleteLabResultFile(fileId: string): Promise<void> {
    // TODO (backend): api.delete(`/admin/result-files/${fileId}`)
    for (const patientId of Object.keys(STUB_LAB_RESULTS)) {
        for (let ri = 0; ri < STUB_LAB_RESULTS[patientId].length; ri++) {
            const result = STUB_LAB_RESULTS[patientId][ri];
            const newFiles = result.files.filter((f) => f.id !== fileId);
            if (newFiles.length !== result.files.length) {
                STUB_LAB_RESULTS[patientId][ri] = {
                    ...result,
                    files: newFiles,
                    fileCount: newFiles.length,
                };
                return Promise.resolve();
            }
        }
    }
    return Promise.resolve();
}

// --- helpers ---

function toLabResultSummary(r: AdminLabResultDetail): AdminLabResultSummary {
    return {
        id: r.id,
        patientId: r.patientId,
        title: r.title,
        testDate: r.testDate,
        bookingShortId: r.bookingShortId,
        status: r.status,
        componentCount: r.componentCount,
        fileCount: r.fileCount,
    };
}

async function mutateLabResult(
    resultId: string,
    fn: (r: AdminLabResultDetail) => AdminLabResultDetail,
): Promise<AdminLabResultDetail> {
    for (const patientId of Object.keys(STUB_LAB_RESULTS)) {
        const idx = STUB_LAB_RESULTS[patientId].findIndex((r) => r.id === resultId);
        if (idx >= 0) {
            const updated = fn(STUB_LAB_RESULTS[patientId][idx]);
            STUB_LAB_RESULTS[patientId][idx] = updated;
            return Promise.resolve(updated);
        }
    }
    return Promise.reject(new Error("Lab result not found"));
}

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
    category: DocumentCategory;
    uploaderType: DocumentUploaderType;
    uploadedByName: string;
    originalFileName: string;
    contentType: string;
    sizeBytes: number;
    uploadedAtDisplay: string;
};

const STUB_DOCUMENTS: Record<string, AdminDocument[]> = {
    pt_001: [
        {
            id: "doc_001",
            patientId: "pt_001",
            title: "AXA Mansard insurance card",
            category: "INSURANCE",
            uploaderType: "PATIENT",
            uploadedByName: "Jesse Okache",
            originalFileName: "axa_card_jesse.pdf",
            contentType: "application/pdf",
            sizeBytes: 142_500,
            uploadedAtDisplay: "12th May 2026",
        },
        {
            id: "doc_002",
            patientId: "pt_001",
            title: "Referral from LUTH Cardiology",
            category: "REFERRAL",
            uploaderType: "ADMIN",
            uploadedByName: "Admin User",
            originalFileName: "luth_referral_2026.pdf",
            contentType: "application/pdf",
            sizeBytes: 248_000,
            uploadedAtDisplay: "3rd May 2026",
        },
    ],
    pt_002: [],
};

export type DocumentUploadInput = {
    title: string;
    category: DocumentCategory;
    file: File;
};

export async function fetchAdminDocuments(
    patientId: string,
): Promise<AdminDocument[]> {
    // TODO (backend): api.get(`/admin/patients/${patientId}/documents`)
    return Promise.resolve(STUB_DOCUMENTS[patientId] ?? []);
}

export async function uploadAdminDocument(
    patientId: string,
    input: DocumentUploadInput,
): Promise<AdminDocument> {
    // TODO (backend): api.upload(`/admin/patients/${patientId}/documents`, input)
    //   multipart/form-data with `title`, `category`, and the `file`.
    const created: AdminDocument = {
        id: `doc_${Date.now()}`,
        patientId,
        title: input.title || input.file.name,
        category: input.category,
        uploaderType: "ADMIN",
        uploadedByName: "Admin User",
        originalFileName: input.file.name,
        contentType: input.file.type,
        sizeBytes: input.file.size,
        uploadedAtDisplay: "Just now",
    };
    STUB_DOCUMENTS[patientId] = [created, ...(STUB_DOCUMENTS[patientId] ?? [])];
    return Promise.resolve(created);
}

export async function deleteAdminDocument(documentId: string): Promise<void> {
    // TODO (backend): api.delete(`/admin/documents/${documentId}`)
    for (const patientId of Object.keys(STUB_DOCUMENTS)) {
        STUB_DOCUMENTS[patientId] = STUB_DOCUMENTS[patientId].filter(
            (d) => d.id !== documentId,
        );
    }
    return Promise.resolve();
}

export async function downloadAdminDocument(documentId: string): Promise<void> {
    // TODO (backend): api.get(`/admin/documents/${documentId}/download`)
    //   Stream the response as a blob and trigger a browser download.
    //   Frontend pattern:
    //     const blob = await api.getBlob(...);
    //     const url = URL.createObjectURL(blob);
    //     const a = document.createElement("a");
    //     a.href = url; a.download = doc.originalFileName; a.click();
    //     URL.revokeObjectURL(url);
    console.log("downloadAdminDocument stub:", documentId);
    return Promise.resolve();
}