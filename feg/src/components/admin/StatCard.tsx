import { Link } from "react-router-dom";
import type { ReactNode } from "react";

type Tone = "red" | "green" | "blue" | "ink";

type Props = {
    label: string;
    count: number;
    to: string;
    tone: Tone;
    icon: ReactNode;
};

const TONE_BORDER: Record<Tone, string> = {
    red: "border-l-brand-red",
    green: "border-l-brand-green",
    blue: "border-l-brand-blue",
    ink: "border-l-brand-ink",
};

const TONE_ICON: Record<Tone, string> = {
    red: "text-brand-red",
    green: "text-brand-green",
    blue: "text-brand-blue",
    ink: "text-brand-ink",
};

export default function StatCard({ label, count, to, tone, icon }: Props) {
    return (
        <Link
            to={to}
            className={`group flex items-start justify-between rounded-2xl border border-neutral-200 border-l-4 bg-white p-6 transition-shadow hover:shadow-md ${TONE_BORDER[tone]}`}
        >
            <div>
                <p className="text-sm font-semibold text-brand-ink">{label}</p>
                <p className="mt-2 text-4xl font-bold text-brand-ink">{count}</p>
                <p className="mt-3 text-xs text-neutral-500 group-hover:text-brand-ink">
                    View all →
                </p>
            </div>
            <div className={TONE_ICON[tone]}>{icon}</div>
        </Link>
    );
}