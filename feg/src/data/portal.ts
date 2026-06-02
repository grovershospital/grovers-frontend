// ============================================================
// Patient portal data layer
// ============================================================
// Stub data + Promise-returning fetch functions for the patient dashboard.
// Same pattern as articles.ts — when the backend is wired up:
//   1. Delete STUB_* constants below
//   2. Replace each fetch function body with the real `fetch(...)` call
//      (each has a TODO comment showing exactly what to write)
//   3. Components stay untouched
// ============================================================

export type PortalUser = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    memberSince: string; // formatted display string e.g. "June 2026"
};

export type NotificationType =
    | "lab-ready"
    | "appointment-reminder"
    | "appointment-confirmed"
    | "appointment-cancelled"
    | "medical-history"
    | "feedback";

export type PortalNotification = {
    id: string;
    type: NotificationType;
    message: string;
    read: boolean;
    href: string;
    createdAt: string;
};

export type AppointmentStatus = "Confirmed" | "Pending" | "Cancelled" | "Completed";

export type Appointment = {
    id: string;
    date: string;
    time: string;
    department: string;
    status: AppointmentStatus;
};

export type LabResultStatus = "Ready to view" | "Pending";

export type LabResult = {
    id: string;
    date: string;
    test: string;
    status: LabResultStatus;
};

// Departments
export const DEPARTMENTS = [
    "OB/GYN",
    "Paediatrics",
    "Family Medicine",
    "Internal Medicine",
    "Cardiology",
    "Nephrology",
    "Urology",
    "Orthopaedic Surgery",
    "Neurology",
    "ENT",
    "Endocrinology",
    "Gastroenterology",
    "Dermatology",
    "Physiotherapy",
    "Hematology",
    "Mental Health",
    "Psychiatry",
    "Dietician",
    "General Surgery",
] as const;

export type Department = (typeof DEPARTMENTS)[number];

// ─── Stub data ───────────────────────────────────────────────

const STUB_USER: PortalUser = {
    firstName: "Jesse",
    lastName: "Okache",
    email: "testemail@testemail.com",
    phone: "+2347168909864",
    memberSince: "June 2026",
};

const STUB_NOTIFICATIONS: PortalNotification[] = [
    {
        id: "n1",
        type: "lab-ready",
        message: "Your lab results for [Test Name] are ready to view.",
        read: false,
        href: "/patient-portal/lab-results",
        createdAt: "2026-06-01T09:00:00Z",
    },
    {
        id: "n2",
        type: "appointment-reminder",
        message:
            "Reminder: You have an appointment on [Date] at [Time] with [Department].",
        read: true,
        href: "/patient-portal/appointments",
        createdAt: "2026-05-30T08:00:00Z",
    },
    {
        id: "n3",
        type: "appointment-confirmed",
        message: "Your appointment on [Date] has been confirmed.",
        read: true,
        href: "/patient-portal/appointments",
        createdAt: "2026-05-29T10:00:00Z",
    },
    {
        id: "n4",
        type: "appointment-cancelled",
        message: "Your appointment on [Date] has been cancelled.",
        read: true,
        href: "/patient-portal/appointments",
        createdAt: "2026-05-28T14:00:00Z",
    },
    {
        id: "n5",
        type: "medical-history",
        message: "Your medical history has been updated.",
        read: true,
        href: "/patient-portal/profile",
        createdAt: "2026-05-25T11:00:00Z",
    },
    {
        id: "n6",
        type: "feedback",
        message: "Thank you for your feedback. We appreciate you taking the time.",
        read: true,
        href: "/patient-portal/feedback",
        createdAt: "2026-05-20T15:00:00Z",
    },
];

const STUB_APPOINTMENTS: Appointment[] = [
    {
        id: "a1",
        date: "15th May",
        time: "2pm",
        department: "General Surgery",
        status: "Confirmed",
    },
    {
        id: "a2",
        date: "[Date]",
        time: "[Time]",
        department: "[Department]",
        status: "Pending",
    },
    {
        id: "a3",
        date: "[Date]",
        time: "[Time]",
        department: "[Department]",
        status: "Confirmed",
    },
];

const STUB_LAB_RESULTS: LabResult[] = [
    {
        id: "l1",
        date: "12th June",
        test: "Annual Wellness Test",
        status: "Ready to view",
    },
    { id: "l2", date: "[Date]", test: "[Time]", status: "Pending" },
    { id: "l3", date: "[Date]", test: "[Time]", status: "Ready to view" },
];

// --- Booking input ---
export type BookAppointmentInput = {
    department: string;
    date: string;       // ISO yyyy-mm-dd from <input type="date">
    time: string;       // HH:MM from <input type="time">
    reason?: string;
    notes?: string;
};

// --- Stubs for past appointments ---
const PAST_APPOINTMENTS_STUB: ReadonlyArray<Appointment> = [
    { id: "past-1", date: "15th May", time: "2pm", department: "General Surgery", status: "Completed" },
    { id: "past-2", date: "10th May", time: "9am", department: "OB/GYN", status: "Cancelled" },
    { id: "past-3", date: "1st May", time: "11am", department: "ENT", status: "Completed" },
];

// --- Fetchers ---
export async function fetchPastAppointments(): Promise<ReadonlyArray<Appointment>> {
    // TODO (backend): replace with real fetch
    //   const res = await fetch("/api/appointments/past", { credentials: "include" });
    //   if (!res.ok) throw new Error("Failed to load past appointments");
    //   return res.json();
    return Promise.resolve(PAST_APPOINTMENTS_STUB);
}

export async function bookAppointment(input: BookAppointmentInput): Promise<Appointment> {
    // TODO (backend): replace with real POST
    //   const res = await fetch("/api/appointments", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     credentials: "include",
    //     body: JSON.stringify(input),
    //   });
    //   if (!res.ok) throw new Error("Failed to book appointment");
    //   return res.json();
    return Promise.resolve({
        id: `new-${Date.now()}`,
        date: input.date,
        time: input.time,
        department: input.department,
        status: "Pending",
    });
}

export async function cancelAppointment(id: string): Promise<void> {
    // TODO (backend): replace with real DELETE/PATCH
    //   const res = await fetch(`/api/appointments/${id}`, {
    //     method: "DELETE",
    //     credentials: "include",
    //   });
    //   if (!res.ok) throw new Error("Failed to cancel appointment");
    console.log("cancelAppointment stub:", id);
    return Promise.resolve();
}

export async function rescheduleAppointment(
    id: string,
    date: string,
    time: string,
): Promise<Appointment> {
    // TODO (backend): replace with real PATCH
    console.log("rescheduleAppointment stub:", { id, date, time });
    return Promise.resolve({ id, date, time, department: "—", status: "Pending" });
}

// ─── Public data-access functions ────────────────────────────

export async function fetchPortalUser(): Promise<PortalUser> {
    // TODO (backend): replace with
    //   const res = await fetch("/api/portal/me");
    //   if (!res.ok) throw new Error("Failed to load user");
    //   return res.json();
    return Promise.resolve(STUB_USER);
}

export async function fetchNotifications(): Promise<PortalNotification[]> {
    // TODO (backend): replace with
    //   const res = await fetch("/api/portal/notifications");
    //   if (!res.ok) throw new Error("Failed to load notifications");
    //   return res.json();
    return Promise.resolve(STUB_NOTIFICATIONS);
}

export async function fetchUpcomingAppointments(): Promise<Appointment[]> {
    // TODO (backend): replace with
    //   const res = await fetch("/api/portal/appointments?status=upcoming&limit=3");
    //   if (!res.ok) throw new Error("Failed to load appointments");
    //   return res.json();
    return Promise.resolve(STUB_APPOINTMENTS);
}

export async function fetchRecentLabResults(): Promise<LabResult[]> {
    // TODO (backend): replace with
    //   const res = await fetch("/api/portal/lab-results?limit=3");
    //   if (!res.ok) throw new Error("Failed to load lab results");
    //   return res.json();
    return Promise.resolve(STUB_LAB_RESULTS);
}