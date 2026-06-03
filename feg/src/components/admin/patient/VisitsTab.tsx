import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VisitStatusPill from "../../../components/admin/VisitStatusPill";
import { useAdminPatient } from "../../../contexts/AdminPatientContext";
import { fetchAdminVisits, type AdminVisitSummary } from "../../../data/admin";

export default function VisitsTab() {
    const patient = useAdminPatient();
    const navigate = useNavigate();

    const [visits, setVisits] = useState<AdminVisitSummary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let alive = true;
        setLoading(true);
        fetchAdminVisits(patient.id)
            .then((data) => {
                if (alive) setVisits(data);
            })
            .finally(() => {
                if (alive) setLoading(false);
            });
        return () => {
            alive = false;
        };
    }, [patient.id]);

    return (
        <>
            <div className="mb-6">
                <h2 className="text-xl font-bold text-brand-ink">Visits</h2>
                <p className="mt-1 text-sm text-neutral-500">
                    Clinical records from completed bookings. Visits are auto-created when a
                    booking is marked Completed — fill in the clinical content after the visit
                    happens.
                </p>
            </div>

            {loading ? (
                <p className="text-sm text-neutral-500">Loading…</p>
            ) : visits.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center text-sm text-neutral-500">
                    No visits recorded yet. Visits are created when a booking is marked
                    Completed.
                </p>
            ) : (
                <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
                    <table className="w-full min-w-[800px] border-collapse">
                        <thead className="bg-neutral-50">
                        <tr className="text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Department</th>
                            <th className="px-4 py-3">Attending</th>
                            <th className="px-4 py-3">Chief complaint</th>
                            <th className="px-4 py-3">Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {visits.map((v) => (
                            <tr
                                key={v.id}
                                onClick={() => navigate(`/admin/visits/${v.id}/edit`)}
                                className="cursor-pointer border-t border-neutral-100 text-sm hover:bg-neutral-50"
                            >
                                <td className="px-4 py-3 font-semibold text-brand-ink">
                                    {v.visitDate}
                                </td>
                                <td className="px-4 py-3 text-brand-ink">
                                    {v.department}
                                </td>
                                <td className="px-4 py-3 text-brand-ink">
                                    {v.attendingDoctorText || (
                                        <span className="italic text-neutral-400">
                                                Not set
                                            </span>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-brand-ink">
                                    {v.chiefComplaint ? (
                                        <span className="line-clamp-1">
                                                {v.chiefComplaint}
                                            </span>
                                    ) : (
                                        <span className="italic text-neutral-400">
                                                Empty
                                            </span>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <VisitStatusPill status={v.status} />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}