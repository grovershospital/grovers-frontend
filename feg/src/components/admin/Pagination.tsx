import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
    page: number;
    total: number;
    pageSize: number;
    onChange: (page: number) => void;
};

export default function Pagination({ page, total, pageSize, onChange }: Props) {
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    if (totalPages <= 1) return null;

    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, total);

    return (
        <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-neutral-500">
                Showing {start}–{end} of {total}
            </p>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => onChange(page - 1)}
                    disabled={page === 1}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 text-brand-ink transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Previous page"
                >
                    <ChevronLeft className="h-4 w-4" strokeWidth={2} />
                </button>
                <span className="text-sm text-brand-ink">
                    Page {page} of {totalPages}
                </span>
                <button
                    type="button"
                    onClick={() => onChange(page + 1)}
                    disabled={page === totalPages}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 text-brand-ink transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Next page"
                >
                    <ChevronRight className="h-4 w-4" strokeWidth={2} />
                </button>
            </div>
        </div>
    );
}