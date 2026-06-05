const BASE_URL =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api/v1";

// ─── Types ───────────────────────────────────────────────────

type Envelope<T> = {
    success: boolean;
    message: string;
    data: T;
    timestamp: string;
};

export class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}

// ─── Token storage ───────────────────────────────────────────

const ACCESS_TOKEN_KEY = "grovers_access_token";
const REFRESH_TOKEN_KEY = "grovers_refresh_token";

export const tokenStore = {
    getAccess(): string | null {
        return localStorage.getItem(ACCESS_TOKEN_KEY);
    },
    getRefresh(): string | null {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    },
    set(access: string, refresh: string): void {
        localStorage.setItem(ACCESS_TOKEN_KEY, access);
        localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
    },
    clear(): void {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    },
};

// ─── Refresh coordination ────────────────────────────────────

let refreshInFlight: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
    // If a refresh is already in progress, every caller awaits the same promise
    // rather than each firing its own request.
    if (refreshInFlight) return refreshInFlight;

    refreshInFlight = (async () => {
        const refreshToken = tokenStore.getRefresh();
        if (!refreshToken) return null;

        try {
            const res = await fetch(`${BASE_URL}/auth/refresh`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken }),
            });
            if (!res.ok) {
                tokenStore.clear();
                return null;
            }
            const envelope = (await res.json()) as Envelope<{
                accessToken: string;
                refreshToken: string;
            }>;
            if (!envelope.success) {
                tokenStore.clear();
                return null;
            }
            tokenStore.set(envelope.data.accessToken, envelope.data.refreshToken);
            return envelope.data.accessToken;
        } catch {
            tokenStore.clear();
            return null;
        } finally {
            refreshInFlight = null;
        }
    })();

    return refreshInFlight;
}

// ─── Auth-failure subscription ───────────────────────────────
// AuthContext subscribes so it can clear state and redirect when refresh fails.

type AuthFailureListener = () => void;
const authFailureListeners = new Set<AuthFailureListener>();

export function onAuthFailure(listener: AuthFailureListener): () => void {
    authFailureListeners.add(listener);
    return () => authFailureListeners.delete(listener);
}

function notifyAuthFailure(): void {
    authFailureListeners.forEach((l) => l());
}

// ─── Core request ────────────────────────────────────────────

type RequestOpts = {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
    /** When true, never attach Authorization header or attempt refresh. Used for login. */
    skipAuth?: boolean;
    /** Pre-built FormData for file uploads. When set, body is ignored. */
    formData?: FormData;
};

async function request<T>(path: string, opts: RequestOpts = {}): Promise<T> {
    const url = `${BASE_URL}${path}`;
    const headers: Record<string, string> = {};

    if (!opts.skipAuth) {
        const token = tokenStore.getAccess();
        if (token) headers.Authorization = `Bearer ${token}`;
    }

    let body: BodyInit | undefined;
    if (opts.formData) {
        body = opts.formData;
        // Don't set Content-Type — the browser sets multipart boundary automatically.
    } else if (opts.body !== undefined) {
        headers["Content-Type"] = "application/json";
        body = JSON.stringify(opts.body);
    }

    const res = await fetch(url, {
        method: opts.method ?? "GET",
        headers,
        body,
    });

    // 401 → try refresh + retry once, unless we're already on an auth endpoint.
    if (res.status === 401 && !opts.skipAuth) {
        const newToken = await refreshAccessToken();
        if (newToken) {
            const retryHeaders = { ...headers, Authorization: `Bearer ${newToken}` };
            const retryRes = await fetch(url, {
                method: opts.method ?? "GET",
                headers: retryHeaders,
                body,
            });
            return parseEnvelope<T>(retryRes);
        }
        // Refresh failed; auth is gone.
        notifyAuthFailure();
        throw new ApiError("Your session has expired. Please sign in again.", 401);
    }

    return parseEnvelope<T>(res);
}

async function parseEnvelope<T>(res: Response): Promise<T> {
    let envelope: Envelope<T>;
    try {
        envelope = (await res.json()) as Envelope<T>;
    } catch {
        throw new ApiError(
            res.ok
                ? "Unexpected response from server."
                : `Request failed (${res.status}).`,
            res.status,
        );
    }

    if (!envelope.success) {
        throw new ApiError(
            envelope.message || `Request failed (${res.status}).`,
            res.status,
        );
    }
    return envelope.data;
}

// ─── Public API ──────────────────────────────────────────────

export const api = {
    get: <T>(path: string) => request<T>(path),

    post: <T>(path: string, body?: unknown, opts?: Pick<RequestOpts, "skipAuth">) =>
        request<T>(path, { method: "POST", body, ...opts }),

    put: <T>(path: string, body?: unknown) =>
        request<T>(path, { method: "PUT", body }),

    patch: <T>(path: string, body?: unknown) =>
        request<T>(path, { method: "PATCH", body }),

    delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),

    // In src/lib/api.ts, inside the `api` const, add:

    /**
     * Downloads a file via authenticated request and triggers browser save.
     * `filename` is what the browser saves it as; backend's
     * Content-Disposition header is ignored.
     */
    downloadFile: async (path: string, filename: string): Promise<void> => {
        const token = tokenStore.getAccess();
        const headers: Record<string, string> = {};
        if (token) headers.Authorization = `Bearer ${token}`;

        const res = await fetch(`${BASE_URL}${path}`, { headers });

        if (res.status === 401) {
            const newToken = await refreshAccessToken();
            if (!newToken) {
                notifyAuthFailure();
                throw new ApiError("Your session has expired. Please sign in again.", 401);
            }
            const retryRes = await fetch(`${BASE_URL}${path}`, {
                headers: { Authorization: `Bearer ${newToken}` },
            });
            if (!retryRes.ok) {
                throw new ApiError(`Download failed (${retryRes.status}).`, retryRes.status);
            }
            return triggerDownload(retryRes, filename);
        }

        if (!res.ok) {
            throw new ApiError(`Download failed (${res.status}).`, res.status);
        }
        return triggerDownload(res, filename);
    },

    /**
     * Multipart upload. `extraFields` get appended to the FormData alongside the file.
     * Field name for the file defaults to "file" — pass `fileFieldName` to override.
     */
    upload: <T>(
        path: string,
        file: File,
        extraFields: Record<string, string> = {},
        fileFieldName: string = "file",
    ) => {
        const fd = new FormData();
        fd.append(fileFieldName, file);
        for (const [key, value] of Object.entries(extraFields)) {
            fd.append(key, value);
        }
        return request<T>(path, { method: "POST", formData: fd });
    },
};

async function triggerDownload(res: Response, filename: string): Promise<void> {
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}