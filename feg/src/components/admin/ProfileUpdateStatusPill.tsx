import type { ProfileUpdateStatus } from "../../data/admin";

type Props = {
    status: ProfileUpdateStatus;
    size?: "sm" | "md";
};

const TONE: Record<ProfileUpdateStatus, string> = {
    Pending: "bg-amber-100 text-amber-700",
    Approved: "bg-brand-green/10 text-brand-green",
    Rejected: "bg-brand-red/10 text-brand-red",
};

export default function ProfileUpdateStatusPill({ status, size = "sm" }: Props) {
    const sizing = size === "md" ? "px-3 py-1 text-sm" : "px-2.5 py-0.5 text-xs";
    return (
        <span
            className={`inline-flex items-center rounded-full font-semibold ${sizing} ${TONE[status]}`}
        >
            {status}
        </span>
    );
}