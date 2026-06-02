import { useState } from "react";
import { Outlet } from "react-router-dom";
import { X } from "lucide-react";
import AdminTopBar from "../components/admin/AdminTopBar";
import AdminSidebar from "../components/admin/AdminSidebar";
import DashboardFooter from "../components/portal/DashboardFooter";

export default function AdminDashboardLayout() {
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <div className="flex min-h-screen flex-col bg-[#f9f7f0]">
            <AdminTopBar onMenuClick={() => setDrawerOpen(true)} />

            <div className="flex flex-1 flex-col lg:grid lg:grid-cols-[1fr_320px]">
                <main className="flex-1 px-4 py-8 sm:px-8 lg:px-12 lg:py-10">
                    <div className="mx-auto max-w-5xl">
                        <Outlet />
                    </div>
                </main>

                <aside className="hidden bg-[#0f1623] lg:block">
                    <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
                        <AdminSidebar />
                    </div>
                </aside>
            </div>

            <DashboardFooter />

            {drawerOpen && (
                <div className="lg:hidden">
                    <div
                        className="fixed inset-0 z-40 bg-black/50"
                        onClick={() => setDrawerOpen(false)}
                        aria-hidden="true"
                    />
                    <aside
                        className="fixed inset-y-0 right-0 z-50 w-[85%] max-w-sm overflow-y-auto bg-[#0f1623] shadow-xl"
                        role="dialog"
                        aria-label="Admin navigation"
                    >
                        <div className="flex items-center justify-end p-4">
                            <button
                                type="button"
                                onClick={() => setDrawerOpen(false)}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white hover:bg-white/10"
                                aria-label="Close menu"
                            >
                                <X className="h-5 w-5" strokeWidth={2.5} />
                            </button>
                        </div>
                        <AdminSidebar onNavigate={() => setDrawerOpen(false)} />
                    </aside>
                </div>
            )}
        </div>
    );
}