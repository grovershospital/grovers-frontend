type JwtPayload = {
    sub?: string;
    role?: string;
    exp?: number;
    [key: string]: unknown;
};

/**
 * Decodes a JWT's payload without verifying its signature.
 * Used for routing decisions only — the server is the source of truth
 * for authorization.
 */
export function decodeJwtPayload(token: string): JwtPayload | null {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;
        const payload = parts[1];
        // base64url → base64
        const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
        const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
        const json = atob(padded);
        return JSON.parse(json) as JwtPayload;
    } catch {
        return null;
    }
}

export function isTokenExpired(token: string): boolean {
    const payload = decodeJwtPayload(token);
    if (!payload?.exp) return true;
    // exp is seconds since epoch; Date.now() is ms.
    return payload.exp * 1000 <= Date.now();
}