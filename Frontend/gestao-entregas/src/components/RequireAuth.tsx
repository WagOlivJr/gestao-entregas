import { useEffect, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authService } from "../services/authService";
import { useAuthStore } from "../stores/authStore";
import { useShallow } from "zustand/shallow";
import type { UserRole } from "../entities/User";

export function RequireAuth({
    children,
    allowedRoles,
}: {
    children: ReactNode;
    allowedRoles?: UserRole[];
}) {
    const { initialized, authenticated, user } = useAuthStore(
        useShallow((state) => ({
            initialized: state.initialized,
            authenticated: state.isAuthenticated,
            user: state.user,
        })),
    );

    const location = useLocation();
    const [error, setError] = useState<string | null>(null);
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        let active = true;
        authService.checkAuth().catch((cause: unknown) => {
            if (active)
                setError(
                    cause instanceof Error
                        ? cause.message
                        : "Falha ao verificar sessão.",
                );
        });
        return () => {
            active = false;
        };
    }, [attempt]);

    if (!initialized) {
        return error ? (
            <div role="alert">
                <p>{error}</p>
                <button
                    onClick={() => {
                        setError(null);
                        setAttempt((value) => value + 1);
                    }}
                >
                    Tentar novamente
                </button>
            </div>
        ) : (
            <p role="status">Verificando sessão...</p>
        );
    }

    if (!authenticated) {
        return (
            <Navigate
                to="/login"
                replace
                state={{
                    returnTo:
                        location.pathname + location.search + location.hash,
                }}
            />
        );
    }

    if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
        return <Navigate to="home" replace />;
    }

    return children;
}
