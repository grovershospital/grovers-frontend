import type { VisitStatus } from "../../data/admin";

type Props = {
    status: VisitStatus;
    size?: "sm" | "md";
};

const TONE: Record<VisitStatus, string> = {
    Draft: "bg-neutral-200 text-neutral-700",
    Completed: "bg-brand-green/10 text-brand-green",
};

export default function VisitStatusPill({ status, size = "sm" }: Props) {
    const sizing =
        size === "md" ? "px-3 py-1 text-sm" : "px-2.5 py-0.5 text-xs";

    return (
        <span
            className={`inline-flex items-center rounded-full font-semibold ${sizing} ${TONE[status]}`}
        >
            {status}
        </span>
    );
}