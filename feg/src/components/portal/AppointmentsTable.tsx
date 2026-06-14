import type { Appointment, AppointmentStatus } from "../../data/portal";

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
    loading?: boolean;
};

const STATUS_TONE: Record<AppointmentStatus, string> = {
    Confirmed: "text-brand-green",
    Pending: "text-brand-red",
    Cancelled: "text-brand-red",
    Completed: "text-brand-green",
};

export default function AppointmentsTable({ title, appointments, action, loading }: Props) {
    return (
        <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-brand-ink">{title}</h2>

            {loading ? (
                <p className="text-sm text-neutral-500">Loading…</p>
            ) : appointments.length === 0 ? (
                <p className="text-sm text-neutral-500">
                    {action.kind === "upcoming"
                        ? "No upcoming appointments."
                        : "No past appointments yet."}
                </p>
            ) : (
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