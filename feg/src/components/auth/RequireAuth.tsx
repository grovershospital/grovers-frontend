import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth, type Role } from "../../contexts/AuthContext";

type Props = {
    role: Role;
    children: ReactNode;
};

export function RequireAuth({ role, children }: Props) {
    const { user, loading } = useAuth();
    const location = useLocation();

    // While AuthContext is hydrating from localStorage on first mount, hold off
    // on rendering anything — otherwise we'd flash the login page for
    // already-authed users.
    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f9f7f0]">
                <p className="text-sm text-neutral-500">Loading…</p>
            </div>
        );
    }

    if (!user) {
        // Remember where the user was trying to go so we can return them after login.
        const loginPath = role === "ADMIN" ? "/admin/login" : "/patient-portal/login";
        return (
            <Navigate
                to={loginPath}
                replace
                state={{ from: location.pathname + location.search }}
            />
        );
    }

    if (user.role !== role) {
        // Wrong role for this section — send them to their own dashboard.
        const homePath =
            user.role === "ADMIN"
                ? "/admin/dashboard"
                : "/patient-portal/dashboard";
        return <Navigate to={homePath} replace />;
    }

    return <>{children}</>;
}

/**
 * Inverse guard — used on /login, /signup, /admin/login. If the user is already
 * authenticated, send them to their dashboard instead of letting them re-enter
 * credentials.
 */
export function RedirectIfAuthed({ children }: { children: ReactNode }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f9f7f0]">
                <p className="text-sm text-neutral-500">Loading…</p>
            </div>
        );
    }

    if (user) {
        const homePath =
            user.role === "ADMIN"
                ? "/admin/dashboard"
                : "/patient-portal/dashboard";
        return <Navigate to={homePath} replace />;
    }

    return <>{children}</>;
}