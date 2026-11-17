import type { NavBarProps } from "../navBar/NavBar";
import NavBar from "../navBar/NavBar";
import { ScrollIndicator } from "../scrollIndicator/ScrollIndicator";
import "./Header.css";
import { useAuthStore } from "../../stores/authStore";
import { useShallow } from "zustand/shallow";

export function Header({ links }: NavBarProps) {
    const { authenticated, user } = useAuthStore(
        useShallow((state) => ({
            authenticated: state.isAuthenticated,
            user: state.user,
        })),
    );

    const avaliableLinks = links.filter(
        (link) =>
            !link.allowedRoles ||
            (user?.role && link.allowedRoles.includes(user.role)),
    );

    if (!authenticated) return <></>;

    return (
        <header className="page-header">
            <ScrollIndicator />
            <NavBar links={avaliableLinks} />
        </header>
    );
}
