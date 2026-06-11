import { useEffect } from "react";
import { X } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
    open: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    /** When true, ignores backdrop clicks and escape key. Use for forms mid-submit. */
    locked?: boolean;
};

export default function Modal({ open, onClose, title, children, locked }: Props) {
    // Close on Escape, unless locked.
    useEffect(() => {
        if (!open || locked) return;
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, locked, onClose]);

    // Lock body scroll while open.
    useEffect(() => {
        if (!open) return;
        const original = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = original;
        };
    }, [open]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onMouseDown={(e) => {
                    if (locked) return;
                    // Only close if the mousedown originated on the backdrop
                    // itself, not bubbled from a child (e.g. a click event
                    // dispatched at coordinates outside the modal after the
                    // OS file picker closes).
                    if (e.target === e.currentTarget) onClose();
                }}
                aria-hidden="true"
            />

            {/* Panel */}
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                className="relative z-10 max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
            >
                <div className="mb-6 flex items-start justify-between gap-4">
                    <h2 id="modal-title" className="text-xl font-bold text-brand-ink">
                        {title}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={locked}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 hover:text-brand-ink disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" strokeWidth={2} />
                    </button>
                </div>

                {children}
            </div>
        </div>
    );
}