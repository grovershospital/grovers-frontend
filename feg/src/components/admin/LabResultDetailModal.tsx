import { useEffect, useState } from "react";
import { Download, FileText } from "lucide-react";
import Modal from "../../ui/Modal";
import LabResultStatusPill from "./LabResultStatusPill";
import {
    downloadLabResultFile,
    fetchAdminLabResult,
    notifyLabResult,
    type AdminLabResultDetail,
    type AdminLabResultStatus,
} from "../../data/admin";
import {toast} from 'sonner';

type Props = {
    open: boolean;
    onClose: () => void;
    resultId: string | null;
    onStatusChanged: (resultId: string, newStatus: AdminLabResultStatus) => void;
};

function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function LabResultDetailModal({
                                                 open,
                                                 onClose,
                                                 resultId,
                                                 onStatusChanged,
                                             }: Props) {
    const [detail, setDetail] = useState<AdminLabResultDetail | null>(null);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        if (open && resultId) {
            setDetail(null);
            fetchAdminLabResult(resultId).then(setDetail).catch(() => setDetail(null));
        }
    }, [open, resultId]);

    async function handleNotify() {
        if (!detail) return;
        if (
            !window.confirm(
                "Notify the patient that this result is ready? They'll receive an email and the result will be visible in their portal.",
            )
        )
            return;

        setBusy(true);
        try {
            const updated = await notifyLabResult(detail.id);
            setDetail(updated);
            onStatusChanged(detail.id, updated.status);
        } catch {
            toast.error("Could not notify the patient.");
        } finally {
            setBusy(false);
        }
    }

    async function handleDownloadFile(fileId: string, filename: string) {
        try {
            await downloadLabResultFile(detail!.id, fileId, filename);
        } catch {
            toast.error("Could not download this file. Please try again.");
        }
    }

    return (
        <Modal open={open} onClose={onClose} title={detail?.title ?? "Lab result"}>
            {!detail ? (
                <p className="text-sm text-neutral-500">Loading…</p>
            ) : (
                <div className="space-y-6">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-500">
                        <span>{detail.testDate}</span>
                        {detail.bookingShortId && (
                            <>
                                <span>·</span>
                                <span className="font-mono">#{detail.bookingShortId}</span>
                            </>
                        )}
                        <span>·</span>
                        <LabResultStatusPill status={detail.status} />
                    </div>

                    {detail.description && (
                        <p className="text-sm text-brand-ink">{detail.description}</p>
                    )}

                    <section>
                        <h3 className="mb-3 text-sm font-bold text-brand-ink">
                            Files ({detail.files.length})
                        </h3>
                        {detail.files.length === 0 ? (
                            <p className="text-sm text-neutral-500">No files attached.</p>
                        ) : (
                            <ul className="space-y-2">
                                {detail.files.map((f) => (
                                    <li
                                        key={f.id}
                                        className="flex items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm"
                                    >
                                        <div className="flex items-center gap-3 truncate">
                                            <FileText
                                                className="h-5 w-5 flex-shrink-0 text-neutral-400"
                                                strokeWidth={2}
                                            />
                                            <div className="min-w-0">
                                                <p className="truncate text-brand-ink">
                                                    {f.originalFileName}
                                                </p>
                                                <p className="text-xs text-neutral-500">
                                                    {formatBytes(f.sizeBytes)}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDownloadFile(f.id, f.originalFileName)
                                            }
                                            className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 hover:text-brand-ink"
                                            aria-label={`Download ${f.originalFileName}`}
                                        >
                                            <Download className="h-4 w-4" strokeWidth={2} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 pt-4">
                        <p className="text-xs text-neutral-500">
                            {detail.status === "Pending"
                                ? "Notify the patient to make this result visible in their portal."
                                : detail.isNotified
                                    ? "Patient has been notified."
                                    : "Patient can view this result."}
                        </p>
                        {detail.status === "Pending" && (
                            <button
                                type="button"
                                onClick={handleNotify}
                                disabled={busy}
                                className="inline-flex items-center justify-center rounded-full bg-brand-green px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green disabled:opacity-60"
                            >
                                {busy ? "Working…" : "Notify patient"}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </Modal>
    );
}