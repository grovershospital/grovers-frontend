import { Search, ChevronDown } from "lucide-react";
import type {
    AdminBookingFilters,
    AdminBookingStatus,
    AdminBookingType,
} from "../../data/admin";

type Props = {
    filters: AdminBookingFilters;
    onChange: (filters: AdminBookingFilters) => void;
};

const STATUSES: ReadonlyArray<AdminBookingStatus> = [
    "Pending",
    "Confirmed",
    "Completed",
    "Cancelled",
];

const TYPES: ReadonlyArray<AdminBookingType> = ["Consultation", "Screening", "Package"];

export default function BookingsFilters({ filters, onChange }: Props) {
    function update<K extends keyof AdminBookingFilters>(
        key: K,
        value: AdminBookingFilters[K],
    ) {
        onChange({ ...filters, [key]: value });
    }

    return (
        <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto]">
            <div className="relative">
                <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                    strokeWidth={2}
                />
                <input
                    type="search"
                    placeholder="Search by patient name…"
                    value={filters.search ?? ""}
                    onChange={(e) => update("search", e.target.value)}
                    className="w-full rounded-full border border-neutral-300 bg-white py-2 pl-10 pr-4 text-sm text-brand-ink placeholder:text-neutral-400 focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                />
            </div>

            <div className="relative">
                <select
                    value={filters.status ?? "all"}
                    onChange={(e) =>
                        update("status", e.target.value as AdminBookingStatus | "all")
                    }
                    className="w-full appearance-none cursor-pointer rounded-full border border-neutral-300 bg-white py-2 pl-4 pr-10 text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
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

            <div className="relative">
                <select
                    value={filters.type ?? "all"}
                    onChange={(e) =>
                        update("type", e.target.value as AdminBookingType | "all")
                    }
                    className="w-full appearance-none cursor-pointer rounded-full border border-neutral-300 bg-white py-2 pl-4 pr-10 text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
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
        </div>
    );
}