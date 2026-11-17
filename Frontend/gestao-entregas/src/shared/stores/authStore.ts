import { create } from "zustand";
import type { AuthSession, AuthUser } from "../types/auth";

interface AuthState {
    token: string;
    user: AuthUser | null;
    isAuthenticated: boolean;
    expiresIn: number;
    initialized: boolean;
    authMessage: string | null;
    revision: number;
    setSession: (session: AuthSession) => void;
    clearSession: (message?: string) => void;
    invalidatePending: () => void;
    finishBootUnauthenticated: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    token: "",
    user: null,
    isAuthenticated: false,
    expiresIn: 0,
    initialized: false,
    authMessage: null,
    revision: 0,
    setSession: (session) =>
        set((state) => ({
            token: session.access_token,
            user: session.user,
            expiresIn: session.expires_in,
            isAuthenticated: true,
            initialized: true,
            authMessage: null,
            revision: state.revision + 1,
        })),
    clearSession: (message) =>
        set((state) => ({
            token: "",
            user: null,
            expiresIn: 0,
            isAuthenticated: false,
            initialized: true,
            authMessage: message ?? null,
            revision: state.revision + 1,
        })),
    invalidatePending: () => set((state) => ({ revision: state.revision + 1 })),
    finishBootUnauthenticated: () =>
        set((state) => ({ initialized: true, revision: state.revision + 1 })),
}));

const channel =
    typeof window !== "undefined" && typeof BroadcastChannel !== "undefined"
        ? new BroadcastChannel("auth")
        : null;

if (channel) {
    channel.onmessage = (event: MessageEvent<unknown>) => {
        if (
            typeof event.data === "object" &&
            event.data !== null &&
            "type" in event.data &&
            event.data.type === "SESSION_CLEARED"
        ) {
            useAuthStore
                .getState()
                .clearSession("Sessão encerrada em outra aba.");
        }
    };
}

export function clearSessionAcrossTabs(message?: string) {
    useAuthStore.getState().clearSession(message);
    channel?.postMessage({ type: "SESSION_CLEARED" });
}

if (import.meta.hot) import.meta.hot.dispose(() => channel?.close());
