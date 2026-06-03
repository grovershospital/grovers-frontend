import { useEffect, useState } from "react";
import Modal from "../../ui/Modal";
import LabResultStatusPill from "./LabResultStatusPill";
import LabComponentEditor from "./LabComponentEditor";
import LabResultFiles from "./LabResultFiles";
import {
    fetchAdminLabResult,
    updateLabResultStatus,
    type AdminLabComponent,
    type AdminLabResultDetail,
    type AdminLabResultFile,
    type AdminLabResultStatus,
} from "../../data/admin";

type Props = {
    open: boolean;
    onClose: () => void;
    resultId: string | null;
    onStatusChanged: (resultId: string, newStatus: AdminLabResultStatus) => void;
};

type Tab = "components" | "files";

export default function LabResultDetailModal({
                                                 open,
                                                 onClose,
                                                 resultId,
                                                 onStatusChanged,
                                             }: Props) {
    const [detail, setDetail] = useState<AdminLabResultDetail | null>(null);
    const [tab, setTab] = useState<Tab>("components");
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        if (open && resultId) {
            setDetail(null);
            setTab("components");
            fetchAdminLabResult(resultId).then(setDetail).catch(() => setDetail(null));
        }
    }, [open, resultId]);

    function handleComponentsChange(components: AdminLabComponent[]) {
        setDetail((d) =>
            d ? { ...d, components, componentCount: components.length } : d,
        );
    }

    function handleFilesChange(files: AdminLabResultFile[]) {
        setDetail((d) => (d ? { ...d, files, fileCount: files.length } : d));
    }

    async function handleStatusToggle() {
        if (!detail) return;
        const newStatus: AdminLabResultStatus =
            detail.status === "Pending" ? "Ready to view" : "Pending";

        if (newStatus === "Ready to view" && detail.components.length === 0) {
            window.alert("Add at least one component before marking as Ready.");
            return;
        }

        setBusy(true);
        try {
            const updated = await updateLabResultStatus(detail.id, newStatus);
            setDetail(updated);
            onStatusChanged(detail.id, newStatus);
        } finally {
            setBusy(false);
        }
    }

    return (
        <Modal open={open} onClose={onClose} title={detail?.title ?? "Lab result"}>
            {!detail ? (
                <p className="text-sm text-neutral-500">Loading…</p>
            ) : (
                <div className="space-y-6">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-500">
                        <span>{detail.testDate || "—"}</span>
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

                    <div className="border-b border-neutral-200">
                        <nav className="-mb-px flex gap-6">
                            <SubTabButton
                                active={tab === "components"}
                                onClick={() => setTab("components")}
                            >
                                Components ({detail.componentCount})
                            </SubTabButton>
                            <SubTabButton
                                active={tab === "files"}
                                onClick={() => setTab("files")}
                            >
                                Files ({detail.fileCount})
                            </SubTabButton>
                        </nav>
                    </div>

                    {tab === "components" ? (
                        <LabComponentEditor
                            resultId={detail.id}
                            components={detail.components}
                            onChange={handleComponentsChange}
                        />
                    ) : (
                        <LabResultFiles
                            resultId={detail.id}
                            files={detail.files}
                            onChange={handleFilesChange}
                        />
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 pt-4">
                        <p className="text-xs text-neutral-500">
                            {detail.status === "Pending"
                                ? "Patient will be notified when you mark this as Ready."
                                : "Patient can view this result."}
                        </p>
                        <button
                            type="button"
                            onClick={handleStatusToggle}
                            disabled={busy}
                            className={`inline-flex items-center justify-center rounded-full px-6 py-2 text-sm font-semibold text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 ${
                                detail.status === "Pending"
                                    ? "bg-brand-green hover:bg-brand-blue focus-visible:outline-brand-green"
                                    : "bg-brand-ink hover:bg-brand-blue focus-visible:outline-brand-ink"
                            }`}
                        >
                            {busy
                                ? "Working…"
                                : detail.status === "Pending"
                                    ? "Mark as Ready"
                                    : "Revert to Pending"}
                        </button>
                    </div>
                </div>
            )}
        </Modal>
    );
}

function SubTabButton({
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