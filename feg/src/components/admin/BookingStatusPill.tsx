import type { AdminBookingStatus } from "../../data/admin";

type Props = {
    status: AdminBookingStatus;
    size?: "sm" | "md";
};

const TONE: Record<AdminBookingStatus, string> = {
    Pending: "bg-brand-red/10 text-brand-red",
    Confirmed: "bg-brand-blue/10 text-brand-blue",
    Completed: "bg-brand-green/10 text-brand-green",
    Cancelled: "bg-neutral-200 text-neutral-600",
};

export default function BookingStatusPill({ status, size = "sm" }: Props) {
    const sizing =
        size === "md"
            ? "px-3 py-1 text-sm"
            : "px-2.5 py-0.5 text-xs";

    return (
        <span
            className={`inline-flex items-center rounded-full font-semibold ${sizing} ${TONE[status]}`}
        >
            {status}
        </span>
    );
}