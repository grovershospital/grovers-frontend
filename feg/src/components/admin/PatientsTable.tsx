import {useNavigate} from "react-router-dom";
import {Skeleton} from "../../ui/Skeleton";
import type {AdminPatientSummary} from "../../data/admin";

type Status = "loading" | "error" | "ready";

type Props = {
    patients: AdminPatientSummary[];
    status: Status;
    onRetry?: () => void;
};

export default function PatientsTable({patients, status, onRetry}: Props) {
    const navigate = useNavigate();

    if (status === "loading") {
        return <PatientsTableSkeleton/>;
    }

    if (status === "error") {
        return (
            <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center">
                <p className="text-sm text-brand-ink">Couldn't load patients.</p>
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
        );
    }

    if (patients.length === 0) {
        return (
            <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500">
                No patients match your search.
            </div>
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
                        <td className="px-4 py-3 text-brand-ink">
                            {p.memberSinceDisplay}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

function PatientsTableSkeleton() {
    const rows = 5;
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
                {Array.from({length: rows}).map((_, i) => (
                    <tr key={i} className="border-t border-neutral-100 text-sm">
                        <td className="px-4 py-3">
                            <Skeleton className="h-4 w-40"/>
                        </td>
                        <td className="px-4 py-3">
                            <Skeleton className="h-4 w-48"/>
                        </td>
                        <td className="px-4 py-3">
                            <Skeleton className="h-4 w-32"/>
                        </td>
                        <td className="px-4 py-3">
                            <Skeleton className="h-4 w-28"/>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}