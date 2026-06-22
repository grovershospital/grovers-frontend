import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import {useAuth} from '../../contexts/AuthContext';
import logo from "../../assets/logo.png";
import labacareDb from "../../assets/labacareDb.png";

type Props = {
    onMenuClick: () => void;
};

export default function DashboardTopBar({ onMenuClick }: Props) {
    const {logout} = useAuth();

    function handleLogout() {
        logout();
    }

    return (
        <header className="sticky top-0 z-30 h-16 border-b border-neutral-200 bg-white">
            <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link to="/" className="flex items-center" aria-label="Grover's Hospital">
                    <img src={logo} alt="Grover's Hospital" className="h-12 w-auto" />
                </Link>

                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="inline-flex items-center justify-center rounded-full bg-brand-green px-7 py-2 text-sm cursor-pointer font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
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