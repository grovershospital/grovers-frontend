import {useEffect, useState} from "react";
import type {FormEvent} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {ChevronLeft, Pencil, Plus, Trash2, ChevronDown} from "lucide-react";
import PackageTierModal from "../../components/admin/PackageTierModal";
import PackageInclusionModal from "../../components/admin/PackageInclusionModal";
import PackageInclusionMatrix from "../../components/admin/PackageInclusionMatrix";
import {slugify} from "../../lib/slugify";
import {
    PACKAGE_TONES,
    createAdminPackage,
    createPackageInclusion,
    createPackageTier,
    deletePackageInclusion,
    deletePackageTier,
    fetchAdminPackage,
    savePackageCells,
    updateAdminPackage,
    updatePackageInclusion,
    updatePackageTier,
    type AdminPackage,
    type AdminPackageCell,
    type AdminPackageInclusion,
    type AdminPackageTier,
    type PackageInclusionInput,
    type PackageInput,
    type PackageTierInput,
    type PackageTone,
} from "../../data/admin";
import {type Department, fetchDepartments} from '../../data/portal'
import {toast} from 'sonner';

type Tab = "details" | "tiers" | "inclusions" | "matrix";

const EMPTY: PackageInput = {
    name: "",
    headline: "",
    description: "",
    targetAudience: "",
    pricingNote: "",
    departmentId: null,
    displayOrder: 0,
    isActive: true,
    headingTone: "Green",
    pricingTone: "Green",
};

export default function AdminPackageEditor() {
    const {id: routeId} = useParams<{ id: string }>();
    const isEdit = Boolean(routeId);
    const navigate = useNavigate();

    const [pkg, setPkg] = useState<AdminPackage | null>(null);
    const [form, setForm] = useState<PackageInput>(EMPTY);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [tab, setTab] = useState<Tab>("details");
    const [loading, setLoading] = useState(isEdit);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [tierModal, setTierModal] = useState<{
        open: boolean;
        editing: AdminPackageTier | null;
    }>({open: false, editing: null});
    const [inclusionModal, setInclusionModal] = useState<{
        open: boolean;
        editing: AdminPackageInclusion | null;
    }>({open: false, editing: null});

    useEffect(() => {
        fetchDepartments().then(setDepartments).catch(() => setDepartments([]));
    }, []);

    useEffect(() => {
        if (!isEdit || !routeId) return;
        let alive = true;
        setLoading(true);
        fetchAdminPackage(routeId)
            .then((data) => {
                if (!alive) return;
                setPkg(data);
                setForm(packageToInput(data));
            })
            .catch(() => {
                if (alive) setError("Could not load this package.");
            })
            .finally(() => {
                if (alive) setLoading(false);
            });
        return () => {
            alive = false;
        };
    }, [isEdit, routeId]);

    function update<K extends keyof PackageInput>(key: K, value: PackageInput[K]) {
        setForm((f) => ({...f, [key]: value}));
        if (success) setSuccess(false);
    }

    async function handleSaveDetails(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (!form.name.trim()) {
            setError("Package name is required.");
            return;
        }

        setSubmitting(true);
        try {
            if (isEdit && routeId) {
                const updated = await updateAdminPackage(routeId, form);
                setPkg(updated);
                setForm(packageToInput(updated));
                toast.success("Successfully updated package.");
            } else {
                const created = await createAdminPackage(form);
                navigate(`/admin/packages/${created.id}/edit`, {replace: true});
            }
        } catch {
            toast.error("Could not save the package. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    async function handleTierSubmit(input: PackageTierInput) {
        if (!pkg) return;
        if (tierModal.editing) {
            const updated = await updatePackageTier(tierModal.editing.id, input);
            setPkg({
                ...pkg,
                tiers: pkg.tiers
                    .map((t) => (t.id === updated.id ? updated : t))
                    .sort((a, b) => a.displayOrder - b.displayOrder),
                tierCount: pkg.tiers.length,
            });
        } else {
            const created = await createPackageTier(pkg.id, input);
            setPkg({
                ...pkg,
                tiers: [...pkg.tiers, created].sort(
                    (a, b) => a.displayOrder - b.displayOrder,
                ),
                tierCount: pkg.tiers.length + 1,
            });
        }
    }

    async function handleTierDelete(tier: AdminPackageTier) {
        if (!pkg) return;
        if (!window.confirm(`Delete "${tier.name}" tier?`)) return;
        const prev = pkg;
        setPkg({
            ...pkg,
            tiers: pkg.tiers.filter((t) => t.id !== tier.id),
            cells: pkg.cells.filter((c) => c.tierId !== tier.id),
            tierCount: pkg.tiers.length - 1,
        });
        try {
            await deletePackageTier(tier.id);
            toast.success("Tier deleted")
        } catch {
            setPkg(prev);
            toast.error("Could not delete the tier")
        }
    }

    async function handleInclusionSubmit(input: PackageInclusionInput) {
        if (!pkg) return;
        if (inclusionModal.editing) {
            const updated = await updatePackageInclusion(
                inclusionModal.editing.id,
                input,
            );
            setPkg({
                ...pkg,
                inclusions: pkg.inclusions
                    .map((i) => (i.id === updated.id ? updated : i))
                    .sort((a, b) => a.displayOrder - b.displayOrder),
                inclusionCount: pkg.inclusions.length,
            });
        } else {
            const created = await createPackageInclusion(pkg.id, input);
            setPkg({
                ...pkg,
                inclusions: [...pkg.inclusions, created].sort(
                    (a, b) => a.displayOrder - b.displayOrder,
                ),
                inclusionCount: pkg.inclusions.length + 1,
            });
        }
    }

    async function handleInclusionDelete(inclusion: AdminPackageInclusion) {
        if (!pkg) return;
        if (!window.confirm(`Delete "${inclusion.label}"?`)) return;
        const prev = pkg;
        setPkg({
            ...pkg,
            inclusions: pkg.inclusions.filter((i) => i.id !== inclusion.id),
            cells: pkg.cells.filter((c) => c.inclusionId !== inclusion.id),
            inclusionCount: pkg.inclusions.length - 1,
        });
        try {
            await deletePackageInclusion(inclusion.id);
            toast.success("Inclusion deleted")
        } catch {
            setPkg(prev);
            toast.error("Could not delete the inclusion.");
        }
    }

    async function handleMatrixSave(cells: AdminPackageCell[]) {
        if (!pkg) return;
        try {
            await savePackageCells(pkg.id, cells);
            setPkg({...pkg, cells});
            toast.success("Matrix saved.");
        } catch {
            toast.error("Could not save the matrix.");
            throw new Error("matrix save failed");  // so the matrix component re-enables save button
        }
    }

    if (loading) {
        return (
            <>
                <BackLink/>
                <p className="text-sm text-neutral-500">Loading…</p>
            </>
        );
    }

    if (error && !pkg && isEdit) {
        return (
            <>
                <BackLink/>
                <p className="text-sm text-brand-red">{error}</p>
            </>
        );
    }

    const slugPreview = pkg?.slug ?? slugify(form.name);

    return (
        <>
            <BackLink/>

            <div className="mb-8 flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h1 className="text-3xl font-bold text-brand-ink sm:text-4xl">
                        {isEdit ? pkg?.name || "Edit package" : "New package"}
                    </h1>
                    {isEdit && (
                        <p className="mt-1 font-mono text-xs text-neutral-500">
                            /packages/{slugPreview}
                        </p>
                    )}
                </div>
            </div>

            {isEdit && pkg && (
                <div className="mb-8 border-b border-neutral-200">
                    <nav className="-mb-px flex flex-wrap gap-6">
                        <TabButton
                            active={tab === "details"}
                            onClick={() => setTab("details")}
                        >
                            Details
                        </TabButton>
                        <TabButton
                            active={tab === "tiers"}
                            onClick={() => setTab("tiers")}
                        >
                            Tiers ({pkg.tierCount})
                        </TabButton>
                        <TabButton
                            active={tab === "inclusions"}
                            onClick={() => setTab("inclusions")}
                        >
                            Inclusions ({pkg.inclusionCount})
                        </TabButton>
                        <TabButton
                            active={tab === "matrix"}
                            onClick={() => setTab("matrix")}
                        >
                            Matrix
                        </TabButton>
                    </nav>
                </div>
            )}

            {(!isEdit || tab === "details") && (
                <form onSubmit={handleSaveDetails} className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field label="Name" htmlFor="pkg-name" required>
                            <input
                                id="pkg-name"
                                type="text"
                                required
                                placeholder="e.g. Annual Wellness Test"
                                value={form.name}
                                onChange={(e) => update("name", e.target.value)}
                                className={inputClass}
                            />
                            <p className="mt-1 text-xs text-neutral-500">
                                Internal name. Slug auto-generated from this.
                            </p>
                        </Field>

                        <div className={'relative'}>
                            <Field label="Department" htmlFor="pkg-dept">
                                <select
                                    id="pkg-dept"
                                    value={form.departmentId ?? ""}
                                    onChange={(e) =>
                                        update("departmentId", e.target.value || null)
                                    }
                                    className={`${inputClass} appearance-none cursor-pointer`}
                                >
                                    <option value="">—</option>
                                    {departments.map((d) => (
                                        <option key={d.id} value={d.id}>
                                            {d.name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown
                                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
                                    strokeWidth={2}
                                />
                            </Field>
                        </div>

                    </div>

                    <Field label="Headline" htmlFor="pkg-headline">
                        <input
                            id="pkg-headline"
                            type="text"
                            placeholder="e.g. A full picture of your health, once a year."
                            value={form.headline}
                            onChange={(e) => update("headline", e.target.value)}
                            className={inputClass}
                        />
                        <p className="mt-1 text-xs text-neutral-500">
                            Big public-facing tagline. Shown above the description.
                        </p>
                    </Field>

                    <Field label="Description" htmlFor="pkg-description">
                        <textarea
                            id="pkg-description"
                            rows={5}
                            placeholder={`Markdown supported. Use **bold** to highlight spotlight phrases like \`**The Annual Wellness Test**\` — they'll render in brand green on the public page.`}
                            value={form.description}
                            onChange={(e) => update("description", e.target.value)}
                            className={inputClass}
                        />
                    </Field>

                    <Field label="Target audience" htmlFor="pkg-audience">
                        <textarea
                            id="pkg-audience"
                            rows={2}
                            placeholder="e.g. Restaurants, hotels, catering businesses and any establishment employing food handlers."
                            value={form.targetAudience}
                            onChange={(e) =>
                                update("targetAudience", e.target.value)
                            }
                            className={inputClass}
                        />
                    </Field>

                    <Field label="Pricing note" htmlFor="pkg-pricing-note">
                        <textarea
                            id="pkg-pricing-note"
                            rows={3}
                            placeholder="e.g. Female pricing is higher in most tiers due to inclusion of Mammogram, Breast Scan and PAP Smear."
                            value={form.pricingNote}
                            onChange={(e) =>
                                update("pricingNote", e.target.value)
                            }
                            className={inputClass}
                        />
                        <p className="mt-1 text-xs text-neutral-500">
                            Short note shown below the pricing table on the public page. Use it to explain pricing logic
                            or call out important inclusions.
                        </p>
                    </Field>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <Field label="Heading tone" htmlFor="pkg-h-tone">
                            <select
                                id="pkg-h-tone"
                                value={form.headingTone}
                                onChange={(e) =>
                                    update(
                                        "headingTone",
                                        e.target.value as PackageTone,
                                    )
                                }
                                className={inputClass}
                            >
                                {PACKAGE_TONES.map((t) => (
                                    <option key={t} value={t}>
                                        {t}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Pricing tone" htmlFor="pkg-p-tone">
                            <select
                                id="pkg-p-tone"
                                value={form.pricingTone}
                                onChange={(e) =>
                                    update(
                                        "pricingTone",
                                        e.target.value as PackageTone,
                                    )
                                }
                                className={inputClass}
                            >
                                {PACKAGE_TONES.map((t) => (
                                    <option key={t} value={t}>
                                        {t}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Display order" htmlFor="pkg-order">
                            <input
                                id="pkg-order"
                                type="number"
                                min="0"
                                value={form.displayOrder}
                                onChange={(e) =>
                                    update("displayOrder", Number(e.target.value))
                                }
                                className={inputClass}
                            />
                        </Field>
                    </div>

                    <label className="flex items-center gap-2 text-sm text-brand-ink">
                        <input
                            type="checkbox"
                            checked={form.isActive}
                            onChange={(e) => update("isActive", e.target.checked)}
                            className="h-4 w-4 rounded border-neutral-300 text-brand-red focus:ring-brand-blue"
                        />
                        Active — shown on the public Packages page
                    </label>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex items-center justify-center rounded-full bg-brand-red px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red disabled:opacity-60"
                        >
                            {submitting
                                ? "Saving…"
                                : isEdit
                                    ? "Save changes"
                                    : "Create package"}
                        </button>
                    </div>
                </form>
            )}

            {isEdit && pkg && tab === "tiers" && (
                <SubResourceTable
                    title="Tiers"
                    emptyText="No tiers yet. Add Basic, Standard, Deluxe etc. here."
                    addLabel="Add tier"
                    onAdd={() => setTierModal({open: true, editing: null})}
                    rows={pkg.tiers.map((t) => ({
                        key: t.id,
                        cells: [
                            <span className="font-semibold text-brand-ink">
                                {t.name}
                            </span>,
                            <span className="text-brand-ink">
                                ₦{t.priceMale.toLocaleString()}
                            </span>,
                            <span className="text-brand-ink">
                                ₦{t.priceFemale.toLocaleString()}
                            </span>,
                            <span className="text-xs text-neutral-500 line-clamp-1">
                                {t.notes || "—"}
                            </span>,
                            <span className="text-brand-ink">{t.displayOrder}</span>,
                        ],
                        onEdit: () => setTierModal({open: true, editing: t}),
                        onDelete: () => handleTierDelete(t),
                    }))}
                    headers={["Name", "Price ♂", "Price ♀", "Notes", "Order"]}
                />
            )}

            {isEdit && pkg && tab === "inclusions" && (
                <SubResourceTable
                    title="Inclusions"
                    emptyText="No inclusions yet. Add the tests or services this package covers."
                    addLabel="Add inclusion"
                    onAdd={() =>
                        setInclusionModal({open: true, editing: null})
                    }
                    rows={pkg.inclusions.map((i) => ({
                        key: i.id,
                        cells: [
                            <span className="font-semibold text-brand-ink">
                                {i.label}
                            </span>,
                            <span className="text-xs text-neutral-500 line-clamp-1">
                                {i.description || "—"}
                            </span>,
                            <span className="text-brand-ink">{i.displayOrder}</span>,
                        ],
                        onEdit: () =>
                            setInclusionModal({open: true, editing: i}),
                        onDelete: () => handleInclusionDelete(i),
                    }))}
                    headers={["Label", "Description", "Order"]}
                />
            )}

            {isEdit && pkg && tab === "matrix" && (
                <PackageInclusionMatrix
                    tiers={pkg.tiers}
                    inclusions={pkg.inclusions}
                    initialCells={pkg.cells}
                    onSave={handleMatrixSave}
                />
            )}

            <PackageTierModal
                open={tierModal.open}
                onClose={() => setTierModal({open: false, editing: null})}
                tier={tierModal.editing}
                onSubmit={handleTierSubmit}
                defaultDisplayOrder={pkg ? pkg.tiers.length + 1 : 1}
            />

            <PackageInclusionModal
                open={inclusionModal.open}
                onClose={() =>
                    setInclusionModal({open: false, editing: null})
                }
                inclusion={inclusionModal.editing}
                onSubmit={handleInclusionSubmit}
                defaultDisplayOrder={pkg ? pkg.inclusions.length + 1 : 1}
            />
        </>
    );
}

function packageToInput(p: AdminPackage): PackageInput {
    return {
        name: p.name,
        headline: p.headline,
        description: p.description,
        targetAudience: p.targetAudience,
        pricingNote: p.pricingNote,
        departmentId: p.departmentId,
        displayOrder: p.displayOrder,
        isActive: p.isActive,
        headingTone: p.headingTone,
        pricingTone: p.pricingTone,
    };
}

function BackLink() {
    return (
        <Link
            to="/admin/packages"
            className="mb-6 inline-flex items-center gap-1 text-sm text-brand-ink hover:text-brand-blue"
        >
            <ChevronLeft className="h-4 w-4" strokeWidth={2}/>
            All packages
        </Link>
    );
}

function TabButton({
                       active,
                       onClick,
                       children,
                   }: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`whitespace-nowrap border-b-2 px-1 py-3 text-sm transition-colors ${
                active
                    ? "border-brand-red font-semibold text-brand-ink"
                    : "border-transparent text-neutral-500 hover:border-neutral-300 hover:text-brand-ink"
            }`}
        >
            {children}
        </button>
    );
}

type SubResourceRow = {
    key: string;
    cells: React.ReactNode[];
    onEdit: () => void;
    onDelete: () => void;
};

function SubResourceTable({
                              title,
                              emptyText,
                              addLabel,
                              headers,
                              rows,
                              onAdd,
                          }: {
    title: string;
    emptyText: string;
    addLabel: string;
    headers: string[];
    rows: SubResourceRow[];
    onAdd: () => void;
}) {
    return (
        <section>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-base font-bold text-brand-ink">{title}</h2>
                <button
                    type="button"
                    onClick={onAdd}
                    className="inline-flex items-center gap-2 rounded-full bg-brand-red px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                >
                    <Plus className="h-4 w-4" strokeWidth={2.5}/>
                    {addLabel}
                </button>
            </div>

            {rows.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center text-sm text-neutral-500">
                    {emptyText}
                </p>
            ) : (
                <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
                    <table className="w-full min-w-[600px] border-collapse">
                        <thead className="bg-neutral-50">
                        <tr className="text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                            {headers.map((h) => (
                                <th key={h} className="px-4 py-3">
                                    {h}
                                </th>
                            ))}
                            <th className="px-4 py-3"/>
                        </tr>
                        </thead>
                        <tbody>
                        {rows.map((r) => (
                            <tr
                                key={r.key}
                                className="border-t border-neutral-100 text-sm"
                            >
                                {r.cells.map((c, i) => (
                                    <td key={i} className="px-4 py-3 align-top">
                                        {c}
                                    </td>
                                ))}
                                <td className="px-4 py-3">
                                    <div className="flex justify-end gap-1">
                                        <button
                                            type="button"
                                            onClick={r.onEdit}
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 hover:text-brand-ink"
                                            aria-label="Edit"
                                        >
                                            <Pencil
                                                className="h-4 w-4"
                                                strokeWidth={2}
                                            />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={r.onDelete}
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 hover:bg-brand-red/10 hover:text-brand-red"
                                            aria-label="Delete"
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
        </section>
    );
}

const inputClass =
    "w-full rounded-2xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue";

function Field({
                   label,
                   htmlFor,
                   required,
                   children,
               }: {
    label: string;
    htmlFor: string;
    required?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label
                htmlFor={htmlFor}
                className="mb-1.5 block text-sm font-semibold text-brand-ink"
            >
                {label}
                {required && <span className="ml-1 text-brand-red">*</span>}
            </label>
            {children}
        </div>
    );
}