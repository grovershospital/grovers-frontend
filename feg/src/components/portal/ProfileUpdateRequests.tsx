import { useEffect, useState } from "react";
import { ArrowRight, Plus } from "lucide-react";
import ProfileUpdateRequestModal from "./ProfileUpdateRequestModal";
import {
    fetchMyProfileUpdateRequests,
    type PortalProfileUpdateRequest,
    type ProfileUpdateRequestStatus,
} from "../../data/portal";

const STATUS_TONE: Record<ProfileUpdateRequestStatus, string> = {
    Pending: "bg-neutral-200 text-neutral-700",
    Approved: "bg-brand-green/10 text-brand-green",
    Rejected: "bg-brand-red/10 text-brand-red",
};

export default function ProfileUpdateRequests() {
    const [requests, setRequests] = useState<PortalProfileUpdateRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        let alive = true;
        fetchMyProfileUpdateRequests()
            .then((data) => {
                if (alive) setRequests(data);
            })
            .finally(() => {
                if (alive) setLoading(false);
            });
        return () => {
            alive = false;
        };
    }, []);

    function handleSubmitted(created: PortalProfileUpdateRequest) {
        setRequests((list) => [created, ...list]);
    }

    return (
        <section className="mb-8 rounded-2xl border border-neutral-200 bg-white p-6">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold text-brand-ink">Health profile</h2>
                    <p className="mt-1 max-w-prose text-sm text-neutral-500">
                        Clinical details like blood group, genotype and allergies are
                        managed by our team. Submit a request and we'll review it.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="inline-flex items-center gap-2 rounded-full bg-brand-red px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                >
                    <Plus className="h-4 w-4" strokeWidth={2.5} />
                    Request a change
                </button>
            </div>

            <div className="border-t border-neutral-200 pt-5">
                <h3 className="mb-3 text-sm font-bold text-brand-ink">Your requests</h3>

                {loading ? (
                    <p className="text-sm text-neutral-500">Loading…</p>
                ) : requests.length === 0 ? (
                    <p className="text-sm text-neutral-500">
                        You haven't submitted any requests yet.
                    </p>
                ) : (
                    <ul className="space-y-3">
                        {requests.map((r) => (
                            <li
                                key={r.id}
                                className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4"
                            >
                                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                                    <p className="text-sm font-semibold text-brand-ink">
                                        {r.fieldLabel}
                                    </p>
                                    <span
                                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_TONE[r.status]}`}
                                    >
                                        {r.status}
                                    </span>
                                </div>

                                {r.field !== "OTHER" && (
                                    <p className="mb-2 flex flex-wrap items-center gap-2 text-sm text-brand-ink">
                                        <span className="text-neutral-500">
                                            {r.currentValue || "—"}
                                        </span>
                                        <ArrowRight
                                            className="h-3.5 w-3.5 text-neutral-400"
                                            strokeWidth={2}
                                        />
                                        <span>{r.proposedValue}</span>
                                    </p>
                                )}

                                {r.field === "OTHER" && r.proposedValue && (
                                    <p className="mb-2 text-sm text-brand-ink">
                                        {r.proposedValue}
                                    </p>
                                )}

                                <p className="text-xs text-neutral-500">
                                    {r.status === "Pending"
                                        ? `Submitted ${r.submittedAtDisplay}`
                                        : `${r.status} · ${r.decidedAtDisplay ?? r.submittedAtDisplay}`}
                                </p>

                                {r.adminResponse && (
                                    <p className="mt-2 rounded-lg border border-neutral-200 bg-white p-3 text-sm italic text-neutral-700">
                                        "{r.adminResponse}"
                                    </p>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <ProfileUpdateRequestModal
                open={open}
                onClose={() => setOpen(false)}
                onSubmitted={handleSubmitted}
            />
        </section>
    );
}