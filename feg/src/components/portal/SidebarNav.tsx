import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
    { to: "/patient-portal/dashboard", label: "Dashboard" },
    { to: "/patient-portal/appointments", label: "Appointments" },
    { to: "/patient-portal/lab-results", label: "Lab Results" },
    { to: "/patient-portal/feedback", label: "Feedback" },
    { to: "/patient-portal/profile", label: "My Profile" },
] as const;

type Props = {
    /** Called when a nav item is clicked — used to close the drawer on mobile. */
    onNavigate?: () => void;
};

export default function SidebarNav({ onNavigate }: Props) {
    return (
        <nav aria-label="Patient portal" className="text-sm">
            <ul className="mt-5 space-y-4 border-b border-white/10 pb-6">
                {NAV_ITEMS.map((item) => (
                    <li key={item.to}>
                        {/* NavLink applies isActive automatically when the URL matches. */}
                        {/* Active state: bold + underlined per the design. */}
                        <NavLink
                            to={item.to}
                            onClick={onNavigate}
                            className={({ isActive }) =>
                                isActive
                                    ? "font-bold text-white underline underline-offset-4"
                                    : "text-white/80 hover:text-white"
                            }
                        >
                            {item.label}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
}