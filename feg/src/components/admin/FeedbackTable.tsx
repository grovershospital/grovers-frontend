import { useState } from "react";
import { Mail, MessageCircle, Phone, ChevronDown } from "lucide-react";
import FeedbackRating from "./FeedbackRating";
import type {
    AdminContactMethod,
    AdminFeedbackEntry,
    AdminFeedbackStatus,
    AdminFeedbackType,
} from "../../data/admin";

type Props = {
    entries: AdminFeedbackEntry[];
    loading: boolean;
    onOpen: (id: string) => Promise<AdminFeedbackEntry>;
    onUpdateStatus: (
        id: string,
        status: AdminFeedbackStatus,
        notes: string,
    ) => Promise<void>;
};

const TYPE_TONE: Record<AdminFeedbackType, string> = {
    Compliment: "bg-brand-green/10 text-brand-green",
    Complaint: "bg-brand-red/10 text-brand-red",
    Suggestion: "bg-brand-blue/10 text-brand-blue",
    "General feedback": "bg-neutral-100 text-neutral-600",
};

const STATUS_TONE: Record<AdminFeedbackStatus, string> = {
    Pending: "bg-amber-100 text-amber-700",
    "Under review": "bg-brand-blue/10 text-brand-blue",
    Reviewed: "bg-neutral-100 text-neutral-700",
    "Response sent": "bg-brand-green/10 text-brand-green",
};

const STATUS_OPTIONS: ReadonlyArray<AdminFeedbackStatus> = [
    "Pending",
    "Under review",
    "Reviewed",
    "Response sent",
];

const CONTACT_ICON: Partial<
    Record<AdminContactMethod, React.ComponentType<{ className?: string }>>
> = {
    Email: Mail,
    Phone: Phone,
    WhatsApp: MessageCircle,
};

export default function FeedbackTable({
                                          entries,
                                          loading,
                                          onOpen,
                                          onUpdateStatus,
                                      }: Props) {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [expandedDetail, setExpandedDetail] = useState<AdminFeedbackEntry | null>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);

    async function toggle(entry: AdminFeedbackEntry) {
        if (expandedId === entry.id) {
            setExpandedId(null);
            setExpandedDetail(null);
            return;
        }
        setExpandedId(entry.id);
        setExpandedDetail(null);
        setLoadingDetail(true);
        try {
            const detail = await onOpen(entry.id);
            setExpandedDetail(detail);
        } catch (error) {
            console.error("Failed to fetch feedback detail:", error);
        } finally {
            setLoadingDetail(false);
        }
    }

    if (loading) {
        return <p className="text-sm text-neutral-500">Loading…</p>;
    }

    if (entries.length === 0) {
        return (
            <p className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500">
                No feedback matches the current filters.
            </p>
        );
    }

    return (
        <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
            <table className="w-full min-w-[800px] border-collapse">
                <thead className="bg-neutral-50">
                <tr className="text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Patient</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Rating</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Read</th>
                    <th className="px-4 py-3" />
                </tr>
                </thead>
                <tbody>
                {entries.map((f) => {
                    const isOpen = expandedId === f.id;
                    return (
                        <FeedbackRow
                            key={f.id}
                            entry={f}
                            isOpen={isOpen}
                            detail={isOpen ? expandedDetail : null}
                            loadingDetail={isOpen && loadingDetail}
                            onToggle={() => toggle(f)}
                            onUpdateStatus={onUpdateStatus}
                        />
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}

// ─── Sub-Components (Moved outside parent to prevent re-renders) ───────────────────

type RowProps = {
    entry: AdminFeedbackEntry;
    isOpen: boolean;
    detail: AdminFeedbackEntry | null;
    loadingDetail: boolean;
    onToggle: () => void;
    onUpdateStatus: (
        id: string,
        status: AdminFeedbackStatus,
        notes: string,
    ) => Promise<void>;
};

function FeedbackRow({
                         entry,
                         isOpen,
                         detail,
                         loadingDetail,
                         onToggle,
                         onUpdateStatus,
                     }: RowProps) {
    const ContactIcon = detail?.contactMethod
        ? CONTACT_ICON[detail.contactMethod]
        : undefined;

    return (
        <>
            <tr
                onClick={onToggle}
                className={`cursor-pointer border-t border-neutral-100 text-sm hover:bg-neutral-50 ${
                    entry.isRead ? "" : "font-medium"
                }`}
            >
                <td className="px-4 py-3 text-brand-ink">{entry.createdAtDisplay}</td>
                <td className="px-4 py-3 font-semibold text-brand-ink">
                    {entry.patientName}
                </td>
                <td className="px-4 py-3">
                    <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${TYPE_TONE[entry.type]}`}
                    >
                        {entry.type}
                    </span>
                </td>
                <td className="px-4 py-3">
                    {entry.rating ? (
                        <FeedbackRating rating={entry.rating} />
                    ) : (
                        <span className="text-xs text-neutral-400">—</span>
                    )}
                </td>
                <td className="px-4 py-3">
                    <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_TONE[entry.status]}`}
                    >
                        {entry.status}
                    </span>
                </td>
                <td className="px-4 py-3">
                    {entry.isRead ? (
                        <span className="text-xs text-neutral-400">Read</span>
                    ) : (
                        <span className="inline-block h-2 w-2 rounded-full bg-brand-red" />
                    )}
                </td>
                <td className="px-4 py-3 text-right text-xs text-neutral-500">
                    {isOpen ? "▲" : "▼"}
                </td>
            </tr>

            {isOpen && (
                <tr className="border-t border-neutral-100 bg-neutral-50">
                    <td colSpan={7} className="px-4 py-5" onClick={(e) => e.stopPropagation()}>
                        {loadingDetail ? (
                            <p className="text-sm text-neutral-500">Loading…</p>
                        ) : !detail ? (
                            <p className="text-sm text-brand-red">
                                Could not load feedback details.
                            </p>
                        ) : (
                            <ExpandedDetail
                                detail={detail}
                                ContactIcon={ContactIcon}
                                onUpdateStatus={onUpdateStatus}
                            />
                        )}
                    </td>
                </tr>
            )}
        </>
    );
}

function ExpandedDetail({
                            detail,
                            ContactIcon,
                            onUpdateStatus,
                        }: {
    detail: AdminFeedbackEntry;
    ContactIcon?: React.ComponentType<{ className?: string }>;
    onUpdateStatus: (
        id: string,
        status: AdminFeedbackStatus,
        notes: string,
    ) => Promise<void>;
}) {
    const [status, setStatus] = useState<AdminFeedbackStatus>(detail.status);
    const [notes, setNotes] = useState(detail.adminInternalNotes || "");
    const [saving, setSaving] = useState(false);

    async function handleSave() {
        setSaving(true);
        try {
            await onUpdateStatus(detail.id, status, notes);
        } catch (error) {
            console.error("Failed to save changes:", error);
        } finally {
            setSaving(false);
        }
    }

    const hasChanges =
        status !== detail.status || notes !== (detail.adminInternalNotes || "");

    return (
        <div className="space-y-5">
            {detail.subject && (
                <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        Subject
                    </p>
                    <p className="text-sm font-semibold text-brand-ink">
                        {detail.subject}
                    </p>
                </div>
            )}

            <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Full message
                </p>
                <p className="text-sm text-brand-ink">{detail.message}</p>
            </div>

            {detail.wantsResponse && detail.contactMethod && (
                <div className="rounded-xl border border-neutral-200 bg-white p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        Patient requested a response via {detail.contactMethod}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                        {ContactIcon && <ContactIcon className="h-4 w-4 text-brand-ink" />}

                        {detail.contactMethod === "Email" && detail.patientEmail && (
                            <a
                                href={`mailto:${detail.patientEmail}`}
                                className="text-brand-ink underline underline-offset-2 hover:no-underline"
                            >
                                {detail.patientEmail}
                            </a>
                        )}

                        {detail.contactMethod === "Phone" && detail.patientPhone && (
                            <a
                                href={`tel:${detail.patientPhone}`}
                                className="text-brand-ink underline underline-offset-2 hover:no-underline"
                            >
                                {detail.patientPhone}
                            </a>
                        )}

                        {detail.contactMethod === "WhatsApp" && detail.patientPhone && (
                            <a
                                href={`https://wa.me/${detail.patientPhone.replace(/[^\d]/g, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-brand-ink underline underline-offset-2 hover:no-underline"
                            >
                                {detail.patientPhone}
                            </a>
                        )}

                        {detail.contactMethod === "Any" && (
                            <span className="text-brand-ink">
                                Patient is open to any contact method.
                            </span>
                        )}
                    </div>
                </div>
            )}

            <div className="rounded-xl border border-neutral-200 bg-white p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Workflow
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-[auto_1fr]">
                    <label
                        htmlFor={`fb-status-${detail.id}`}
                        className="self-center text-sm font-semibold text-brand-ink"
                    >
                        Status
                    </label>
                    <div className="relative">
                        <select
                            id={`fb-status-${detail.id}`}
                            value={status}
                            onChange={(e) => setStatus(e.target.value as AdminFeedbackStatus)}
                            className="w-full appearance-none cursor-pointer rounded-full border border-neutral-300 bg-white py-2 pl-4 pr-10 text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                        >
                            {STATUS_OPTIONS.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                        <ChevronDown
                            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
                            strokeWidth={2}
                        />
                    </div>
                </div>

                <div className="mt-3">
                    <label
                        htmlFor={`fb-notes-${detail.id}`}
                        className="mb-1.5 block text-sm font-semibold text-brand-ink"
                    >
                        Internal notes{" "}
                        <span className="font-normal italic text-neutral-500">
                            (not visible to patient)
                        </span>
                    </label>
                    <textarea
                        id={`fb-notes-${detail.id}`}
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full resize-y rounded-2xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                    />
                </div>

                <div className="mt-4 flex justify-end">
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={!hasChanges || saving}
                        className="inline-flex items-center justify-center rounded-full bg-brand-green px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green disabled:opacity-60"
                    >
                        {saving ? "Saving…" : "Save changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}