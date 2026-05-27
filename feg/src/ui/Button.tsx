import {type ReactNode} from 'react';

type Variant = "primary" | "light" | "outline" | "red" | "green";

interface ButtonProps {
    children: ReactNode;
    href?: string;
    variant?: Variant;
    className?: string;
    onClick?: () => void;
}

const VARIANTS: Record<Variant, string> = {
    // Blue at rest, green on hover — "Book an appointment"
    primary:
        "bg-brand-blue text-white hover:bg-brand-green focus-visible:ring-brand-blue",
    // Green at rest, blue on hover — "Patient Portal"
    green:
        "bg-brand-green text-white hover:bg-brand-blue focus-visible:ring-brand-green",
    light:
        "bg-white text-brand-ink hover:bg-white/90 focus-visible:ring-white",
    outline:
        "border border-current text-brand-ink hover:bg-brand-ink/5 focus-visible:ring-brand-ink",
    red:
        "bg-brand-red text-white hover:bg-brand-red/90 focus-visible:ring-brand-red",
};

export function Button({
                           children,
                           href,
                           variant = "primary",
                           className = "",
                           onClick,
                       }: ButtonProps) {
    const base =
        "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 " +
        "text-sm font-bold transition-colors duration-200 " +
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

    const classes = `${base} ${VARIANTS[variant]} ${className}`;

    if (href) {
        return (
            <a href={href} className={classes}>
                {children}
            </a>
        )
    }

    return (
        <button type={"button"} onClick={onClick} className={classes}>
            {children}
        </button>
    )
}