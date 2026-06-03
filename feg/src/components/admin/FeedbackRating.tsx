import { Star } from "lucide-react";

type Props = {
    rating: number;
    className?: string;
};

export default function FeedbackRating({ rating, className }: Props) {
    return (
        <div className={`flex gap-0.5 ${className ?? ""}`}>
            {[1, 2, 3, 4, 5].map((n) => (
                <Star
                    key={n}
                    className="h-4 w-4 text-amber-400"
                    fill={n <= rating ? "currentColor" : "none"}
                    strokeWidth={1.5}
                    aria-hidden="true"
                />
            ))}
            <span className="sr-only">{rating} of 5 stars</span>
        </div>
    );
}