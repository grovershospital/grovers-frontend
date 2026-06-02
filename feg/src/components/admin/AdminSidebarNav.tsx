import { NavLink } from "react-router-dom";

const ITEMS = [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/appointments", label: "Appointments" },
    { to: "/admin/lab-results", label: "Lab Results" },
    { to: "/admin/patients", label: "Patient Records" },
    { to: "/admin/feedback", label: "Feedback" },
    { to: "/admin/articles", label: "Articles" },
];

type Props = {
    onNavigate?: () => void;
};

export default function AdminSidebarNav({ onNavigate }: Props) {
    return (
        <nav>
            <h2 className="mb-4 text-base font-bold text-white">Navigation</h2>
            <ul className="space-y-3">
                {ITEMS.map((item) => (
                    <li key={item.to}>
                        <NavLink
                            to={item.to}
                            onClick={onNavigate}
                            className={({ isActive }) =>
                                `block text-sm transition-colors ${
                                    isActive
                                        ? "font-bold text-white underline underline-offset-4"
                                        : "text-white/80 hover:text-white"
                                }`
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