import type { AdminBookingActivity } from "../../data/admin";

type Props = {
    activity: AdminBookingActivity[];
};

export default function BookingActivityCard({ activity }: Props) {
    return (
        <section className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 text-base font-bold text-brand-ink">Activity</h2>

            <ol className="space-y-3">
                {activity.map((a) => (
                    <li key={a.id} className="flex items-start gap-3 text-sm">
                        <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-brand-blue" />
                        <div>
                            <p className="text-brand-ink">{a.description}</p>
                            <p className="text-xs text-neutral-500">{a.createdAtDisplay}</p>
                        </div>
                    </li>
                ))}
            </ol>
        </section>
    );
}