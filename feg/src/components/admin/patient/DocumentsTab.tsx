import { useEffect, useMemo, useState } from "react";
import { Download, Plus, Trash2 } from "lucide-react";
import DocumentUploadModal from "../../../components/admin/DocumentUploadModal";
import { useAdminPatient } from "../../../contexts/AdminPatientContext";
import {
    CATEGORY_LABEL,
    DOCUMENT_CATEGORIES,
    deleteAdminDocument,
    downloadAdminDocument,
    fetchAdminDocuments,
    type AdminDocument,
    type DocumentCategory,
    type DocumentUploaderType,
} from "../../../data/admin";

function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

const UPLOADER_TONE: Record<DocumentUploaderType, string> = {
    ADMIN: "bg-brand-blue/10 text-brand-blue",
    PATIENT: "bg-neutral-200 text-neutral-700",
};

const UPLOADER_LABEL: Record<DocumentUploaderType, string> = {
    ADMIN: "Admin",
    PATIENT: "Patient",
};

export default function DocumentsTab() {
    const patient = useAdminPatient();

    const [documents, setDocuments] = useState<AdminDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploadOpen, setUploadOpen] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState<DocumentCategory | "all">(
        "all",
    );

    function loadDocuments() {
        let alive = true;
        setLoading(true);
        fetchAdminDocuments(patient.id)
            .then((data) => {
                if (alive) setDocuments(data);
            })
            .finally(() => {
                if (alive) setLoading(false);
            });
        return () => {
            alive = false;
        };
    }

    useEffect(() => {
        return loadDocuments();
    }, [patient.id]);

    const filtered = useMemo(() => {
        if (categoryFilter === "all") return documents;
        return documents.filter((d) => d.category === categoryFilter);
    }, [documents, categoryFilter]);

    async function handleDownload(doc: AdminDocument) {
        try {
            await downloadAdminDocument(doc.id);
        } catch {
            window.alert("Could not download this document. Please try again.");
        }
    }

    async function handleDelete(doc: AdminDocument) {
        if (!window.confirm(`Delete "${doc.title}"? This cannot be undone.`)) return;

        const prev = documents;
        setDocuments((list) => list.filter((d) => d.id !== doc.id));
        try {
            await deleteAdminDocument(doc.id);
        } catch {
            setDocuments(prev);
            window.alert("Could not delete the document. Please try again.");
        }
    }

    return (
        <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-brand-ink">Documents</h2>
                    <p className="mt-1 text-sm text-neutral-500">
                        Insurance cards, external reports, referrals and other documents for
                        this patient.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setUploadOpen(true)}
                    className="inline-flex items-center gap-2 rounded-full bg-brand-red px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                >
                    <Plus className="h-4 w-4" strokeWidth={2.5} />
                    Upload document
                </button>
            </div>

            <div className="mb-6">
                <select
                    value={categoryFilter}
                    onChange={(e) =>
                        setCategoryFilter(e.target.value as DocumentCategory | "all")
                    }
                    className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                >
                    <option value="all">All categories</option>
                    {DOCUMENT_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                            {CATEGORY_LABEL[c]}
                        </option>
                    ))}
                </select>
            </div>

            {loading ? (
                <p className="text-sm text-neutral-500">Loading…</p>
            ) : filtered.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center text-sm text-neutral-500">
                    {documents.length === 0
                        ? "No documents uploaded yet."
                        : "No documents match the current filter."}
                </p>
            ) : (
                <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
                    <table className="w-full min-w-[800px] border-collapse">
                        <thead className="bg-neutral-50">
                        <tr className="text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                            <th className="px-4 py-3">Title</th>
                            <th className="px-4 py-3">Category</th>
                            <th className="px-4 py-3">Uploaded by</th>
                            <th className="px-4 py-3">Size</th>
                            <th className="px-4 py-3">Uploaded</th>
                            <th className="px-4 py-3" />
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.map((d) => (
                            <tr
                                key={d.id}
                                onClick={() => handleDownload(d)}
                                className="cursor-pointer border-t border-neutral-100 text-sm hover:bg-neutral-50"
                            >
                                <td className="px-4 py-3">
                                    <p className="font-semibold text-brand-ink">
                                        {d.title}
                                    </p>
                                    <p className="mt-0.5 text-xs text-neutral-500">
                                        {d.originalFileName}
                                    </p>
                                </td>
                                <td className="px-4 py-3 text-brand-ink">
                                        <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold text-neutral-700">
                                            {CATEGORY_LABEL[d.category]}
                                        </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex flex-col gap-1">
                                            <span
                                                className={`inline-flex w-fit items-center rounded-full px-2 py-0.5 text-xs font-semibold ${UPLOADER_TONE[d.uploaderType]}`}
                                            >
                                                {UPLOADER_LABEL[d.uploaderType]}
                                            </span>
                                        <span className="text-xs text-neutral-500">
                                                {d.uploadedByName}
                                            </span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-brand-ink">
                                    {formatBytes(d.sizeBytes)}
                                </td>
                                <td className="px-4 py-3 text-xs text-neutral-500">
                                    {d.uploadedAtDisplay}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex justify-end gap-1">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDownload(d);
                                            }}
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 hover:text-brand-ink"
                                            aria-label={`Download ${d.title}`}
                                        >
                                            <Download
                                                className="h-4 w-4"
                                                strokeWidth={2}
                                            />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(d);
                                            }}
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 hover:bg-brand-red/10 hover:text-brand-red"
                                            aria-label={`Delete ${d.title}`}
                                        >
                                            <Trash2 className="h-4 w-4" strokeWidth={2} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            <DocumentUploadModal
                open={uploadOpen}
                onClose={() => setUploadOpen(false)}
                patientId={patient.id}
                onUploaded={loadDocuments}
            />
        </>
    );
}