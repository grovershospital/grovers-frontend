import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
    deleteAdminPackage,
    fetchAdminPackages,
    type AdminPackageSummary,
} from "../../data/admin";

export default function AdminPackages() {
    const navigate = useNavigate();
    const [packages, setPackages] = useState<AdminPackageSummary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let alive = true;
        fetchAdminPackages()
            .then((data) => {
                if (alive) setPackages(data);
            })
            .finally(() => {
                if (alive) setLoading(false);
            });
        return () => {
            alive = false;
        };
    }, []);

    async function handleDelete(pkg: AdminPackageSummary) {
        if (
            !window.confirm(
                `Delete "${pkg.name}"? Tiers, inclusions, and matrix cells will be removed too. This cannot be undone.`,
            )
        )
            return;

        const prev = packages;
        setPackages((list) => list.filter((p) => p.id !== pkg.id));
        try {
            await deleteAdminPackage(pkg.id);
        } catch {
            setPackages(prev);
            window.alert("Could not delete the package. Please try again.");
        }
    }

    return (
        <>
            <div className="mb-10 flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-brand-red sm:text-4xl">
                        Health Packages
                    </h1>
                    <p className="mt-3 max-w-prose text-brand-ink">
                        Manage screening and wellness packages shown on the public
                        Packages page. Edit a package to manage its tiers, inclusions,
                        and the inclusion matrix.
                    </p>
                </div>
                <Link
                    to="/admin/packages/new"
                    className="inline-flex items-center gap-2 rounded-full bg-brand-red px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                >
                    <Plus className="h-4 w-4" strokeWidth={2.5} />
                    New package
                </Link>
            </div>

            {loading ? (
                <p className="text-sm text-neutral-500">Loading…</p>
            ) : packages.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center text-sm text-neutral-500">
                    No packages yet. Create your first one to get started.
                </p>
            ) : (
                <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
                    <table className="w-full min-w-[800px] border-collapse">
                        <thead className="bg-neutral-50">
                        <tr className="text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Department</th>
                            <th className="px-4 py-3">Tiers</th>
                            <th className="px-4 py-3">Inclusions</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Order</th>
                            <th className="px-4 py-3" />
                        </tr>
                        </thead>
                        <tbody>
                        {packages.map((p) => (
                            <tr
                                key={p.id}
                                onClick={() => navigate(`/admin/packages/${p.id}/edit`)}
                                className="cursor-pointer border-t border-neutral-100 text-sm hover:bg-neutral-50"
                            >
                                <td className="px-4 py-3">
                                    <p className="font-semibold text-brand-ink">
                                        {p.name}
                                    </p>
                                    <p className="mt-0.5 font-mono text-xs text-neutral-500">
                                        /{p.slug}
                                    </p>
                                </td>
                                <td className="px-4 py-3 text-brand-ink">
                                    {p.departmentName}
                                </td>
                                <td className="px-4 py-3 text-brand-ink">
                                    {p.tierCount}
                                </td>
                                <td className="px-4 py-3 text-brand-ink">
                                    {p.inclusionCount}
                                </td>
                                <td className="px-4 py-3">
                                        <span
                                            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                                p.isActive
                                                    ? "bg-brand-green/10 text-brand-green"
                                                    : "bg-neutral-100 text-neutral-600"
                                            }`}
                                        >
                                            {p.isActive ? "Active" : "Inactive"}
                                        </span>
                                </td>
                                <td className="px-4 py-3 text-brand-ink">
                                    {p.displayOrder}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex justify-end gap-1">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/admin/packages/${p.id}/edit`);
                                            }}
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 hover:text-brand-ink"
                                            aria-label={`Edit ${p.name}`}
                                        >
                                            <Pencil
                                                className="h-4 w-4"
                                                strokeWidth={2}
                                            />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(p);
                                            }}
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 hover:bg-brand-red/10 hover:text-brand-red"
                                            aria-label={`Delete ${p.name}`}
                                        >
                                            <Trash2
                                                className="h-4 w-4"
                                                strokeWidth={2}
                                            />
                                        </button>
                                    </div>
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