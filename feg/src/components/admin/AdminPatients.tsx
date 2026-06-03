import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import PatientsTable from "../../components/admin/PatientsTable";
import Pagination from "../../components/admin/Pagination";
import {
    fetchAdminPatients,
    type AdminPatientSummary,
} from "../../data/admin";

const PAGE_SIZE = 10;

export default function AdminPatients() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [patients, setPatients] = useState<AdminPatientSummary[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setPage(1);
    }, [search]);

    useEffect(() => {
        let alive = true;
        setLoading(true);
        fetchAdminPatients(search, page, PAGE_SIZE)
            .then((res) => {
                if (!alive) return;
                setPatients(res.entries);
                setTotal(res.total);
            })
            .finally(() => {
                if (alive) setLoading(false);
            });
        return () => {
            alive = false;
        };
    }, [search, page]);

    return (
        <>
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-brand-red sm:text-4xl">Patients</h1>
                <p className="mt-3 max-w-prose text-brand-ink">
                    Browse, search and manage patient records. Click a patient to view their
                    health profile, medications, visits and more.
                </p>
            </div>

            <div className="mb-8">
                <div className="relative max-w-md">
                    <Search
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                        strokeWidth={2}
                    />
                    <input
                        type="search"
                        placeholder="Search by name, email or phone…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-full border border-neutral-300 bg-white py-2 pl-10 pr-4 text-sm text-brand-ink placeholder:text-neutral-400 focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                    />
                </div>
            </div>

            <PatientsTable patients={patients} loading={loading} />

            <Pagination
                page={page}
                total={total}
                pageSize={PAGE_SIZE}
                onChange={setPage}
            />
        </>
    );
}