import { Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import labacareDb from "../../assets/labacareDb.png";

type Props = {
    onMenuClick: () => void;
};

export default function AdminTopBar({ onMenuClick }: Props) {
    const navigate = useNavigate();

    function handleLogout() {
        // TODO (backend): clear admin auth token / session, then navigate.
        //   localStorage.removeItem("accessToken");
        //   localStorage.removeItem("refreshToken");
        //   await api.post("/auth/logout");
        navigate("/admin/login");
    }

    return (
        <header className="sticky top-0 z-30 h-16 border-b border-neutral-200 bg-white">
            <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3">
                    <Link to="/" className="flex items-center" aria-label="Grover's Hospital">
                        <img src={logo} alt="Grover's Hospital" className="h-10 w-auto" />
                    </Link>
                    <span className="rounded-full bg-brand-ink px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
                        Admin
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="inline-flex items-center justify-center rounded-full bg-brand-green px-7 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
                    >
                        Log out
                    </button>

                    <img
                        src={labacareDb}
                        alt="Operated by LABA Care"
                        className="hidden h-8 w-auto sm:block"
                    />

                    <button
                        type="button"
                        onClick={onMenuClick}
                        className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-300 text-brand-ink hover:bg-neutral-100"
                        aria-label="Open menu"
                    >
                        <Menu className="h-5 w-5" strokeWidth={2.5} />
                    </button>
                </div>
            </div>
        </header>
    );
}