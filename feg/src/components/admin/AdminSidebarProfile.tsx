import { UserCircle2 } from "lucide-react";
import type { AdminUser } from "../../data/admin";

type Props = {
    admin: AdminUser | null;
};

export default function AdminSidebarProfile({ admin }: Props) {
    if (!admin) {
        return (
            <div className="text-sm text-white/60">Loading…</div>
        );
    }

    return (
        <div>
            <div className="mb-4 flex items-center gap-3">
                <UserCircle2 className="h-10 w-10 text-white" strokeWidth={1.5} />
                <p className="text-base font-bold text-white">
                    {admin.firstName} {admin.lastName}
                </p>
            </div>

            <div className="space-y-3 text-xs text-white/80">
                <p className="border-b border-white/10 pb-3">Email: {admin.email}</p>
                <p>Role: Administrator</p>
            </div>
        </div>
    );
}