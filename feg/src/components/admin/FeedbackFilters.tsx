import {ChevronDown, Search} from "lucide-react";
import type {
    AdminFeedbackFilters,
    AdminFeedbackStatus,
    AdminFeedbackType,
} from "../../data/admin";

type Props = {
    filters: AdminFeedbackFilters;
    onChange: (filters: AdminFeedbackFilters) => void;
};

const TYPES: ReadonlyArray<AdminFeedbackType> = [
    "Compliment",
    "Complaint",
    "Suggestion",
    "General feedback",
];

const STATUSES: ReadonlyArray<AdminFeedbackStatus> = [
    "Pending",
    "Under review",
    "Reviewed",
    "Response sent",
];

const READ_STATES = [
    { value: "all", label: "All" },
    { value: "unread", label: "Unread" },
    { value: "read", label: "Read" },
] as const;

export default function FeedbackFilters({ filters, onChange }: Props) {
    function update<K extends keyof AdminFeedbackFilters>(
        key: K,
        value: AdminFeedbackFilters[K],
    ) {
        onChange({ ...filters, [key]: value });
    }

    return (
        <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto_auto]">
            <div className="relative">
                <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                    strokeWidth={2}
                />
                <input
                    type="search"
                    placeholder="Search feedback…"
                    value={filters.search ?? ""}
                    onChange={(e) => update("search", e.target.value)}
                    className="w-full rounded-full border border-neutral-300 bg-white py-2 pl-10 pr-4 text-sm text-brand-ink placeholder:text-neutral-400 focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                />
            </div>

            <div className={'relative'}>
                <select
                    value={filters.type ?? "all"}
                    onChange={(e) =>
                        update("type", e.target.value as AdminFeedbackType | "all")
                    }
                    className="appearance-none rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                >
                    <option value="all">All types</option>
                    {TYPES.map((t) => (
                        <option key={t} value={t}>
                            {t}
                        </option>
                    ))}
                </select>
                <ChevronDown
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
                    strokeWidth={2}
                />
            </div>

            <div className={'relative'}>
                <select
                    value={filters.status ?? "all"}
                    onChange={(e) =>
                        update("status", e.target.value as AdminFeedbackStatus | "all")
                    }
                    className="appearance-none rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                >
                    <option value="all">All statuses</option>
                    {STATUSES.map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>
                <ChevronDown
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
                    strokeWidth={2}
                />
            </div>


            <select
                value={filters.readState ?? "all"}
                onChange={(e) =>
                    update("readState", e.target.value as "all" | "unread" | "read")
                }
                className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
            >
                {READ_STATES.map((r) => (
                    <option key={r.value} value={r.value}>
                        {r.label}
                    </option>
                ))}
            </select>
        </div>
    );
}