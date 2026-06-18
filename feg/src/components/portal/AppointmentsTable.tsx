import {Skeleton} from "../../ui/Skeleton";
import type {Appointment, AppointmentStatus} from "../../data/portal";

type Status = "loading" | "error" | "ready";

type Action =
    | {
    kind: "upcoming";
    onReschedule: (a: Appointment) => void;
    onCancel: (a: Appointment) => void;
}
    | {
    kind: "past";
    onRebook: (a: Appointment) => void;
};

type Props = {
    title: string;
    appointments: ReadonlyArray<Appointment>;
    action: Action;
    status: Status;
    onRetry?: () => void;
};

const STATUS_TONE: Record<AppointmentStatus, string> = {
    Confirmed: "text-brand-green",
    Pending: "text-brand-red",
    Cancelled: "text-brand-red",
    Completed: "text-brand-green",
};

export default function AppointmentsTable({title, appointments, action, status, onRetry}: Props) {
    const isUpcoming = action.kind === "upcoming";

    return (
        <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-brand-ink">{title}</h2>

            {status === "loading" && (
                <AppointmentsTableSkeleton hasActions={isUpcoming}/>
            )}

            {status === "error" && (
                <div className="rounded-lg border border-dashed border-neutral-300 py-8 text-center">
                    <p className="text-sm text-brand-ink">
                        Couldn't load {isUpcoming ? "upcoming" : "past"} appointments.
                    </p>
                    {onRetry && (
                        <button
                            type="button"
                            onClick={onRetry}
                            className="mt-3 text-sm text-brand-ink underline underline-offset-2 hover:no-underline"
                        >
                            Try again
                        </button>
                    )}
                </div>
            )}

            {status === "ready" && appointments.length === 0 && (
                <div className="rounded-lg border border-dashed border-neutral-300 py-12 text-center">
                    <p className="text-sm text-brand-ink/70">
                        {isUpcoming
                            ? "No upcoming appointments."
                            : "No past appointments yet."}
                    </p>
                </div>
            )}

            {status === "ready" && appointments.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] border-collapse">
                        <thead>
                        <tr className="text-left text-sm font-semibold text-brand-ink">
                            <th className="pb-4 pr-6">Date</th>
                            <th className="pb-4 pr-6">Department</th>
                            <th className="pb-4 pr-6">Status</th>
                            <th className="pb-4">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {appointments.map((a) => (
                            <tr key={a.id} className="align-top text-sm">
                                <td className="py-3 pr-6 font-semibold text-brand-ink">
                                    {a.date}
                                </td>
                                <td className="py-3 pr-6 font-semibold text-brand-ink">
                                    {a.department}
                                </td>
                                <td className={`py-3 pr-6 italic ${STATUS_TONE[a.status]}`}>
                                    {a.status}
                                </td>
                                <td className="py-3">
                                    {action.kind === "upcoming" ? (
                                        <div className="flex flex-col gap-1">
                                            <button
                                                type="button"
                                                onClick={() => action.onReschedule(a)}
                                                disabled={a.status === "Confirmed"}
                                                title={
                                                    a.status === "Confirmed"
                                                        ? "Confirmed appointments can't be rescheduled. Cancel and rebook to change the date."
                                                        : undefined
                                                }
                                                className="text-left text-sm cursor-pointer text-brand-ink underline underline-offset-2 hover:no-underline disabled:cursor-not-allowed disabled:text-neutral-400 disabled:no-underline"
                                            >
                                                Reschedule
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => action.onCancel(a)}
                                                className="text-left text-sm cursor-pointer text-brand-ink underline underline-offset-2 hover:no-underline"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => action.onRebook(a)}
                                            className="text-sm text-brand-ink underline underline-offset-2 hover:no-underline"
                                        >
                                            Rebook
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

// Mirrors the data table layout exactly — same headers, same column widths —
// so swap-in is layout-stable. `hasActions` controls whether the Action
// column shows one or two stacked link skeletons (matches Reschedule+Cancel
// stack for upcoming vs single Rebook for past).
function AppointmentsTableSkeleton({hasActions}: { hasActions: boolean }) {
    const rows = 3;
    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse">
                <thead>
                <tr className="text-left text-sm font-semibold text-brand-ink">
                    <th className="pb-4 pr-6">Date</th>
                    <th className="pb-4 pr-6">Department</th>
                    <th className="pb-4 pr-6">Status</th>
                    <th className="pb-4">Action</th>
                </tr>
                </thead>
                <tbody>
                {Array.from({length: rows}).map((_, i) => (
                    <tr key={i} className="align-top text-sm">
                        <td className="py-3 pr-6">
                            <Skeleton className="h-4 w-24"/>
                        </td>
                        <td className="py-3 pr-6">
                            <Skeleton className="h-4 w-32"/>
                        </td>
                        <td className="py-3 pr-6">
                            <Skeleton className="h-4 w-20"/>
                        </td>
                        <td className="py-3">
                            {hasActions ? (
                                <div className="flex flex-col gap-1">
                                    <Skeleton className="h-4 w-20"/>
                                    <Skeleton className="h-4 w-16"/>
                                </div>
                            ) : (
                                <Skeleton className="h-4 w-16"/>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}