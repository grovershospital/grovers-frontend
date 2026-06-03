import { useState } from "react";
import { Mail, MessageCircle, Phone } from "lucide-react";
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
    onMarkActioned: (id: string) => void;
};

type RowProps = {
    entry: AdminFeedbackEntry;
    isOpen: boolean;
    onToggle: () => void;
    onMarkActioned: () => void;
    ContactIcon?: React.ComponentType<{ className?: string }>;
};

const TYPE_TONE: Record<AdminFeedbackType, string> = {
    Compliment: "bg-brand-green/10 text-brand-green",
    Complaint: "bg-brand-red/10 text-brand-red",
    Suggestion: "bg-brand-blue/10 text-brand-blue",
    "General feedback": "bg-neutral-100 text-neutral-600",
};

const STATUS_TONE: Record<AdminFeedbackStatus, string> = {
    New: "text-brand-red font-semibold",
    Actioned: "text-neutral-500",
};

const CONTACT_ICON: Partial<Record<AdminContactMethod, React.ComponentType<{ className?: string }>>> = {
    Email: Mail,
    Phone: Phone,
    WhatsApp: MessageCircle,
};

export default function FeedbackTable({ entries, loading, onMarkActioned }: Props) {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    function toggle(id: string) {
        setExpandedId((current) => (current === id ? null : id));
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
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3" />
                </tr>
                </thead>
                <tbody>
                {entries.map((f) => {
                    const isOpen = expandedId === f.id;
                    const ContactIcon = CONTACT_ICON[f.contactMethod];

                    return (
                        <FeedbackRow
                            key={f.id}
                            entry={f}
                            isOpen={isOpen}
                            onToggle={() => toggle(f.id)}
                            onMarkActioned={() => onMarkActioned(f.id)}
                            ContactIcon={ContactIcon}
                        />
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}

function FeedbackRow({
                         entry,
                         isOpen,
                         onToggle,
                         onMarkActioned,
                         ContactIcon,
                     }: RowProps) {
    return (
        <>
            <tr
                onClick={onToggle}
                className="cursor-pointer border-t border-neutral-100 text-sm hover:bg-neutral-50"
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
                    <FeedbackRating rating={entry.rating} />
                </td>
                <td className="px-4 py-3 text-brand-ink">{entry.department}</td>
                <td className={`px-4 py-3 italic ${STATUS_TONE[entry.status]}`}>
                    {entry.status}
                </td>
                <td className="px-4 py-3 text-right text-xs text-neutral-500">
                    {isOpen ? "▲" : "▼"}
                </td>
            </tr>
            {isOpen && (
                <tr className="border-t border-neutral-100 bg-neutral-50">
                    <td colSpan={7} className="px-4 py-5">
                        <div className="space-y-4">
                            <div>
                                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                    Full message
                                </p>
                                <p className="text-sm text-brand-ink">{entry.message}</p>
                            </div>

                            {entry.wantsResponse && (
                                <div className="rounded-xl border border-neutral-200 bg-white p-4">
                                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                        Patient requested a response via {entry.contactMethod}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-4 text-sm">
                                        {ContactIcon && (
                                            <ContactIcon className="h-4 w-4 text-brand-ink" />
                                        )}
                                        {entry.contactMethod === "Email" && entry.patientEmail && (
                                            <a
                                                href={`mailto:${entry.patientEmail}`}
                                                className="text-brand-ink underline underline-offset-2 hover:no-underline"
                                            >
                                                {entry.patientEmail}
                                            </a>
                                        )}
                                        {entry.contactMethod === "Phone" && entry.patientPhone && (
                                            <a
                                                href={`tel:${entry.patientPhone}`}
                                                className="text-brand-ink underline underline-offset-2 hover:no-underline"
                                            >
                                                {entry.patientPhone}
                                            </a>
                                        )}
                                        {entry.contactMethod === "WhatsApp" && entry.patientWhatsapp && (
                                            <a
                                                href={`https://wa.me/${entry.patientWhatsapp.replace(/[^\d]/g, "")}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-brand-ink underline underline-offset-2 hover:no-underline"
                                            >
                                                {entry.patientWhatsapp}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}

                            {entry.status === "New" && (
                                <div>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onMarkActioned();
                                        }}
                                        className="inline-flex items-center justify-center rounded-full bg-brand-green px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
                                    >
                                        Mark as Actioned
                                    </button>
                                </div>
                            )}
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}