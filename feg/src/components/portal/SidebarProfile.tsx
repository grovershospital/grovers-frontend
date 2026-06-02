import { useEffect, useState } from "react";
import { UserCircle2 } from "lucide-react";
import { fetchPortalUser, type PortalUser } from "../../data/portal";

export default function SidebarProfile() {
    const [user, setUser] = useState<PortalUser | null>(null);

    useEffect(() => {
        let cancelled = false;
        fetchPortalUser()
            .then((u) => {
                if (!cancelled) setUser(u);
            })
            .catch((err) => console.error("Failed to load user", err));
        return () => {
            cancelled = true;
        };
    }, []);

    if (!user) {
        // Lightweight skeleton — keeps layout stable while loading.
        return (
            <div className="space-y-3 py-6">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 animate-pulse rounded-full bg-white/10" />
                    <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
                </div>
                <div className="h-3 w-full animate-pulse rounded bg-white/10" />
                <div className="h-3 w-full animate-pulse rounded bg-white/10" />
                <div className="h-3 w-full animate-pulse rounded bg-white/10" />
            </div>
        );
    }

    return (
        <div className="border-b border-white/10 py-6 text-sm text-white">
            {/* Avatar + name */}
            <div className="flex items-center gap-3">
                <UserCircle2 className="h-10 w-10 text-white/80" strokeWidth={1.5} />
                <p className="font-extrabold">
                    {user.firstName} {user.lastName}
                </p>
            </div>

            {/* Contact rows — each with a subtle bottom divider. */}
            <div className="mt-4 space-y-3">
                <p className="border-b border-white/10 pb-3 text-xs">
                    Email: {user.email}
                </p>
                <p className="border-b border-white/10 pb-3 text-xs">
                    Phone: {user.phone}
                </p>
                <p className="text-xs">Member since: {user.memberSince}</p>
            </div>
        </div>
    );
}