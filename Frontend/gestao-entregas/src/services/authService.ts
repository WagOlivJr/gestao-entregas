import api, {
    createIdempotencyKey,
    refreshSession,
    validateSession,
} from "./api";
import { HttpError } from "./HttpError";
import { clearSessionAcrossTabs, useAuthStore } from "../stores/authStore";
import type { AuthSession, LoginCredentials } from "../types/auth";
import { logoutFlagStorage } from "../utils/logoutFlagStorage";

export const authService = {
    async login(credentials: LoginCredentials) {
        useAuthStore.getState().invalidatePending();
        const revision = useAuthStore.getState().revision;
        const session = await api.post<AuthSession>(
            "/auth/login",
            credentials,
            {
                withCredentials: true,
                authenticated: false,
                refreshOn401Error: false,
                retry: false,
            },
        );
        validateSession(session);
        if (useAuthStore.getState().revision === revision) {
            useAuthStore.getState().setSession(session);
            logoutFlagStorage.clearLogoutFlag();
        }
    },
    refresh: refreshSession,
    async checkAuth() {
        if (useAuthStore.getState().initialized) return;

        if (logoutFlagStorage.hasLogoutFlag()) {
            useAuthStore.getState().finishBootUnauthenticated();
            return;
        }

        try {
            await refreshSession();
        } catch (error) {
            if (!(error instanceof HttpError && error.status === 401))
                throw error;
        }
    },
    async logout() {
        logoutFlagStorage.setLogoutFlag();

        const pending = api.post<void>("/auth/logout", undefined, {
            withCredentials: true,
            refreshOn401Error: false,
            retry: true,
            idempotencyKey: createIdempotencyKey(),
            fetchOptions: {
                keepalive: true,
            },
        });
        clearSessionAcrossTabs();
        await pending;
    },
};
