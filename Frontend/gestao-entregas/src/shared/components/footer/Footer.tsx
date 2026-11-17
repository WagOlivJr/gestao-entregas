import "./Footer.css";

export function Footer() {
    return (
        <footer className="app-footer">
            <p className="footer-info">
                © {new Date().getFullYear()} - Supermercado ABC
            </p>
        </footer>
    );
}
