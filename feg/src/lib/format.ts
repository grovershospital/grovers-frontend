// ============================================================
// Date / number formatting helpers
// ============================================================
// Pure functions. Used by the data layer to convert backend ISO strings
// into the display format the UI uses. Adding new formatters is fine;
// don't import these from components — date display should already be
// pre-formatted by the time it leaves the data layer.
// ============================================================

const MONTHS_LONG = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

function ordinalSuffix(day: number): string {
    if (day >= 11 && day <= 13) return "th";
    switch (day % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
    }
}

/**
 * "2026-05-15" or "2026-05-15T14:30:00Z" → "15th May 2026"
 */
export function formatDateLong(iso: string | null | undefined): string {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    const day = d.getUTCDate();
    const month = MONTHS_LONG[d.getUTCMonth()];
    const year = d.getUTCFullYear();
    return `${day}${ordinalSuffix(day)} ${month} ${year}`;
}

/**
 * "2026-05-15" → "15th May"  (year omitted, current convention in tables)
 */
export function formatDateShort(iso: string | null | undefined): string {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    const day = d.getUTCDate();
    const month = MONTHS_LONG[d.getUTCMonth()];
    return `${day}${ordinalSuffix(day)} ${month}`;
}

/**
 * "2026-05-15T14:00:00Z" → "2pm"  (no-minute case → "2pm", otherwise "2:30pm")
 */
export function formatTime(iso: string | null | undefined): string {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    let hours = d.getHours();
    const minutes = d.getMinutes();
    const period = hours >= 12 ? "pm" : "am";
    hours = hours % 12 || 12;
    return minutes === 0 ? `${hours}${period}` : `${hours}:${String(minutes).padStart(2, "0")}${period}`;
}

/**
 * "2026-05-01T...Z" → "May 2026"  (used for member-since)
 */
export function formatMonthYear(iso: string | null | undefined): string {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return `${MONTHS_LONG[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/**
 * "2026-06-04T17:30:00Z" → "2 hours ago" / "Just now" / "Yesterday" / "3 days ago" / falls back to short date for older.
 */
export function formatRelative(iso: string | null | undefined): string {
    if (!iso) return "—";
    const then = new Date(iso);
    if (Number.isNaN(then.getTime())) return "—";

    const now = Date.now();
    const diffMs = now - then.getTime();
    if (diffMs < 0) return formatDateShort(iso);     // future timestamps fall back

    const seconds = Math.floor(diffMs / 1000);
    if (seconds < 60) return "Just now";

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

    const days = Math.floor(hours / 24);
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;

    return formatDateShort(iso);
}

/**
 * Combines a LocalDate and a HH:MM string into an ISO timestamp at UTC.
 * Used when posting bookings if backend ever wants a timestamp; currently
 * not used since backend takes preferredDate as LocalDate only. Kept for
 * future use.
 */
export function combineDateTime(date: string, time: string): string {
    return `${date}T${time}:00`;
}