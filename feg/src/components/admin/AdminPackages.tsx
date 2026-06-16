import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Plus, Power, PowerOff} from "lucide-react";
import {
    deactivateAdminPackage,
    updateAdminPackage,
    fetchAdminPackage,
    fetchAdminPackages,
    type AdminPackageSummary,
} from "../../data/admin";
import {toast} from "sonner";

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

    async function handleToggleActive(pkg: AdminPackageSummary) {
        const next = !pkg.isActive;
        const verb = next ? "Reactivate" : "Deactivate";
        const message = next
            ? `Reactivate "${pkg.name}"? It will reappear on the public Packages page.`
            : `Deactivate "${pkg.name}"? It will be hidden from the public site. Patients who've already booked it are unaffected.`;

        if (!window.confirm(message)) return;

        // Optimistic flip
        const prev = packages;
        setPackages((list) =>
            list.map((p) => (p.id === pkg.id ? {...p, isActive: next} : p)),
        );

        try {
            if (next) {
                // Reactivate — backend doesn't have a dedicated endpoint, so we
                // PUT a full update with isActive: true. Need to load detail first.
                const detail = await fetchAdminPackage(pkg.id);
                await updateAdminPackage(pkg.id, {
                    name: detail.name,
                    headline: detail.headline,
                    description: detail.description,
                    targetAudience: detail.targetAudience,
                    pricingNote: detail.pricingNote,
                    departmentId: detail.departmentId,
                    displayOrder: detail.displayOrder,
                    isActive: true,
                    headingTone: detail.headingTone,
                    pricingTone: detail.pricingTone,
                });
            } else {
                await deactivateAdminPackage(pkg.id);
            }
            toast.success(`Package ${verb.toLowerCase()}d.`);
        } catch {
            setPackages(prev);
            toast.error(`Could not ${verb.toLowerCase()} the package.`);
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
                    <Plus className="h-4 w-4" strokeWidth={2.5}/>
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
                            <th className="px-4 py-3"/>
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
                                                handleToggleActive(p);
                                            }}
                                            className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 ${
                                                p.isActive
                                                    ? "hover:bg-brand-red/10 hover:text-brand-red"
                                                    : "hover:bg-brand-green/10 hover:text-brand-green"
                                            }`}
                                            aria-label={`${p.isActive ? "Deactivate" : "Reactivate"} ${p.name}`}
                                            title={p.isActive ? "Deactivate" : "Reactivate"}
                                        >
                                            {p.isActive ? (
                                                <PowerOff className="h-4 w-4" strokeWidth={2}/>
                                            ) : (
                                                <Power className="h-4 w-4" strokeWidth={2}/>
                                            )}
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