import { Link, NavLink } from "react-router-dom";
import "./NavBar.css";
import type { UserRole } from "../../entities/User";
import { LogoutButton } from "../logout/LogoutButton";

export interface NavLinkItem {
    path: string;
    label?: string;
    allowedRoles?: UserRole[];
}

export interface NavBarProps {
    links: NavLinkItem[];
}

export default function NavBar({ links }: NavBarProps) {
    return (
        <nav className="main-nav">
            <Link className="brand-container" to={"/"}>
                <img
                    src="/src/assets/logo.jpg"
                    alt="Logo do supermercado"
                    className="brand-logo"
                />
                <span className="brand-name--full">
                    Entregas - Supermercado ABC
                </span>
                <span className="brand-name--short">Entregas ABC</span>
            </Link>
            {links.map((link) => (
                <NavLink
                    key={link.path}
                    to={"/" + link.path}
                    className="nav-link"
                >
                    {link.label}
                </NavLink>
            ))}
            <LogoutButton />
        </nav>
    );
}
