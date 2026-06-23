import {useEffect, useState} from "react";
import {ChevronDown} from "lucide-react";
import {fetchDepartments, type Department} from "../../data/portal";
import {
    fetchAdminDepartmentSchedule,
    updateDepartmentSchedule,
    type AdminDepartmentSchedule,
    type DayOfWeek,
    type ScheduleInput,
} from "../../data/admin";
import {Skeleton} from "../../ui/Skeleton";
import {toast} from "sonner";

// ─── Constants ──────────────────────────────────────────────

const ALL_DAYS: DayOfWeek[] = [
    "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY",
    "FRIDAY", "SATURDAY", "SUNDAY",
];

const DAY_LABEL: Record<DayOfWeek, string> = {
    MONDAY: "Monday", TUESDAY: "Tuesday", WEDNESDAY: "Wednesday",
    THURSDAY: "Thursday", FRIDAY: "Friday", SATURDAY: "Saturday",
    SUNDAY: "Sunday",
};

const DEFAULT_START = "08:00";
const DEFAULT_END = "17:00";

// ─── Row state ──────────────────────────────────────────────

type DayRow = {
    dayOfWeek: DayOfWeek;
    enabled: boolean;
    startTime: string;
    endTime: string;
};

function buildRows(schedule: AdminDepartmentSchedule[]): DayRow[] {
    const lookup = new Map(schedule.map((s) => [s.dayOfWeek, s]));
    return ALL_DAYS.map((day) => {
        const entry = lookup.get(day);
        return {
            dayOfWeek: day,
            enabled: !!entry,
            startTime: entry?.startTime ?? DEFAULT_START,
            endTime: entry?.endTime ?? DEFAULT_END,
        };
    });
}

// ─── Page ───────────────────────────────────────────────────

type ScheduleStatus = "idle" | "loading" | "error" | "ready";

export default function AdminSchedules() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [deptsLoading, setDeptsLoading] = useState(true);
    const [selectedDeptId, setSelectedDeptId] = useState("");

    const [rows, setRows] = useState<DayRow[]>([]);
    const [scheduleStatus, setScheduleStatus] = useState<ScheduleStatus>("idle");
    const [saving, setSaving] = useState(false);
    const [dirty, setDirty] = useState(false);

    // Load departments on mount.
    useEffect(() => {
        let alive = true;
        fetchDepartments()
            .then((list) => {
                if (alive) setDepartments(list);
            })
            .catch(() => {
                if (alive) toast.error("Could not load departments.");
            })
            .finally(() => {
                if (alive) setDeptsLoading(false);
            });
        return () => {
            alive = false;
        };
    }, []);

    // Fetch schedule when department changes.
    useEffect(() => {
        if (!selectedDeptId) {
            setRows([]);
            setScheduleStatus("idle");
            setDirty(false);
            return;
        }
        let alive = true;
        setScheduleStatus("loading");
        setDirty(false);
        fetchAdminDepartmentSchedule(selectedDeptId)
            .then((data) => {
                if (!alive) return;
                setRows(buildRows(data));
                setScheduleStatus("ready");
            })
            .catch(() => {
                if (alive) setScheduleStatus("error");
            });
        return () => {
            alive = false;
        };
    }, [selectedDeptId]);

    function updateRow(day: DayOfWeek, patch: Partial<DayRow>) {
        setRows((prev) =>
            prev.map((r) => (r.dayOfWeek === day ? {...r, ...patch} : r)),
        );
        setDirty(true);
    }

    async function handleSave() {
        if (!selectedDeptId) return;
        const payload: ScheduleInput[] = rows
            .filter((r) => r.enabled)
            .map((r) => ({
                dayOfWeek: r.dayOfWeek,
                startTime: r.startTime,
                endTime: r.endTime,
            }));

        setSaving(true);
        try {
            const updated = await updateDepartmentSchedule(selectedDeptId, payload);
            setRows(buildRows(updated));
            setDirty(false);
            toast.success("Schedule saved.");
        } catch {
            toast.error("Could not save the schedule. Please try again.");
        } finally {
            setSaving(false);
        }
    }

    const selectedDept = departments.find((d) => d.id === selectedDeptId);

    return (
        <>
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-brand-red sm:text-4xl">
                    Department Schedules
                </h1>
                <p className="mt-3 max-w-prose text-brand-ink">
                    Set the days and hours each department is available for patient
                    bookings. Patients will only be able to request appointments on
                    days the department is open.
                </p>
            </div>

            {/* Department selector */}
            <div className="mb-8 max-w-sm">
                <label
                    htmlFor="sched-dept"
                    className="mb-1.5 block text-sm font-semibold text-brand-ink"
                >
                    Department
                </label>
                {deptsLoading ? (
                    <Skeleton className="h-10 w-full rounded-full"/>
                ) : (
                    <div className="relative">
                        <select
                            id="sched-dept"
                            value={selectedDeptId}
                            onChange={(e) => setSelectedDeptId(e.target.value)}
                            className="w-full appearance-none cursor-pointer rounded-full border border-neutral-300 bg-white py-2.5 pl-4 pr-10 text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                        >
                            <option value="">Select a department</option>
                            {departments.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.name}
                                </option>
                            ))}
                        </select>
                        <ChevronDown
                            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
                            strokeWidth={2}
                        />
                    </div>
                )}
            </div>

            {/* Schedule states */}
            {scheduleStatus === "idle" && selectedDeptId === "" && (
                <div className="rounded-2xl border border-dashed border-neutral-300 bg-white py-16 text-center">
                    <p className="text-sm text-brand-ink/70">
                        Select a department above to view and edit its schedule.
                    </p>
                </div>
            )}

            {scheduleStatus === "loading" && (
                <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                    <div className="space-y-4">
                        {Array.from({length: 7}).map((_, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <Skeleton className="h-5 w-5 rounded"/>
                                <Skeleton className="h-5 w-24"/>
                                <Skeleton className="h-9 w-28 rounded-lg"/>
                                <Skeleton className="h-5 w-4"/>
                                <Skeleton className="h-9 w-28 rounded-lg"/>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {scheduleStatus === "error" && (
                <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center">
                    <p className="text-sm text-brand-ink">
                        Couldn't load the schedule for this department.
                    </p>
                    <button
                        type="button"
                        onClick={() => {
                            // Re-trigger fetch by resetting and re-selecting
                            const id = selectedDeptId;
                            setSelectedDeptId("");
                            requestAnimationFrame(() => setSelectedDeptId(id));
                        }}
                        className="mt-3 text-sm text-brand-ink underline underline-offset-2 hover:no-underline"
                    >
                        Try again
                    </button>
                </div>
            )}

            {scheduleStatus === "ready" && (
                <div className="rounded-2xl border border-neutral-200 bg-white">
                    <div className="border-b border-neutral-100 px-6 py-4">
                        <h2 className="text-base font-bold text-brand-ink">
                            {selectedDept?.name} — Weekly Schedule
                        </h2>
                        <p className="mt-1 text-xs text-neutral-500">
                            Check a day to mark it as open. Unchecked days are
                            closed to bookings.
                        </p>
                    </div>

                    <div className="divide-y divide-neutral-100">
                        {rows.map((row) => (
                            <div
                                key={row.dayOfWeek}
                                className={`flex flex-wrap items-center gap-x-4 gap-y-2 px-6 py-4 transition-colors ${
                                    row.enabled ? "bg-white" : "bg-neutral-50"
                                }`}
                            >
                                {/* Enable toggle */}
                                <label className="flex items-center gap-3 sm:w-36">
                                    <input
                                        type="checkbox"
                                        checked={row.enabled}
                                        onChange={(e) =>
                                            updateRow(row.dayOfWeek, {
                                                enabled: e.target.checked,
                                            })
                                        }
                                        className="h-4 w-4 rounded border-neutral-300 text-brand-red focus:ring-brand-blue"
                                    />
                                    <span
                                        className={`text-sm font-medium ${
                                            row.enabled
                                                ? "text-brand-ink"
                                                : "text-neutral-400"
                                        }`}
                                    >
                                        {DAY_LABEL[row.dayOfWeek]}
                                    </span>
                                </label>

                                {/* Time inputs */}
                                {row.enabled ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="time"
                                            value={row.startTime}
                                            onChange={(e) =>
                                                updateRow(row.dayOfWeek, {
                                                    startTime: e.target.value,
                                                })
                                            }
                                            className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                                        />
                                        <span className="text-sm text-neutral-400">–</span>
                                        <input
                                            type="time"
                                            value={row.endTime}
                                            onChange={(e) =>
                                                updateRow(row.dayOfWeek, {
                                                    endTime: e.target.value,
                                                })
                                            }
                                            className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                                        />
                                    </div>
                                ) : (
                                    <span className="text-sm italic text-neutral-400">
                                        Closed
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between border-t border-neutral-100 px-6 py-4">
                        <p className="text-xs text-neutral-500">
                            {dirty
                                ? "You have unsaved changes."
                                : "All changes saved."}
                        </p>
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={saving || !dirty}
                            className="inline-flex items-center justify-center rounded-full bg-brand-red px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red disabled:opacity-60"
                        >
                            {saving ? "Saving…" : "Save schedule"}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}