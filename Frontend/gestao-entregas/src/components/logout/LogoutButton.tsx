import { authService } from "../../services/authService";
import "./LogoutButton.css";

export function LogoutButton() {
    return (
        <div className="nav-link nav-link_logout">
            <button className="logout-button" onClick={authService.logout}>
                <span className="logout-text">Sair do Sistema</span>
                <span
                    data-fallback="Sair"
                    className="fas fa-sign-out-alt logout-icon"
                ></span>
            </button>
        </div>
    );
}
