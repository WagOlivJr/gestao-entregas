import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { useAuthStore } from "../stores/authStore";

export function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const authenticated = useAuthStore((state) => state.isAuthenticated);
    const authMessage = useAuthStore((state) => state.authMessage);
    const location = useLocation();
    const navigate = useNavigate();
    const destination: unknown = location.state?.returnTo;
    const returnTo = typeof destination === "string" && destination.startsWith("/")
        && !destination.startsWith("//") && !destination.includes("\\")
        && destination.split(/[?#]/)[0] !== "/login" ? destination : "/usuarios";

    useEffect(() => {
        let active = true;
        authService.checkAuth().catch((cause: unknown) => {
            if (active) setError(cause instanceof Error ? cause.message : "Falha ao verificar sessão.");
        });
        return () => { active = false; };
    }, []);

    useEffect(() => {
        if (authenticated) navigate(returnTo, { replace: true });
    }, [authenticated, navigate, returnTo]);

    return (
        <form onSubmit={async (event) => {
            event.preventDefault();
            if (pending) return;
            setPending(true);
            setError(null);
            try {
                await authService.login({ username, password });
            } catch (cause) {
                setError(cause instanceof Error ? cause.message : "Não foi possível entrar.");
            } finally {
                setPending(false);
            }
        }}>
            <h1>Entrar</h1>
            {authMessage && <p role="status">{authMessage}</p>}
            {error && <p role="alert">{error}</p>}
            <p><label>Usuário <input name="username" autoComplete="username" required
                value={username} onChange={(event) => setUsername(event.target.value)} /></label></p>
            <p><label>Senha <input name="password" type="password" autoComplete="current-password" required
                value={password} onChange={(event) => setPassword(event.target.value)} /></label></p>
            <button type="submit" disabled={pending}>{pending ? "Entrando..." : "Fazer login"}</button>
        </form>
    );
}
