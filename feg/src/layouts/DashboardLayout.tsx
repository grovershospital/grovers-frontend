import { useState } from "react";
import { Outlet } from "react-router-dom";
import { X } from "lucide-react";
import DashboardTopBar from "../components/portal/DashboardTopBar";
import Sidebar from "../components/portal/Sidebar";

export default function DashboardLayout() {
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#f9f7f0]">
            {/* TopBar runs full width across both columns, sticky at the top. */}
            <DashboardTopBar onMenuClick={() => setDrawerOpen(true)} />

            {/* 2-column grid sits BELOW the topbar. */}
            <div className="lg:grid lg:grid-cols-[1fr_320px]">
                <main className="px-4 py-8 sm:px-8 lg:px-12 lg:py-10">
                    {/* max-w + mx-auto centers the content within the left column. */}
                    <div className="mx-auto max-w-4xl">
                        <Outlet />
                    </div>
                </main>

                {/* Sidebar — sticky just below the topbar. */}
                {/* top-16 matches the topbar's h-16 so it sits flush with its bottom edge. */}
                {/* h-[calc(100vh-4rem)] fills the remaining viewport height. */}
                <aside className="hidden bg-[#0f1623] lg:sticky lg:top-16 lg:block lg:h-[calc(100vh-4rem)] lg:overflow-y-auto">
                    <Sidebar />
                </aside>
            </div>

            {/* Mobile drawer — unchanged. */}
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
                        aria-label="Portal navigation"
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
                        <div className="px-6 pb-8">
                            <Sidebar onNavigate={() => setDrawerOpen(false)} />
                        </div>
                    </aside>
                </div>
            )}
        </div>
    );
}