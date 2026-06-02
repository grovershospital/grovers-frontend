import { useEffect, useState } from "react";
import AdminSidebarNav from "./AdminSidebarNav";
import AdminSidebarProfile from "./AdminSidebarProfile";
import { fetchAdminUser, type AdminUser } from "../../data/admin";

type Props = {
    onNavigate?: () => void;
};

export default function AdminSidebar({ onNavigate }: Props) {
    const [admin, setAdmin] = useState<AdminUser | null>(null);

    useEffect(() => {
        let alive = true;
        fetchAdminUser().then((data) => {
            if (alive) setAdmin(data);
        });
        return () => {
            alive = false;
        };
    }, []);

    return (
        <div className="space-y-10 p-6">
            <AdminSidebarNav onNavigate={onNavigate} />
            <AdminSidebarProfile admin={admin} />
        </div>
    );
}