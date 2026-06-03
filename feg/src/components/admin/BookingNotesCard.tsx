import type { AdminBookingNote } from "../../data/admin";

type Props = {
    notes: AdminBookingNote[];
};

export default function BookingNotesCard({ notes }: Props) {
    return (
        <section className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 text-base font-bold text-brand-ink">Admin Notes</h2>

            {notes.length === 0 ? (
                <p className="text-sm text-neutral-500">
                    No notes yet. Add one when changing this booking's status.
                </p>
            ) : (
                <ul className="space-y-4">
                    {notes.map((n) => (
                        <li
                            key={n.id}
                            className="border-l-2 border-brand-blue bg-neutral-50 px-4 py-3"
                        >
                            <p className="text-sm text-brand-ink">{n.note}</p>
                            <p className="mt-2 text-xs text-neutral-500">
                                {n.authorName} · {n.createdAtDisplay}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}