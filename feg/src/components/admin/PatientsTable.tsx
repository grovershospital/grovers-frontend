import { useNavigate } from "react-router-dom";
import type { AdminPatientSummary } from "../../data/admin";

type Props = {
    patients: AdminPatientSummary[];
    loading: boolean;
};

export default function PatientsTable({ patients, loading }: Props) {
    const navigate = useNavigate();

    if (loading) {
        return <p className="text-sm text-neutral-500">Loading…</p>;
    }
    if (patients.length === 0) {
        return (
            <p className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500">
                No patients match your search.
            </p>
        );
    }

    return (
        <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
            <table className="w-full min-w-[800px] border-collapse">
                <thead className="bg-neutral-50">
                <tr className="text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Member since</th>
                </tr>
                </thead>
                <tbody>
                {patients.map((p) => (
                    <tr
                        key={p.id}
                        onClick={() => navigate(`/admin/patients/${p.id}/profile`)}
                        className="cursor-pointer border-t border-neutral-100 text-sm hover:bg-neutral-50"
                    >
                        <td className="px-4 py-3 font-semibold text-brand-ink">
                            {p.firstName} {p.lastName}
                        </td>
                        <td className="px-4 py-3 text-brand-ink">{p.email}</td>
                        <td className="px-4 py-3 text-brand-ink">{p.phone}</td>
                        <td className={'px-4 py-3 text-brand-ink'}>
                            {p.memberSinceDisplay}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}