import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import type { ReactNode } from "react";
import { api, onAuthFailure, tokenStore } from "../lib/api";
import { decodeJwtPayload, isTokenExpired } from "../lib/jwt";

export type Role = "PATIENT" | "ADMIN";

export type AuthUser = {
    id: string;
    role: Role;
};

type AuthContextValue = {
    user: AuthUser | null;
    loading: boolean;             // true during initial hydration from localStorage
    loginPatient: (email: string, password: string) => Promise<void>;
    loginAdmin: (email: string, password: string) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type LoginResponse = {
    accessToken: string;
    refreshToken: string;
};

function userFromToken(token: string): AuthUser | null {
    const payload = decodeJwtPayload(token);
    if (!payload?.sub || !payload?.role) return null;
    const role = payload.role as Role;
    if (role !== "PATIENT" && role !== "ADMIN") return null;
    return { id: payload.sub, role };
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    // Hydrate from localStorage on mount.
    useEffect(() => {
        const token = tokenStore.getAccess();
        if (token && !isTokenExpired(token)) {
            const decoded = userFromToken(token);
            if (decoded) setUser(decoded);
            else tokenStore.clear();
        } else if (token) {
            // Token present but expired — clear and let user log in fresh.
            tokenStore.clear();
        }
        setLoading(false);
    }, []);

    // Listen for auth failures from the api client (refresh-token expiry).
    useEffect(() => {
        const unsubscribe = onAuthFailure(() => {
            setUser(null);
        });
        return unsubscribe;
    }, []);

    const loginPatient = useCallback(async (email: string, password: string) => {
        const data = await api.post<LoginResponse>(
            "/auth/login",
            { email, password },
            { skipAuth: true },
        );
        tokenStore.set(data.accessToken, data.refreshToken);
        const decoded = userFromToken(data.accessToken);
        if (!decoded) {
            tokenStore.clear();
            throw new Error("Invalid token received from server.");
        }
        if (decoded.role !== "PATIENT") {
            tokenStore.clear();
            throw new Error("This login is for patients only.");
        }
        setUser(decoded);
    }, []);

    const loginAdmin = useCallback(async (email: string, password: string) => {
        const data = await api.post<LoginResponse>(
            "/auth/admin/login",
            { email, password },
            { skipAuth: true },
        );
        tokenStore.set(data.accessToken, data.refreshToken);
        const decoded = userFromToken(data.accessToken);
        if (!decoded) {
            tokenStore.clear();
            throw new Error("Invalid token received from server.");
        }
        if (decoded.role !== "ADMIN") {
            tokenStore.clear();
            throw new Error("This login is for admins only.");
        }
        setUser(decoded);
    }, []);

    const logout = useCallback(() => {
        tokenStore.clear();
        setUser(null);
    }, []);

    const value = useMemo<AuthContextValue>(
        () => ({ user, loading, loginPatient, loginAdmin, logout }),
        [user, loading, loginPatient, loginAdmin, logout],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used inside <AuthProvider>");
    }
    return ctx;
}