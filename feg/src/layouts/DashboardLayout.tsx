import { useState } from "react";
import { Outlet } from "react-router-dom";
import { X } from "lucide-react";
import DashboardTopBar from "../components/portal/DashboardTopBar";
import DashboardFooter from "../components/portal/DashboardFooter";
import Sidebar from "../components/portal/Sidebar";

export default function DashboardLayout() {
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <div className="flex min-h-screen flex-col bg-[#f9f7f0]">
            <DashboardTopBar onMenuClick={() => setDrawerOpen(true)} />

            {/* Shell stretches to fill space between topbar and footer:                  */}
            {/*   - mobile: flex column, `main` inside is flex-1 so it pushes footer down */}
            {/*   - desktop: 2-col grid, both columns stretch to the shell's height       */}
            <div className="flex flex-1 flex-col lg:grid lg:grid-cols-[1fr_320px]">
                <main className="flex-1 px-4 py-8 sm:px-8 lg:px-12 lg:py-10">
                    <div className="mx-auto max-w-4xl">
                        <Outlet />
                    </div>
                </main>

                {/* Dark bg lives on the outer <aside> which stretches to fill the grid */}
                {/* track — so the right column is always dark even on short pages.     */}
                {/* The inner sticky div handles pinning + viewport-height sizing for   */}
                {/* long pages where the sidebar needs to scroll independently.         */}
                <aside className="hidden bg-[#0f1623] lg:block">
                    <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
                        <Sidebar />
                    </div>
                </aside>
            </div>

            <DashboardFooter />

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