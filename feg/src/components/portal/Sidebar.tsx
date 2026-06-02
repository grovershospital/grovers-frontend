import SidebarNav from "./SidebarNav";
import SidebarProfile from "./SidebarProfile";
import SidebarNotifications from "./SidebarNotifications";

type Props = {
    /** Called when a nav item is clicked — used to close the drawer on mobile. */
    onNavigate?: () => void;
};

export default function Sidebar({ onNavigate }: Props) {
    return (
        <aside className="h-full overflow-y-auto bg-[#0f1623] px-6 py-8">
            <SidebarNav onNavigate={onNavigate} />
            <SidebarProfile />
            <SidebarNotifications />
        </aside>
    );
}