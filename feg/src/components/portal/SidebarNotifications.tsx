import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import {
    fetchNotifications,
    type NotificationType,
    type PortalNotification,
} from "../../data/portal";

// Emoji prefix per notification type — matches the design exactly.
// Using emoji rather than lucide icons because the design uses them, and
// they render identically without needing colored container backgrounds.
const TYPE_EMOJI: Record<NotificationType, string> = {
    "lab-ready": "🔔",
    "appointment-reminder": "📅",
    "appointment-confirmed": "✅",
    "appointment-cancelled": "❌",
    "medical-history": "📋",
    feedback: "💬",
};

export default function SidebarNotifications() {
    const [notifications, setNotifications] = useState<PortalNotification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        fetchNotifications()
            .then((n) => {
                if (!cancelled) setNotifications(n);
            })
            .catch((err) => console.error("Failed to load notifications", err))
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <div className="py-6 text-sm text-white">
            {/* Header — bell + label, with unread count badge. */}
            <div className="flex items-center gap-2">
                <div className="relative">
                    <Bell className="h-5 w-5" strokeWidth={2} />
                    {unreadCount > 0 && (
                        <span
                            className="absolute -right-1.5 -top-1.5 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-brand-red px-1 text-[10px] font-bold leading-none text-white"
                            aria-label={`${unreadCount} unread`}
                        >
              {unreadCount}
            </span>
                    )}
                </div>
                <h2 className="text-base font-extrabold">Notifications</h2>
            </div>

            <ul className="mt-5 space-y-4">
                {loading
                    ? Array.from({ length: 3 }).map((_, i) => (
                        <li key={i} className="h-8 animate-pulse rounded bg-white/10" />
                    ))
                    : notifications.map((notification) => (
                        <li
                            key={notification.id}
                            className="flex items-start gap-2 text-xs leading-relaxed"
                        >
                <span aria-hidden="true" className="mt-0.5 shrink-0">
                  {TYPE_EMOJI[notification.type]}
                </span>
                            <p>
                                {/* "rebook here" within the cancellation message — special- */}
                                {/* cased so the link is interactive. All other notifications */}
                                {/* are display-only for now per the spec. */}
                                {notification.type === "appointment-cancelled" ? (
                                    <>
                                        {notification.message}{" "}
                                        <a
                                            href="/patient-portal/appointments"
                                            className="underline underline-offset-2 hover:text-white/80"
                                        >
                                            rebook here
                                        </a>
                                    </>
                                ) : (
                                    notification.message
                                )}
                            </p>
                        </li>
                    ))}
            </ul>
        </div>
    );
}