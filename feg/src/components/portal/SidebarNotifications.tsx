import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import {
    fetchNotifications,
    markAllNotificationsRead,
    markNotificationRead,
    type NotificationType,
    type PortalNotification,
} from "../../data/portal";
import { toast } from "sonner";

const EMOJI: Record<NotificationType, string> = {
    "lab-ready": "🔬",
    "appointment-reminder": "📅",
    "appointment-confirmed": "✅",
    "appointment-cancelled": "❌",
    "medical-history": "📋",
    feedback: "💬",
    other: "🔔",
};

const NOTIFICATION_HREF: Record<NotificationType, string> = {
    "lab-ready": "/patient-portal/lab-results",
    "appointment-reminder": "/patient-portal/appointments",
    "appointment-confirmed": "/patient-portal/appointments",
    "appointment-cancelled": "/patient-portal/appointments",
    "medical-history": "/patient-portal/profile",
    feedback: "/patient-portal/feedback",
    other: "/patient-portal/dashboard",
};

type Props = {
    onNavigate?: () => void;
};

export default function SidebarNotifications({ onNavigate }: Props) {
    const [notifications, setNotifications] = useState<PortalNotification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let alive = true;

        fetchNotifications()
            .then((data) => {
                if (!alive) return;

                console.log("Notifications loaded:", data);

                setNotifications(data);
            })
            .finally(() => {
                if (alive) setLoading(false);
            });

        return () => {
            alive = false;
        };
    }, []);

    const unreadCount = notifications.filter((n) => !n.read).length;

    function handleNotificationClick(notification: PortalNotification) {
        console.log("Notification clicked:", {
            id: notification.id,
            type: notification.type,
            hrefFromNotification: notification.href,
            expectedHref: NOTIFICATION_HREF[notification.type],
        });

        if (notification.read) {
            onNavigate?.();
            return;
        }

        const prev = notifications;

        setNotifications((list) =>
            list.map((n) =>
                n.id === notification.id
                    ? { ...n, read: true }
                    : n
            ),
        );

        markNotificationRead(notification.id)
            .catch(() => setNotifications(prev));

        onNavigate?.();
    }

    async function handleMarkAllRead() {
        const prev = notifications;

        setNotifications((list) =>
            list.map((n) => ({ ...n, read: true })),
        );

        try {
            await markAllNotificationsRead();
            toast.success("All notifications marked as read");
        } catch {
            setNotifications(prev);
            toast.error(
                "Could not mark notifications as read. Please try again.",
            );
        }
    }

    return (
        <div>
            <div className="mb-4 flex items-center justify-between">
                <div className="relative flex items-center gap-3">
                    <Bell className="h-5 w-5 text-white" strokeWidth={2} />

                    {unreadCount > 0 && (
                        <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-brand-red px-1 text-[10px] font-bold text-white">
                            {unreadCount}
                        </span>
                    )}

                    <h2 className="text-base font-bold text-white">
                        Notifications
                    </h2>
                </div>

                {unreadCount > 0 && (
                    <button
                        type="button"
                        onClick={handleMarkAllRead}
                        className="text-xs text-white/70 underline underline-offset-2 hover:no-underline hover:text-white"
                    >
                        Mark all read
                    </button>
                )}
            </div>

            {loading ? (
                <p className="text-xs text-white/60">Loading…</p>
            ) : notifications.length === 0 ? (
                <p className="text-xs text-white/60">
                    No notifications yet.
                </p>
            ) : (
                <ul className="space-y-3">
                    {notifications.map((n) => {
                        console.log("Rendering notification:", {
                            id: n.id,
                            type: n.type,
                            hrefFromNotification: n.href,
                            expectedHref: NOTIFICATION_HREF[n.type],
                        });

                        return (
                            <li key={n.id}>
                                <Link
                                    to={NOTIFICATION_HREF[n.type]}
                                    onClick={() => handleNotificationClick(n)}
                                    className={`block text-xs transition-opacity hover:opacity-80 ${
                                        n.read ? "opacity-60" : "opacity-100"
                                    }`}
                                >
                                    <span className="mr-1">
                                        {EMOJI[n.type]}
                                    </span>

                                    <span className="text-white">
                                        {n.message}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}